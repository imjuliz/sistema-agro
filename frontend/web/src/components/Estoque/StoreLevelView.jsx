import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useInventory } from '@/contexts/InventoryContext';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus } from 'lucide-react'
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog'
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from "@/lib/api";

const UNIDADES_DE_MEDIDA = [
  { value: 'KG', label: 'Quilograma (kg)' },
  { value: 'G', label: 'Grama (g)' },
  { value: 'T', label: 'Tonelada (t)' },
  { value: 'LOTE', label: 'Lote' },
  { value: 'UNIDADE', label: 'Unidade' },
  { value: 'SACA', label: 'Saca' },
  { value: 'CABECA', label: 'Cabeça' },
  { value: 'ARROBA', label: 'Arroba' },
  { value: 'LITRO', label: 'Litro (L)' },
  { value: 'ML', label: 'Mililitro (mL)' },
];

function getStockStatus(current, minimum) {
  const difference = current - minimum;
  if (difference > 5) return { status: 'good', color: 'bg-green-500', textColor: 'text-green-700', badgeVariant: 'default' };
  if (difference >= -5) return { status: 'warning', color: 'bg-yellow-500', textColor: 'text-yellow-700', badgeVariant: 'secondary' };
  return { status: 'critical', color: 'bg-red-500', textColor: 'text-red-700', badgeVariant: 'destructive' };
}

