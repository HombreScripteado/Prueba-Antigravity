import { supabase } from "./supabase"

export type DishRecord = {
  id: string
  name: string
  description: string | null
  price: number
  hasAR: boolean
  chefRecommendation: boolean
  isVegetarian: boolean
  isGlutenFree: boolean
  isVegan: boolean
  category_id: string
  category_name: string
  category_subtitle: string | null
  section_title: string
}

export type MenuSection = {
  title: string
  items: DishRecord[]
}

export type MenuCategory = {
  id: string
  name: string
  subtitle: string | null
  sections: MenuSection[]
}

export type FullMenu = {
  categories: MenuCategory[]
}

export async function getFullMenu(): Promise<FullMenu | null> {
  if (!supabase) {
    console.warn("Supabase client is not initialized (missing environment variables). Returning empty menu.")
    return { categories: [] }
  }

  // Consultar todos los platos de la base de datos
  const { data: dishes, error } = await supabase
    .from("dishes")
    .select("*")
    // Opcional: podrías ordenar por un campo, como category_id o id
    .order("category_id")

  if (error || !dishes) {
    console.error("Error al obtener platos de Supabase:", error)
    return null
  }

  // Agrupar platos por categoría y sección
  const categoriesMap = new Map<string, MenuCategory>()

  // Fallback de subtítulos por si la base de datos los tiene vacíos
  const SUBTITLE_FALLBACKS: Record<string, string> = {
    "comidas": "PLATOS PRINCIPALES Y ENTRANTES",
    "bebidas": "VINOS, CÓCTELES Y MÁS",
    "postres": "DULCES TENTACIONES",
    "entradas": "PARA EMPEZAR"
  }

  for (const dish of (dishes as DishRecord[])) {
    // Si la DB tiene nulos en category_id por alguna razón, se omite o agrupa genéricamente.
    const catId = dish.category_id || "otros"
    
    if (!categoriesMap.has(catId)) {
      categoriesMap.set(catId, {
        id: catId,
        name: dish.category_name || "Otros Platos",
        subtitle: dish.category_subtitle || SUBTITLE_FALLBACKS[catId] || "",
        sections: []
      })
    }

    const category = categoriesMap.get(catId)!
    const secTitle = dish.section_title || "Menú General"

    let section = category.sections.find(s => s.title === secTitle)
    if (!section) {
      section = { title: secTitle, items: [] }
      category.sections.push(section)
    }

    section.items.push(dish)
  }

  return {
    categories: Array.from(categoriesMap.values())
  }
}

export async function getMenuByClientId(clientId: string): Promise<FullMenu | null> {
  if (!supabase) {
    console.warn("Supabase client is not initialized (missing environment variables). Returning empty menu.")
    return { categories: [] }
  }

  const { data: dishes, error } = await supabase
    .from("dishes")
    .select("*")
    .eq("client_id", clientId)
    .order("category_id")

  if (error || !dishes) {
    console.error(`Error al obtener platos del cliente ${clientId}:`, error)
    return null
  }

  const categoriesMap = new Map<string, MenuCategory>()

  const SUBTITLE_FALLBACKS: Record<string, string> = {
    "comidas": "PLATOS PRINCIPALES Y ENTRANTES",
    "bebidas": "VINOS, CÓCTELES Y MÁS",
    "postres": "DULCES TENTACIONES",
    "entradas": "PARA EMPEZAR"
  }

  for (const dish of (dishes as DishRecord[])) {
    const catId = dish.category_id || "otros"

    if (!categoriesMap.has(catId)) {
      categoriesMap.set(catId, {
        id: catId,
        name: dish.category_name || "Otros Platos",
        subtitle: dish.category_subtitle || SUBTITLE_FALLBACKS[catId] || "",
        sections: []
      })
    }

    const category = categoriesMap.get(catId)!
    const secTitle = dish.section_title || "Menú General"

    let section = category.sections.find(s => s.title === secTitle)
    if (!section) {
      section = { title: secTitle, items: [] }
      category.sections.push(section)
    }

    section.items.push(dish)
  }

  return {
    categories: Array.from(categoriesMap.values())
  }
}
