"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { API_URL } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

export default function CreateContratoModal({ open, onOpenChange, unidadeId, onSuccess = () => {} }) {
  const { fetchWithAuth } = useAuth()

  const [fornecedores, setFornecedores] = useState([])
  const [loading, setLoading] = useState(false)

  const [fornecedorId, setFornecedorId] = useState("")
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")
  const [dataEnvio, setDataEnvio] = useState("")
  const [frequencia, setFrequencia] = useState("MENSALMENTE")
  const [diaPagamento, setDiaPagamento] = useState("")
  const [formaPagamento, setFormaPagamento] = useState("PIX")
  const [valorTotal, setValorTotal] = useState("")
  const [status, setStatus] = useState("ATIVO")
  const [descricao, setDescricao] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let mounted = true
    if (!open) return
    if (fornecedores && fornecedores.length > 0) return

    const load = async () => {
      setLoading(true)
      try {
        const base = String(API_URL || '/api').replace(/\/$/, '')
        const fetchFn = fetchWithAuth || fetch
        const res = await fetchFn(`${base}/listarFornecedoresExternos/${unidadeId}`)
        const data = await res.json().catch(() => ({}))
        // try common keys
        let arr = []
        if (Array.isArray(data)) arr = data
        else if (Array.isArray(data.fornecedores)) arr = data.fornecedores
        else if (Array.isArray(data.data)) arr = data.data
        else {
          // scan
          for (const k of Object.keys(data)) {
            if (Array.isArray(data[k])) { arr = data[k]; break }
            const v = data[k]
            if (v && typeof v === 'object') {
              const inner = Object.values(v).find(x => Array.isArray(x))
              if (Array.isArray(inner)) { arr = inner; break }
            }
          }
        }
        if (mounted) setFornecedores(Array.isArray(arr) ? arr : [])
      } catch (err) {
        console.error('[CreateContratoModal] erro carregar fornecedores:', err)
        if (mounted) setFornecedores([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [open, unidadeId, fetchWithAuth])

  const handleSubmit = async (e) => {
    e?.preventDefault?.()
    if (!fornecedorId) return alert('Selecione um fornecedor')
    if (!dataInicio || !dataEnvio || !frequencia || !diaPagamento || !formaPagamento) return alert('Preencha todos os campos obrigatórios')

    setSubmitting(true)
    try {
      const base = String(API_URL || '/api').replace(/\/$/, '')
      const payload = {
        fornecedorExternoId: fornecedorId,
        dataInicio,
        dataFim: dataFim || null,
        dataEnvio,
        descricao: descricao || null,
        status: status || 'ATIVO',
        frequenciaEntregas: frequencia,
        diaPagamento,
        formaPagamento: formaPagamento,
        valorTotal: valorTotal ? Number(valorTotal) : null,
        itens: []
      }

      const fetchFn = fetchWithAuth || fetch
      const res = await fetchFn(`${base}/criarContratoExterno/${unidadeId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const body = await res.json().catch(() => ({}))
      if (res.ok && body.sucesso) {
        onSuccess(body)
      } else {
        console.error('[CreateContratoModal] criar contrato erro:', body)
        alert(body?.erro || body?.message || 'Erro ao criar contrato')
      }
    } catch (err) {
      console.error('[CreateContratoModal] exception:', err)
      alert('Erro ao criar contrato')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Novo contrato</DialogTitle>
          <DialogDescription>Crie um contrato entre esta fazenda e um fornecedor externo vinculado.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label>Fornecedor Externo</Label>
            {loading ? (
              <p className="text-sm text-gray-500">Carregando fornecedores...</p>
            ) : (
              <select value={fornecedorId} onChange={(e) => setFornecedorId(e.target.value)} className="w-full border rounded p-2 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-900">
                <option value="">Selecione um fornecedor</option>
                {fornecedores.map((f) => (
                  <option key={f.id ?? f.ID ?? f.IDENT} value={f.id ?? f.ID ?? f.IDENT}>{f?.nomeEmpresa ?? f?.nome ?? `Fornecedor ${f.id ?? f.ID ?? 'N/D'}`}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <Label>Descrição</Label>
            <Input value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Data Início</Label>
              <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} required />
            </div>
            <div>
              <Label>Data Fim (opcional)</Label>
              <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Data de Envio</Label>
            <Input type="date" value={dataEnvio} onChange={(e) => setDataEnvio(e.target.value)} required />
          </div>

          <div>
            <Label>Frequência de Entregas</Label>
            <select value={frequencia} onChange={(e) => setFrequencia(e.target.value)} className="w-full border rounded p-2 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-900">
              <option value="SEMANALMENTE">SEMANALMENTE</option>
              <option value="QUINZENAL">QUINZENAL</option>
              <option value="MENSALMENTE">MENSALMENTE</option>
              <option value="TRIMESTRAL">TRIMESTRAL</option>
              <option value="SEMESTRAL">SEMESTRAL</option>
            </select>
          </div>

          <div>
            <Label>Dia de Pagamento</Label>
            <Input type="number" min="1" max="31" value={diaPagamento} onChange={(e) => setDiaPagamento(e.target.value)} required />
          </div>

          <div>
            <Label>Forma de Pagamento</Label>
            <select value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)} className="w-full border rounded p-2 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-900">
              <option value="DINHEIRO">DINHEIRO</option>
              <option value="CARTAO">CARTÃO</option>
              <option value="PIX">PIX</option>
            </select>
          </div>

          <div>
            <Label>Valor Total (opcional)</Label>
            <Input type="number" step="0.01" value={valorTotal} onChange={(e) => setValorTotal(e.target.value)} />
          </div>

          <div>
            <Label>Status</Label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border rounded p-2 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-900">
              <option value="ATIVO">ATIVO</option>
              <option value="INATIVO">INATIVO</option>
            </select>
          </div>

          <DialogFooter>
            <div className="flex gap-2 w-full">
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" className="ml-auto" disabled={submitting}>{submitting ? 'Salvando...' : 'Salvar'}</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
