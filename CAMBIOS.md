# Cambios — Paula Neira / By Jers

Fecha: 2026-11-12. Continuación de la sesión de auditoría y corrección iniciada el 2026-11-11.

## Alcance de esta sesión

Cierre de la continuación del proyecto:

- Limpieza de código muerto que ya no se monta en la aplicación:
  - `src/components/hero/Caption.tsx`
  - `src/components/video/` (incluye `VideoBackground` y los hooks de video)
  - `src/hooks/useHeroParallax.ts`
  - `src/hooks/useIsTouchDevice.ts`
  - `src/hooks/video/`
  - `src/config/hero.ts`
  - `src/config/media.ts`
  - `src/config/index.ts`
  - `src/styles/video.css`
- Retirada de los bloques que solo servían a ese código: `sceneConfig.video` en `src/config/scene.ts` y las reglas `.caption` en `src/styles/hero.css`.

## Verificación final

- `npm run build` (TypeScript + Vite): OK.
- `node tests/scene.test.mjs`: 7/7 pruebas pasan.
- `npm test`: ejecuta las mismas pruebas con el runner de Node.

## Estado pendiente

1. Revisión visual y funcional en navegador real (desktop, tablet y móvil). El entorno bloqueó Chromium headless y el servidor Vite durante la sesión.
2. Número de WhatsApp real de Paula para activar el enlace `wa.me`.
3. Retirar `@gsap/react` del `package.json` (está declarado pero no se usa; `gsap` sí se consume directamente).

## Límites conocidos

- El avatar es un atlas multivista prerenderizado con visor WebGL, no una malla 3D con rig propio.
- Las pruebas no validan una GPU real, foco real del navegador ni interacción visual completa.
- No se publicó el sitio ni se creó otro: los cambios se aplican al proyecto local existente.


## Rebautizo y ajustes de portada (2026-11-12)

- Marca unificada como **Jers Beauty Lab**: logo (JERS + BEAUTY LAB debajo, sin solapes ni recortes), titulo y metadatos de `index.html`, pie de pagina, ficha de producto y textos de consulta.
- Fuera "By Jers" y "Paula" de toda la portada, galeria, modales y mensajes. Paula Neira aparece solo en la sub-pagina de estudio, como maquilladora encargada.
- Copy del hero: "Muestra tu gran belleza." con entrada "JERS BEAUTY LAB — MAQUILLAJE" y descripcion "Saca lo mejor que tienes dentro, muestra tu gran belleza. Descubre los detalles y encuentra tu proximo favorito."
- Avatar: se conserva el giro suave siguiendo el cursor; se elimino toda la interfaz y textos de angulos (control, estado FRONTAL, "Mueve el cursor").
- Navegacion: sin menu hamburguesa ni bloque de estudio aparte; ahora "MAQUILLADORA ENCARGADA" abre la sub-pagina y "[ COTIZAR ]" usa estilo labial (pill degradado rosa).
- Sub-pagina `StudioPage` con cabecera centrada y secciones Estudios / Fotografia / Trayecto en rejilla; boton "Volver a la seleccion" funcional.
- Galeria: se mantiene el encuadre con `object-fit: cover`; al abrir una imagen el modal muestra "Tipo de maquillaje" (Soft, Novia, Natural, Glam) definido por producto en `src/config/catalog.ts`.
- Dialogos: se retiraron los paneles menu/about ya inalcanzables y las menciones a angulos.
- Verificacion: `npm run build` OK, `node tests/scene.test.mjs` 7/7, revision en navegador (escritorio 1440x900 y movil 390x844) sin desbordes horizontales y con 0 errores de consola.

## Limites conocidos de esta ronda

- El atlas del avatar (`model-turntable.webp`) trae imperfecciones de generacion en los ojos del frame frontal; no se corrigen por codigo sin regenerar la imagen.
- Los tipos de maquillaje asignados por producto son una propuesta editable en `catalog.ts`.
- Sigue pendiente el numero real de WhatsApp para activar el enlace `wa.me`.


## Galeria, WhatsApp y detalles (2026-11-12, segunda ronda)

