import { useEffect, type RefObject } from 'react'
import { motion } from 'motion/react'
import { domIds } from '../../config/domIds'
import { entryMotion } from '../../config/motion'
import { sceneConfig } from '../../config/scene'
import { siteConfig } from '../../config/site'
import { useMediaQuery } from '../../hooks/useMediaQuery'

type ProductInfoProps = {
  infoRef: RefObject<HTMLDivElement | null>
}

export function ProductInfo({ infoRef }: ProductInfoProps) {
  const isMobile = useMediaQuery('(max-width: 639px)')

  useEffect(() => {
    const info = infoRef.current
    if (!info) return

    info.dataset.outroOffset = String(
      isMobile ? sceneConfig.outro.offsetMobile : sceneConfig.outro.offsetDesktop,
    )
  }, [infoRef, isMobile])

  return (
    <motion.div
      id={domIds.outroInfo}
      ref={infoRef}
      className="outro-info"
      data-outro-offset={sceneConfig.outro.offsetDesktop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: entryMotion.duration,
        ease: entryMotion.ease,
        delay: entryMotion.delays.productInfo,
      }}
    >
      <p className="outro-label">
        {siteConfig.product.collection}
        <br />
        {siteConfig.product.edition}
      </p>
    </motion.div>
  )
}
