# 🤖 Agentes Disponibles en Ruflo

Listado de agentes disponibles y sus responsabilidades. Los agentes **DEBEN** consultar esta página antes de actuar para evitar conflictos.

## Agentes Core

### Ruflo-Core
- **Responsabilidad**: Orquestación central y coordinación
- **Consulta**: Antes de cualquier acción importante
- **Contacto**: core@ruflo

### Ruflo-Autopilot
- **Responsabilidad**: Automatización y tareas repetitivas
- **Consulta**: Para tareas automáticas o cíclicas
- **Contacto**: autopilot@ruflo

### Ruflo-Swarm
- **Responsabilidad**: Coordinación de múltiples agentes
- **Consulta**: Para trabajos paralelos o distribuidos
- **Contacto**: swarm@ruflo

### Ruflo-Federation
- **Responsabilidad**: Integración con sistemas externos
- **Consulta**: Para integración con terceros
- **Contacto**: federation@ruflo

## Protocolo de Coordinación

**ANTES de actuar:**
1. ✅ Revisar esta página
2. ✅ Consultar [[decisiones]]
3. ✅ Revisar [[cambios]] recientes
4. ✅ Verificar responsabilidades de otros agentes
5. ✅ Reportar acciones en [[memoria]]

## Matriz de Responsabilidades

| Agente | Frontend | Backend | BD | DevOps | Testing |
|--------|----------|---------|----|----|---------|
| Core | ✓ | ✓ | ✓ | ✓ | - |
| Autopilot | ✓ | - | - | ✓ | ✓ |
| Swarm | ✓ | ✓ | - | - | - |
| Federation | - | ✓ | ✓ | - | - |

---

*Mantener actualizado para evitar conflictos y duplicación*
