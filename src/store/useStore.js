import { reactive, computed } from 'vue';
import { mockData } from '../data/mockData';

// Estado global de la aplicación (simulado)
const state = reactive({
  currentUser: null, // Será un objeto de usuario con role 'ADMIN' o 'INQUILINO'
  mfaPassed: false,  // Nuevo estado para la validación de MFA
  
  // Tablas del Diccionario de Datos
  edificios: [...mockData.edificios],
  departamentos: [...mockData.departamentos],
  medidores: [...mockData.medidores],
  
  inquilinos: [...mockData.inquilinos],
  contratos: [...mockData.contratos],
  alertas: [...mockData.alertas],
  
  tarifas: [...mockData.tarifas],
  lecturas: [...mockData.lecturas],
  
  personal: [...mockData.personal],
  gastos: [...mockData.gastos],
  
  boletas: [...mockData.boletas],
  pagos: [...mockData.pagos],
  
  usuarios: [...mockData.usuarios],
  roles: [...mockData.roles],
  permisos: [...mockData.permisos],
  
  // KPIs para Dashboard
  kpis: { ...mockData.kpis }
});

// Acciones / Mutaciones (simuladas)
const login = (email, password) => {
  // Simulamos login. Buscamos en usuarios por correo o username.
  const user = state.usuarios.find(u => (u.correo === email || u.username === email) && password === '123456');
  if (user) {
    state.currentUser = user;
    state.mfaPassed = false; // Requiere pasar el MFA
    return true;
  }
  return false;
};

const verifyMfa = (code) => {
  // Para la demo, aceptamos un código estático o si tiene 6 dígitos
  if (state.currentUser && code && code.length >= 4) { 
    state.mfaPassed = true;
    return true;
  }
  return false;
};

const logout = () => {
  state.currentUser = null;
  state.mfaPassed = false;
};

// Computadores para KPIs - Cálculos en tiempo real
const totalDepartamentos = computed(() => state.departamentos.length);

const ocupacion = computed(() => {
  if (state.departamentos.length === 0) return 0;
  const ocupados = state.departamentos.filter(d => d.estado_ocupacion === 'OCUPADO').length;
  return Math.round((ocupados / state.departamentos.length) * 100);
});

const morosidad = computed(() => {
  // Boletas pendientes o vencidas no pagadas
  const hoy = new Date();
  const boletasAtrasadas = state.boletas.filter(b => {
    const fechaVencimiento = new Date(b.fecha_vencimiento);
    return b.estado_boleta === 'PENDIENTE' && fechaVencimiento < hoy;
  });
  
  return boletasAtrasadas.reduce((sum, b) => sum + b.monto_total, 0);
});

const boletasPendientes = computed(() => {
  return state.boletas.filter(b => b.estado_boleta === 'PENDIENTE').length;
});

const ingresos = computed(() => {
  // Suma de pagos procesados (boletas pagadas)
  return state.pagos.reduce((sum, p) => sum + p.monto_pagado, 0);
});

const boletasPagadas = computed(() => {
  return state.boletas.filter(b => b.estado_boleta === 'PAGADA').length;
});

const departamentosOcupados = computed(() => {
  return state.departamentos.filter(d => d.estado_ocupacion === 'OCUPADO').length;
});

const departamentosDisponibles = computed(() => {
  return state.departamentos.filter(d => d.estado_ocupacion === 'DISPONIBLE').length;
});

// KPIs adicionales para Dashboard Principal
const totalInquilinos = computed(() => {
  return state.inquilinos.length;
});

const contratosActivos = computed(() => {
  return state.contratos.filter(c => c.estado_contrato === 'ACTIVO').length;
});

const pagosPendientes = computed(() => {
  // Suma de boletas pendientes (no pagadas)
  return state.boletas
    .filter(b => b.estado_boleta === 'PENDIENTE')
    .reduce((sum, b) => sum + b.monto_total, 0);
});

// Computados
const isAuthenticated = computed(() => state.currentUser !== null && state.mfaPassed === true);
const isAdmin = computed(() => state.currentUser?.role === 'ADMIN');
const isTenant = computed(() => state.currentUser?.role === 'INQUILINO');

export const useStore = () => {
  return {
    state,
    login,
    verifyMfa,
    logout,
    isAuthenticated,
    isAdmin,
    isTenant,
    // KPIs Computados - Dashboard Principal
    totalDepartamentos,
    totalInquilinos,
    contratosActivos,
    pagosPendientes,
    // KPIs Computados - Dashboard Financiero
    ocupacion,
    morosidad,
    boletasPendientes,
    ingresos,
    boletasPagadas,
    departamentosOcupados,
    departamentosDisponibles
  };
};
