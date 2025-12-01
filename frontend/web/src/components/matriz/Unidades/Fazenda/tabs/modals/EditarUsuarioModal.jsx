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

export function EditarUsuarioModal({ usuario, aberto, onAbrirMudar, onSucesso }) {
  const { fetchWithAuth } = useAuth()
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)
  const [formData, setFormData] = useState({
    nome: usuario?.name || '',
    email: usuario?.email || '',
    telefone: usuario?.phone || '',
    role: usuario?.title || ''
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

      if (!formData.telefone?.trim()) {
        setErro('Telefone é obrigatório')
        return
      }

      if (!formData.role?.trim()) {
        setErro('Função é obrigatória')
        return
      }

      // Mapear role de exibição para nome correto
      const roleMap = {
        'Gerente': 'GERENTE_FAZENDA',
        'Agricultor': 'AGRICULTOR',
        'Funcionário': 'FUNCIONARIO'
      }

      const roleValue = roleMap[formData.role] || formData.role

      const response = await fetchWithAuth(
        `${API_URL}usuarios/${usuario.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nome: formData.nome,
            email: formData.email,
            telefone: formData.telefone,
            role: roleValue
          })
        }
      )

      if (!response.ok) {
        const data = await response.json()
        setErro(data?.erro || data?.message || 'Erro ao atualizar usuário')
        return
      }

      onSucesso()
      onAbrirMudar(false)
    } catch (err) {
      console.error('Erro ao salvar usuário:', err)
      setErro('Erro ao salvar as alterações. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={onAbrirMudar}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Atualize as informações do usuário
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Nome */}
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

          {/* Email */}
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

          {/* Telefone */}
          <div className="grid gap-2">
            <Label htmlFor="telefone">Telefone *</Label>
            <Input
              id="telefone"
              placeholder="(00) 00000-0000"
              value={formData.telefone}
              onChange={(e) => handleMudarCampo('telefone', e.target.value)}
              disabled={carregando}
            />
          </div>

          {/* Função */}
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
                <SelectItem value="Gerente">Gerente</SelectItem>
                <SelectItem value="Agricultor">Agricultor</SelectItem>
                <SelectItem value="Funcionário">Funcionário</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mensagem de erro */}
          {erro && (
            <div className="bg-destructive/10 text-destructive px-3 py-2 rounded text-sm">
              {erro}
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => onAbrirMudar(false)}
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
