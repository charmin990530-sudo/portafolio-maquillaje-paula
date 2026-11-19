# Jers Beauty Lab · Paula Neira

[Portafolio publicado](https://portafolio-maquillaje-paula-pouo.vercel.app)

Portafolio de maquillaje en React, TypeScript y Vite. La portada anima la mirada sobre la fotografía original de Sofi Cora. El carrusel agrupa los trabajos por estilo y admite gestos táctiles, botones, miniaturas y teclado.

## Desarrollo

```sh
npm ci
npm run dev
npm test
npm run build
```

## Contenido y contacto

Las fotografías están en `imagenes/`. Los estilos, las descripciones y el orden de la serie se editan en `src/config/catalog.ts`. Los contornos de la mirada en `src/lib/portrait.ts` corresponden a la foto original de 1200 × 800.

El formulario envía la consulta a través de FormSubmit al correo de `src/config/site.ts`. La primera solicitud requiere activar el destinatario con el enlace que llega a su bandeja. El visitante puede enviar una copia desde WhatsApp con el look y los datos ya escritos. Si el servicio de correo falla, la página conserva la consulta y ofrece reintentar o abrir la aplicación de correo.

Vercel sirve la compilación de `dist/` y aplica las cabeceras de `vercel.json`.
