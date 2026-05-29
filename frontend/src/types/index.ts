export interface Payment {
  id: string
  descricao: string
  valor: number
  data: string
}

export interface FinancialSummary {
  totalPaid: number
  remainingBalance: number
  progressPercentage: number
  weeksRemaining: number
}
