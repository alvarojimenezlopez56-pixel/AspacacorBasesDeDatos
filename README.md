# ASPACACOR - Sistema de Gestión de Socios, Actividades e Inscripciones

Este proyecto es una aplicación web y API REST desarrollada con **Spring Boot** para automatizar el control y gestión interna de la Asociación de Pacientes Cardiacos de Córdoba (**ASPACACOR**). La aplicación permite administrar de forma integral los socios, sus contactos de emergencia en caso de incidencias médicas, las actividades programadas y el registro de inscripciones con control de aforo y asistencia.

---

## 📋 Características del Proyecto

El sistema está diseñado siguiendo una arquitectura limpia y desacoplada, cumpliendo los siguientes objetivos técnicos:
* **Modelo E-R Completo**: Implementación de las 4 entidades del diagrama (Socio, Contacto de Emergencia, Actividad e Inscripción) con integridad referencial completa.
* **Control de Negocio**: Validación automática de plazas libres antes de procesar una inscripción y prevención de duplicados.
* **Persistencia Integrada (H2)**: Base de datos SQL en memoria autoconfigurable que arranca y crea las tablas al iniciar la aplicación (100% portable, sin dependencias externas).
* **Interfaz de Usuario (SPA)**: Dashboard web premium oscuro (*glassmorphic*) integrado directamente en el servidor para realizar todo el CRUD visualmente y ver estadísticas.

---

## 🗄️ Modelo de Datos y Restricciones

La base de datos se genera automáticamente siguiendo el diagrama Entidad-Relación:

1. **Socio (`Socio.java`)**:
   * `idSocio` (Long, PK, Auto-incremental)
   * `dni` (String, Obligatorio)
   * `nombre` / `apellidos` (String, Obligatorios)
   * `telefono` (String)
   * `fechaNacimiento` (LocalDate)
   * `necesitaAsistencia` (Boolean)
2. **Contacto de Emergencia (`ContactoEmergencia.java`)**:
   * `idContacto` (Long, PK, Auto-incremental)
   * `nombreCompleto` (String, Obligatorio)
   * `telefono` (String, Obligatorio)
   * `parentesco` (String, Obligatorio)
   * `id_socio` (FK apuntando a Socio, Relación Many-to-One, Cascada completa)
3. **Actividad (`Actividad.java`)**:
   * `idActividad` (Long, PK, Auto-incremental)
   * `titulo` (String, Obligatorio)
   * `fechaHora` (LocalDateTime, Obligatorio)
   * `lugar` (String, Obligatorio)
   * `plazasMaximas` (Integer, Obligatorio)
4. **Inscripción (`Inscripcion.java`)**:
   * `idInscripcion` (Long, PK, Auto-incremental)
   * `id_socio` (FK apuntando a Socio, Relación Many-to-One)
   * `id_actividad` (FK apuntando a Actividad, Relación Many-to-One)
   * `asistenciaConfirmada` (Boolean)
   * `fechaRegistro` (LocalDateTime)

---

## 🚀 Instrucciones de Despliegue y Arranque

### Prerrequisitos
* **Java 17** o superior (la aplicación es compatible hasta Java 26).
* **Maven** (no requiere instalación; el proyecto incluye los scripts de envoltura `mvnw` y `mvnw.cmd`).

### Pasos para iniciar la aplicación:

1. Abre una terminal (PowerShell o CMD en Windows, Terminal en macOS/Linux) en la carpeta raíz del proyecto.
2. Compila el proyecto ejecutando el comando correspondiente a tu sistema operativo:
   * **En Windows (PowerShell):**
     ```powershell
     .\mvnw clean compile
     ```
   * **En Windows (CMD):**
     ```cmd
     mvnw clean compile
     ```
   * **En macOS/Linux:**
     ```bash
     chmod +x mvnw
     ./mvnw clean compile
     ```
3. Inicia la aplicación Spring Boot con:
   * **En Windows (PowerShell/CMD):**
     ```powershell
     .\mvnw spring-boot:run
     ```
   * **En macOS/Linux:**
     ```bash
     ./mvnw spring-boot:run
     ```
4. El servidor estará escuchando en el puerto `8080`.

---

## 💻 Acceso e Interacción

Una vez que el proyecto esté corriendo:

* **Panel de Control (Frontend Web)**: Abre en tu navegador de preferencia **`http://localhost:8080/`**. Desde aquí podrás registrar socios, gestionar contactos de emergencia, crear actividades, inscribir personas y marcar asistencia de manera totalmente visual y fluida.
