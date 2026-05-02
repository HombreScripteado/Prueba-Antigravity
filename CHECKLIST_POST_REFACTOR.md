# ✅ Checklist Post-Refactorización SaaS

## Antes de Usar en Producción

### Fase 1: Configuración Local
- [ ] Copiar `.env.example` a `.env.local`
- [ ] Llenar `REVALIDATE_SECRET` con un valor seguro
- [ ] Verificar que `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` son correctos
- [ ] Confirmar que no hay `.env.local` en git (estar en `.gitignore`)

### Fase 2: Base de Datos
- [ ] Tabla `clients` existe en Supabase
- [ ] Tabla `clients` tiene: `id` (UUID), `client_slug` (UNIQUE), `client_api_key`, `client_name`
- [ ] Tabla `dishes` tiene columna `client_id` (FK)
- [ ] Verificar que `is_active` existe en `dishes` (en lugar de `isActive`)
- [ ] Asignar `client_id` a todos los platos existentes:
  ```sql
  UPDATE dishes
  SET client_id = (SELECT id FROM clients WHERE client_slug = 'comidas-felices')
  WHERE client_slug = 'comidas-felices';
  ```

### Fase 3: Desarrollo Local
- [ ] `npm install` (sin cambios en dependencies)
- [ ] `npm run dev`
- [ ] Abrir http://localhost:3000/menu/comidas-felices
- [ ] Verificar que muestra el menú correctamente
- [ ] Verificar que un slug inexistente (http://localhost:3000/menu/xyz) muestra 404
- [ ] Abrir DevTools → Network → ver que las imágenes se cargan
- [ ] Probar modal de plato (click en un plato)

### Fase 4: Build Local
- [ ] `npm run build` (debería completar sin errores)
- [ ] Verificar en logs que `generateStaticParams()` pre-generó las páginas:
  ```
  ✓ Prerendered 2 static routes
  ```
- [ ] `npm run start`
- [ ] Probar nuevamente http://localhost:3000/menu/comidas-felices

### Fase 5: Testing API
- [ ] Probar endpoint de revalidación (desde terminal):
  ```bash
  curl "http://localhost:3000/api/revalidate?slug=comidas-felices&secret=tu-secret"
  ```
- [ ] Debería retornar: `{"revalidated": true, "slug": "comidas-felices", ...}`
- [ ] Probar con secret incorrecto (debería retornar 401)

### Fase 6: Deploy a Vercel
- [ ] Push a rama principal (`master` o `testing-antigravity`)
- [ ] Esperar a que Vercel complete el build
- [ ] En Vercel dashboard: verificar que pre-generó las páginas
- [ ] Probar en URL de Vercel: `https://tuapp-staging.vercel.app/menu/comidas-felices`
- [ ] Verificar en Vercel Analytics:
  - [ ] Cache Hit Rate (debería ser ~95% después de 1er acceso)
  - [ ] TTFB (debería ser ~20-50ms después de 1er acceso)

### Fase 7: Verificación Final
- [ ] Los modelos 3D cargan correctamente (si están disponibles)
- [ ] Los iconos dietarios se muestran (Vegan, Vegetarian, Gluten-free, Chef)
- [ ] El modal de detalle funciona
- [ ] El menú se ve bien en móvil (responsive)
- [ ] No hay errores en DevTools Console

---

## Después de Deploy en Producción

### Monitoreo Diario
- [ ] Verificar Vercel Analytics:
  - [ ] Cache Hit Rate > 90%
  - [ ] Errores = 0
  - [ ] TTFB < 100ms

### Actualizaciones de Menú
Cuando cambies items en la BD:
```bash
curl "https://tu-dominio.com/api/revalidate?slug=comidas-felices&secret=TU-SECRET"
```
- [ ] El endpoint retorna `{"revalidated": true}`
- [ ] Acceder a `/menu/comidas-felices` muestra datos nuevos

### Agregar Nuevo Cliente
1. [ ] Crear fila en tabla `clients`:
   ```sql
   INSERT INTO clients (client_slug, client_api_key, client_name)
   VALUES ('nuevo-resto', 'sk_live_nuevo_xxx', 'Nuevo Restaurante');
   ```
2. [ ] Asignar platos:
   ```sql
   UPDATE dishes SET client_id = 'uuid-de-nuevo-resto' WHERE ...;
   ```
3. [ ] En el próximo redeploy o manual trigger:
   ```bash
   curl "https://tu-dominio.com/api/revalidate?slug=nuevo-resto&secret=TU-SECRET"
   ```
4. [ ] Verificar que `/menu/nuevo-resto` funciona

---

## Troubleshooting

### `/menu/slug` muestra 404
```sql
-- Verificar que el cliente existe
SELECT * FROM clients WHERE client_slug = 'slug';
```

### Menú no actualiza después de cambiar BD
```bash
# Ejecutar revalidación
curl "https://tu-dominio.com/api/revalidate?slug=comidas-felices&secret=TU-SECRET"
# Esperar 5 segundos, luego acceder a /menu/comidas-felices
```

### Modelos 3D no cargan
```sql
-- Verificar que el path existe
SELECT name, model_3d_path FROM dishes WHERE model_3d_path IS NOT NULL;
-- El path debería ser: /models/nombre.glb o similar
```

### TTFB está lento (~500ms)
- [ ] Es normal en el 1er acceso
- [ ] Los accesos posteriores deberían ser ~20-50ms
- [ ] Si sigue lento: verificar que Vercel está cacheando
  - [ ] Ver header `x-vercel-cache` en respuesta (debería ser HIT)

### Revalidate retorna 401
```bash
# Verificar que el secret es correcto
echo $REVALIDATE_SECRET
# Debería coincidir con la variable de entorno
```

---

## Línea de Meta 🎯

Una vez que todo el checklist esté ✅, estás listo para:

✨ **Páginas públicas de menú cacheadas indefinidamente**
✨ **Actualizaciones sin downtime con revalidación on-demand**
✨ **Preparado para panel de administración futuro**
✨ **Arquitectura SaaS multi-tenant escalable**

