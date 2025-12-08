'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { API_URL } from '@/lib/api'

export default function TransferirUsuarioModal({ usuario, open, onOpenChange, onSuccess }) {
  const { fetchWithAuth } = useAuth()
  const [loading, setLoading] = useState(false)
  const [unidades, setUnidades] = useState([])
  const [novaUnidadeId, setNovaUnidadeId] = useState('')

  useEffect(() => {
    if (!open) return
    const carregar = async () => {
      try {
        const res = await fetchWithAuth(`${API_URL}unidades?page=1&perPage=200`)
        if (!res.ok) return
        const body = await res.json()
        setUnidades(body.unidades || [])
      } catch (e) {
        console.error(e)
      }
    }
    carregar()
  }, [open, fetchWithAuth])

  if (!open) return null

  const transferir = async () => {
    if (!novaUnidadeId) { alert('Escolha a nova unidade.'); return }
    setLoading(true)
    try {
      const url = `${API_URL}usuarios/${usuario.id}`
      const res = await fetchWithAuth(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unidadeId: Number(novaUnidadeId) })
      })
      if (!res.ok) throw new Error('Falha ao transferir usuário')
      if (onSuccess) onSuccess()
    } catch (e) {
      console.error(e)
      alert('Erro ao transferir usuário.')
    } finally {
      setLoading(false)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Transferir {usuario?.nome}</DialogTitle>
          <DialogDescription>Selecione a unidade de destino.</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <Select value={novaUnidadeId} onValueChange={(v) => setNovaUnidadeId(v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="-- Selecionar unidade --" />
            </SelectTrigger>
            <SelectContent>
              {unidades.map(u => (
                <SelectItem key={u.id} value={String(u.id)}>{u.nome || `${u.cidade || ''} - ${u.estado || ''}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancelar</Button>
          <Button onClick={transferir} disabled={loading}>{loading ? 'Transferindo...' : 'Transferir'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

