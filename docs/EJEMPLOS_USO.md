# Ejemplos de Uso

## 1. Acceder al menú público

```bash
# El menú es accesible públicamente sin API key
curl https://tuapp.com/menu/comidas-felices
```

En el navegador:
```
https://tuapp.com/menu/comidas-felices
https://tuapp.com/menu/otro-restaurant
https://tuapp.com/menu/pizzeria-maria
```

---

## 2. Slug inexistente

```bash
curl https://tuapp.com/menu/no-existe
# Retorna: 404 Not Found (página)
```

---

## 3. Endpoint de Revalidación (On-Demand Cache Purge)

```bash
# Revalidar menú de Comidas Felices
curl "https://tuapp.com/api/revalidate?slug=comidas-felices&secret=tu-secret-aqui"

# Respuesta:
{
  "revalidated": true,
  "slug": "comidas-felices",
  "timestamp": "2026-05-02T10:30:00.000Z"
}
```

### Con secret incorrecto
```bash
curl "https://tuapp.com/api/revalidate?slug=comidas-felices&secret=incorrecto"

# Respuesta: 401 Unauthorized
{
  "error": "Invalid revalidation secret"
}
```

### Sin slug
```bash
curl "https://tuapp.com/api/revalidate?secret=tu-secret"

# Respuesta: 400 Bad Request
{
  "error": "Slug parameter is required"
}
```

---

## 4. Endpoint API antiguo (con API key)

Este endpoint sigue funcionando para compatibilidad. Es útil para apps/clientes que ya lo usan.

```bash
curl "https://tuapp.com/api/comidas-felices/menu" \
  -H "X-API-Key: clave-secreta-felices-456"

# Respuesta:
{
  "clientId": "550e8400-e29b-41d4-a716-446655440000",
  "generatedAt": "2026-05-02T10:30:00Z",
  "categories": [
    {
      "category": "Entrada",
      "categoryPriority": 1,
      "items": [...]
    }
  ],
  "totalItems": 6,
  "totalCategories": 2
}
```

---

## 5. Agregar un cliente desde SQL

```sql
-- 1. Crear cliente
INSERT INTO clients (client_slug, client_api_key, client_name)
VALUES ('mi-restaurant', 'sk_live_mi_rest_xxxxxxxx', 'Mi Restaurant');

-- 2. Obtener su UUID
SELECT id FROM clients WHERE client_slug = 'mi-restaurant';
-- Resultado: 770e8400-e29b-41d4-a716-446655440000

-- 3. Asignar platos a ese cliente
UPDATE dishes
SET client_id = '770e8400-e29b-41d4-a716-446655440000'
WHERE id IN (100, 101, 102, 103); -- Los IDs de los platos que quieres

-- 4. Verificar
SELECT COUNT(*) FROM dishes 
WHERE client_id = '770e8400-e29b-41d4-a716-446655440000';
```

---

## 6. Ver menú en desarrollo local

```bash
# Asume que tienes .env.local configurado con:
# NEXT_PUBLIC_SUPABASE_URL=...
# SUPABASE_SERVICE_ROLE_KEY=...
# REVALIDATE_SECRET=...

npm run dev
# Abre: http://localhost:3000/menu/comidas-felices
```

---

## 7. Pipeline de actualización

### Escenario: Cambiar nombre de un plato

```bash
# 1. Actualizar BD
UPDATE dishes SET name = 'Empanadas Rellenas de Queso' 
WHERE id = 123;

# 2. Purgar caché
curl "https://tuapp.com/api/revalidate?slug=comidas-felices&secret=tu-secret"

# 3. El próximo acceso a /menu/comidas-felices regenera con datos nuevos
```

### Escenario: Agregar un plato nuevo

```bash
# 1. Crear plato en BD
INSERT INTO dishes (name, price, category, client_id, is_active, ...)
VALUES ('Milanesa XL', 12.99, 'Platos', '770e8400-...', true, ...);

# 2. Purgar caché
curl "https://tuapp.com/api/revalidate?slug=comidas-felices&secret=tu-secret"

# 3. ¡Listo! El nuevo plato aparece en /menu/comidas-felices
```

---

## 8. Arquitectura con GitHub Actions (Deploy)

Si quieres que Vercel regenere automáticamente:

```yaml
# .github/workflows/revalidate-menu.yml
name: Revalidate Menu

on:
  workflow_dispatch:  # Manual trigger
  schedule:
    - cron: '0 */6 * * *'  # Cada 6 horas

jobs:
  revalidate:
    runs-on: ubuntu-latest
    steps:
      - name: Revalidate all menus
        env:
          REVALIDATE_SECRET: ${{ secrets.REVALIDATE_SECRET }}
        run: |
          slugs=("comidas-felices" "otro-restaurant" "pizzeria-maria")
          for slug in "${slugs[@]}"; do
            curl "https://tuapp.com/api/revalidate?slug=$slug&secret=$REVALIDATE_SECRET"
          done
```

---

## 9. Monitoreo y Debugging

### Ver cuál es el último cliente agregado

```sql
SELECT client_slug, client_name, created_at
FROM clients
ORDER BY created_at DESC
LIMIT 5;
```

### Ver cuántos platos tiene cada cliente

```sql
SELECT 
  c.client_slug,
  c.client_name,
  COUNT(d.id) as num_platos
FROM clients c
LEFT JOIN dishes d ON d.client_id = c.id AND d.is_active = true
GROUP BY c.id, c.client_slug, c.client_name
ORDER BY num_platos DESC;
```

### Ver si un slug es único

```sql
SELECT client_slug, COUNT(*) as count
FROM clients
GROUP BY client_slug
HAVING COUNT(*) > 1;
-- Debería retornar vacío (cada slug es único)
```

