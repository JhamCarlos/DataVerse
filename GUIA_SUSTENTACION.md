# 📽️ Guía de Sustentación: Dataverse Rentals (8 Minutos)

Esta guía detalla el guion, lo que se debe mostrar en pantalla y los puntos técnicos clave para cumplir con los criterios de evaluación del profesor.

---

## ⏱️ Bloque 1: Arquitectura de Solución (0:00 - 1:30)
**Objetivo:** Demostrar profesionalismo y orden en el código.

### 🖥️ Qué mostrar:
1. **IDE (IntelliJ/VS Code):** Abre la carpeta del proyecto.
2. **Estructura de Carpetas:** Expande los paquetes del backend (Java) y la carpeta `src` del frontend (Vue).

### 🎙️ Qué decir:
> "Buenos días profesor. Iniciamos presentando la arquitectura de **Dataverse Rentals**. Hemos optado por una arquitectura desacoplada: un **Frontend en Vue.js 3** y un **Backend robusto en Java 21 con Spring Boot**.
> 
> En el backend, aplicamos una **arquitectura por capas**: 
> 1. **Capa de Presentación (Controllers):** Donde exponemos nuestros endpoints REST.
> 2. **Capa de Negocio (Services):** Donde reside toda la lógica de cálculos y prorrateos.
> 3. **Capa de Persistencia (Repositories):** Aquí es donde gestionamos el acceso a datos.
> 
> Como pueden ver en pantalla, usamos **Spring Data JPA** con Repositorios para abstraer la complejidad de la base de datos, garantizando un código limpio y mantenible."

---

## ⏱️ Bloque 2: Seguridad Avanzada (1:30 - 3:30)
**Objetivo:** Demostrar que el sistema es seguro y protege la información.

### 🖥️ Qué mostrar:
1. **Navegador:** Página de Login.
2. **Demo de Login:** Ingresa usuario/pass.
3. **MFA:** Muestra la pantalla pidiendo el código (App o Email).
4. **Validación de Rutas:** Intenta entrar a `/dashboard` sin estar logueado (copiando y pegando la URL en una pestaña de incógnito).

### 🎙️ Qué decir:
> "La seguridad es crítica para Milano & Asociados. Hemos implementado un **Acceso Seguro con MFA (Autenticación de Dos Factores)**. 
> 
> Primero, el usuario ingresa sus credenciales estándar. Al validar, el sistema solicita un segundo factor para verificar la identidad. Esto lo logramos mediante **Spring Security y JWT**.
> 
> Además, contamos con una **Validación de Rutas estricta**. Si intento acceder directamente a una URL privada sin haberme autenticado, el sistema me redirige automáticamente al login. Esto demuestra que los atributos de autorización y los **Route Guards** en el frontend están funcionando correctamente, protegiendo cada recurso del servidor."

---

## ⏱️ Bloque 3: Core: Maestro-Detalle (3:30 - 6:30)
**Objetivo:** Mostrar la funcionalidad principal y la integridad de datos.

### 🖥️ Qué mostrar:
1. **Formulario de Contratos:** Registra un nuevo contrato.
2. **Carga Dinámica:** Agrega boletas o conceptos de pago de forma dinámica (filas que se añaden con un botón).
3. **Cálculos en vivo:** Muestra cómo al cambiar un monto, el total se actualiza (lógica de prorrateo).

### 🎙️ Qué decir:
> "Entramos al corazón del software: la operación **Maestro-Detalle**. Vamos a registrar un **Contrato de Arrendamiento**.
> 
> Noten cómo podemos agregar múltiples conceptos de pago o boletas de forma dinámica. Lo importante aquí no es solo la interfaz, sino que **los cálculos de prorrateo se ejecutan en el servidor** para evitar manipulaciones en el cliente.
> 
> Al momento de guardar, el backend utiliza la anotación `@Transactional`. Esto asegura que la información se guarde de forma **íntegra**: o se guarda el contrato con todos sus detalles, o no se guarda nada si ocurre un error. Así garantizamos la consistencia financiera de los datos."

---

## ⏱️ Bloque 4: Gestión Financiera (6:30 - 8:00)
**Objetivo:** Demostrar el valor del software para la toma de decisiones.

### 🖥️ Qué mostrar:
1. **Dashboard:** Muestra los gráficos de Morosidad, Ingresos y Ocupación.
2. **Impacto en Vivo:** Refresca el dashboard para mostrar cómo el contrato/pago registrado hace un momento actualizó los KPIs.

### 🎙️ Qué decir:
> "Finalmente, transformamos los datos en decisiones mediante nuestros **Dashboards Financieros**. 
> 
> El sistema presenta KPIs en tiempo real:
> * **Índice de Morosidad:** Para identificar inquilinos con pagos pendientes.
> * **Proyección de Ingresos:** Basado en los contratos vigentes.
> * **Nivel de Ocupación:** De los departamentos.
> 
> Observen el **Impacto en Vivo**: la data que acabamos de registrar en el bloque anterior ya se refleja en estas gráficas. Con esto, Dataverse Rentals realmente asiste a la gerencia de **Milano & Asociados**, permitiéndoles gestionar sus activos de manera eficiente y profesional."

---

## 💡 Consejos Finales para el Video:
* **Entusiasmo:** Habla con seguridad y tono profesional.
* **Fluidez:** Evita silencios largos. Si algo demora en cargar, sigue explicando la lógica detrás.
* **Enfoque:** El profesor quiere ver **Arquitectura y Lógica**, no solo 'colores bonitos'. Menciona términos como 'REST API', 'Transactional', 'MFA' y 'Layers'.
