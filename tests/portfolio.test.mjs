import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import test from 'node:test'
import ts from 'typescript'

test('todas las fotografías del portafolio aparecen una sola vez y tienen descripción', () => {
  const source = readFileSync('src/config/catalog.ts', 'utf8')
  const photos = [...source.matchAll(/photo\('([^']+)', '([^']+)'\)/g)]
  const expected = readdirSync('imagenes').filter(file => file !== 'soficora.webp').sort()
  assert.deepEqual(photos.map(match => match[1] + '.webp').sort(), expected)
  assert.ok(photos.every(match => match[2].length > 12))
})

test('el seguimiento cambia ambos ojos en el mismo sentido y mantiene intacto el resto', async () => {
  const source = readFileSync('src/lib/portrait.ts', 'utf8')
  const code = ts.transpileModule(source, { compilerOptions: {
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext,
  } }).outputText
  const { prepareGaze } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'))
  const width = 256, height = 88
  const frame = () => ({ data: new Uint8ClampedArray(width * height * 4).fill(255) })
  const original = frame()
  // A dark patch at the source iris makes the rendered direction measurable.
  for (let y = 8; y <= 38; y++) for (let x = 36; x <= 66; x++) {
    original.data[(y * width + x) * 4] = 0
  }
  let output
  const context = { drawImage() {}, getImageData: () => original, createImageData: frame, putImageData: image => { output = image } }
  const render = prepareGaze({}, { getContext: () => context })
  function centers(yaw) {
    render(yaw, 0)
    const sums = [0, 0], counts = [0, 0]
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const pixel = output.data[(y * width + x) * 4]
      if (x < 2 || (x > 73 && x < 179) || x > 252) assert.equal(pixel, 255)
      if (pixel < 64) {
        const eye = Number(x > 150)
        sums[eye] += x
        counts[eye]++
      }
    }
    return sums.map((sum, index) => sum / counts[index])
  }
  const left = centers(-1), middle = centers(0), right = centers(1)
  for (let i = 0; i < 2; i++) assert.ok(left[i] < middle[i] && middle[i] < right[i])
})
