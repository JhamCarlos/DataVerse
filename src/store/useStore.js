import { reactive, computed } from 'vue';
import { mockData } from '../data/mockData';

// Estado global de la aplicación (simulado)
const state = reactive({
  currentUser: null, // Será un objeto de usuario con role 'ADMIN' o 'INQUILINO'
  
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
  // Simulamos login. Buscamos en usuarios.
  const user = state.usuarios.find(u => u.correo === email && password === '123456');
  if (user) {
    state.currentUser = user;
    return true;
  }
  return false;
};

const logout = () => {
  state.currentUser = null;
};

// Computados
const isAuthenticated = computed(() => state.currentUser !== null);
const isAdmin = computed(() => state.currentUser?.role === 'ADMIN');
const isTenant = computed(() => state.currentUser?.role === 'INQUILINO');

export const useStore = () => {
  return {
    state,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isTenant
  };
};
