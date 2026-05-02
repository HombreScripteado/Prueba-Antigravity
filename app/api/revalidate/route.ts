import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // 1. Leemos la URL para buscar la contraseña secreta
        const url = new URL(request.url);
        const secret = url.searchParams.get('secret');

        // 2. Si la contraseña no coincide, bloqueamos la puerta (Error 401: No autorizado)
        if (secret !== 'ardinner_secreto_2026') {
            return NextResponse.json({ error: 'Acceso denegado. Contraseña incorrecta.' }, { status: 401 });
        }

        // 3. Si tiene la contraseña correcta, limpiamos la caché
        revalidatePath('/', 'layout');
        return NextResponse.json({ revalidated: true, mensaje: "Menú actualizado de forma segura" });

    } catch (err) {
        return NextResponse.json({ error: 'Error al limpiar caché' }, { status: 500 });
    }
}