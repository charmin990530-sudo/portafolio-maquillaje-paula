import { useEffect, useRef } from 'react'
import portrait from '../../../imagenes/soficora.webp'
import { prepareGaze } from '../../lib/portrait'

export function HeroPortrait() {
  const section = useRef<HTMLElement>(null)
  const print = useRef<HTMLDivElement>(null)
  const photo = useRef<HTMLImageElement>(null)
  const eyes = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const hero = section.current!, mount = print.current!, image = photo.current!, canvas = eyes.current!
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    let paint: ReturnType<typeof prepareGaze>
    let targetX = 0, targetY = 0, x = 0, y = 0, frame = 0
    function ready() {
      if (image.naturalWidth) paint = prepareGaze(image, canvas)
    }
    function render() {
      x += (targetX - x) * .26
      y += (targetY - y) * .26
      paint?.(x, y)
      mount.style.transform = `perspective(1000px) rotateY(${x * 2.3}deg) rotateX(${-y * 1.5}deg)`
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > .008 ? requestAnimationFrame(render) : 0
    }
    function reset() {
      cancelAnimationFrame(frame)
      frame = 0
      x = y = targetX = targetY = 0
      mount.style.transform = ''
      canvas.style.opacity = '0'
    }
    function track(event: PointerEvent) {
      if (motion.matches || !paint) return
      const rect = image.getBoundingClientRect()
      const clamp = (v: number) => Math.min(1, Math.max(-1, v))
      targetX = clamp((event.clientX - rect.left - rect.width * .53) / (rect.width * .48))
      targetY = clamp((event.clientY - rect.top - rect.height * .40) / (rect.height * .5))
      canvas.style.opacity = '1'
      if (!frame) frame = requestAnimationFrame(render)
    }
    function release(event: PointerEvent) { if (event.pointerType !== 'mouse') reset() }
    ready()
    image.addEventListener('load', ready)
    hero.addEventListener('pointerdown', track)
    hero.addEventListener('pointermove', track)
    hero.addEventListener('pointerleave', reset)
    hero.addEventListener('pointercancel', reset)
    hero.addEventListener('pointerup', release)
    motion.addEventListener('change', reset)
    window.addEventListener('blur', reset)
    return () => {
      reset()
      image.removeEventListener('load', ready)
      hero.removeEventListener('pointerdown', track)
      hero.removeEventListener('pointermove', track)
      hero.removeEventListener('pointerleave', reset)
      hero.removeEventListener('pointercancel', reset)
      hero.removeEventListener('pointerup', release)
      motion.removeEventListener('change', reset)
      window.removeEventListener('blur', reset)
    }
  }, [])

  return <section className="hero" ref={section} aria-labelledby="hero-title">
    <div className="hero-copy">
      <p className="kicker"><span className="rule" />Paula Neira · Maquilladora</p>
      <h1 id="hero-title">Muestra tu<br /><em>gran belleza.</em></h1>
      <p className="intro">Maquillaje social y editorial. Una selección de pieles luminosas, miradas gráficas y color en primer plano.</p>
      <a className="explore" href="#portafolio">Explorar los looks <span aria-hidden="true">↓</span></a>
    </div>
    <figure className="portrait">
      <div className="portrait-frame" ref={print}>
        <img ref={photo} src={portrait} width="1200" height="800" alt="Sofi Cora maquillada por Paula frente a un fondo de corazones violeta" fetchPriority="high" draggable={false} />
        <canvas ref={eyes} className="gaze" aria-hidden="true" />
      </div>
      <figcaption><span><b>Sofi Cora</b> / Editorial</span><span className="motion-hint"><i aria-hidden="true">✧</i><span className="mouse-hint">Mueve el cursor</span><span className="touch-hint">Toca el retrato</span></span></figcaption>
    </figure>
  </section>
}
