# Guía de Prueba - Impacto en Vivo del Dashboard

## Objetivo
Demostrar cómo el dashboard se actualiza automáticamente cuando se registran datos en otros módulos.

## Escenarios de Prueba

### Escenario 1: Registrar Nuevo Pago

**Objetivo**: Reducir morosidad e incrementar ingresos en vivo

**Pasos**:

1. **Abrir Dashboard Financiero**
   - Ir a: `/admin/financial-dashboard`
   - Anotar valores actuales:
     - Morosidad: __________
     - Ingresos: __________
     - Boletas Pendientes: __________

2. **Crear Pago por Boleta Pendiente**
   - Ir a: `Finanzas > Pagos`
   - Crear pago para boleta #2 (CTR-2024-002, período 2024-04)
   - Monto: S/. 2,080.00
   - Estado: APROBADO

3. **Actualizar Boleta a PAGADA**
   - Ir a: `Finanzas > Boletas`
   - Cambiar boleta #2 de PENDIENTE a PAGADA

4. **Volver a Dashboard Financiero**
   - **SIN RECARGAR LA PÁGINA**
   - Verificar cambios:
     - ✓ Morosidad debe disminuir
     - ✓ Ingresos deben aumentar en S/. 2,080.00
     - ✓ Boletas Pendientes debe pasar de 2 a 1
     - ✓ Alerta "Morosidad Crítica" debe cambiar de estado

**Resultado Esperado**:
```
ANTES:
- Morosidad: S/. 3,723.00 (2 boletas: #2 + #7)
- Ingresos: S/. 10,197.50
- Boletas Pendientes: 2

DESPUÉS (automático):
- Morosidad: S/. 1,643.00 (solo #7)
- Ingresos: S/. 12,277.50 (+2,080)
- Boletas Pendientes: 1
```

---

### Escenario 2: Cambiar Estado de Ocupación

**Objetivo**: Demostrar actualización de ocupación en tiempo real

**Pasos**:

1. **Anotar Ocupación Actual**
   - Dashboard: Ocupación = 50% (5 de 10)

2. **Ocupar Departamento Disponible**
   - Ir a: `Inmuebles > Departamentos`
   - Cambiar departamento #3 (401) de DISPONIBLE a OCUPADO

3. **Volver a Dashboard**
   - ✓ Ocupación debe actualizar a 60% (6 de 10)
   - ✓ Gráfico pie debe cambiar proporción
   - ✓ Alerta "Baja Ocupación" desaparece

**Resultado Esperado**:
```
ANTES:
- Ocupación: 50%
- Ocupados: 5
- Disponibles: 5

DESPUÉS (automático):
- Ocupación: 60%
- Ocupados: 6
- Disponibles: 4
```

---

### Escenario 3: Agregar Nueva Boleta

**Objetivo**: Generar nueva morosidad y modificar ingresos pendientes

**Pasos**:

1. **Abrir Boletas**
   - Ir a: `Finanzas > Boletas`
   - Crear nueva boleta:
     - Contrato: CTR-2024-001
     - Período: 2024-08
     - Fecha Vencimiento: 2024-08-05 (fecha pasada para simular mora)
     - Monto Total: S/. 1,643.00
     - Estado: PENDIENTE

2. **Volver a Dashboard**
   - ✓ Morosidad debe incrementar
   - ✓ Boletas Pendientes debe incrementar
   - ✓ Alerta crítica puede reactivarse

**Resultado Esperado**:
```
Con nueva boleta pendiente:
- Morosidad: incrementa en S/. 1,643.00
- Boletas Pendientes: +1
- KPIs de ingresos se ajustan
```

---

## Verificación de Impacto en Vivo

### Checklist de Prueba

