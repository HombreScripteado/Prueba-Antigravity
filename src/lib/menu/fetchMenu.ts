import { unstable_cache } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { orderMenuItems, type OrderedMenu, type Dish } from '@/lib/menu/orderItems';

export interface MenuData {
  clientId: string;
  clientSlug: string;
  clientName: string;
  categories: OrderedMenu[];
  totalItems: number;
  totalCategories: number;
  generatedAt: string;
}

async function fetchMenuUncached(slug: string): Promise<MenuData | null> {
  // PASO 1: Obtener cliente por slug
  const { data: clientData, error: clientError } = await supabaseAdmin
    .from('clients')
    .select('id, client_slug, client_name')
    .eq('client_slug', slug)
    .limit(1)
    .single();

  if (clientError || !clientData) {
    return null;
  }

  // PASO 2: Obtener dishes del cliente
  const { data: dishes, error: dishError } = await supabaseAdmin
    .from('dishes')
    .select('*')
    .eq('client_id', clientData.id)
    .eq('is_active', true)
    .order('category_priority', { ascending: true, nullsLast: true })
    .order('item_priority', { ascending: true, nullsLast: true });

  if (dishError || !dishes) {
    return null;
  }

  if (dishes.length === 0) {
    return {
      clientId: clientData.id,
      clientSlug: clientData.client_slug,
      clientName: clientData.client_name,
      categories: [],
      totalItems: 0,
      totalCategories: 0,
      generatedAt: new Date().toISOString()
    };
  }

  // Ordenar con lógica inteligente
  const orderedMenu = orderMenuItems(dishes as Dish[]);

  return {
    clientId: clientData.id,
    clientSlug: clientData.client_slug,
    clientName: clientData.client_name,
    categories: orderedMenu,
    totalItems: dishes.length,
    totalCategories: orderedMenu.length,
    generatedAt: new Date().toISOString()
  };
}

// Función cacheada que se reutiliza en Server Components
export const fetchMenuBySlug = unstable_cache(
  async (slug: string) => fetchMenuUncached(slug),
  ['menu-fetch'],
  {
    tags: ['menu'],
    revalidate: false // Caché indefinido
  }
);
