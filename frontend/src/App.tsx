import { useState, useEffect, useMemo, useCallback } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Header } from '@/components/Header'
import { FinancialSummary } from '@/components/FinancialSummary'
import { CountdownCard } from '@/components/CountdownCard'
import { OpportunityCostCard } from '@/components/OpportunityCostCard'
import { PaymentForm } from '@/components/PaymentForm'
import { PaymentHistory } from '@/components/PaymentHistory'
import { Footer } from '@/components/Footer'
import { StatusIndicator } from '@/components/StatusIndicator'
import { Payment, FinancialSummary as SummaryType } from '@/types'

// ============================================================================
// API URL — configurada via .env (VITE_API_URL)
// ============================================================================
const API_URL = import.meta.env.VITE_API_URL as string

// ============================================================================
// Constantes do negócio
// ============================================================================
const MOTO_VALUE = 20000
const WEEKLY_PAYMENT = 400

/** Pagamentos que existiam ANTES do app. Serão enviados para a planilha
 *  automaticamente na primeira sincronização (seed). */
const SEED_PAYMENTS: Omit<Payment, 'id'>[] = [
  { descricao: 'Caução Inicial', valor: 1000, data: '2026-05-14' },
  { descricao: 'Parcela 1', valor: 400, data: '2026-05-21' },
  { descricao: 'Parcela 2', valor: 400, data: '2026-05-28' },
]

// ============================================================================
// Utilitários
// ============================================================================
/** Retorna a quinta-feira mais recente (hoje se for quinta, ou a última passada). */
const getMostRecentThursday = (): string => {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0=Dom, 4=Qui
  // Dias desde a última quinta: se hoje é quinta (4), retorna hoje (0 dias atrás)
  const daysSinceThursday = (dayOfWeek - 4 + 7) % 7
  const lastThursday = new Date(today)
  lastThursday.setDate(today.getDate() - daysSinceThursday)
  return lastThursday.toISOString().split('T')[0]
}

const getMotivationalMessage = (percentage: number): string => {
  if (percentage >= 100) return '🎉 Parabéns! A moto é 100% sua! Liberdade financeira conquistada!'
  if (percentage >= 75) return '🚀 Reta final! Você já conquistou mais de 3/4 da sua moto!'
  if (percentage >= 50) return '💪 Metade do caminho percorrido! Continue firme!'
  if (percentage >= 25) return '✨ Ótimo progresso! Cada pagamento te aproxima do objetivo!'
  if (percentage >= 10) return '🌱 Começando forte! O hábito de pagar está se formando!'
  return '🎯 Todo grande começo conta! Sua jornada começou!'
}

const isApiConfigured = (): boolean =>
  Boolean(API_URL && API_URL !== 'SUA_URL_DO_APPS_SCRIPT_AQUI' && API_URL.startsWith('http'))

