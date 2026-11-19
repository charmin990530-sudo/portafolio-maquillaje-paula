import type { RefObject } from 'react'
import { domIds } from '../../config/domIds'
import { siteConfig } from '../../config/site'
import { SparkleIcon } from '../ui/SparkleIcon'

type ViewButtonProps = { buyRef: RefObject<HTMLDivElement | null>; onQuote: () => void }

export function ViewButton({ buyRef, onQuote }: ViewButtonProps) {
  return (
    <div id={domIds.outroBuy} ref={buyRef} className="outro-buy" inert>
      <button type="button" className="outro-buy-text" onClick={onQuote}>
        <SparkleIcon />
        {siteConfig.cta}
        <span aria-hidden="true">↗</span>
      </button>
    </div>
  )
}
