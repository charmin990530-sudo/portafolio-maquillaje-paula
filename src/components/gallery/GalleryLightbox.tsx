import type { Product } from '../../config/catalog'
import { Dialog } from '../ui/Dialog'

type GalleryLightboxProps = { product: Product | null; onClose: () => void }

export function GalleryLightbox({ product, onClose }: GalleryLightboxProps) {
  return (
    <Dialog open={product !== null} title={product?.name ?? 'Imagen'} onClose={onClose} className="lightbox-dialog">
      {product && <img className="lightbox-dialog__image" src={product.image} alt={`Trabajo de maquillaje: ${product.name}`} />}
    </Dialog>
  )
}
