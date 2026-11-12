import { useEffect, type RefObject } from 'react'
import { sceneConfig } from '../config/scene'
import { getCardScale, getOutroProgress } from '../lib/sceneMath'
import type { CardMetric } from './useGalleryMeasure'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

type GalleryScrollOptions = {
  panelRef: RefObject<HTMLDivElement | null>
  wrapRef: RefObject<HTMLDivElement | null>
  overlayRef: RefObject<HTMLDivElement | null>
  infoRef: RefObject<HTMLDivElement | null>
  buyRef: RefObject<HTMLDivElement | null>
  footerRef: RefObject<HTMLElement | null>
  metricsRef: RefObject<CardMetric[]>
  maxScrollRef: RefObject<number>
  viewportHeightRef: RefObject<number>
}

export function useGalleryScroll({
  panelRef,
  wrapRef,
  overlayRef,
  infoRef,
  buyRef,
  footerRef,
  metricsRef,
  maxScrollRef,
  viewportHeightRef,
}: GalleryScrollOptions) {
  const reducedMotion = usePrefersReducedMotion()
  useEffect(() => {
    const panel = panelRef.current
    const wrap = wrapRef.current
    const overlay = overlayRef.current
    const info = infoRef.current
    const buy = buyRef.current
    const footer = footerRef.current
    if (!panel || !wrap || !overlay || !info || !buy || !footer) return

    if (reducedMotion) {
      panel.style.transform = ''
      wrap.style.transform = ''
      overlay.style.opacity = '0'
      info.style.opacity = '0'
      info.style.transform = ''
      buy.style.transform = 'scale(1)'
      buy.inert = false
      footer.style.opacity = '1'
      footer.inert = false
      metricsRef.current.forEach((card) => { card.el.style.transform = '' })
      return
    }
    let frame = 0

    const tick = () => {
      frame = 0
      const viewportHeight = viewportHeightRef.current || window.innerHeight
      const scrollY = window.scrollY
      const maxScroll = maxScrollRef.current

      const wrapperY = scrollY > viewportHeight ? -(scrollY - viewportHeight) : 0
      wrap.style.transform = `translate3d(0, ${wrapperY}px, 0)`

      const panelY = scrollY < viewportHeight ? viewportHeight - scrollY : 0
      panel.style.transform = `translate3d(0, ${panelY}px, 0)`
      const metrics = metricsRef.current

      for (let i = 0; i < metrics.length; i += 1) {
        const card = metrics[i]
        const top = panelY + wrapperY + card.top
        const bottom = top + card.height
        const scale = getCardScale({
          top,
          bottom,
          viewportHeight,
          enterRatio: sceneConfig.gallery.cardEnterRatio,
          exitRatio: sceneConfig.gallery.cardExitRatio,
        })

        const transform = `scale(${scale})`
        if (card.el.style.transform !== transform) card.el.style.transform = transform
      }

      const progress = getOutroProgress({
        scrollY,
        viewportHeight,
        maxScroll,
        rangeFloor: sceneConfig.outro.rangeFloor,
      })

      overlay.style.opacity = String(progress)

      const outroOffset = Number(
        info.dataset.outroOffset ?? sceneConfig.outro.offsetDesktop,
      )
      const heroInfoOpacity = Math.max(0, 1 - scrollY / viewportHeight)
      info.style.opacity = String(Math.max(heroInfoOpacity, progress))
      info.style.transform = `translate3d(0, ${-outroOffset * progress}px, 0)`
      buy.style.transform = `scale(${progress})`
      footer.style.opacity = String(progress)
      buy.inert = progress < 0.95
      footer.inert = progress < 0.95
    }

    const schedule = () => { if (!frame) frame = requestAnimationFrame(tick) }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('gallery:measure', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('gallery:measure', schedule)
    }
  }, [
    reducedMotion,
    panelRef,
    wrapRef,
    overlayRef,
    infoRef,
    buyRef,
    footerRef,
    metricsRef,
    maxScrollRef,
    viewportHeightRef,
  ])
}
