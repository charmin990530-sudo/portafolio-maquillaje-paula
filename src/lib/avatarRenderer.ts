// A single cached atlas and two triangles. No network, model inference or paid service at runtime.
export type AvatarRenderer = { draw: (view: number) => void; resize: () => void; destroy: () => void }

const vertexSource = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = vec2(aPosition.x * 0.5 + 0.5, 0.5 - aPosition.y * 0.5);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`

const fragmentSource = `
precision mediump float;
uniform sampler2D uAtlas;
uniform float uView;
uniform float uTileSize;
varying vec2 vUv;
vec4 frame(float index) {
  vec2 cell = vec2(mod(index, 3.0), floor(index / 3.0));
  // Keep linear filtering within its cell, including at the edge of the atlas.
  vec2 insetUv = mix(vec2(0.5 / uTileSize), vec2(1.0 - 0.5 / uTileSize), vUv);
  return texture2D(uAtlas, (cell + insetUv) / 3.0);
}
void main() {
  float index = clamp(uView, 0.0, 8.0);
  float lower = floor(index);
  float blend = smoothstep(0.25, 0.75, fract(index));
  gl_FragColor = mix(frame(lower), frame(min(lower + 1.0, 8.0)), blend);
}`

export function createAvatarRenderer(canvas: HTMLCanvasElement, image: HTMLImageElement): AvatarRenderer | null {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: true, powerPreference: 'high-performance' })
  if (!gl || image.width > gl.getParameter(gl.MAX_TEXTURE_SIZE)) return null
  const shaders: WebGLShader[] = []
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)
    if (!shader) throw new Error('No se pudo crear el shader')
    shaders.push(shader)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('El navegador no admite el visor')
    return shader
  }
  const program = gl.createProgram()
  const texture = gl.createTexture()
  const buffer = gl.createBuffer()
  const destroy = () => {
    gl.deleteBuffer(buffer)
    gl.deleteTexture(texture)
    gl.deleteProgram(program)
    shaders.forEach((shader) => gl.deleteShader(shader))
  }
  try {
    if (!program || !texture || !buffer) { destroy(); return null }
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource))
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('No se pudo iniciar el visor')
    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    gl.uniform1i(gl.getUniformLocation(program, 'uAtlas'), 0)
    gl.uniform1f(gl.getUniformLocation(program, 'uTileSize'), image.width / 3)
    const viewUniform = gl.getUniformLocation(program, 'uView')
    let lastView = 4
    const draw = (view: number) => {
      lastView = view
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform1f(viewUniform, view)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }
    const resize = () => {
      const size = Math.max(1, Math.min(1600, Math.round(canvas.clientWidth * Math.min(window.devicePixelRatio || 1, 1.5))))
      if (canvas.width !== size || canvas.height !== size) { canvas.width = size; canvas.height = size }
      draw(lastView)
    }
    resize()
    return { draw, resize, destroy }
  } catch {
    destroy()
    return null
  }
}
