# Continuar el proyecto — Paula Neira / By Jers

## Última actualización: 2026-11-12, sesión de cierre y limpieza.
Ruta del proyecto: `/home/juandagamer/Escritorio/portafolio maquillaje paula`.

## Leer primero

Este archivo es un punto de continuidad de una tarea EN CURSO. El usuario pidió primero una auditoría rápida, después autorizó arreglar la web y crear un avatar hiperrealista de la modelo principal que siga el cursor y muestre su maquillaje desde distintos ángulos. Al final pidió guardar todo aquí antes de agotar el contexto. No canceló la tarea de implementación.

La aplicación ya vuelve a compilar. Las fichas, navegación y consultas están conectadas en el código. Hay un avatar multivista generado e integrado en un visor WebGL. La revisión visual y de interacción en navegador NO se pudo ejecutar por restricciones del entorno. No afirmar que está visualmente validada ni que se creó una malla 3D.

## Instrucciones y preferencias del usuario

- Trabajar en español, con iniciativa y sin pedir confirmaciones de rutina.
- Conservar la esencia del diseño original: portada a pantalla completa, interfaz superpuesta, panel negro que asciende al hacer scroll, retícula dispersa con escalas de entrada/salida, cierre claro con «Cotizar».
- Usar la modelo de `imagenes/soficora.webp` como referencia, especialmente su rostro, peinado negro corto y maquillaje.
- El usuario pidió un avatar «3d hiperrealista» que gire siguiendo el cursor, de lado a lado.
- El usuario rechazó explícitamente Runway y los servicios externos de pago. NO usar Runway ni contratar/generar mediante servicios adicionales de pago.
- Pidió aprovechar la memoria y la tarjeta gráfica. Se implementó un visor WebGL que puede usar la GPU del navegador y mantiene una sola textura de nueve vistas en memoria. NO afirmar que el equipo de esta sesión está renderizando con NVIDIA: no hay acceso operativo al controlador.
- Se preguntó opcionalmente por el WhatsApp/enlace real de Paula mediante una pregunta asíncrona. NO se recibió respuesta todavía. No inventar teléfono, correo, precios ni disponibilidad.
- No publicar ni crear otro sitio: se está modificando el proyecto local existente.

## Estado inicial y auditoría

Se revisaron todos los archivos de `src`, HTML, configuración, recursos y dependencias declaradas. El informe original quedó en `AUDITORIA.md` (es una fotografía del estado ANTERIOR, todavía no se marcó como histórica).

Problemas originales:

1. `npm run build` fallaba por TS6133: `onSelect` sin usar en `GalleryGrid.tsx`.
2. La selección se perdía entre `GalleryGrid` y `GalleryCard`, por lo que el modal nunca se abría.
3. Cotizar, menú, ABOUT, CART y privacidad eran elementos decorativos, sin acciones y con `pointer-events: none`.
4. Galería completa con `aria-hidden=true`, tarjetas sin botones, modal sin gestión de foco ni bloqueo de scroll.
5. Texto técnico del prompt en la portada y metadatos/marca PRMPT en lugar de Paula.
6. Nombre del producto calculado desde URL: en producción incluía el hash de Vite.
7. Bucles RAF actualizando estilos incluso cuando no había interacción.
8. Preferencia de movimiento reducido aplicada solo parcialmente.
9. Código antiguo de videos desconectado, documentación de imágenes desactualizada, sin pruebas.

`git status` falla porque `.git` en este entorno no contiene un repositorio reconocible. No asumir un historial de Git recuperable. No hay AGENTS.md aplicable encontrado.

## Qué se implementó

### Catálogo y fichas

- Nuevo `src/config/catalog.ts` con tipo `Product`, 13 referencias explícitas, nombre, categoría, descripción e imagen local.
- Los nombres no se derivan de URLs ni incluyen hashes.
- Se distinguen maquillaje y cuidado capilar.
- `soficora.webp` se excluye del glob de imágenes de producto para no incluirla en el bundle del catálogo.
- `GalleryCard.tsx` ahora usa un botón con nombre accesible, selección real y manejo de foco para llevar la tarjeta a la vista con teclado.
- `GalleryGrid.tsx` y `GalleryPanel.tsx` pasan productos y callback de selección.
- Se retiró `aria-hidden` de la galería. Se añadió región con título «Tu próximo favorito».
- `MakeupModal.tsx` muestra imagen, categoría, nombre y descripción. El botón de consulta conserva el producto.

