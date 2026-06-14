import { TrendingUp, Target } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface FinancialSummaryProps {
  totalPaid: number
  remainingBalance: number
  motoValue: number
}

export function FinancialSummary({ totalPaid, remainingBalance, motoValue }: FinancialSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Total Pago */}
      <div className="bg-card rounded-xl p-4 border border-border shadow-card hover:border-success/30 transition-colors overflow-hidden min-w-0">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-success/12 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">Total Pago</span>
        </div>
        <p className="text-lg font-bold text-success tabular-nums truncate">
          {formatCurrency(totalPaid)}
        </p>
        <p className="text-[10px] text-muted-foreground mt-1 truncate">
          de {formatCurrency(motoValue)}
        </p>
      </div>

      {/* Saldo Restante — azul info (neutro, não alarmante) */}
      <div className="bg-card rounded-xl p-4 border border-border shadow-card hover:border-info/30 transition-colors overflow-hidden min-w-0">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-info/12 flex items-center justify-center flex-shrink-0">
            <Target className="w-4 h-4 text-info" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">Restante</span>
        </div>
        <p className="text-lg font-bold text-info tabular-nums truncate">
          {formatCurrency(remainingBalance)}
        </p>
        <p className="text-[10px] text-muted-foreground mt-1">
          para quitar
        </p>
      </div>
    </div>
  )
}
