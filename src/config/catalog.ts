export type Product = {
  id: string
  name: string
  image: string
}

const images = import.meta.glob(['../../imagenes/*.webp', '!../../imagenes/soficora.webp'], {
  eager: true, query: '?url', import: 'default',
}) as Record<string, string>

const entries: Array<Omit<Product, 'image'>> = [
  { id: 'base-atenea', name: 'Base Atenea' },
  { id: 'corrector-atenea', name: 'Corrector Atenea' },
  { id: 'sombras-atenea', name: 'Sombras Atenea' },
  { id: 'delineador-en-gel-jdg', name: 'Delineador en gel JDG' },
  { id: 'lip-gloss', name: 'Lip gloss' },
  { id: 'labial-mate-lbl', name: 'Labial mate L’Bel' },
  { id: 'base-matte-lbel', name: 'Base matte L’Bel' },
  { id: 'shampoo-hidratacion-profunda', name: 'Shampoo hidratación profunda' },
  { id: 'acondicionador-reparador', name: 'Acondicionador reparador' },
  { id: 'tratamiento-control-de-frizz', name: 'Tratamiento control de frizz' },
  { id: 'shampoo-nutritivo', name: 'Shampoo nutritivo' },
  { id: 'acondicionador-nutricion-intensa', name: 'Acondicionador nutrición intensa' },
  { id: 'shampoo-anti-caida', name: 'Shampoo anticaída' },
]

export const products: Product[] = entries.map((product) => {
  const image = images[`../../imagenes/${product.id}.webp`]
  if (!image) throw new Error(`Falta la imagen de ${product.id}.webp en imagenes/`)
  return { ...product, image }
})
