import { BadgeCheck } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// Estimativa real: R$20.000 financiados em 24x a 2,5% a.m.
// PMT = 20000 * 0,025 * 1,025^24 / (1,025^24 - 1) ≈ R$1.118/mês
// Total pago = 1.118 × 24 ≈ R$26.832 → arredondado R$27.000
const MOTO_PRICE    = 20000
const FINANCING_TOTAL = 27000
const INTEREST_SAVED  = FINANCING_TOTAL - MOTO_PRICE  // R$7.000

export function OpportunityCostCard() {
  return (
    <div className="bg-card rounded-xl p-4 border border-border shadow-card animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-success/12 flex items-center justify-center flex-shrink-0 mt-0.5">
          <BadgeCheck className="w-5 h-5 text-success" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Pagando sem juros
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Num financiamento típico de 24x a 2,5% a.m., a mesma moto custaria cerca de{' '}
            <span className="text-danger font-medium">{formatCurrency(FINANCING_TOTAL)}</span>.
            {' '}Pagando direto, você vai economizar{' '}
            <span className="text-success font-semibold">{formatCurrency(INTEREST_SAVED)}</span>
            {' '}em juros ao quitar.
          </p>
        </div>
      </div>
    </div>
  )
}
