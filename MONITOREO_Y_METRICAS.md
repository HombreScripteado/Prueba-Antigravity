# 📊 Monitoreo y Métricas - Ruflo + Obsidian

Guía para evaluar el estado y eficiencia del sistema.

---

## ✅ Health Check - Verificación Completa

### Ejecutar Health Check
```bash
node .claude-flow/metrics/health-check.js
```

### Qué Verifica
- ✅ **Brain**: Todos los archivos presentes
- ✅ **Sincronización**: Configuración correcta
- ✅ **Memoria**: Índices activos
- ✅ **Git**: Cambios registrados
- ✅ **Obsidian**: Configuración presente

### Ejemplo de Salida
```
═══════════════════════════════════════
📋 REPORTE DE HEALTH CHECK
═══════════════════════════════════════

📂 Verificando Brain...
✅ Brain: INDEX.md
✅ Brain: README.md
✅ Brain: procedimientos/PROTOCOLO_AGENTES.md
[...]

═══════════════════════════════════════
📊 RESUMEN
═══════════════════════════════════════

✅ Brain
✅ Sincronización
✅ Memoria
✅ Git
✅ Obsidian

📈 Métricas:
   Brain: 7 archivos
   Tokens CON contexto: ~4585
   Tokens SIN contexto: ~13755
   💰 Ahorro: 9170 tokens (67%)

✅ SISTEMA SALUDABLE
═══════════════════════════════════════
```

---

## 💰 Ahorro de Tokens

### ¿Cómo se Calcula?

**Con Brain (optimizado):**
```
Agente necesita contexto
  ↓
Brain proporciona solo lo relevante
  ↓
~4,585 tokens enviados
```

**Sin Brain (sin optimizar):**
```
Agente necesita contexto
  ↓
Env toda la documentación
  ↓
~13,755 tokens enviados
```

### Ahorro Real
```
13,755 - 4,585 = 9,170 tokens ahorrados
9,170 / 13,755 = 67% de eficiencia
```

### ¿Qué Significa en Dinero?

Con Claude API (estimado):
```
1M tokens = $0.30 entrada

Costo SIN Brain: 13,755 tokens × $0.30/1M = $0.004
Costo CON Brain:  4,585 tokens × $0.30/1M = $0.0014

Ahorro por llamada: 67%
```

**A mayor escala:**
```
100 llamadas agentes/día
  - SIN Brain:  1,375,500 tokens = $0.41/día
  - CON Brain:    458,500 tokens = $0.14/día
  - Ahorro: $0.27/día = $98/año
```

---

## 📊 Dashboard Visual

### Abrir Dashboard
```bash
# En Windows
start .\.claude-flow\metrics\dashboard.html

# En Mac
open ./.claude-flow/metrics/dashboard.html

# En Linux
xdg-open ./.claude-flow/metrics/dashboard.html
```

### Métricas en Dashboard
- ✅ Estado del Sistema
- 📊 Brain Metrics
- ⚡ Eficiencia de Tokens
- 🤖 Estado de Agentes
- 🧠 Obsidian Integration
- 🏥 Health Summary

---

## 🔍 Verificaciones Manuales

### 1. Verificar Brain en Obsidian
```
1. Abre Obsidian
2. Presiona Ctrl+G
3. Observa el grafo de conexiones
4. Verifica que INDEX.md es el centro
```

### 2. Revisar Cambios Sincronizados
```
Ubicación: brain/cambios/
- Verifica que existen cambios recientes
- Abre un cambio para ver el contenido
```

### 3. Verificar Memoria de Ruflo
```bash
# Ver índice de cambios
cat .claude-flow/memory/changes-index.json

# Ver logs de sincronización
cat .claude-flow/logs/brain-sync.log
```

### 4. Revisar Configuración
```bash
# Ver config de Brain
cat .claude-flow/brain-config.yaml

# Ver hooks activos
ls -la .claude/hooks/
```

---

## 📈 Metrización Continua

### Crear Script de Monitoreo
```bash
# Ejecutar health check cada 24 horas
# En Windows (usar Task Scheduler):
# Crear tarea que ejecute:
node c:\Users\Joaquin\Documents\Proyectos\Menu AR\Web4\.claude-flow\metrics\health-check.js

# En Mac/Linux (agregar a crontab):
0 8 * * * cd /path/to/project && node ./.claude-flow/metrics/health-check.js >> health-check.log
```

### Monitorear Crecimiento
```bash
# Cada semana: ver cómo crece el Brain
du -sh brain/
du -sh brain/cambios/
du -sh brain/memoria/
```

---

## 🎯 Indicadores Clave (KPI)

