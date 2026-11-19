import portrait from '../../assets/studio/paula.webp'

type StudioPageProps = { onBack: () => void }

export function StudioPage({ onBack }: StudioPageProps) {
  return (
    <div className="studio">
      <header className="studio__header">
        <div className="studio__intro">
          <p className="eyebrow">MAQUILLADORA ENCARGADA</p>
          <h1 className="studio__title">Paula Neira</h1>
          <p className="studio__lede">Estudios, fotografía y trayecto de Paula como maquilladora.</p>
          <button type="button" className="pill-button" onClick={onBack}>Volver a la selección</button>
        </div>
        <figure className="studio__portrait">
          <img src={portrait} alt="Paula Neira, maquilladora de Jers Beauty Lab" width={1200} height={1600} decoding="async" />
        </figure>
      </header>
      <section className="studio__section" id="studio-estudios">
        <h2 className="studio__subtitle">Estudios</h2>
        <p className="studio__copy">Cada estudio se prepara con un briefing de piel, color y dirección de look para acompañar la esencia de cada persona.</p>
      </section>
      <section className="studio__section">
        <h2 className="studio__subtitle">Fotografía</h2>
        <p className="studio__copy">Fotografías de estudio para retratos de maquillaje con iluminación fija y lectura de color constante.</p>
      </section>
      <section className="studio__section">
        <h2 className="studio__subtitle">Trayecto</h2>
        <p className="studio__copy">El trayecto de Paula como maquilladora, desde su base hasta los looks que hoy prepara para cada cliente.</p>
      </section>
    </div>
  )
}
