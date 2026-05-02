# 🔧 Protocolo de Acción para Agentes

Guía que TODOS los agentes deben seguir antes de tomar cualquier acción.

---

## 1️⃣ ANTES DE ACTUAR

### Paso 1: Revisar el Brain
- [ ] Leer [[contexto|CONTEXTO_GENERAL]]
- [ ] Revisar [[agentes|AGENTES_DISPONIBLES]]
- [ ] Consultar [[cambios|historial reciente]]
- [ ] Verificar [[decisiones|decisiones arquitectónicas]]

### Paso 1B: ⚠️ REVISAR MODULARIDAD (CRÍTICO)
- [ ] Leer [[RESTRICCIONES_MODULARIDAD|restricciones de modularidad]]
- [ ] ¿Mi cambio es 100% compatible hacia atrás?
- [ ] ¿Rompo algún cliente existente?
- [ ] Si hay duda → PREGUNTAR AL USUARIO, no asumir

### Paso 2: Verificar Responsabilidades
- [ ] ¿Es mi responsabilidad?
- [ ] ¿Hay conflicto con otro agente?
- [ ] ¿Necesito coordinación?

### Paso 3: Validar Contexto
- [ ] ¿Tengo toda la información?
- [ ] ¿Hay cambios recientes que impacten?
- [ ] ¿Hay restricciones activas?

---

## 2️⃣ DURANTE LA ACCIÓN

### Comunicación
- Reportar en [[memoria|sesiones]] qué estoy haciendo
- Actualizar estado en tiempo real
- Avisar si encuentro conflictos

### Ejecución
- Hacer cambios incrementales
- Crear un cambio por acción
- Registrar razonamiento

---

## 3️⃣ DESPUÉS DE LA ACCIÓN

### Registro
- [ ] Crear entrada en [[cambios]]
- [ ] Actualizar [[memoria|sesiones]]
- [ ] Documentar resultados

### Comunicación
- Notificar a agentes relacionados
- Actualizar [[contexto]]
- Marcar dependencias en [[decisiones]]

---

## 🚨 Casos Especiales

### Conflicto Detectado
1. PAUSAR inmediatamente
2. Reportar en [[memoria|conflictos]]
3. Esperar coordinación

### Cambio Externo
1. Revisar qué cambió
2. Actualizar contexto mental
3. Continuar con nueva información

### Fallo en Ejecución
1. Registrar error
2. Reportar en [[memoria|errores]]
3. Solicitar ayuda humana si es crítico

---

## ✅ Checklist Rápido

Antes de CUALQUIER acción:
- ✓ Brain actualizado
- ✓ Sin conflictos identificados
- ✓ Contexto claro
- ✓ Responsabilidad confirmada
- ✓ Reportado en memoria

---

*Protocolo vigente desde 2026-05-01*