### Diálogos y navegación

- Nuevo `src/components/ui/Dialog.tsx`: utiliza `<dialog>` nativo y `showModal()`, bloqueo del scroll de fondo, cancelación con Escape y cierre al pulsar fuera. El navegador aporta modalidad, contención y restauración de foco. Pendiente de comprobarlo realmente en navegador.
- Nuevo `src/components/ui/SiteDialogs.tsx`: menú, estudio, privacidad y consulta.
- Menú: selección de productos, estudio y cotización.
- Se sustituyó el carrito decorativo por «[ COTIZAR ]».
- `ViewButton.tsx` contiene un botón real. Su wrapper se activa con `inert=false` al llegar al cierre.
- `SiteFooter.tsx` contiene un botón real para privacidad.
- `App.tsx` coordina producto seleccionado, panel activo y producto para la consulta.
- Botón de salto accesible a productos; CTA de portada lleva a la galería y enfoca el primer producto.

### Consulta y contacto

- Formulario con nombre requerido, detalles y preparación del mensaje.
- Se puede copiar la consulta; si Clipboard API falla, se selecciona el texto para copia manual.
- Se usa `navigator.share` si el dispositivo lo ofrece.
- Se aclara que preparar/copiar NO envía la consulta. No hay backend, persistencia ni envío simulado.
- `siteConfig.contact.whatsapp` está en cadena vacía, pendiente del número del usuario.
- Al configurarlo con dígitos y código de país, aparece un enlace `wa.me` con el mensaje preparado. El envío se confirma dentro de WhatsApp.

### Avatar: alcance REAL

Se utilizó la herramienta de imágenes integrada (`image_gen`), NO Runway, para generar un atlas 3×3 con nueve vistas de la misma modelo, desde aproximadamente −40° a +40°. Se inspeccionó la foto original antes de generar. La imagen original se conserva.

IMPORTANTE: el resultado es un avatar MULTIVISTA PRERENDERIZADO, no una malla GLB, reconstrucción volumétrica, personaje con esqueleto ni órbita libre. Esta diferencia ya se explicó al usuario en comentario. Reproduce la intención visual del giro de la referencia original mediante distintas vistas, con límites de ángulo.

Recursos guardados:

- `src/assets/hero/model-turntable-source.png`: original de generación, 1254×1254 con alfa, nueve cuadros de 418×418; aproximadamente 1.9 MB. No se importa en producción.
- `src/assets/hero/model-turntable.webp`: atlas optimizado con alfa, aproximadamente 340 KB.
- `src/assets/hero/model-front.webp`: cuadro frontal optimizado, aproximadamente 47 KB, usado como carga inicial y alternativa.
- `src/assets/hero/avatar-prompt.txt`: prompt exacto de generación.
- `src/assets/hero/README.md`: procedencia, archivos y límites.

Original generado por la herramienta, conservado fuera del proyecto:
`/home/juandagamer/.codex/generated_images/01a1ccbf-4432-70f2-8fd3-49c0470a1343/exec-af6af484-6b4b-403d-bbdc-3e98bed6bfd5.png`.

El recurso final YA está copiado al proyecto; no depende de esa ruta externa para funcionar.

Implementación:

- Nuevo `src/lib/avatarRenderer.ts`: renderer WebGL nativo, una textura, dos triángulos, shaders para seleccionar/mezclar las celdas del atlas, límites del filtrado para evitar sangrado entre celdas, alfa premultiplicado y liberación de recursos.
- Resolución del canvas limitada a 1600 px y DPR a 1.5.
- Nuevo `src/lib/avatarMath.ts`: normalización del puntero con zona central estable y conversión a cuadros 0…8.
- Nuevo `src/components/hero/AvatarViewer.tsx`: sigue el cursor, suavizado basado en tiempo, control range accesible para móvil y teclado, salida del ángulo, carga inicial frontal, alternativa si WebGL falla y recuperación ante pérdida de contexto.
- El RAF termina al estabilizarse y se interrumpe al ocultarse la pestaña o salir de la portada. No se mueve con el puntero cuando hay un diálogo abierto.
- Con movimiento reducido no hay seguimiento automático del puntero; el control explícito cambia de vista sin interpolación.
- `HeroPortrait.tsx` monta el visor y el contenido real de portada, con h1, texto de marca y acceso a productos.

