// Mapeo de slugs de cliente a UUIDs de Supabase
export const CLIENT_MAPPING: Record<string, { id: string; name: string }> = {
  'comidas-felices': {
    id: '48c7cb61-c6e6-46bb-b2a5-1373534a57e9',
    name: 'Comidas Felices',
  },
  // Agregar más clientes aquí
}

export function getClientBySlug(slug: string) {
  return CLIENT_MAPPING[slug]
}

export function generateStaticParams() {
  return Object.keys(CLIENT_MAPPING).map((slug) => ({
    client_slug: slug,
  }))
}
