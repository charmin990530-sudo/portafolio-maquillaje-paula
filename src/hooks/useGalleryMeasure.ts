import { useEffect, useRef, type RefObject } from 'react'
import { galleryCardSelector } from '../config/domIds'
import { getSpacerHeight } from '../lib/sceneMath'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export type CardMetric = {
  el: HTMLElement
  top: number
  height: number
}

type GalleryMeasureOptions = {
  rootRef: RefObject<HTMLDivElement | null>
  wrapRef: RefObject<HTMLDivElement | null>
  gridRef: RefObject<HTMLDivElement | null>
  layout: number[][]
}

export function useGalleryMeasure({
  rootRef,
  wrapRef,
  gridRef,
  layout,
}: GalleryMeasureOptions) {
  const reducedMotion = usePrefersReducedMotion()
  const metricsRef = useRef<CardMetric[]>([])
  const maxScrollRef = useRef(0)
  const viewportHeightRef = useRef(window.innerHeight)

  useEffect(() => {
    if (reducedMotion) return
    const root = rootRef.current
    const wrap = wrapRef.current
    const grid = gridRef.current
    if (!root || !wrap || !grid) return

    const measure = () => {
      const viewportHeight = window.innerHeight
      const maxScroll = Math.max(0, wrap.offsetHeight - viewportHeight)

      viewportHeightRef.current = viewportHeight
      maxScrollRef.current = maxScroll
      root.style.height = `${getSpacerHeight(viewportHeight, maxScroll)}px`

      const cards = grid.querySelectorAll<HTMLElement>(galleryCardSelector)
      metricsRef.current = Array.from(cards).map((el) => ({
        el,
        top: grid.offsetTop + el.offsetTop,
        height: el.offsetHeight,
      }))

      window.dispatchEvent(new Event('gallery:measure'))
    }

    measure()
    const frame = requestAnimationFrame(measure)
    const resizeObserver = new ResizeObserver(measure)

    resizeObserver.observe(wrap)
    window.addEventListener('resize', measure)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [rootRef, wrapRef, gridRef, layout, reducedMotion])

  return { metricsRef, maxScrollRef, viewportHeightRef }
}