### Animaciones, estilos y contenido

- `useGalleryScroll.ts` dejó el RAF infinito. Ahora agenda una actualización por scroll, resize o evento `gallery:measure`.
- `useGalleryMeasure.ts` notifica cambios de medidas y omite el montaje animado con movimiento reducido.
- `usePanelSlide.ts` omite GSAP cuando hay movimiento reducido.
- `useCustomCursor.ts` actualiza transform en RAF solo ante movimiento y limpia sus listeners.
- `useRandomSymbolOnScroll.ts` respeta movimiento reducido.
- `MotionConfig reducedMotion="user"` en `App`.
- Modo de movimiento reducido con galería en flujo normal, sin transformaciones de tarjetas ni overlay del cierre; controles finales accesibles.
- Portada oscura en tonos ciruela/rosa, modelo grande al centro/derecha, copy a la izquierda, controles adaptados a móvil/tablet.
- Se reescribieron `hero-scene.css`, `gallery.css`, `makeup-modal.css`, `base.css` y `outro.css`; se ajustaron `hero.css`, `cursor.css` y `product-info.css`.
- `index.html` ahora declara español, título y descripción de Paula, metadatos Open Graph básicos y aviso noscript.
- Favicon sustituido por una P en la paleta del proyecto.
- Se creó `README.md` y se corrigió `src/assets/gallery/README.md` para indicar la ubicación real de imágenes y el catálogo explícito.

## Verificaciones realizadas

### Compilación

`npm run build` PASA después de los cambios. Última salida revisada:

- Vite 6.4.6, 486 módulos transformados.
- JS principal aproximadamente 496.64 KB / 167.89 KB gzip.
- CSS aproximadamente 22.95 KB / 5.78 KB gzip.
- Atlas aproximadamente 340.30 KB; retrato frontal 47.35 KB.
- Las 13 imágenes de productos se emitieron correctamente.
- La foto original de referencia ya no se emite dentro del catálogo.
- La búsqueda de «PRMPT», «prmpt» y «When switching» en los archivos de producción no devolvió coincidencias.

### Pruebas

Nuevo `tests/scene.test.mjs`, con Node test runner y TypeScript ya instalado para cargar las funciones puras sin añadir dependencias.

Siete pruebas pasan al ejecutar directamente:

```bash
node tests/scene.test.mjs
```

Cubren:

1. Retícula sin productos perdidos/duplicados para cantidades 0…80 y 2/3/4 columnas.
2. Breakpoints 640/1024 y sus límites.
3. Inicio/final del cierre para distintas alturas y longitudes de galería.
4. Escalas válidas y ocultación fuera de pantalla.
5. Zona central del avatar, límites, monotonía y dirección del puntero.
6. Correspondencia del giro con los nueve cuadros.
7. Existencia de las 13 imágenes y nombres de catálogo estables.

`package.json` incorpora `test: node --test`. En este sandbox la ejecución normal resumió el archivo como un único test, aunque la ejecución directa mostró explícitamente 7/7 aprobadas. Se lanzó además `node --test --experimental-test-isolation=none tests/scene.test.mjs`; al escribir este archivo estaba pendiente de recoger su salida final en la sesión de terminal 1825. Conviene decidir si cambiar `npm test` a `node tests/scene.test.mjs` para un resultado reproducible sin subprocesos. No se ha añadido ninguna dependencia nueva.

Estas pruebas NO validan el shader en una GPU real, aspecto visual, foco real del navegador ni interacción del usuario.

## Bloqueos del entorno y límites

