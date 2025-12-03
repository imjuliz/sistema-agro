"use client"
import React, { useEffect, useState } from 'react';
import {
  Input,
  } from '@/components/ui/input';
  import {
  Button,
  } from '@/components/ui/button';
  import {
    Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  } from '@/components/ui/dialog';
  import {Label,
  } from '@/components/ui/label';
  import {Textarea,
  } from '@/components/ui/textarea';
  import {Card,
  CardContent,
  CardHeader,
  CardTitle,
  } from '@/components/ui/card';
  import {Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  } from '@/components/ui/table';
  import {Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  } from '@/components/ui/select';
  import {Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Plus, MoreVertical, Package, TrendingDown, DollarSign, History, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/lib/api';

export default function ProducoesPage() {
  const { fetchWithAuth } = useAuth();
  const [producoes, setProducoes] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'

  // Form state
  const [form, setForm] = useState({
    loteId: '',
    produtoId: '',
    tipoProduto: '',
    quantidadeBruta: '',
    quantidadeLiquida: '',
    unidadeMedida: 'kg',
    dataColheita: '',
    responsavelId: '',
    observacoes: '',
    custoMao: '',
    custoInsumos: '',
    custoEquipamento: '',
  });

  const [searchProduto, setSearchProduto] = useState('');

  useEffect(() => {
    fetchProducoes();
    fetchLotes();
    fetchProdutos();
    fetchUsuarios();
  }, []);

  async function fetchProducoes() {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${API_URL}producoes`, { method: 'GET', credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const producoesArray = Array.isArray(data) ? data : (data?.producoes ? (Array.isArray(data.producoes) ? data.producoes : []) : []);
        setProducoes(producoesArray);
      } else {
        setProducoes([]);
      }
    } catch (err) {
      console.error('Erro ao buscar produções:', err);
      setProducoes([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchLotes() {
    try {
      const res = await fetchWithAuth(`${API_URL}lotes`, { method: 'GET', credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const lotesArray = Array.isArray(data) ? data : (data?.lotes ? (Array.isArray(data.lotes) ? data.lotes : []) : []);
        setLotes(lotesArray);
      }
    } catch (err) {
      console.error('Erro ao buscar lotes:', err);
    }
  }

  async function fetchProdutos() {
    try {
      const res = await fetchWithAuth(`${API_URL}produtos`, { method: 'GET', credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const produtosArray = Array.isArray(data) ? data : (data?.produtos ? (Array.isArray(data.produtos) ? data.produtos : []) : []);
        setProdutos(produtosArray);
      }
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
    }
  }

  async function fetchUsuarios() {
    try {
      const res = await fetchWithAuth(`${API_URL}usuarios`, { method: 'GET', credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const usuariosArray = Array.isArray(data) ? data : (data?.usuarios ? (Array.isArray(data.usuarios) ? data.usuarios : []) : []);
        setUsuarios(usuariosArray);
      }
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
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

  const formatCurrency = (value) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const filteredProducoes = Array.isArray(producoes)
    ? producoes.filter((p) =>
        String(p.id).includes(searchTerm) ||
        (p.lote?.nome?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.tipoProduto?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.responsavel?.nome?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  const filteredProdutos = produtos.filter((p) =>
    p.nome?.toLowerCase().includes(searchProduto.toLowerCase())
  );

  function openForm(mode, producao = null) {
    setFormMode(mode);
    if (mode === 'edit' && producao) {
      setForm({
        loteId: producao.loteId || '',
        produtoId: producao.produtoId || '',
        tipoProduto: producao.tipoProduto || '',
        quantidadeBruta: producao.quantidadeBruta || '',
        quantidadeLiquida: producao.quantidadeLiquida || '',
        unidadeMedida: producao.unidadeMedida || 'kg',
        dataColheita: producao.dataColheita?.split('T')[0] || '',
        responsavelId: producao.responsavelId || '',
        observacoes: producao.observacoes || '',
        custoMao: producao.custoMao || '',
        custoInsumos: producao.custoInsumos || '',
        custoEquipamento: producao.custoEquipamento || '',
      });
      setSelected(producao);
    } else {
      setForm({
        loteId: '',
        produtoId: '',
        tipoProduto: '',
        quantidadeBruta: '',
        quantidadeLiquida: '',
        unidadeMedida: 'kg',
        dataColheita: '',
        responsavelId: '',
        observacoes: '',
        custoMao: '',
        custoInsumos: '',
        custoEquipamento: '',
      });
      setSelected(null);
    }
    setShowForm(true);
  }

  const handleSaveDraft = async () => {
    try {
      const endpoint = selected ? `${API_URL}producoes/${selected.id}` : `${API_URL}producoes`;
      const method = selected ? 'PUT' : 'POST';

      const res = await fetchWithAuth(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status: 'rascunho' }),
        credentials: 'include',
      });

      if (res.ok) {
        await fetchProducoes();
        setShowForm(false);
        setForm({
          loteId: '',
          produtoId: '',
          tipoProduto: '',
          quantidadeBruta: '',
          quantidadeLiquida: '',
          unidadeMedida: 'kg',
          dataColheita: '',
          responsavelId: '',
          observacoes: '',
          custoMao: '',
          custoInsumos: '',
          custoEquipamento: '',
        });
      } else {
        alert('Erro ao salvar rascunho');
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao salvar rascunho');
    }
  };

  const handleFinalizarProducao = async () => {
    try {
      const endpoint = selected ? `${API_URL}producoes/${selected.id}` : `${API_URL}producoes`;
      const method = selected ? 'PUT' : 'POST';

      const res = await fetchWithAuth(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status: 'finalizado' }),
        credentials: 'include',
      });

      if (res.ok) {
        // Gerar estoque automaticamente
        const producaoData = await res.json();
        await gerarEstoque(producaoData.id);
        await fetchProducoes();
        setShowForm(false);
      } else {
        alert('Erro ao finalizar produção');
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao finalizar produção');
    }
  };

  const gerarEstoque = async (producaoId) => {
    try {
      await fetchWithAuth(`${API_URL}producoes/${producaoId}/gerar-estoque`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Erro ao gerar estoque:', err);
    }
  };

  const linkarPedido = async (producaoId) => {
    const pedidoId = prompt('Digite o ID do pedido:');
    if (!pedidoId) return;

    try {
      const res = await fetchWithAuth(`${API_URL}producoes/${producaoId}/linkar-pedido`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedidoId: Number(pedidoId) }),
        credentials: 'include',
      });

      if (res.ok) {
        alert('Pedido linkado com sucesso!');
        await fetchProducoes();
      } else {
        alert('Erro ao linkar pedido');
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao linkar pedido');
    }
  };

  const finalizarProducao = async (producaoId) => {
    try {
      const res = await fetchWithAuth(`${API_URL}producoes/${producaoId}/finalizar`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        alert('Produção finalizada com sucesso!');
        await fetchProducoes();
      } else {
        alert('Erro ao finalizar produção');
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao finalizar produção');
    }
  };

  const calcularPerda = (bruta, liquida) => {
    if (!bruta || !liquida) return 0;
    return ((bruta - liquida) / bruta * 100).toFixed(2);
  };

  const calcularCustoUnitario = (custoTotal, quantidade) => {
    if (!custoTotal || !quantidade) return 0;
    return (custoTotal / quantidade).toFixed(2);
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Produções</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie produções, registre perdas, custos e gere estoques.
          </p>
        </div>
        <Button onClick={() => openForm('create')} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Produção
        </Button>
      </header>

      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar por ID, lote, produto ou responsável..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Main Content */}
      <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Table */}
        <section className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Produções ({filteredProducoes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && <p className="text-muted-foreground">Carregando...</p>}
              {!loading && filteredProducoes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma produção encontrada</p>
                </div>
              )}
              {!loading && filteredProducoes.length > 0 && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Lote</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Qtd Bruta</TableHead>
                        <TableHead>Qtd Líquida</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data Colheita</TableHead>
                        <TableHead>Responsável</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducoes.map((p, idx) => (
                        <TableRow key={`${p.id}-${idx}`}>
                          <TableCell className="font-medium">{p.id}</TableCell>
                          <TableCell>{p.lote?.nome || '—'}</TableCell>
                          <TableCell>{p.tipoProduto || '—'}</TableCell>
                          <TableCell>{p.quantidadeBruta} {p.unidadeMedida}</TableCell>
                          <TableCell>{p.quantidadeLiquida || '—'} {p.unidadeMedida}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                p.status === 'finalizado'
                                  ? 'bg-green-100 text-green-800'
                                  : p.status === 'em_processo'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {p.status === 'finalizado' ? 'Finalizado' : p.status === 'em_processo' ? 'Em Processo' : 'Rascunho'}
                            </span>
                          </TableCell>
                          <TableCell>{formatDate(p.dataColheita)}</TableCell>
                          <TableCell>{p.responsavel?.nome || '—'}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                  setSelected(p);
                                  setShowDetail(true);
                                }}>
                                  Ver Detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openForm('edit', p)}>
                                  Editar
                                </DropdownMenuItem>
                                {p.status !== 'finalizado' && (
                                  <DropdownMenuItem onClick={() => finalizarProducao(p.id)}>
                                    Finalizar Produção
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => gerarEstoque(p.id)}>
                                  Gerar Estoque
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => linkarPedido(p.id)}>
                                  Linkar ao Pedido
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Right: Summary Stats */}
        <aside className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total de Produções</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{filteredProducoes.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {filteredProducoes.filter((p) => p.status === 'finalizado').length} finalizadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Perda Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredProducoes.length > 0 ? (
                <div className="text-3xl font-bold">
                  {(
                    filteredProducoes.reduce(
                      (sum, p) => sum + parseFloat(calcularPerda(p.quantidadeBruta, p.quantidadeLiquida) || 0),
                      0
                    ) / filteredProducoes.length
                  ).toFixed(2)}
                  %
                </div>
              ) : (
                <div className="text-3xl font-bold">—</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Custo Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatCurrency(
                  filteredProducoes.reduce(
                    (sum, p) => sum + ((p.custoMao || 0) + (p.custoInsumos || 0) + (p.custoEquipamento || 0)),
                    0
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </aside>
      </main>

      {/* Form Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create' ? 'Nova Produção' : 'Editar Produção'}
            </DialogTitle>
          </DialogHeader>

          <form className="space-y-6">
            {/* Lote Selection */}
            <div>
              <Label htmlFor="lote">Lote</Label>
              <Select value={form.loteId} onValueChange={(val) => setForm({ ...form, loteId: val })}>
                <SelectTrigger id="lote">
                  <SelectValue placeholder="Selecione um lote" />
                </SelectTrigger>
                <SelectContent>
                  {lotes.map((lote) => (
                    <SelectItem key={lote.id} value={String(lote.id)}>
                      {lote.nome} (ID: {lote.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Produto Selection with Autocomplete */}
            <div className="relative">
              <Label htmlFor="produto">Produto (Autocomplete)</Label>
              <Input
                id="produto"
                placeholder="Buscar produto..."
                value={searchProduto}
                onChange={(e) => setSearchProduto(e.target.value)}
                className="mb-2"
              />
              {searchProduto && filteredProdutos.length > 0 && (
                <div className="border rounded p-2 max-h-40 overflow-y-auto bg-background z-10">
                  {filteredProdutos.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-2 hover:bg-accent cursor-pointer text-sm"
                      onClick={() => {
                        setForm({ ...form, produtoId: prod.id, tipoProduto: prod.nome });
                        setSearchProduto('');
                      }}
                    >
                      {prod.nome}
                    </div>
                  ))}
                </div>
              )}
              {form.tipoProduto && (
                <p className="text-sm text-muted-foreground mt-1">Selecionado: {form.tipoProduto}</p>
              )}
            </div>

            {/* Tipo Produto Manual */}
            <div>
              <Label htmlFor="tipoProduto">Tipo Produto (Manual)</Label>
              <Input
                id="tipoProduto"
                value={form.tipoProduto}
                onChange={(e) => setForm({ ...form, tipoProduto: e.target.value })}
                placeholder="Tipo de produto (se não usar autocomplete)"
              />
            </div>

            {/* Quantities */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="quantidadeBruta">Quantidade Bruta</Label>
                <Input
                  id="quantidadeBruta"
                  type="number"
                  step="0.001"
                  value={form.quantidadeBruta}
                  onChange={(e) => setForm({ ...form, quantidadeBruta: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="quantidadeLiquida">Quantidade Líquida</Label>
                <Input
                  id="quantidadeLiquida"
                  type="number"
                  step="0.001"
                  value={form.quantidadeLiquida}
                  onChange={(e) => setForm({ ...form, quantidadeLiquida: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="unidadeMedida">Unidade</Label>
                <Select value={form.unidadeMedida} onValueChange={(val) => setForm({ ...form, unidadeMedida: val })}>
                  <SelectTrigger id="unidadeMedida">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="t">t</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="un">un</SelectItem>
                    <SelectItem value="cx">caixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates and Responsible */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataColheita">Data Colheita</Label>
                <Input
                  id="dataColheita"
                  type="date"
                  value={form.dataColheita}
                  onChange={(e) => setForm({ ...form, dataColheita: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="responsavel">Responsável</Label>
                <Select value={form.responsavelId} onValueChange={(val) => setForm({ ...form, responsavelId: val })}>
                  <SelectTrigger id="responsavel">
                    <SelectValue placeholder="Selecione responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    {usuarios.map((user) => (
                      <SelectItem key={user.id} value={String(user.id)}>
                        {user.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Costs */}
            <div>
              <h3 className="font-semibold mb-3">Custos</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="custoMao">Custo Mão de Obra (R$)</Label>
                  <Input
                    id="custoMao"
                    type="number"
                    step="0.01"
                    value={form.custoMao}
                    onChange={(e) => setForm({ ...form, custoMao: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="custoInsumos">Custo Insumos (R$)</Label>
                  <Input
                    id="custoInsumos"
                    type="number"
                    step="0.01"
                    value={form.custoInsumos}
                    onChange={(e) => setForm({ ...form, custoInsumos: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="custoEquipamento">Custo Equipamento (R$)</Label>
                  <Input
                    id="custoEquipamento"
                    type="number"
                    step="0.01"
                    value={form.custoEquipamento}
                    onChange={(e) => setForm({ ...form, custoEquipamento: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Observations */}
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={form.observacoes}
                onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
                placeholder="Notas adicionais sobre a produção..."
                className="h-20"
              />
            </div>
          </form>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button variant="secondary" onClick={handleSaveDraft}>
              Salvar Rascunho
            </Button>
            <Button onClick={handleFinalizarProducao}>
              Finalizar e Gerar Estoque
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      {selected && (
        <Dialog open={showDetail} onOpenChange={setShowDetail}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes da Produção - ID {selected.id}</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="perdas">Perdas</TabsTrigger>
                <TabsTrigger value="custos">Custos</TabsTrigger>
                <TabsTrigger value="historico">Histórico</TabsTrigger>
              </TabsList>

              {/* Info Tab */}
              <TabsContent value="info" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Lote</p>
                    <p className="font-semibold">{selected.lote?.nome || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Produto</p>
                    <p className="font-semibold">{selected.tipoProduto || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data Colheita</p>
                    <p className="font-semibold">{formatDate(selected.dataColheita)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Responsável</p>
                    <p className="font-semibold">{selected.responsavel?.nome || '—'}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Observações</p>
                  <p className="text-sm">{selected.observacoes || 'Nenhuma observação'}</p>
                </div>
              </TabsContent>

              {/* Perdas Tab */}
              <TabsContent value="perdas" className="space-y-4 mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span>Quantidade Bruta</span>
                        <span className="font-semibold">{selected.quantidadeBruta} {selected.unidadeMedida}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span>Quantidade Líquida</span>
                        <span className="font-semibold">{selected.quantidadeLiquida || '—'} {selected.unidadeMedida}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4" />
                          Perda Percentual
                        </span>
                        <span className="font-semibold text-red-600">
                          {calcularPerda(selected.quantidadeBruta, selected.quantidadeLiquida)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span>Quantidade Perdida</span>
                        <span className="font-semibold">
                          {(selected.quantidadeBruta - (selected.quantidadeLiquida || 0)).toFixed(3)} {selected.unidadeMedida}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Custos Tab */}
              <TabsContent value="custos" className="space-y-4 mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span>Custo Mão de Obra</span>
                        <span className="font-semibold">{formatCurrency(selected.custoMao)}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span>Custo Insumos</span>
                        <span className="font-semibold">{formatCurrency(selected.custoInsumos)}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span>Custo Equipamento</span>
                        <span className="font-semibold">{formatCurrency(selected.custoEquipamento)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 bg-muted p-2 rounded">
                        <span className="flex items-center gap-2 font-semibold">
                          <DollarSign className="h-4 w-4" />
                          Custo Total
                        </span>
                        <span className="font-bold text-lg">
                          {formatCurrency(
                            (selected.custoMao || 0) + (selected.custoInsumos || 0) + (selected.custoEquipamento || 0)
                          )}
                        </span>
                      </div>
                      {selected.quantidadeLiquida && (
                        <div className="flex justify-between items-center pt-2 bg-primary text-primary-foreground p-2 rounded">
                          <span className="font-semibold">Custo Unitário</span>
                          <span className="font-bold text-lg">
                            {formatCurrency(
                              calcularCustoUnitario(
                                (selected.custoMao || 0) + (selected.custoInsumos || 0) + (selected.custoEquipamento || 0),
                                selected.quantidadeLiquida
                              )
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Histórico Tab */}
              <TabsContent value="historico" className="space-y-4 mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 pb-3 border-b">
                        <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-semibold">Criada em</p>
                          <p className="text-sm text-muted-foreground">
                            {selected.createdAt ? formatDate(selected.createdAt) : '—'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 pb-3 border-b">
                        <History className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-semibold">Última edição</p>
                          <p className="text-sm text-muted-foreground">
                            {selected.updatedAt ? formatDate(selected.updatedAt) : '—'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-semibold">Status</p>
                          <p className="text-sm text-muted-foreground capitalize">{selected.status || '—'}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
