# Continuar el portafolio de Paula

## Objetivo acordado

Mejorar el portafolio existente sin reemplazar ni rediseñar su interfaz. El usuario considera que el diseño original ya se ve lindo y quiere conservarlo exactamente. Limitar los cambios a los dos elementos siguientes y pedirle que aclare cualquier detalle que no quede definido antes de implementarlo.

## 1. Avatar de Sofi Cora

- Mantener el diseño, la composición de la portada, sus textos, la paleta y la animación del sitio como están en la versión restaurada.
- Reemplazar o rehacer únicamente el avatar multivista del visor existente para que se parezca mucho más a Sofi Cora, la modelo real maquillada por Paula.
- La fuente de identidad visual es `imagenes/soficora.webp`, que ya aparece como imagen de fondo en la portada. Conservar sus rasgos, tono de piel, ojos, corte bob negro, maquillaje real y fondo morado con corazones.
- El usuario quiere que el avatar interactúe con el cursor dentro del diseño original. Evitar desplazar, redibujar o reemplazar la portada completa.
- Revisar el atlas y el visor actuales antes de proponer generación o integración. El recurso actual de `src/assets/hero/model-turntable.webp` tiene nueve vistas generadas y se parece menos a Sofi que la foto. El visor WebGL actual interpola entre las celdas del atlas usando `src/components/hero/AvatarViewer.tsx` y `src/lib/avatarRenderer.ts`.
- No afirmar que se obtuvo una malla 3D si la entrega es un atlas 2D multivista. Describir las limitaciones de cualquier técnica con claridad.

## 2. Etiquetas de la galería

- Mantener intactos el carrusel, su retícula, su ubicación y sus interacciones existentes.
- Cambiar solamente los títulos que hoy heredan nombres comerciales de archivos de ecommerce, como «Base Atenea».
- Usar un nombre breve que describa el tipo o estilo de maquillaje visible en cada fotografía. Por ejemplo, «Glam luminoso» o «Delineado gráfico» solo cuando la foto realmente lo represente.
- No mencionar nombres de marcas, paletas, productos ni tratamientos. No son productos a la venta. Son fotografías de muestra del trabajo de la maquilladora.
- Consultar y clasificar visualmente cada imagen antes de asignarle una etiqueta. No suponer que el nombre del archivo indica el maquillaje.

## Otras mejoras solicitadas, manteniendo el diseño

El usuario pidió incluir también estas tareas en la mejora. Aplicarlas dentro de la galería y del avatar actuales, conservando su distribución, estilo y aspecto general.

### Avance local

- Se generó una nueva versión del atlas multivista usando `imagenes/soficora.webp` como referencia principal. Conserva los nueve ángulos del visor existente y mejora la semejanza general del cabello, ojos, rostro y maquillaje de Sofi. Se integró como `sofi-turntable.webp` y su vista frontal como `sofi-front.webp`; los archivos anteriores permanecen intactos.
- Los espacios vacíos ya muestran una composición propia de pigmentos, trazos, brocha, delineado y puntos de luz que sigue el cursor con una respuesta tridimensional sutil. Utiliza únicamente las celdas vacías existentes. El usuario pidió que el resultado se sienta bonito, llamativo e interactivo; debe valorarlo en la vista previa antes de publicar.
- Se actualizaron las etiquetas de las 13 fotos a descripciones de maquillaje que corresponden visualmente a cada imagen. Los nombres de archivo siguen intactos. Hay que revisar que la descripción refleje la opinión de Paula sobre el look.
- Se cambió el ajuste de las imágenes de la galería de recorte a contención completa dentro de cada tarjeta.
- Se añadió una primera interacción táctil al avatar en móvil: arrastrar horizontalmente dentro de su área cambia el ángulo. El gesto vertical sigue disponible para desplazarse por la página.
- Estos avances están solo en la carpeta local y aún no se han publicado ni enviado a GitHub. Falta comprobar el resultado visual y móvil.
- Pendiente de respuesta antes de avanzar en los adornos entre fotos y de dar por aprobado el gesto móvil. Consultar también cualquier requisito sobre su apariencia.

