import { useState } from 'react'
import { PlusCircle, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface PaymentFormProps {
  onSubmit: (amount: number, date: string, descricao: string) => Promise<void>
  saving: boolean
  defaultDate: string
}

const QUICK_VALUES = [200, 400, 600, 800]

export function PaymentForm({ onSubmit, saving, defaultDate }: PaymentFormProps) {
  const [showForm, setShowForm] = useState(false)
  const [amount, setAmount] = useState('400')
  const [date, setDate] = useState(defaultDate)
  const [descricao, setDescricao] = useState('')
  const [amountError, setAmountError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = parseFloat(amount.replace(',', '.'))

    if (!value || value <= 0) {
      setAmountError('Informe um valor válido maior que zero')
      return
    }
    if (!date) return

    setAmountError('')
    await onSubmit(value, date, descricao || `Parcela de R$ ${value.toFixed(2).replace('.', ',')}`)
    setAmount('400')
    setDate(defaultDate)
    setDescricao('')
    setShowForm(false)
  }

  const handleClose = () => {
    setShowForm(false)
    setAmountError('')
    setAmount('400')
    setDate(defaultDate)
    setDescricao('')
  }

  if (!showForm) {
    return (
      <button
        id="btn-registrar-pagamento"
        onClick={() => setShowForm(true)}
        disabled={saving}
        className="w-full py-4 rounded-xl font-semibold text-sm text-white
          bg-gradient-to-r from-emerald-500 to-emerald-400
          hover:from-emerald-400 hover:to-emerald-300
          active:scale-[0.98] transition-all duration-200
          shadow-[0_0_24px_rgba(16,185,129,0.35)] hover:shadow-[0_0_32px_rgba(16,185,129,0.5)]
          flex items-center justify-center gap-2 disabled:opacity-60"
      >
        <PlusCircle className="w-5 h-5" />
        Registrar Pagamento desta Quinta
      </button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card rounded-xl p-5 border border-border shadow-card space-y-4 animate-slide-up"
    >
      {/* Header do form */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Novo Pagamento</h3>
        <button
          type="button"
          onClick={handleClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Descrição */}
      <div>
        <label htmlFor="descricao" className="block text-xs font-medium text-muted-foreground mb-1.5">
          Descrição <span className="text-muted-foreground/50">(opcional)</span>
        </label>
        <Input
          type="text"
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex: Parcela 3, Extra de junho..."
          maxLength={50}
        />
      </div>

      {/* Valor */}
      <div>
        <label htmlFor="amount" className="block text-xs font-medium text-muted-foreground mb-1.5">
          Valor (R$)
        </label>

        {/* Atalhos rápidos */}
        <div className="flex gap-2 mb-2">
          {QUICK_VALUES.map(v => (
            <button
              key={v}
              type="button"
              onClick={() => { setAmount(String(v)); setAmountError('') }}
              className={`flex-1 py-1.5 text-xs rounded-lg border transition-all duration-150
                ${amount === String(v)
                  ? 'border-primary/60 bg-primary/10 text-primary font-semibold'
                  : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                }`}
            >
              R$ {v}
            </button>
          ))}
        </div>

        <Input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => { setAmount(e.target.value); setAmountError('') }}
          step="0.01"
          min="0.01"
          placeholder="400.00"
          className={amountError ? 'border-danger/60 focus:ring-danger/30' : ''}
        />
        {amountError && (
          <p className="text-xs text-danger mt-1">{amountError}</p>
        )}
      </div>

      {/* Data */}
      <div>
        <label htmlFor="date" className="block text-xs font-medium text-muted-foreground mb-1.5">
          Data do Pagamento
        </label>
        <Input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Ações */}
      <div className="flex gap-3 pt-1">
        <Button
          type="button"
          onClick={handleClose}
          variant="secondary"
          className="flex-1"
          disabled={saving}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="success"
          className="flex-1"
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            'Confirmar'
          )}
        </Button>
      </div>
    </form>
  )
}
