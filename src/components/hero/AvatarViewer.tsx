import { useEffect, useRef, useState } from 'react'
import atlasUrl from '../../assets/hero/model-turntable.webp'
import frontUrl from '../../assets/hero/model-front.webp'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { createAvatarRenderer } from '../../lib/avatarRenderer'
import { pointerToYaw, yawToFrame } from '../../lib/avatarMath'

export function AvatarViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const targetRef = useRef(0)
  const wakeRef = useRef<() => void>(() => {})
  const [ready, setReady] = useState(false)
  const [recovery, setRecovery] = useState(0)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let disposed = false
    let frame = 0
    let previousTime = 0
    let current = 0
    let renderer: ReturnType<typeof createAvatarRenderer> = null
    let observer: ResizeObserver | null = null
    const visible = () => !document.hidden && window.scrollY < window.innerHeight && !document.querySelector('dialog[open]')
    const draw = () => {
      renderer?.draw(yawToFrame(current))
    }
    const tick = (time: number) => {
      frame = 0
      if (disposed || !visible()) return
      const delta = previousTime ? Math.min(time - previousTime, 48) : 16.7
      previousTime = time
      const target = targetRef.current
      current += (target - current) * (1 - Math.exp(-delta / 85))
      const settled = Math.abs(target - current) < 0.001
      if (settled) current = target
      draw()
      if (!settled) frame = requestAnimationFrame(tick)
    }
    const wake = () => {
      if (!renderer || !visible()) return
      if (reducedMotion) { current = targetRef.current; draw(); return }
      if (!frame) { previousTime = 0; frame = requestAnimationFrame(tick) }
    }
    wakeRef.current = wake
    const pointer = (event: PointerEvent) => {
      if (reducedMotion || event.pointerType === 'touch' || !visible()) return
      if (event.target instanceof Element && event.target.closest('button, a, input, textarea, dialog')) return
      targetRef.current = pointerToYaw(event.clientX, window.innerWidth)
      wake()
    }
    const reset = () => { targetRef.current = 0; wake() }
    const visibility = () => {
      if (!visible()) { cancelAnimationFrame(frame); frame = 0 }
      else wake()
    }
    const lost = (event: Event) => { event.preventDefault(); cancelAnimationFrame(frame); frame = 0; setReady(false) }
    const restored = () => setRecovery((value) => value + 1)
    const image = new Image()
    image.onload = () => {
      if (disposed) return
      renderer = createAvatarRenderer(canvas, image)
      if (!renderer) return
      observer = new ResizeObserver(() => renderer?.resize())
      observer.observe(canvas)
      setReady(true)
      wake()
    }
    image.onerror = () => { if (!disposed) setReady(false) }
    image.src = atlasUrl
    window.addEventListener('pointermove', pointer, { passive: true })
    window.addEventListener('scroll', visibility, { passive: true })
    window.addEventListener('blur', reset)
    document.addEventListener('mouseleave', reset)
    document.addEventListener('visibilitychange', visibility)
    canvas.addEventListener('webglcontextlost', lost)
    canvas.addEventListener('webglcontextrestored', restored)
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer?.disconnect()
      renderer?.destroy()
      image.onload = null
      image.onerror = null
      wakeRef.current = () => {}
      window.removeEventListener('pointermove', pointer)
      window.removeEventListener('scroll', visibility)
      window.removeEventListener('blur', reset)
      document.removeEventListener('mouseleave', reset)
      document.removeEventListener('visibilitychange', visibility)
      canvas.removeEventListener('webglcontextlost', lost)
      canvas.removeEventListener('webglcontextrestored', restored)
    }
  }, [reducedMotion, recovery])

  return (
    <div className="avatar-viewer" data-ready={ready} aria-hidden="true">
      <img className="avatar-viewer__fallback" src={frontUrl} alt="" fetchPriority="high" draggable={false} />
      <canvas ref={canvasRef} className="avatar-viewer__canvas" />
    </div>
  )
}
