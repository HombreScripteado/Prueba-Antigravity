# 🚀 Procedimiento: Implementación Multi-Cliente + Caché

**Vigente desde**: 2026-05-01

---

## 📋 Resumen

Implementar sistema seguro y cacheable de generación de menús para múltiples clientes.

**Fases:**
1. Validación de cliente (control doble)
2. Ordenamiento inteligente
3. Caché con Vercel ISR
4. Revalidación automática

---

## Phase 1: Validación Multi-Cliente

### 1.1 Crear función de validación

**Archivo**: `src/lib/auth/validateClient.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export interface ValidatedClient {
  clientId: string;
  clientSlug: string;
  success: boolean;
  error?: string;
}

export async function validateClient(
  clientSlug: string,
  apiKey: string | null
): Promise<ValidatedClient> {
  
  // Validación 1: Verificar que API key existe
  if (!apiKey) {
    return {
      clientId: '',
      clientSlug: '',
      success: false,
      error: 'Missing API key'
    };
  }

  try {
    // Consultar BD con ambos criterios
    const { data, error } = await supabase
      .from('dishes')
      .select('client_id, client_slug, client_api_key')
      .eq('client_slug', clientSlug)
      .eq('client_api_key', apiKey)
      .limit(1)
      .single();

    if (error || !data) {
      return {
        clientId: '',
        clientSlug: '',
        success: false,
        error: 'Invalid credentials'
      };
    }

    // Validación 2: Verificar que slug en BD coincide con slug en request
    if (data.client_slug !== clientSlug) {
      return {
        clientId: '',
        clientSlug: '',
        success: false,
        error: 'Slug mismatch'
      };
    }

    // ✅ Ambas validaciones pasaron
    return {
      clientId: data.client_id,
      clientSlug: data.client_slug,
      success: true
    };

  } catch (err) {
    return {
      clientId: '',
      clientSlug: '',
      success: false,
      error: 'Database error'
    };
  }
}
```

### 1.2 Implementar endpoint con validación

**Archivo**: `src/app/api/[clientSlug]/menu/route.ts`

```typescript
import { validateClient } from '@/lib/auth/validateClient';
import { generateMenu } from '@/lib/menu/generateMenu';
import type { NextRequest } from 'next/server';

// Revalidar caché cada 24 horas
export const revalidate = 86400; // segundos

export async function GET(
  request: NextRequest,
  { params }: { params: { clientSlug: string } }
) {
  
  // Obtener API key del header
  const apiKey = request.headers.get('x-api-key');

  // 1️⃣ VALIDACIÓN DOBLE
  const validation = await validateClient(params.clientSlug, apiKey);
  
  if (!validation.success) {
    return new Response(
      JSON.stringify({ error: validation.error }),
      { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // 2️⃣ GENERAR MENÚ (validado para este cliente)
  try {
    const menu = await generateMenu(validation.clientId);

    // 3️⃣ RESPONDER CON CACHÉ
    return new Response(JSON.stringify(menu), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Caché en Vercel: 24 horas, revalidación en background
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=31536000'
      }
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to generate menu' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
```

### 1.3 Test de validación

```bash
# ✅ Correcto - Con API key válida
curl -H "X-API-Key: sk_live_xxx" \
  https://tuapp.com/api/pizzeria-maria/menu

# ❌ Error 401 - Sin API key
curl https://tuapp.com/api/pizzeria-maria/menu

# ❌ Error 401 - API key inválida
curl -H "X-API-Key: wrong_key" \
  https://tuapp.com/api/pizzeria-maria/menu

# ❌ Error 401 - Slug no coincide
curl -H "X-API-Key: sk_live_xxx" \
  https://tuapp.com/api/wrong-slug/menu
```

---

## Phase 2: Ordenamiento Inteligente

### 2.1 Crear función de ordenamiento

**Archivo**: `src/lib/menu/orderItems.ts`

