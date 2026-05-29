interface StatusIndicatorProps {
  connected: boolean
  apiConfigured: boolean
}

export function StatusIndicator({ connected, apiConfigured }: StatusIndicatorProps) {
  if (!apiConfigured) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 animate-fade-in">
        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse flex-shrink-0" />
        <p className="text-xs text-yellow-400 font-medium">
          Modo offline — configure o{' '}
          <code className="font-mono bg-yellow-500/10 px-1 rounded">.env</code>{' '}
          com a URL do Apps Script para sincronizar com o Sheets
        </p>
      </div>
    )
  }

  if (connected) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/20 animate-fade-in">
        <span className="w-2 h-2 rounded-full bg-success flex-shrink-0" />
        <p className="text-xs text-success font-medium">Sincronizado com Google Sheets</p>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-danger-muted border border-danger/20 animate-fade-in">
      <span className="w-2 h-2 rounded-full bg-danger animate-pulse flex-shrink-0" />
      <p className="text-xs text-danger font-medium">Sem conexão com Google Sheets</p>
    </div>
  )
}
