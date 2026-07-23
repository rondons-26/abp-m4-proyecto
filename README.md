# TaskFlow (Task Manager App)

![JavaScript ES6+](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Bootstrap 5](https://img.shields.io/badge/Bootstrap-5.x-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![LocalStorage](https://img.shields.io/badge/LocalStorage-Persistent-4CAF50?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-Modern-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Advanced-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployment-222222?style=for-the-badge&logo=github)
![Status: Production-Ready](https://img.shields.io/badge/Status-Production%20Ready-2E8B57?style=for-the-badge)
![Deploy: Active](https://img.shields.io/badge/Deploy-Active-0A66C2?style=for-the-badge)

> Una solución moderna de gestión de tareas orientada a la productividad, la experiencia de usuario y la persistencia local, diseñada como una aplicación práctica y escalable para entornos académicos y profesionales.

[🌐 Ver despliegue en GitHub Pages](https://saulrondon.github.io/abp-m4/)

---

## 1. Información del Proyecto y Autoría

- **Autor:** Saúl Rondón E.
- **Contexto de Desarrollo:** Proyecto de Aplicación Práctica (ABP) - Módulo 4: Programación Avanzada en JavaScript
- **Objetivo:** Diseñar e implementar una solución robusta y de alto rendimiento para la gestión del flujo de tareas diarias, garantizando persistencia local, interactividad en tiempo real y una experiencia de usuario (UX) fluida y adaptativa mediante Responsive Design.

---

## 2. Visión General del Producto

La aplicación TaskFlow está diseñada para ofrecer una experiencia de gestión de tareas clara, ágil y profesional, combinando una interfaz moderna con funcionalidades que simulan escenarios reales de uso productivo. Su arquitectura conceptual prioriza la organización, la usabilidad y la continuidad de datos en el navegador, permitiendo que el usuario gestione su trabajo sin interrupciones ni pérdida de información.

---

## 3. Características Clave

- 🌐 **Sincronización Inicial (Consumo de API):** Integración asíncrona mediante promesas y Async/Await con una API externa para cargar tareas de ejemplo iniciales. Incorpora un flujo asíncrono con un retardo controlado de 2 segundos para las notificaciones de éxito, simulando la latencia en entornos distribuidos de producción.
- 📦 **Arquitectura de Software Orientada a Objetos:** Separación modular y ordenada de responsabilidades mediante componentes JavaScript bien definidos (Modelos, Servicios, Utilidades y UI), favoreciendo la mantenibilidad y la escalabilidad del sistema mediante ES6 Modules nativos.
- 💾 **Persistencia de Datos Robusta:** Almacenamiento local confiable que conserva el estado de las tareas entre sesiones mediante serialización JSON, aplicando operadores avanzados de JavaScript (Destructuring y Spread Syntax) para la manipulación inmutable de datos.
- ✏️ **Edición Integrada In-Place:** Flujo de modificación interactivo incorporado directamente dentro de la tarjeta de la tarea mediante la mutación dinámica del DOM en un área de texto integrada. Elimina el uso de ventanas emergentes obstructivas, mejorando la experiencia del usuario sin interrupciones.
- ⏱️ **Sistema de Tareas con Bloqueo de Seguridad:** Gestión temporal de tareas completadas mediante una lógica reactiva basada en intervalos globales. El sistema otorga un periodo de gracia para reactivar o modificar una tarea antes de bloquear su estado de forma irreversible tras transcurrir exactamente 1 hora.
- 🔍 **Filtros e Interactividad en Tiempo Real:** Búsqueda dinámica y procesamiento de cadenas que permite filtrar tareas activas de forma rápida y eficiente a medida que el usuario escribe, optimizando el rendimiento mediante delegación de eventos.
- 📊 **Panel de Rendimiento y Métricas:** Visualización integrada de progreso, contadores analíticos y estado general de las tareas mediante componentes gráficos reactivos, facilitando una lectura inmediata del avance del flujo de trabajo.
- 🎨 **Diseño UI/UX Profesional:** Interfaz adaptativa optimizada con un esquema de color *Dark Mode* construido sobre Bootstrap 5 para reducir la fatiga visual, enriquecido con efectos de interacción dinámica mediante eventos del ratón y micro-animaciones fluidas.

---

## 4. Estructura de Archivos

```text
├── index.html
├── js/
│   ├── app.js
│   ├── models/
│   │   └── Task.js
│   ├── services/
│   │   ├── TaskManager.js
│   │   └── api.js
│   └── utils/
│       └── helpers.js
```

---

## 5. Guía de Instalación y Uso Local

> ⚠️ **Nota Técnica de Ejecución (CORS):** Debido a que la aplicación implementa una arquitectura modular avanzada basada en **ES6 Modules nativos** (`type="module"`), los navegadores modernos restringen su apertura directa mediante el protocolo de archivos locales (`file://`) por motivos de seguridad. Para visualizar correctamente el proyecto, **debe ser ejecutado exclusivamente a través de un servidor local (como Live Server en VS Code)** o visualizado directamente desde el enlace de producción en **GitHub Pages**.

Siga estos pasos para ejecutar la aplicación de forma local y rápida:

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/saulrondon/abp-m4.git
   ```

2. **Ingresar al directorio del proyecto**
   ```bash
   cd abp-m4
   ```

3. **Levantar un servidor local**
   - Puede utilizar la extensión Live Server en Visual Studio Code o cualquier servidor estático equivalente.
   - Abra la carpeta del proyecto y ejecute el servidor desde el archivo principal del sitio.

4. **Abrir la aplicación en un navegador moderno**
   - La interfaz se cargará automáticamente en el navegador.
   - No requiere dependencias externas complejas para su ejecución básica.

5. **Uso inmediato**
   - Cree nuevas tareas, gestione su estado, filtre información y observe la persistencia del sistema entre recargas del navegador.

---

## 6. Beneficios de la Solución

- Mejora la organización del trabajo diario.
- Optimiza la trazabilidad del estado de las tareas.
- Proporciona una experiencia de usuario más fluida y profesional.
- Refuerza los principios de modularidad y diseño de software aplicados en JavaScript avanzado.
- Genera una base sólida para futuras ampliaciones y evolución del producto.

---

## 7. Conclusión

Este proyecto representa una implementación funcional, ordenada y visualmente cuidada de una herramienta de gestión de tareas, alineada con los estándares de calidad esperados en un entorno académico y de portafolio profesional. Su enfoque combina ingeniería de software, experiencia de usuario y arquitectura modular de manera coherente y aplicable.