```typescript
import type { Dish } from '@/types';

export interface OrderedMenu {
  category: string;
  categoryPriority: number | null;
  items: Dish[];
}

/**
 * Ordena items por:
 * 1. Priority (ascendente, NULL al final)
 * 2. Si priority es NULL: created_at (ascendente)
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

  // Ordenar cada grupo
  const ordered = Object.entries(grouped).map(([category, items]) => {
    const sortedItems = items.sort((a, b) => {
      // Si ambos tienen priority: ordenar por priority
      if (a.item_priority !== null && b.item_priority !== null) {
        return a.item_priority - b.item_priority;
      }

      // Si solo 'a' tiene priority: 'a' va primero
      if (a.item_priority !== null) {
        return -1;
      }

      // Si solo 'b' tiene priority: 'b' va primero
      if (b.item_priority !== null) {
        return 1;
      }

      // Ambos sin priority: ordenar por fecha (más viejo primero)
      return new Date(a.created_at).getTime() - 
             new Date(b.created_at).getTime();
    });

    return {
      category,
      categoryPriority: items[0]?.category_priority || null,
      items: sortedItems
    };
  });

  // Ordenar categorías por priority
  return ordered.sort((a, b) => {
    // Ambas tienen priority
    if (a.categoryPriority !== null && b.categoryPriority !== null) {
      return a.categoryPriority - b.categoryPriority;
    }

    // Solo 'a' tiene priority
    if (a.categoryPriority !== null) {
      return -1;
    }

    // Solo 'b' tiene priority
    if (b.categoryPriority !== null) {
      return 1;
    }

    // Ambas sin priority: ordenar alfabético
    return a.category.localeCompare(b.category);
  });
}
```

### 2.2 Integrar en generación de menú

**Archivo**: `src/lib/menu/generateMenu.ts`

```typescript
import { orderMenuItems } from './orderItems';
import type { Dish } from '@/types';

export async function generateMenu(clientId: string) {
  
  try {
    // Obtener todos los platos del cliente
    const { data: dishes, error } = await supabase
      .from('dishes')
      .select('*')
      .eq('client_id', clientId)
      .eq('isActive', true); // Solo platos activos

    if (error || !dishes) {
      throw new Error('Failed to fetch dishes');
    }

    // Ordenar con inteligencia
    const menu = orderMenuItems(dishes);

    // Retornar estructura
    return {
      clientId,
      generatedAt: new Date().toISOString(),
      categories: menu,
      totalItems: dishes.length,
      totalCategories: menu.length
    };

  } catch (err) {
    throw new Error(`Menu generation failed: ${err.message}`);
  }
}
```

### 2.3 Test de ordenamiento

```typescript
// Test data
const testDishes: Dish[] = [
  { 
    category: 'Entrees',
    category_priority: 1,
    item_priority: 2,
    created_at: '2026-01-01',
    name: 'Pasta' 
  },
  { 
    category: 'Entrees',
    category_priority: 1,
    item_priority: 1,
    created_at: '2026-02-01',
    name: 'Pizza' 
  },
  { 
    category: 'Entrees',
    category_priority: 1,
    item_priority: null,
    created_at: '2026-03-01',
    name: 'Risotto' 
  },
  { 
    category: 'Desserts',
    category_priority: null,
    item_priority: null,
    created_at: '2026-01-01',
    name: 'Tiramisu' 
  }
];

const result = orderMenuItems(testDishes);

// Resultado esperado:
// Entrees (priority 1)
//   1. Pizza (priority 1)
//   2. Pasta (priority 2)
//   3. Risotto (priority null, created 2026-03-01)
// Desserts (priority null)
//   1. Tiramisu (priority null, created 2026-01-01)
```

---

## Phase 3: Caché Inteligente con Vercel

### 3.1 Configurar ISR

**En tu `next.config.js`:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitar ISR (Incremental Static Regeneration)
  experimental: {
    isrMemoryCacheSize: 50 * 1024 * 1024, // 50MB caché
  },
};

module.exports = nextConfig;
```

### 3.2 Headers de caché en endpoint

```typescript
// Ya implementado en route.ts, pero aquí está la explicación:

return new Response(JSON.stringify(menu), {
  headers: {
    'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=31536000'
    // ↑ Explicación:
    // public = cacheable por proxies públicos
    // s-maxage=86400 = cachear 24 horas en Vercel CDN
    // stale-while-revalidate=31536000 = servir stale 1 año mientras se regenera
  }
});
```

### 3.3 Monitoreo de caché

```bash
# Ver si respuesta está cacheada (en headers)
curl -I https://tuapp.com/api/pizzeria-maria/menu

