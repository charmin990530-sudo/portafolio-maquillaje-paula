import type { RefObject } from 'react'
import { domIds } from '../../config/domIds'

type WhiteOverlayProps = {
  overlayRef: RefObject<HTMLDivElement | null>
}

export function WhiteOverlay({ overlayRef }: WhiteOverlayProps) {
  return (
    <div
      id={domIds.outroOverlay}
      ref={overlayRef}
      className="outro-overlay"
      aria-hidden="true"
    />
  )
}
