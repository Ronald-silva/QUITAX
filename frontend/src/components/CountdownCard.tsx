import { CalendarDays, PartyPopper } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface CountdownCardProps {
  weeksRemaining: number
  weeklyPayment: number
}

export function CountdownCard({ weeksRemaining, weeklyPayment }: CountdownCardProps) {
  if (weeksRemaining === 0) {
    return (
      <div className="bg-card rounded-xl p-5 border border-success/30 shadow-card animate-slide-up">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-success/15 flex items-center justify-center">
            <PartyPopper className="w-4 h-4 text-success" />
          </div>
          <h2 className="text-sm font-semibold text-success">Moto Quitada!</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Parabéns! Você conquistou sua moto pagando sem juros.
        </p>
      </div>
    )
  }

  const label = weeksRemaining === 1 ? 'semana restante' : 'semanas restantes'

  return (
    <div className="bg-card rounded-xl p-5 border border-border shadow-card animate-slide-up">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
          <CalendarDays className="w-4 h-4 text-accent" />
        </div>
        <h2 className="text-sm font-semibold text-foreground">Contagem Regressiva</h2>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-bold text-accent tabular-nums">{weeksRemaining}</span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        Mantendo o ritmo de {formatCurrency(weeklyPayment)} por semana
      </p>
    </div>
  )
}