- Servidor Vite local: `listen EPERM` en `127.0.0.1:5173`.
- Chromium headless mediante Playwright también está bloqueado. La causa concreta observada: `FATAL:content/browser/sandbox_host_linux.cc:41 ... shutdown: Operation not permitted (1)`.
- Se intentó comprobar navegador mediante CUA. Inventario vacío: `The browser access host is unavailable`. Se cerró ese uso con su `completion_summary` correspondiente.
- Por ello NO existen capturas verificadas de la web ni comprobaciones reales de móvil, WebGL, diálogos o formulario.
- `nvidia-smi` existe, pero falla al comunicarse con el controlador. No hay dispositivos GPU operativos accesibles desde esta sesión. No instalar drivers ni cambiar el sistema.
- No hay Blender, bpy ni torch disponibles. Sí hay ffmpeg y Pillow, y se utilizó sharp instalado en el runtime para codificar WebP y extraer el cuadro frontal.
- Sharp del runtime se resuelve con `createRequire(...).require('/home/juandagamer/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp')`; no usar `/sharp/lib/index.js`, esa ruta no existe en la versión instalada.
- `npm audit` no pudo consultar el registro por `ENOTFOUND registry.npmjs.org`. No afirmar dependencias libres de vulnerabilidades.
- El sandbox no permite escalar permisos de shell ni escribir fuera del proyecto o /tmp. No insistir con solicitudes de aprobación para estas restricciones.

## Qué queda por hacer

### Necesario para completar bien la entrega

1. Recoger la salida pendiente de pruebas (si la sesión sigue existiendo) o usar el comando directo ya verificado. Ajustar el script de pruebas si se considera oportuno.
2. Revisar una vez más los cambios por posibles errores evidentes y completar la documentación de entrega (`CAMBIOS.md` estaba previsto y aún NO existe).
3. Marcar `AUDITORIA.md` como informe del estado anterior y enlazar el estado corregido para que no parezca que la compilación sigue rota.
4. Hacer revisión visual/funcional en navegador cuando el entorno vuelva a permitirlo. NO mentir sobre esta validación.
5. Si el usuario proporciona el WhatsApp, integrarlo y verificar el mensaje del producto. Mientras tanto la consulta se prepara/copia, no se envía a un destinatario inventado.
6. Comunicar el resultado final de forma breve y clara, distinguiendo las correcciones, el avatar multivista, la compilación/pruebas y los límites pendientes.

### Inventario para QA cuando haya navegador

- Escritorio 1440×900: portada sin solapamientos que oculten texto/rostro; cursor izquierda/centro/derecha muestra los cuadros esperados y vuelve al centro al salir; no se invierten los lados.
- Control range con mouse, flechas del teclado y móvil táctil; ángulo indicado coincide con la vista.
- Móvil 390×844, 360×640; tablet 768×1024; horizontal de poca altura: rostro, textos y controles caben sin desbordamiento horizontal.
- Scroll: panel negro entra, tarjetas aparecen/desaparecen, los 13 productos son alcanzables, cierre muestra Cotizar y privacidad.
- CTA de portada y menú llevan a productos y enfocan el primero.
- Tarjetas con clic, Enter y Space abren ficha con el nombre correcto sin hash.
- Ficha → consulta conserva el producto y cierra el diálogo anterior.
- Diálogos: Escape, clic fuera, tabulación contenida, foco restaurado, scroll de fondo bloqueado.
- Formulario: nombre vacío o solo espacios se rechaza; texto se prepara; copia funciona o se selecciona; compartir cancelado no se interpreta como envío.
- Movimiento reducido desde el inicio y al cambiarlo: galería en flujo normal y todo alcanzable; el puntero no mueve el avatar; range sí permite elegir vistas explícitamente.
- WebGL desactivado o pérdida de contexto: retrato frontal visible y sin interfaz de giro inoperante.
- Retorno de scroll a la portada y resize entre breakpoints: medidas y giro correctos.
- CPU/RAF en reposo: no debe haber escrituras continuas de la galería o del avatar.

### Limpieza opcional pendiente

Siguen existiendo módulos antiguos que YA no se montan: `VideoBackground`, hooks de video, `useHeroParallax`, `useIsTouchDevice`, `src/config/hero.ts` con assets originales y `Caption.tsx`. `src/config/media.ts` e `index.ts` conservan URLs de demostración antiguas. `@gsap/react` sigue instalado pero sin importar. No afectan al flujo nuevo ni se usan para generar recursos. Decidir si eliminarlos o archivarlos; no borrar imágenes originales del usuario.

## Herramientas y habilidades usadas

