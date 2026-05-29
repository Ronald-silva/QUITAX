import { Calendar } from 'lucide-react'

interface CountdownCardProps {
  weeksRemaining: number
  weeklyPayment: number
}

export function CountdownCard({ weeksRemaining, weeklyPayment }: CountdownCardProps) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <div className="bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl p-6 border border-accent/30 shadow-elegant animate-slide-up">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-6 h-6 text-accent" />
        <h2 className="text-lg font-semibold text-foreground">Contagem Regressiva</h2>
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-5xl font-bold text-accent">
          {weeksRemaining}
        </span>
        <span className="text-sm text-muted-foreground">
          {weeksRemaining === 1 ? 'quinta-feira' : 'quintas-feiras'} restantes
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Mantendo o ritmo de {formatCurrency(weeklyPayment)} por semana
      </p>
    </div>
  )
}
