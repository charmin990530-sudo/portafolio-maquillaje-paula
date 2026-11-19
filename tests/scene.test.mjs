import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'

const modules = new Map()
function load(relativePath) {
  const filename = path.resolve(relativePath)
  if (modules.has(filename)) return modules.get(filename)
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  const module = { exports: {} }
  vm.runInNewContext(code, { module, exports: module.exports, require: (name) => load(path.resolve(path.dirname(filename), `${name}.ts`)) }, { filename })
  modules.set(filename, module.exports)
  return module.exports
}

const layout = load('src/lib/galleryLayout.ts')
const scene = load('src/lib/sceneMath.ts')
const avatar = load('src/lib/avatarMath.ts')

test('La retícula contiene cada producto una vez, sin huecos de índices ni duplicados', () => {
  for (let count = 0; count <= 80; count++) {
    for (const columns of [2, 3, 4]) {
      const rows = layout.buildGalleryLayout(count, columns)
      assert.ok(rows.every((row) => row.length === columns))
      const ids = Array.from(rows.flat()).filter((value) => value !== -1).sort((a, b) => a - b)
      assert.deepEqual(ids, Array.from({ length: count }, (_, index) => index))
    }
  }
})

test('Los límites de columnas coinciden con los breakpoints del diseño', () => {
  for (const [width, count] of [[320, 2], [639, 2], [640, 3], [1023, 3], [1024, 4], [1920, 4]]) assert.equal(layout.getColumnsForWidth(width), count)
})

test('El cierre empieza después de la galería y alcanza el final del scroll', () => {
  for (const viewportHeight of [320, 600, 900, 1440]) for (const maxScroll of [0, 100, 3000, 12000]) {
    const options = { viewportHeight, maxScroll, rangeFloor: 100 }
    assert.equal(scene.getOutroProgress({ ...options, scrollY: 0 }), 0)
    assert.equal(scene.getOutroProgress({ ...options, scrollY: viewportHeight + maxScroll }), 0)
    assert.equal(scene.getOutroProgress({ ...options, scrollY: scene.getSpacerHeight(viewportHeight, maxScroll) - viewportHeight }), 1)
  }
})

test('Las tarjetas fuera de pantalla se ocultan y nunca generan escalas inválidas', () => {
  for (const viewportHeight of [320, 844, 900]) for (const height of [120, 500, 900]) for (let top = -1200; top <= 1800; top += 20) {
    const bottom = top + height
    const value = scene.getCardScale({ top, bottom, viewportHeight, enterRatio: .6, exitRatio: .4 })
    assert.ok(Number.isFinite(value) && value >= 0 && value <= 1)
    if (bottom <= 0 || top >= viewportHeight) assert.equal(value, 0)
  }
})

test('El avatar mantiene el centro, limita los extremos y sigue el cursor sin invertirlo', () => {
  for (const width of [320, 390, 768, 1440, 2560]) {
    assert.equal(avatar.pointerToYaw(width / 2, width), 0)
    assert.equal(avatar.pointerToYaw(width * .48, width), 0)
    assert.equal(avatar.pointerToYaw(0, width), -1)
    assert.equal(avatar.pointerToYaw(width, width), 1)
    let previous = -1
    for (let x = -20; x <= width + 20; x++) {
      const yaw = avatar.pointerToYaw(x, width)
      assert.ok(yaw >= -1 && yaw <= 1 && yaw >= previous)
      previous = yaw
    }
  }
  assert.equal(avatar.pointerToYaw(100, 0), 0)
})

test('La conversión del giro utiliza exactamente los nueve cuadros del atlas', () => {
  assert.equal(avatar.yawToFrame(-1), 0)
  assert.equal(avatar.yawToFrame(0), 4)
  assert.equal(avatar.yawToFrame(1), 8)
  assert.equal(avatar.yawToFrame(-5), 0)
  assert.equal(avatar.yawToFrame(5), 8)
})

test('Las 13 referencias del catálogo corresponden a imágenes locales y nombres estables', () => {
  const source = fs.readFileSync('src/config/catalog.ts', 'utf8')
  const entries = Array.from(source.matchAll(/id: '([^']+)', name: '([^']+)'/g))
  assert.equal(entries.length, 13)
  assert.equal(new Set(entries.map((entry) => entry[1])).size, 13)
  for (const [, id, name] of entries) {
    assert.ok(fs.existsSync(`imagenes/${id}.webp`), `Falta ${id}.webp`)
    assert.ok(!name.includes('.webp') && !name.includes('/assets/'))
  }
})
