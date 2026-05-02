# 🧪 Guía de Testing: Multi-Cliente + Prioridades

**Vigente desde**: 2026-05-01  
**Estado**: Setup para testing en PREVIEW

---

## 🎯 Objetivos de Testing

```
✅ Validación: Verificar que cada cliente solo ve sus platos
✅ Prioridades: Verificar orden correcto (priority + fecha)
✅ Caché: Verificar que se cachea correctamente
✅ Seguridad: Verificar que API key invalida retorna 401
```

---

## 📊 Datos de Test

### Crear 2 Clientes en Supabase

#### Cliente 1: Pizzería María

```sql
INSERT INTO dishes (
  name, description, price, category,
  client_id, client_slug, client_api_key,
  category_priority, item_priority,
  isActive, created_at
)
VALUES
  -- ENTREES (Category Priority = 1)
  ('Margherita', 'Classic pizza', 15.99, 'Pizzas', 
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pizzeria-maria', 'sk_live_maria_key',
   1, 1, true, '2025-12-01T10:00:00Z'),
   
  ('Pepperoni', 'Spicy pizza', 17.99, 'Pizzas',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pizzeria-maria', 'sk_live_maria_key',
   1, 2, true, '2026-01-15T10:00:00Z'),
   
  ('Quattro Formaggi', 'Four cheese pizza', 19.99, 'Pizzas',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pizzeria-maria', 'sk_live_maria_key',
   1, NULL, true, '2026-02-01T10:00:00Z'),
   
  -- DESSERTS (Category Priority = 2)
  ('Tiramisu', 'Italian dessert', 8.99, 'Desserts',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pizzeria-maria', 'sk_live_maria_key',
   2, NULL, true, '2025-11-01T10:00:00Z'),
   
  ('Panna Cotta', 'Cream dessert', 9.99, 'Desserts',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pizzeria-maria', 'sk_live_maria_key',
   2, 1, true, '2026-01-01T10:00:00Z');
```

#### Cliente 2: Burger King NY

```sql
INSERT INTO dishes (
  name, description, price, category,
  client_id, client_slug, client_api_key,
  category_priority, item_priority,
  isActive, created_at
)
VALUES
  -- BURGERS (Category Priority = 1)
  ('Whopper', 'Flame-grilled beef', 12.99, 'Burgers',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'burger-king-ny', 'sk_live_burger_key',
   1, 1, true, '2025-10-01T10:00:00Z'),
   
  ('King Fusion', 'Special blend', 14.99, 'Burgers',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'burger-king-ny', 'sk_live_burger_key',
   1, NULL, true, '2026-03-01T10:00:00Z'),
   
  -- SIDES (Category Priority = 2)
  ('French Fries', 'Golden fries', 4.99, 'Sides',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'burger-king-ny', 'sk_live_burger_key',
   2, 1, true, '2025-09-01T10:00:00Z'),
   
  ('Onion Rings', 'Crispy rings', 5.99, 'Sides',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'burger-king-ny', 'sk_live_burger_key',
   2, NULL, true, '2026-02-15T10:00:00Z');
```

---

## 📋 Estructura de Test

### Test 1: Validación de Cliente

```
URL: /api/pizzeria-maria/menu
Header: X-API-Key: sk_live_maria_key

✅ Esperado:
- Retorna solo platos de pizzeria-maria (5 platos)
- Status 200

❌ Test fallido (no hay validación):
- Retorna 401 o NULL
```

### Test 2: Cambio de Cliente

```
URL: /api/burger-king-ny/menu
Header: X-API-Key: sk_live_burger_key

✅ Esperado:
- Retorna solo platos de burger-king-ny (4 platos)
- Completamente diferente a pizzeria-maria
- Status 200
```

### Test 3: API Key Inválida

```
URL: /api/pizzeria-maria/menu
Header: X-API-Key: sk_live_wrong_key

❌ Esperado:
- Status 401 Unauthorized
- No retorna platos
```

### Test 4: Ordenamiento por Priority

```
Pizzeria María → Pizzas:
1. Margherita (priority=1, created=2025-12-01)
2. Pepperoni (priority=2, created=2026-01-15)
3. Quattro Formaggi (priority=NULL, created=2026-02-01) ← Sin priority, por fecha

✅ Esperado: Este orden exacto
```

### Test 5: Ordenamiento de Categorías

```
Pizzeria María:
1. Pizzas (category_priority=1)
2. Desserts (category_priority=2)

✅ Esperado: Este orden exacto
```

