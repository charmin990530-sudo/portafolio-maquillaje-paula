import type { RefObject } from 'react'
import { CustomCursor } from './CustomCursor'
import { Logo } from './Logo'
import { ProductInfo } from './ProductInfo'
import { SiteFooter } from './SiteFooter'
import { SiteNav } from './SiteNav'
import { ViewButton } from './ViewButton'

type HeroLayerProps = {
  infoRef: RefObject<HTMLDivElement | null>
  buyRef: RefObject<HTMLDivElement | null>
  footerRef: RefObject<HTMLElement | null>
  onStudy: () => void
  onQuote: () => void
  onPrivacy: () => void
}

export function HeroLayer({ infoRef, buyRef, footerRef, onStudy, onQuote, onPrivacy }: HeroLayerProps) {
  return <><Logo /><SiteNav onStudy={onStudy} onQuote={onQuote} /><ProductInfo infoRef={infoRef} /><ViewButton buyRef={buyRef} onQuote={onQuote} /><SiteFooter footerRef={footerRef} onPrivacy={onPrivacy} /><CustomCursor /></>
}
