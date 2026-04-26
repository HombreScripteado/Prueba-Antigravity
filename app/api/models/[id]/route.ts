import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { kv } from '@vercel/kv';

// Especificamos explícitamente el uso de Edge Runtime para baja latencia
export const runtime = 'edge';

// Constantes de configuración
const BUCKET_NAME = 'modelos_3d';
const RATE_LIMIT_EXPIRATION = 600; // 10 minutos en segundos
const BAN_EXPIRATION = 31536000; // 1 año en segundos
const MAX_REQUESTS = 20;

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

    // Extraemos la IP del cliente (priorizamos x-forwarded-for y tomamos la primera si hay múltiples)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // Extraemos la URL y sus parámetros de búsqueda para obtener el token bypass
    const { searchParams } = new URL(request.url);
    const bypassToken = searchParams.get('bypass');

    // ==========================================
    // PASO 2: Lógica de Bypass (Llave Maestra)
    // ==========================================
    
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isAdminBypass = bypassToken === process.env.ADMIN_BYPASS_TOKEN;
    
    // Evaluamos si debemos saltarnos los controles de seguridad
    const isBypassed = isDevelopment || isAdminBypass;

    // ==========================================
    // PASO 3: Rate Limiting y Ban de 1 año (Vercel KV)
    // ==========================================
    
    if (!isBypassed) {
      const banKey = `banned_${ip}`;
      const rateLimitKey = `rate_limit_${ip}`;

      // Verificamos si la IP ya tiene una clave de bloqueo temporal
      const isBanned = await kv.get(banKey);
      if (isBanned) {
        return new NextResponse('Acceso temporalmente suspendido', { status: 429 });
      }

      // Incrementamos el contador de peticiones para esta IP
      const count = await kv.incr(rateLimitKey);

      if (count === 1) {
        // Si es la primera petición, configuramos una expiración de 10 minutos (600s)
        await kv.expire(rateLimitKey, RATE_LIMIT_EXPIRATION);
      } else if (count > MAX_REQUESTS) {
        // Si superó las 20 peticiones, castigamos la IP creando la clave de bloqueo por 1 año
        await kv.set(banKey, 'true', { ex: BAN_EXPIRATION });
        
        // Extra: Añadimos la IP a un Set global en KV para poder listar y administrar los baneos fácilmente.
        // Con esto podrás consultar qué IPs están baneadas desde el dashboard o con: await kv.smembers('banned_ips_list')
        await kv.sadd('banned_ips_list', ip);

        return new NextResponse('Límite de peticiones excedido. Acceso temporalmente suspendido', { status: 429 });
      }
    }

    // ==========================================
    // PASO 4: Omitido
    // ==========================================

    // ==========================================
    // PASO 5: Interacción con Supabase (Service Role)
    // ==========================================
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Error interno: Faltan variables de entorno de Supabase.');
      return new NextResponse('Error de configuración del servidor', { status: 500 });
    }

    // Inicializamos el cliente con la clave maestra (Service Role Key) para saltar el RLS
    // Deshabilitamos las funciones de persistencia de sesión porque es un uso server-side
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });

    // Generamos la firma con expiración de 60 segundos para proteger el archivo
    const { data, error } = await supabase
      .storage
      .from(BUCKET_NAME)
      .createSignedUrl(id, 60);

    if (error || !data?.signedUrl) {
      console.error(`Error generando URL firmada para ${id}:`, error);
      return new NextResponse('Modelo no encontrado o inaccesible', { status: 404 });
    }

    // ==========================================
    // PASO 6: Fetch y Proxy Stream
    // ==========================================
    
    let sourceResponse: Response;
    try {
      sourceResponse = await fetch(data.signedUrl);
    } catch (fetchError) {
      console.error('Error al realizar el fetch del archivo a Supabase:', fetchError);
      return new NextResponse('Error interno al obtener el origen del modelo', { status: 500 });
    }

    if (!sourceResponse.ok) {
      console.error(`Error en la respuesta origen de Supabase: ${sourceResponse.status}`);
      return new NextResponse('Error recuperando el modelo desde el origen', { status: 500 });
    }

    // ==========================================
    // PASO 7: Construcción de Respuesta y Caché Infinita
    // ==========================================
    
    // Recuperamos headers del origen
    const contentType = sourceResponse.headers.get('content-type') || 'model/gltf-binary';
    const contentLength = sourceResponse.headers.get('content-length');

    // Preparamos los headers de respuesta
    const responseHeaders: Record<string, string> = {
      'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': contentType,
    };

    // Vercel Edge Cache EXIGE el Content-Length para cachear la respuesta.
    // Si no lo pasamos, Vercel asume "Transfer-Encoding: chunked" y deshabilita el caché.
    if (contentLength) {
      responseHeaders['Content-Length'] = contentLength;
    }

    // Retornamos el body (que es un stream) directamente en la respuesta.
    return new NextResponse(sourceResponse.body, {
      status: 200,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('Excepción no manejada en el proxy de modelos:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}