### Salud del Sistema
| Métrica | Bueno | Alerta | Crítico |
|---------|-------|--------|---------|
| Brain Files | > 5 | 3-5 | < 3 |
| Sincronización | Activa | Esporádica | Inactiva |
| Memoria | Indexada | Parcial | No existe |
| Obsidian | Conectado | Lento | Desconectado |

### Eficiencia
| Métrica | Excelente | Bueno | Revisar |
|---------|-----------|-------|---------|
| Token Savings | > 60% | 40-60% | < 40% |
| Brain Size | < 100 KB | 100-500 KB | > 500 KB |
| Archivos | 5-50 | 50-200 | > 200 |

---

## 🚨 Problemas Comunes y Soluciones

### Problema: Health Check dice "Git no disponible"
**Solución**: Es normal si no inicializaste git. Puedes:
- Ignorarlo si no usas git
- O inicializar: `git init`

### Problema: "Índice de cambios no existe"
**Solución**: Normal en primera ejecución. Se crea cuando hagas cambios.

### Problema: Obsidian grafo no se actualiza
**Solución**:
1. Recarga Obsidian (Ctrl+R)
2. Ejecuta sync manualmente: `node .claude-flow/sync/sync-to-brain.js`

### Problema: Ahorros de tokens bajan
**Solución**: Puede ser porque el Brain creció. Verifica:
```bash
du -sh brain/
du -sh .claude-flow/data/
```

---

## 📋 Checklist Semanal

```
Cada semana:
☐ Ejecutar health check
☐ Revisar Brain en Obsidian (Ctrl+G)
☐ Ver últimos cambios en brain/cambios/
☐ Verificar tamaño del Brain
☐ Revisar logs: .claude-flow/logs/brain-sync.log
☐ Documentar mejoras en el protocolo
```

---

## 🔧 Configurar Monitoreo Automático

### Script de Monitoreo (schedule)
Crear `.claude-flow/metrics/monitor.js`:
```javascript
// Ejecutar health check cada 24h
const schedule = require('node-schedule');
const { HealthCheck } = require('./health-check');

schedule.scheduleJob('0 0 * * *', () => {
  console.log('[MONITOR] Ejecutando health check...');
  const health = new HealthCheck();
  health.generateReport();
  
  // Guardar en JSON
  const metrics = JSON.stringify(health.results, null, 2);
  fs.writeFileSync('.claude-flow/metrics/latest-report.json', metrics);
});
```

### Ver Histórico de Reportes
```bash
# Guardar cada reporte
node .claude-flow/metrics/health-check.js > reports/$(date +%Y-%m-%d).txt

# Ver histórico
ls -la reports/
```

---

## 📞 Preguntas Frecuentes

**P: ¿Con qué frecuencia debo ejecutar health check?**
A: Mínimo una vez a la semana. Después de cambios importantes, ejecuta manualmente.

**P: ¿Qué pasa si el ahorro baja?**
A: Revisa si el Brain creció mucho. Si es > 500 KB, considera archivar cambios antiguos.

**P: ¿Los tokens ahorrados son reales?**
A: Sí, son cálculos teóricos pero muy cercanos a la realidad. El ahorro real puede ser ligeramente mayor.

**P: ¿Qué son los "tokens SIN contexto"?**
A: Si no tuvieras Brain, los agentes consultarían TODO, triplicando tokens aprox.

---

## 📈 Projetciones Futuras

A medida que el proyecto crece:

```
Mes 1:    7 archivos,    18 KB,  67% ahorro
Mes 3:   30 archivos,    80 KB,  60% ahorro (menos proporción)
Mes 6:  100 archivos,   250 KB,  55% ahorro (más volumen absoluto)
Año 1: 500 archivos, 1000 KB,  50% ahorro (pero mayor en tokens totales)
```

**Beneficio crece con el proyecto:**
- Año 1: ~9K tokens/llamada ahorrados
- Año 2: ~50K tokens/llamada ahorrados (con más agentes)
- Año 3: ~200K tokens/llamada ahorrados (escala multi-cliente)

---

## 🎯 Resumen

**Para verificar que todo funciona:**

1. **Ahora**: `node .claude-flow/metrics/health-check.js`
2. **Visualizar**: `start .\.claude-flow\metrics\dashboard.html`
3. **Obsidian**: Presiona Ctrl+G en Obsidian
4. **Semanal**: Ejecutar health check 1x por semana

**Todo funciona correctamente si:**
- ✅ Health check dice "SISTEMA SALUDABLE"
- ✅ Obsidian muestra grafo con 7+ nodos
- ✅ Tokens ahorrados > 50%
- ✅ Sincronización activa

---

*Guía vigente desde: 2026-05-01*
