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
 * Modal para criar pedido interno (Loja -> Fazenda)
 */
export function CreatePedidoLojaModal({
  open,
  onOpenChange,
  unidadeId,
  fornecedores = [],
  onPedidoCreated = () => {}
}) {
  const { user, fetchWithAuth } = useAuth();
  const [selectedFazendaId, setSelectedFazendaId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [observacoes, setObservacoes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleCriarPedido = async () => {
    // Validações
    if (!selectedFazendaId) {
      setError('Por favor, selecione uma fazenda fornecedora');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Preparar payload para pedido interno
      const payload = {
        destinoUnidadeId: parseInt(selectedFazendaId), // Fazenda destino
        descricao: descricao || null,
        observacoes: observacoes || null
      };

      const response = await fetchWithAuth(`${API_URL}pedidos-internos/${unidadeId}`, {
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
      setSelectedFazendaId('');
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
          <DialogTitle>Criar Pedido para Fazenda</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do pedido para sua loja fazer uma compra de uma fazenda fornecedora.
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

          {/* Seleção de Fazenda */}
          <div className="space-y-2">
            <Label htmlFor="fazenda">Fazenda Fornecedora *</Label>
            <Select value={selectedFazendaId} onValueChange={setSelectedFazendaId}>
              <SelectTrigger id="fazenda">
                <SelectValue placeholder="Selecione uma fazenda fornecedora..." />
              </SelectTrigger>
              <SelectContent>
                {fornecedores.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">Nenhuma fazenda fornecedora disponível</div>
                ) : (
                  fornecedores.map(f => (
                    <SelectItem key={f.id} value={String(f.id)}>
                      {f.nome || f.nomeEmpresa || `Fazenda ${f.id}`}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

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
