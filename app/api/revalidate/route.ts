import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // Esto le dice a Vercel: "Borrá la caché de todas las páginas y leé Supabase de nuevo"
        revalidatePath('/', 'layout');
        return NextResponse.json({ revalidated: true, mensaje: "Menú actualizado al instante" });
    } catch (err) {
        return NextResponse.json({ error: 'Error al limpiar caché' }, { status: 500 });
    }
}