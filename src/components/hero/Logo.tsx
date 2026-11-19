import { motion } from 'motion/react'
import { entryMotion } from '../../config/motion'
import { siteConfig } from '../../config/site'

export function Logo() {
  return (
    <motion.div
      className="logo"
      initial={{ opacity: 0, y: entryMotion.distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: entryMotion.duration,
        ease: entryMotion.ease,
        delay: entryMotion.delays.logo,
      }}
    >
      <svg
        viewBox="0 0 360 118"
        role="img"
        aria-label={siteConfig.logo.ariaLabel}
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="0"
          y="84"
          fill="#ffffff"
          fontFamily="'Inter Tight', Inter, sans-serif"
          fontSize="80"
          fontWeight="500"
          letterSpacing="-6"
          textLength="258"
          lengthAdjust="spacingAndGlyphs"
        >
          {siteConfig.logo.wordmark}
        </text>
        <text
          x="2"
          y="112"
          fill="#ffffff"
          fontFamily="'Inter Tight', Inter, sans-serif"
          fontSize="17"
          fontWeight="500"
          letterSpacing="2.4"
        >
          {siteConfig.logo.mark}
        </text>
      </svg>
    </motion.div>
  )
}
