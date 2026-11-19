import { useRef, useState, type KeyboardEvent, type TouchEvent } from 'react'
import { looks, type Look } from '../../config/catalog'
import { Dialog } from '../ui/Dialog'

export function GalleryPanel({ onQuote }: { onQuote: (look: Look) => void }) {
  const [[series, shot], select] = useState([0, 0])
  const [expanded, expand] = useState(false)
  const start = useRef<{ x: number; y: number } | null>(null)
  const swiped = useRef(false)
  const look = looks[series]
  const photo = look.photos[shot]
  function move(step: number) {
    select(([s, p]) => {
      const next = p + step
      if (next >= 0 && next < looks[s].photos.length) return [s, next]
      const other = (s + step + looks.length) % looks.length
      return [other, step > 0 ? 0 : looks[other].photos.length - 1]
    })
  }
  function keys(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      move(event.key === 'ArrowLeft' ? -1 : 1)
    }
  }
  function touchStart(event: TouchEvent) {
    swiped.current = false
    start.current = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null
  }
  function touchEnd(event: TouchEvent) {
    if (!start.current) return
    const dx = event.changedTouches[0].clientX - start.current.x
    const dy = event.changedTouches[0].clientY - start.current.y
    start.current = null
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      swiped.current = true
      move(dx < 0 ? 1 : -1)
    }
  }
  const gestures = { onTouchStart: touchStart, onTouchEnd: touchEnd, onTouchCancel: () => { start.current = null } }
  const controls = <div className="slide-controls">
    <button type="button" onClick={() => move(-1)} aria-label="Fotografía anterior">‹</button>
    <span aria-live="polite">{shot + 1} / {look.photos.length}</span>
    <button type="button" onClick={() => move(1)} aria-label="Fotografía siguiente">›</button>
  </div>

  return <section id="portafolio" className="portfolio" aria-labelledby="portfolio-title" onKeyDown={keys}>
    <div className="portfolio-heading"><div><p className="kicker"><span className="rule" />Portafolio de maquillaje</p>
      <h2 id="portfolio-title">Los <em>looks.</em></h2></div>
      <div className="look-picker" role="group" aria-label="Elegir estilo">
        {looks.map((item, index) => <button type="button" key={item.name} aria-pressed={index === series} onClick={() => select([index, 0])}>{item.type}</button>)}
      </div>
    </div>
    <div className="look-spread">
      <div className="photographs">
        <button className="main-photo" type="button" {...gestures} onClick={() => {
          if (!swiped.current) expand(true)
          swiped.current = false
        }} aria-label={`Ampliar fotografía. ${photo.alt}`}>
          <img key={photo.src} src={photo.src} alt={photo.alt} loading="lazy" /><span className="zoom" aria-hidden="true">⤢</span>
        </button>
        <div className="proofs" role="group" aria-label="Fotografías del look">
          {look.photos.map((item, index) => <button type="button" key={item.src} aria-label={`Ver foto ${index + 1}. ${item.alt}`} aria-pressed={shot === index} onClick={() => select([series, index])}><img src={item.src} alt="" loading="lazy" /></button>)}
        </div>
      </div>
      <div className="look-notes">
        <div className="look-description" key={look.name}>
        <p className="kicker">{look.type}</p>
        <h3>{look.name}</h3>
        <p className="look-detail">{look.detail}</p>
        <div className="swatches" aria-hidden="true">{look.colors.map(color => <i key={color} style={{ background: color }} />)}</div>
        </div>
        <button type="button" className="book-look" onClick={() => onQuote(look)}>Cotizar este look</button>
        {controls}
      </div>
    </div>
    <Dialog open={expanded} onClose={() => expand(false)} title={look.name} className="lightbox">
      <div className="lightbox-body" {...gestures}><img src={photo.src} alt={photo.alt} /></div>
      <div className="lightbox-caption"><p>{photo.alt}</p>{controls}</div>
    </Dialog>
  </section>
}
