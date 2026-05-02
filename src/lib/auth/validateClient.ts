/**
 * Validación doble de cliente
 * 1. Verificar que client_slug existe en BD
 * 2. Verificar que client_api_key coincide
 * Ambas validaciones deben pasar
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

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
    // Validación 2: Verificar que ambas credenciales coinciden en BD
    const { data, error } = await supabase
      .from('dishes')
      .select('client_id, client_slug, client_api_key')
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

    // Validación 3: Verificar que slug en BD coincide con slug en request
    if (data.client_slug !== clientSlug) {
      return {
        clientId: '',
        clientSlug: '',
        success: false,
        error: 'Slug validation failed'
      };
    }

    // ✅ Ambas validaciones pasaron
    return {
      clientId: data.client_id,
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
