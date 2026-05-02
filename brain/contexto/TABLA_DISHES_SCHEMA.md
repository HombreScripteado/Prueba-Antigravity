# 📊 Esquema de la Tabla `dishes` (Supabase)

**Última actualización**: 2026-05-01

---

## 📋 Estructura Actual

### Columnas de Base

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID | Identificador único |
| `name` | TEXT | Nombre del plato |
| `description` | TEXT | Descripción del plato |
| `price` | NUMERIC | Precio del plato |
| `category` | TEXT | Categoría (ENTREES, DRINKS, etc) |
| `created_at` | TIMESTAMP | Fecha de creación |

### Columnas de Customización (Nuevas)

| Columna | Tipo | Descripción | Ejemplo |
|---------|------|-------------|---------|
| `item_3d_path` | TEXT | Ruta del modelo 3D | `/models/pasta.gltf` |
| `model_name` | TEXT | Nombre del modelo | `pasta-01` |
| `category_subtitle` | TEXT | Subtítulo de categoría | `Handmade Pasta` |
| `section_title` | TEXT | Título de sección | `Specialties` |
| `isActive` | BOOLEAN | ¿Plato activo? | `true` |
| `GlutenFree` | BOOLEAN | ¿Sin gluten? | `false` |
| `isVegan` | BOOLEAN | ¿Vegano? | `true` |
| `Vegetarian` | BOOLEAN | ¿Vegetariano? | `true` |
| `recommendation` | TEXT | Recomendación | `Must try!` |
| `hasAR` | BOOLEAN | ¿Tiene AR? | `true` |

### Columnas de Autenticación Multi-Cliente (NUEVAS - CRÍTICAS)

| Columna | Tipo | Descripción | Ejemplo |
|---------|------|-------------|---------|
| `client_id` | UUID | ID único del cliente | `550e8400-e29b-41d4-a716-446655440000` |
| `client_slug` | TEXT | Slug único para URLs | `pizzeria-maria` |
| `client_api_key` | TEXT | Token secreto del cliente | `sk_live_xxxxx` |

### Columnas de Prioridad (NUEVAS - CRÍTICAS)

| Columna | Tipo | Descripción | Ejemplo |
|---------|------|-------------|---------|
| `category_priority` | INT | Orden de categoría | `1, 2, 3...` |
| `item_priority` | INT | Orden de plato en categoría | `1, 2, 3...` |

---

## 🔐 Datos de Autenticación

### client_id
- **Qué es**: Identificador único de cada cliente en el sistema
- **Tipo**: UUID
- **Generado por**: Sistema (al crear cliente)
- **Uso**: Filtrar datos en BD
- **Ejemplo**: `550e8400-e29b-41d4-a716-446655440000`

### client_slug
- **Qué es**: URL-friendly identifier del cliente
- **Tipo**: TEXT (lowercase, kebab-case)
- **Generado por**: Usuario (al crear cliente)
- **Uso**: URLs amigables (`/pizza-maria/menu`)
- **Reglas**:
  - Únicos en el sistema
  - Solo letras, números, guiones
  - Convertir a lowercase
  - No espacios
- **Ejemplo**: `pizzeria-maria`, `burger-king-ny`

### client_api_key
- **Qué es**: Token secreto para autenticación
- **Tipo**: TEXT (encriptado en BD)
- **Generado por**: Sistema (random)
- **Uso**: Validar solicitudes del cliente
- **Seguridad**: 
  - Nunca exponerlo en cliente
  - Usar solo en servidor
  - Rotable/revocable
- **Ejemplo**: `sk_live_51234567890abcdef`

---

## 📍 Prioridades de Orden

### category_priority
- **Qué es**: Número que define orden de categorías
- **Tipo**: INT o NULL
- **Valores**:
  - `1` = Primera categoría
  - `2` = Segunda categoría
  - `NULL` = Última (por fecha creación)
- **Uso**: `ORDER BY category_priority ASC`

### item_priority
- **Qué es**: Número que define orden de plato dentro categoría
- **Tipo**: INT o NULL
- **Valores**:
  - `1` = Primer plato
  - `2` = Segundo plato
  - `NULL` = Último (por fecha creación)
- **Uso**: Ordenamiento dentro categoría

### Ejemplo de Orden

```
CATEGORÍA A (priority=1)
  ├─ Plato 1 (priority=1)
  ├─ Plato 2 (priority=2)
  ├─ Plato 3 (priority=NULL, created=2025-12-01)
  └─ Plato 4 (priority=NULL, created=2026-06-01)

CATEGORÍA B (priority=2)
  ├─ Plato A (priority=NULL, created=2025-01-01)
  └─ Plato B (priority=1)

CATEGORÍA C (priority=NULL, created=2026-01-01)
  └─ Plato X (priority=NULL, created=2026-01-01)
```

---

## 🔄 Flujo de Datos

### Creación de Cliente

```
1. User crea cliente en admin
2. Sistema genera:
   - client_id (UUID)
   - client_slug (validado único)
   - client_api_key (random)
3. Usuario recibe client_slug + client_api_key
4. Usuario configura su menú
```

