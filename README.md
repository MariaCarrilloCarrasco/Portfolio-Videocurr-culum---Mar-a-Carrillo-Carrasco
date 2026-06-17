# Videocurrículum y Portafolio Profesional: María Carrillo Carrasco 🌟

Este es el portafolio profesional e interactivo de **María Carrillo Carrasco**, Educadora Social, Social Developer e integradora digital. El proyecto combina un diseño moderno con un fuerte enfoque en la accesibilidad web (estándares WCAG), integrando asistencia interactiva para personas con diversidad funcional visual y auditiva.

---

## 🎨 Características Destacadas

### 1. Guía Flotante Accesible (Voz y Señas)
Un asistente de accesibilidad interactivo que incluye:
* **Intérprete en Lengua de Signos**: Un avatar animado en formato vectorial (SVG) que gesticula de forma dinámica (`welcome`, `me`, `work`, `projects`, `contact`, `thanks`) coordinado con subtítulos en pantalla (LSE).
* **Lectura de Texto por Voz (TTS)**: Un motor de voz integrado a través de la API Web Speech del navegador, con controles de activación síncronos para evitar bloqueos del navegador (`not-allowed`), referencias persistentes contra recolección de basura, y control seguro de eventos asíncronos residuales.

### 2. Tablón de Pegatinas Interactivas (Drag and Drop)
Un espacio lúdico y altamente interactivo donde los visitantes pueden arrastrar y soltar pegatinas holográficas, de estrellas doradas o caritas felices directamente sobre el portafolio, mejorando la interacción del usuario.

### 3. Secciones Informativas
* **Videocurrículum**: Reproductor personalizado para ver la presentación oficial en video.
* **Sobre Mí y Trayectoria**: Un viaje interactivo a través del perfil profesional y formativo.
* **Proyectos Destacados**: Tarjetas de proyectos como *AquaRed*, *Coronavirus Design* y el nuevo proyecto de *Ayuda a Domicilio*.
* **Publicaciones de LinkedIn**: Integración de los últimos artículos y publicaciones profesionales.
* **Agenda de Eventos**: Un calendario interactivo con las fechas clave y eventos de María.

---

## 🛠️ Tecnologías y Recursos

* **React.js (v18+)**: Estructura interactiva y reactividad de estados.
* **Vite**: Entorno rápido de compilación y empaquetado.
* **CSS3**: Estética "cyber-neon" oscura, animaciones fluidas y variables personalizadas para consistencia de diseño.
* **Web Speech API**: Síntesis de voz nativa del navegador en español (`es-ES`).
* **SVG Vectorial**: Animaciones nativas para los gestos y movimientos de parpadeo del avatar accesorio.

---

## 🚀 Cómo Ejecutar el Proyecto Localmente

1. **Instalar Dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar el Servidor de Desarrollo**:
   ```bash
   npm run dev
   ```
   *Abre la dirección [http://localhost:5173](http://localhost:5173) en tu navegador.*

3. **Compilar para Producción**:
   ```bash
   npm run build
   ```
   *Genera los archivos estáticos listos para desplegar dentro de la carpeta `/dist`.*
