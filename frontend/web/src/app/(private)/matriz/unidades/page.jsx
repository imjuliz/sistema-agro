"use client"
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, MoreHorizontal, Download, Upload, Trash, Edit, MapPin, Wifi, Sliders, Command as CommandIcon, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, List, Grid, DownloadIcon, FileTextIcon, FileSpreadsheetIcon, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"
import { usePerfilProtegido } from '@/hooks/usePerfilProtegido';

// ---------------------------------------------------------------------
// grafico "Lojas com melhor desempenho"
// ---------------------------------------------------------------------
export const descriptionLojaDesempenho = "Lojas com melhor desempenho"

const LojasDesempenho = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
]

const chartConfigLojasDesempenho = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-2)",
    },
    mobile: {
        label: "Mobile",
        color: "var(--chart-2)",
    },
    label: {
        color: "var(--background)",
    },
}

/* sample data */
const sampleUnits = Array.from({ length: 12 }).map((_, i) => {
    const types = ["Matriz", "Fazenda", "Loja"];
    const t = types[i % 3];
    return {
        id: `U-${100 + i}`,
        name: `${t} ${i + 1}`,
        type: t,
        location: ["São Paulo, SP", "Campinas, SP", "Hortolândia, SP"][i % 3],
        manager: ["Ana Souza", "Carlos Lima", "Mariana P."][i % 3],
        status: i % 5 === 0 ? "Inativa" : "Ativa",
        sync: new Date(Date.now() - i * 3600_000).toISOString(),
        iotHealth: Math.floor(Math.random() * 100),
    };
});

