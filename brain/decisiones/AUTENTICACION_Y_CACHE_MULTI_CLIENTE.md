# ⚖️ Decisión: Autenticación Multi-Cliente + Caching

**Vigente desde**: 2026-05-01  
**Criticidad**: 🔴 CRÍTICA - Afecta seguridad y performance

---

## 🎯 Objetivo

Implementar sistema seguro multi-cliente con caché inteligente que:
1. ✅ Autentica cada cliente de forma segura (control doble)
2. ✅ Ordena items y categorías por prioridad + fecha
3. ✅ Cachea en Vercel para evitar egresos innecesarios
4. ✅ Regenera solo cuando BD del cliente cambia

---

## 📋 Requisitos Funcionales

### 1. Autenticación Multi-Cliente (Control Doble)

**Columnas en tabla `dishes`:**
- `client_id` - Identificador único del cliente
- `client_slug` - Slug único para URLs
- `client_api_key` - Token secreto del cliente

**Validación requerida:**
```
Header request (client_slug, client_api_key)
    ↓
Consulta a BD: SELECT * WHERE client_id = ? AND client_api_key = ?
    ↓
Si no coincide → 401 Unauthorized
Si coincide → Proceder con datos del cliente
```

**Control doble significa:**
- Validación 1: Verificar que API key coincida con client_id
- Validación 2: Verificar que client_slug coincida en URL
- Ambas deben pasar

### 2. Ordenamiento: Priority + Fecha

**Regla de Orden:**

```
1. Items CON priority (1, 2, 3...)
   Ordenados: ASC por priority
   
2. Items SIN priority (NULL)
   Ordenados: ASC por created_at (fecha creación)
```

**Ejemplo Concreto:**

| Plato | Priority | Created_at | Posición |
|-------|----------|-----------|----------|
| A | 1 | 2025-01-01 | 1 |
| B | 2 | 2026-01-01 | 2 |
| C | NULL | 2026-06-01 | 3 |
| D | NULL | 2025-12-01 | 4 |

Orden final: **A, B, D, C**

**Implementación SQL:**
```sql
ORDER BY 
  CASE WHEN priority IS NOT NULL THEN 0 ELSE 1 END,
  COALESCE(priority, 999999),
  created_at ASC
```

### 3. Caché Inteligente con Vercel (CRÍTICO)

**Flujo de Caché:**

```
Request del cliente
    ↓
¿Cache de este cliente existe y es válido?
    ├─ SÍ → Retorna cache (0 egress)
    └─ NO → Consulta BD
           ↓
           Genera menú con ordenamiento
           ↓
           Cachea en Vercel
           ↓
           Retorna menú
```

**Clave de Caché:**
```
`menu-${client_slug}-${hash(configuracion)}`
```

**Duración de Caché:**
- 24 horas (o hasta que haya cambio en BD)
- Revalidación manual si hay cambios

**Revalidación Automática:**
```
Si hay UPDATE/INSERT/DELETE en tabla dishes para este client_id:
  → Invalidar cache específico del cliente
  → Próxima request genera cache nuevo
```

---

## 🏗️ Arquitectura de Implementación

### Estructura de Carpetas

```
src/
├── api/
│   └── [client-slug]/
│       └── menu/
│           └── route.ts          ← Endpoint dinámico
│
├── lib/
│   ├── auth/
│   │   └── validateClient.ts     ← Control doble
│   ├── menu/
│   │   ├── generateMenu.ts       ← Lógica menú
│   │   ├── orderItems.ts         ← Ordenamiento
│   │   └── cacheManager.ts       ← Manejo caché
│   └── supabase/
│       └── client.ts
│
└── utils/
    └── constants.ts
```

### Endpoint Dinámico

```typescript
// src/api/[client-slug]/menu/route.ts

export const revalidate = 86400; // 24 horas

export async function GET(
  request: Request,
  { params }: { params: { clientSlug: string } }
) {
  // 1. Validación doble
  const validated = await validateClient(
    params.clientSlug,
    request.headers.get('x-api-key')
  );
  
  if (!validated) return new Response('Unauthorized', { status: 401 });
  
  // 2. Generar/obtener del caché
  const menu = await generateMenu(validated.clientId);
  
  // 3. Responder con caché
  return Response.json(menu, {
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=31536000'
    }
  });
}
```

### Validación Doble

```typescript
// lib/auth/validateClient.ts

export async function validateClient(
  clientSlug: string,
  apiKey: string | null
): Promise<{ clientId: string; clientSlug: string } | null> {
  
  if (!apiKey) return null;
  
  // Validación 1: Verificar API key
  const { data, error } = await supabase
    .from('dishes')
    .select('client_id, client_slug')
    .eq('client_slug', clientSlug)
    .eq('client_api_key', apiKey)
    .limit(1)
    .single();
  
  if (error || !data) return null;
  
  // Validación 2: Verificar coincidencia slug
  if (data.client_slug !== clientSlug) return null;
  
  return {
    clientId: data.client_id,
    clientSlug: data.client_slug
  };
}
```

