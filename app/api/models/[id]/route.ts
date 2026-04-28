import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { kv } from '@vercel/kv';

// Eliminamos explícitamente "export const runtime = 'edge'" para usar el motor Serverless (Node.js) estándar.
// Esto permite enviar el ArrayBuffer con Content-Length real y evitar el chunked transfer que rompe el caché.

// Constantes de configuración
const BUCKET_NAME = 'modelos_3d';
const RATE_LIMIT_EXPIRATION = 600; // 10 minutos en segundos
const BAN_EXPIRATION = 31536000; // 1 año en segundos
const MAX_REQUESTS = 20;
const MAX_VERCEL_PAYLOAD_SIZE = 4718592; // 4.5 MB en bytes

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ==========================================
    // PASO 1: Identificación y Extracción
    // ==========================================
    
    // Extraemos el id del archivo desde los parámetros dinámicos de la ruta
    const { id } = await params;
    if (!id) {
      return new NextResponse('ID del modelo no proporcionado', { status: 400 });
    }

    // Extraemos la IP del cliente
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // Extraemos el token de bypass
    const { searchParams } = new URL(request.url);
    const bypassToken = searchParams.get('bypass');
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isAdminBypass = bypassToken === process.env.ADMIN_BYPASS_TOKEN;
    const isBypassed = isDevelopment || isAdminBypass;

    // ==========================================
    // PASO 2: Rate Limiting (Vercel KV)
    // ==========================================
    
    if (!isBypassed) {
      const banKey = `banned_${ip}`;
      const rateLimitKey = `rate_limit_${ip}`;
      
      const isBanned = await kv.get(banKey);
      if (isBanned) {
        return new NextResponse('Acceso temporalmente suspendido', { status: 429 });
      }

      const count = await kv.incr(rateLimitKey);

      if (count === 1) {
        await kv.expire(rateLimitKey, RATE_LIMIT_EXPIRATION);
      } else if (count > MAX_REQUESTS) {
        await kv.set(banKey, 'true', { ex: BAN_EXPIRATION });
        await kv.sadd('banned_ips_list', ip);
        return new NextResponse('Límite de peticiones excedido. Acceso temporalmente suspendido', { status: 429 });
      }
    }

    // ==========================================
    // PASO 3: Fetch a Supabase
    // ==========================================
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Error interno: Faltan variables de entorno de Supabase.');
      return new NextResponse('Error de configuración del servidor', { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data, error } = await supabase.storage.from(BUCKET_NAME).createSignedUrl(id, 60);

    if (error || !data?.signedUrl) {
      return new NextResponse('Modelo no encontrado o inaccesible', { status: 404 });
    }

    // --- LOG DE AUDITORÍA DE EGRESS ---
    // Este log solo se imprimirá en consola si Vercel NO resolvió la petición desde la CDN (Caché Edge).
    // Si ves este log, significa que costó transferencia de salida en Supabase.
    console.log(`[SUPABASE FETCH] Descargando ${id} - Egress consumido`);

    let sourceResponse: Response;
    try {
      sourceResponse = await fetch(data.signedUrl);
    } catch (fetchError) {
      console.error('Error al realizar el fetch del archivo a Supabase:', fetchError);
      return new NextResponse('Error interno al obtener el origen del modelo', { status: 500 });
    }

    if (!sourceResponse.ok) {
      return new NextResponse('Error recuperando el modelo desde el origen', { status: 500 });
    }

    // Descargamos a memoria el archivo binario completo
    const arrayBuffer = await sourceResponse.arrayBuffer();

    // ==========================================
    // PASO 4: Validación de Límites de Vercel
    // ==========================================
    
    // Serverless Functions en Vercel tienen un límite duro de 4.5 MB para el body de respuesta.
    if (arrayBuffer.byteLength > MAX_VERCEL_PAYLOAD_SIZE) {
      console.error(`[ALERTA LÍMITE VERCEL] Modelo demasiado pesado: ${id} pesa ${arrayBuffer.byteLength} bytes (límite: 4718592). Abortando para evitar crash.`);
      return new NextResponse(`Error: El modelo ${id} excede el límite de 4.5 MB.`, { status: 500 });
    }

    // ==========================================
    // PASO 5: Construcción de Respuesta Caché Pura
    // ==========================================
    
    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', 'model/gltf-binary');
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    
    // Caché estricto para Vercel Edge Cache. 
    // s-maxage le dice a la CDN que lo guarde 1 año.
    // max-age=0 le dice al navegador del usuario que compruebe con el servidor siempre (o use cache busting).
    // immutable dice que el archivo no cambiará nunca mientras mantenga su URL (ideal si usas ?v=).
    responseHeaders.set('Cache-Control', 'public, max-age=0, s-maxage=31536000, immutable');
    
    // Custom header de auditoría para verificar en el Network Tab del navegador
    responseHeaders.set('X-FlavorSync-Origin', 'Supabase');

    // Devolver un Buffer nativo a Next.js (Serverless runtime) 
    // garantiza que envíe el body sin chunking y habilite a la CDN a interceptarlo.
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('Excepción no manejada en el proxy de modelos:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}