/* CSV helpers (sem alteração funcional) */
function downloadCSV(units) {
    const headers = ["id", "name", "type", "location", "manager", "status", "sync"];
    const rows = units.map(u => headers.map(h => JSON.stringify(u[h] ?? "")).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unidades_export_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}
function parseCSV(text) {
    const lines = text.split(/\r?\n/).filter(Boolean);
    const headers = lines.shift().split(',').map(h => h.trim().replace(/(^"|"$)/g, ''));
    return lines.map(line => {
        const cols = line.split(',').map(c => c.replace(/(^\"|\"$)/g, ''));
        const obj = {};
        headers.forEach((h, i) => obj[h] = cols[i]);
        return obj;
    });
}

/* saved filters localStorage hook */
function useSavedFilters() {
    const key = 'unit_saved_filters_v1';
    const [saved, setSaved] = useState(() => {
        try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
    });
    useEffect(() => localStorage.setItem(key, JSON.stringify(saved)), [saved]);
    return { saved, setSaved };
}

export default function UnitManagementPageFull() {
    usePerfilProtegido("GERENTE_MATRIZ");

    const [units, setUnits] = useState(sampleUnits);
    const [query, setQuery] = useState('');
    // perPage agora dinâmico
    const [perPage, setPerPage] = useState(6);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [activeUnit, setActiveUnit] = useState(null);
    const [page, setPage] = useState(1);
    const { saved, setSaved } = useSavedFilters();

    const [typeFilters, setTypeFilters] = useState({ Matriz: true, Fazenda: true, Loja: true }); // por default mostra todos
    const [statusFilters, setStatusFilters] = useState({ Ativa: true, Inativa: true });
    const [locationQuery, setLocationQuery] = useState('');

    useEffect(() => {
        setLoading(true);
        const t = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(t);
    }, []);

    // filtragem principal - integra query, tipos, status e localização
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return units.filter(u => {
            const matchQuery = q === '' || [u.name, u.location, u.manager, u.id].some(f => f.toLowerCase().includes(q));
            const matchType = !!typeFilters[u.type]; // verifica o checkbox do tipo
            const matchStatus = !!statusFilters[u.status];
            const matchLocation = locationQuery.trim() === '' || u.location.toLowerCase().includes(locationQuery.trim().toLowerCase());
            return matchQuery && matchType && matchStatus && matchLocation;
        });
    }, [units, query, typeFilters, statusFilters, locationQuery]);

    const paged = useMemo(() => {
        const start = (page - 1) * perPage;
        return filtered.slice(start, start + perPage);
    }, [filtered, page, perPage]);

    function toggleSelect(id) {
        setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
    }
    function selectAllOnPage() {
        const ids = paged.map(u => u.id);
        const all = ids.every(id => selected.includes(id));
        setSelected(s => all ? s.filter(x => !ids.includes(x)) : [...new Set([...s, ...ids])]);
    }
    function bulkDeactivate() {
        setUnits(prev => prev.map(u => selected.includes(u.id) ? { ...u, status: 'Inativa' } : u));
        setSelected([]);
    }
    function handleExport() { downloadCSV(filtered); }

    function handleImport(file) {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = parseCSV(reader.result);
                const mapped = parsed.map((r, i) => ({
                    id: r.id || `IMP-${Date.now()}-${i}`,
                    name: r.name || r.nome || `Import ${i}`,
                    type: r.type || 'Fazenda',
                    location: r.location || '—',
                    manager: r.manager || '—',
                    status: r.status || 'Ativa',
                    sync: new Date().toISOString(),
                    iotHealth: Math.floor(Math.random() * 100),
                }));
                setUnits(prev => [...mapped, ...prev]);
            } catch (e) {
                // ignore for now
            }
        };
        reader.readAsText(file);
    }

    function openDetails(u) {
        setActiveUnit(u);
        setSheetOpen(true);
    }

    function saveFilter(name) {
        const f = { id: Date.now(), name, query, typeFilters, statusFilters, locationQuery };
        setSaved(s => [f, ...s]);
    }

    function applySaved(id) {
        const f = saved.find(x => x.id === id);
        if (f) {
            setQuery(f.query || '');
            setTypeFilters(f.typeFilters || { Matriz: true, Fazenda: true, Loja: true });
            setStatusFilters(f.statusFilters || { Ativa: true, Inativa: true });
            setLocationQuery(f.locationQuery || '');
        }
    }

    function updateUnitField(id, field, value) {
        setUnits(prev => prev.map(u => u.id === id ? { ...u, [field]: value } : u));
    }

    // handlers dos checkboxes de filtro
    function toggleType(t) {
        setTypeFilters(prev => ({ ...prev, [t]: !prev[t] }));
    }
    function toggleStatus(s) {
        setStatusFilters(prev => ({ ...prev, [s]: !prev[s] }));
    }
    function resetFilters() {
        setQuery('');
        setTypeFilters({ Matriz: true, Fazenda: true, Loja: true });
        setStatusFilters({ Ativa: true, Inativa: true });
        setLocationQuery('');
    }

    return (
        <div className="min-h-screen p-6 bg-surface-50">
            {/* Centro em largura total da tela — main ocupará toda a grid */}
            <div className="w-full max-w-screen-2xl mx-auto">
                <main className="w-full">
                    <div className="space-y-4">

                        {/* BULK ACTIONS TOOLBAR */}
                        {selected.length > 0 && (
                            <div className="fixed left-1/2 transform -translate-x-1/2 bottom-6 z-50">
                                <Card>
                                    <CardContent className="flex items-center gap-4">
                                        <div>{selected.length} selecionadas</div>
                                        <Button variant='destructive' onClick={bulkDeactivate}><Trash className='mr-2 h-4 w-4' />Desativar</Button>
                                        <Button onClick={() => { const items = units.filter(u => selected.includes(u.id)); downloadCSV(items); }}><Download className='mr-2 h-4 w-4' />Exportar</Button>
                                        <Button variant='ghost' onClick={() => setSelected([])}>Limpar</Button>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* METRICS */}
                        <div className="grid grid-cols-4 gap-4">
                            <Card>
                                <CardHeader><CardTitle>Total de Unidades</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{units.length}</div>
                                    <div className="text-sm text-muted-foreground mt-1">Inclui Matriz, Fazendas e Lojas</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader><CardTitle>Fazendas ativas</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{units.filter(u => u.type === 'Fazenda' && u.status === 'Ativa').length}</div>
                                    <div className="text-sm text-muted-foreground mt-1">Produtividade e sincronizações</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>Lojas ativas</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{units.filter(u => u.type === 'Loja' && u.status === 'Ativa').length}</div>
                                    <div className="text-sm text-muted-foreground mt-1">Vendas e estoque</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>Matrizes ativas</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{units.filter(u => u.type === 'Matriz' && u.status === 'Ativa').length}</div>
                                    <div className="text-sm text-muted-foreground mt-1">Sedes</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* TABLE */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Unidades</CardTitle>
                            </CardHeader>

                            {/* TOP TOOLBAR */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
                                <div className="flex items-center gap-3">
                                    <div className="ml-3 relative">
                                        <Input placeholder="Buscar unidades, cidade ou responsável" value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} />
                                    </div>

                                    {/* FILTROS AVANÇADOS: usa Popover para menu parecido com dropdown */}
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                <Sliders className="h-4 w-4" />Filtros avançados
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent side="bottom" align="start" className="w-[360px] p-3">
                                            {/* header com ações rápidas */}
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="font-semibold">Filtros Avançados</div>
                                                <div className="text-sm text-neutral-400">{filtered.length} resultados</div>
                                            </div>

                                            <div className="space-y-3">
                                                {/* TIPO */}
                                                <div>
                                                    <div className="text-xs text-muted-foreground mb-1">Tipo</div>
                                                    <div className="grid grid-cols-1 gap-1">
                                                        {["Matriz", "Fazenda", "Loja"].map(t => (
                                                            <label key={t} className="flex items-center justify-between px-2 py-1 rounded hover:bg-neutral-900 cursor-pointer">
                                                                <div className="flex items-center gap-2">
                                                                    <Checkbox checked={!!typeFilters[t]} onCheckedChange={() => { toggleType(t); setPage(1); }} />
                                                                    <div className="capitalize">{t}</div>
                                                                </div>
                                                                <div className="text-sm text-neutral-400">{units.filter(u => u.type === t).length}</div>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                <Separator />
                                                {/* STATUS */}
                                                <div>
                                                    <div className="text-xs text-muted-foreground mb-1">Status</div>
                                                    <div className="flex gap-2">
                                                        {["Ativa", "Inativa"].map(s => (
                                                            <label key={s} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-neutral-900 cursor-pointer">
                                                                <Checkbox checked={!!statusFilters[s]} onCheckedChange={() => { toggleStatus(s); setPage(1); }} />
                                                                <div className="text-sm">{s}</div>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                                <Separator />

                                                {/* LOCALIZAÇÃO */}
                                                <div>
                                                    <div className="text-xs text-muted-foreground mb-1">Localização</div>
                                                    <Input placeholder="Filtrar por cidade / estado" value={locationQuery} onChange={(e) => { setLocationQuery(e.target.value); setPage(1); }} />
                                                </div>
                                                <Separator />
                                                {/* RESPONSAVEL - ainda nn funciona */}
                                                <div>
                                                    <div className="text-xs text-muted-foreground mb-1">Responsável</div>
                                                    <Input placeholder="Filtrar por responsável" value={locationQuery} onChange={(e) => { setLocationQuery(e.target.value); setPage(1); }} />
                                                </div>

                                                {/* APLICAR / RESET */}
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Button size="sm" onClick={() => { setPage(1); /* já aplica por react */ }}>Aplicar</Button>
                                                        <Button size="sm" variant="ghost" onClick={() => resetFilters()}>Limpar</Button>
                                                    </div>
                                                </div>

                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                        <span className="text-sm">Ordenar Por</span>
                                        <div className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded bg-neutral-800 text-neutral-300 text-xs">1</div>
                                    </Button>

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

                                </div>
                            </div>

                            <CardContent>
                                {loading ? (
                                    <div className='space-y-2'>
                                        <Skeleton className='h-8 w-full' />
                                        <Skeleton className='h-8 w-full' />
                                        <Skeleton className='h-8 w-full' />
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead><Checkbox onCheckedChange={selectAllOnPage} checked={paged.every(u => selected.includes(u.id)) && paged.length > 0} /></TableHead>
                                                <TableHead>Unidade</TableHead>
                                                <TableHead>Tipo</TableHead>
                                                <TableHead>Local</TableHead>
                                                <TableHead>Responsável</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>IoT</TableHead>
                                                <TableHead>Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paged.map((u) => (
                                                <TableRow key={u.id}>
                                                    <TableCell><Checkbox checked={selected.includes(u.id)} onCheckedChange={() => toggleSelect(u.id)} /></TableCell>
                                                    <TableCell className="font-medium cursor-pointer" onClick={() => openDetails(u)}>{u.name}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Avatar><AvatarFallback>{u.type[0]}</AvatarFallback></Avatar>
                                                            <span className="capitalize">{u.type}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{u.location}</TableCell>
                                                    <TableCell>
                                                        <div className='flex items-center gap-2'>
                                                            <div>{u.manager}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={u.status === 'Ativa' ? 'secondary' : 'destructive'}>{u.status}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className='flex items-center gap-2'>
                                                            <div className='text-sm'>{u.iotHealth}%</div>
                                                            <div className='w-24 h-2 bg-muted rounded overflow-hidden'>
                                                                <div style={{ width: `${u.iotHealth}%` }} className='h-full bg-gradient-to-r from-emerald-400 to-green-600' />
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className='flex items-center gap-2'>
                                                            <Sheet>
                                                                <SheetTrigger asChild>
                                                                    <Button size='sm' variant='ghost'><MoreHorizontal /></Button>
                                                                </SheetTrigger>
                                                                <SheetContent side='right' className='w-[480px]'>
                                                                    <SheetHeader>
                                                                        <SheetTitle>Detalhes: {u.name}</SheetTitle>
                                                                    </SheetHeader>
                                                                    <div className='p-4'>
                                                                        <Tabs defaultValue='info'>
                                                                            <TabsList>
                                                                                <TabsTrigger value='info'>Info</TabsTrigger>
                                                                                <TabsTrigger value='activity'>Atividade</TabsTrigger>
                                                                                <TabsTrigger value='iot'>IoT</TabsTrigger>
                                                                            </TabsList>
                                                                            <TabsContent value='info'>
                                                                                <div className='space-y-2'>
                                                                                    <div><strong>ID:</strong> {u.id}</div>
                                                                                    <div><strong>Tipo:</strong> {u.type}</div>
                                                                                    <div><strong>Local:</strong> {u.location}</div>
                                                                                    <div><strong>Responsável:</strong> {u.manager}</div>
                                                                                    <div><strong>Status:</strong> {u.status}</div>
                                                                                    <div><strong>Última sync:</strong> {u.sync}</div>
                                                                                </div>
                                                                            </TabsContent>
                                                                            <TabsContent value='activity'>
                                                                                <div className='space-y-2'>
                                                                                    <div className='text-sm text-muted-foreground'>Histórico de eventos (simulado)</div>
                                                                                    <ul className='list-disc pl-5'>
                                                                                        <li>2025-10-25: Recebimento de lote L-001</li>
                                                                                        <li>2025-10-24: Aplicação de insumo A</li>
                                                                                        <li>2025-10-23: Sincronização concluída</li>
                                                                                    </ul>
                                                                                </div>
                                                                            </TabsContent>
                                                                            <TabsContent value='iot'>
                                                                                <div className='space-y-2'>
                                                                                    <div className='text-sm text-muted-foreground'>Últimas leituras</div>
                                                                                    <div className='w-full h-32 bg-muted rounded flex items-center justify-center'>Gráfico (placeholder)</div>
                                                                                    <div><strong>Saúde:</strong> {u.iotHealth}%</div>
                                                                                </div>
                                                                            </TabsContent>
                                                                        </Tabs>
                                                                    </div>
                                                                    <SheetFooter>
                                                                        <div className='flex justify-end gap-2 p-2'>
                                                                        </div>
                                                                    </SheetFooter>
                                                                </SheetContent>
                                                            </Sheet>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                                <CardFooter className="flex items-center justify-between px-4 py-3 border-t border-neutral-800">
                                    <div className="text-sm text-neutral-400">
                                        {selected.length} de {filtered.length} linha(s) selecionada(s).
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-sm">Linhas por pág.</div>
                                        <select className="bg-neutral-900 border border-neutral-800 text-neutral-200 rounded px-2 py-1 text-sm"
                                            value={perPage} onChange={(e) => { const v = Number(e.target.value); setPerPage(v); setPage(1); }} >
                                            <option value={5}>5</option>
                                            <option value={6}>6</option>
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                        </select>

                                        <div className="text-sm">Pág. {page} de {Math.max(1, Math.ceil(filtered.length / perPage) || 1)}</div>

                                        <div className="inline-flex items-center gap-1 border-l border-neutral-800 pl-3">
                                            <Button variant="ghost" size="sm" onClick={() => { setPage(1); }}><ChevronsLeft className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))}><ChevronLeft className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.min(Math.ceil(filtered.length / perPage) || 1, p + 1))}><ChevronRight className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => setPage(Math.max(1, Math.ceil(filtered.length / perPage) || 1))}><ChevronsRight className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                </CardFooter>
                            </CardContent>
                        </Card>

                        {/* MAP OVERVIEW */}
                        <div className=''>
                            <Card>
                                <CardHeader><CardTitle>Mapa</CardTitle></CardHeader>
                                <CardContent>
                                    <div className='h-56 bg-muted rounded-md flex items-center justify-center'>
                                        <div>Mapa interativo (Leaflet / Mapbox) — pins das unidades</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>


                        <div className="flex flex-row gap-8">
                            <div className="w-full">
                                {/* LOJA */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Lojas com melhor desempenho</CardTitle>
                                        <CardDescription>January - June 2024</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ChartContainer config={chartConfigLojasDesempenho}>
                                            <BarChart accessibilityLayer data={LojasDesempenho} layout="vertical" margin={{ right: 16, }} >
                                                <CartesianGrid horizontal={false} />
                                                <YAxis dataKey="month" type="category" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} hide />
                                                <XAxis dataKey="desktop" type="number" hide />
                                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                                                <Bar dataKey="desktop" layout="vertical" fill="var(--color-desktop)" radius={4} >
                                                    <LabelList dataKey="month" position="insideLeft" offset={8} className="fill-(--color-label)" fontSize={12} />
                                                    <LabelList dataKey="desktop" position="right" offset={8} className="fill-foreground" fontSize={12} />
                                                </Bar>
                                            </BarChart>
                                        </ChartContainer>
                                    </CardContent>
                                    <CardFooter className="flex-col items-start gap-2 text-sm">
                                        <div className="flex gap-2 leading-none font-medium">Trending up by 5.2% this month <TrendingUp className="h-4 w-4" /></div>
                                        <div className="text-muted-foreground leading-none">Vendas totais, Margem de lucro, Giro de estoque ou Satisfação do cliente? (a decidir)
                                        </div>
                                    </CardFooter>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
