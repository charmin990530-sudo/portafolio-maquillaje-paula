import { sceneConfig } from '../config/scene'

export function getColumnsForWidth(width: number) {
  if (width < sceneConfig.breakpoints.tablet) return 2
  if (width < sceneConfig.breakpoints.desktop) return 3
  return 4
}

export function buildGalleryLayout(count: number, cols: number) {
  const rows: number[][] = []
  let nextImage = 0
  let rowIndex = 0

  while (nextImage < count) {
    const row = Array<number>(cols).fill(-1)
    const primary = (rowIndex * 2 + (rowIndex % 2)) % cols
    row[primary] = nextImage
    nextImage += 1

    if (rowIndex % 3 === 0 && nextImage < count) {
      let secondary = (primary + 2) % cols
      if (secondary === primary) secondary = (primary + 1) % cols
      row[secondary] = nextImage
      nextImage += 1
    }

    rows.push(row)
    rowIndex += 1
  }

  return rows
}

export function getCardTransformOrigin(colIndex: number, cols: number) {
  return colIndex < cols / 2 ? 'right bottom' : 'left bottom'
}
