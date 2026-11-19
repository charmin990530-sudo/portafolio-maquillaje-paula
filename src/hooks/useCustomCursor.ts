import { useEffect, type RefObject } from 'react'

export function useCustomCursor(cursorRef: RefObject<HTMLDivElement | null>, enabled: boolean) {
  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor || !enabled) return
    let frame = 0
    let x = -100
    let y = -100
    const update = () => {
      frame = 0
      cursor.style.transform = `translate3d(${x - 24}px, ${y - 24}px, 0)`
    }
    const onMouseMove = (event: MouseEvent) => {
      x = event.clientX
      y = event.clientY
      if (!frame) frame = requestAnimationFrame(update)
    }
    const hide = () => { x = -100; y = -100; update() }
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseleave', hide)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', hide)
    }
  }, [cursorRef, enabled])
}
