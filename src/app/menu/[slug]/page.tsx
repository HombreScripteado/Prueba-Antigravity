import { notFound } from 'next/navigation';
import { fetchMenuBySlug } from '@/lib/menu/fetchMenu';
import MenuDisplay from '@/components/MenuDisplay';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-static';
export const revalidate = false;

interface MenuPageParams {
  params: {
    slug: string;
  };
}

// Pre-generar páginas estáticas para todos los clientes en build time
export async function generateStaticParams() {
  try {
    const { data: clients } = await supabaseAdmin
      .from('clients')
      .select('client_slug');

    return (clients ?? []).map(client => ({
      slug: client.client_slug
    }));
  } catch {
    return [];
  }
}

// Generar metadata dinámica
export async function generateMetadata({ params }: MenuPageParams) {
  const menu = await fetchMenuBySlug(params.slug);

  if (!menu) {
    return {
      title: 'Menú no encontrado',
      description: 'Este menú no existe'
    };
  }

  return {
    title: `${menu.clientName} - Menú AR`,
    description: `Menú interactivo de ${menu.clientName} con ${menu.totalItems} platos`,
    openGraph: {
      title: `${menu.clientName} - Menú AR`,
      description: `Menú con ${menu.totalItems} platos disponibles`,
      type: 'website'
    }
  };
}

export default async function MenuPage({ params }: MenuPageParams) {
  const menu = await fetchMenuBySlug(params.slug);

  if (!menu) {
    notFound();
  }

  return <MenuDisplay menu={menu} />;
}
