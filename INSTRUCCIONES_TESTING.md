# 🧪 Instrucciones de Testing - Paso a Paso

**Estado**: Setup PREVIEW (no main aún)

---

## 📋 Checklist Rápido

- [ ] Paso 1: Agregar datos de test a Supabase
- [ ] Paso 2: Instalar dependencias
- [ ] Paso 3: Configurar variables de entorno
- [ ] Paso 4: Ejecutar la app
- [ ] Paso 5: Abrir página de test
- [ ] Paso 6: Probar multi-cliente
- [ ] Paso 7: Probar prioridades
- [ ] Paso 8: Probar caché

---

## 🔧 Paso 1: Agregar Datos de Test a Supabase

### 1.1 Abre Supabase

1. Ve a https://supabase.com
2. Abre tu proyecto
3. Ve a **SQL Editor** (lado izquierdo)

### 1.2 Ejecuta INSERT para Cliente 1 (Pizzería María)

```sql
INSERT INTO dishes (
  name, description, price, category,
  client_id, client_slug, client_api_key,
  category_priority, item_priority,
  isActive, created_at
)
VALUES
  ('Margherita', 'Classic pizza', 15.99, 'Pizzas', 
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pizzeria-maria', 'sk_live_maria_key',
   1, 1, true, '2025-12-01T10:00:00Z'),
   
  ('Pepperoni', 'Spicy pizza', 17.99, 'Pizzas',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pizzeria-maria', 'sk_live_maria_key',
   1, 2, true, '2026-01-15T10:00:00Z'),
   
  ('Quattro Formaggi', 'Four cheese pizza', 19.99, 'Pizzas',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pizzeria-maria', 'sk_live_maria_key',
   1, NULL, true, '2026-02-01T10:00:00Z'),
   
  ('Tiramisu', 'Italian dessert', 8.99, 'Desserts',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pizzeria-maria', 'sk_live_maria_key',
   2, NULL, true, '2025-11-01T10:00:00Z'),
   
  ('Panna Cotta', 'Cream dessert', 9.99, 'Desserts',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pizzeria-maria', 'sk_live_maria_key',
   2, 1, true, '2026-01-01T10:00:00Z');
```

✅ Deberías ver "Successfully executed"

### 1.3 Ejecuta INSERT para Cliente 2 (Burger King NY)

```sql
INSERT INTO dishes (
  name, description, price, category,
  client_id, client_slug, client_api_key,
  category_priority, item_priority,
  isActive, created_at
)
VALUES
  ('Whopper', 'Flame-grilled beef', 12.99, 'Burgers',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'burger-king-ny', 'sk_live_burger_key',
   1, 1, true, '2025-10-01T10:00:00Z'),
   
  ('King Fusion', 'Special blend', 14.99, 'Burgers',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'burger-king-ny', 'sk_live_burger_key',
   1, NULL, true, '2026-03-01T10:00:00Z'),
   
  ('French Fries', 'Golden fries', 4.99, 'Sides',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'burger-king-ny', 'sk_live_burger_key',
   2, 1, true, '2025-09-01T10:00:00Z'),
   
  ('Onion Rings', 'Crispy rings', 5.99, 'Sides',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'burger-king-ny', 'sk_live_burger_key',
   2, NULL, true, '2026-02-15T10:00:00Z');
```

✅ Deberías ver "Successfully executed"

### 1.4 Verifica los datos

En Supabase, ve a **Table Editor** → **dishes**

Filtra por `client_slug` y verifica:
- ✅ 5 platos para `pizzeria-maria`
- ✅ 4 platos para `burger-king-ny`
- ✅ Todas las columnas tienen valores

---

## 📦 Paso 2: Instalar Dependencias

```bash
cd "c:\Users\Joaquin\Documents\Proyectos\Menu AR\Web4"
npm install
```

---

## 🔐 Paso 3: Configurar Variables de Entorno

### 3.1 Crea `.env.local` en raíz del proyecto

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

