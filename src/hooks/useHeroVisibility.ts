import { useEffect, type RefObject } from 'react'

export function useHeroVisibility(
  stageRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const update = () => {
      const offscreen = window.scrollY >= window.innerHeight
      stage.style.visibility = offscreen ? 'hidden' : 'visible'
      stage.classList.toggle('hero-scene--offscreen', offscreen)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [stageRef])
}