- **Movimiento 3D en las imágenes del carrusel.** Añadir una sensación de profundidad y respuesta al movimiento a las fotos dentro de las tarjetas actuales. Conservar la fotografía completa y sus proporciones. Aplicar con sutileza, sin girar o recortar caras ni perjudicar la lectura del maquillaje.
- **Adaptación móvil.** Hacer que la página completa, el carrusel, las tarjetas, las imágenes y los controles funcionen bien en celulares de distintos tamaños. Revisar el sitio en anchuras móviles representativas y evitar desbordamientos, solapamientos y controles demasiado pequeños.
- **Avatar interactivo en el celular.** Permitir que el avatar responda al tacto en la portada original. Acordar o verificar cómo responde a gestos táctiles y al desplazamiento vertical antes de implementarlo, para que interactuar con la cara no vuelva incómodo recorrer la página.
- **Encuadre de las fotografías.** Mantener cada fotografía completamente contenida en el espacio asignado a su tarjeta o visor, sin cortar partes de cara o maquillaje y sin estirar la imagen. Elegir el tratamiento por proporción del archivo y del espacio existente, sin rediseñar el carrusel.
- **Detalles entre fotografías.** Incorporar pequeños elementos visuales atractivos relacionados con el maquillaje en los espacios que ya existen entre las fotos. Deben complementar la composición y la marca, no crear nuevas secciones, ocupar el espacio de las fotografías ni cambiar la retícula. Si el usuario no ha definido la estética o el contenido de estos elementos, preguntarle y mostrarle la propuesta antes de expandirla a todas las tarjetas.

### Verificación de estas mejoras

- Comprobar el encuadre de cada fotografía en el espacio original del carrusel.
- Revisar la interacción táctil del avatar y de las fotos en celular, incluido el gesto de desplazamiento vertical.
- Revisar varios tamaños de celular y movimiento reducido.
- Presentar una vista previa del resultado conservando el diseño. Esperar la aprobación del usuario antes de desplegar.

## Restricciones expresas

- Conservar el diseño actual tal cual. No cambiar su estructura visual, proporciones, disposición, textos de portada, paleta ni animaciones generales.
- No convertir el sitio en otro tipo de portafolio ni reemplazarlo por un rediseño nuevo.
- No borrar `continuar.md`, `README.md`, documentación o archivos por considerarlos basura sin que el usuario lo pida.
- Si hay dudas sobre qué debe hacer el avatar, qué imágenes corresponden a cada estilo, o cómo conseguir el parecido solicitado, detenerse en ese punto y preguntar al usuario. No hacer cambios basados en una suposición de alto impacto.
- No publicar ni subir cambios que el usuario no haya revisado, salvo que autorice expresamente el despliegue.

## Estado de Git y publicación

- El diseño original fue restaurado mediante el commit `d65089c`, que revierte el rediseño `e7729b0`.
- `main` de GitHub quedó actualizado con la restauración.
- El dominio público de Vercel volvió a servir el diseño anterior después del despliegue.
- Comprobar `git status` y la versión activa antes de empezar otra tarea. Preservar el estado restaurado como punto de partida.
- La confirmación del correo en FormSubmit no fue completada. No presentarla como una función de correo verificada.

## Primera acción para retomar

1. Leer este archivo y revisar visualmente el sitio restaurado en el navegador, en especial la portada original, la interacción del avatar y la galería durante el scroll.
2. Mantener el alcance en los cambios puntuales descritos arriba: avatar, etiquetas, movimiento de las fotos, respuesta táctil, adaptación móvil, encuadre y detalles de maquillaje entre fotos.
3. Si no se puede identificar una manera fiable de mejorar el parecido del avatar con el material que hay, explicar qué referencia o decisión falta y preguntarle al usuario antes de editar.
4. Al terminar una propuesta, enseñársela para revisión y esperar comentarios antes de desplegarla.
