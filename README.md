# Aves UPEL IPB – Visor 3D Interactivo

![Versión](https://img.shields.io/badge/Versi%C3%B3n-1.0.0-blue)
![Tecnologías](https://img.shields.io/badge/Tecnolog%C3%ADas-A--Frame%20%7C%20Three.js%20%7C%20HTML5-green)
![Licencia](https://img.shields.io/badge/Licencia-MIT-orange)

Una aplicación web educativa diseñada para el **Instituto Pedagógico de Barquisimeto (UPEL-IPB)** que permite explorar modelos 3D interactivos de diversas especies de aves locales. Los usuarios pueden rotar, escalar y examinar detalladamente los modelos, además de acceder a información científica y taxonómica de cada especie.

## ✨ Características Principales

*   **Visor 3D Inmersivo:** Utiliza la librería **A-Frame** para renderizar modelos glTF de alta calidad.
*   **Interacción Intuitiva:** Soporte completo para ratón (rotación/zoom) y gestos táctiles (pinch-to-zoom/swipe) para dispositivos móviles.
*   **Base de Datos Científica:** Información detallada (nombre científico, familia, descripción y datos clave) cargada dinámicamente según la especie seleccionada.
*   **Captura de Pantalla:** Botón integrado para guardar instantáneas del modelo 3D en formato `.png`.
*   **Diseño Premium:** Estética inspirada en la naturaleza (paleta de azules y marrones) con tipografía clásica Times New Roman y animaciones fluidas.
*   **Fondo Personalizado:** Integración de un entorno equirectangular (`fondo.png`) para contextualizar los modelos.

## 🛠️ Tecnologías Utilizadas

*   **HTML5 & CSS3:** Estructura semántica y diseño responsivo basado en variables CSS.
*   **JavaScript (Vanilla):** Lógica de control y manipulación del DOM.
*   **[A-Frame](https://aframe.io/):** Framework para experiencias de Realidad Virtual y visualización 3D en la web.
*   **Three.js:** Motor gráfico subyacente para el cálculo de colisiones, centrado y escalado automático de mallas.

## 📂 Estructura del Proyecto

```text
Aves UPEL IPB/
├── modelos 3D/         # Archivos .glb de los modelos de aves
├── estilos.css         # Hoja de estilos principal
├── index.html          # Estructura de la aplicación
├── script.js           # Lógica y componente model-viewer (Documentado con JSDoc)
├── fondo.png           # Imagen de fondo del visor
└── texto cientifico.txt # Fuente de datos original
```

## 🚀 Instalación y Uso

Debido a las políticas de seguridad de los navegadores modernas (CORS), los modelos 3D y las texturas **no se pueden cargar directamente abriendo el archivo `.html` desde el sistema de archivos (`file://`)**.

### Paso 1: Clonar o descargar el repositorio
Asegúrate de tener todos los archivos en una misma carpeta, incluyendo la subcarpeta `modelos 3D/`.

### Paso 2: Ejecutar un servidor local
Puedes usar cualquiera de los siguientes métodos:

*   **Node.js (Recomendado):**
    ```bash
    npx http-server . -p 8765
    ```
*   **Python:**
    ```bash
    python -m http.server 8765
    ```
*   **VS Code:** Usa la extensión "Live Server".

### Paso 3: Acceder
Abre tu navegador en `http://localhost:8765`.

## 📸 Instrucciones de Interacción

*   **Rotar:** Clic izquierdo y arrastrar (o un dedo en móviles).
*   **Desplazar (Pan):** Clic derecho y arrastrar (o ambos botones del ratón).
*   **Zoom:** Rueda del ratón (o gesto de pellizco con dos dedos).
*   **Captura:** Presiona el botón de la cámara en la esquina inferior derecha del visor.

---

**Desarrollado por:** Carlos García Torín *"Abejorro Digital"* – mayo 2026.
*Proyecto creado para el fortalecimiento de la divulgación científica avifaunística de la UPEL IPB.*