# Busca "X-Vercel-Cache: HIT" (cacheado) o "MISS" (no cacheado)
```

---

## Phase 4: Revalidación Automática

### 4.1 Crear endpoint de revalidación

**Archivo**: `src/app/api/revalidate/route.ts`

```typescript
import { revalidatePath } from 'next/cache';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  
  // Verificar token secreto (seguridad)
  const revalidateToken = request.headers.get('x-revalidate-token');
  
  if (revalidateToken !== process.env.REVALIDATE_TOKEN) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { clientSlug } = await request.json();

    if (!clientSlug) {
      return new Response('Missing clientSlug', { status: 400 });
    }

    // Revalidar el caché específico del cliente
    revalidatePath(`/api/${clientSlug}/menu`);

    return Response.json(
      { revalidated: true, clientSlug },
      { status: 200 }
    );

  } catch (err) {
    return Response.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    );
  }
}
```

### 4.2 Revalidación desde Supabase (Webhook)

En Supabase → Database → Webhooks:

```
Event: INSERT, UPDATE, DELETE en tabla 'dishes'
Endpoint: https://tuapp.com/api/revalidate
Method: POST
Headers:
  x-revalidate-token: (tu REVALIDATE_TOKEN)

Payload:
{
  "clientSlug": "{{ .record.client_slug }}"
}
```

### 4.3 Test de revalidación

```bash
# Llamar manualmente al endpoint
curl -X POST https://tuapp.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "X-Revalidate-Token: tu_token" \
  -d '{"clientSlug": "pizzeria-maria"}'

# Respuesta:
# { "revalidated": true, "clientSlug": "pizzeria-maria" }
```

---

## ✅ Checklist de Implementación

### Fase 1: Validación
- [ ] Función `validateClient()` creada
- [ ] Endpoint dinámico implementado
- [ ] Valida client_slug
- [ ] Valida client_api_key
- [ ] Retorna 401 si falla
- [ ] Tests manuales pasan

### Fase 2: Ordenamiento
- [ ] Función `orderMenuItems()` creada
- [ ] Ordena por priority (ascendente)
- [ ] Items NULL van al final por created_at
- [ ] Categorías también ordenadas
- [ ] Tests con datos de ejemplo pasan

### Fase 3: Caché
- [ ] Headers de caché configurados
- [ ] Vercel ISR habilitado
- [ ] Prueba: segunda solicitud es más rápida
- [ ] Caché persiste 24 horas
- [ ] Monitor de tokens muestra savings

### Fase 4: Revalidación
- [ ] Endpoint de revalidación implementado
- [ ] Webhook de Supabase configurado
- [ ] Revalidación manual funciona
- [ ] Caché se limpia al actualizar BD
- [ ] Sin egress después de revalidación

---

## 📊 Métricas a Monitorear

```bash
# Ejecutar health check después de cada fase
node .claude-flow/metrics/health-check.js

# Buscar:
# ✅ Ahorro de tokens: debe estar en 60%+
# ✅ Brain sincronizado: debe estar en YES
# ✅ Caché activo: debe mostrar HIT después de 2a solicitud
```

---

## ⚠️ Restricciones de Modularidad

**CRÍTICO**: Mantener compatibilidad

✅ **Permitido**
- Agregar nuevos campos a `validateClient()`
- Extender reglas de ordenamiento
- Agregar nuevas categorías

❌ **Prohibido**
- Cambiar parámetros de `validateClient()`
- Cambiar estructura de respuesta
- Modificar headers de caché (clientes existentes esperan el formato)

---

## 🔗 Referencias

- **Validación**: `src/lib/auth/validateClient.ts`
- **Generación**: `src/lib/menu/generateMenu.ts`
- **Ordenamiento**: `src/lib/menu/orderItems.ts`
- **Endpoint**: `src/app/api/[clientSlug]/menu/route.ts`
- **Revalidación**: `src/app/api/revalidate/route.ts`

---

*Vigente desde: 2026-05-01*
