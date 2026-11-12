import type { RefObject } from 'react'
import { domIds } from '../../config/domIds'
import type { Product } from '../../config/catalog'
import { GalleryGrid } from './GalleryGrid'

type GalleryPanelProps = { panelRef: RefObject<HTMLDivElement | null>; wrapRef: RefObject<HTMLDivElement | null>; gridRef: RefObject<HTMLDivElement | null>; cols: number; layout: number[][]; products: Product[]; onSelect: (product: Product) => void }

export function GalleryPanel({ panelRef, wrapRef, gridRef, cols, layout, products, onSelect }: GalleryPanelProps) {
  return (
    <div id={domIds.galleryPanel} ref={panelRef} className="black-panel" role="region" aria-labelledby="gallery-title" tabIndex={-1}>
      <div id={domIds.galleryWrap} ref={wrapRef} className="gallery-wrap">
        <div className="gallery-intro"><p className="eyebrow">TRABAJOS / 01</p><h2 id="gallery-title">Sus trabajos<br /><em>de maquillaje.</em></h2><p>Toca una imagen<br />para verla en grande.</p></div>
        <GalleryGrid gridRef={gridRef} cols={cols} layout={layout} products={products} onSelect={onSelect} />
      </div>
    </div>
  )
}
