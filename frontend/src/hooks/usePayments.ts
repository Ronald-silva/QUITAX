import { useState, useEffect, useCallback } from 'react'
import { Payment } from '@/types'

const API_URL = import.meta.env.VITE_API_URL as string

const SEED_PAYMENTS: Omit<Payment, 'id'>[] = [
  { descricao: 'Caução Inicial', valor: 1000, data: '2026-05-14' },
  { descricao: 'Parcela 1', valor: 400, data: '2026-05-21' },
  { descricao: 'Parcela 2', valor: 400, data: '2026-05-28' },
]

export const isApiConfigured = (): boolean =>
  Boolean(API_URL && API_URL !== 'SUA_URL_DO_APPS_SCRIPT_AQUI' && API_URL.startsWith('http'))

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)

  const seedInitialPayments = useCallback(async (refetch: () => Promise<void>) => {
    try {
      for (const payment of SEED_PAYMENTS) {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(payment),
        })
        await new Promise(resolve => setTimeout(resolve, 300))
      }
      await refetch()
    } catch {
      setPayments(SEED_PAYMENTS.map((p, i) => ({ ...p, id: `SEED_${i + 1}` })))
    }
  }, [])

  const fetchPayments = useCallback(async () => {
    if (!isApiConfigured()) {
      setPayments(SEED_PAYMENTS.map((p, i) => ({ ...p, id: `SEED_${i + 1}` })))
      setConnected(false)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await fetch(API_URL, { cache: 'no-store' })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.json()
      if (!result.success) throw new Error(result.message || 'Erro desconhecido')
      const sheetPayments: Payment[] = result.data || []
      setConnected(true)
      if (sheetPayments.length === 0) {
        await seedInitialPayments(fetchPayments)
        return
      }
      setPayments(sheetPayments)
    } catch (err) {
      setError('Erro ao conectar com o Google Sheets. Verifique a URL e tente novamente.')
      setConnected(false)
      setPayments(SEED_PAYMENTS.map((p, i) => ({ ...p, id: `SEED_${i + 1}` })))
      console.error('[Quitax] Erro na API:', err)
    } finally {
      setLoading(false)
    }
  }, [seedInitialPayments])

  const addPayment = useCallback(async (amount: number, date: string, descricao: string): Promise<boolean> => {
    if (!isApiConfigured()) {
      setPayments(prev => [...prev, {
        id: `LOCAL_${Date.now()}`,
        descricao: descricao || 'Parcela semanal',
        valor: amount,
        data: date,
      }])
      return true
    }
    try {
      setSaving(true)
      setError(null)
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ descricao: descricao || 'Parcela semanal', valor: amount, data: date }),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.json()
      if (!result.success) throw new Error(result.message)
      setPayments(prev => [...prev, result.data as Payment])
      return true
    } catch (err) {
      setError('Erro ao salvar pagamento. Tente novamente.')
      console.error('[Quitax] Erro ao salvar:', err)
      return false
    } finally {
      setSaving(false)
    }
  }, [])

  const deletePayment = useCallback(async (id: string) => {
    if (!isApiConfigured()) {
      setPayments(prev => prev.filter(p => p.id !== id))
      return
    }
    try {
      setError(null)
      const response = await fetch(`${API_URL}?action=delete&id=${encodeURIComponent(id)}`, { cache: 'no-store' })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.json()
      if (!result.success) throw new Error(result.message)
      setPayments(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      setError('Erro ao excluir pagamento. Tente novamente.')
      console.error('[Quitax] Erro ao excluir:', err)
    }
  }, [])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  return { payments, loading, saving, error, connected, addPayment, deletePayment, refetch: fetchPayments }
}
