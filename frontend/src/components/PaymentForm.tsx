import { useState } from 'react'
import { PlusCircle, Loader2, X, CalendarIcon, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getTodayLocal } from '@/lib/utils'

interface PaymentFormProps {
  onSubmit: (amount: number, date: string, descricao: string) => Promise<boolean>
  saving: boolean
  nextParcelaNumber: number
}

const QUICK_VALUES = [200, 400, 600, 800]

export function PaymentForm({ onSubmit, saving, nextParcelaNumber }: PaymentFormProps) {
  const [showForm, setShowForm] = useState(false)
  const [amount, setAmount] = useState('400')
  const [date, setDate] = useState(getTodayLocal())
  const [descricao, setDescricao] = useState('')
  const [amountError, setAmountError] = useState('')
  const [submitError, setSubmitError] = useState('')

  const defaultDescricao = `Parcela ${nextParcelaNumber}`

  const handleOpen = () => {
    setDate(getTodayLocal())
    setAmount('400')
    setDescricao('')
    setAmountError('')
    setSubmitError('')
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setAmountError('')
    setSubmitError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = parseFloat(amount.replace(',', '.'))
    if (!value || value <= 0) {
      setAmountError('Informe um valor válido maior que zero')
      return
    }
    if (!date) return

    setAmountError('')
    setSubmitError('')

    const success = await onSubmit(value, date, descricao || defaultDescricao)

    if (success) {
      handleClose()
    } else {
      setSubmitError('Não foi possível salvar. Verifique sua conexão e tente novamente.')
    }
  }

  const maxDate = getTodayLocal()

  if (!showForm) {
    return (
      <button
        onClick={handleOpen}
        disabled={saving}
        className="w-full py-4 rounded-xl font-semibold text-sm text-white
          bg-gradient-to-r from-primary to-primary-glow
          hover:opacity-90 active:scale-[0.98]
          transition-all duration-200 shadow-glow
          flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <PlusCircle className="w-5 h-5" />
        Registrar Pagamento
      </button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card rounded-xl p-5 border border-border shadow-card space-y-4 animate-slide-up"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Novo Pagamento — <span className="text-primary">{defaultDescricao}</span>
        </h3>
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
        <label htmlFor="descricao" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
          Descrição <span className="text-muted-foreground/50">(padrão: {defaultDescricao})</span>
        </label>
        <Input
          type="text"
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder={defaultDescricao}
          maxLength={50}
        />
      </div>

      {/* Valor */}
      <div>
        <label htmlFor="amount" className="block text-xs font-medium text-muted-foreground mb-1.5">
          Valor (R$)
        </label>
        <div className="flex gap-2 mb-2">
          {QUICK_VALUES.map(v => (
            <button
              key={v}
              type="button"
              onClick={() => { setAmount(String(v)); setAmountError('') }}
              className={`flex-1 py-1.5 text-xs rounded-lg border transition-all
                ${amount === String(v)
                  ? 'border-primary/60 bg-primary/10 text-primary font-semibold'
                  : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                }`}
            >
              {v}
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
          className={amountError ? 'border-danger/60' : ''}
        />
        {amountError && <p className="text-xs text-danger mt-1">{amountError}</p>}
      </div>

      {/* Data */}
      <div>
        <label htmlFor="date" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
          <CalendarIcon className="w-3 h-3" />
          Data do Pagamento
          <span className="text-muted-foreground/50">(pode alterar)</span>
        </label>
        <Input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={maxDate}
        />
      </div>

      {/* Erro de submissão inline */}
      {submitError && (
        <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-danger/8 border border-danger/20">
          <AlertCircle className="w-3.5 h-3.5 text-danger flex-shrink-0 mt-0.5" />
          <p className="text-xs text-danger">{submitError}</p>
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <Button type="button" onClick={handleClose} variant="secondary" className="flex-1" disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" variant="success" className="flex-1" disabled={saving}>
          {saving ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Salvando...</>
          ) : 'Confirmar'}
        </Button>
      </div>
    </form>
  )
}
