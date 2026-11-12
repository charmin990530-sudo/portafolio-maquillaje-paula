# Auditoría rápida del proyecto

Fecha: 2026-11-11. Revisión del código fuente, configuración, estilos, recursos y dependencias declaradas. No se modificó el código de la aplicación.

> **Estado:** informe histórico de la auditoría inicial. El estado corregido de la aplicación está documentado en `CAMBIOS.md` y verificado con `npm run build` y `node tests/scene.test.mjs`.

## Diagnóstico

El proyecto es una página visual de una sola vista, con React, TypeScript y Vite. Tiene una portada con retrato y paralaje, una galería animada de 13 imágenes de productos y un cierre con el texto «Cotizar». La base está separada en componentes, hooks, configuración y funciones de cálculo; TypeScript tiene comprobaciones estrictas activadas.

El principal problema es funcional: la compilación está bloqueada y los controles que aparentan permitir navegar, consultar productos o cotizar todavía no tienen sus acciones conectadas. No hay rutas, API propia, base de datos, carrito funcional, formulario ni integración de contacto en el código revisado.

## Cómo está organizado

| Área | Archivos | Función actual |
| --- | --- | --- |
| Composición y estado | `src/App.tsx` | Monta las capas y guarda el producto seleccionado para un modal. |
| Portada | `src/components/hero/`, `src/config/hero.ts` | Retrato local, logo, textos, controles visuales y cursor personalizado. |
| Galería | `src/components/gallery/`, `src/config/media.ts` | Importa imágenes de `imagenes/`, las ordena y crea una retícula irregular. |
| Animación | `src/hooks/useGallery*`, `usePanelSlide.ts`, `useHeroParallax.ts` | Mide tarjetas y mueve las capas según el desplazamiento y el puntero. |
| Cálculos | `src/lib/galleryLayout.ts`, `sceneMath.ts` | Columnas a 640/1024 px, distribución, escala y progreso del cierre. |
| Contenido | `src/config/site.ts`, `index.html` | Identidad, textos, título y descripción. |
| Video anterior | `src/components/video/`, `src/hooks/video/` | Implementación existente, sin montar en la aplicación actual. |

Flujo implementado en el código: portada → panel negro de galería → cierre blanco. El estado del modal existe, pero ninguna tarjeta lo activa.

## Hallazgos prioritarios

### 1. Alta — La compilación de producción falla

- Evidencia: `npm run build` termina con `TS6133: 'onSelect' is declared but its value is never read`, en `src/components/gallery/GalleryGrid.tsx:18`.
- Causa: el componente recibe `onSelect` y no lo utiliza; `noUnusedLocals` está activado.
- Impacto: no se puede generar una nueva versión mediante el comando de compilación del proyecto. La carpeta `dist/` existente no demuestra que el código actual compile.
- Corrección: completar la interacción de selección y volver a ejecutar la compilación.

### 2. Alta — Las tarjetas nunca abren el modal

- Evidencia: `App.tsx:35` prepara `handleSelectMakeup`; `GalleryPanel.tsx:37` lo pasa a la retícula, pero `GalleryGrid.tsx:39` no lo transmite a `GalleryCard`.
- `GalleryCard.tsx:18` devuelve un `div` sin evento ni control accesible para activar la selección.
- Impacto: `selectedMakeup` permanece en `null` durante el uso normal; el modal no es alcanzable.
- Corrección: usar un botón por tarjeta y conectar la selección hasta el estado de `App`.

### 3. Alta — Cotizar y los controles de navegación son decorativos

- Evidencia: `ViewButton.tsx:11` renderiza un `div` con `aria-hidden="true"`; no tiene enlace ni evento. Su CSS también aplica `pointer-events: none` (`src/styles/outro.css:23`).
- `SiteNav.tsx:17` y `:28` muestran ABOUT/CART como `span`; la hamburguesa es un SVG sin acción. `.nav` desactiva los eventos de puntero (`src/styles/hero.css:73`).
- `SiteFooter.tsx:18` muestra PRIVACY POLICY como texto y su CSS también bloquea el puntero.
- Impacto: el visitante no tiene un flujo implementado para cotizar, contactar, abrir el menú, usar un carrito o consultar una política.
- Corrección: definir los destinos reales y usar enlaces o botones según cada acción.

### 4. Media — La galería está excluida de la accesibilidad

- Evidencia: `GalleryPanel.tsx:29` mantiene `aria-hidden="true"` sobre toda la galería, incluso cuando está visible.
- Los textos alternativos son etiquetas genéricas de la plantilla (`prmpt archive look N`), no nombres de productos.
- La página no tiene `main` ni un encabezado principal `h1`.
- El modal declara `role="dialog"` y permite cerrar con Escape, pero no mueve el foco al abrir, no lo mantiene dentro, no restaura el foco y no bloquea el desplazamiento del fondo (`MakeupModal.tsx`). Estos defectos del modal serán visibles al conectar su apertura.
- Corrección: exponer el contenido real a lectores de pantalla, añadir estructura semántica y completar el manejo del foco.

### 5. Media — Contenido e identidad de la plantilla siguen publicados en el código

