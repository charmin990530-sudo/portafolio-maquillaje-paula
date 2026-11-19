# Jers Beauty Lab

Portafolio de maquillaje con avatar multivista interactivo, galería de trabajos y cotización directa por WhatsApp. React 19, TypeScript, Vite 6, Motion y Tailwind.

Sitio en producción: [portafolio-maquillaje-paula.vercel.app](https://portafolio-maquillaje-paula.vercel.app)

## Desarrollo

```bash
npm install
npm run dev
```

```bash
npm test
npm run build
npm run preview
```

## Contenido

- `src/config/site.ts`: marca, textos y número de WhatsApp.
- `src/config/catalog.ts`: catálogo explícito; cada identificador corresponde a un archivo de `imagenes/`.
- `src/components/gallery/GalleryLightbox.tsx`: visor de imágenes de la galería.
- `src/components/ui/SiteDialogs.tsx`: formulario de cotización y aviso de privacidad.
- `src/components/hero/AvatarViewer.tsx`: interacción del avatar con el cursor y el teclado.
- `src/lib/avatarRenderer.ts`: composición WebGL del atlas de nueve vistas.
- `src/assets/hero/`: atlas generado, retrato frontal y original PNG para futuras ediciones.
- `src/assets/studio/paula.webp`: retrato de la maquilladora para la página del estudio.

## Avatar y recursos

El giro recorre nueve vistas prerenderizadas de la modelo, de −40° a +40°. WebGL compone las vistas y mantiene una única textura en memoria. Se limita la resolución del canvas y el bucle de animación se detiene al estabilizarse, salir de la portada u ocultarse la pestaña. El avatar sigue el puntero y responde a las flechas del teclado.

No es un archivo GLB, una malla reconstruida ni un personaje con esqueleto. Reproduce el efecto de giro lateral sin videos remotos ni generación durante las visitas. Cuando WebGL no está disponible o se pierde el contexto, se muestra el retrato frontal. Con movimiento reducido, el puntero no mueve el rostro y la galería se presenta en el flujo normal de la página.

## Galería y cotización

Cada imagen abre un visor ampliado. La cotización se completa desde el botón «Cotizar»: el formulario arma un mensaje con nombre, ocasión, tipo de maquillaje, fecha, ciudad y detalles, y abre WhatsApp con el texto listo para enviar. Nada se envía ni se guarda en un servidor; el visitante confirma el envío dentro de WhatsApp.

## Despliegue en Vercel

El repositorio está listo para importarse en Vercel: framework **Vite**, comando de build `npm run build` y directorio de salida `dist`. `vercel.json` añade cabeceras de seguridad (nosniff, anti-clickjacking, permisos y CSP) para el despliegue.

## Seguridad

La compilación inyecta una Content-Security-Policy que restringe scripts al propio sitio, permite solo las tipografías de Google Fonts y bloquea objetos incrustados. No hay claves ni secretos en el cliente. `npm audit` no reporta vulnerabilidades.

## Verificación

Las pruebas cubren retícula, breakpoints, límites de escala y scroll, giro del avatar y referencias locales del catálogo. La compilación comprueba TypeScript antes de generar `dist/`. Ver `CAMBIOS.md` para el alcance y los límites de verificación de esta entrega.
