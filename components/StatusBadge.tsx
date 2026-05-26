import type { StatusPedido } from '@/lib/types'

const STATUS_CONFIG: Record<StatusPedido, { label: string; className: string }> = {
  pendente:   { label: 'Pendente',   className: 'badge-pendente' },
  confirmado: { label: 'Confirmado', className: 'badge-confirmado' },
  pronto:     { label: 'Pronto',     className: 'badge-pronto' },
  entregue:   { label: 'Entregue',   className: 'badge-entregue' },
  cancelado:  { label: 'Cancelado',  className: 'badge-cancelado' },
}

interface StatusBadgeProps {
  status: StatusPedido
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <span className={`badge ${config.className}`}>
      {config.label}
    </span>
  )
}
