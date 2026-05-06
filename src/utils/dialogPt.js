/**
 * PassThrough config compartido para los modales del sistema.
 * Usa el color acento del proyecto (#00375e azul marino) para crear
 * una identidad visual coherente con el diseño general.
 */

const headerBase = {
  borderRadius: '0.5rem 0.5rem 0 0',
  borderBottom: 'none',
  padding: '1rem 1.5rem',
};

// Modal de formulario: Azul marino (acento principal del proyecto)
export const dialogFormPt = {
  header: {
    style: {
      ...headerBase,
      background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
    }
  },
  title: {
    style: {
      color: '#ffffff',
      fontWeight: '600',
      fontSize: '1.15rem',
      letterSpacing: '0.01em',
    }
  },
  headerActions: {
    style: {
      color: 'rgba(255,255,255,0.85)',
    }
  },
};

// Modal de confirmación: Ámbar oscuro (tono de advertencia que combina con el navy)
export const dialogConfirmPt = {
  header: {
    style: {
      ...headerBase,
      background: 'linear-gradient(135deg, #92400e 0%, #b45309 100%)',
    }
  },
  title: {
    style: {
      color: '#ffffff',
      fontWeight: '600',
      fontSize: '1.1rem',
      letterSpacing: '0.01em',
    }
  },
  headerActions: {
    style: {
      color: 'rgba(255,255,255,0.85)',
    }
  },
};