- Habilidades Sites para trabajo local, Imagegen para recurso visual, Playwright para el intento de QA. Los conectores de publicación NO se usaron.
- Se hizo únicamente una consulta de autenticación a Runway ANTES de que el usuario lo rechazara; devolvió «requires reauthentication». NO se creó tarea de generación en Runway y NO se debe reconectar.
- No hay subagentes ni tareas delegadas.
- No hay un objetivo persistente creado mediante herramientas de goals.
- El arte generado y el prompt están ya guardados en archivos del proyecto, por lo que no se necesitan variables persistentes de herramientas para retomarlos.

## Comandos útiles al retomar

```bash
pwd
npm run build
node tests/scene.test.mjs
```

Solo intentar navegador si cambió la disponibilidad del entorno; no repetir intentos idénticos bloqueados ni dedicar tiempo a reinstalar navegadores. No publicar cambios sin que esa tarea forme parte de una instrucción posterior.

---

## Estado final (2026-11-12)

- La limpieza de código muerto no montado se completó (ver `CAMBIOS.md`).
- La documentación de entrega se completó con `CAMBIOS.md`; `AUDITORIA.md` quedó marcado como informe histórico.
- Build (`npm run build`) y pruebas (`node tests/scene.test.mjs`, 7/7) en verde.
- Pendiente: revisión visual/funcional en navegador real, número de WhatsApp de Paula y retiro opcional de `@gsap/react`.


---

## Actualizacion (2026-11-12, rebautizo)

- Marca Jers Beauty Lab aplicada en logo, metadatos, pie y fichas; nueva sub-pagina de estudio (Paula Neira) con ida/vuelta verificada.
- Avatar conserva el giro con el cursor; se quitaron controles y textos de angulos.
- Galeria con tipos de maquillaje (Soft/Novia/Natural/Glam) en el modal; build y 7/7 pruebas en verde; navegador verificado en 1440x900 y 390x844 con 0 errores de consola.
- Pendiente: ojos del avatar (limitacion del atlas generado), WhatsApp real y validar los tipos de maquillaje con la duena del estudio.


---

## Actualizacion (2026-11-12, galeria y WhatsApp)

- WhatsApp real activo (`573116540531`) con envio directo del mensaje completo desde el formulario ampliado (ocasion, tipo, fecha, ciudad, detalles).
- Galeria sin GSAP: panel y tarjetas por scroll propio; 13/13 imagenes cargan; tipos de maquillaje visibles en tarjeta y modal; modo reduced-motion en flujo normal.
- Circulo junto a "MAQUILLAJE / JERS BEAUTY LAB" eliminado; iconos de labial en botones Cotizar e icono de WhatsApp en el envio.
- Build y pruebas en verde; bundle reducido ~114 KB. Pendiente: ojos del atlas generado y validar tipos de maquillaje con la duena.


---

## Tercera ronda (2026-11-12)

- Galeria: clic abre visor de imagen ampliada sin ficha ni tipo de maquillaje. Cotizacion solo desde el boton general.
- Catalogo reducido a id, nombre e imagen; validacion de imagen faltante al compilar.
- Icono de destellos en Cotizar (nav y cierre) en lugar del labial.
- Retrato de Paula en la pagina de la maquilladora (WebP optimizado, sin EXIF/GPS; original retirado).
- CSP de produccion, referrer policy, auditoria sin vulnerabilidades y limpieza de codigo/estilos/docs muertos.
- Pendiente editorial: validar textos de Estudios/Fotografia/Trayecto y contenido definitivo de la pagina de Paula.


---

## Cuarta ronda (2026-11-12, movil y despliegue)

- Nav movil compacto (PAULA + logo 112 px), objetivos tactiles de 44 px y sin solapamientos desde 320 px.
- Explorar en movil muestra la intro de la galeria; el foco va al panel. La pagina de Paula abre arriba y restaura el scroll al volver.
- Etiqueta de cierre oculta durante la galeria; ajustes de tablet y estudio.
- `vercel.json` con cabeceras de seguridad. Verificado en 320/360/390/414/640/768/1024/1440.

- Repo publico: https://github.com/charmin990530-sudo/portafolio-maquillaje-paula
- Produccion: https://portafolio-maquillaje-paula.vercel.app