### Solicitud de Menú

```
1. Cliente (front) solicita: /api/pizzeria-maria/menu
   Headers: { 'X-API-Key': 'sk_live_xxx' }

2. Backend valida:
   - ¿client_slug existe?
   - ¿client_api_key es válido?
   - ¿Coinciden?
   
3. Si OK: Retorna menú ordenado + cacheado
   Si NO: Retorna 401 Unauthorized
```

---

## 💾 Índices Recomendados

Para optimizar consultas frecuentes:

```sql
-- Para autenticación
CREATE INDEX idx_dishes_client_slug_api_key 
ON dishes(client_slug, client_api_key);

-- Para filtrado por cliente
CREATE INDEX idx_dishes_client_id 
ON dishes(client_id);

-- Para ordenamiento
CREATE INDEX idx_dishes_priorities 
ON dishes(client_id, category_priority, item_priority, created_at);
```

---

## ⚠️ Restricciones de Datos

### Validación Required

| Campo | Regla | Por Qué |
|-------|-------|--------|
| `client_id` | NOT NULL | Cada plato debe pertenecer a cliente |
| `client_slug` | NOT NULL, UNIQUE | Identificar cliente en URLs |
| `client_api_key` | NOT NULL, UNIQUE | Autenticación debe ser única |
| `name` | NOT NULL | Todo plato debe tener nombre |
| `category` | NOT NULL | Todo plato debe estar categorizado |

### Validación Optional

| Campo | Regla | Por Qué |
|-------|-------|--------|
| `category_priority` | NULL OK | Permite ordenar al final por fecha |
| `item_priority` | NULL OK | Permite ordenar al final por fecha |
| `description` | NULL OK | No todos los platos necesitan descripción |

---

## 🔐 Seguridad

### ¿Cómo se protegen los datos?

```
1. Cada cliente solo ve sus datos
   - Filtrado por client_id + client_api_key
   - No hay acceso cruzado

2. API Key en header (no en URL)
   - POST /api/menu
   - Headers: { 'X-API-Key': '...' }
   - Nunca `GET /api/pizzeria-maria/menu?key=xxx`

3. Validación doble
   - Verificar client_slug en URL
   - Verificar client_api_key en header
   - Ambos deben matchear en BD

4. Rate limiting por API Key
   - Prevenir brute force
   - Max 100 requests/minuto por key
```

---

## 📈 Migración de Clientes Existentes

### Para agregar cliente existente:

```sql
UPDATE dishes
SET 
  client_id = '550e8400-e29b-41d4-a716-446655440000',
  client_slug = 'pizzeria-maria',
  client_api_key = 'sk_live_xxx'
WHERE category = 'Existing-Client-Category';
```

### Generación de client_api_key

```javascript
function generateClientApiKey() {
  const prefix = 'sk_live_';
  const randomPart = crypto.randomBytes(32).toString('hex');
  return prefix + randomPart;
}
```

---

## 📊 Consultas Típicas

### Obtener menú de cliente

```sql
SELECT *
FROM dishes
WHERE client_id = $1
  AND client_api_key = $2
ORDER BY 
  CASE WHEN category_priority IS NOT NULL THEN 0 ELSE 1 END,
  COALESCE(category_priority, 999999),
  CASE WHEN item_priority IS NOT NULL THEN 0 ELSE 1 END,
  COALESCE(item_priority, 999999),
  created_at ASC;
```

### Validar autenticación

```sql
SELECT client_id
FROM dishes
WHERE client_slug = $1
  AND client_api_key = $2
LIMIT 1;
```

### Actualizar prioridad

```sql
UPDATE dishes
SET item_priority = $1
WHERE id = $2
  AND client_id = $3;
```

---

## 🎯 Próximas Columnas (Futuro)

Cuando necesites agregar más funcionalidades:

```sql
-- Para analytics
ALTER TABLE dishes ADD COLUMN view_count INT DEFAULT 0;
ALTER TABLE dishes ADD COLUMN order_count INT DEFAULT 0;

-- Para restricciones
ALTER TABLE dishes ADD COLUMN available_from TIME;
ALTER TABLE dishes ADD COLUMN available_until TIME;
ALTER TABLE dishes ADD COLUMN min_order_quantity INT;

-- Para customización avanzada
ALTER TABLE dishes ADD COLUMN custom_color HEX;
ALTER TABLE dishes ADD COLUMN custom_icon URL;
ALTER TABLE dishes ADD COLUMN display_order_style ENUM;
```

---

## ✅ Checklist de Seguridad

- [ ] `client_id` presente en todos los platos
- [ ] `client_api_key` encriptado en BD
- [ ] Índices creados para performance
- [ ] Validación doble implementada
- [ ] Rate limiting configurado
- [ ] Logs de acceso registrados
- [ ] Rotación de keys documentada
- [ ] Backups diarios de BD

---

*Schema vigente desde: 2026-05-01*
