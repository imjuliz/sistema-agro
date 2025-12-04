"use client";

import React, { useState, useEffect } from "react";
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/lib/api';
import { Trash2, Plus } from 'lucide-react';

export default function AddLoteModal({ open, onOpenChange, onCreated, unidadeId }) {
  const { fetchWithAuth, user } = useAuth();
  const actualUnidadeId = unidadeId || user?.unidadeId;

  const [step, setStep] = useState(0);
  const [contratos, setContratos] = useState([]);
  const [selectedContratoId, setSelectedContratoId] = useState("");
  const [selectedContrato, setSelectedContrato] = useState(null);
  const [produtionStages, setProdutionStages] = useState({}); // { itemId: [{ nome, descricao, duracao }, ...] }
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Carregar contratos quando o modal abre
  useEffect(() => {
    console.log('[AddLoteModal] useEffect - open:', open, 'actualUnidadeId:', actualUnidadeId);
    
    if (!open || !actualUnidadeId) {
      console.log('[AddLoteModal] Resetando estado - modal fechado ou sem unidadeId');
      setContratos([]);
      setSelectedContratoId("");
      setSelectedContrato(null);
      setProdutionStages({});
      setStep(0);
      setFormError("");
      return;
    }

    loadContratos();
  }, [open, actualUnidadeId]);

  async function loadContratos() {
    try {
      setLoading(true);
      const base = String(API_URL || '').replace(/\/$/, '');
      console.log('[AddLoteModal] Carregando contratos para unidadeId:', actualUnidadeId);
      console.log('[AddLoteModal] URL:', `${base}/verContratosComLojas/${actualUnidadeId}`);
      
      const res = await fetchWithAuth(`${base}/verContratosComLojas/${actualUnidadeId}`, {
        method: "GET"
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("[AddLoteModal] Erro ao carregar contratos:", body);
        console.error("[AddLoteModal] Status:", res.status);
        setFormError("Erro ao carregar contratos. Tente novamente.");
        setContratos([]);
        return;
      }

      const json = await res.json();
      console.log('[AddLoteModal] Resposta da API:', json);
      
      // A API retorna { sucesso, contratos: [...], message }
      let list = [];
      if (json.contratos) {
        list = Array.isArray(json.contratos) ? json.contratos : [json.contratos];
      } else if (Array.isArray(json)) {
        list = json;
      }
      
      console.log('[AddLoteModal] Lista de contratos após parse:', list);
      console.log('[AddLoteModal] Quantidade de contratos:', list.length);
      
      setContratos(list);
      setFormError(""); // Limpar erro se houver
    } catch (err) {
      console.error("[AddLoteModal] Erro ao buscar contratos:", err);
      setFormError("Erro ao carregar contratos. Tente novamente.");
      setContratos([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectContrato(contratoId) {
    console.log('[AddLoteModal] handleSelectContrato chamado com:', contratoId);
    console.log('[AddLoteModal] Contratos disponíveis:', contratos);
    const contrato = contratos.find(c => {
      console.log('[AddLoteModal] Comparando:', String(c.id), '===', String(contratoId), '?', String(c.id) === String(contratoId));
      return String(c.id) === String(contratoId);
    });
    console.log('[AddLoteModal] Contrato encontrado:', contrato);
    setSelectedContratoId(contratoId);
    setSelectedContrato(contrato);
  }

  function handleConfirmContrato() {
    if (!selectedContrato || !selectedContrato.itens || selectedContrato.itens.length === 0) {
      setFormError("Contrato inválido ou sem itens.");
      return;
    }

    // Inicializar produção stages vazios para cada item
    const newStages = {};
    (selectedContrato.itens || []).forEach(item => {
      newStages[item.id] = [];
    });
    setProdutionStages(newStages);
    setStep(2);
    setFormError("");
  }

  function addProductionStage(itemId) {
    setProdutionStages(prev => ({
      ...prev,
      [itemId]: [
        ...(prev[itemId] || []),
        { id: `stage_${Date.now()}_${Math.random()}`, nome: '', descricao: '', duracao: '' }
      ]
    }));
  }

  function removeProductionStage(itemId, stageId) {
    setProdutionStages(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || []).filter(s => s.id !== stageId)
    }));
  }

  function updateProductionStage(itemId, stageId, field, value) {
    setProdutionStages(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || []).map(s =>
        s.id === stageId ? { ...s, [field]: value } : s
      )
    }));
  }

  function validateProductionStages() {
    for (const itemId in produtionStages) {
      const stages = produtionStages[itemId];
      if (!stages || stages.length === 0) {
        return false;
      }
      // Verificar se todos os stages têm nome
      if (!stages.every(s => s.nome && s.nome.trim())) {
        return false;
      }
    }
    return true;
  }

  async function handleCreateLote() {
    if (!validateProductionStages()) {
      setFormError("Todos os itens do contrato devem ter pelo menos uma etapa de produção com nome.");
      return;
    }

    try {
      setLoading(true);
      const base = String(API_URL || '').replace(/\/$/, '');

      // Preparar payload
      const payload = {
        contratoId: selectedContrato.id,
        unidadeId: actualUnidadeId,
        nome: `Lote ${selectedContrato.titulo || selectedContrato.nomeContrato || ''} - ${new Date().toLocaleDateString()}`,
        itens: (selectedContrato.itens || []).map(item => ({
          itemId: item.id,
          nome: item.nome,
          quantidade: item.quantidade,
          unidadeMedida: item.unidadeMedida,
          precoUnitario: item.precoUnitario,
          etapasProducao: (produtionStages[item.id] || []).map(stage => ({
            nome: stage.nome,
            descricao: stage.descricao || null,
            duracao: stage.duracao ? parseInt(stage.duracao, 10) : null
          }))
        }))
      };

      const res = await fetchWithAuth(`${base}/lotes`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.erro || `Erro ao criar lote (${res.status})`);
      }

      const json = await res.json();
      toast.success('Lote criado com sucesso!');
      if (typeof onCreated === 'function') {
        onCreated(json);
      }
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      setFormError(err.message || 'Erro ao criar lote.');
    } finally {
      setLoading(false);
    }
  }

  // --- JSX render ---
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("w-3/4 max-w-3xl max-h-[90vh] overflow-y-auto")}>
        <DialogHeader>
          <DialogTitle>Gerar Novo Lote</DialogTitle>
          <DialogDescription>
            Selecione um contrato e configure as etapas de produção para gerar um novo lote.
          </DialogDescription>
        </DialogHeader>

        {formError && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
            {formError}
          </div>
        )}

        {step === 0 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="loja">Gerar lote para *</Label>
              {loading ? (
                <div className="p-2 text-sm text-muted-foreground">Carregando contratos...</div>
              ) : contratos && Array.isArray(contratos) && contratos.length > 0 ? (
                <Select value={selectedContratoId} onValueChange={handleSelectContrato}>
                  <SelectTrigger id="loja">
                    <SelectValue placeholder="Selecione uma loja/contrato..." />
                  </SelectTrigger>
                  <SelectContent>
                    {contratos.map((c, idx) => {
                      console.log(`[AddLoteModal] Renderizando contrato ${idx}:`, c);
                      return (
                        <SelectItem key={String(c.id)} value={String(c.id)}>
                          {c.titulo || c.nomeContrato || `Contrato ${c.id}`}
                          {c.unidade?.nome && ` - ${c.unidade.nome}`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 text-sm text-red-600">Nenhum contrato disponível para esta fazenda.</div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button
                onClick={() => setStep(1)}
                disabled={!selectedContratoId || !selectedContrato || loading}
              >
                Próximo
              </Button>
            </div>
          </div>
        )}

        {step === 1 && selectedContrato && (
          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Informações do Contrato</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">ID:</span>
                  <p className="font-medium">{selectedContrato.id}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Título:</span>
                  <p className="font-medium">{selectedContrato.titulo || selectedContrato.nomeContrato || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Loja:</span>
                  <p className="font-medium">{selectedContrato.unidade?.nome || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <p className="font-medium">{selectedContrato.status || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Início:</span>
                  <p className="font-medium">{selectedContrato.dataInicio ? new Date(selectedContrato.dataInicio).toLocaleDateString('pt-BR') : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Fim:</span>
                  <p className="font-medium">{selectedContrato.dataFim ? new Date(selectedContrato.dataFim).toLocaleDateString('pt-BR') : 'N/A'}</p>
                </div>
              </div>
            </Card>

            <div>
              <h3 className="font-semibold mb-3">Itens do Contrato ({(selectedContrato.itens || []).length} itens)</h3>
              <div className="space-y-2">
                {(selectedContrato.itens || []).length > 0 ? (
                  (selectedContrato.itens || []).map(item => (
                    <Card key={String(item.id)} className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{item.nome}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantidade} {item.unidadeMedida} • R$ {parseFloat(item.precoUnitario || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="p-3 text-sm text-muted-foreground bg-muted rounded">Nenhum item disponível</div>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Leia as informações e confirme se você quer gerar um lote para esse contrato.
            </p>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStep(0)}>Voltar</Button>
              <Button onClick={handleConfirmContrato}>Confirmar e Prosseguir</Button>
            </div>
          </div>
        )}

        {step === 2 && selectedContrato && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Adicione as Etapas de Produção para Cada Item</h3>
              <div className="space-y-6">
                {(selectedContrato.itens || []).map(item => (
                  <Card key={item.id} className="p-4 border">
                    <h4 className="font-medium mb-3">{item.nome}</h4>
                    <div className="space-y-3 mb-3">
                      {(produtionStages[item.id] || []).map((stage, idx) => (
                        <Card key={stage.id} className="p-3 bg-muted">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex-1 space-y-2">
                                <div>
                                  <Label className="text-xs">Nome da Etapa *</Label>
                                  <Input
                                    value={stage.nome}
                                    onChange={(e) => updateProductionStage(item.id, stage.id, 'nome', e.target.value)}
                                    placeholder="Ex: Plantio, Crescimento, Colheita"
                                    className="text-sm"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Descrição (Opcional)</Label>
                                  <Textarea
                                    value={stage.descricao || ''}
                                    onChange={(e) => updateProductionStage(item.id, stage.id, 'descricao', e.target.value)}
                                    placeholder="Descreva esta etapa..."
                                    className="text-sm min-h-[60px]"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Duração em Dias (Opcional)</Label>
                                  <Input
                                    type="number"
                                    value={stage.duracao || ''}
                                    onChange={(e) => updateProductionStage(item.id, stage.id, 'duracao', e.target.value)}
                                    placeholder="Ex: 30"
                                    className="text-sm"
                                  />
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeProductionStage(item.id, stage.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addProductionStage(item.id)}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Etapa
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>Voltar</Button>
              <Button
                onClick={handleCreateLote}
                disabled={loading || !validateProductionStages()}
              >
                {loading ? 'Criando...' : 'Criar Lote'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
