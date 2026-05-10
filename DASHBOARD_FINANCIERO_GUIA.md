# Dashboard de Ayuda (Toma de Decisiones)

## Descripción

El **Dashboard Financiero de Milano & Asociados** es una herramienta de inteligencia de negocios diseñada para permitir a la gerencia tomar decisiones informadas basadas en KPIs financieros en tiempo real.

## Características Principales

### 1. **KPIs Financieros en Vivo**

El dashboard muestra cuatro indicadores clave que se actualizan automáticamente:

#### **Ocupación** 🏢
- **Métrica**: Porcentaje de departamentos ocupados
- **Cálculo**: `(Departamentos Ocupados / Total Departamentos) × 100`
- **Importancia**: Indica la salud operativa de la cartera inmobiliaria
- **Ejemplo**: Si hay 6 ocupados de 10, la ocupación es 60%

#### **Morosidad** ⚠️
- **Métrica**: Monto en pesos de boletas vencidas no pagadas
- **Cálculo**: Suma de montos totales de boletas con `estado_boleta = 'PENDIENTE'` y `fecha_vencimiento < hoy`
- **Importancia**: Indica flujo de caja en riesgo y necesidad de gestión de cobranza
- **Alerta Crítica**: Cuando > S/. 5,000

#### **Ingresos Procesados** 💰
- **Métrica**: Total de dinero recaudado de inquilinos
- **Cálculo**: Suma de `monto_pagado` de todos los pagos con `estado_validacion = 'APROBADO'`
- **Desglose**:
  - Alquileres: Ingresos principales
  - Servicios (Agua, Luz): Ingresos complementarios
  - Mantenimiento: Ingresos por cuotas de mantenimiento
- **Importancia**: Mide la salud financiera y capacidad para cubrir gastos operativos

#### **Total Departamentos** 🏠
- **Métrica**: Número total de unidades disponibles y ocupadas
- **Subtítulo**: Muestra cuántos están disponibles para alquilar
- **Importancia**: Referencia para calcular ocupación y potencial de ingresos

### 2. **Gráficos Visuales**

#### **Gráfico de Ocupación (Pie Chart)**
- Visualiza proporción de departamentos ocupados vs disponibles
- Ayuda a identificar oportunidades de mercadeo
- Dos columnas adicionales muestran números exactos

#### **Análisis de Morosidad**
- Muestra monto total en mora y cantidad de boletas pendientes
- Barra de progreso: Comparación entre boletas pagadas vs pendientes
- Tasa de Cobranza: Porcentaje de boletas cobradas
- Indicadores clave para estrategia de cobranza

#### **Ingresos Financieros**
- Desglose detallado de ingresos por categoría
- Promedio de ingreso por boleta pagada
- Vista clara de fuentes de ingresos

### 3. **Sistema de Alertas Inteligente**

El dashboard genera alertas automáticas cuando:

| Alerta | Condición | Acción |
|--------|-----------|--------|
| 🔴 **CRÍTICA: Morosidad** | Monto en mora > S/. 5,000 | Requiere acción inmediata de cobranza |
| 🟠 **ADVERTENCIA: Baja Ocupación** | Ocupación < 50% | Activar estrategias de marketing/promoción |
| 🟠 **ADVERTENCIA: Ingresos Bajos** | Ingresos < S/. 10,000 | Revisar estado de cobros pendientes |

## Impacto en Vivo - Cómo Funciona

### Actualización Automática en Tiempo Real

El dashboard está conectado directamente al store reactivo de Vue. Esto significa:

```
1. Usuario registra nueva BOLETA en "Finanzas > Boletas"
   ↓
2. Store reactivo se actualiza automáticamente
   ↓
3. Computadores en useStore.js recalculan KPIs
   ↓
4. Dashboard muestra nuevos valores instantáneamente
```

### Ejemplo de Impacto en Vivo

**Escenario**: Inquilino paga una boleta pendiente

1. **Antes**: 
   - Morosidad: S/. 2,080.00
   - Boletas Pendientes: 2
   - Ingresos: S/. 10,197.50

2. **Se registra pago** en "Finanzas > Pagos"
   
3. **Después** (automático, sin recargar):
   - Morosidad: S/. 0.00 (si no hay más boletas atrasadas)
   - Boletas Pendientes: 1
   - Ingresos: S/. 12,307.50
   - Ocupación y alertas se ajustan dinámicamente

