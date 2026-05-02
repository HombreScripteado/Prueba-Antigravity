import { revalidateTag, revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const slug = request.nextUrl.searchParams.get('slug');

  // Validar secret
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: 'Invalid revalidation secret' },
      { status: 401 }
    );
  }

  // Validar que slug sea proporcionado
  if (!slug) {
    return NextResponse.json(
      { error: 'Slug parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Purgar caché por tag
    revalidateTag(`menu-${slug.toLowerCase()}`);
    revalidateTag('menu');

    // Purgar ruta estática
    revalidatePath(`/menu/${slug}`);

    return NextResponse.json(
      {
        revalidated: true,
        slug,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Revalidation failed'
      },
      { status: 500 }
    );
  }
}
