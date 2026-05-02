"use server"

import { supabase } from "@/lib/supabase"

// Defines a result pattern so frontend deals with data or explicit error objects
export async function getARModelSignedUrl(dishId: string): Promise<
  | { success: true; url: string; diagnostic?: null }
  | { success: false; diagnostic: string }
> {
  try {
    // 1. Fetch dish from DB to get the path
    const { data: dishData, error: dbError } = await supabase
      .from("dishes")
      .select("model_3d_path")
      .eq("id", dishId)
      .single()

    if (dbError || !dishData?.model_3d_path) {
      const diagnostic = `getARModelSignedUrl: Dish query failed or model_3d_path empty for dish_id ${dishId}. DB Error: ${dbError?.message}`
      await recordARError(dishId, diagnostic)
      return { success: false, diagnostic }
    }

    const { model_3d_path } = dishData

    // 2. Devolvemos la ruta de nuestra API proxy en Vercel para que Edge lo cachee.
    // Pasamos el path exacto para que el endpoint de API se encargue de firmar y streamear.
    const proxyUrl = `/api/models/${encodeURIComponent(model_3d_path)}`

    return { success: true, url: proxyUrl }
  } catch (error: any) {
    const diagnostic = `getARModelSignedUrl: Unexpected runtime error for dish_id ${dishId}. Details: ${error?.message}`
    await recordARError(dishId, diagnostic)
    return { success: false, diagnostic }
  }
}

export async function recordARView(dishId: string, durationSeconds: number) {
  try {
    // Silently insert the view metric
    const { error } = await supabase.from("view_metrics").insert({
      dish_id: dishId,
      view_time_seconds: Math.floor(durationSeconds),
    })

    if (error) {
       console.error(`Failed to record AR view metric for ${dishId}:`, error.message)
    }
  } catch (e) {
    console.error("Unexpected error in recordARView:", e)
  }
}

export async function recordARError(dishId: string, diagnosticMessage: string) {
  try {
    // Insert into load_errors table
    const { error } = await supabase.from("load_errors").insert({
      dish_id: dishId,
      error_diagnostic: diagnosticMessage,
    })

    if (error) {
       console.error(`Failed to record AR error for ${dishId}:`, error.message)
    }
  } catch (e) {
    console.error("Unexpected error in recordARError:", e)
  }
}