export function StoreLevelView({ onOpenMovimento }) {
  const { getStoreItems, storeMapping, refresh, atualizarMinimumStockRemote, isGerenteMatriz, isGerenteFazenda, isGerenteLoja } = useInventory();
  const { fetchWithAuth } = useAuth();
  
  const [isMinModalOpen, setIsMinModalOpen] = useState(false);
  const [minModalItem, setMinModalItem] = useState(null);
  const [minInputValue, setMinInputValue] = useState('');
  const [isSavingMin, setIsSavingMin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState('all');

  // Estados para o modal de adicionar produto
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [fornecedoresExternos, setFornecedoresExternos] = useState([]);
  const [loadingFornecedores, setLoadingFornecedores] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    sku: '',
    marca: '',
    qntdAtual: '0',
    qntdMin: '0',
    precoUnitario: '',
    validade: '',
    unidadeBase: '',
    fornecedorExternoId: '',
  });


  // paginacao
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // dados
  const allStoreItems = useMemo(() => getStoreItems() || [], [getStoreItems]);
  // stores: transformar map { id: nome } em array [{ id, nome }]
  const stores = useMemo(() => Object.entries(storeMapping || {}).map(([id, nome]) => ({ id: Number(id) || id, nome })), [storeMapping]);

  // Carregar fornecedores externos quando modal abrir
  useEffect(() => {
    if (isAddProductModalOpen && stores.length > 0) {
      const currentStore = stores[0];
      const unidadeId = currentStore?.id;
      
      if (unidadeId) {
        loadFornecedoresExternos(unidadeId);
      }
    }
  }, [isAddProductModalOpen, stores]);

  async function loadFornecedoresExternos(unidadeId) {
    setLoadingFornecedores(true);
    try {
      const url = `${API_URL}listarFornecedoresExternos/${unidadeId}`;
      console.log('[StoreLevelView] Carregando fornecedores de:', url);
      const res = await fetchWithAuth(url);
      
      if (!res.ok) {
        console.error('[StoreLevelView] Erro na resposta:', res.status, res.statusText);
        throw new Error('Erro ao carregar fornecedores');
      }
      
      const data = await res.json();
      console.log('[StoreLevelView] Resposta recebida:', data);
      
      // A resposta pode vir como { sucesso, fornecedores, message }
      let fornecedoresList = [];
      if (data.sucesso && Array.isArray(data.fornecedores)) {
        fornecedoresList = data.fornecedores;
      } else if (Array.isArray(data.fornecedores)) {
        fornecedoresList = data.fornecedores;
      } else if (Array.isArray(data)) {
        fornecedoresList = data;
      }
      
      console.log('[StoreLevelView] Fornecedores carregados:', fornecedoresList);
      setFornecedoresExternos(fornecedoresList);
    } catch (err) {
      console.error('Erro ao carregar fornecedores externos:', err);
      setFornecedoresExternos([]);
    } finally {
      setLoadingFornecedores(false);
    }
  }

  function openAddProductModal() {
    setFormData({
      nome: '',
      sku: '',
      marca: '',
      qntdAtual: '0',
      qntdMin: '0',
      precoUnitario: '',
      validade: '',
      unidadeBase: '',
      fornecedorExternoId: '',
    });
    setIsAddProductModalOpen(true);
  }

  function closeAddProductModal() {
    setIsAddProductModalOpen(false);
  }

  async function submitAddProduct() {
    if (!formData.nome.trim()) {
      alert('Nome do produto é obrigatório');
      return;
    }
    
    if (!formData.unidadeBase) {
      alert('Unidade de medida é obrigatória');
      return;
    }

    setIsSubmittingProduct(true);
    try {
      const currentStore = stores[0];
      const unidadeId = currentStore?.id;
      
      if (!unidadeId) {
        throw new Error('Unidade não identificada');
      }

      const body = {
        nome: formData.nome,
        sku: formData.sku || null,
        marca: formData.marca || null,
        qntdAtual: Number(formData.qntdAtual || 0),
        qntdMin: Number(formData.qntdMin || 0),
        precoUnitario: formData.precoUnitario ? Number(formData.precoUnitario) : null,
        validade: formData.validade || null,
        unidadeBase: formData.unidadeBase,
        fornecedorExternoId: formData.fornecedorExternoId ? Number(formData.fornecedorExternoId) : null,
      };

      const url = `${API_URL}adicionarProdutoEstoque/${unidadeId}`;
      const res = await fetchWithAuth(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        throw new Error(txt || `HTTP ${res.status}`);
      }

      // Sucesso: fechar modal e atualizar tabela
      closeAddProductModal();
      await refresh();
      alert('Produto adicionado ao estoque com sucesso!');
    } catch (err) {
      console.error('Erro ao adicionar produto:', err);
      alert(`Erro: ${err.message || 'Falha ao adicionar produto'}`);
    } finally {
      setIsSubmittingProduct(false);
    }
  }

  // helper para extrair o nome do fornecedor/origem do item (robusto para diferentes formatos)
  const resolveSupplierName = (item) => {
    // alguns formatos (estoqueProdutos): item.store foi definido como supplierName já
    if (!item) return '—';
    // new normalized field from backend
    if (item.fornecedorResolved && item.fornecedorResolved.nome) return item.fornecedorResolved.nome;
    if (item.fornecedorName) return item.fornecedorName;
    // estoqueProdutos novo formato: pode ter fornecedorUnidade / fornecedorExterno
    if (item.fornecedorUnidade && item.fornecedorUnidade.nome) return item.fornecedorUnidade.nome;
    if (item.fornecedorExterno && item.fornecedorExterno.nomeEmpresa) return item.fornecedorExterno.nomeEmpresa;
    // quando vindo de estoqueProdutos no InventoryContext, pode existir produto.origemUnidade ou produto.fornecedor
    if (item.produto && item.produto.origemUnidade && item.produto.origemUnidade.nome) return item.produto.origemUnidade.nome;
    if (item.produto && item.produto.fornecedor && item.produto.fornecedor.nomeEmpresa) return item.produto.fornecedor.nomeEmpresa;
    // fallback para objetos com unidade metadata
    if (item.unidade && item.unidade.nome) return item.unidade.nome;
    // legacy/mock: store contém o nome da unidade atual — tratamos como fallback
    if (item.store) return item.store;
    return '—';
  };

  // filtra os itens com base em busca e fornecedor
  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return allStoreItems.filter(item => {
      const matchesSearch = !term ||
        (item.name && item.name.toLowerCase().includes(term)) ||
        (item.sku && item.sku.toLowerCase().includes(term));
      const supplierName = resolveSupplierName(item);
      const matchesStore = selectedStore === 'all' || supplierName === selectedStore;
      return matchesSearch && matchesStore;
    });
  }, [allStoreItems, searchTerm, selectedStore]);

  // recalcula métricas a partir dos itens filtrados
  const totalItems = filteredItems.length;
  const goodStock = filteredItems.filter(item => getStockStatus(item.currentStock, item.minimumStock).status === 'good').length;
  const warningStock = filteredItems.filter(item => getStockStatus(item.currentStock, item.minimumStock).status === 'warning').length;
  const criticalStock = filteredItems.filter(item => getStockStatus(item.currentStock, item.minimumStock).status === 'critical').length;

  // pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / perPage));
  useEffect(() => {
    // sempre garante que a página atual seja válida quando filtros / perPage mudarem
    setPage(p => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  // resetar página quando filtros mudarem (UX comum)
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedStore, perPage]);

  async function confirmUpdateMinimum() {
    if (!minModalItem) return;
    const epId = minModalItem.rawItemId ?? null;
    const newVal = Number(String(minInputValue || '').trim());
    if (!epId) return;
    if (isNaN(newVal)) {
      // keep it simple: don't use alert, log and keep modal open
      console.warn('Valor inválido para mínimo:', minInputValue);
      return;
    }

    setIsSavingMin(true);
    try {
      const resp = await atualizarMinimumStockRemote(epId, newVal);
      if (!resp || resp.sucesso === false) {
        console.error('Erro ao atualizar mínimo remoto', resp);
        // keep modal open to allow retry
        return;
      }
      // success: refresh inventory and close
      await refresh();
      setIsMinModalOpen(false);
      setMinModalItem(null);
    } catch (err) {
      console.error('Erro confirmUpdateMinimum', err);
    } finally {
      setIsSavingMin(false);
    }
  }

  // items atualmente visíveis na página
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredItems.slice(start, start + perPage);
  }, [filteredItems, page, perPage]);

  // lista de fornecedores para o seletor, extraída dos itens
  const supplierOptions = useMemo(() => {
    const s = new Set();
    allStoreItems.forEach(it => s.add(resolveSupplierName(it)));
    return Array.from(s).filter(x => x && x !== '—').sort();
  }, [allStoreItems]);

  // formatação de preço BRL
  const fmtBRL = (value) =>
    typeof value === 'number'
      ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : value;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Items */}
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border dark:border-white/10 border-black/10 transition p-0 h-fit">
          <CardContent className="p-6 flex flex-col items-start">
            <span className="text-sm text-muted-foreground mb-1">Total de Itens</span>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-semibold tracking-tight">{totalItems}</span>
            </div>
          </CardContent>
        </Card>

        {/* Above Minimum */}
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border dark:border-white/10 border-black/10 transition p-0 h-fit">
          <CardContent className="p-6 flex flex-col items-start">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Acima do Mínimo</span>
            </div>
            <span className="text-3xl font-semibold text-green-500">{goodStock}</span>
          </CardContent>
        </Card>

        {/* Near Minimum */}
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border dark:border-white/10 border-black/10 transition p-0 h-fit">
          <CardContent className="p-6 flex flex-col items-start">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Próximo do Mínimo</span>
            </div>
            <span className="text-3xl font-semibold text-yellow-500">{warningStock}</span>
          </CardContent>
        </Card>

        {/* Below Minimum */}
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border dark:border-white/10 border-black/10 transition p-0 h-fit">
          <CardContent className="p-6 flex flex-col items-start">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Abaixo do Mínimo</span>
            </div>
            <span className="text-3xl font-semibold text-red-500">{criticalStock}</span>
          </CardContent>
        </Card>
      </div>


      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2">Pesquisar Itens</label>
              <Input
                placeholder="Pesquise por nome ou SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2">Fornecedores</label>
              <Select value={selectedStore} onValueChange={(val) => setSelectedStore(val)}>
                <SelectTrigger className={'w-full'}>
                  <SelectValue placeholder="Selecionar fornecedor" />
                </SelectTrigger>
                <SelectContent className={'w-full'}>
                  <SelectItem value="all">Todos os fornecedores</SelectItem>
                  {supplierOptions.map(name => (
                    <SelectItem key={name} value={name} className={'w-full'}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Estoque Atual</TableHead>
                <TableHead>Min Estoque</TableHead>
                <TableHead>Preço unitário</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.map(item => {
                const stockStatus = getStockStatus(item.currentStock, item.minimumStock);
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className={`w-3 h-3 rounded-full ${stockStatus.color}`}></div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="font-medium">{item.name}</div>
                    </TableCell>
                    <TableCell>{resolveSupplierName(item)}</TableCell>
                    <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                    <TableCell>
                      <span className={stockStatus.textColor}>{item.currentStock}</span>
                    </TableCell>
                    <TableCell>{item.minimumStock}</TableCell>
                    <TableCell>{fmtBRL(item.price)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                                  {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
                                  {/* <DropdownMenuSeparator /> */}
                                  <DropdownMenuItem onClick={() => {
                                    const isManager = isGerenteMatriz || isGerenteFazenda || isGerenteLoja;
                                    if (!isManager) {
                                      console.warn('Ação disponível apenas para gerentes.');
                                      return;
                                    }
                                    const epId = item.rawItemId ?? null;
                                    if (!epId) {
                                      console.warn('Esse item não suporta edição remota de mínimo.');
                                      return;
                                    }
                                    setMinModalItem(item);
                                    setMinInputValue(String(item.minimumStock ?? 0));
                                    setIsMinModalOpen(true);
                                  }}>Editar mínimo</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onOpenMovimento(item)}>Registrar movimentação</DropdownMenuItem>
                                  <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                          {/* <DropdownMenuItem>View payment details</DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredItems.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum item encontrado.</p>
            </div>
          )}

          <CardFooter className="flex items-center justify-between px-4 py-3 border-t dark:border-neutral-800 border-neutral-200">
            {/* <div className="text-sm text-neutral-400">
              {selected.length} de {filtered.length} linha(s) selecionada(s).
            </div> */}

            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium">Linhas por pág.</Label>
              <Select value={String(perPage)} onValueChange={(val) => { const v = Number(val); setPerPage(v); setPage(1); }}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm">Pág. {page} de {Math.max(1, Math.ceil(filteredItems.length / perPage) || 1)}</div>

              <div className="inline-flex items-center gap-1 border-l dark:border-neutral-800 border-neutral-200 pl-3">
                <Button variant="ghost" size="sm" onClick={() => setPage(1)} disabled={page === 1} aria-label="Primeira página" >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} aria-label="Página anterior" >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Próxima página">
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="sm" onClick={() => setPage(totalPages)} disabled={page === totalPages} aria-label="Última página">
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardFooter>
        </CardContent>
      </Card>

      {/* Botão para adicionar produto */}
      <div className="flex justify-end">
        <Button onClick={openAddProductModal} className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Produto ao Estoque
        </Button>
      </div>

      {/* Movimentação modal is handled by parent (page) via onOpenMovimento prop */}

      {/* Modal para editar quantidade mínima */}
      <AlertDialog open={isMinModalOpen} onOpenChange={(open) => { if (!open) { setIsMinModalOpen(false); setMinModalItem(null); } else setIsMinModalOpen(open); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar quantidade mínima</AlertDialogTitle>
            <AlertDialogDescription>
              {minModalItem ? `Item: ${minModalItem.name} — Estoque atual: ${minModalItem.currentStock}` : 'Editar quantidade mínima do item.'}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid gap-3 py-2">
            <div>
              <Label>Quantidade mínima</Label>
              <Input value={minInputValue} onChange={(e) => setMinInputValue(e.target.value)} placeholder="Informe a quantidade mínima" />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setIsMinModalOpen(false); setMinModalItem(null); }}>Fechar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmUpdateMinimum} disabled={isSavingMin}>{isSavingMin ? 'Guardando...' : 'Salvar'}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal para adicionar novo produto ao estoque */}
      <AlertDialog open={isAddProductModalOpen} onOpenChange={(open) => { if (!open) closeAddProductModal(); else setIsAddProductModalOpen(open); }}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Adicionar Produto ao Estoque</AlertDialogTitle>
            <AlertDialogDescription>
              Preencha as informações do produto que deseja adicionar ao estoque.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid gap-4 py-4">
            {/* Nome */}
            <div>
              <Label htmlFor="nome">Nome do Produto *</Label>
              <Input
                id="nome"
                placeholder="Ex: Milho em grão"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>

            {/* SKU */}
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                placeholder="Ex: MILHO001"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>

            {/* Marca */}
            <div>
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                placeholder="Ex: Marca XYZ"
                value={formData.marca}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
              />
            </div>

            {/* Quantidade Atual */}
            <div>
              <Label htmlFor="qntdAtual">Quantidade Atual</Label>
              <Input
                id="qntdAtual"
                type="number"
                placeholder="0"
                value={formData.qntdAtual}
                onChange={(e) => setFormData({ ...formData, qntdAtual: e.target.value })}
              />
            </div>

            {/* Quantidade Mínima */}
            <div>
              <Label htmlFor="qntdMin">Quantidade Mínima</Label>
              <Input
                id="qntdMin"
                type="number"
                placeholder="0"
                value={formData.qntdMin}
                onChange={(e) => setFormData({ ...formData, qntdMin: e.target.value })}
              />
            </div>

            {/* Preço Unitário */}
            <div>
              <Label htmlFor="precoUnitario">Preço Unitário (R$)</Label>
              <Input
                id="precoUnitario"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.precoUnitario}
                onChange={(e) => setFormData({ ...formData, precoUnitario: e.target.value })}
              />
            </div>

            {/* Unidade de Medida */}
            <div>
              <Label htmlFor="unidadeBase">Unidade de Medida *</Label>
              <Select value={formData.unidadeBase} onValueChange={(value) => setFormData({ ...formData, unidadeBase: value })}>
                <SelectTrigger id="unidadeBase">
                  <SelectValue placeholder="Selecione uma unidade" />
                </SelectTrigger>
                <SelectContent>
                  {UNIDADES_DE_MEDIDA.map(unidade => (
                    <SelectItem key={unidade.value} value={unidade.value}>
                      {unidade.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fornecedor Externo */}
            <div>
              <Label htmlFor="fornecedorExternoId">Fornecedor Externo</Label>
              {loadingFornecedores ? (
                <div className="w-full h-10 flex items-center text-sm text-muted-foreground">
                  Carregando fornecedores...
                </div>
              ) : (
                <Select 
                  value={formData.fornecedorExternoId} 
                  onValueChange={(value) => setFormData({ ...formData, fornecedorExternoId: value })}
                >
                  <SelectTrigger id="fornecedorExternoId">
                    <SelectValue placeholder="Selecione um fornecedor ou deixe em branco" />
                  </SelectTrigger>
                  <SelectContent>
                    {fornecedoresExternos.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        Nenhum fornecedor disponível
                      </div>
                    ) : (
                      fornecedoresExternos.map(fornecedor => (
                        <SelectItem 
                          key={fornecedor.id} 
                          value={String(fornecedor.id)}
                        >
                          {fornecedor.nomeEmpresa || fornecedor.nome || `ID: ${fornecedor.id}`}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Validade */}
            <div>
              <Label htmlFor="validade">Data de Validade</Label>
              <Input
                id="validade"
                type="date"
                value={formData.validade}
                onChange={(e) => setFormData({ ...formData, validade: e.target.value })}
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeAddProductModal}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={submitAddProduct} disabled={isSubmittingProduct}>
              {isSubmittingProduct ? 'Adicionando...' : 'Adicionar Produto'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}