"use client"
import React, { useMemo, useState } from "react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { LayoutGrid, List, Search, Plus, ShoppingCart } from 'lucide-react';

export default function FornecedoresCard({ fornecedores = [], contratos = [], pedidos = [], carregando = false }) {
    // Normalize incoming suppliers into a predictable shape
    const suppliers = (fornecedores || []).map(s => ({
        id: s?.id ?? s?.ID ?? s?.raw?.id ?? null,
        name: s?.name ?? s?.nomeEmpresa ?? s?.nome ?? s?.razao_social ?? s?.nomeFantasia ?? `Fornecedor ${s?.id ?? 'N/D'}`,
        status: s?.status ? (String(s.status).startsWith('A') ? 'Ativa' : s.status) : 'Ativa',
        products: s?.products ?? s?.produtosCount ?? s?.produtos ?? 0,
        category: s?.category ?? s?.categoria ?? s?.tipo ?? 'Geral',
        raw: s
    }));

    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('cards');
    const [contractsViewMode, setContractsViewMode] = useState('cards');
    // viewMode: 'cards' | 'table' | 'contracts'
    const [selectedRows, setSelectedRows] = useState(new Set());

    const matchesSupplier = (entity, supplier) => {
        if (!entity || !supplier) return false;
        const supplierName = String(supplier.name || supplier.nome || supplier.nomeEmpresa || supplier.raw?.nomeEmpresa || '').toLowerCase();

        const candidates = [];
        if (entity.fornecedorUnidade?.nome) candidates.push(entity.fornecedorUnidade.nome);
        if (entity.fornecedorExterno?.nomeEmpresa) candidates.push(entity.fornecedorExterno.nomeEmpresa);
        if (entity.fornecedor?.nome) candidates.push(entity.fornecedor.nome);
        if (entity.nome) candidates.push(entity.nome);
        if (entity.nomeEmpresa) candidates.push(entity.nomeEmpresa);
        if (entity.razao_social) candidates.push(entity.razao_social);
        if (entity.cnpjCpf) candidates.push(entity.cnpjCpf);
        if (entity.cnpj) candidates.push(entity.cnpj);
        if (entity.email) candidates.push(entity.email);
        if (entity.telefone) candidates.push(entity.telefone);

        const supplierId = supplier.id ?? supplier.ID ?? supplier.raw?.id ?? supplier.raw?.ID ?? null;
        if (supplierId && [entity.fornecedorUnidadeId, entity.fornecedorExternoId, entity.fornecedorId, entity.fornecedor_unidade_id].includes(supplierId)) return true;

        return candidates.some(c => c && String(c).toLowerCase() === supplierName);
    };

    const filteredSuppliers = useMemo(() => {
        const q = (searchTerm || '').trim().toLowerCase();
        return suppliers.filter(s => {
            if (!s) return false;
            if (q === '') return true;
            return (s.name || '').toLowerCase().includes(q) || (String(s.products || '')).includes(q) || (s.category || '').toLowerCase().includes(q);
        });
    }, [suppliers, searchTerm]);

    const getRelated = (supplier) => {
        const supplierContracts = (contratos || []).filter(c => matchesSupplier(c, supplier) || (c.fornecedorExterno?.nomeEmpresa === supplier.name) || (c.fornecedorUnidade?.nome === supplier.name));
        const supplierPedidos = (pedidos || []).filter(p => matchesSupplier(p, supplier) || (p.origemUnidade?.nome === supplier.name) || (p.destinoUnidade?.nome === supplier.name));
        return { supplierContracts, supplierPedidos };
    };

    const pickRaw = (raw, ...keys) => {
        if (!raw) return undefined;
        for (const k of keys) {
            if (raw[k] !== undefined && raw[k] !== null) return raw[k];
        }
        return undefined;
    };

    const formatDate = (d) => {
        if (!d) return '—';
        try { return new Date(d).toLocaleDateString(); } catch { return String(d); }
    };

    const formatCurrency = (v) => {
        if (v === null || v === undefined) return '—';
        try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'BRL' }).format(Number(v)); } catch { return String(v); }
    };

    const formatCNPJ = (value) => {
        if (!value && value !== 0) return undefined;
        let s = String(value).replace(/\D/g, '');
        if (s.length === 11) { // CPF
            return s.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        if (s.length === 14) { // CNPJ
            return s.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
        // fallback: group in sensible chunks
        if (s.length >= 9) return s.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4');
        if (s.length >= 6) return s.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
        return s;
    };

    const formatPhone = (value) => {
        if (!value && value !== 0) return undefined;
        let s = String(value).replace(/\D/g, '');
        // common BR formats: 11 digits -> (XX) 9XXXX-XXXX, 10 digits -> (XX) XXXX-XXXX
        if (s.length === 11) return s.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
        if (s.length === 10) return s.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        if (s.length === 9) return s.replace(/(\d{1})(\d{4})(\d{4})/, '$1 $2-$3');
        if (s.length === 8) return s.replace(/(\d{4})(\d{4})/, '$1-$2');
        if (s.length > 2) return s.replace(/(\d{2})(\d+)/, '($1) $2');
        return s;
    };

    // Render helpers to keep JSX readable
    const renderHeader = () => (
        <header className="mb-4">
            <h2 className="text-lg font-semibold mb-3">Fornecedores</h2>
            <div className="flex flex-row gap-4 items-center">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input placeholder="Buscar por nome ou CNPJ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={() => setViewMode('cards')} className={`p-2 ${viewMode === 'cards' ? 'bg-muted rounded' : ''}`} title="cards"><LayoutGrid className="h-4 w-4" /></button>
                    <button onClick={() => setViewMode('table')} className={`p-2 ${viewMode === 'table' ? 'bg-muted rounded' : ''}`} title="table"><List className="h-4 w-4" /></button>
                    {/* <button onClick={() => setViewMode('contracts')} className={`p-2 ${viewMode === 'contracts' ? 'bg-muted rounded' : ''}`} title="contracts">Contratos</button> */}
                </div>

                <Button><Plus /> Novo fornecedor</Button>
            </div>
        </header>
    );

    const renderCards = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSuppliers.length === 0 ? (
                <div className="col-span-full p-8 text-center text-muted-foreground">
                    <p className="text-lg">Nenhum fornecedor encontrado</p>
                    {carregando && <p className="text-sm mt-2">Carregando fornecedores...</p>}
                </div>
            ) : (
                filteredSuppliers.map((supplier) => {
                    const { supplierContracts, supplierPedidos } = getRelated(supplier);
                    const raw = supplier.raw || {};
                    const cnpj = pickRaw(raw, 'cnpjCpf', 'cnpj_cpf', 'cnpj');
                    const email = pickRaw(raw, 'email', 'contato', 'e_mail');
                    const telefone = pickRaw(raw, 'telefone', 'phone');

                    return (
                        <div key={supplier.id ?? supplier.name} className="p-4 border rounded">
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <div className="font-semibold">{supplier.name}</div>
                                    <div className="text-sm text-muted-foreground">{supplier.category}</div>
                                </div>
                                {/* <div className="text-right">
                                    <Badge variant="secondary">{supplier.status}</Badge>
                                    <div className="text-sm text-muted-foreground">{supplier.products} produtos</div>
                                </div> */}
                            </div>

                            <div className="text-sm mb-2 space-y-1">
                                        <div><strong>CNPJ:</strong> {cnpj ? formatCNPJ(cnpj) : '—'}</div>
                                        <div><strong>Email:</strong> {email ?? '—'}</div>
                                        <div><strong>Telefone:</strong> {telefone ? formatPhone(telefone) : '—'}</div>
                                    </div>

                            {/* <div className="text-sm mb-2">
                                <strong>Contratos:</strong>
                                {supplierContracts.length === 0 ? <div className="text-muted-foreground">Nenhum contrato encontrado.</div> : (
                                    supplierContracts.map((c, i) => (
                                        <div key={c.id ?? i} className="p-2 border rounded mt-2">
                                            <div className="font-medium">{c.titulo || c.numero || `Contrato ${c.id ?? i}`}</div>
                                            <div className="text-xs text-muted-foreground">{c.descricao || c.observacoes || ''}</div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="text-sm mb-2">
                                <strong>Pedidos relacionados ({supplierPedidos.length})</strong>
                                {supplierPedidos.length === 0 ? <div className="text-muted-foreground">Nenhum pedido relacionado.</div> : (
                                    supplierPedidos.map((p, i) => (
                                        <div key={p.id ?? i} className="p-2 border rounded mt-2">
                                            <div className="font-medium">Pedido {p.id || p.numero || i + 1} — {p.status}</div>
                                            <div className="text-xs">Origem: {p.origemUnidade?.nome || p.origem?.nome || '-'} — Destino: {p.destinoUnidade?.nome || p.destino?.nome || '-'}</div>
                                        </div>
                                    ))
                                )}
                            </div> */}

                            <Button className="w-full bg-[#99BF0F]/80 hover:bg-[#99BF0F] text-white"><ShoppingCart className="w-4 h-4 mr-2" /> Ver catálogo</Button>
                        </div>
                    );
                })
            )}
        </div>
    );

    const renderTable = () => (
        <div className="overflow-x-auto mt-6">
            <Table className="min-w-full border border-border rounded-md">
                <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                        <TableHead className="w-[40px]"><Checkbox checked={filteredSuppliers.length > 0 && selectedRows.size === filteredSuppliers.length} onCheckedChange={(checked) => setSelectedRows(checked ? new Set(filteredSuppliers.map(s => s.name)) : new Set())} /></TableHead>
                        <TableHead>Fornecedor</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Produtos</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {filteredSuppliers.map((s) => {
                        const raw = s.raw || {};
                        const cnpj = pickRaw(raw, 'cnpjCpf', 'cnpj_cpf', 'cnpj');
                        const email = pickRaw(raw, 'email', 'contato', 'e_mail');
                        const telefone = pickRaw(raw, 'telefone', 'phone');

                        return (
                            <TableRow key={s.name} className="cursor-pointer hover:bg-muted/30 transition" onClick={() => {
                                const newSet = new Set(selectedRows);
                                newSet.has(s.name) ? newSet.delete(s.name) : newSet.add(s.name);
                                setSelectedRows(newSet);
                            }}>
                                <TableCell><Checkbox checked={selectedRows.has(s.name)} /></TableCell>
                                <TableCell className="font-medium">
                                    <div>{s.name}</div>
                                    <div className="text-xs text-muted-foreground">{cnpj ? formatCNPJ(cnpj) : '—'} • {email ?? '—'}</div>
                                </TableCell>
                                <TableCell>{s.category}</TableCell>
                                <TableCell><Badge variant={s.status === 'Ativa' ? 'secondary' : 'destructive'}>{s.status}</Badge></TableCell>
                                <TableCell className="text-right">{s.products}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );


    const renderHeaderContrato = () => (
        <header className="mb-4">
            <h2 className="text-lg font-semibold mb-3">Contratos</h2>
            <div className="flex flex-row gap-4 items-center">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input placeholder="Buscar por nome ou CNPJ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={() => setContractsViewMode('cards')} className={`p-2 ${contractsViewMode === 'cards' ? 'bg-muted rounded' : ''}`} title="cards"><LayoutGrid className="h-4 w-4" /></button>
                    <button onClick={() => setContractsViewMode('table')} className={`p-2 ${contractsViewMode === 'table' ? 'bg-muted rounded' : ''}`} title="table"><List className="h-4 w-4" /></button>
                    {/* <button onClick={() => setViewMode('contracts')} className={`p-2 ${viewMode === 'contracts' ? 'bg-muted rounded' : ''}`} title="contracts">Contratos</button> */}
                </div>

                <Button><Plus />Editar contrato</Button>
            </div>
        </header>
    );

    const renderCardsContratos = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(contratos || []).length === 0 ? (
                <div className="col-span-full p-8 text-center text-muted-foreground">
                    <p className="text-lg">Nenhum contrato encontrado</p>
                    {carregando && <p className="text-sm mt-2">Carregando contratos...</p>}
                </div>
            ) : (
                (contratos || []).map((c) => (
                    <div key={c.id} className="p-4 border rounded">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <div className="font-semibold">{c.titulo || c.numero || `Contrato ${c.id}`}</div>
                                <div className="text-sm text-muted-foreground">Fornecedor: {c.fornecedorExterno?.nomeEmpresa ?? c.fornecedorInterno?.nome ?? c.fornecedor?.nome ?? '—'}</div>
                            </div>
                            <div className="text-right">
                                <Badge variant="secondary">{String(c.status ?? '')}</Badge>
                            </div>
                        </div>

                        <div className="text-sm space-y-1">
                            <div><strong>Data início:</strong> {formatDate(c.dataInicio)}</div>
                            <div><strong>Data fim:</strong> {formatDate(c.dataFim)}</div>
                            <div><strong>Data envio:</strong> {formatDate(c.dataEnvio)}</div>
                            <div><strong>Frequência entregas:</strong> {c.frequenciaEntregas ?? c.frequencia_entregas ?? '—'}</div>
                            <div><strong>Dia pagamento:</strong> {c.diaPagamento ?? c.dia_pagamento ?? '—'}</div>
                            <div><strong>Forma pagamento:</strong> {c.formaPagamento ?? c.forma_pagamento ?? '—'}</div>
                            <div><strong>Valor total:</strong> {formatCurrency(c.valorTotal ?? c.valor_total)}</div>
                        </div>

                        <div className="mt-3">
                            <strong>Itens:</strong>
                            {(c.itens || []).length === 0 ? <div className="text-muted-foreground">Nenhum item.</div> : (
                                (c.itens || []).map((it, i) => (
                                    <div key={i} className="p-2 border rounded mt-2">
                                        <div className="font-medium">{it.nome ?? it.raca ?? `Item ${i + 1}`}</div>
                                        <div className="text-xs text-muted-foreground">Quantidade: {it.quantidade ?? '-'}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    const renderTableContratos = () => (
        <div className="overflow-x-auto mt-6">
            <Table className="min-w-full border border-border rounded-md">
                <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                        <TableHead>Contrato</TableHead>
                        <TableHead>Fornecedor</TableHead>
                        <TableHead>Data início</TableHead>
                        <TableHead>Data fim</TableHead>
                        <TableHead>Data envio</TableHead>
                        <TableHead>Frequência</TableHead>
                        <TableHead>Dia pgto</TableHead>
                        <TableHead>Forma pgto</TableHead>
                        <TableHead className="text-right">Valor total</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {(contratos || []).map((c) => (
                        <TableRow key={c.id}>
                            <TableCell className="font-medium">{c.titulo || c.numero || `Contrato ${c.id}`}</TableCell>
                            <TableCell>{c.fornecedorExterno?.nomeEmpresa ?? c.fornecedorInterno?.nome ?? c.fornecedor?.nome ?? '—'}</TableCell>
                            <TableCell>{formatDate(c.dataInicio)}</TableCell>
                            <TableCell>{formatDate(c.dataFim)}</TableCell>
                            <TableCell>{formatDate(c.dataEnvio)}</TableCell>
                            <TableCell>{c.frequenciaEntregas ?? c.frequencia_entregas ?? '—'}</TableCell>
                            <TableCell>{c.diaPagamento ?? c.dia_pagamento ?? '—'}</TableCell>
                            <TableCell>{c.formaPagamento ?? c.forma_pagamento ?? '—'}</TableCell>
                            <TableCell className="text-right">{formatCurrency(c.valorTotal ?? c.valor_total)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );


    

    return (
        <div>
            {renderHeader()}
            {viewMode === 'table' ? renderTable() : renderCards()}

            <div className="mt-8">
                {renderHeaderContrato()}
                {contractsViewMode === 'table' ? renderTableContratos() : renderCardsContratos()}
            </div>
        </div>
    );
}