### Componentes Reactivos

Los siguientes elementos en [src/store/useStore.js](src/store/useStore.js) son **computadores** que recalculan automáticamente:

```javascript
// Estos se actualizan SIEMPRE que cambien los datos fuente:
- totalDepartamentos
- ocupacion
- morosidad
- boletasPendientes
- ingresos
- boletasPagadas
- departamentosOcupados
- departamentosDisponibles
```

## Cómo Usar el Dashboard

### Acceso

1. **Iniciar sesión** como Admin
   - Email: `admin@dataverserentals.com`
   - Contraseña: `123456`

2. **Navegar** a "Finanzas > Dashboard Financiero"
   - O usar la ruta: `/admin/financial-dashboard`

### Interpretación de Datos

#### Para la Gerencia (Toma de Decisiones)

1. **Ocupación Baja** → Aumentar presupuesto de marketing
2. **Morosidad Alta** → Activar protocolo de cobranza judicial
3. **Ingresos Bajos** → Revisar estado de deudores morosos
4. **Tendencia Positiva** → Validar que operaciones son sostenibles

#### Para el Departamento Financiero

- **Morosidad**: Priorizar cobros de boletas vencidas
- **Desglose de Ingresos**: Validar que todas las fuentes se están cobrando
- **Tasa de Cobranza**: Comparar vs mes anterior para medir mejora

## Actualización Manual

Si la actualización automática falla, use el botón **"Actualizar"** que recarga los datos del store.

## Datos de Prueba (Mock Data)

### Boletas Disponibles en el Sistema

| ID | Período | Monto Total | Estado |
|----|---------|-------------|--------|
| 1 | 2024-04 | S/. 1,652.50 | PAGADA |
| 2 | 2024-04 | S/. 2,080.00 | PENDIENTE |
| 3 | 2024-05 | S/. 1,665.00 | PAGADA |
| 4 | 2024-05 | S/. 2,100.00 | PAGADA |
| 5 | 2024-06 | S/. 1,650.00 | PAGADA |
| 6 | 2024-06 | S/. 2,120.00 | PAGADA |
| 7 | 2024-07 | S/. 1,643.00 | PENDIENTE |
| 8 | 2024-07 | S/. 2,110.00 | PAGADA |

### Departamentos (50% Ocupación)

- **Ocupados**: 5 departamentos
- **Disponibles**: 5 departamentos
- **Total**: 10 departamentos

## Archivos Relacionados

### Componentes

- [KPICard.vue](src/components/dashboard/KPICard.vue) - Tarjeta individual de KPI
- [OcupacionChart.vue](src/components/dashboard/OcupacionChart.vue) - Gráfico de ocupación
- [MorosidadChart.vue](src/components/dashboard/MorosidadChart.vue) - Análisis de morosidad
- [IngresosChart.vue](src/components/dashboard/IngresosChart.vue) - Desglose de ingresos
- [AlertasChart.vue](src/components/dashboard/AlertasChart.vue) - Sistema de alertas
- [FinancialDashboard.vue](src/components/dashboard/FinancialDashboard.vue) - Dashboard principal

### Vistas

- [FinancialDashboardView.vue](src/views/admin/FinancialDashboardView.vue) - Vista del dashboard

### Store

- [useStore.js](src/store/useStore.js) - Lógica reactiva y cálculos de KPIs

### Datos

- [mockData.js](src/data/mockData.js) - Datos de prueba

## Mejoras Futuras

1. **Exportar reportes** a PDF/Excel
2. **Comparación período vs período** (mes anterior, año anterior)
3. **Predicción de morosidad** usando histórico
4. **Notificaciones en tiempo real** cuando se alcanzan ciertos umbrales
5. **Análisis de rentabilidad** por departamento/edificio
6. **Dashboard para inquilinos** (versión tenant)

## Notas Técnicas

- **Framework**: Vue 3.5.33
- **Gráficos**: Chart.js + vue-chartjs
- **Estilos**: Tailwind CSS
- **UI Components**: PrimeVue
- **Reactividad**: Computed properties de Vue 3
- **Ruteo**: Vue Router 5.0.6

---

**Última actualización**: Mayo 2026  
**Autor**: Sistema DataVerse Rentals
