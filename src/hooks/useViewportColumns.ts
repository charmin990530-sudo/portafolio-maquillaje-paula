import { useEffect, useState } from 'react'
import { getColumnsForWidth } from '../lib/galleryLayout'

export function useViewportColumns() {
  const [columns, setColumns] = useState(() =>
    getColumnsForWidth(window.innerWidth),
  )

  useEffect(() => {
    const onResize = () => setColumns(getColumnsForWidth(window.innerWidth))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return columns
}