Obtén estos valores de Supabase:
1. Ve a **Settings** → **API**
2. Copia `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
3. Copia `Service Role Secret Key` → `SUPABASE_SERVICE_ROLE_KEY`

### 3.2 Verifica que los valores no estén vacíos

```bash
echo $env:NEXT_PUBLIC_SUPABASE_URL
echo $env:SUPABASE_SERVICE_ROLE_KEY
```

---

## 🚀 Paso 4: Ejecutar la App

```bash
npm run dev
```

Deberías ver:
```
▲ Next.js 15.0.0
- Local:        http://localhost:3000
```

---

## 🧪 Paso 5: Abrir Página de Test

1. Abre navegador: http://localhost:3000/test/menu
2. Deberías ver:
   - Panel de control (izquierda)
   - Botones de clientes (Pizzería María, Burger King NY)
   - Panel de resultados (derecha)

---

## ✅ Paso 6: Probar Multi-Cliente

### Test 1: Pizzería María

1. **Selecciona**: 🍕 Pizzería María
2. **Haz clic**: "🔍 Obtener Menú"
3. **Verifica**:
   - ✅ 5 platos
   - ✅ 2 categorías
   - ✅ Ver todos los nombres

### Test 2: Burger King NY

1. **Selecciona**: 🍔 Burger King NY
2. **Haz clic**: "🔍 Obtener Menú"
3. **Verifica**:
   - ✅ 4 platos (completamente diferentes)
   - ✅ 2 categorías diferentes
   - ✅ Nombres como "Whopper", "French Fries"

**Resultado esperado**: Cada cliente ve SOLO sus propios platos ✅

---

## 🎯 Paso 7: Probar Prioridades

### Test 1: Ordenamiento de Pizzas (Pizzería María)

Esperas ver en orden:
1. **Margherita** (priority=1)
2. **Pepperoni** (priority=2)
3. **Quattro Formaggi** (priority=NULL, created=2026-02-01)

**Regla**: Priority definida va primero, NULL al final por fecha ✅

### Test 2: Ordenamiento de Desserts

Esperas ver en orden:
1. **Panna Cotta** (priority=1)
2. **Tiramisu** (priority=NULL, created=2025-11-01)

**Regla**: Priority 1 va primero ✅

### Test 3: Ordenamiento de Categorías

Esperas ver:
1. **Pizzas** (category_priority=1)
2. **Desserts** (category_priority=2)

**Regla**: Categorías también ordenadas por priority ✅

---

## ⚡ Paso 8: Probar Caché

### Test: Verificar Caché Funciona

1. **Obtén menú** de Pizzería María → Verás "📝 MISS (generado)"
2. **Espera 1 segundo**
3. **Obtén menú otra vez** (mismo cliente) → Verás "⚡ HIT (desde caché)"
4. **Espera 1 segundo**
5. **Obtén menú tercera vez** → Verá "⚡ HIT (desde caché)"

**Resultado esperado**: 
- Primer request: MISS (genera menú)
- Siguientes requests: HIT (desde caché en 24h)
- Esto significa: 67% de ahorro de tokens ✅

---

## 🔴 Pruebas de Error (seguridad)

### Test: API Key Inválida

1. **Ingresa manualmente**:
   - Slug: `pizzeria-maria`
   - API Key: `sk_live_wrong_key`
2. **Haz clic**: "🔍 Obtener Menú"
3. **Verifica**: Error 401 ✅

### Test: Slug Inválido

1. **Ingresa**:
   - Slug: `restaurant-inexistente`
   - API Key: `sk_live_maria_key`
2. **Haz clic**: "🔍 Obtener Menú"
3. **Verifica**: Error 401 ✅

**Resultado esperado**: Sin credenciales válidas, NO retorna datos ✅

---

## 📊 Resumen de Pruebas

| Prueba | Esperado | Estado |
|--------|----------|--------|
| Pizzería María | 5 platos | ✅ |
| Burger King NY | 4 platos | ✅ |
| Cambio de cliente | Datos diferentes | ✅ |
| Prioridades | Orden correcto | ✅ |
| API Key inválida | Error 401 | ✅ |
| Caché primer request | MISS | ✅ |
| Caché segundo request | HIT | ✅ |

---

## 🎓 Lo que acabas de probar

```
✅ Autenticación multi-cliente (validación doble)
✅ Aislamiento de datos por cliente
✅ Ordenamiento por prioridad + fecha
✅ Caché inteligente (67% ahorro de tokens)
✅ Seguridad (rechaza credenciales inválidas)
```

---

## 🚀 Próximos Pasos

Una vez que todas las pruebas pasen:

1. **Commit**: `git add . && git commit -m "test: testing completado y validado"`
2. **Push**: `git push origin feature/diseno-gastronomico-mejora`
3. **PR**: Crear PR en GitHub para revisión
4. **Merge**: Fusionar a main cuando todo esté listo

---

## 📞 Troubleshooting

### Error: "NEXT_PUBLIC_SUPABASE_URL is undefined"

**Solución**: Verifica que `.env.local` existe y tiene los valores correctos

```bash
cat .env.local
```

### Error: "Database error" al obtener menú

**Solución**: Verifica que:
- ✅ Datos de test fueron insertados en Supabase
- ✅ `SUPABASE_SERVICE_ROLE_KEY` es correcto
- ✅ La tabla `dishes` existe

### Error: "Invalid credentials"

**Solución**: Verifica que:
- ✅ `client_slug` es exactamente `pizzeria-maria` o `burger-king-ny`
- ✅ `client_api_key` es `sk_live_maria_key` o `sk_live_burger_key`
- ✅ Los datos fueron insertados en Supabase

---

## ✨ Cuando todo funciona

Deberías ver:
- ✅ Página de test cargando
- ✅ Seleccionar cliente y ver su menú
- ✅ Cambiar cliente y ver datos diferentes
- ✅ Error cuando API key es inválida
- ✅ Caché funcionando (HIT después del primer request)

**¡Felicidades! Todo está funcionando correctamente!** 🎉

---

*Guía de testing vigente: 2026-05-01*
