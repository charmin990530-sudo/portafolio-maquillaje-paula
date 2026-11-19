import type { RefObject } from 'react'
import { domIds } from '../../config/domIds'
import type { Product } from '../../config/catalog'
import { GalleryCard } from './GalleryCard'

type GalleryGridProps = { gridRef: RefObject<HTMLDivElement | null>; cols: number; layout: number[][]; products: Product[]; onSelect: (product: Product) => void }

export function GalleryGrid({ gridRef, cols, layout, products, onSelect }: GalleryGridProps) {
  return (
    <div id={domIds.galleryGrid} ref={gridRef} className="gallery-grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {layout.flatMap((row, rowIndex) => row.map((imageIndex, colIndex) => imageIndex === -1
        ? <div key={`spacer-${rowIndex}-${colIndex}`} className="gallery-cell gallery-cell--accent" aria-hidden="true"
            onPointerMove={(event) => {
              const bounds = event.currentTarget.getBoundingClientRect()
              const x = (event.clientX - bounds.left) / bounds.width
              const y = (event.clientY - bounds.top) / bounds.height
              event.currentTarget.style.setProperty('--light-x', `${x * 100}%`)
              event.currentTarget.style.setProperty('--light-y', `${y * 100}%`)
              event.currentTarget.style.setProperty('--tilt-x', `${(0.5 - x) * 10}deg`)
              event.currentTarget.style.setProperty('--tilt-y', `${(y - 0.5) * 8}deg`)
            }} onPointerEnter={(event) => event.currentTarget.dataset.active = 'true'}
            onPointerLeave={(event) => event.currentTarget.dataset.active = 'false'}>
            <svg viewBox="0 0 180 180" focusable="false">
              <defs>
                <linearGradient id={`powder-${rowIndex}-${colIndex}`} x1="0" y1="0" x2="1" y2="1">
                  <stop stopColor="#edbed9" /><stop offset="1" stopColor="#81547f" />
                </linearGradient>
                <linearGradient id={`brush-${rowIndex}-${colIndex}`} x1="0" y1="1" x2="1" y2="0">
                  <stop stopColor="#c89ab5" /><stop offset="1" stopColor="#f4e3ea" />
                </linearGradient>
              </defs>
              <circle className="accent-orbit" cx="91" cy="89" r="65" />
              <circle className="accent-back-pan" cx="67" cy="77" r="31" fill={`url(#powder-${rowIndex}-${colIndex})`} />
              <circle className="accent-front-pan" cx="106" cy="105" r="35" fill={`url(#powder-${rowIndex}-${colIndex})`} />
              <circle className="accent-pan-ring" cx="106" cy="105" r="42" />
              <path className="accent-swipe" d="M39 122c19 10 32 7 48-3 11-7 19-17 32-21" />
              <path className="accent-eye" d="M61 91c10-13 19-18 30-18s20 5 30 18c-10 13-19 18-30 18S71 104 61 91Z" />
              <circle className="accent-iris" cx="91" cy="91" r="11" />
              <circle className="accent-pupil" cx="91" cy="91" r="4" />
              <path className="accent-brush-handle" d="m38 147 72-76 8 8-75 72-7-4 2-8Z" />
              <path className="accent-brush-tip" d="m110 71 16-21c3-4 10 2 7 6l-15 23Z" />
              <circle className="accent-dot" cx="39" cy="55" r="4" />
              <circle className="accent-dot" cx="144" cy="69" r="3" />
              <path className="accent-sparkle" d="M137 37v12m-6-6h12M38 43v8m-4-4h8M148 133v8m-4-4h8" />
            </svg>
          </div>
        : <GalleryCard key={products[imageIndex].id} product={products[imageIndex]} colIndex={colIndex} cols={cols} priority={imageIndex < 6} onSelect={onSelect} />))}
    </div>
  )
}
