export function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

export function getSpacerHeight(viewportHeight: number, maxScroll: number) {
  return viewportHeight + maxScroll + 2 * viewportHeight
}

type CardScaleArgs = {
  top: number
  bottom: number
  viewportHeight: number
  enterRatio: number
  exitRatio: number
}

export function getCardScale({
  top,
  bottom,
  viewportHeight,
  enterRatio,
  exitRatio,
}: CardScaleArgs) {
  if (bottom <= 0 || top >= viewportHeight) return 0

  const enter = Math.min(
    1,
    (viewportHeight - top) / (viewportHeight * enterRatio),
  )
  const exit = Math.min(1, bottom / (viewportHeight * exitRatio))

  return clamp(Math.min(enter, exit))
}

type OutroProgressArgs = {
  scrollY: number
  viewportHeight: number
  maxScroll: number
  rangeFloor: number
}

export function getOutroProgress({
  scrollY,
  viewportHeight,
  maxScroll,
  rangeFloor,
}: OutroProgressArgs) {
  const start = viewportHeight + maxScroll
  const range = Math.max(1, viewportHeight - rangeFloor)
  return clamp((scrollY - start) / range)
}