// ============================================================================
// App Principal
// ============================================================================
export default function App() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [connected, setConnected] = useState<boolean>(false)

  // ─── Carregar pagamentos da planilha ─────────────────────────────────────
  const fetchPayments = useCallback(async () => {
    if (!isApiConfigured()) {
      // Modo offline — usa dados seed localmente
      setPayments(SEED_PAYMENTS.map((p, i) => ({ ...p, id: `SEED_${i + 1}` })))
      setConnected(false)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_URL, { cache: 'no-store' })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const result = await response.json()
      if (!result.success) throw new Error(result.message || 'Erro desconhecido')

      const sheetPayments: Payment[] = result.data || []
      setConnected(true)

      // Se a planilha está vazia → seed automático dos pagamentos iniciais
      if (sheetPayments.length === 0) {
        await seedInitialPayments()
        return // fetchPayments será chamado novamente dentro do seed
      }

      setPayments(sheetPayments)
    } catch (err) {
      setError('Erro ao conectar com o Google Sheets. Verifique a URL e tente novamente.')
      setConnected(false)
      // Fallback para dados seed em caso de erro
      setPayments(SEED_PAYMENTS.map((p, i) => ({ ...p, id: `SEED_${i + 1}` })))
      console.error('[Quitax] Erro na API:', err)
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line

  // ─── Seed automático na primeira vez ─────────────────────────────────────
  const seedInitialPayments = async () => {
    try {
      for (const payment of SEED_PAYMENTS) {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(payment),
        })
        // Pequeno delay para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 300))
      }
      // Recarrega após seed
      await fetchPayments()
    } catch (err) {
      console.error('[Quitax] Erro no seed inicial:', err)
      setPayments(SEED_PAYMENTS.map((p, i) => ({ ...p, id: `SEED_${i + 1}` })))
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  // ─── Registrar novo pagamento ─────────────────────────────────────────────
  const handleSubmitPayment = async (amount: number, date: string, descricao: string) => {
    if (!isApiConfigured()) {
      const newPayment: Payment = {
        id: `LOCAL_${Date.now()}`,
        descricao: descricao || 'Parcela semanal',
        valor: amount,
        data: date,
      }
      setPayments(prev => [...prev, newPayment])
      return
    }

    try {
      setSaving(true)
      setError(null)

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          descricao: descricao || 'Parcela semanal',
          valor: amount,
          data: date,
        }),
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const result = await response.json()
      if (!result.success) throw new Error(result.message)

      setPayments(prev => [...prev, result.data as Payment])
    } catch (err) {
      setError('Erro ao salvar pagamento. Tente novamente.')
      console.error('[Quitax] Erro ao salvar:', err)
    } finally {
      setSaving(false)
    }
  }

  // ─── Excluir pagamento ────────────────────────────────────────────────────
  const handleDeletePayment = async (id: string) => {
    if (!isApiConfigured()) {
      setPayments(prev => prev.filter(p => p.id !== id))
      return
    }

    try {
      setError(null)
      const url = `${API_URL}?action=delete&id=${encodeURIComponent(id)}`
      const response = await fetch(url, { cache: 'no-store' })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const result = await response.json()
      if (!result.success) throw new Error(result.message)

      setPayments(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      setError('Erro ao excluir pagamento. Tente novamente.')
      console.error('[Quitax] Erro ao excluir:', err)
    }
  }

  // ─── Cálculos financeiros ─────────────────────────────────────────────────
  const summary: SummaryType = useMemo(() => {
    const totalPaid = payments.reduce((sum, p) => sum + p.valor, 0)
    const remainingBalance = Math.max(0, MOTO_VALUE - totalPaid)
    const progressPercentage = Math.min(100, (totalPaid / MOTO_VALUE) * 100)
    const weeksRemaining = Math.ceil(remainingBalance / WEEKLY_PAYMENT)
    return { totalPaid, remainingBalance, progressPercentage, weeksRemaining }
  }, [payments])

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-24">
      <Header
        progressPercentage={summary.progressPercentage}
        motivationalMessage={getMotivationalMessage(summary.progressPercentage)}
        connected={connected}
        apiConfigured={isApiConfigured()}
      />

      <main className="max-w-md mx-auto px-4 mt-5 space-y-4">
        {/* Status de conexão */}
        <StatusIndicator connected={connected} apiConfigured={isApiConfigured()} />

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16 animate-fade-in">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-3 text-muted-foreground text-sm">
              {payments.length === 0 ? 'Sincronizando com Google Sheets...' : 'Carregando...'}
            </span>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="bg-danger-muted border border-danger/30 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-danger font-medium">{error}</p>
              <button
                onClick={fetchPayments}
                className="text-xs text-danger/70 underline mt-1 hover:text-danger transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {/* Conteúdo principal */}
        {!loading && (
          <div className="space-y-4 animate-fade-in">
            <FinancialSummary
              totalPaid={summary.totalPaid}
              remainingBalance={summary.remainingBalance}
            />
            <CountdownCard
              weeksRemaining={summary.weeksRemaining}
              weeklyPayment={WEEKLY_PAYMENT}
            />
            <OpportunityCostCard />
            <PaymentForm
              onSubmit={handleSubmitPayment}
              saving={saving}
              defaultDate={getMostRecentThursday()}
            />
            <PaymentHistory
              payments={payments}
              onDelete={handleDeletePayment}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