- [ ] Los KPIs se actualizan **sin recargar la página**
- [ ] Los gráficos se redibujan automáticamente
- [ ] Las alertas cambian dinámicamente
- [ ] El cálculo de morosidad es correcto (boletas vencidas PENDIENTES)
- [ ] El cálculo de ocupación es correcto (departamentos OCUPADOS / total)
- [ ] El cálculo de ingresos es correcto (suma de pagos APROBADOS)
- [ ] Las barras de progreso se actualizan
- [ ] El porcentaje de ocupación se recalcula
- [ ] La tasa de cobranza se actualiza

### Indicadores de Éxito

✅ **Impacto en Vivo Funcionando** si:
1. Cambias datos en otros módulos
2. Vuelves al dashboard **sin recargar**
3. Los valores se actualizan automáticamente
4. Los gráficos reflejan los nuevos datos
5. Las alertas cambian según nuevas condiciones

---

## Prueba Avanzada: Multisesión

**Objetivo**: Verificar que el store está centralizado

**Pasos**:

1. Abrir Dashboard en pestaña A
2. Abrir Pagos en pestaña B
3. En pestaña B: Registrar pago que reduce morosidad
4. Volver a pestaña A **sin recargar**
5. Verificar que morosidad bajó automáticamente

**Resultado**: El store reactivo sincroniza ambas vistas.

---

## Datos Usados en Pruebas

### Boletas PENDIENTES (Morosidad)

| ID | Período | Vencimiento | Monto | Estado |
|----|---------|-------------|-------|--------|
| 2 | 2024-04 | 2024-04-15 | S/. 2,080.00 | PENDIENTE |
| 7 | 2024-07 | 2024-07-05 | S/. 1,643.00 | PENDIENTE |

**Total Morosidad Actual**: S/. 3,723.00

### Departamentos DISPONIBLES (Ocupación)

| ID | Número | Piso | Estado |
|----|--------|------|--------|
| 3 | 401 | 4 | DISPONIBLE |
| 6 | 501 | 5 | DISPONIBLE |
| 9 | 502 | 5 | DISPONIBLE |
| 10 | 202 | 2 | DISPONIBLE |
| (más uno) | - | - | DISPONIBLE |

**Total Disponibles**: 5  
**Total Ocupados**: 5  
**Ocupación Actual**: 50%

---

## Solución de Problemas

### Problema: Los KPIs no se actualizan

**Solución 1**: Verificar que el store está correctamente conectado
```javascript
// En FinancialDashboard.vue
console.log(store.morosidad.value) // Debe ser un computed
```

**Solución 2**: Verificar que los datos se actualizan en store.state
```javascript
// En consola
store.state.boletas
store.state.pagos
```

**Solución 3**: Forzar actualización con botón
- Click en "Actualizar"

### Problema: Gráficos no se renderizan

- Verificar que Chart.js está instalado: `npm list chart.js`
- Verificar que vue-chartjs está importado en componentes

### Problema: Alertas no aparecen

- Verificar que los valores cumplen condiciones en AlertasChart.vue
- Checkpoints de debug:
  - Morosidad > 5000 → CRÍTICA
  - Ocupación < 50 → ADVERTENCIA
  - Ingresos < 10000 → ADVERTENCIA

---

## Cómo Funciona Técnicamente

```
Usuario Modifica Dato en Finanzas > Pagos
    ↓
store.state.pagos se actualiza (reactivo)
    ↓
Computed property 'ingresos' se recalcula
Computed property 'boletasPendientes' se recalcula
Computed property 'morosidad' se recalcula
    ↓
Componentes vinculados a estos computed properties
se re-renderizan automáticamente
    ↓
Dashboard muestra nuevos valores
    ↓
Gráficos se redibujan
Alertas se regeneran
```

## Notas

- El impacto en vivo funciona porque usamos **Composition API de Vue 3**
- Los `computed()` son reactivos y trackan dependencias automáticamente
- Los componentes están vinculados a los computed, no directamente al store.state
- La reactividad es de dos vías: cambio → actualización → render

---

**Última actualización**: Mayo 2026  
Guía de prueba para demostrar funcionalidad core del proyecto.
