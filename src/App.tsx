import { useRef, useState } from 'react'
import { HeroPortrait } from './components/hero/HeroPortrait'
import { GalleryPanel } from './components/gallery/GalleryPanel'
import { StudioPage } from './components/studio/StudioPage'
import { SiteDialogs, type SitePanel } from './components/ui/SiteDialogs'
import type { Look } from './config/catalog'

export default function App() {
  const [studio, setStudio] = useState(false)
  const [panel, setPanel] = useState<SitePanel>(null)
  const [reference, setReference] = useState('')
  const previousScroll = useRef(0)
  const about = useRef<HTMLButtonElement>(null)
  function quote(look?: Look) {
    setReference(look ? look.name : '')
    setPanel('quote')
  }
  if (studio) return <StudioPage onBack={() => {
    setStudio(false)
    requestAnimationFrame(() => {
      window.scrollTo({ top: previousScroll.current, behavior: 'instant' })
      about.current?.focus({ preventScroll: true })
    })
  }} />
  return <>
    <a className="skip" href="#portafolio">Ir al portafolio</a>
    <header className="masthead">
      <a className="wordmark" href="#inicio" aria-label="Jers Beauty Lab, inicio">JERS <small>BEAUTY LAB</small></a>
      <nav aria-label="Navegación principal">
        <a className="nav-looks" href="#portafolio">Portafolio</a>
        <button ref={about} onClick={() => {
          previousScroll.current = window.scrollY
          setStudio(true)
          window.scrollTo({ top: 0, behavior: 'instant' })
        }}>Sobre Paula</button>
        <button className="quote" onClick={() => quote()}>Cotizar <span aria-hidden="true">✧</span></button>
      </nav>
    </header>
    <main id="inicio">
      <HeroPortrait />
      <GalleryPanel onQuote={quote} />
    </main>
    <footer><span>Jers Beauty Lab © {new Date().getFullYear()}</span><button onClick={() => setPanel('privacy')}>Privacidad</button></footer>
    <SiteDialogs panel={panel} reference={reference} onClose={() => setPanel(null)} />
  </>
}
