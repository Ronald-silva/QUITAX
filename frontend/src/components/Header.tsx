import { CheckCircle2, Wifi, WifiOff } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface HeaderProps {
  progressPercentage: number
  motivationalMessage: string
  connected: boolean
  apiConfigured: boolean
}

export function Header({ progressPercentage, motivationalMessage, connected, apiConfigured }: HeaderProps) {
  return (
    <header className="bg-gradient-to-b from-surface-elevated to-background border-b border-border px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Logo e título */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Quitax</h1>
            <p className="text-sm text-muted-foreground mt-1">Sua moto, seu futuro</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Ícone de conexão */}
            {apiConfigured && (
              <div
                title={connected ? 'Conectado ao Google Sheets' : 'Sem conexão com Google Sheets'}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300
                  ${connected ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}
              >
                {connected
                  ? <Wifi className="w-3.5 h-3.5" />
                  : <WifiOff className="w-3.5 h-3.5" />
                }
              </div>
            )}

            <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center animate-pulse-slow">
              <CheckCircle2 className="w-7 h-7 text-success" />
            </div>
          </div>
        </div>

        {/* Barra de Progresso Principal */}
        <div className="bg-surface rounded-xl p-5 border border-border shadow-card">
          <div className="flex justify-between items-end mb-3">
            <span className="text-sm font-medium text-muted-foreground">Progresso Total</span>
            <span className="text-3xl font-bold text-success tabular-nums">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress value={progressPercentage} max={100} className="h-5" />
          <p className="text-xs text-muted-foreground mt-4 text-center leading-relaxed">
            {motivationalMessage}
          </p>
        </div>
      </div>
    </header>
  )
}
