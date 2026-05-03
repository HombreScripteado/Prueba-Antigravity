# Protocolo Ruflo + Obsidian - Lección Aprendida

**Fecha**: 2026-05-02  
**Contexto**: Restauración de estética de menú  
**Error**: No se usó Ruflo para tareas multi-archivo

## El Error

Se realizó una refactorización de 3 archivos CSS/TSX de forma manual sin:
- ❌ Usar `memory_search` antes de empezar
- ❌ Usar `hooks_route` para decidir si era tarea simple o swarm
- ❌ Usar `swarm_init` + `agent_spawn` para coordinar trabajo
- ❌ Registrar resultado con `memory_store`

## Por qué fue un error

1. **Desperdicio de tokens**: Los swarms usan menos tokens que agentes secuenciales
2. **Pérdida de aprendizaje**: Sin `memory_store`, el sistema no aprendió el patrón
3. **Ineficiencia**: Se gastaron más recursos de los necesarios

## La Solución

### Protocolo que SIEMPRE debería seguir:

**Paso 1: Diagnóstico (PRE)**
```
memory_search("restauración estética menú", "refactorización")
hooks_route("tareas: comparar CSS, actualizar layout, rediseñar página")
→ Resultado: 3+ archivos = USAR SWARM
```

**Paso 2: Ejecución (DURANTE)**
```
swarm_init({ topology: "pipeline", maxAgents: 3 })
Agent { researcher → architect → coder → reviewer }
SendMessage → coordinate
```

**Paso 3: Aprendizaje (POST)**
```
memory_store("pattern_estetica_restauracion", {...})
Obsidian: documentar qué se hizo
Ruflo: registrar el patrón para futuras tareas
```

## Aplicación Global

Esta lección se ha codificado en:
- `C:\Users\Joaquin\.claude\CLAUDE.md` (aplica a TODO proyecto)
- `c:\Users\Joaquin\Documents\Proyectos\Menu AR\Web4\CLAUDE.md` (proyecto local)

**Nunca más** trabajar sin Ruflo + Obsidian en conjunto.
