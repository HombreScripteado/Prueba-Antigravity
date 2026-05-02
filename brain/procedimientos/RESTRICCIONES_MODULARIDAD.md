# 🔐 RESTRICCIONES DE MODULARIDAD

**CRÍTICO**: Este proyecto DEBE mantener 100% compatibilidad hacia atrás. Ningún módulo nuevo puede romper los existentes.

---

## 🎯 Principio Fundamental

```
NUEVA FUNCIONALIDAD = SUMA, NO CAMBIO

Permitido:  ✅ Agregar componentes, props, funciones nuevas
Prohibido:  ❌ Modificar props existentes, borrar funciones, cambiar comportamiento
```

---

## 📋 Reglas Inmutables

### Regla 1: Props son Sagradas
```typescript
// ✅ PERMITIDO: Agregar prop nueva
interface ButtonProps {
  label: string;        // EXISTENTE - INVIOLABLE
  variant?: "primary" | "secondary"; // NUEVO - OK
}

// ❌ PROHIBIDO: Modificar prop existente
interface ButtonProps {
  text: string;  // ERA "label" - ROMPE MÓDULOS EXISTENTES
}
```

### Regla 2: Componentes Existentes No Cambian
```tsx
// ✅ PERMITIDO: Nuevo componente
export function CustomButton() { ... }

// ❌ PROHIBIDO: Cambiar comportamiento existente
export function Button() {  // Era así antes
  // Este componente NUNCA puede cambiar su comportamiento
}
```

### Regla 3: APIs No Evolucionan, Se Extienden
```typescript
// ✅ PERMITIDO: Función sobrecargada
function formatPrice(price: number): string;
function formatPrice(price: number, currency: string): string;
function formatPrice(price: number, currency?: string) { ... }

// ❌ PROHIBIDO: Cambiar firma
// function formatPrice(amount: number) => cambiar parámetro nombre
```

### Regla 4: Configuraciones Heredan, No Remplazan
```yaml
# ✅ PERMITIDO: Extender configuración
cliente_premium:
  extends: cliente_default  # Hereda TODO
  custom_color: "#FF0000"   # Solo agrega

# ❌ PROHIBIDO: Sobrescribir
cliente_premium:
  menu_items: 5  # ERA 10 - ROMPE CLIENTES EXISTENTES
```

---

## 🏗️ Arquitectura de Modularidad

```
Proyecto Menu AR
│
├── [Core Inmutable]  ← NUNCA CAMBIAR
│   ├── components/base/
│   ├── hooks/core/
│   ├── types/core.ts
│   └── utils/core.ts
│
├── [Extensiones]  ← Agregar aquí
│   ├── components/custom/
│   ├── features/*/
│   ├── integrations/*/
│   └── plugins/*/
│
└── [Clientes]  ← Herdan + Personalizan
    ├── cliente-a/
    ├── cliente-b/
    └── cliente-c/
```

---

## ✅ Checklist Pre-Cambio

**ANTES de hacer CUALQUIER modificación, los agentes deben:**

- [ ] ¿Estoy modificando un archivo core?
  - SÍ → ¿Es completamente hacia atrás compatible?
  - NO → Permitido

- [ ] ¿Cambio props/tipos?
  - SÍ → ¿Agrego opcionales sin modificar existentes?
  - NO → ❌ PROHIBIDO

- [ ] ¿Borro o renombro funciones?
  - SÍ → ❌ PROHIBIDO (crear nueva versión con v2 si es necesario)
  - NO → Continúa

- [ ] ¿Cambio comportamiento existente?
  - SÍ → ❌ PROHIBIDO
  - NO → Permitido

- [ ] ¿Afecta a configuraciones de clientes?
  - SÍ → ¿Mantengo compatibilidad?
  - NO → ❌ PROHIBIDO

---

## 🎨 Casos de Uso: Lo que SÍ se puede hacer

### Caso 1: Agregar Nuevas Opciones de Diseño
```typescript
// ✅ CORRECTO
interface ThemeConfig {
  colors: {
    primary: string;           // EXISTENTE
    secondary: string;         // EXISTENTE
    accent?: string;           // NUEVO - opcional
    gradientSupport?: boolean; // NUEVO - opcional
  }
}
```

### Caso 2: Extender un Componente
```tsx
// ✅ CORRECTO
interface MenuProps {
  items: MenuItem[];           // EXISTENTE
  onSelect: (item) => void;   // EXISTENTE
  animationDuration?: number;  // NUEVO
  customRenderer?: Component;  // NUEVO
}
```

