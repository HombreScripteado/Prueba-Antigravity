/**
 * Generación de menú para un cliente específico
 * Obtiene platos de Supabase, los ordena y retorna estructura formateada
 */

import { createClient } from '@supabase/supabase-js';
import { orderMenuItems, type Dish } from './orderItems';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export interface MenuResponse {
  clientId: string;
  generatedAt: string;
  categories: Array<{
    category: string;
    categoryPriority: number | null;
    items: Dish[];
  }>;
  totalItems: number;
  totalCategories: number;
}

/**
 * Genera menú para un cliente
 * @param clientId - UUID del cliente
 * @returns Menú ordenado y formateado
 */
export async function generateMenu(clientId: string): Promise<MenuResponse> {
  try {
    // Obtener platos del cliente (solo activos)
    const { data: dishes, error } = await supabase
      .from('dishes')
      .select('*')
      .eq('client_id', clientId)
      .eq('isActive', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase fetch error:', error);
      throw new Error('Failed to fetch dishes from database');
    }

    if (!dishes || dishes.length === 0) {
      return {
        clientId,
        generatedAt: new Date().toISOString(),
        categories: [],
        totalItems: 0,
        totalCategories: 0
      };
    }

    // Ordenar platos (por categoría y prioridad)
    const orderedMenu = orderMenuItems(dishes as Dish[]);

    return {
      clientId,
      generatedAt: new Date().toISOString(),
      categories: orderedMenu,
      totalItems: dishes.length,
      totalCategories: orderedMenu.length
    };

  } catch (err) {
    console.error('Menu generation error:', err);
    throw new Error(`Failed to generate menu: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}
