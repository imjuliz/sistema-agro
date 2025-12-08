'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { API_URL } from '@/lib/api'

export default function DemitirUsuarioModal({ usuario, open, onOpenChange, onSuccess }) {
  const { fetchWithAuth } = useAuth()
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const confirmar = async () => {
    if (!usuario) return
    setLoading(true)
    try {
      const url = `${API_URL}usuarios/${usuario.id}`
      const res = await fetchWithAuth(url, { method: 'DELETE' })
      if (!res.ok) throw new Error('Falha ao demitir usuário')
      if (onSuccess) onSuccess()
    } catch (e) {
      console.error(e)
      alert('Erro ao demitir usuário.')
    } finally {
      setLoading(false)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Demitir {usuario?.nome}</DialogTitle>
          <DialogDescription>Esta ação removerá o usuário do sistema. Esta operação pode ser irreversível.</DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancelar</Button>
          <Button className="bg-destructive" onClick={confirmar} disabled={loading}>{loading ? 'Removendo...' : 'Demitir'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

