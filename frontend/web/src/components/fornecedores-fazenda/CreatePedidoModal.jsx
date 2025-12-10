'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/lib/api';

/**
 * Modal para criar pedido externo (Fazenda -> Fornecedor Externo)
 */
export function CreatePedidoModal({
  open,
  onOpenChange,
  unidadeId,
  tipo = 'externo',
  fornecedores = [],
  contratos = [],
  onPedidoCreated = () => {}
}) {
  const { user, fetchWithAuth } = useAuth();
  const [selectedFornecedorId, setSelectedFornecedorId] = useState('');
  const [selectedContratoId, setSelectedContratoId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [observacoes, setObservacoes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const tiposTransporte = [
    { value: 'VEICULO_PROPRIO', label: 'Veículo Próprio' },
    { value: 'TERCEIRO', label: 'Terceiro' },
    { value: 'RETIRADA', label: 'Retirada' },
    { value: 'SEDEX', label: 'Sedex' },
    { value: 'PAC', label: 'PAC' }
  ];

  const handleCriarPedido = async () => {
    // Validações
    if (tipo === 'externo' && !selectedFornecedorId) {
      setError('Por favor, selecione um fornecedor externo');
      return;
    }

    if (tipo === 'interno' && !selectedFornecedorId) {
      setError('Por favor, selecione uma fazenda fornecedora');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Preparar payload
      const payload = {
        descricao: descricao || null,
        observacoes: observacoes || null
      };

      // Adicionar campos específicos por tipo
      if (tipo === 'externo') {
        payload.origemFornecedorExternoId = parseInt(selectedFornecedorId);
        if (selectedContratoId) {
          payload.contratoId = parseInt(selectedContratoId);
        }
      } else if (tipo === 'interno') {
        payload.destinoUnidadeId = parseInt(selectedFornecedorId);
      }

      // Definir rota correta
      const route = tipo === 'externo' 
        ? `${API_URL}pedidos-externos/${unidadeId}`
        : `${API_URL}pedidos-internos/${unidadeId}`;

      const response = await fetchWithAuth(route, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.erro || `Erro ao criar pedido: ${response.status}`);
      }

      const result = await response.json();
      setSuccessMessage(`Pedido criado com sucesso! ID: ${result.pedido?.id || 'Novo'}`);
      
      // Limpar formulário
      setSelectedFornecedorId('');
      setSelectedContratoId('');
      setDescricao('');
      setObservacoes('');

      // Fechar modal após 1.5s
      setTimeout(() => {
        onOpenChange(false);
        onPedidoCreated(result.pedido);
      }, 1500);
    } catch (err) {
      setError(String(err?.message || 'Erro desconhecido ao criar pedido'));
      console.error('Erro ao criar pedido:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {tipo === 'externo' ? 'Criar Pedido para Fornecedor Externo' : 'Criar Pedido para Fazenda'}
          </DialogTitle>
          <DialogDescription>
            {tipo === 'externo'
              ? 'Preencha os detalhes do pedido para sua fazenda fazer uma compra de um fornecedor externo.'
              : 'Preencha os detalhes do pedido para sua loja fazer uma compra de uma fazenda fornecedora.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Erro ou Sucesso */}
          {error && (
            <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">{error}</div>
            </div>
          )}

          {successMessage && (
            <div className="flex gap-3 p-3 bg-green-50 border border-green-200 rounded text-green-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">{successMessage}</div>
            </div>
          )}

          {/* Seleção de Fornecedor / Fazenda */}
          <div className="space-y-2">
            <Label htmlFor="fornecedor">
              {tipo === 'externo' ? 'Fornecedor Externo *' : 'Fazenda Fornecedora *'}
            </Label>
            <Select value={selectedFornecedorId} onValueChange={setSelectedFornecedorId}>
              <SelectTrigger id="fornecedor">
                <SelectValue
                  placeholder={tipo === 'externo' ? 'Selecione um fornecedor...' : 'Selecione uma fazenda...'}
                />
              </SelectTrigger>
              <SelectContent>
                {fornecedores.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">Nenhum fornecedor disponível</div>
                ) : (
                  fornecedores.map(f => (
                    <SelectItem key={f.id} value={String(f.id)}>
                      {f.nomeEmpresa || f.nome || `Fornecedor ${f.id}`}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Seleção de Contrato (apenas para pedidos externos) */}
          {tipo === 'externo' && (
            <div className="space-y-2">
              <Label htmlFor="contrato">Contrato (Opcional)</Label>
              <Select value={selectedContratoId} onValueChange={setSelectedContratoId}>
                <SelectTrigger id="contrato">
                  <SelectValue placeholder="Selecione um contrato..." />
                </SelectTrigger>
                <SelectContent>
                  {contratos.length === 0 ? (
                    <div className="p-2 text-sm text-gray-500">Nenhum contrato disponível</div>
                  ) : (
                    contratos
                      .filter(c => String(c.fornecedorExternoId) === selectedFornecedorId || !selectedFornecedorId)
                      .map(c => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          Contrato {c.id} - {c.fornecedorExterno?.nomeEmpresa || 'Desconhecido'}
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Descrição do Pedido */}
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição do Pedido</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o pedido..."
              rows={3}
            />
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Observações adicionais sobre o pedido..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCriarPedido}
            disabled={loading}
          >
            {loading ? 'Criando...' : 'Criar Pedido'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
