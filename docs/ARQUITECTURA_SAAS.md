# Arquitectura SaaS Multi-Tenant

## Resumen

El menú ahora es una página pública y cacheada que se accede vía `/menu/[slug]`, sin requerir API key. La seguridad viene de que el backend filtra automáticamente por `client_id`.

## Base de Datos

### Tabla `clients` (Privada)
```
id (UUID, Primary Key)
client_slug (texto único, ej: 'comidas-felices')
client_api_key (texto, secreto)
client_name (texto, nombre visible)
```

### Tabla `dishes`
```
id
client_id (FK → clients.id)
name
price
category
category_priority
item_priority
is_active
description
... (otros campos)
```

**No hay** `client_slug` ni `client_api_key` en `dishes` — solo en `clients`.

---

## Flujo de la Página Pública (`/menu/[slug]`)

```
1. Usuario abre: https://tuapp.com/menu/comidas-felices
                                           ↑
                                    Este es el slug

2. Next.js Server Component ejecuta:
   - generateStaticParams() → pre-genera para todos los clientes en build
   - fetchMenuBySlug('comidas-felices') → obtiene el menú

3. fetchMenuBySlug:
   Paso 1: SELECT id FROM clients WHERE client_slug = 'comidas-felices'
   Paso 2: SELECT * FROM dishes WHERE client_id = 'uuid-xxx' AND is_active = true
   
4. Resultado cacheado indefinidamente en Vercel CDN
   Siguientes accesos: CDN sirve desde Edge (~50ms TTFB)

5. Si cambias items en BD:
   GET /api/revalidate?slug=comidas-felices&secret=xxx
   → Purga caché local
   → Próximo acceso regenera desde BD
```

---

## Archivos Creados

### `src/lib/supabase/admin.ts`
Singleton del cliente Supabase con SERVICE_ROLE_KEY. Reemplaza los 2 clientes duplicados.

```ts
import { supabaseAdmin } from '@/lib/supabase/admin';
// Úsalo en cualquier lado en lugar de crear múltiples createClient()
```

### `src/lib/menu/fetchMenu.ts`
Función que obtiene el menú con caché indefinido.

```ts
const menu = await fetchMenuBySlug('comidas-felices');
// Retorna { clientId, clientSlug, categories, totalItems, ... }
```

**Caché:**
- Primera llamada: toca Supabase
- Llamadas subsecuentes: Data Cache de Vercel (indefinido)
- Para purgar: `GET /api/revalidate?slug=comidas-felices&secret=xxx`

### `src/app/menu/[slug]/page.tsx`
Server Component que renderiza el menú públicamente.

```ts
export const dynamic = 'force-static';      // Renderización estática
export const revalidate = false;            // Caché indefinido

export async function generateStaticParams() {
  // Pre-genera /menu/comidas-felices, /menu/otro-cliente, etc.
}
```

### `src/components/MenuDisplay.tsx`
Client Component que muestra el menú visualmente con:
- Categorías
- Platos con precio, descripción
- Iconos (Vegan, Vegetarian, Gluten-free, Chef recommendation)
- Modal de detalle

### `src/components/ModelViewer.tsx`
Carga modelos 3D con `@google/model-viewer`.
- Se carga **dinámicamente** client-side
- **No afecta** el Server Component
- Si no hay path en `model_3d_path`, simplemente no se muestra

### `src/app/api/revalidate/route.ts`
Endpoint para purgar caché on-demand.

```bash
# Para revalidar comidas-felices
curl "https://tuapp.com/api/revalidate?slug=comidas-felices&secret=tu-secret"

# Respuesta:
{
  "revalidated": true,
  "slug": "comidas-felices",
  "timestamp": "2026-05-02T10:30:00Z"
}
```

**Protección:**
- Requiere `REVALIDATE_SECRET` (variable de entorno)
- Sin el secret correcto: retorna 401

---

## Flujo de Seguridad

