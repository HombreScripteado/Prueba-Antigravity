/**
 * GET /api/[clientSlug]/menu
 *
 * Endpoint de menú dinámico con validación multi-cliente
 *
 * Requerimientos:
 * - Header: X-API-Key (client_api_key)
 * - URL: /api/{client_slug}/menu
 *
 * Validación:
 * - Verifica que client_slug existe en BD
 * - Verifica que client_api_key coincide
 * - Retorna 401 si falla
 *
 * Caché:
 * - 24 horas en Vercel CDN
 * - Revalidación ISR
 */

import { validateClient } from '@/lib/auth/validateClient';
import { generateMenu } from '@/lib/menu/generateMenu';
import type { NextRequest } from 'next/server';

// ISR: Revalidar caché cada 24 horas
export const revalidate = 86400; // segundos

export async function GET(
  request: NextRequest,
  { params }: { params: { clientSlug: string } }
) {

  try {
    // Obtener API key del header
    const apiKey = request.headers.get('x-api-key');

    // 1️⃣ VALIDACIÓN DOBLE
    const validation = await validateClient(params.clientSlug, apiKey);

    if (!validation.success) {
      return new Response(
        JSON.stringify({
          error: validation.error,
          status: 'unauthorized'
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // 2️⃣ GENERAR MENÚ (validado para este cliente)
    const menu = await generateMenu(validation.clientId);

    // 3️⃣ RESPONDER CON CACHÉ
    return new Response(JSON.stringify(menu), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Vercel CDN: cachear 24 horas
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=31536000',
        // Indicador para debugging
        'X-Client-Slug': validation.clientSlug
      }
    });

  } catch (error) {
    console.error('Menu endpoint error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate menu',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
