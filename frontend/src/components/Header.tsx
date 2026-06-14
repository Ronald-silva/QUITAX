import { Wifi, WifiOff, Bike } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/utils'

interface HeaderProps {
  progressPercentage: number
  motivationalMessage: string
  connected: boolean
  apiConfigured: boolean
  totalPaid: number
  motoValue: number
}

export function Header({ progressPercentage, motivationalMessage, connected, apiConfigured, totalPaid, motoValue }: HeaderProps) {
  return (
    <header className="bg-surface-elevated border-b border-border px-4 pt-6 pb-5">
      <div className="max-w-md mx-auto space-y-4">

        {/* Título + status de conexão */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
              <Bike className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight leading-none">Quitax</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Sua moto, seu futuro</p>
            </div>
          </div>

          {apiConfigured && (
            <div
              title={connected ? 'Conectado ao Google Sheets' : 'Sem conexão com Google Sheets'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors
                ${connected
                  ? 'bg-success/10 text-success'
                  : 'bg-danger/10 text-danger'
                }`}
            >
              {connected
                ? <Wifi className="w-3 h-3" />
                : <WifiOff className="w-3 h-3" />
              }
              {connected ? 'Sheets' : 'Offline'}
            </div>
          )}
        </div>

        {/* Barra de Progresso */}
        <div className="bg-surface rounded-xl p-4 border border-border">
          <div className="flex justify-between items-baseline mb-2.5">
            <span className="text-xs font-medium text-muted-foreground">Progresso</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-success tabular-nums">
                {progressPercentage.toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground">
                {formatCurrency(totalPaid)} / {formatCurrency(motoValue)}
              </span>
            </div>
          </div>
          <Progress value={progressPercentage} max={100} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed">
            {motivationalMessage}
          </p>
        </div>

      </div>
    </header>
  )
}