### Caso 3: Agregar Nuevas Categorías
```typescript
// ✅ CORRECTO
enum CategoryType {
  FOOD = "food",          // EXISTENTE
  DRINKS = "drinks",      // EXISTENTE
  DESSERTS = "desserts",  // NUEVO
  PREMIUM = "premium"     // NUEVO
}
```

---

## ❌ Casos Prohibidos: Lo que NO se puede hacer

### ❌ NO: Cambiar nombres de props
```typescript
// ANTES
interface ButtonProps {
  label: string;
}

// DESPUÉS (PROHIBIDO)
interface ButtonProps {
  text: string;  // ← ROMPE CÓDIGO EXISTENTE
}
```

### ❌ NO: Cambiar tipos
```typescript
// ANTES
function getMenuItems(): MenuItem[] { }

// DESPUÉS (PROHIBIDO)
function getMenuItems(): MenuItemV2[] { }  // Tipo diferente
```

### ❌ NO: Cambiar comportamiento por defecto
```typescript
// ANTES
<Menu columns={3} /> // 3 columnas por defecto

// DESPUÉS (PROHIBIDO)
<Menu columns={2} /> // Ahora 2 columnas por defecto - ROMPE CLIENTES
```

### ❌ NO: Borrar configuraciones
```yaml
# ANTES
client_config:
  logo_size: large
  menu_position: top

# DESPUÉS (PROHIBIDO)
client_config:
  menu_position: top
  # logo_size: BORRADO - ROMPE CLIENTES EXISTENTES
```

---

## 🔄 Cómo Actualizar sin Romper

### Escenario: Queremos mejorar formatPrice()
```typescript
// MAL: Cambiar directamente
function formatPrice(amount: number): string {
  // Cambio la lógica completamente
}

// BIEN: Versión nueva, mantener antigua
function formatPrice(amount: number): string {
  // Original intacta
}

function formatPriceAdvanced(
  amount: number, 
  options?: { currency?: string; locale?: string }
): string {
  // Nueva versión mejorada
}

// Exportar ambas
export { formatPrice, formatPriceAdvanced };
```

### Escenario: Mejorar componente Button
```tsx
// MAL: Cambiar Button existente
export function Button({ size = "large" }: ButtonProps) { }

// BIEN: Crear ButtonV2 o ButtonImproved
export function Button({ size = "medium" }: ButtonProps) { }  // Original sin cambios

export function ButtonEnhanced({ 
  size = "large",
  ...newProps 
}: ButtonPropsEnhanced) { }

// Mantener ambas disponibles
```

---

## 📊 Matriz de Compatibilidad

| Acción | Permitido | Razón |
|--------|-----------|-------|
| Agregar prop opcional | ✅ | No rompe código existente |
| Cambiar nombre de prop | ❌ | Rompe cliente que la usa |
| Agregar nuevo componente | ✅ | No afecta existentes |
| Modificar componente core | ❌ | Afecta todos los clientes |
| Extender configuración | ✅ | Compatible hacia atrás |
| Borrar configuración | ❌ | Clientes la esperan |
| Mejorar performance | ✅ | Si el comportamiento es igual |
| Cambiar comportamiento | ❌ | Rompe clientes existentes |

---

## 🚨 Protocolo de Violación

Si un agente intenta violar estas reglas:

1. **Detectar**: Sistema de validación lo detecta
2. **Pausar**: Acción BLOQUEADA automáticamente
3. **Reportar**: Se registra en `memoria/violaciones/`
4. **Avisar**: Usuario es notificado inmediatamente
5. **Resolver**: Pedir aprobación manual del usuario

---

## 🎯 Para los Agentes

**ANTES de modificar CUALQUIER cosa:**

```
1. Revisar este documento
2. Verificar matriz de compatibilidad
3. Hacer checklist pre-cambio
4. SI hay duda → PREGUNTAR AL USUARIO
5. Proceder solo si es 100% compatible
```

---

## 📞 Preguntas de Referencia

**¿Puedo hacer esto?**

- "Agregar parámetro opcional a función existente" → ✅ SÍ
- "Cambiar nombre de parámetro" → ❌ NO
- "Crear nuevo componente" → ✅ SÍ
- "Modificar lógica de componente existente" → ❌ NO
- "Agregar nueva categoría" → ✅ SÍ
- "Borrar configuración vieja" → ❌ NO
- "Agregar tema nuevo" → ✅ SÍ
- "Cambiar tema por defecto" → ❌ NO

---

**🔐 Estas reglas son INVIOLABLES.**

*El proyecto debe servir a múltiples clientes sin romper a ninguno.*

Vigente desde: 2026-05-01
