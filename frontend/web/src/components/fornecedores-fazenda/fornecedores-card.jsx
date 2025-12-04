"use client"
import React, { useMemo, useState } from "react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LayoutGrid, List, Search, Plus, ShoppingCart, Eye, Trash } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


export default function FornecedoresCard({ fornecedores = [], contratos = [], pedidos = [], carregando = false }) {
    const router = useRouter();
    const { user, fetchWithAuth } = useAuth();
    const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;

    // Small local state to hide removed suppliers without forcing parent refresh
    const [removedIds, setRemovedIds] = useState(new Set());
    const [selectedContrato, setSelectedContrato] = useState(null);
    const [showCatalogModal, setShowCatalogModal] = useState(false);

    const isUserGerenteMatriz = (() => {
        if (!user) return false;
        // Some APIs set perfil as string or object; also check roles array
        const perfil = user.perfil;
        if (typeof perfil === 'string' && String(perfil).toUpperCase() === 'GERENTE_MATRIZ') return true;
        if (perfil && typeof perfil === 'object') {
            const fn = String(perfil.funcao ?? perfil.nome ?? '').toUpperCase();
            if (fn === 'GERENTE_MATRIZ') return true;
        }
        if (Array.isArray(user.roles) && user.roles.some(r => String(r).toUpperCase() === 'GERENTE_MATRIZ')) return true;
        return false;
    })();

    const handleEdit = async (supplier) => {
        if (!isUserGerenteMatriz) return alert('Apenas GERENTE_MATRIZ pode editar fornecedores.');
        const id = supplier.id ?? supplier.raw?.id ?? supplier.raw?.ID;
        if (!id) return alert('Fornecedor sem ID — não é possível editar.');

        const newName = window.prompt('Editar nome do fornecedor:', supplier.name || supplier.nomeEmpresa || '');
        if (newName === null) return; // cancelado
        const payload = { nomeEmpresa: newName };
        try {
            const url = `${String(API_URL || '/api/').replace(/\/$/, '')}/fornecedores/${id}`;
            const res = await fetchWithAuth(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!res.ok) {
                const text = await res.text().catch(() => null);
                throw new Error(text || `HTTP ${res.status}`);
            }
            // Optionally refresh page or update UI
            router.refresh();
            return alert('Fornecedor atualizado com sucesso.');
        } catch (err) {
            console.error('[FornecedoresCard] edit error', err);
            return alert('Erro ao atualizar fornecedor: ' + (err?.message || err));
        }
    };

    const handleDelete = async (supplier) => {
        if (!isUserGerenteMatriz) return alert('Apenas GERENTE_MATRIZ pode excluir fornecedores.');
        const id = supplier.id ?? supplier.raw?.id ?? supplier.raw?.ID;
        if (!id) return alert('Fornecedor sem ID — não é possível excluir.');

        const ok = window.confirm('Tem certeza que deseja excluir este fornecedor? Esta ação não poderá ser desfeita.');
        if (!ok) return;

        try {
            const url = `${String(API_URL || '/api/').replace(/\/$/, '')}/fornecedores/${id}`;
            const res = await fetchWithAuth(url, { method: 'DELETE' });
            if (!res.ok) {
                const text = await res.text().catch(() => null);
                throw new Error(text || `HTTP ${res.status}`);
            }
            // hide locally
            const next = new Set(removedIds);
            next.add(id);
            setRemovedIds(next);
            router.refresh();
            return alert('Fornecedor excluído com sucesso.');
        } catch (err) {
            console.error('[FornecedoresCard] delete error', err);
            return alert('Erro ao excluir fornecedor: ' + (err?.message || err));
        }
    };
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
    const [contractSearchTerm, setContractSearchTerm] = useState('');
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
        const qDigits = q.replace(/\D/g, '');
        return suppliers.filter(s => {
            if (!s) return false;
            if (q === '') return true;

            const nameMatch = (s.name || '').toLowerCase().includes(q);
            const productsMatch = (String(s.products || '')).includes(q);
            const categoryMatch = (s.category || '').toLowerCase().includes(q);

            // check raw CNPJ/CPF fields
            const raw = s.raw || {};
            const rawCnpj = (raw.cnpjCpf || raw.cnpj_cpf || raw.cnpj || raw.cnpjCpf || raw.cpf || '').toString();
            const rawCnpjDigits = rawCnpj.replace(/\D/g, '');
            const cnpjMatch = qDigits && rawCnpjDigits && rawCnpjDigits.includes(qDigits);

            // also allow searching by email/phone
            const email = (raw.email || raw.contato || raw.e_mail || '').toString().toLowerCase();
            const phone = (raw.telefone || raw.phone || '').toString().replace(/\D/g, '');
            const emailMatch = email.includes(q);
            const phoneMatch = qDigits && phone.includes(qDigits);

            return nameMatch || productsMatch || categoryMatch || cnpjMatch || emailMatch || phoneMatch;
        });
    }, [suppliers, searchTerm]);

    const getRelated = (supplier) => {
        const contratosArray = Array.isArray(contratos) ? contratos : (contratos?.contratos || []);
        const pedidosArray = Array.isArray(pedidos) ? pedidos : (pedidos?.pedidos || []);
        const supplierContracts = (contratosArray || []).filter(c => matchesSupplier(c, supplier) || (c.fornecedorExterno?.nomeEmpresa === supplier.name) || (c.fornecedorUnidade?.nome === supplier.name));
        const supplierPedidos = (pedidosArray || []).filter(p => matchesSupplier(p, supplier) || (p.origemUnidade?.nome === supplier.name) || (p.destinoUnidade?.nome === supplier.name));
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

                {isUserGerenteMatriz && <Button><Plus /> Novo fornecedor</Button>}
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

                    const sid = supplier.id ?? supplier.raw?.id ?? supplier.raw?.ID ?? supplier.name;
                    if (removedIds.has(sid)) return null;

                    return (
                        <Card key={supplier.id ?? supplier.name}>
                            <CardContent>
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
                            </div> */}

                            {/* <div className="text-sm mb-2">
                                <strong>Pedidos relacionados ({supplierPedidos.length})</strong>
                                {supplierPedidos.length === 0 ? <div className="text-muted-foreground">Nenhum pedido relacionado.</div> : (
                                    supplierPedidos.map((p, i) => {
                                        const ref = p.documentoReferencia || p.referencia || p.numeroDocumento || p.numero || p.id || `PED-${p.id ?? i}`;
                                        const status = (s => {
                                            if (!s) return '—';
                                            const up = String(s).toUpperCase();
                                            if (up === 'PENDENTE') return 'Pendente';
                                            if (up === 'EM_TRANSITO' || up === 'EM TRÂNSITO' || up === 'EM_TRANSITO') return 'A caminho';
                                            if (up === 'ENTREGUE') return 'Entregue';
                                            if (up === 'CANCELADO') return 'Cancelado';
                                            return s;
                                        })(p.status);

                                        const items = (p.itens || p.items || []).map((it, idx) => ({
                                            name: it?.produto?.nome || it?.nome || it?.descricao || it?.produtoNome || `Item ${idx + 1}`,
                                            qty: it?.quantidade ?? it?.qtd ?? it?.quantidadePedido ?? 0
                                        }));

                                        return (
                                            <div key={ref} className="p-2 border rounded mt-2">
                                                <div className="font-medium">Pedido {ref} — {status}</div>
                                                <div className="text-xs">Origem: {p.origemUnidade?.nome || p.origem?.nome || '-'} — Destino: {p.destinoUnidade?.nome || p.destino?.nome || '-'}</div>
                                                {items.length > 0 && (
                                                    <div className="mt-2">
                                                        <div className="text-xs font-semibold">Itens:</div>
                                                        <ul className="list-disc pl-5 text-xs mt-1">
                                                            {items.map((it, idx) => <li key={idx}>{it.name} — Qtde: {it.qty}</li>)}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div> */}

                            {isUserGerenteMatriz ? (
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleEdit(supplier)}>
                                        <Eye className="h-4 w-4 mr-1" />Editar
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDelete(supplier)}>
                                        <Trash className="h-4 w-4 mr-1" />Excluir
                                    </Button>
                                </div>
                            ) : (
                                <></>
                                // <div className="text-xs text-muted-foreground">Somente GERENTE_MATRIZ pode editar/excluir</div>
                            )}
                            </CardContent>
                        </Card>
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
                        <TableHead className="text-right">Ações</TableHead>
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
                    <Input placeholder="Buscar por fornecedor ou unidade..." value={contractSearchTerm} onChange={(e) => setContractSearchTerm(e.target.value)} className="pl-10" />
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={() => setContractsViewMode('cards')} className={`p-2 ${contractsViewMode === 'cards' ? 'bg-muted rounded' : ''}`} title="cards"><LayoutGrid className="h-4 w-4" /></button>
                    <button onClick={() => setContractsViewMode('table')} className={`p-2 ${contractsViewMode === 'table' ? 'bg-muted rounded' : ''}`} title="table"><List className="h-4 w-4" /></button>
                </div>

                {isUserGerenteMatriz && <Button><Plus />Editar contrato</Button>}
            </div>
        </header>
    );

    const renderCardsContratos = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(() => {
                const allContratos = (Array.isArray(contratos) ? contratos : contratos?.contratos) || [];
                // FILTRO: Mostrar apenas contratos onde esta unidade é CONSUMIDORA (unidadeId = unidadeAtual)
                const contratosConsumidor = allContratos.filter(c => c.unidadeId === Number(unidadeId));
                const filteredContratos = contratosConsumidor.filter(c => {
                    const q = (contractSearchTerm || '').trim().toLowerCase();
                    if (q === '') return true;
                    
                    const nomeUnidade = (c?.fornecedorUnidade?.nome ?? c?.unidade?.nome ?? c?.unidadeOrigem?.nome ?? c?.origemUnidade?.nome ?? c?.fornecedorInterno?.nome ?? c?.nomeUnidade ?? '').toLowerCase();
                    const nomeFornecedor = (c?.fornecedorExterno?.nomeEmpresa ?? c?.fornecedor?.nome ?? c?.nomeFornecedor ?? '').toLowerCase();
                    
                    return nomeUnidade.includes(q) || nomeFornecedor.includes(q);
                });
                
                return filteredContratos.length === 0 ? (
                    <div className="col-span-full p-8 text-center text-muted-foreground">
                        <p className="text-lg">Nenhum contrato encontrado</p>
                        {carregando && <p className="text-sm mt-2">Carregando contratos...</p>}
                    </div>
                ) : (
                    filteredContratos.map((c) => {
                        const nomeUnidade =
                            c?.fornecedorUnidade?.nome ??
                            c?.unidade?.nome ??
                            c?.unidadeOrigem?.nome ??
                            c?.origemUnidade?.nome ??
                            c?.fornecedorInterno?.nome ??
                            c?.nomeUnidade ??
                            '—';

                        const nomeFornecedor =
                            c?.fornecedorExterno?.nomeEmpresa ??
                            c?.fornecedor?.nome ??
                            c?.nomeFornecedor ??
                            '—';

                        return (
                        <Card key={c.id}>
                            <CardContent>
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <div className="font-semibold">{nomeUnidade} - {nomeFornecedor}</div>
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

                                <Button
                                    className="mt-8 w-full bg-[#99BF0F]/80 hover:bg-[#99BF0F] text-white"
                                    onClick={() => {
                                        setSelectedContrato(c);
                                        setShowCatalogModal(true);
                                    }}
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" /> Ver catálogo
                                </Button>
                            </CardContent>
                        </Card>
                        );
                    })
                );
            })()}
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
                    {((Array.isArray(contratos) ? contratos : contratos?.contratos) || [])
                        .filter(c => c.unidadeId === Number(unidadeId))
                        .map((c) => (
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

    const CatalogModal = () => {
        // Tenta extrair o nome da unidade/fazenda de várias fontes possíveis
        const nomeUnidade =
            selectedContrato?.fornecedorUnidade?.nome ??
            selectedContrato?.unidade?.nome ??
            selectedContrato?.unidadeOrigem?.nome ??
            selectedContrato?.origemUnidade?.nome ??
            selectedContrato?.fornecedorInterno?.nome ??
            selectedContrato?.nomeUnidade ??
            '—';

        const nomeFornecedor =
            selectedContrato?.fornecedorExterno?.nomeEmpresa ??
            selectedContrato?.fornecedor?.nome ??
            selectedContrato?.nomeFornecedor ??
            '—';

        return (
            <Dialog open={showCatalogModal} onOpenChange={setShowCatalogModal}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {nomeUnidade} - {nomeFornecedor}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        {(!selectedContrato?.itens || selectedContrato.itens.length === 0) ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>Nenhum item disponível para este contrato</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3">
                                {selectedContrato.itens.map((item, idx) => (
                                    <div key={idx} className="p-4 border rounded-lg hover:bg-muted/50 transition">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-base">{item.nome || `Item ${idx + 1}`}</h4>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        );
    };




    return (
        <div>
            {renderHeader()}
            {viewMode === 'table' ? renderTable() : renderCards()}

            <div className="mt-8">
                {renderHeaderContrato()}
                {contractsViewMode === 'table' ? renderTableContratos() : renderCardsContratos()}
            </div>

            <CatalogModal />
        </div>
    );
}