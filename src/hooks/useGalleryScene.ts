import type { RefObject } from 'react'
import { useGalleryMeasure } from './useGalleryMeasure'
import { useGalleryScroll } from './useGalleryScroll'

type GallerySceneOptions = {
  rootRef: RefObject<HTMLDivElement | null>
  panelRef: RefObject<HTMLDivElement | null>
  wrapRef: RefObject<HTMLDivElement | null>
  gridRef: RefObject<HTMLDivElement | null>
  overlayRef: RefObject<HTMLDivElement | null>
  infoRef: RefObject<HTMLDivElement | null>
  buyRef: RefObject<HTMLDivElement | null>
  footerRef: RefObject<HTMLElement | null>
  layout: number[][]
}

export function useGalleryScene({
  rootRef,
  panelRef,
  wrapRef,
  gridRef,
  overlayRef,
  infoRef,
  buyRef,
  footerRef,
  layout,
}: GallerySceneOptions) {
  const { metricsRef, maxScrollRef, viewportHeightRef } = useGalleryMeasure({
    rootRef,
    wrapRef,
    gridRef,
    layout,
  })

  useGalleryScroll({
    panelRef,
    wrapRef,
    overlayRef,
    infoRef,
    buyRef,
    footerRef,
    metricsRef,
    maxScrollRef,
    viewportHeightRef,
  })
}
