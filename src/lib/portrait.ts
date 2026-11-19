// Contornos en píxeles de la fotografía original de 1200 × 800.
// Cada par delimita el borde interior de los párpados, de izquierda a derecha.
const eyes = [
  { x: 492, width: 71, radius: 15, top: [297, 281, 275, 279, 291, 312], bottom: [298, 305, 310, 313, 314, 313] },
  { x: 669, width: 73, radius: 14, top: [337, 326, 320, 319, 324, 342], bottom: [338, 344, 348, 352, 355, 350] },
]

function edge(points: number[], unit: number) {
  const p = Math.max(0, Math.min(1, unit)) * (points.length - 1)
  const index = Math.min(Math.floor(p), points.length - 2)
  return points[index] + (points[index + 1] - points[index]) * (p - index)
}

export function prepareGaze(image: HTMLImageElement, canvas: HTMLCanvasElement) {
  // Only the eye region is redrawn. Hair, lashes, skin and hearts stay photographic.
  const left = 490, top = 272
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return
  canvas.width = 256
  canvas.height = 88
  ctx.drawImage(image, -left, -top)
  const original = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const output = ctx.createImageData(canvas.width, canvas.height)
  const stride = canvas.width
  function sample(x: number, y: number, channel: number) {
    const px = x - left, py = y - top
    const ix = Math.floor(px), iy = Math.floor(py)
    const i = (iy * stride + ix) * 4 + channel
    const mix = (a: number, b: number, t: number) => a + (b - a) * t
    return mix(mix(original.data[i], original.data[i + 4], px - ix),
      mix(original.data[i + stride * 4], original.data[i + stride * 4 + 4], px - ix), py - iy)
  }
  return (horizontal: number, vertical: number) => {
    output.data.set(original.data)
    for (const eye of eyes) {
      const center = eye.x + eye.width * (0.5 + horizontal * 0.20)
      const centerUnit = (center - eye.x) / eye.width
      const centerY = (edge(eye.top, centerUnit) + edge(eye.bottom, centerUnit)) / 2 - 1 + vertical * 5
      for (let x = eye.x; x < eye.x + eye.width; x++) {
        const u = (x - eye.x) / eye.width
        const upper = edge(eye.top, u), lower = edge(eye.bottom, u)
        for (let y = Math.ceil(upper); y < lower; y++) {
          const height = lower - upper
          const v = (y - upper) / height
          // Mirror the real sclera texture into the part uncovered by the iris.
          const scleraX = eye.x + 9 + (1 - Math.abs(u * 2 - 1)) * 14
          const scleraU = (scleraX - eye.x) / eye.width
          const scleraY = edge(eye.top, scleraU) * (1 - v) + edge(eye.bottom, scleraU) * v
          const dy = (y - centerY) / 20
          const dx = (x - center - (y - centerY) * .14) / eye.radius
          const distance = Math.hypot(dx, dy)
          const irisWeight = Math.max(0, Math.min(1, (1 - distance) * 10))
          // Sample within the photographed iris and retain its original catchlight.
          const sourceX = 541 + dx * 12 + dy * 2.5
          const sourceY = 295 + dy * 14
          const blend = Math.min(1, y - upper, lower - y, x - eye.x, eye.width + eye.x - x)
          const index = ((y - top) * stride + x - left) * 4
          for (let c = 0; c < 3; c++) {
            const white = sample(scleraX, scleraY, c)
            const iris = irisWeight ? sample(sourceX, sourceY, c) : white
            const color = white + (iris - white) * irisWeight
            output.data[index + c] += (color - output.data[index + c]) * blend
          }
        }
      }
    }
    ctx.putImageData(output, 0, 0)
  }
}