---

## 💻 Código de Testing

### Estructura de Respuesta

```typescript
interface MenuResponse {
  clientId: string;
  generatedAt: string;
  categories: {
    category: string;
    categoryPriority: number | null;
    items: {
      id: string;
      name: string;
      price: number;
      item_priority: number | null;
      created_at: string;
    }[];
  }[];
  totalItems: number;
  totalCategories: number;
}
```

### Respuesta Esperada: Pizzeria María

```json
{
  "clientId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "generatedAt": "2026-05-01T10:00:00Z",
  "categories": [
    {
      "category": "Pizzas",
      "categoryPriority": 1,
      "items": [
        {
          "id": "...",
          "name": "Margherita",
          "price": 15.99,
          "item_priority": 1,
          "created_at": "2025-12-01T10:00:00Z"
        },
        {
          "id": "...",
          "name": "Pepperoni",
          "price": 17.99,
          "item_priority": 2,
          "created_at": "2026-01-15T10:00:00Z"
        },
        {
          "id": "...",
          "name": "Quattro Formaggi",
          "price": 19.99,
          "item_priority": null,
          "created_at": "2026-02-01T10:00:00Z"
        }
      ]
    },
    {
      "category": "Desserts",
      "categoryPriority": 2,
      "items": [
        {
          "id": "...",
          "name": "Panna Cotta",
          "price": 9.99,
          "item_priority": 1,
          "created_at": "2026-01-01T10:00:00Z"
        },
        {
          "id": "...",
          "name": "Tiramisu",
          "price": 8.99,
          "item_priority": null,
          "created_at": "2025-11-01T10:00:00Z"
        }
      ]
    }
  ],
  "totalItems": 5,
  "totalCategories": 2
}
```

---

## 🔍 Herramientas de Testing

### cURL Tests

```bash
# Test 1: Cliente válido - Pizzería María
curl -H "X-API-Key: sk_live_maria_key" \
  https://preview.tuapp.vercel.app/api/pizzeria-maria/menu | jq .

# Test 2: Cliente diferente - Burger King
curl -H "X-API-Key: sk_live_burger_key" \
  https://preview.tuapp.vercel.app/api/burger-king-ny/menu | jq .

# Test 3: API key inválida (debe fallar)
curl -i -H "X-API-Key: sk_live_wrong_key" \
  https://preview.tuapp.vercel.app/api/pizzeria-maria/menu

# Test 4: Sin API key (debe fallar)
curl -i https://preview.tuapp.vercel.app/api/pizzeria-maria/menu
```

### Página de Test Interactiva

**Ubicación**: `src/app/test/menu/page.tsx`

