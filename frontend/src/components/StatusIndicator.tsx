interface StatusIndicatorProps {
  connected: boolean
  apiConfigured: boolean
}

export function StatusIndicator({ connected, apiConfigured }: StatusIndicatorProps) {
  // Conectado com sucesso → silêncio (status já aparece no Header)
  if (connected) return null

  if (!apiConfigured) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/8 border border-yellow-500/20 animate-fade-in">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
        <p className="text-xs text-yellow-400">
          Modo offline — configure <code className="font-mono bg-yellow-500/10 px-1 rounded">.env</code> para sincronizar com o Sheets
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-danger/8 border border-danger/20 animate-fade-in">
      <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse flex-shrink-0" />
      <p className="text-xs text-danger">Sem conexão com Google Sheets</p>
    </div>
  )
}
