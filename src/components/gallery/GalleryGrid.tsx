import type { RefObject } from 'react'
import { domIds } from '../../config/domIds'
import type { Product } from '../../config/catalog'
import { GalleryCard } from './GalleryCard'

type GalleryGridProps = { gridRef: RefObject<HTMLDivElement | null>; cols: number; layout: number[][]; products: Product[]; onSelect: (product: Product) => void }

export function GalleryGrid({ gridRef, cols, layout, products, onSelect }: GalleryGridProps) {
  return (
    <div id={domIds.galleryGrid} ref={gridRef} className="gallery-grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {layout.flatMap((row, rowIndex) => row.map((imageIndex, colIndex) => imageIndex === -1
        ? <div key={`spacer-${rowIndex}-${colIndex}`} className="gallery-cell" aria-hidden="true" />
        : <GalleryCard key={products[imageIndex].id} product={products[imageIndex]} colIndex={colIndex} cols={cols} priority={imageIndex < 6} onSelect={onSelect} />))}
    </div>
  )
}
