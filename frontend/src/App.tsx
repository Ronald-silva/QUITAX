import { useMemo } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Header } from '@/components/Header'
import { FinancialSummary } from '@/components/FinancialSummary'
import { CountdownCard } from '@/components/CountdownCard'
import { OpportunityCostCard } from '@/components/OpportunityCostCard'
import { PaymentForm } from '@/components/PaymentForm'
import { PaymentHistory } from '@/components/PaymentHistory'
import { Footer } from '@/components/Footer'
import { StatusIndicator } from '@/components/StatusIndicator'
import { usePayments, isApiConfigured } from '@/hooks/usePayments'

const MOTO_VALUE = 20000
const WEEKLY_PAYMENT = 400

const getMotivationalMessage = (percentage: number): string => {
  if (percentage >= 100) return 'Parabéns! A moto é 100% sua! Liberdade financeira conquistada!'
  if (percentage >= 75)  return 'Reta final! Você já conquistou mais de 3/4 da sua moto!'
  if (percentage >= 50)  return 'Metade do caminho percorrido! Continue firme!'
  if (percentage >= 25)  return 'Ótimo progresso! Cada pagamento te aproxima do objetivo!'
  if (percentage >= 10)  return 'Começando forte! O hábito de pagar está se formando!'
  return 'Todo grande começo conta! Sua jornada começou!'
}

export default function App() {
  const { payments, loading, saving, error, connected, addPayment, deletePayment, refetch } = usePayments()

  const summary = useMemo(() => {
    const totalPaid = payments.reduce((sum, p) => sum + p.valor, 0)
    const remainingBalance = Math.max(0, MOTO_VALUE - totalPaid)
    const progressPercentage = Math.min(100, (totalPaid / MOTO_VALUE) * 100)
    const weeksRemaining = Math.ceil(remainingBalance / WEEKLY_PAYMENT)
    // Conta apenas parcelas (exclui caução/entrada)
    const parcelaCount = payments.filter(p => {
      const d = p.descricao.toLowerCase()
      return !d.includes('caução') && !d.includes('caucao') && !d.includes('inicial') && !d.includes('entrada')
    }).length
    return { totalPaid, remainingBalance, progressPercentage, weeksRemaining, nextParcelaNumber: parcelaCount + 1 }
  }, [payments])

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header
        progressPercentage={summary.progressPercentage}
        motivationalMessage={getMotivationalMessage(summary.progressPercentage)}
        connected={connected}
        apiConfigured={isApiConfigured()}
        totalPaid={summary.totalPaid}
        motoValue={MOTO_VALUE}
      />

      <main className="max-w-md mx-auto px-4 mt-4 pb-8 space-y-3">

        <StatusIndicator connected={connected} apiConfigured={isApiConfigured()} />

        {error && (
          <div className="bg-danger/8 border border-danger/25 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-danger">{error}</p>
              <button
                onClick={refetch}
                className="text-xs text-danger/60 underline mt-1 hover:text-danger transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20 animate-fade-in">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="ml-2.5 text-sm text-muted-foreground">Carregando...</span>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            <FinancialSummary
              totalPaid={summary.totalPaid}
              remainingBalance={summary.remainingBalance}
              motoValue={MOTO_VALUE}
            />
            <CountdownCard
              weeksRemaining={summary.weeksRemaining}
              weeklyPayment={WEEKLY_PAYMENT}
            />
            <OpportunityCostCard />
            <PaymentForm
              onSubmit={addPayment}
              saving={saving}
              nextParcelaNumber={summary.nextParcelaNumber}
            />
            <PaymentHistory
              payments={payments}
              onDelete={deletePayment}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
