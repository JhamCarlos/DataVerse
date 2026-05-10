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
    isTenant
  };
};
