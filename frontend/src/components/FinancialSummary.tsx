import { TrendingUp, DollarSign } from 'lucide-react'

interface FinancialSummaryProps {
  totalPaid: number
  remainingBalance: number
}

export function FinancialSummary({ totalPaid, remainingBalance }: FinancialSummaryProps) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Total Pago */}
      <div className="bg-card rounded-xl p-4 border border-border shadow-card hover:border-success/30 transition-colors">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">Total Pago</span>
        </div>
        <p className="text-2xl font-bold text-success">
          {formatCurrency(totalPaid)}
        </p>
      </div>

      {/* Saldo Devedor */}
      <div className="bg-card rounded-xl p-4 border border-border shadow-card hover:border-danger/30 transition-colors">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-lg bg-danger/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-danger" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">Saldo Restante</span>
        </div>
        <p className="text-2xl font-bold text-danger">
          {formatCurrency(remainingBalance)}
        </p>
      </div>
    </div>
  )
}
