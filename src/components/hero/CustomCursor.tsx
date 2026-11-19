import { useRef } from 'react'
import { useCustomCursor } from '../../hooks/useCustomCursor'
import { useMediaQuery } from '../../hooks/useMediaQuery'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const isDesktopPointer = useMediaQuery(
    '(min-width: 1024px) and (pointer: fine)',
  )

  useCustomCursor(cursorRef, isDesktopPointer)

  return (
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
      <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="24"
          cy="24"
          r="22.75"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.5"
        />
        <path
          d="M30.4 15.6c-5.6-2.3-11.4.8-13 6.4-1.5 5.2 1.8 10.2 6.9 10.5 3.7.2 6.6-2.7 6.1-6-.4-2.8-3.4-4.5-5.9-3.4-2.3 1-3.1 3.7-1.9 5.8 1.4 2.5 4.9 2.9 7.5 1.1"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