### Generación de Menú con Orden

```typescript
// lib/menu/generateMenu.ts

export async function generateMenu(clientId: string) {
  
  // Obtener dishes del cliente
  const dishes = await supabase
    .from('dishes')
    .select('*')
    .eq('client_id', clientId)
    .order(
      'category_priority',
      { nullsLast: false }
    )
    .order('item_priority', { nullsLast: true })
    .order('created_at', { ascending: true });
  
  if (!dishes.data) return { error: 'No menu found' };
  
  // Agrupar por categoría
  const menu = groupByCategory(dishes.data);
  
  // Ordenar items dentro de cada categoría
  return orderMenuItems(menu);
}

function orderMenuItems(menu: Menu) {
  return Object.entries(menu).map(([category, items]) => ({
    category,
    items: items.sort((a, b) => {
      // Priority definida: ir primero
      if (a.item_priority !== null && b.item_priority !== null) {
        return a.item_priority - b.item_priority;
      }
      // Solo a tiene priority
      if (a.item_priority !== null) return -1;
      // Solo b tiene priority
      if (b.item_priority !== null) return 1;
      // Ambos null: ordenar por created_at
      return new Date(a.created_at) - new Date(b.created_at);
    })
  }));
}
```

---

## 💾 Revalidación de Caché

### Opción A: Manual (Webhook)

```typescript
// Cuando actualices un dish en Supabase:
// Llamar a endpoint de revalidación

export async function revalidateClientMenu(clientId: string) {
  await fetch('/api/revalidate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId })
  });
}
```

### Opción B: Automática (Realtime)

```typescript
// Supabase Realtime listener
supabase
  .channel('dishes-changes')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'dishes' },
    async (payload) => {
      // Si cambió un cliente, revalidar su menú
      if (payload.new?.client_id) {
        await revalidateClientMenu(payload.new.client_id);
      }
    }
  )
  .subscribe();
```

---

## 🔐 Seguridad

### Medidas Implementadas

✅ **Control doble de autenticación**
- Validar client_id + client_api_key
- Validar client_slug coincide con URL

✅ **Aislamiento de datos**
- Cada cliente solo ve sus datos
- No hay cross-contamination

✅ **Rate limiting**
- Limitar requests por client_api_key
- Prevenir brute force

✅ **API Key rotation**
- Permitir cambiar keys periódicamente
- Revocar keys si es necesario

---

## 📊 Performance

### Antes (sin caché)
```
Request → BD → Procesar → Response
Latencia: 200-500ms
Egresos: 1 por request
Costo: $$ (cada request consulta BD)
```

### Después (con caché)
```
Request → Caché ✓ → Response (0ms adicional)
         ↓
        No coincide → BD → Caché → Response
Latencia: 0ms (cached) o 200-500ms (miss)
Egresos: 1 por 24h (máximo)
Costo: $$ pero 99% menor
```

---

## 🎯 Plan de Implementación

### Fase 1: Validación (hoy)
- [ ] Implementar validateClient()
- [ ] Test con 2-3 clientes
- [ ] Verificar control doble funciona

### Fase 2: Ordenamiento (mañana)
- [ ] Implementar orderMenuItems()
- [ ] Test con items con y sin priority
- [ ] Verificar orden correcto

### Fase 3: Caché (después)
- [ ] Implementar cacheManager
- [ ] Configurar ISR en Vercel
- [ ] Implementar revalidación
- [ ] Medir egresos reales

### Fase 4: Optimización (final)
- [ ] Webhooks de revalidación
- [ ] Monitoreo de performance
- [ ] Dashboard de uso por cliente

---

## ⚠️ Restricción de Modularidad

**CRÍTICO**: Esta implementación debe ser modular:

✅ **Permitido**
- Agregar nuevos clientes sin modificar código
- Extender campos de priority
- Agregar nuevas reglas de ordenamiento

❌ **Prohibido**
- Cambiar estructura de validación (rompe clientes existentes)
- Modificar nombre de columnas de auth
- Alterar estructura de respuesta API

---

## 📞 Referencias

- **Auth**: `lib/auth/validateClient.ts`
- **Menu Generation**: `lib/menu/generateMenu.ts`
- **Ordering**: `lib/menu/orderItems.ts`
- **Cache**: `lib/menu/cacheManager.ts`
- **Endpoint**: `src/api/[client-slug]/menu/route.ts`

---

*Implementar con RESTRICCIONES DE MODULARIDAD en mente*
