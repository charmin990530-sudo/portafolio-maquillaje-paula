const images = import.meta.glob('../../imagenes/*.webp', {
  eager: true, query: '?url', import: 'default',
}) as Record<string, string>

function photo(id: string, alt: string) {
  const src = images[`../../imagenes/${id}.webp`]
  if (!src) throw new Error(`Falta la fotografía ${id}`)
  return { src, alt }
}

export const looks = [
  {
    name: 'Perla y luz', type: 'Glam luminoso',
    colors: ['#ddc3d3', '#edb6b0', '#955b63'],
    detail: 'El reflejo perlado en el centro del párpado se funde con el rosa. Un delineado negro, fino y alargado, enmarca el brillo.',
    photos: [
      photo('perla-corazones', 'Sombra nacarada y labios rosa frente a corazones violetas'),
      photo('perla-perfil', 'Perfil con iluminador en el pómulo y delineado alargado'),
      photo('perla-luz', 'Primer plano del reflejo perlado sobre los párpados'),
      photo('perla-neon', 'Retrato bajo luz violeta con la mano en el mentón'),
      photo('perla-retrato', 'Vista frontal del maquillaje y los labios brillantes'),
    ],
  },
  {
    name: 'Malva suave', type: 'Soft glam',
    colors: ['#bb9fae', '#836a82', '#bc7b88'],
    detail: 'Sombras malva difuminadas hacia la sien y pestañas definidas. Los labios rosados retoman los tonos de los ojos con un acabado satinado.',
    photos: [
      photo('malva-retrato', 'Retrato de tres cuartos con sombras malva y labios rosados'),
      photo('malva-perfil', 'Vista lateral con los ojos cerrados y la mano en el cuello'),
      photo('malva-frontal', 'Retrato con la mirada baja y sombra rosada sobre los párpados'),
      photo('malva-detalle', 'Primer plano del difuminado violeta y los labios satinados'),
    ],
  },
  {
    name: 'Mirada gráfica', type: 'Editorial',
    colors: ['#342939', '#cd939f', '#ebc4bf'],
    detail: 'Un trazo oscuro prolonga la línea de las pestañas. El rubor rosado y el brillo de los labios equilibran la intensidad de la mirada.',
    photos: [
      photo('grafico-corazones', 'Retrato editorial con delineado negro y fondo de corazones'),
      photo('grafico-mirada', 'Detalle de ambos ojos y del delineado exterior'),
      photo('grafico-perfil', 'Perfil con rubor rosa y delineado oscuro'),
      photo('grafico-detalle', 'Detalle frontal del delineado, los labios y el rubor'),
    ],
  },
] as const

export type Look = (typeof looks)[number]
