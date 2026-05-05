# 🚀 Guía Rápida de Desarrollo - Dataverse Rentals

## Acceso Rápido

**URL del servidor**: http://localhost:5173/

### Credenciales de Login
- Email: `cualquier email`
- Contraseña: `cualquier contraseña`

---

## 📍 Navegación en la Aplicación

Después de hacer login, accedes al **Dashboard** desde donde puedes navegar hacia:

1. **Dashboard** → Panel principal con estadísticas
2. **Departments** → Gestión de departamentos/propiedades
3. **Tenants** → Listado de inquilinos
4. **Contracts** → Gestión de contratos
5. **Readings** → Lecturas de servicios
6. **Settlements** → Liquidaciones
7. **Payments** → Registro de pagos
8. **Settings** → Configuración del sistema

---

## 🛠️ Modificar Datos de Prueba

### Opción 1: Usando archivo centralizado (Recomendado)

Todos los datos están en: `src/data/mockData.js`

Estructura:
```javascript
export const mockData = {
  tenants: [...],
  departments: [...],
  contracts: [...],
  // etc
}
```

**Ventaja**: Cambias datos una sola vez y se aplican en toda la app.

### Opción 2: Editar directamente en componentes

**Archivos de vistas** (cada uno tiene su propio `ref` con datos):
- `src/views/TenantsView.vue`
- `src/views/DepartmentsView.vue`
- `src/views/ContractsView.vue`
- `src/views/ReadingsView.vue`
- `src/views/SettlementsView.vue`
- `src/views/PaymentsView.vue`

---

## 🎨 Cambiar Colores

**Archivo**: `tailwind.config.js`

Encontrarás la sección de colores:
```javascript
colors: {
  "primary": "#00375e",           // Color principal
  "secondary": "#516072",         // Color secundario
  "error": "#ba1a1a",            // Color de error
  // ... más colores
}
```

Modifica los valores HEX según necesites.

---

## ➕ Agregar una Nueva Vista

### Paso 1: Crear componente
Crea archivo `src/views/NuevaVista.vue`:

```vue
<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-primary mb-6">Mi Nueva Vista</h1>
      <!-- Tu contenido aquí -->
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '../components/DashboardLayout.vue';
</script>
```

### Paso 2: Registrar ruta
En `src/router/index.js`, agrega:

```javascript
{
  path: '/nueva-vista',
  name: 'NuevaVista',
  component: () => import('../views/NuevaVista.vue'),
}
```

### Paso 3: Agregar al menú
En `src/components/DashboardLayout.vue`, agrega en el array `menuItems`:

```javascript
{ id: 9, label: 'Nueva Vista', icon: 'star', path: '/nueva-vista' }
```

---

## 🔄 Estructura de un Componente Vue

```vue
<template>
  <!-- HTML aquí -->
  <div class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-6">
    <h2 class="text-lg font-bold text-primary">Título</h2>
    <p class="text-on-surface-variant">Descripción</p>
  </div>
</template>

<script setup>
// Lógica aquí
import { ref, computed } from 'vue';
import DashboardLayout from '../components/DashboardLayout.vue';

const data = ref([]);
const filtered = computed(() => {
  // lógica de filtrado
});
</script>

<style scoped>
/* Estilos locales */
</style>
```

---

## 🎯 Clases Tailwind Útiles

```css
/* Colores */
.text-primary              /* Texto azul */
.bg-surface-container      /* Fondo gris claro */
.border-outline-variant    /* Borde */

/* Espaciado */
.p-6                       /* Padding */
.mb-8                      /* Margin bottom */
.gap-4                     /* Gap en flex/grid */

/* Estilos */
.font-bold                 /* Texto grueso */
.rounded-xl                /* Bordes redondeados */
.shadow-sm                 /* Sombra pequeña */
.transition-all            /* Transición */
.hover:opacity-95          /* Hover */
```

---

## 🔍 Material Design Icons

Usa iconos de Material Symbols en span:

```vue
<span class="material-symbols-outlined">dashboard</span>
<span class="material-symbols-outlined">settings</span>
<span class="material-symbols-outlined">email</span>
```

Lista completa: https://fonts.google.com/icons?icon.set=Material+Symbols

---

## 📊 Patrón de Tabla Reutilizable

```vue
<table class="w-full">
  <thead class="bg-surface-container border-b border-outline-variant/20">
    <tr>
      <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
        Columna 1
      </th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="item in items" :key="item.id"
        class="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors">
      <td class="px-6 py-4 text-sm text-on-surface">{{ item.name }}</td>
    </tr>
  </tbody>
</table>
```

---

## 🔗 Enlaces Útiles

- **Vue.js 3**: https://vuejs.org
- **Vite**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Vue Router**: https://router.vuejs.org
- **Material Design**: https://m3.material.io

---

## ⚡ Tips de Desarrollo

1. **Hot Reload**: Los cambios en archivos `.vue` y `.css` se actualizan automáticamente
2. **DevTools**: Usa Vue DevTools para inspeccionar componentes
3. **Network**: En modo desarrollo, abre DevTools (F12) → Network para ver las requests
4. **Console**: Usa `console.log()` para debug

---

## 📦 Agregar Nuevas Dependencias

```bash
npm install nombre-paquete
```

---

**Última actualización**: 26 de abril de 2026
