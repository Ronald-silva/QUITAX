import { TrendingUp } from 'lucide-react'

export function OpportunityCostCard() {
  return (
    <div className="bg-success-muted rounded-xl p-5 border border-success/20 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-6 h-6 text-success" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-success mb-2">
            Economia Real
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Por pagar direto a um amigo sem juros ou taxas abusivas de locadoras,
            você está construindo patrimônio real a cada semana.
          </p>
        </div>
      </div>
    </div>
  )
}
