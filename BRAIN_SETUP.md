# 🧠 Setup del Brain Colectivo

## ✅ Lo que se ha configurado

### 1. Estructura del Brain (Obsidian)
```
brain/
├── INDEX.md                          ← Punto de entrada
├── README.md                         ← Guía de uso
├── agentes/                          ← Matriz de responsabilidades
├── decisiones/                       ← Por qué se toman decisiones
├── cambios/                          ← Sincronización automática de cambios
├── contexto/                         ← Información del proyecto
├── procedimientos/                   ← Cómo deben actuar los agentes
├── memoria/                          ← Sesiones y aprendizajes
└── .obsidian/                        ← Config de Obsidian
```

### 2. Sincronización Automática
- ✅ Script: `.claude-flow/sync/sync-to-brain.js`
- ✅ Hook: `.claude/hooks/after-edit.js`
- ✅ Config: `.claude-flow/brain-config.yaml`

### 3. Integración Ruflo + Obsidian
- ✅ Memoria vectorial habilitada
- ✅ Detección de conflictos entre agentes
- ✅ Protocol de coordinación

### 4. Visualización Graph
- ✅ Grafo interactivo lista para Obsidian
- ✅ Conexiones automáticas entre notas
- ✅ Tipos de nodos categorizados

---

## 🚀 Próximos Pasos

### Paso 1: Instalar Obsidian
**Descarga:** https://obsidian.md/download

```bash
# O instala desde línea de comandos:
# Windows: scoop install obsidian
# Mac: brew install obsidian
# Linux: snap install obsidian
```

### Paso 2: Abrir el Brain en Obsidian
1. Abre Obsidian
2. "Create new vault" o "Open folder as vault"
3. Selecciona: `c:\Users\Joaquin\Documents\Proyectos\Menu AR\Web4\brain`
4. ¡Listo!

### Paso 3: Explorar el Brain
1. Lee `INDEX.md` para entender estructura
2. Presiona **Ctrl+G** para ver el **Graph View**
3. Explora las conexiones visuales

### Paso 4: Activar Sincronización
El script ya está configurado para sincronizar automáticamente cuando:
- Edites un archivo
- Hagas commit en git
- Los agentes actúen

Para sincronizar manualmente:
```bash
node .claude-flow/sync/sync-to-brain.js
```

---

## 📊 Cómo Funciona

### Flujo de Sincronización

```
┌─────────────────┐
│ Tú editas código│
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│ Hook after-edit.js   │ ◄── Se ejecuta automáticamente
│ (detecta cambio)     │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────────────┐
│ sync-to-brain.js             │
│ 1. Lee último commit          │
│ 2. Extrae archivos cambiados  │
│ 3. Crea nota en /cambios/     │
│ 4. Indexa en Ruflo memory     │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Obsidian Brain actualizado│
│ + Memoria Ruflo sincronizada
└──────────────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Agentes leen el Brain    │
│ ANTES de cualquier acción│
└──────────────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Decisiones coherentes    │
│ (sin conflictos)         │
└──────────────────────────┘
```

### Consulta de Agentes

Cada agente DEBE seguir este protocolo:

```
1. Leer: procedimientos/PROTOCOLO_AGENTES.md
2. Verificar: agentes/AGENTES_DISPONIBLES.md
3. Revisar: cambios/ (últimas 5 notas)
4. Consultar: contexto/CONTEXTO_GENERAL.md
5. Actuar (o coordinar si hay conflicto)
6. Registrar en memoria/
7. Crear nota en cambios/
```

---

## 🎨 Visualización en Obsidian

### Graph View (Ctrl+G)
Verás un mapa visual como este:

```
                  ┌─ PROTOCOLO_AGENTES
                  │
        ┌─────────┼─ CAMBIOS (últimas notas)
        │         │
   INDEX ────── AGENTES
        │         │
        └─────────┼─ CONTEXTO_GENERAL
                  │
                  └─ DECISIONES
```

