import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Payment } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface PaymentHistoryProps {
  payments: Payment[]
  onDelete: (id: string) => Promise<void>
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00')
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const getPaymentBadge = (descricao: string) => {
  const d = descricao.toLowerCase()
  if (d.includes('caução') || d.includes('caucao') || d.includes('inicial')) {
    return { label: 'Caução', className: 'bg-accent/15 text-accent border-accent/30' }
  }
  if (d.includes('extra') || d.includes('adicional') || d.includes('bônus') || d.includes('bonus')) {
    return { label: 'Extra', className: 'bg-primary/15 text-primary border-primary/30' }
  }
  return { label: 'Parcela', className: 'bg-success/10 text-success border-success/30' }
}

export function PaymentHistory({ payments, onDelete }: PaymentHistoryProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirmId !== id) {
      setConfirmId(id)
      // Auto-cancela confirmação após 3s
      setTimeout(() => setConfirmId(prev => (prev === id ? null : prev)), 3000)
      return
    }
    try {
      setDeletingId(id)
      setConfirmId(null)
      await onDelete(id)
    } finally {
      setDeletingId(null)
    }
  }

  const sortedPayments = [...payments].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  )

  if (payments.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Histórico de Pagamentos</h3>
        </div>
        <div className="px-5 py-10 text-center">
          <p className="text-sm text-muted-foreground">Nenhum pagamento registrado ainda.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Histórico de Pagamentos</h3>
        <span className="text-xs text-muted-foreground bg-surface px-2 py-0.5 rounded-full">
          {payments.length} registro{payments.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="divide-y divide-border max-h-80 overflow-y-auto">
        {sortedPayments.map((payment) => {
          const badge = getPaymentBadge(payment.descricao)
          const isDeleting = deletingId === payment.id
          const isConfirming = confirmId === payment.id

          return (
            <div
              key={payment.id}
              className={`px-5 py-4 flex items-center justify-between gap-3 transition-all duration-300
                ${isDeleting ? 'opacity-40 scale-95' : 'hover:bg-surface'}`}
            >
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {payment.descricao}
                  </p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border flex-shrink-0 ${badge.className}`}>
                    {badge.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{formatDate(payment.data)}</p>
              </div>

              {/* Valor + Delete */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <p className="text-sm font-semibold text-success">
                  {formatCurrency(payment.valor)}
                </p>

                {/* Botão excluir — não exibe para IDs de seed offline */}
                {!payment.id.startsWith('SEED_') && (
                  <button
                    onClick={() => handleDelete(payment.id)}
                    disabled={isDeleting}
                    title={isConfirming ? 'Clique novamente para confirmar exclusão' : 'Excluir pagamento'}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200
                      ${isConfirming
                        ? 'bg-danger text-white scale-110 shadow-lg'
                        : 'bg-danger/10 text-danger/50 hover:bg-danger/20 hover:text-danger'
                      }`}
                  >
                    {isDeleting
                      ? <span className="w-3 h-3 border border-danger border-t-transparent rounded-full animate-spin" />
                      : <Trash2 className="w-3.5 h-3.5" />
                    }
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
