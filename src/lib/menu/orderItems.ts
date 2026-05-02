/**
 * Ordenamiento inteligente de items y categorías
 *
 * Regla:
 * 1. Items CON priority (1, 2, 3...) → primero (ascendente)
 * 2. Items SIN priority (NULL) → último (por created_at ascendente)
 * 3. Categorías también se ordenan igual
 */

export interface Dish {
  id: string;
  name: string;
  price: number;
  category: string;
  category_priority: number | null;
  item_priority: number | null;
  created_at: string;
  isActive: boolean;
  description?: string;
  [key: string]: any;
}

export interface OrderedMenu {
  category: string;
  categoryPriority: number | null;
  items: Dish[];
}

/**
 * Ordena items dentro de cada categoría
 * Priority definida: primero (ascendente)
 * Priority NULL: último (por fecha)
 */
function orderItemsInCategory(items: Dish[]): Dish[] {
  return items.sort((a, b) => {
    // Ambos tienen priority
    if (a.item_priority !== null && b.item_priority !== null) {
      return a.item_priority - b.item_priority;
    }

    // Solo 'a' tiene priority → va primero
    if (a.item_priority !== null) {
      return -1;
    }

    // Solo 'b' tiene priority → va primero
    if (b.item_priority !== null) {
      return 1;
    }

    // Ambos sin priority → ordenar por fecha (más viejo primero)
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateA - dateB;
  });
}

/**
 * Agrupa y ordena platos por categoría
 */
export function orderMenuItems(dishes: Dish[]): OrderedMenu[] {

  // Agrupar por categoría
  const grouped = dishes.reduce((acc, dish) => {
    if (!acc[dish.category]) {
      acc[dish.category] = [];
    }
    acc[dish.category].push(dish);
    return acc;
  }, {} as Record<string, Dish[]>);

  // Procesar cada grupo
  const ordered = Object.entries(grouped).map(([category, items]) => {
    return {
      category,
      categoryPriority: items[0]?.category_priority || null,
      items: orderItemsInCategory(items)
    };
  });

  // Ordenar categorías: priority primero, NULL al final
  return ordered.sort((a, b) => {
    // Ambas tienen priority
    if (a.categoryPriority !== null && b.categoryPriority !== null) {
      return a.categoryPriority - b.categoryPriority;
    }

    // Solo 'a' tiene priority → va primero
    if (a.categoryPriority !== null) {
      return -1;
    }

    // Solo 'b' tiene priority → va primero
    if (b.categoryPriority !== null) {
      return 1;
    }

    // Ambas sin priority → ordenar alfabético
    return a.category.localeCompare(b.category);
  });
}
