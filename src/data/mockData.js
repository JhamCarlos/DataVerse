export const mockData = {
  // MÓDULO SEGURIDAD - USUARIOS Y ROLES
  roles: [
    { id: 1, nombre: 'ADMIN', descripcion: 'Administrador del sistema', estado: 1 },
    { id: 2, nombre: 'INQUILINO', descripcion: 'Inquilino', estado: 1 },
    { id: 3, nombre: 'OPERARIO', descripcion: 'Personal de mantenimiento', estado: 1 }
  ],
  permisos: [
    { id: 1, nombre: 'BOLETA_GENERAR', descripcion: 'Generar boletas' },
    { id: 2, nombre: 'CONTRATO_ANULAR', descripcion: 'Anular contratos' }
  ],
  usuarios: [
    { id: 1, username: 'admin', correo: 'admin@dataverserentals.com', nombre_completo: 'Admin User', role: 'ADMIN', estado: 1 },
    { id: 2, username: 'juanp', correo: 'juan.perez@email.com', nombre_completo: 'Juan Pérez', role: 'INQUILINO', id_inquilino: 1, estado: 1 },
    { id: 3, username: 'mariag', correo: 'maria.garcia@email.com', nombre_completo: 'María García', role: 'INQUILINO', id_inquilino: 2, estado: 1 }
  ],

  // MÓDULO INMUEBLES
  edificios: [
    { id: 1, nombre: 'Edificio Central', direccion: 'Av. Las Palmas 123', distrito: 'Miraflores', provincia: 'Lima', departamento: 'Lima', telefono_contacto: '01 1234567', correo_contacto: 'central@edificios.com', descripcion: 'Edificio principal de 5 pisos', estado: 1 },
    { id: 2, nombre: 'Torre Norte', direccion: 'Jr. Comercio 456', distrito: 'San Isidro', provincia: 'Lima', departamento: 'Lima', telefono_contacto: '01 7654321', correo_contacto: 'norte@edificios.com', descripcion: 'Torre de 10 pisos', estado: 1 }
  ],
  departamentos: [
    { id: 1, id_edificio: 1, nombre_edificio: 'Edificio Central', numero_dpto: '301', piso: 3, area_m2: 85.50, num_habitaciones: 2, num_banos: 1, estado_ocupacion: 'OCUPADO', estado: 1 },
    { id: 2, id_edificio: 1, nombre_edificio: 'Edificio Central', numero_dpto: '302', piso: 3, area_m2: 90.00, num_habitaciones: 3, num_banos: 2, estado_ocupacion: 'OCUPADO', estado: 1 },
    { id: 3, id_edificio: 1, nombre_edificio: 'Edificio Central', numero_dpto: '401', piso: 4, area_m2: 85.50, num_habitaciones: 2, num_banos: 1, estado_ocupacion: 'DISPONIBLE', estado: 1 },
    { id: 4, id_edificio: 2, nombre_edificio: 'Torre Norte', numero_dpto: '101', piso: 1, area_m2: 120.00, num_habitaciones: 3, num_banos: 2, estado_ocupacion: 'OCUPADO', estado: 1 },
    { id: 5, id_edificio: 1, nombre_edificio: 'Edificio Central', numero_dpto: '402', piso: 4, area_m2: 88.00, num_habitaciones: 2, num_banos: 1, estado_ocupacion: 'OCUPADO', estado: 1 },
    { id: 6, id_edificio: 1, nombre_edificio: 'Edificio Central', numero_dpto: '501', piso: 5, area_m2: 92.00, num_habitaciones: 3, num_banos: 2, estado_ocupacion: 'DISPONIBLE', estado: 1 },
    { id: 7, id_edificio: 2, nombre_edificio: 'Torre Norte', numero_dpto: '102', piso: 1, area_m2: 118.00, num_habitaciones: 3, num_banos: 2, estado_ocupacion: 'OCUPADO', estado: 1 },
    { id: 8, id_edificio: 2, nombre_edificio: 'Torre Norte', numero_dpto: '201', piso: 2, area_m2: 115.00, num_habitaciones: 2, num_banos: 2, estado_ocupacion: 'OCUPADO', estado: 1 },
    { id: 9, id_edificio: 1, nombre_edificio: 'Edificio Central', numero_dpto: '502', piso: 5, area_m2: 90.00, num_habitaciones: 2, num_banos: 1, estado_ocupacion: 'DISPONIBLE', estado: 1 },
    { id: 10, id_edificio: 2, nombre_edificio: 'Torre Norte', numero_dpto: '202', piso: 2, area_m2: 120.00, num_habitaciones: 3, num_banos: 2, estado_ocupacion: 'DISPONIBLE', estado: 1 },
  ],
  medidores: [
    { id: 1, id_edificio: 1, codigo_medidor: 'MED-AGUA-GEN-1', tipo_servicio: 'AGUA', es_general: true, estado: 1 },
    { id: 2, id_edificio: 1, codigo_medidor: 'MED-LUZ-GEN-1', tipo_servicio: 'LUZ', es_general: true, estado: 1 },
    { id: 3, id_edificio: 1, codigo_medidor: 'MED-AGUA-301', tipo_servicio: 'AGUA', es_general: false, estado: 1 },
    { id: 4, id_edificio: 1, codigo_medidor: 'MED-LUZ-301', tipo_servicio: 'LUZ', es_general: false, estado: 1 }
  ],

  // MÓDULO ARRENDAMIENTO
  inquilinos: [
    { id: 1, tipo_documento: 'DNI', numero_documento: '12345678', nombres: 'Juan', apellido_paterno: 'Pérez', apellido_materno: 'Gómez', telefono: '987654321', correo: 'juan.perez@email.com', estado: 1 },
    { id: 2, tipo_documento: 'CE', numero_documento: '001122334', nombres: 'María', apellido_paterno: 'García', apellido_materno: 'López', telefono: '912345678', correo: 'maria.garcia@email.com', estado: 1 }
  ],
  contratos: [
    { id: 1, codigo: 'CTR-2024-001', id_inquilino: 1, inquilino_nombre: 'Juan Pérez', id_departamento: 1, departamento_numero: '301 - Edificio Central', fecha_inicio: '2024-01-01', fecha_fin: '2024-12-31', monto_alquiler: 1200.00, dia_pago: 5, deposito_garantia: 2400.00, estado_contrato: 'ACTIVO', estado: 1 },
    { id: 2, codigo: 'CTR-2024-002', id_inquilino: 2, inquilino_nombre: 'María García', id_departamento: 4, departamento_numero: '101 - Torre Norte', fecha_inicio: '2024-03-15', fecha_fin: '2025-03-14', monto_alquiler: 1500.00, dia_pago: 15, deposito_garantia: 3000.00, estado_contrato: 'ACTIVO', estado: 1 }
  ],
  alertas: [
    { id: 1, id_contrato: 1, contrato_codigo: 'CTR-2024-001', tipo_alerta: 'VENCIMIENTO_PROXIMO', mensaje: 'El contrato vence en 30 días', fecha_alerta: '2024-12-01', estado: 1 }
  ],

  // MÓDULO SERVICIOS
  tarifas: [
    { id: 1, id_edificio: 1, tipo_servicio: 'AGUA', precio_unitario: 3.50, unidad: 'm³', fecha_vigencia_desde: '2024-01-01', estado: 1 },
    { id: 2, id_edificio: 1, tipo_servicio: 'LUZ', precio_unitario: 0.85, unidad: 'kWh', fecha_vigencia_desde: '2024-01-01', estado: 1 }
  ],
  lecturas: [
    { id: 1, id_medidor: 3, medidor_codigo: 'MED-AGUA-301', periodo: '2024-04', lectura_anterior: 1200.00, lectura_actual: 1250.00, consumo: 50.00, estado: 1 },
    { id: 2, id_medidor: 4, medidor_codigo: 'MED-LUZ-301', periodo: '2024-04', lectura_anterior: 5000.00, lectura_actual: 5150.00, consumo: 150.00, estado: 1 }
  ],

  // MÓDULO MANTENIMIENTO
  personal: [
    { id: 1, nombres: 'Carlos', apellido_paterno: 'Ruiz', tipo_documento: 'DNI', numero_documento: '87654321', especialidad: 'GASFITERIA', estado: 1 }
  ],
  gastos: [
    { id: 1, id_edificio: 1, edificio_nombre: 'Edificio Central', categoria: 'MANTENIMIENTO_BOMBA', descripcion: 'Reparación de bomba de agua principal', monto: 450.00, fecha_gasto: '2024-04-10', estado_gasto: 'APROBADO', estado: 1 },
    { id: 2, id_edificio: 1, edificio_nombre: 'Edificio Central', categoria: 'LIMPIEZA', descripcion: 'Limpieza quincenal de áreas comunes', monto: 200.00, fecha_gasto: '2024-04-15', estado_gasto: 'PENDIENTE', estado: 1 }
  ],

  // MÓDULO FINANZAS
  boletas: [
    { id: 1, id_contrato: 1, contrato_codigo: 'CTR-2024-001', periodo: '2024-04', fecha_emision: '2024-04-01', fecha_vencimiento: '2024-04-05', monto_alquiler: 1200.00, monto_agua: 175.00, monto_luz: 127.50, monto_mantenimiento: 150.00, monto_total: 1652.50, estado_boleta: 'PAGADA', estado: 1 },
    { id: 2, id_contrato: 2, contrato_codigo: 'CTR-2024-002', periodo: '2024-04', fecha_emision: '2024-04-10', fecha_vencimiento: '2024-04-15', monto_alquiler: 1500.00, monto_agua: 200.00, monto_luz: 180.00, monto_mantenimiento: 200.00, monto_total: 2080.00, estado_boleta: 'PENDIENTE', estado: 1 },
    { id: 3, id_contrato: 1, contrato_codigo: 'CTR-2024-001', periodo: '2024-05', fecha_emision: '2024-05-01', fecha_vencimiento: '2024-05-05', monto_alquiler: 1200.00, monto_agua: 180.00, monto_luz: 135.00, monto_mantenimiento: 150.00, monto_total: 1665.00, estado_boleta: 'PAGADA', estado: 1 },
    { id: 4, id_contrato: 2, contrato_codigo: 'CTR-2024-002', periodo: '2024-05', fecha_emision: '2024-05-10', fecha_vencimiento: '2024-05-15', monto_alquiler: 1500.00, monto_agua: 210.00, monto_luz: 190.00, monto_mantenimiento: 200.00, monto_total: 2100.00, estado_boleta: 'PAGADA', estado: 1 },
    { id: 5, id_contrato: 1, contrato_codigo: 'CTR-2024-001', periodo: '2024-06', fecha_emision: '2024-06-01', fecha_vencimiento: '2024-06-05', monto_alquiler: 1200.00, monto_agua: 170.00, monto_luz: 130.00, monto_mantenimiento: 150.00, monto_total: 1650.00, estado_boleta: 'PAGADA', estado: 1 },
    { id: 6, id_contrato: 2, contrato_codigo: 'CTR-2024-002', periodo: '2024-06', fecha_emision: '2024-06-10', fecha_vencimiento: '2024-06-15', monto_alquiler: 1500.00, monto_agua: 220.00, monto_luz: 200.00, monto_mantenimiento: 200.00, monto_total: 2120.00, estado_boleta: 'PAGADA', estado: 1 },
    { id: 7, id_contrato: 1, contrato_codigo: 'CTR-2024-001', periodo: '2024-07', fecha_emision: '2024-07-01', fecha_vencimiento: '2024-07-05', monto_alquiler: 1200.00, monto_agua: 165.00, monto_luz: 128.00, monto_mantenimiento: 150.00, monto_total: 1643.00, estado_boleta: 'PENDIENTE', estado: 1 },
    { id: 8, id_contrato: 2, contrato_codigo: 'CTR-2024-002', periodo: '2024-07', fecha_emision: '2024-07-10', fecha_vencimiento: '2024-07-15', monto_alquiler: 1500.00, monto_agua: 215.00, monto_luz: 195.00, monto_mantenimiento: 200.00, monto_total: 2110.00, estado_boleta: 'PAGADA', estado: 1 },
  ],
  pagos: [
    { id: 1, id_boleta: 1, boleta_periodo: '2024-04', fecha_pago: '2024-04-04 10:30:00', monto_pagado: 1652.50, id_tipo_pago: 'TRANSFERENCIA', numero_operacion: 'OP-001122', estado_validacion: 'APROBADO', estado: 1 },
    { id: 2, id_boleta: 3, boleta_periodo: '2024-05', fecha_pago: '2024-05-04 14:15:00', monto_pagado: 1665.00, id_tipo_pago: 'DEPOSITO', numero_operacion: 'OP-001123', estado_validacion: 'APROBADO', estado: 1 },
    { id: 3, id_boleta: 4, boleta_periodo: '2024-05', fecha_pago: '2024-05-12 09:45:00', monto_pagado: 2100.00, id_tipo_pago: 'TRANSFERENCIA', numero_operacion: 'OP-001124', estado_validacion: 'APROBADO', estado: 1 },
    { id: 4, id_boleta: 5, boleta_periodo: '2024-06', fecha_pago: '2024-06-03 11:20:00', monto_pagado: 1650.00, id_tipo_pago: 'TRANSFERENCIA', numero_operacion: 'OP-001125', estado_validacion: 'APROBADO', estado: 1 },
    { id: 5, id_boleta: 6, boleta_periodo: '2024-06', fecha_pago: '2024-06-13 15:30:00', monto_pagado: 2120.00, id_tipo_pago: 'DEPOSITO', numero_operacion: 'OP-001126', estado_validacion: 'APROBADO', estado: 1 },
    { id: 6, id_boleta: 8, boleta_periodo: '2024-07', fecha_pago: '2024-07-14 10:00:00', monto_pagado: 2110.00, id_tipo_pago: 'TRANSFERENCIA', numero_operacion: 'OP-001127', estado_validacion: 'APROBADO', estado: 1 },
  ],

  // KPI y Dashboard
  kpis: {
    totalDepartamentos: 24,
    totalInquilinos: 156,
    contratosActivos: 142,
    pagosPendientes: 45230
  }
};
