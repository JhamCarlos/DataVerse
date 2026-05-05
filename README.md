# Dataverse Rentals - Sistema de Gestión

Proyecto Vue.js 3 + Vite que consolida todos los diseños HTML en un único sistema integrado de gestión de propiedades en arrendamiento.

## 📋 Descripción

Sistema de administración de propiedades que permite gestionar:
- **Inquilinos**: Registro y administración de residentes
- **Departamentos**: Control de inventario de propiedades
- **Contratos**: Gestión de acuerdos de arrendamiento
- **Lecturas de Medidores**: Registro de servicios (agua, electricidad, gas)
- **Liquidaciones**: Generación de reportes de pago
- **Pagos**: Seguimiento de transacciones
- **Configuración**: Ajustes del sistema

## 🛠️ Tecnologías

- **Vue.js 3** - Framework progresivo
- **Vite 5** - Build tool rápido y moderno
- **Vue Router 5** - Enrutamiento de aplicación
- **Tailwind CSS 3** - Framework de utilidades CSS
- **Material Design 3** - Sistema de diseño

## 📁 Estructura del Proyecto

```
src/
├── components/
│   └── DashboardLayout.vue      # Layout compartido con sidebar
├── views/
│   ├── LoginView.vue             # Autenticación
│   ├── DashboardView.vue         # Panel principal
│   ├── TenantsView.vue           # Gestión de inquilinos
│   ├── DepartmentsView.vue       # Gestión de departamentos
│   ├── ContractsView.vue         # Gestión de contratos
│   ├── ReadingsView.vue          # Lecturas de medidores
│   ├── SettlementsView.vue       # Liquidaciones
│   ├── PaymentsView.vue          # Pagos
│   ├── SettingsView.vue          # Configuración
│   └── NotFoundView.vue          # Página 404
├── router/
│   └── index.js                  # Configuración de rutas
├── App.vue                       # Componente raíz
├── main.js                       # Punto de entrada
└── style.css                     # Estilos globales
```

## 🚀 Instalación y Uso

### Requisitos previos
- Node.js 18+ 
- npm 9+

### Instalación

```bash
# Navegar a la carpeta del proyecto
cd dv_entals

# Instalar dependencias
npm install
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# El servidor estará disponible en http://localhost:5173/
```

### Producción

```bash
# Compilar para producción
npm run build

# Previsualizar build
npm run preview
```

## 🎨 Colores del Tema

El proyecto utiliza un sistema de colores Material Design 3:

- **Primario**: #00375e (Azul oscuro)
- **Secundario**: #516072 (Gris azulado)
- **Terciario**: #4c2e00 (Marrón)
- **Error**: #ba1a1a (Rojo)
- **Surface**: #f7f9fc (Blanco casi puro)

## 📱 Características

✅ Diseño Responsive (móvil + desktop)
✅ Navegación intuitiva con sidebar
✅ Componentes reutilizables
✅ Datos de prueba integrados
✅ Material Symbols Icons
✅ Fuente Inter
✅ Transiciones suaves

## 🔐 Credenciales de Prueba

El login aún no requiere validación. Para acceder:
- **Usuario**: Cualquier email
- **Contraseña**: Cualquier contraseña

(Esto debe implementarse con autenticación real en producción)

## 📊 Datos de Prueba

Los datos mostrados en cada vista son de demostración y se pueden modificar en cada archivo de componente:

- **Inquilinos**: 5 registros de ejemplo
- **Departamentos**: 6 propiedades
- **Contratos**: 3 contratos vigentes
- **Lecturas**: 3 registros de servicios
- **Liquidaciones**: 3 reportes
- **Pagos**: 3 transacciones

## 🎯 Próximas Mejoras

- [ ] Integración con backend (API REST)
- [ ] Autenticación JWT
- [ ] Base de datos real
- [ ] Búsqueda y filtros avanzados
- [ ] Exportación de reportes (PDF, Excel)
- [ ] Gráficos de análisis
- [ ] Notificaciones en tiempo real
- [ ] Modo oscuro mejorado

## 📝 Notas de Desarrollo

- Los componentes usan `<script setup>` (sintaxis moderna de Vue 3)
- Tailwind CSS está configurado con colores personalizados
- Vue Router está configurado para lazy loading de componentes
- El archivo `DashboardLayout.vue` se reutiliza en todas las vistas administrativas

## 🤝 Contribución

Para hacer cambios:

1. Crear componentes en `/src/views` o `/src/components`
2. Registrar rutas en `/src/router/index.js`
3. Usar Tailwind CSS para estilos
4. Seguir la estructura de componentes existentes

## 📄 Licencia

Proyecto académico - Ciclo VII Diseño y Arquitectura de Software

---

**Última actualización**: 26 de abril de 2026
