import type { Product } from '../../config/catalog'
import { getCardTransformOrigin } from '../../lib/galleryLayout'

type GalleryCardProps = { product: Product; colIndex: number; cols: number; priority?: boolean; onSelect: (product: Product) => void }

export function GalleryCard({ product, colIndex, cols, priority = false, onSelect }: GalleryCardProps) {
  return (
    <button type="button" data-gallery-card className="gallery-cell bp-card gallery-card"
      style={{ transformOrigin: getCardTransformOrigin(colIndex, cols) }}
      aria-label={`Ver ${product.name} en grande`} aria-haspopup="dialog" onClick={() => onSelect(product)}>
      <img src={product.image} alt="" loading={priority ? 'eager' : 'lazy'} decoding="async" draggable={false} />
      <span className="gallery-card__label"><span>{product.name}</span><span aria-hidden="true">↗</span></span>
    </button>
  )
}
