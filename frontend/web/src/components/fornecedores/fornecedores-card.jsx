"use client"
import React, { useEffect, useMemo, useState } from "react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Expandable, ExpandableCard, ExpandableCardContent, ExpandableCardFooter, ExpandableCardHeader, ExpandableContent, ExpandableTrigger, } from "@/components/ui/expandable"
import { Bluetooth, CircleDot, Tags, ShoppingCart, Star, Users, Battery, Package, Search, Sliders, DownloadIcon, FileTextIcon, FileSpreadsheetIcon, Plus, LayoutGrid, List } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "motion/react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow, } from "@/components/ui/table"

export default function FornecedoresCard({ fornecedores = [], contratos = [], pedidos = [], carregando = false }) {
    const sampleSuppliers = [
        { name: 'Animals', category: 'Animais', status: 'Ativa', products: 156 },
        { name: 'Nature Co.', category: 'Insumos', status: 'Ativa', products: 89 },
        { name: 'PetFood', category: 'Rações', status: 'Ativa', products: 67 },
        { name: 'EcoMundo', category: 'Plantas', status: 'Ativa', products: 134 }
    ];

    // Fonte real de fornecedores: prop `fornecedores` (fallback para sample)
    const suppliers = (fornecedores && fornecedores.length > 0) ? fornecedores : sampleSuppliers;

    // Estado da busca (funciona em tempo real)
    const [searchTerm, setSearchTerm] = useState('');

    // Estado aplicado que efetivamente filtra a lista (só muda ao clicar "Aplicar")
    const [appliedStatusFilters, setAppliedStatusFilters] = useState({ Ativa: true, Inativa: false });

    // Estado local do popover (alterações temporárias até o usuário clicar "Aplicar")
    const [localStatusFilters, setLocalStatusFilters] = useState({ Ativa: true, Inativa: false });

    // Controle do popover (para fechar ao aplicar/limpar)
    const [popoverOpen, setPopoverOpen] = useState(false);

    // Página (preservei setPage usado no seu exemplo original; ajuste se não precisar)
    const [page, setPage] = useState(1);

    // layout
    const [viewMode, setViewMode] = useState('cards');

    //tabela
    const [selectedRows, setSelectedRows] = useState(new Set())
    // const [data] = useState(defaultData)


    // Toggle local (apenas altera localStatusFilters)
    const toggleLocalStatus = (statusKey) => {
        setLocalStatusFilters(prev => ({ ...prev, [statusKey]: !prev[statusKey] }));
    };

    // Aplicar filtros (quando usuário clica "Aplicar")
    const applyFilters = () => {
        setAppliedStatusFilters({ ...localStatusFilters });
        setPage(1);
        setPopoverOpen(false); // fecha o popover
    };

    // Limpar filtros (volta ao padrão: somente Ativa=true)
    const clearFilters = () => {
        const defaultFilters = { Ativa: true, Inativa: false };
        setLocalStatusFilters(defaultFilters);
        setAppliedStatusFilters(defaultFilters);
        setPage(1);
        setPopoverOpen(false);
        // OBS: não limpei o campo de busca aqui; se quiser que "Limpar" também limpe a busca, adicione: setSearchTerm('')
    };

    // Filtra fornecedores com base no searchTerm (em tempo real) e nos filtros aplicados (appliedStatusFilters)
    const filteredSuppliers = useMemo(() => {
        const q = (searchTerm || '').trim().toLowerCase();

        return suppliers.filter(s => {
            // filtro por status aplicado
            const statusOk = appliedStatusFilters[s.status] ?? false;
            if (!statusOk) return false;

            // filtro por busca (nome ou categoria)
            if (!q) return true;
            const inName = (s.name || '').toLowerCase().includes(q);
            const inCategory = (s.category || '').toLowerCase().includes(q);
            return inName || inCategory;
        });
    }, [suppliers, searchTerm, appliedStatusFilters]);

    // Para exibir quantos resultados *prováveis* se aplicarmos os filtros locais (útil dentro do popover)
    const previewCount = useMemo(() => {
        const q = (searchTerm || '').trim().toLowerCase();
        return suppliers.filter(s => {
            const statusOk = localStatusFilters[s.status] ?? false;
            if (!statusOk) return false;
            if (!q) return true;
            return (s.name || '').toLowerCase().includes(q) || (s.category || '').toLowerCase().includes(q);
        }).length;
    }, [suppliers, searchTerm, localStatusFilters]);

    // Helper: compara várias formas possíveis de representar fornecedor/empresa
    const matchesSupplier = (entity, supplier) => {
        if (!entity || !supplier) return false;
        const supplierName = (supplier.name || supplier.nome || supplier.nomeEmpresa || '').toString().toLowerCase();

        const candidates = [];
        // propriedades comuns que podem representar fornecedor em contratos/pedidos
        if (entity.fornecedorUnidade && entity.fornecedorUnidade.nome) candidates.push(entity.fornecedorUnidade.nome);
        if (entity.fornecedorExterno && entity.fornecedorExterno.nomeEmpresa) candidates.push(entity.fornecedorExterno.nomeEmpresa);
        if (entity.fornecedor && (entity.fornecedor.name || entity.fornecedor.nome)) candidates.push(entity.fornecedor.name || entity.fornecedor.nome);
        if (entity.nome) candidates.push(entity.nome);
        if (entity.nomeEmpresa) candidates.push(entity.nomeEmpresa);
        if (entity.razao_social) candidates.push(entity.razao_social);
        if (entity.cpf_cnpj) candidates.push(entity.cpf_cnpj);
        // ids
        if (supplier.id && (entity.fornecedorUnidadeId === supplier.id || entity.fornecedorExternoId === supplier.id || entity.fornecedorId === supplier.id)) return true;

        return candidates.some(c => c && c.toString().toLowerCase() === supplierName);
    };

    const resolveProductName = (item) => {
        return item?.produto?.nome || item?.produtoNome || item?.nomeProduto || item?.nome || item?.descricao || '-';
    };

    const resolveSupplierName = (s) => {
        return (s?.name || s?.nome || s?.nomeEmpresa || s?.razao_social || '—');
    };

    return (
        <div>
            <header className="mb-4">

                <h2 className="text-lg font-semibold mb-3">Fornecedores</h2>
                <div className="flex flex-row gap-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input placeholder="Buscar por nome ou CNPJ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                    </div>
                    {/* FILTROS AVANÇADOS */}
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <Sliders className="h-4 w-4" />Filtros avançados
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent side="bottom" align="start" className="w-[360px] p-3">
                            {/* header com ações rápidas */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="font-semibold">Filtros Avançados</div>
                                <div className="text-sm text-neutral-400">{previewCount} resultados</div>
                            </div>

                            <div className="space-y-3">
                                {/* STATUS */}
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Status</div>
                                    <div className="flex gap-2">
                                        {/* Ativa: disponível e interativo */}
                                        <label className="flex items-center gap-2 px-2 py-1 rounded hover:bg-neutral-900 cursor-pointer">
                                            <Checkbox
                                                checked={!!localStatusFilters['Ativa']}
                                                onCheckedChange={() => { toggleLocalStatus('Ativa'); setPage(1); }}
                                            />
                                            <div className="text-sm">Ativa</div>
                                        </label>

                                        {/* Inativa: mantida visível mas desabilitada conforme requisito */}
                                        <label className="flex items-center gap-2 px-2 py-1 rounded text-muted-foreground ">
                                            <Checkbox
                                                checked={!!localStatusFilters['Inativa']}
                                                onCheckedChange={() => { toggleLocalStatus('Inativa'); setPage(1); }}
                                            />
                                            <div className="text-sm">Inativa</div>
                                        </label>
                                    </div>
                                </div>

                                <Separator />

                                {/* APLICAR / RESET */}
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" onClick={applyFilters}>Aplicar</Button>
                                        <Button size="sm" variant="ghost" onClick={clearFilters}>Limpar</Button>
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <div className="flex items-center gap-2 ml-3">
                        <Button
                            variant={viewMode === 'cards' ? 'default' : 'ghost'}
                            size="icon"
                            onClick={() => setViewMode('cards')}
                            title="Visualizar em cards"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>

                        <Button
                            variant={viewMode === 'table' ? 'default' : 'ghost'}
                            size="icon"
                            onClick={() => setViewMode('table')}
                            title="Visualizar em tabela"
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* <div className="flex items-center gap-2">
                        
                        <div className="flex items-center gap-2 ml-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant='outline' size='sm'>
                                        <DownloadIcon className='mr-2 h-4 w-4' />
                                        Exportar
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                    <DropdownMenuItem onClick={() => handleExport()}>
                                        <FileTextIcon className='mr-2 h-4 w-4' />
                                        Exportar CSV
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <FileSpreadsheetIcon className='mr-2 h-4 w-4' />
                                        Exportar PDF
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                    </div> */}

                    <Button><Plus />Novo contrato</Button>
                </div>

            </header>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {suppliers.map((supplier, idx) => ( */}
            {viewMode === 'cards' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredSuppliers.map((supplier, idx) => (
                        <Expandable key={idx} expandDirection="both" expandBehavior="replace" onExpandStart={() => console.log("Expanding product card...")} onExpandEnd={() => console.log("Product card expanded!")}>
                            {({ isExpanded }) => (
                                <ExpandableTrigger>
                                    <ExpandableCard className="w-full relative"
                                        // collapsedSize={{ width: 300, height: 220 }}
                                        collapsedSize={{ width: "100%", height: "h-fit" }}
                                        // expandedSize={{ width: 300, height: 520 }}
                                        expandedSize={{ width: "100%", height: "h-fit" }} hoverToExpand={false} expandDelay={500} collapseDelay={700}>
                                        <ExpandableCardHeader>
                                            <div className="flex justify-between items-center">
                                                <Badge variant="secondary" className="bg-[#99BF0F]/10 text-[#99BF0F]/80 dark:bg-[#99BF0F]/30">{supplier.status}</Badge>
                                                <Badge variant="outline" className="ml-2">{supplier.products} produtos</Badge>
                                            </div>
                                        </ExpandableCardHeader>
                                        <ExpandableCardContent>
                                            <div className="flex items-start mb-4">
                                                <img src="https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6505/6505727_rd.jpg;maxHeight=640;maxWidth=550;format=webp" alt="Product" className="object-cover rounded-md mr-4" style={{ width: isExpanded ? "120px" : "80px", height: isExpanded ? "120px" : "80px", transition: "width 0.3s, height 0.3s", }} />
                                                <div className="flex-1">

                                                    <h3 className="font-medium text-gray-800 dark:text-white tracking-tight transition-all duration-300" style={{ fontSize: isExpanded ? "24px" : "18px", fontWeight: isExpanded ? "700" : "700", }}>{supplier.name}</h3>

                                                    <div className="flex items-center mt-1">
                                                        <AnimatePresence mode="wait">
                                                            {isExpanded ? (
                                                                <motion.span key="expanded" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }} className="text-sm text-gray-600 dark:text-gray-400 overflow-hidden whitespace-nowrap">{supplier.category}</motion.span>
                                                            ) : (
                                                                <motion.span key="collapsed" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }} className="text-sm text-gray-600 dark:text-gray-400 overflow-hidden whitespace-nowrap">{supplier.category}</motion.span>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                </div>
                                            </div>
                                            <ExpandableContent preset="fade" keepMounted={false} animateIn={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { type: "spring", stiffness: 300, damping: 20 }, }}>
                                                {/* <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-xs">Descrição da empresa abcdefghijklmnopqrstuvwxyz</p> */}
                                                <div className="space-y-4">
                                                    {[
                                                        { icon: Package, text: "Produtos disponíveis: " },
                                                        { icon: CircleDot, text: "Vencimento do contrato: " },
                                                        { icon: CircleDot, text: "CNPJ: " },
                                                        { icon: CircleDot, text: "Telefone: " },
                                                        { icon: CircleDot, text: "Email: " },
                                                        { icon: CircleDot, text: "Local: " },
                                                    ].map((feature, index) => (
                                                        <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                            <feature.icon className="w-4 h-4 mr-2" />
                                                            <span>{feature.text}</span>
                                                        </div>
                                                    ))}

                                                    {/* EXIBIÇÃO: contratos + itens + pedidos relacionados */}
                                                    <div className="mt-2">
                                                        <div className="text-sm font-semibold mb-1">Contratos relacionados</div>
                                                        {carregando ? (
                                                            <div className="text-sm text-muted-foreground">Carregando...</div>
                                                        ) : (
                                                            (() => {
                                                                const supplierContracts = contratos ? contratos.filter(c => matchesSupplier(c, supplier) || (c.fornecedorUnidade?.nome === supplier.name) || (c.fornecedorExterno?.nomeEmpresa === supplier.name)) : [];
                                                                const supplierPedidos = pedidos ? pedidos.filter(p => matchesSupplier(p, supplier) || (p.destinoUnidade?.nome === supplier.name) || (p.origemUnidade?.nome === supplier.name)) : [];
                                                                return (
                                                                    <div className="space-y-3">
                                                                        <div>
                                                                            {supplierContracts.length === 0 ? (
                                                                                <div className="text-sm text-muted-foreground">Nenhum contrato encontrado.</div>
                                                                            ) : (
                                                                                supplierContracts.map((contr, ci) => (
                                                                                    <div key={ci} className="p-2 border rounded mt-2">
                                                                                        <div className="text-sm font-medium">{contr.titulo || contr.numero || contr.id || `Contrato ${ci + 1}`}</div>
                                                                                        <div className="text-xs text-muted-foreground">{contr.descricao || contr.observacoes || ''}</div>
                                                                                        <div className="mt-2 text-sm">
                                                                                            <div className="font-medium">Itens:</div>
                                                                                            {(contr.itens || contr.itensContrato || contr.items || []).map((it, j) => (
                                                                                                <div key={j} className="text-sm flex justify-between">
                                                                                                    <div>{resolveProductName(it)}</div>
                                                                                                    <div className="text-muted-foreground text-xs">{it.quantidade ? `${it.quantidade} ${it.unidade || ''}` : ''}</div>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                ))
                                                                            )}
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-sm font-semibold">Pedidos relacionados ({supplierPedidos.length})</div>
                                                                            {supplierPedidos.length === 0 ? (
                                                                                <div className="text-sm text-muted-foreground">Nenhum pedido relacionado.</div>
                                                                            ) : (
                                                                                supplierPedidos.map((pedido, pi) => (
                                                                                    <div key={pi} className="p-2 border rounded mt-2">
                                                                                        <div className="text-sm font-medium">Pedido {pedido.id || pedido.numero || pi + 1} - {pedido.status}</div>
                                                                                        <div className="text-xs text-muted-foreground">Origem: {pedido.origemUnidade?.nome || pedido.origem?.nome || '-'} — Destino: {pedido.destinoUnidade?.nome || pedido.destino?.nome || '-'}</div>
                                                                                        <div className="mt-2 text-sm">
                                                                                            {(pedido.itens || pedido.items || pedido.pedidoItens || []).map((it2, k) => (
                                                                                                <div key={k} className="text-sm flex justify-between">
                                                                                                    <div>{resolveProductName(it2)}</div>
                                                                                                    <div className="text-muted-foreground text-xs">{it2.quantidade ? `${it2.quantidade} ${it2.unidade || ''}` : ''}</div>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                ))
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })()
                                                        )}
                                                    </div>

                                                    <Button className="w-full bg-[#99BF0F]/80 hover:bg-[#99BF0F] text-white"><ShoppingCart className="w-4 h-4 mr-2" />Ver catálogo</Button>
                                                </div>
                                            </ExpandableContent>
                                        </ExpandableCardContent>
                                        {/* <ExpandableContent preset="slide-up">
                                        <ExpandableCardFooter>
                                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 w-full">
                                                <span>Free shipping</span>
                                                <span>30-day return policy</span>
                                            </div>
                                        </ExpandableCardFooter>
                                    </ExpandableContent> */}
                                    </ExpandableCard>
                                </ExpandableTrigger>
                            )}
                        </Expandable>
                    ))}
                </div>
            ) : (
  <div className="overflow-x-auto mt-6">
    <Table className="min-w-full border border-border rounded-md">
      <TableHeader className="sticky top-0 bg-background z-10">
        <TableRow>
          <TableHead className="w-[40px]">
            <Checkbox
              checked={filteredSuppliers.length > 0 && selectedRows.size === filteredSuppliers.length}
              onCheckedChange={(checked) => {
                setSelectedRows(
                  checked ? new Set(filteredSuppliers.map((s) => s.name)) : new Set()
                );
              }}
            />
          </TableHead>
          <TableHead>Fornecedor</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Produtos</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {filteredSuppliers.map((s, i) => (
          <TableRow
            key={s.name}
            onClick={() => {
              const newSet = new Set(selectedRows);
              newSet.has(s.name) ? newSet.delete(s.name) : newSet.add(s.name);
              setSelectedRows(newSet);
            }}
            data-state={selectedRows.has(s.name) && "selected"}
            className="cursor-pointer hover:bg-muted/30 transition"
          >
            <TableCell>
              <Checkbox checked={selectedRows.has(s.name)} />
            </TableCell>
            <TableCell className="font-medium">{s.name}</TableCell>
            <TableCell>{s.category}</TableCell>
            {/* <TableCell>
              <Badge variant={s.status === 'Ativa' ? 'default' : 'secondary'}>
                {s.status}
              </Badge>
              
            </TableCell> */}
            <TableCell><Badge variant={s.status === "Ativa" ? "secondary" : "destructive"}>{s.status}</Badge></TableCell>
            <TableCell className="text-right">{s.products}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
)
}
            {/* ))}
            </div> */}

        </div>
    );
}