```typescript
'use client';

import { useState } from 'react';

export default function MenuTestPage() {
  const [clientSlug, setClientSlug] = useState('pizzeria-maria');
  const [apiKey, setApiKey] = useState('sk_live_maria_key');
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testClients = [
    {
      name: 'Pizzería María',
      slug: 'pizzeria-maria',
      key: 'sk_live_maria_key',
      expectedDishes: 5
    },
    {
      name: 'Burger King NY',
      slug: 'burger-king-ny',
      key: 'sk_live_burger_key',
      expectedDishes: 4
    }
  ];

  const fetchMenu = async () => {
    setLoading(true);
    setError(null);
    setMenu(null);

    try {
      const response = await fetch(
        `/api/${clientSlug}/menu`,
        {
          headers: {
            'X-API-Key': apiKey
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setMenu(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🧪 Test Multi-Cliente</h1>

      {/* Cliente Selector */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Selecciona Cliente:</h2>
        <div className="space-y-2">
          {testClients.map((client) => (
            <button
              key={client.slug}
              onClick={() => {
                setClientSlug(client.slug);
                setApiKey(client.key);
              }}
              className={`w-full p-3 text-left border rounded ${
                clientSlug === client.slug
                  ? 'bg-blue-100 border-blue-500'
                  : 'bg-gray-100'
              }`}
            >
              <div className="font-semibold">{client.name}</div>
              <div className="text-sm text-gray-600">
                Esperado: {client.expectedDishes} platos
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Manual Input */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">O ingresa manualmente:</h2>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Client Slug"
            value={clientSlug}
            onChange={(e) => setClientSlug(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* Fetch Button */}
      <button
        onClick={fetchMenu}
        disabled={loading}
        className="w-full bg-blue-600 text-white p-3 rounded font-semibold disabled:bg-gray-400"
      >
        {loading ? '⏳ Cargando...' : '🔍 Obtener Menú'}
      </button>

      {/* Results */}
      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-500 rounded">
          <h3 className="font-semibold text-red-900">❌ Error:</h3>
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {menu && (
        <div className="mt-6 bg-green-50 border border-green-500 rounded p-4">
          <h3 className="font-semibold text-green-900 mb-4">✅ Menú Cargado:</h3>

          <div className="mb-4 p-3 bg-white rounded border">
            <p><strong>Cliente:</strong> {menu.clientId}</p>
            <p><strong>Total platos:</strong> {menu.totalItems}</p>
            <p><strong>Total categorías:</strong> {menu.totalCategories}</p>
            <p><strong>Generado:</strong> {new Date(menu.generatedAt).toLocaleString()}</p>
          </div>

          {/* Categories */}
          {menu.categories.map((cat, idx) => (
            <div key={idx} className="mb-4 bg-white rounded p-4 border">
              <h4 className="font-semibold text-lg mb-2">
                {cat.category}
                {cat.categoryPriority !== null && (
                  <span className="text-sm text-gray-600 ml-2">
                    (Priority: {cat.categoryPriority})
                  </span>
                )}
              </h4>

              <ul className="space-y-2">
                {cat.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="pl-4 border-l-2 border-blue-300 py-2">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-600">
                      ${item.price}
                      {item.item_priority !== null && (
                        <span> • Priority: {item.item_priority}</span>
                      )}
                      {item.item_priority === null && (
                        <span> • Sin priority (por fecha)</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      Created: {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* JSON */}
          <details className="mt-4">
            <summary className="cursor-pointer font-semibold">Ver JSON completo</summary>
            <pre className="mt-2 p-3 bg-gray-900 text-gray-100 rounded overflow-x-auto text-sm">
              {JSON.stringify(menu, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
```

---

## ✅ Checklist de Testing

- [ ] Datos de test agregados a Supabase
- [ ] Endpoint `/api/[clientSlug]/menu` implementado
- [ ] `validateClient()` verifica ambas credenciales
- [ ] `orderMenuItems()` ordena correctamente
- [ ] Página de test en `/test/menu` funciona
- [ ] Test 1: Cliente válido retorna platos
- [ ] Test 2: Cambio de cliente muestra datos diferentes
- [ ] Test 3: API key inválida retorna 401
- [ ] Test 4: Ordenamiento por priority es correcto
- [ ] Test 5: Categorías ordenadas correctamente
- [ ] Caché se activa (HIT en segundo request)
- [ ] Health check muestra ahorro de tokens

---

## 🚀 Workflow de Testing

### Paso 1: Agregar datos
1. Ve a Supabase → SQL Editor
2. Copia y ejecuta los INSERT de ambos clientes
3. Verifica que los datos aparezcan en tabla dishes

### Paso 2: Implementar endpoint
1. Crear `src/lib/auth/validateClient.ts`
2. Crear `src/lib/menu/generateMenu.ts`
3. Crear `src/lib/menu/orderItems.ts`
4. Crear `src/app/api/[clientSlug]/menu/route.ts`

### Paso 3: Crear página de test
1. Crear `src/app/test/menu/page.tsx`
2. Acceder a `http://localhost:3000/test/menu`
3. Seleccionar cliente y ver menú

### Paso 4: Testing
1. Cambiar cliente → ver menú diferente
2. Cambiar API key → ver error 401
3. Verificar orden de prioridades
4. Verificar caché (segunda solicitud más rápida)

---

## 📊 Resultado Esperado

### Pizzería María
```
✅ 5 platos totales
✅ 2 categorías
✅ Pizzas (priority 1) antes de Desserts (priority 2)
✅ Dentro de Pizzas:
   - Margherita (priority 1)
   - Pepperoni (priority 2)
   - Quattro Formaggi (priority NULL, por fecha 2026-02-01)
```

### Burger King NY
```
✅ 4 platos totales
✅ 2 categorías
✅ Completamente diferente a Pizzería María
✅ Burgers (priority 1) antes de Sides (priority 2)
```

---

## 🔐 Verificación de Seguridad

```
API Key inválida → 401 ✓
Sin API key → 401 ✓
Slug no coincide → 401 ✓
Client_id no coincide → 401 ✓
Datos de otro cliente → No aparecen ✓
```

---

*Plan de testing vigente: 2026-05-01*
