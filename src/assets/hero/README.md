# Avatar de la modelo

Generado con la herramienta de imágenes integrada, usando `imagenes/soficora.webp` como referencia de identidad y maquillaje. No se utilizó Runway para generar recursos.

- `model-turntable-source.png`: original generado, 1254 × 1254, con canal alfa; nueve vistas de 418 × 418.
- `model-turntable.webp`: versión optimizada que utiliza el visor WebGL.
- `model-front.webp`: cuadro frontal utilizado como carga inicial y alternativa cuando WebGL no está disponible.
- `avatar-prompt.txt`: prompt exacto de generación.

La imagen original se conserva. La preparación local de recursos solo extrae el cuadro frontal y codifica los archivos WebP. No es una malla 3D ni un rig; es una representación multivista prerenderizada para el giro lateral interactivo.

## Atlas de Sofi Cora

- `sofi-turntable.webp`: atlas 3 × 3 con nueve ángulos, regenerado con `imagenes/soficora.webp` y el atlas anterior como referencias visuales.
- `sofi-front.webp`: cuadro frontal correspondiente, usado durante la carga y como alternativa sin WebGL.
- El visor conserva la mecánica de giro existente. Solo cambian los retratos y la identidad visual del avatar.
