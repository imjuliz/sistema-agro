'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// shadcn/ui components - ajuste caminhos se seu projeto organiza diferente
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// --- Helper: safe decimal calculation (avoid float surprises a bit) ---
function calcLiquida(brutoStr, perdaStr) {
  // accepts strings like "100.5" and "10" (percent)
  if (brutoStr == null || brutoStr === '') return '';
  const b = Number(String(brutoStr).replace(',', '.')) || 0;
  const p = Number(String(perdaStr || '0').replace(',', '.')) || 0;
  const liq = b * (1 - p / 100);
  // show 3 decimals if fractional, else 0
  return Number.isFinite(liq) ? liq.toFixed(3) : '';
}

export default function ProducaoNovaPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // query params: ?loteId=X&origem=plantio&id=Y
  const loteIdFromQuery = searchParams?.get('loteId') ?? '';
  const origemParam = searchParams?.get('origem') ?? ''; // 'plantio' | 'animal'
  const origemIdFromQuery = searchParams?.get('id') ?? '';

  // form state
  const [loteId, setLoteId] = useState(loteIdFromQuery);
  const [origemTipo, setOrigemTipo] = useState(origemParam || ''); // '' | 'plantio' | 'animal'
  const [origemId, setOrigemId] = useState(origemIdFromQuery || '');
  const [tipoProduto, setTipoProduto] = useState('');
  const [produtoId, setProdutoId] = useState(''); // optional product catalog id
  const [quantidadeBruta, setQuantidadeBruta] = useState('');
  const [perdaPercent, setPerdaPercent] = useState('0');
  const [quantidadeLiquida, setQuantidadeLiquida] = useState('');
  const [unidade, setUnidade] = useState('KG');
  const [dataColheita, setDataColheita] = useState('');
  const [responsavelId, setResponsavelId] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [statusSaving, setStatusSaving] = useState(false);

  // UX: when bruto or perda change, recalc liquida (unless user edited liquida manually recently)
  const [liqManualEdited, setLiqManualEdited] = useState(false);

  useEffect(() => {
    if (!liqManualEdited) {
      const val = calcLiquida(quantidadeBruta, perdaPercent);
      setQuantidadeLiquida(val);
    }
  }, [quantidadeBruta, perdaPercent, liqManualEdited]);

  // prefill origin + lote from query (only on mount)
  useEffect(() => {
    if (loteIdFromQuery) setLoteId(loteIdFromQuery);
    if (origemParam) setOrigemTipo(origemParam);
    if (origemIdFromQuery) setOrigemId(origemIdFromQuery);
  }, [loteIdFromQuery, origemParam, origemIdFromQuery]);

  // basic validation
  function validateForSave(finalize = false) {
    const errors = [];
    if (!loteId) errors.push('Lote é obrigatório.');
    if (!tipoProduto) errors.push('Tipo de produto é obrigatório.');
    if (!quantidadeBruta || Number(quantidadeBruta) <= 0) errors.push('Quantidade bruta deve ser maior que zero.');
    if (!unidade) errors.push('Unidade é obrigatória.');
    if (!dataColheita) errors.push('Data da colheita é obrigatória.');
    if (finalize && !responsavelId) errors.push('Responsável é obrigatório para finalizar.');
    return errors;
  }

  async function submit(payload) {
    // placeholder: call your backend
    // return await fetch('/api/producao', { method: 'POST', body: JSON.stringify(payload) })
    // For demo, simulate delay
    return new Promise((res) => setTimeout(() => res({ ok: true, json: () => ({ id: Math.floor(Math.random() * 10000) }) }), 700));
  }

  async function handleSaveDraft(e) {
    e && e.preventDefault();
    const errors = validateForSave(false);
    if (errors.length) {
      window.alert('Corrija antes de salvar:\n' + errors.join('\n'));
      return;
    }
    setStatusSaving(true);
    try {
      const payload = {
        loteId,
        origemTipo: origemTipo || null,
        origemId: origemId || null,
        tipoProduto,
        produtoId: produtoId || null,
        quantidadeBruta,
        perdaPercent,
        quantidadeLiquida,
        unidade,
        dataColheita,
        responsavelId: responsavelId || null,
        observacoes,
        status: 'RASCUNHO',
      };
      const res = await submit(payload);
      if (res && res.ok) {
        const body = await res.json();
        window.alert('Rascunho salvo (id: ' + (body?.id ?? '—') + ')');
        // optional: redirect to list or detail
        // router.push(`/lotes/${loteId}`);
      } else {
        window.alert('Erro ao salvar rascunho');
      }
    } catch (err) {
      console.error(err);
      window.alert('Erro inesperado ao salvar rascunho');
    } finally {
      setStatusSaving(false);
    }
  }

  async function handleFinalize(e) {
    e && e.preventDefault();
    const errors = validateForSave(true);
    if (errors.length) {
      window.alert('Corrija antes de finalizar:\n' + errors.join('\n'));
      return;
    }

    const confirmMsg = [
      `Você está finalizando a produção:`,
      `${tipoProduto} — bruto: ${quantidadeBruta} ${unidade} — líquido: ${quantidadeLiquida} ${unidade}`,
      `Isto irá gerar movimento de estoque e pode gerar pedido para o contrato associado.`,
      `Deseja continuar?`
    ].join('\n');
    if (!window.confirm(confirmMsg)) return;

    setStatusSaving(true);
    try {
      const payload = {
        loteId,
        origemTipo: origemTipo || null,
        origemId: origemId || null,
        tipoProduto,
        produtoId: produtoId || null,
        quantidadeBruta,
        perdaPercent,
        quantidadeLiquida,
        unidade,
        dataColheita,
        responsavelId,
        observacoes,
        status: 'FINALIZADA',
      };
      const res = await submit(payload);
      if (res && res.ok) {
        const body = await res.json();
        window.alert('Produção finalizada com sucesso (id: ' + (body?.id ?? '—') + ')');
        // navigate to lote detail or production list
        router.push(`/lotes/${loteId}`);
      } else {
        window.alert('Erro ao finalizar produção');
      }
    } catch (err) {
      console.error(err);
      window.alert('Erro inesperado ao finalizar produção');
    } finally {
      setStatusSaving(false);
    }
  }

  // small responsive form layout
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Registrar Produção</h1>
        <p className="text-sm text-muted-foreground">Registre a colheita / produção — vincule ao lote, plantio ou animal e finalize para gerar estoque.</p>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Top cards: Lote & Origem */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Identificação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label>Lote (id)</Label>
                  <Input value={loteId} onChange={(e) => setLoteId(e.target.value)} placeholder="ID do lote (ex: 123)" />
                </div>

                <div>
                  <Label>Origem</Label>
                  <Select value={origemTipo} onValueChange={(v) => { setOrigemTipo(v === '__NONE__' ? '' : v); setOrigemId(''); }}>
                    <SelectTrigger>
                      <SelectValue placeholder={origemTipo || 'Selecione origem (plantio / animal)'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__NONE__">Nenhuma</SelectItem>
                      <SelectItem value="plantio">Plantio</SelectItem>
                      <SelectItem value="animal">Animal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{origemTipo ? (origemTipo === 'plantio' ? 'Plantio (id)' : 'Animal (id)') : 'Origem id'}</Label>
                  <Input value={origemId} onChange={(e) => setOrigemId(e.target.value)} placeholder={origemTipo ? (origemTipo === 'plantio' ? 'ex: 11' : 'ex: 55') : 'opcional'} />
                </div>

                <div>
                  <Label>Responsável (id)</Label>
                  <Input value={responsavelId} onChange={(e) => setResponsavelId(e.target.value)} placeholder="id do usuário responsável" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Dados da Produção</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Tipo de produto</Label>
                  <Input value={tipoProduto} onChange={(e) => setTipoProduto(e.target.value)} placeholder="ex: Tomate in natura" />
                </div>

                <div>
                  <Label>Produto cadastrado (opcional id)</Label>
                  <Input value={produtoId} onChange={(e) => setProdutoId(e.target.value)} placeholder="id do produto (catalogo)" />
                </div>

                <div>
                  <Label>Quantidade Bruta</Label>
                  <Input
                    inputMode="decimal"
                    value={quantidadeBruta}
                    onChange={(e) => { setQuantidadeBruta(e.target.value); setLiqManualEdited(false); }}
                    placeholder="ex: 100.000"
                  />
                </div>

                <div>
                  <Label>Perda (%)</Label>
                  <Input
                    inputMode="decimal"
                    value={perdaPercent}
                    onChange={(e) => { setPerdaPercent(e.target.value); setLiqManualEdited(false); }}
                    placeholder="ex: 10.0"
                  />
                </div>

                <div>
                  <Label>Quantidade Líquida</Label>
                  <Input
                    inputMode="decimal"
                    value={quantidadeLiquida}
                    onChange={(e) => { setQuantidadeLiquida(e.target.value); setLiqManualEdited(true); }}
                    placeholder="calculado automaticamente"
                  />
                </div>

                <div>
                  <Label>Unidade</Label>
                  <Select value={unidade} onValueChange={(v) => setUnidade(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder={unidade} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KG">KG</SelectItem>
                      <SelectItem value="G">G</SelectItem>
                      <SelectItem value="LT">LT</SelectItem>
                      <SelectItem value="UN">UN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Data da colheita</Label>
                  <Input type="datetime-local" value={dataColheita} onChange={(e) => setDataColheita(e.target.value)} />
                </div>

                <div className="md:col-span-2">
                  <Label>Observações</Label>
                  <Textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} placeholder="Perdas, notas, anexos (opcional) ..." />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => { /* reset form */ setTipoProduto(''); setProdutoId(''); setQuantidadeBruta(''); setPerdaPercent('0'); setQuantidadeLiquida(''); setDataColheita(''); setObservacoes(''); setResponsavelId(''); }}>
            Limpar
          </Button>

          <Button onClick={handleSaveDraft} disabled={statusSaving}>
            {statusSaving ? 'Salvando...' : 'Salvar rascunho'}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" onClick={() => {/* preview modal controlled inside DialogContent */}}>Finalizar</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Confirmar Finalização</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Revisar antes de finalizar</div>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <div className="text-xs text-muted-foreground">Produto</div>
                      <div className="font-medium">{tipoProduto || '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Lote</div>
                      <div className="font-medium">{loteId || '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Bruto</div>
                      <div className="font-medium">{quantidadeBruta || '—'} {unidade}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Líquido</div>
                      <div className="font-medium">{quantidadeLiquida || '—'} {unidade}</div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="text-xs text-muted-foreground">Observações</div>
                      <div className="text-sm">{observacoes || '—'}</div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost">Voltar</Button>
                  <Button className="bg-emerald-600" onClick={handleFinalize} disabled={statusSaving}>
                    {statusSaving ? 'Finalizando...' : 'Confirmar e Finalizar'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </form>

      <div className="mt-6">
        <Badge>Observação</Badge>
        <p className="text-sm text-muted-foreground mt-2">
          Salvar rascunho não gera estoque. Finalizar gera movimentação de estoque e pode gerar pedido para o contrato.
        </p>
      </div>
    </div>
  );
}