- Evidencia: `src/config/site.ts:12` contiene una instrucción técnica en inglés sobre cambiar entre videos y se renderiza mediante `Caption.tsx:17`.
- El título, la descripción, el copyright y los textos alternativos conservan la marca PRMPT; el logo muestra PAULA/By Jers. `index.html:2` declara el idioma inglés.
- Impacto: información incoherente para visitantes, buscadores y tecnologías de asistencia.
- Corrección: unificar marca, idioma y contenido; actualizar título y descripción y añadir metadatos para compartir cuando estén definidos los recursos públicos.

### 6. Media — Los datos de producto dependen de nombres de archivo

- Evidencia: `App.tsx:35` deduce el nombre desde la URL de la imagen.
- En producción Vite añade un identificador al archivo: con un recurso existente, el resultado es `Base Atenea DGwBQ0cS`. Este defecto afectará al modal al conectar la selección.
- El estado incluye `occasion`, pero el modal recibe únicamente el nombre y repite una descripción fija. Además, la galería mezcla maquillaje y productos capilares, mientras el modal siempre dice «Estilo de maquillaje».
- Corrección: crear un catálogo explícito con identificador, nombre, categoría, imagen y descripción; ampliar con precio o destino de cotización cuando corresponda.

### 7. Media — Animación con trabajo continuo y reducción de movimiento incompleta

- Evidencia: `useGalleryScroll.ts:37` recorre las tarjetas y escribe estilos en cada frame aunque el desplazamiento no cambie.
- `useHeroParallax.ts:47` sigue programando frames; cuando el puntero queda en una posición distinta del centro, `active` no se desactiva al alcanzar esa posición y continúa escribiendo variables CSS.
- La preferencia de movimiento reducido desactiva el paralaje y la animación del retrato, pero no las entradas con Motion ni la animación de panel, tarjetas y cierre. En la galería solo cambia `will-change`.
- Impacto: trabajo de renderizado evitable y tratamiento incompleto de la preferencia de accesibilidad. El efecto sobre FPS, CPU y batería no se midió en navegador.
- Corrección: actualizar al cambiar scroll, medidas o puntero; detener interpolaciones cuando se estabilicen y ofrecer una presentación de movimiento reducido coherente.

## Mantenimiento y puntos secundarios

- `VideoBackground` no se importa en la aplicación actual y `src/styles/video.css` tampoco se importa desde el índice de estilos. Sus videos remotos no forman parte de la portada actual. Conviene decidir si se conserva o elimina esta implementación antes de modificarla.
- Si se recupera el video: `useVideoReady.ts:28` considera un error como «listo» y el scrub de escritorio no contempla movimiento reducido. Son observaciones sobre código inactivo, no fallos visibles de la portada actual.
- `@gsap/react` está instalado, pero no se importa en el código fuente. GSAP y Motion sí tienen usos distintos en la aplicación.
- El README de `src/assets/gallery/` indica añadir imágenes allí, pero la importación real busca en `imagenes/` (`src/config/media.ts:20`).
- No hay un README principal, pruebas automatizadas, linter ni configuración de integración continua visible en los archivos inspeccionados.
- `git status` no funciona: la carpeta `.git` disponible en este entorno no contiene un repositorio reconocible. No se pudo revisar historial ni diferencias previas.
- Hay reglas para móvil, tablet y escritorio; el recorte del retrato, las superposiciones y el comportamiento al rotar un teléfono requieren comprobación visual. No se atribuyen fallos visuales sin esa prueba.

## Comprobaciones realizadas y límites

| Comprobación | Resultado |
| --- | --- |
| `npm run build` | Falla en TypeScript por `onSelect` sin usar; no llega a ejecutar Vite. |
| `npm ls --depth=0` | Las dependencias directas declaradas están instaladas; no reporta paquetes directos inválidos. |
| Cálculos aislados de retícula y escena | 149 casos comprobados: cantidades de imágenes 0/1/2/10/13/30 con 2/3/4 columnas, límites de los breakpoints, extremos del cierre y rango de escala. Pasan las invariantes evaluadas. No sustituyen pruebas de interacción. |
| Inicio del servidor local | Bloqueado por el entorno: `listen EPERM` al abrir `127.0.0.1:5173`. No se completó la prueba en navegador con Playwright. |
| `npm audit` | No se pudo consultar el registro: `ENOTFOUND registry.npmjs.org`. El estado de vulnerabilidades de dependencias queda sin verificar. |

Esta es una auditoría rápida del código disponible. No incluye mediciones de rendimiento, pruebas visuales en dispositivos, validación de un despliegue público ni una certificación de seguridad.

## Orden recomendado para empezar a modificar

1. Conectar tarjetas y modal, y recuperar `npm run build`.
2. Implementar la acción real de «Cotizar» y resolver los destinos del menú.
3. Definir el catálogo de productos y reemplazar contenido de plantilla.
4. Corregir semántica, accesibilidad y preferencia de movimiento reducido.
5. Comprobar los flujos en escritorio y móvil; optimizar la animación a partir de esas mediciones.
6. Retirar código obsoleto y actualizar la documentación.
