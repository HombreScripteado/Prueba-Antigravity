/**
 * Validación doble de cliente
 * 1. Verificar que client_slug existe en tabla clients
 * 2. Verificar que client_api_key coincide
 * Ambas validaciones deben pasar
 */

import { supabaseAdmin } from '@/lib/supabase/admin';

export interface ValidatedClient {
  clientId: string;
  clientSlug: string;
  success: boolean;
  error?: string;
}

/**
 * Valida cliente con doble verificación
 * @param clientSlug - slug en URL (ej: pizzeria-maria)
 * @param apiKey - API key en header (ej: sk_live_maria_key)
 * @returns { clientId, success } o { error, success: false }
 */
export async function validateClient(
  clientSlug: string,
  apiKey: string | null
): Promise<ValidatedClient> {

  // Validación 1: API key presente
  if (!apiKey) {
    return {
      clientId: '',
      clientSlug: '',
      success: false,
      error: 'Missing API key in header'
    };
  }

  try {
    // Validación 2: Buscar cliente en tabla clients
    const { data, error } = await supabaseAdmin
      .from('clients')
      .select('id, client_slug, client_api_key')
      .eq('client_slug', clientSlug)
      .eq('client_api_key', apiKey)
      .limit(1)
      .single();

    if (error || !data) {
      return {
        clientId: '',
        clientSlug: '',
        success: false,
        error: 'Invalid credentials: client_slug or client_api_key mismatch'
      };
    }

    // ✅ Ambas validaciones pasaron
    return {
      clientId: data.id,
      clientSlug: data.client_slug,
      success: true
    };

  } catch (err) {
    console.error('Validation error:', err);
    return {
      clientId: '',
      clientSlug: '',
      success: false,
      error: 'Database validation error'
    };
  }
}
