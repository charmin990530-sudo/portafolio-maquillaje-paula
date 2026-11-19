import { useState, type FormEvent } from 'react'
import { looks } from '../../config/catalog'
import { studioEmail, studioWhatsApp } from '../../config/site'
import { Dialog } from './Dialog'
import { WhatsAppIcon } from './WhatsAppIcon'

export type SitePanel = 'quote' | 'privacy' | null
const occasions = ['Evento social', 'Novia', 'Quinceañera', 'Graduación', 'Sesión de fotos', 'Otra ocasión']

function QuoteForm({ reference }: { reference: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'accepted' | 'activation' | 'error'>('idle')
  const [message, setMessage] = useState('')
  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'sending') return
    const data = new FormData(event.currentTarget)
    const read = (key: string) => String(data.get(key) ?? '').trim()
    if (read('_honey')) return
    const lines = [
      `Hola, Paula. Soy ${read('name')} y quiero cotizar un maquillaje.`,
      `Mi correo: ${read('email')}`, `Ocasión: ${read('occasion')}`, `Look: ${read('look')}`,
      read('date') && `Fecha: ${read('date')}`, read('city') && `Lugar: ${read('city')}`,
      read('details') && `Detalles: ${read('details')}`,
    ].filter(Boolean)
    const text = lines.join('\n')
    setMessage(text)
    setStatus('sending')
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${studioEmail}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: read('name'), email: read('email'), Consulta: text,
          _subject: 'Nueva cotización de maquillaje · Jers Beauty Lab', _template: 'table', _honey: '' }),
        signal: AbortSignal.timeout(18000),
      })
      const result = await response.json()
      if (/activat|confirm your email/i.test(result.message ?? '')) setStatus('activation')
      else if (response.ok && String(result.success) === 'true') setStatus('accepted')
      else setStatus('error')
    } catch { setStatus('error') }
  }

  return <div className="dialog-copy">
    {(status === 'idle' || status === 'sending' || status === 'error') && <>
      <p>Cuéntame para qué ocasión te maquillas. Recibiré tu consulta por correo y podrás enviármela también por WhatsApp.</p>
      <form className="quote-form" onSubmit={send} onChange={() => { if (status === 'error') { setStatus('idle'); setMessage('') } }}>
        <fieldset disabled={status === 'sending'}>
        <label>Tu nombre<input name="name" required autoComplete="name" maxLength={80} pattern={'.*\\S.*'} /></label>
        <label>Tu correo<input name="email" type="email" required autoComplete="email" maxLength={254} /></label>
        <div className="quote-form__row">
          <label>Ocasión<select name="occasion" required defaultValue=""><option value="" disabled>Elige una ocasión</option>{occasions.map(o => <option key={o}>{o}</option>)}</select></label>
          <label>Look de referencia<select name="look" defaultValue={reference || 'Por definir'}><option>Por definir</option>{looks.map(l => <option key={l.name}>{l.name}</option>)}</select></label>
        </div>
        <div className="quote-form__row">
          <label>Fecha (opcional)<input type="date" name="date" /></label>
          <label>Ciudad (opcional)<input name="city" autoComplete="address-level2" maxLength={80} /></label>
        </div>
        <label>¿Qué tienes en mente? (opcional)<textarea name="details" rows={3} maxLength={1000} /></label>
        <input type="text" name="_honey" hidden tabIndex={-1} aria-hidden="true" autoComplete="off" />
        <button type="submit" className="pill-button" disabled={status === 'sending'}>{status === 'sending' ? 'Enviando…' : status === 'error' ? 'Reintentar por correo' : 'Enviar consulta'}</button>
        </fieldset>
      </form>
    </>}
    <p className="form-feedback" role="status">
      {status === 'accepted' && 'Tu consulta fue aceptada para envío por correo. Envíale también una copia a Paula por WhatsApp.'}
      {status === 'activation' && 'El correo del estudio está pendiente de activación. Envía la consulta por WhatsApp o desde tu correo.'}
      {status === 'error' && 'No pudimos confirmar el envío por correo. Puedes reintentarlo o enviar tu consulta desde uno de estos enlaces.'}
    </p>
    {message && status !== 'sending' && <div className="quote-actions">
      <a className="pill-button" href={`https://wa.me/${studioWhatsApp}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />Enviar copia por WhatsApp</a>
      {(status === 'error' || status === 'activation') && <a className="pill-button" href={`mailto:${studioEmail}?subject=Cotización%20de%20maquillaje&body=${encodeURIComponent(message)}`}>Abrir mi correo</a>}
    </div>}
  </div>
}

export function SiteDialogs({ panel, reference, onClose }: { panel: SitePanel; reference: string; onClose: () => void }) {
  return <Dialog open={panel !== null} title={panel === 'privacy' ? 'Tu privacidad' : 'Cotiza tu maquillaje'} onClose={onClose}>
    {panel === 'quote' && <QuoteForm reference={reference} />}
    {panel === 'privacy' && <div className="dialog-copy"><p>Paula usa los datos de tu consulta para responderte y preparar una cotización. Al enviar el formulario, FormSubmit procesa los datos para entregarlos al correo del estudio y conserva una copia hasta 30 días.</p><p>Si eliges WhatsApp, podrás revisar y enviar el mensaje desde tu cuenta. Para consultas sobre tus datos, escribe a <a href={`mailto:${studioEmail}`}>{studioEmail}</a>.</p></div>}
  </Dialog>
}
