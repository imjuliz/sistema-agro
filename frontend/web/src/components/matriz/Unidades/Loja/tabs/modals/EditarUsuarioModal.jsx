'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { API_URL } from '@/lib/api'

export function EditarUsuarioModal({ usuario, open, onOpenChange, onSuccess }) {
  const { fetchWithAuth } = useAuth()
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)
  const [formData, setFormData] = useState({
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    telefone: usuario?.telefone || '',
    telefoneRaw: String(usuario?.telefone || '').replace(/\D/g, ''),
    role: usuario?.perfil?.funcao || ''
  })

  const handleMudarCampo = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }))
    setErro(null)
  }

  const handleSalvar = async () => {
    try {
      setCarregando(true)
      setErro(null)

      if (!formData.nome?.trim()) {
        setErro('Nome é obrigatório')
        return
      }

      if (!formData.email?.trim()) {
        setErro('Email é obrigatório')
        return
      }

      if (!formData.telefoneRaw?.trim()) {
        setErro('Telefone é obrigatório')
        return
      }

      if (!formData.role?.trim()) {
        setErro('Função é obrigatória')
        return
      }

      const payload = {
        nome: formData.nome,
        email: formData.email,
        telefone: String(formData.telefoneRaw || '').replace(/\D/g, ''),
        role: formData.role
      }

      const response = await fetchWithAuth(`${API_URL}usuarios/${usuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const data = await response.json()
        setErro(data?.erro || data?.message || 'Erro ao atualizar usuário')
        return
      }

      if (onSuccess) onSuccess()
      onOpenChange(false)
    } catch (err) {
      console.error('Erro ao salvar usuário:', err)
      setErro('Erro ao salvar as alterações. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Atualize as informações do usuário
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              placeholder="Nome completo"
              value={formData.nome}
              onChange={(e) => handleMudarCampo('nome', e.target.value)}
              disabled={carregando}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@exemplo.com"
              value={formData.email}
              onChange={(e) => handleMudarCampo('email', e.target.value)}
              disabled={carregando}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="telefone">Telefone *</Label>
            <Input
              id="telefone"
              placeholder="(00) 00000-0000"
              value={formData.telefone}
              onChange={(e) => {
                const onlyDigits = String(e.target.value).replace(/\D/g, '')
                const formatPhone = (d) => {
                  if (!d) return ''
                  if (d.length <= 2) return `(${d}`
                  if (d.length <= 6) return `(${d.slice(0,2)}) ${d.slice(2)}`
                  if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`
                  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7,11)}`
                }
                handleMudarCampo('telefoneRaw', onlyDigits)
                handleMudarCampo('telefone', formatPhone(onlyDigits))
              }}
              disabled={carregando}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Função *</Label>
            <Select
              value={formData.role}
              onValueChange={(valor) => handleMudarCampo('role', valor)}
              disabled={carregando}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                {(() => {
                  const allowedRoles = [
                    'GERENTE_LOJA',
                    'FUNCIONARIO_LOJA'
                  ]

                  const tokenMap = {
                    GERENTE: 'Gerente',
                    FUNCIONARIO: 'Funcionário',
                    MATRIZ: 'Matriz',
                    FAZENDA: 'Fazenda',
                    LOJA: 'Loja'
                  }

                  const formatRoleLabel = (role) => {
                    if (!role) return ''
                    const parts = String(role).split('_')
                    return parts.map(p => tokenMap[p] || (p.charAt(0) + p.slice(1).toLowerCase())).join(' ')
                  }

                  return allowedRoles.map(r => (
                    <SelectItem key={r} value={r}>{formatRoleLabel(r)}</SelectItem>
                  ))
                })()}
              </SelectContent>
            </Select>
          </div>

          {erro && (
            <div className="bg-destructive/10 text-destructive px-3 py-2 rounded text-sm">
              {erro}
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={carregando}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSalvar}
            disabled={carregando}
          >
            {carregando ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

