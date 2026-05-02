# 🧠 Brain del Proyecto - Guía de Uso

Este es el **cerebro colectivo** del proyecto Menu AR Web4. Es la fuente de verdad para todos los agentes de Ruflo.

---

## 🚀 Inicio Rápido

### 1. Instalar Obsidian
Descarga desde: https://obsidian.md/download

### 2. Abrir el Brain en Obsidian
- Abre Obsidian
- "Open folder as vault" → Selecciona esta carpeta (`brain/`)
- ¡Listo!

### 3. Ver el Grafo Visual
Presiona **Ctrl+G** (o Cmd+G en Mac) para abrir **Graph View**.

Verás:
- 🔵 Nodos (notas)
- 🔗 Conexiones (links entre notas)
- 🎨 Colores según tipo

---

## 📂 Estructura de Carpetas

```
brain/
├── INDEX.md                    ← ¡COMIENZA AQUÍ!
├── agentes/                    ← Qué hace cada agente
├── decisiones/                 ← Por qué se tomaron ciertas decisiones
├── cambios/                    ← Historial de modificaciones (AUTO-GENERADO)
├── contexto/                   ← Información general del proyecto
├── procedimientos/             ← Guías de cómo actuar
├── memoria/                    ← Memoria de sesiones (AUTO-GENERADO)
└── .obsidian/                  ← Config de Obsidian
```

---

## 🔄 Sincronización Automática

El sistema sincroniza automáticamente:

1. **Ediciones de código** → Nuevas notas en `cambios/`
2. **Contexto nuevo** → Se indexa en memoria de Ruflo
3. **Cambios en Obsidian** → Se leen para mejorar agentes

```
Code Edit → Hook → sync-to-brain.js → Obsidian Note ← Ruflo Memory
```

---

## 📖 Cómo Usar

### Para Usuarios
1. Abre `INDEX.md` para entender la estructura
2. Abre **Graph View** (Ctrl+G) para ver conexiones
3. Usa busca (Ctrl+F) para encontrar contexto
4. Los cambios se **sincronizan automáticamente**

### Para Agentes
1. Antes de actuar: lee `procedimientos/PROTOCOLO_AGENTES.md`
2. Consulta `agentes/AGENTES_DISPONIBLES.md` para evitar conflictos
3. Actualiza `memoria/` después de cada acción
4. Crea una nota en `cambios/` si haces algo significativo

---

## 🎨 Recomendaciones Obsidian

### Plugins Recomendados
- ✅ **Graph Analysis** - Para ver más detalles del grafo
- ✅ **Breadcrumbs** - Para navegar la jerarquía
- ✅ **Dataview** - Para queries automáticas
- ✅ **Daily Notes** - Para notas por sesión
- ✅ **Quick Switcher Plus** - Para búsqueda avanzada

### Ajustes Recomendados
```
Settings → Files & Links
✓ Use [[Wikilinks]]
✓ New link format: Relative path
✓ New file location: Same folder as current file
```

---

## 🔍 Visualizaciones Útiles

### Graph View (Ctrl+G)
- Arrastra nodos para explorar
- Haz clic en nodos para leerlos
- Usa filtros para mostrar/ocultar tipos

### Backlinks Panel
- Muestra qué otras notas enlazan a esta
- Útil para entender impacto de cambios

### Outline Panel
- Muestra estructura de títulos
- Navega rápidamente dentro de notas grandes

---

## 📝 Plantillas

Cuando crees nuevas notas:

- **Cambio**: Usar template en `cambios/TEMPLATE.md`
- **Decisión**: Copiar estructura de `decisiones/`
- **Procedimiento**: Seguir formato de `procedimientos/`

---

## 🔗 Escritura de Links

Usa **Wikilinks** para conectar notas:

```markdown
[[nombre-de-la-nota]]           ← Link a nota
[[nombre-de-la-nota|Texto]]     ← Link con texto custom
[[PROTOCOLO_AGENTES]]           ← Referenciar protocolo
```

Los links:
- Se crean automáticamente en el grafo
- Se resaltan cuando hay cambios
- Son bidireccionales (backlinks)

---

## ⚙️ Automatización

### Script de Sincronización
```bash
node .claude-flow/sync/sync-to-brain.js
```

Ejecuta después de cambios importantes para sincronizar manualmente.

### Hooks Activos
- `after-edit`: Se ejecuta después de cada edición
- `before-agent-action`: Se ejecuta antes de que agentes actúen

---

## 🆘 Troubleshooting

**P: El grafo no se actualiza**
- A: Recarga Obsidian (Ctrl+R)

**P: No veo mis cambios sincronizados**
- A: Ejecuta manualmente: `node .claude-flow/sync/sync-to-brain.js`

**P: Quiero hacer un cambio masivo**
- A: Edita en Obsidian, luego ejecuta el script de sync

---

## 💡 Tips Avanzados

### Búsquedas Complejas
```
Ctrl+Shift+F para buscar en todas las notas
file:cambios/ para filtrar por carpeta
tag:importante para buscar por tags
```

### Crear Vistas Dinámicas
Obsidian puede listar automáticamente:
- Notas sin backlinks (huérfanas)
- Notas que enlazan entre sí
- Cambios por fecha
- Decisiones sin documentación

### Exportar Brain
Usa "Export PDF" para generar reportes de secciones específicas.

---

## 📞 Soporte

Si tienes preguntas:
1. Revisa esta documentación
2. Busca en el grafo relacionado
3. Consulta `procedimientos/PROTOCOLO_AGENTES.md`

---

**¡El Brain mejora con cada nota que agregues! 🧠✨**
