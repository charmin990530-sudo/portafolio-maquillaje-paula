import { useCallback, useMemo, useRef, useState } from 'react'
import { MotionConfig } from 'motion/react'
import { GalleryPanel } from './components/gallery/GalleryPanel'
import { GalleryLightbox } from './components/gallery/GalleryLightbox'
import { HeroLayer } from './components/hero/HeroLayer'
import { HeroPortrait } from './components/hero/HeroPortrait'
import { WhiteOverlay } from './components/outro/WhiteOverlay'
import { SiteDialogs, type SitePanel } from './components/ui/SiteDialogs'
import { StudioPage } from './components/studio/StudioPage'
import { products, type Product } from './config/catalog'
import { domIds } from './config/domIds'
import { useGalleryScene } from './hooks/useGalleryScene'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import { useViewportColumns } from './hooks/useViewportColumns'
import { buildGalleryLayout } from './lib/galleryLayout'

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const buyRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLElement>(null)
  const homeScrollRef = useRef(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [panel, setPanel] = useState<SitePanel>(null)
  const [view, setView] = useState<'home' | 'studio'>('home')
  const reducedMotion = usePrefersReducedMotion()
  const columns = useViewportColumns()
  const layout = useMemo(() => buildGalleryLayout(products.length, columns), [columns])
  const closeProduct = useCallback(() => setSelectedProduct(null), [])
  const closePanel = useCallback(() => setPanel(null), [])
  const openQuote = useCallback(() => {
    setSelectedProduct(null)
    setPanel('quote')
  }, [])
  const openStudio = useCallback(() => {
    homeScrollRef.current = window.scrollY
    setPanel(null)
    setView('studio')
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  }, [])
  const closeStudio = useCallback(() => {
    setView('home')
    requestAnimationFrame(() => window.scrollTo({ top: homeScrollRef.current, behavior: 'instant' }))
  }, [])
  const explore = useCallback(() => {
    setPanel(null)
    setView('home')
    // Wait for the native dialog to release scroll lock before navigating.
    requestAnimationFrame(() => {
      if (reducedMotion) panelRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' })
      else if (columns === 2) window.scrollTo({ top: window.innerHeight, behavior: 'instant' })
      else window.scrollTo({ top: window.innerHeight + (gridRef.current?.offsetTop ?? 0) - window.innerHeight * 0.18, behavior: 'instant' })
      panelRef.current?.focus({ preventScroll: true })
    })
  }, [columns, reducedMotion])

  useGalleryScene({ rootRef, panelRef, wrapRef, gridRef, overlayRef, infoRef, buyRef, footerRef, layout })

  if (view === 'studio') {
    return (
      <MotionConfig reducedMotion="user">
        <StudioPage onBack={closeStudio} />
      </MotionConfig>
    )
  }

  return (
    <MotionConfig reducedMotion="user">
      <div id={domIds.scrollSpacer} ref={rootRef} role="main" data-reduced-motion={reducedMotion} style={{ height: reducedMotion ? 'auto' : '500vh' }}>
        <button type="button" className="skip-link" onClick={explore}>Ir a los productos</button>
        <HeroPortrait onExplore={explore} />
        <GalleryPanel panelRef={panelRef} wrapRef={wrapRef} gridRef={gridRef} cols={columns} layout={layout} products={products} onSelect={setSelectedProduct} />
        <WhiteOverlay overlayRef={overlayRef} />
        <HeroLayer infoRef={infoRef} buyRef={buyRef} footerRef={footerRef} onStudy={openStudio} onQuote={() => openQuote()} onPrivacy={() => setPanel('privacy')} />
        <GalleryLightbox product={selectedProduct} onClose={closeProduct} />
        <SiteDialogs panel={panel} onClose={closePanel} />
      </div>
    </MotionConfig>
  )
}
