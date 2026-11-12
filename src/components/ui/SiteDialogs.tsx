import { useEffect, useRef, useState, type FormEvent } from 'react'
import { siteConfig } from '../../config/site'
import { Dialog } from './Dialog'
import { WhatsAppIcon } from './WhatsAppIcon'

export type SitePanel = 'quote' | 'privacy' | null

type SiteDialogsProps = { panel: SitePanel; onClose: () => void }

const occasions = ['Novia', 'Quinceañera', 'Graduación', 'Sesión de fotos', 'Evento social', 'Maquillaje para el día a día', 'Otro']
const looks = ['Aún no lo sé', 'Soft', 'Natural', 'Glam', 'Novia', 'Editorial']

function whatsappUrl(text: string) {
  return `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(text)}`
}

export function SiteDialogs({ panel, onClose }: SiteDialogsProps) {
  const [request, setRequest] = useState('')
  const [feedback, setFeedback] = useState('')
  const requestRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => { setRequest(''); setFeedback('') }, [panel])
  const title = panel === 'privacy' ? 'Tu privacidad' : 'Hablemos de tu look'

  const prepareRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const occasion = String(data.get('occasion') ?? '').trim()
    const look = String(data.get('look') ?? '').trim()
    const date = String(data.get('date') ?? '').trim()
    const city = String(data.get('city') ?? '').trim()
    const details = String(data.get('details') ?? '').trim()

    const lines = [
      `Hola Jers Beauty Lab, soy ${name}.`,
      '',
      'Quiero cotizar un maquillaje.',
      `Ocasión: ${occasion}`,
      `Tipo de maquillaje: ${look}`,
    ]
    if (date) lines.push(`Fecha del evento: ${date}`)
    if (city) lines.push(`Ciudad o lugar: ${city}`)
    if (details) lines.push('', 'Detalles e inspiración:', details)

    const text = lines.join('\n')
    setRequest(text)
    setFeedback('Abriendo WhatsApp con tu consulta completa…')
    const opened = window.open(whatsappUrl(text), '_blank', 'noopener,noreferrer')
    if (!opened) setFeedback('Tu navegador bloqueó la ventana. Copia el mensaje o usa «Abrir WhatsApp».')
  }

  const copyRequest = async () => {
    try {
      await navigator.clipboard.writeText(request)
      setFeedback('Consulta copiada. Ya puedes enviarla por WhatsApp.')
    } catch {
      requestRef.current?.focus()
      requestRef.current?.select()
      setFeedback('Seleccionamos tu consulta. Usa la opción Copiar de tu dispositivo.')
    }
  }

  return (
    <Dialog open={panel !== null} title={title} onClose={onClose} className={panel === 'quote' ? 'quote-dialog' : ''}>
      {panel === 'privacy' && <div className="dialog-copy"><p>La consulta se prepara en tu navegador. Este sitio no la envía ni la guarda en un servidor.</p><p>Solo se comparte cuando tú decides enviarla por WhatsApp. WhatsApp aplica sus propias políticas de privacidad.</p><p>La tipografía puede cargarse desde Google Fonts. Las imágenes de la colección y del avatar se sirven como archivos del propio sitio.</p></div>}
      {panel === 'quote' && <div className="dialog-copy">
        <p className="eyebrow">MAQUILLAJE Y BELLEZA</p>
        <p>Cuéntanos qué tienes en mente. Con estos datos preparamos un mensaje completo para WhatsApp.</p>
        <form className="quote-form" onSubmit={prepareRequest}>
          <label htmlFor="quote-name">Tu nombre<input id="quote-name" name="name" autoComplete="name" autoFocus required pattern=".*\S.*" maxLength={80} placeholder="¿Cómo te llamas?" /></label>
          <div className="quote-form__row">
            <label htmlFor="quote-occasion">¿Para qué ocasión?<select id="quote-occasion" name="occasion" required defaultValue=""><option value="" disabled>Elige una ocasión</option>{occasions.map((occasion) => <option key={occasion} value={occasion}>{occasion}</option>)}</select></label>
            <label htmlFor="quote-look">Tipo de maquillaje<select id="quote-look" name="look" required defaultValue=""><option value="" disabled>Elige un estilo</option>{looks.map((look) => <option key={look} value={look}>{look}</option>)}</select></label>
          </div>
          <div className="quote-form__row">
            <label htmlFor="quote-date"><span>Fecha del evento <span className="quote-form__hint">(opcional)</span></span><input id="quote-date" name="date" type="date" min={new Date().toISOString().slice(0, 10)} /></label>
            <label htmlFor="quote-city"><span>Ciudad o lugar <span className="quote-form__hint">(opcional)</span></span><input id="quote-city" name="city" autoComplete="address-level2" maxLength={80} placeholder="¿Dónde será?" /></label>
          </div>
          <label htmlFor="quote-details"><span>Detalles, inspiración o alergias <span className="quote-form__hint">(opcional)</span></span><textarea id="quote-details" name="details" rows={4} maxLength={1200} placeholder="El look que imaginas, referencias, tipo de piel o alergias…" /></label>
          <button type="submit" className="pill-button quote-form__submit"><WhatsAppIcon /> Enviar por WhatsApp</button>
        </form>
        {request && <div className="quote-result"><label htmlFor="quote-request">Tu consulta<textarea id="quote-request" ref={requestRef} value={request} readOnly rows={7} /></label><div className="quote-actions"><button className="pill-button" type="button" onClick={copyRequest}>Copiar mensaje</button>
          <a className="pill-button" href={whatsappUrl(request)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> Abrir WhatsApp ↗</a>
        </div></div>}
        <p className="form-feedback" role="status">{feedback}</p>
      </div>}
    </Dialog>
  )
}