Cada punto = una nota
Cada línea = un link
Los colores = tipo de nota

**Interactivo**: Puedes:
- Hacer zoom (rueda del mouse)
- Arrastrar nodos
- Hacer clic para leer
- Filtrar por tipo

---

## 💡 Ventajas del Sistema

### Para ti (usuario)
✅ Todo centralizado en un lugar  
✅ Visualización clara de conexiones  
✅ Historial automático de cambios  
✅ Búsqueda poderosa  

### Para los agentes
✅ Contexto coherente  
✅ Evitar conflictos  
✅ Tomar decisiones informadas  
✅ Aprender del histórico  

### Para el proyecto
✅ Menos bugs por inconsistencia  
✅ Coordinación mejorada  
✅ Conocimiento centralizado  
✅ Escalable a más agentes  

---

## 🔧 Configuración Avanzada

### Agregar más tipos de notas
Edita `.claude-flow/brain-config.yaml`:
```yaml
noteTypes:
  miTipo:
    template: ./brain/mi-tipo/TEMPLATE.md
    icon: 🎯
    autoCreate: true
```

### Cambiar intervalo de sincronización
En `.claude-flow/brain-config.yaml`:
```yaml
sync:
  interval: 60000  # 60 segundos (default: 30000)
```

### Filtrar qué se sincroniza
En `.claude-flow/brain-config.yaml`:
```yaml
obsidian:
  ignore:
    - pattern1/**
    - pattern2
```

---

## 📚 Archivos Importantes

| Archivo | Propósito |
|---------|-----------|
| `brain/INDEX.md` | Punto de entrada |
| `brain/README.md` | Guía completa |
| `brain/procedimientos/PROTOCOLO_AGENTES.md` | Cómo actúan los agentes |
| `.claude-flow/brain-config.yaml` | Configuración del sistema |
| `.claude-flow/sync/sync-to-brain.js` | Script de sincronización |
| `.claude/hooks/after-edit.js` | Hook automático |

---

## 🆘 Troubleshooting

### El grafo no se actualiza
```bash
# Recarga Obsidian (Ctrl+R)
# O sincroniza manualmente:
node .claude-flow/sync/sync-to-brain.js
```

### Los cambios no se sincronizan
```bash
# Verifica que git está en buen estado
git status

# Sincroniza manualmente
node .claude-flow/sync/sync-to-brain.js

# Revisa logs
cat .claude-flow/logs/brain-sync.log
```

### No veo el grafo en Obsidian
- Asegúrate de que Obsidian está abierto en la carpeta `brain/`
- Presiona Ctrl+G para abrir Graph View
- Si no aparece, recarga (Ctrl+R)

---

## ✨ Próximas Mejoras

Cuando tengas más tiempo:
- [ ] Agregar Obsidian plugins: Graph Analysis, Dataview, Daily Notes
- [ ] Crear templates personalizados por tipo de agente
- [ ] Automatizar generación de reportes
- [ ] Integrar con webhooks de GitHub
- [ ] Dashboard de estado de agentes

---

## 📞 Resumen Rápido

**¿Qué es el Brain?**
Sistema centralizado que mejora coordinación entre agentes.

**¿Qué necesito hacer ahora?**
1. Descargar Obsidian: https://obsidian.md/download
2. Abrir `brain/` como vault
3. Presionar Ctrl+G para ver el grafo

**¿Qué se sincroniza automáticamente?**
- Cambios de código → notas en `cambios/`
- Todo indexado en memoria de Ruflo
- Listo para que agentes lo consulten

**¿Cómo mejora el rendimiento?**
Agentes leen contexto ANTES de actuar → decisiones coherentes → menos trabajo duplicado → más rápido.

---

🎉 **¡Tu Brain está listo!**

Próximo paso: Abre Obsidian y comienza a explorar.

*Generado: 2026-05-01*
