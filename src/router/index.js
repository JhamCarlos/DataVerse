import { createRouter, createWebHistory } from 'vue-router';
import { useStore } from '../store/useStore';

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/LoginView.vue'),
  },
  
  // ================= ADMIN ROUTES =================
  {
    path: '/admin',
    component: () => import('../components/layout/DashboardLayout.vue'),
    meta: { requiresAuth: true, role: 'ADMIN' },
    children: [
      { path: 'dashboard', name: 'AdminDashboard', component: () => import('../views/admin/DashboardView.vue') },
      
      // Módulo Inmuebles
      { path: 'edificios', name: 'Edificios', component: () => import('../views/admin/inmuebles/EdificiosView.vue') },
      { path: 'departamentos', name: 'Departamentos', component: () => import('../views/admin/inmuebles/DepartamentosView.vue') },
      { path: 'medidores', name: 'Medidores', component: () => import('../views/admin/inmuebles/MedidoresView.vue') },
      
      // Módulo Arrendamiento
      { path: 'inquilinos', name: 'Inquilinos', component: () => import('../views/admin/arrendamiento/InquilinosView.vue') },
      { path: 'contratos', name: 'Contratos', component: () => import('../views/admin/arrendamiento/ContratosView.vue') },
      { path: 'alertas', name: 'Alertas', component: () => import('../views/admin/arrendamiento/AlertasView.vue') },
      
      // Módulo Servicios
      { path: 'tarifas', name: 'Tarifas', component: () => import('../views/admin/servicios/TarifasView.vue') },
      { path: 'lecturas', name: 'Lecturas', component: () => import('../views/admin/servicios/LecturasView.vue') },

      // Módulo Finanzas
      { path: 'boletas', name: 'Boletas', component: () => import('../views/admin/finanzas/BoletasView.vue') },
      { path: 'pagos', name: 'Pagos', component: () => import('../views/admin/finanzas/PagosView.vue') },

      // Módulo Mantenimiento
      { path: 'personal', name: 'Personal', component: () => import('../views/admin/mantenimiento/PersonalView.vue') },
      { path: 'gastos', name: 'Gastos', component: () => import('../views/admin/mantenimiento/GastosView.vue') },

      // Módulo Administración (Fase 6)
      { path: 'usuarios', name: 'Usuarios', component: () => import('../views/admin/administracion/UsuariosView.vue') },
      { path: 'roles', name: 'Roles', component: () => import('../views/admin/administracion/RolesView.vue') },
      { path: 'configuracion', name: 'Configuracion', component: () => import('../views/admin/administracion/ConfiguracionView.vue') }
    ]
  },

  // ================= TENANT ROUTES =================
  {
    path: '/tenant',
    component: () => import('../components/layout/TenantLayout.vue'),
    meta: { requiresAuth: true, role: 'INQUILINO' },
    children: [
      { path: 'dashboard', name: 'TenantDashboard', component: () => import('../views/tenant/TenantDashboardView.vue') },
      { path: 'boletas', name: 'TenantBoletas', component: () => import('../views/tenant/TenantBoletasView.vue') },
    ]
  },
  
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const store = useStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  if (requiresAuth && !store.isAuthenticated.value) {
    next('/login');
  } else if (requiresAuth && to.meta.role && store.state.currentUser?.role !== to.meta.role) {
    if (store.isAdmin.value) next('/admin/dashboard');
    else if (store.isTenant.value) next('/tenant/dashboard');
    else next('/login');
  } else {
    next();
  }
});

export default router;