### Página Pública (`/menu/[slug]`)
```
✅ SIN API KEY (público para comensales)
✅ El slug en la URL identifica el cliente
✅ Backend filtra automáticamente por client_id
→ Menú es público pero seguro
```

### Endpoint API Antiguo (`/api/[clientSlug]/menu`)
```
⚠️ REQUIERE X-API-Key header
⚠️ Se valida contra tabla clients
✅ Usa validateClient() actualizado
→ Mantiene compatibilidad con clientes/partners
```

---

## Variables de Entorno

```bash
# .env.local (no commitear)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
REVALIDATE_SECRET=mi-super-secret-para-revalidar
```

Ejemplo en `.env.example` (committed, sin valores reales).

---

## Caché y Rendimiento

### Cómo Vercel cachea

```
1er acceso a /menu/comidas-felices
  ↓ Next.js Server Component ejecuta
  ↓ fetchMenuBySlug() con unstable_cache y tags
  ↓ Data Cache de Vercel almacena (indefinido)
  ↓ Renderiza HTML estático
  ↓ CDN Edge cachea la página (~50ms TTFB)

2do acceso
  ↓ CDN sirve desde Edge (sin tocar servidor)
  ↓ TTFB ~20-50ms

Después de revalidar
  ↓ GET /api/revalidate?slug=comidas-felices
  ↓ Purga tags en Data Cache
  ↓ Purga ruta en ISR
  ↓ Próximo acceso regenera desde BD
```

### TTFB (Time To First Byte)

| Escenario | TTFB |
|-----------|------|
| 1er acceso | ~500ms (toca BD) |
| Accesos posteriores | ~20-50ms (CDN Edge) |
| Después de revalidar | ~500ms (regenera), luego ~20-50ms |

---

## Modelos 3D

### Ubicación
- Los archivos `.glb` deben estar en `public/models/`
- Ejemplo: `public/models/empanada.glb`

### En la BD
```
dishes.model_3d_path = '/models/empanada.glb'
```

### Carga
- **Server Component** (`page.tsx`) NO carga los modelos
- **Client Component** (`ModelViewer.tsx`) sí los carga
- Se cargan **después** del HTML (no bloquea TTFB)

### No rompe nada
```ts
// En MenuDisplay, es dinámico:
const ModelViewer = dynamic(() => import('@/components/ModelViewer'), {
  ssr: false,  // Ejecuta solo client-side
  loading: () => <Skeleton />
});

// Si model_3d_path es null → no se renderiza
{selectedDish.model_3d_path && <ModelViewer ... />}
```

---

## Para agregar un nuevo cliente

### En BD (Supabase)

1. **Crear fila en tabla `clients`:**
   ```sql
   INSERT INTO clients (client_slug, client_api_key, client_name)
   VALUES ('mi-restaurant', 'sk_live_mi_rest_xyz', 'Mi Restaurant');
   ```

2. **Asignar dishes:**
   ```sql
   UPDATE dishes
   SET client_id = (SELECT id FROM clients WHERE client_slug = 'mi-restaurant')
   WHERE id IN (1, 2, 3, ...); -- Los IDs de los platos
   ```

### En código
- **Nada que hacer**, Next.js pre-genera automáticamente
  - `generateStaticParams()` trae todos los slugs en build time
  - `/menu/mi-restaurant` se crea automáticamente

### En producción (Vercel)
```bash
# Rebuild + redeploy (o espera a que se ejecute automáticamente)
# Vercel detecta cambios en BD y regenera las páginas
```

---

## Troubleshooting

| Problema | Solución |
|----------|----------|
| `/menu/slug` muestra 404 | Verifica que existe en BD: `SELECT * FROM clients WHERE client_slug = 'slug'` |
| Menú no actualiza | Ejecuta: `GET /api/revalidate?slug=slug&secret=xxx` |
| Modelo 3D no carga | Verifica ruta en BD: `dishes.model_3d_path` |
| Revalidate retorna 401 | Verifica `REVALIDATE_SECRET` en env |
| TTFB muy lento | Espera a que CDN cachee (después de 1er acceso) |

