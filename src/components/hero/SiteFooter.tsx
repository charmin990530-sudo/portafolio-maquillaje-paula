import type { RefObject } from 'react'
import { domIds } from '../../config/domIds'
import { siteConfig } from '../../config/site'

type SiteFooterProps = { footerRef: RefObject<HTMLElement | null>; onPrivacy: () => void }

export function SiteFooter({ footerRef, onPrivacy }: SiteFooterProps) {
  return <footer id={domIds.outroFooter} ref={footerRef} className="outro-footer" inert><span>{siteConfig.footer.copyright}</span><button type="button" onClick={onPrivacy}>{siteConfig.footer.privacy}</button></footer>
}
