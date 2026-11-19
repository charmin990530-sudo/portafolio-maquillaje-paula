export type Product = {
  id: string
  name: string
  image: string
}

const images = import.meta.glob(['../../imagenes/*.webp', '!../../imagenes/soficora.webp'], {
  eager: true, query: '?url', import: 'default',
}) as Record<string, string>

const entries: Array<Omit<Product, 'image'>> = [
  { id: 'base-atenea', name: 'Glam rosa nacarado' },
  { id: 'corrector-atenea', name: 'Maquillaje rosa suave' },
  { id: 'sombras-atenea', name: 'Glam de ojos luminoso' },
  { id: 'delineador-en-gel-jdg', name: 'Delineado negro definido' },
  { id: 'lip-gloss', name: 'Maquillaje natural con brillo' },
  { id: 'labial-mate-lbl', name: 'Glam violeta y labios brillantes' },
  { id: 'base-matte-lbel', name: 'Maquillaje natural luminoso' },
  { id: 'shampoo-hidratacion-profunda', name: 'Delineado y sombra rosada' },
  { id: 'acondicionador-reparador', name: 'Maquillaje soft glam' },
  { id: 'tratamiento-control-de-frizz', name: 'Glam rosa con luz violeta' },
  { id: 'shampoo-nutritivo', name: 'Glam violeta editorial' },
  { id: 'acondicionador-nutricion-intensa', name: 'Glam rosa con brillo' },
  { id: 'shampoo-anti-caida', name: 'Maquillaje natural de día' },
]

export const products: Product[] = entries.map((product) => {
  const image = images[`../../imagenes/${product.id}.webp`]
  if (!image) throw new Error(`Falta la imagen de ${product.id}.webp en imagenes/`)
  return { ...product, image }
})