- WhatsApp real configurado: `+57 311 654 0531` (`573116540531`). El formulario de cotizacion abre directamente `wa.me` con el mensaje completo.
- Cotizacion ampliada: nombre, ocasion, tipo de maquillaje, fecha del evento, ciudad y detalles/alergias. El mensaje se arma con todas las respuestas y el producto de origen si se cotiza desde una ficha. Incluye vista previa, copiar y enlace alterno por si el navegador bloquea la ventana.
- Se elimino el circulo con simbolo giratorio junto a "MAQUILLAJE / JERS BEAUTY LAB" (`ProductInfo`), junto con su hook, configuracion y estilos.
- Boton Cotizar con icono de labial en el nav y en el CTA final; icono de WhatsApp en el envio del formulario.
- Galeria: se retiro GSAP/ScrollTrigger del panel y del scroll; ahora el deslizamiento y el escalado de tarjetas se controlan con el listener de scroll propio (menos dependencias, sin fallos tras HMR). Bundle JS: 496 KB -> 382 KB. Se eliminaron `gsap` y `@gsap/react` de `package.json`.
- Seccion renombrada a "TRABAJOS / 01" con "Sus trabajos de maquillaje"; cada tarjeta muestra el tipo (Soft/Novia/Natural/Glam) y el modal lo destaca como "Tipo de maquillaje".
- Primera fila de imagenes con carga `eager`; el resto `lazy`. Verificado: 13/13 imagenes cargan.
- Accesibilidad: en `prefers-reduced-motion` la galeria pasa a flujo normal (posicion relativa, sin transformaciones) y las tarjetas quedan visibles.
- Verificacion: build OK, pruebas 7/7, 0 errores de consola; flujo completo de WhatsApp probado interceptando `window.open`; movil 390x844 y escritorio 1440x900 sin desbordes.


## Cierre de produccion (2026-11-12, tercera ronda)

- La galeria abre cada imagen en un visor ampliado (solo imagen, nombre y cierre). Se elimino la ficha de producto, el tipo de maquillaje por imagen y la cotizacion desde la ficha; toda la cotizacion pasa por el formulario general.
- El catalogo se simplifico a `id`, `nombre` e `imagen`; la compilacion falla si falta un archivo en `imagenes/`.
- El icono de labial se reemplazo por un par de destellos (SparkleIcon), mas legible y acorde a la marca, en el boton Cotizar del nav y del cierre.
- La pagina de la maquilladora muestra el retrato de Paula Neira en un marco de arco, adaptado a movil y escritorio. La imagen se optimizo a WebP 1200x1600 sin metadatos EXIF/GPS; el JPEG original con ubicacion se retiro del proyecto.
- Seguridad: CSP inyectada solo en la compilacion (`script-src 'self'`, tipografias de Google permitidas, `object-src 'none'`, `base-uri` y `form-action` restringidos), `Referrer-Policy` por meta, enlaces externos con `noopener noreferrer` y `npm audit` sin vulnerabilidades.
- Limpieza: se eliminaron MakeupModal, LipstickIcon, estilos de ficha/precio/menu sin uso, claves muertas de configuracion y el README obsoleto de assets. Sin clases CSS huerfanas.
- Verificacion final: build OK, pruebas 7/7, preview de produccion con CSP y 0 errores de consola, visor y retrato probados en escritorio y movil.


## Ajustes moviles y despliegue (2026-11-12, cuarta ronda)

- Nav movil: etiqueta corta "PAULA" y logo de 112 px para evitar el solapamiento con Cotizar; objetivos tactiles de 44 px en nav, cierre de dialogos y footer.
- Explorar en movil aterriza en la portada de la galeria (intro visible bajo el nav) y mueve el foco al panel sin anillo visual; en escritorio se conserva el salto a la retícula.
- El retrato y la pagina de la maquilladora abren desde el inicio y, al volver, restauran la posicion previa de la galeria.
- La etiqueta fija "MAQUILLAJE / JERS BEAUTY LAB" se oculta durante la galeria y reaparece en el cierre.
- Ajustes de tablet: separacion del nav a 640/768 px y cabecera del estudio en una columna hasta 767 px, con titulo escalado.
- Se agrego `vercel.json` con cabeceras de seguridad para el despliegue y se verifico el responsive en 320, 360, 390, 414, 640, 768, 1024 y 1440 px sin desbordes.

- Repositorio publico y despliegue en Vercel: https://github.com/charmin990530-sudo/portafolio-maquillaje-paula y https://portafolio-maquillaje-paula.vercel.app
