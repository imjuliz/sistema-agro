"use client"
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Plus, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/lib/api';

export default function LotesPage() {
  const { fetchWithAuth } = useAuth();
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showProducaoModal, setShowProducaoModal] = useState(false);
  const [showAtvdAnimaliaModal, setShowAtvdAnimaliaModal] = useState(false);
  const [showAtvdPlantioModal, setShowAtvdPlantioModal] = useState(false);

  // Form states
  const [createForm, setCreateForm] = useState({ nome: '', unidadeId: '', dataEnvio: '' });
  const [producaoForm, setProducaoForm] = useState({ tipoProduto: '', quantidadeBruta: '', unidadeMedida: '', dataColheita: '' });
  const [animaliaForm, setAnimaliaForm] = useState({ animalId: '', descricao: '', dataInicio: '', dataFim: '' });
  const [plantioForm, setPlantioForm] = useState({ categoria: '', areaHectares: '', dataPlantio: '' });

  useEffect(() => {
    fetchLotes();
  }, []);

  async function fetchLotes() {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${API_URL}lotes`, { method: 'GET', credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const lotesArray = Array.isArray(data) ? data : (data?.lotes ? (Array.isArray(data.lotes) ? data.lotes : []) : []);
        setLotes(lotesArray);
      } else {
        console.error('Erro ao buscar lotes:', res.status);
        setLotes([]);
      }
    } catch (err) {
      console.error('Erro ao buscar lotes:', err);
      setLotes([]);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return '—';
    }
  };

  const filteredLotes = Array.isArray(lotes) ? lotes.filter(l =>
    (l.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     String(l.contratoId).includes(searchTerm))
  ) : [];

  function openDetail(lote) {
    setSelected(lote);
  }

  // Handle form submissions
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchWithAuth(`${API_URL}lotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
        credentials: 'include'
      });
      if (res.ok) {
        setShowCreate(false);
        setCreateForm({ nome: '', unidadeId: '', dataEnvio: '' });
        await fetchLotes();
      }
    } catch (err) {
      console.error('Erro ao criar lote:', err);
    }
  };

  const handleProducaoSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    try {
      const res = await fetchWithAuth(`${API_URL}lotes/${selected.id}/producao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producaoForm),
        credentials: 'include'
      });
      if (res.ok) {
        setShowProducaoModal(false);
        setProducaoForm({ tipoProduto: '', quantidadeBruta: '', unidadeMedida: '', dataColheita: '' });
        await fetchLotes();
      }
    } catch (err) {
      console.error('Erro ao registrar produção:', err);
    }
  };

  const handleAnimaliaSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    try {
      const res = await fetchWithAuth(`${API_URL}lotes/${selected.id}/atividade-animal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(animaliaForm),
        credentials: 'include'
      });
      if (res.ok) {
        setShowAtvdAnimaliaModal(false);
        setAnimaliaForm({ animalId: '', descricao: '', dataInicio: '', dataFim: '' });
        await fetchLotes();
      }
    } catch (err) {
      console.error('Erro ao registrar atividade animal:', err);
    }
  };

  const handlePlantioSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    try {
      const res = await fetchWithAuth(`${API_URL}lotes/${selected.id}/atividade-plantio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plantioForm),
        credentials: 'include'
      });
      if (res.ok) {
        setShowAtvdPlantioModal(false);
        setPlantioForm({ categoria: '', areaHectares: '', dataPlantio: '' });
        await fetchLotes();
      }
    } catch (err) {
      console.error('Erro ao registrar atividade plantio:', err);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Lotes</h1>
          <p className="text-sm text-muted-foreground">Gerencie lotes gerados a partir de contratos, produções e atividades.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Criar Lote
        </Button>
      </header>

      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar por nome ou contrato..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <main className="grid grid-cols-3 gap-6">
        {/* Left: lista */}
        <section className="col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Lotes ({filteredLotes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && <p className="text-muted-foreground">Carregando...</p>}
              {!loading && filteredLotes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum lote encontrado</p>
                </div>
              )}
              <div className="space-y-3">
                {filteredLotes.map((l, idx) => (
                  <div
                    key={`${l.id}-${idx}`}
                    className="border p-4 rounded hover:bg-accent cursor-pointer transition"
                    onClick={() => openDetail(l)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{l.nome || 'Lote sem nome'}</div>
                        <div className="text-sm text-muted-foreground">
                          Envio: {formatDate(l.dataEnvioReferencia)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Contrato: {l.contratoId ?? '—'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">
                          Status: <strong>{l.statusQualidade ?? '—'}</strong>
                        </div>
                        <div className="text-sm">
                          Itens: {Array.isArray(l.itensEsperados) ? l.itensEsperados.length : 0}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Right: detalhe do lote */}
        <aside>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detalhes do Lote</CardTitle>
            </CardHeader>
            <CardContent>
              {selected ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">{selected.nome}</h3>
                    <div className="text-sm text-muted-foreground">Unidade: {selected.unidadeId}</div>
                    <div className="text-sm text-muted-foreground">
                      Envio: {formatDate(selected.dataEnvioReferencia)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Ações rápidas</h4>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowProducaoModal(true)}
                      >
                        Registrar Produção
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowAtvdAnimaliaModal(true)}
                      >
                        Registrar Atvd. Animal
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowAtvdPlantioModal(true)}
                      >
                        Registrar Atvd. Plantio
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Itens esperados</h4>
                    {(selected.itensEsperados || []).length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nenhum item esperado</p>
                    ) : (
                      <div className="mt-2 space-y-2 max-h-44 overflow-auto">
                        {(selected.itensEsperados || []).map((it, idx) => (
                          <div
                            key={`${it.contratoItemId || it.nome}-${idx}`}
                            className="border rounded p-2 text-sm"
                          >
                            <div className="font-medium">{it.nome}</div>
                            <div className="text-xs text-muted-foreground">
                              Planejado: {it.quantidadePlanejada} {it.unidadeMedida}
                            </div>
                            <div className="text-xs">
                              Ajustado: {it.quantidadeAjustada ?? '—'}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">
                  Selecione um lote à esquerda para ver detalhes
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </main>

      {/* Modal: Criar Lote */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Lote</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={createForm.nome}
                onChange={(e) => setCreateForm({ ...createForm, nome: e.target.value })}
                placeholder="Nome do lote"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="unidadeId">Unidade</Label>
                <Input
                  id="unidadeId"
                  type="number"
                  value={createForm.unidadeId}
                  onChange={(e) => setCreateForm({ ...createForm, unidadeId: e.target.value })}
                  placeholder="ID da unidade"
                  required
                />
              </div>
              <div>
                <Label htmlFor="dataEnvio">Data Envio</Label>
                <Input
                  id="dataEnvio"
                  type="date"
                  value={createForm.dataEnvio}
                  onChange={(e) => setCreateForm({ ...createForm, dataEnvio: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>
                Cancelar
              </Button>
              <Button type="submit">Criar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Registrar Produção */}
      <Dialog open={showProducaoModal} onOpenChange={setShowProducaoModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Produção - {selected?.nome}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleProducaoSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipoProduto">Tipo Produto</Label>
                <Input
                  id="tipoProduto"
                  value={producaoForm.tipoProduto}
                  onChange={(e) => setProducaoForm({ ...producaoForm, tipoProduto: e.target.value })}
                  placeholder="Tipo produto"
                />
              </div>
              <div>
                <Label htmlFor="quantidadeBruta">Quantidade Bruta</Label>
                <Input
                  id="quantidadeBruta"
                  type="number"
                  step="0.001"
                  value={producaoForm.quantidadeBruta}
                  onChange={(e) => setProducaoForm({ ...producaoForm, quantidadeBruta: e.target.value })}
                  placeholder="Quantidade"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="unidadeMedida">Unidade Medida</Label>
                <Input
                  id="unidadeMedida"
                  value={producaoForm.unidadeMedida}
                  onChange={(e) => setProducaoForm({ ...producaoForm, unidadeMedida: e.target.value })}
                  placeholder="Unidade"
                />
              </div>
              <div>
                <Label htmlFor="dataColheita">Data Colheita</Label>
                <Input
                  id="dataColheita"
                  type="date"
                  value={producaoForm.dataColheita}
                  onChange={(e) => setProducaoForm({ ...producaoForm, dataColheita: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowProducaoModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Produção</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Registrar Atividade Animal */}
      <Dialog open={showAtvdAnimaliaModal} onOpenChange={setShowAtvdAnimaliaModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Atividade Animal - {selected?.nome}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAnimaliaSubmit} className="space-y-4">
            <div>
              <Label htmlFor="animalId">Animal (ID)</Label>
              <Input
                id="animalId"
                value={animaliaForm.animalId}
                onChange={(e) => setAnimaliaForm({ ...animaliaForm, animalId: e.target.value })}
                placeholder="ID do animal"
              />
            </div>
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={animaliaForm.descricao}
                onChange={(e) => setAnimaliaForm({ ...animaliaForm, descricao: e.target.value })}
                placeholder="Descrição da atividade"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataInicio">Data Início</Label>
                <Input
                  id="dataInicio"
                  type="datetime-local"
                  value={animaliaForm.dataInicio}
                  onChange={(e) => setAnimaliaForm({ ...animaliaForm, dataInicio: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dataFim">Data Fim (opcional)</Label>
                <Input
                  id="dataFim"
                  type="datetime-local"
                  value={animaliaForm.dataFim}
                  onChange={(e) => setAnimaliaForm({ ...animaliaForm, dataFim: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowAtvdAnimaliaModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Atividade</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Registrar Atividade Plantio */}
      <Dialog open={showAtvdPlantioModal} onOpenChange={setShowAtvdPlantioModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Atividade Plantio - {selected?.nome}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePlantioSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="categoria">Categoria</Label>
                <Input
                  id="categoria"
                  value={plantioForm.categoria}
                  onChange={(e) => setPlantioForm({ ...plantioForm, categoria: e.target.value })}
                  placeholder="Categoria"
                />
              </div>
              <div>
                <Label htmlFor="areaHectares">Área (ha)</Label>
                <Input
                  id="areaHectares"
                  type="number"
                  step="0.01"
                  value={plantioForm.areaHectares}
                  onChange={(e) => setPlantioForm({ ...plantioForm, areaHectares: e.target.value })}
                  placeholder="Área em hectares"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="dataPlantio">Data Plantio</Label>
              <Input
                id="dataPlantio"
                type="date"
                value={plantioForm.dataPlantio}
                onChange={(e) => setPlantioForm({ ...plantioForm, dataPlantio: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowAtvdPlantioModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Atividade</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
