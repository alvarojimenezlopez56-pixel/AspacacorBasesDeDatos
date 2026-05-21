# Gestión de Socios - ASPACACOR

Este proyecto es una aplicación backend desarrollada con **Spring Boot** para la gestión automatizada de los registros de la Asociación de Pacientes Cardiacos de Córdoba (**ASPACACOR**). La API permite realizar todas las operaciones CRUD (Alta, Visualización, Modificación y Eliminación) sobre la entidad de Socios de forma eficiente y segura.

---

## 🛠️ Decisiones de Diseño y Arquitectura

Para el desarrollo de la actividad formativa se han tomado las siguientes decisiones técnicas con el fin de garantizar la portabilidad y agilidad en la evaluación:

1. **Persistencia en Memoria (H2 Database):** Debido a las restricciones locales de red e indexación del motor externo SQL Server en el entorno de desarrollo, se ha optado por implementar una base de datos **H2 en memoria**. Esto garantiza que el proyecto sea **100% portable**: el evaluador puede clonar y arrancar la aplicación directamente sin necesidad de configurar instancias locales de bases de datos ni dependencias de red externas.
2. **Estructura de Datos Restringida:** Los campos JSON se encuentran estrictamente ordenados mediante la anotación `@JsonPropertyOrder` para cumplir con los requisitos de visualización clara expuestos en la actividad.
3. **Gestión de Ciclo de Vida:** Al trabajar en memoria RAM, el ciclo de vida de los datos está ligado al del servidor. Cada arranque inicializa la estructura de tablas de forma limpia y automática gracias a las directivas de Hibernate.

---

## 🚀 Requisitos e Instalación

### Prerrequisitos
* **Java 17** o superior instalado.
* **Maven** (o uso del wrapper incluido `mvnw`).

### Pasos para arrancar el proyecto de forma local:
1. Clonar el repositorio o descargar el proyecto en una ruta local.
2. Abrir la terminal en el directorio raíz del proyecto (donde se aloja este archivo `README.md`).
3. Limpiar la caché de compilación ejecuntando:
   ```bash
   .\mvnw.cmd clean compile