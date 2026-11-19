import { useRef } from 'react'
import { domIds } from '../../config/domIds'
import { siteConfig } from '../../config/site'
import { useHeroVisibility } from '../../hooks/useHeroVisibility'
import { AvatarViewer } from './AvatarViewer'

type HeroPortraitProps = { onExplore: () => void }

export function HeroPortrait({ onExplore }: HeroPortraitProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  useHeroVisibility(stageRef)
  return (
    <div id={domIds.heroStage} ref={stageRef} className="hero-scene">
      <div className="hero-scene__ambient" aria-hidden="true" />
      <p className="hero-scene__index" aria-hidden="true">BEAUTY IN EVERY DETAIL / 001</p>
      <AvatarViewer />
      <div className="hero-copy">
        <p className="eyebrow">JERS BEAUTY LAB — MAQUILLAJE</p>
        <h1>Muestra tu<br /><em>gran belleza.</em></h1>
        <p className="hero-copy__description">{siteConfig.caption}</p>
        <button type="button" className="hero-explore" onClick={onExplore}>Descubre la selección <span aria-hidden="true">↓</span></button>
      </div>
      <p className="hero-scene__hint">Tu gran belleza, hecha para ti.</p>
    </div>
  )
}
