import { motion } from 'motion/react'
import { entryMotion } from '../../config/motion'
import { siteConfig } from '../../config/site'
import { SparkleIcon } from '../ui/SparkleIcon'

type SiteNavProps = { onStudy: () => void; onQuote: () => void }

export function SiteNav({ onStudy, onQuote }: SiteNavProps) {
  return (
    <motion.header className="nav" initial={{ opacity: 0, y: entryMotion.distance }} animate={{ opacity: 1, y: 0 }} transition={{ duration: entryMotion.duration, ease: entryMotion.ease, delay: entryMotion.delays.nav }}>
      <nav aria-label="Navegación principal">
        <div className="nav-actions">
          <button type="button" className="nav-study" onClick={onStudy}>
            <span className="nav-study__full">{siteConfig.nav.about}</span>
            <span className="nav-study__short">PAULA</span>
          </button>
          <button type="button" className="nav-cart" onClick={onQuote}>
            <SparkleIcon />
            <span>{siteConfig.nav.cart}</span>
          </button>
        </div>
      </nav>
    </motion.header>
  )
}
