// Gestão de Produção (Fazendas): Acompanhar toda a parte agrícola e pecuária.
// layout: Visualização por fazenda → talhões/lotes. Calendário de atividades (plantio, irrigação, vacinação).
//Funcionalidades: Registro de atividades (plantio, colheita, vacinação etc.). Planejamento de safra. Controle de estoque agrícola. Rastreabilidade: visualizar ciclo completo do produto.

"use client"
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash, TrendingUp, Sliders, Plus, MoreHorizontal, Download, Upload, Edit, MapPin, Wifi, Command as CommandIcon, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, List, Grid, DownloadIcon, FileTextIcon, FileSpreadsheetIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, Line, LineChart, } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, } from "@/components/ui/dropdown-menu";

// SAMPLE DATA (em app real, busque via API)
const sampleUnits = Array.from({ length: 18 }).map((_, i) => {
    const status = i % 6 === 0 ? "Inativa" : "Ativa";
    return {
        id: `F-${300 + i}`,
        name: `Fazenda ${i + 1}`,
        type: "Fazenda",
        location: ["São Paulo, SP", "Campinas, SP", "Hortolândia, SP"][i % 3],
        manager: ["Ana Souza", "Carlos Lima", "Mariana P."][i % 3],
        status,
        sync: new Date(Date.now() - i * 3600_000).toISOString(),
        iotHealth: Math.floor(40 + Math.random() * 60),
        areaHa: Math.floor(50 + Math.random() * 400),
    };
});

export default function FazendasPage() {
    const [units, setUnits] = useState(sampleUnits);
    const [query, setQuery] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(8);
    const [sheetUnit, setSheetUnit] = useState(null);

    // filtros avançados: tipos e status e local
    const [typeFilters, setTypeFilters] = useState({ Matriz: true, Fazenda: true, Loja: true }); // por default mostra todos
    const [statusFilters, setStatusFilters] = useState({ Ativa: true, Inativa: true });
    const [locationQuery, setLocationQuery] = useState('');

    useEffect(() => {
        setLoading(true);
        const t = setTimeout(() => setLoading(false), 350);
        return () => clearTimeout(t);
    }, []);

    // filtra somente fazendas e aplica query + localização
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return units.filter(u => {
            const isFazenda = u.type === "Fazenda";
            const matchQ = q === "" || [u.name, u.location, u.manager, u.id].some(f => f.toLowerCase().includes(q));
            const matchLoc = locationFilter.trim() === "" || u.location.toLowerCase().includes(locationFilter.trim().toLowerCase());
            return isFazenda && matchQ && matchLoc;
        });
    }, [units, query, locationFilter]);

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
    function bulkDelete() {
        setUnits(prev => prev.filter(u => !selected.includes(u.id)));
        setSelected([]);
    }

    const metrics = useMemo(() => {
        const total = filtered.length;
        const active = filtered.filter(u => u.status === "Ativa").length;
        const inactive = total - active;
        const avgIot = Math.round((filtered.reduce((s, u) => s + u.iotHealth, 0) / Math.max(1, filtered.length)) || 0);
        const totalArea = filtered.reduce((s, u) => s + (u.areaHa || 0), 0);
        return { total, active, inactive, avgIot, totalArea };
    }, [filtered]);


    // ---------------------------------------------------------------------
    // grafico de barras "Fazendas mais produtivas"
    // ---------------------------------------------------------------------
    const FazendasProdutivas = [
        { month: "Fazenda 1", desktop: 186, mobile: 80 },
        { month: "Fazenda 2", desktop: 305, mobile: 200 },
        { month: "Fazenda 3", desktop: 237, mobile: 120 },
        { month: "Fazenda 4", desktop: 73, mobile: 190 },
        { month: "Fazenda 5", desktop: 209, mobile: 130 },
    ]

    const chartConfigFazendasProdutivas = {
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

    // ---------------------------------------------------------------------
    // grafico de linhas "Produção mensal"
    // ---------------------------------------------------------------------
    const ProducaoSemanal = [
        { week: "Domingo", desktop: 214 },
        { week: "Segunda-feira", desktop: 186 },
        { week: "Terça-feira", desktop: 305 },
        { week: "Quarta-feira", desktop: 237 },
        { week: "Quinta-feira", desktop: 73 },
        { week: "Sexta-feira", desktop: 209 },
        { week: "Sábado", desktop: 214 },
    ]
    const chartConfigProducaoSemanal = {
        desktop: {
            label: "Desktop",
            color: "var(--chart-1)",
        },
    }
    return (
        <div className="min-h-screen p-6 bg-surface-50">
            <div className="max-w-screen-2xl mx-auto w-full">
                <header className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Unidades — Fazendas</h1>
                        <p className="text-sm text-muted-foreground">Visão dedicada para a Matriz: resumo e detalhes de fazendas</p>
                    </div>
                    {/* <div className="flex items-center gap-2">
                        <Button onClick={() => { setQuery(""); setLocationFilter(""); setPage(1); }}>Limpar filtros</Button>
                        <Button variant="secondary" onClick={() => window.print()}>Imprimir</Button>
                    </div> */}
                </header>

                {/* METRICS */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <Card className={"gap-4 h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition"}>
                        <CardHeader><CardTitle>Total de Fazendas</CardTitle></CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{metrics.total}</div>
                            <div className="text-sm text-muted-foreground mt-1">Total de unidades do tipo Fazenda</div>
                        </CardContent>
                    </Card>

                    <Card className={"gap-4 h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition"}>
                        <CardHeader><CardTitle>Ativas</CardTitle></CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{metrics.active}</div>
                            <div className="text-sm text-muted-foreground mt-1">Fazendas com status Ativa</div>
                        </CardContent>
                    </Card>

                    <Card className={"gap-4 h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition"}>
                        <CardHeader><CardTitle>Inativas</CardTitle></CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{metrics.inactive}</div>
                            <div className="text-sm text-muted-foreground mt-1">Fazendas com status Inativa</div>
                        </CardContent>
                    </Card>

                    <Card className={"gap-4 h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition"}>
                        <CardHeader><CardTitle>IoT (média)</CardTitle></CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{metrics.avgIot}%</div>
                            <div className="text-sm text-muted-foreground mt-1">Média de saúde dos dispositivos</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters + cards */}
                <Card className={"mb-8"}>
                    <CardHeader>
                        <CardTitle className={"mb-4"}>Lista de Fazendas</CardTitle>
                        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                            <div className="flex items-center gap-3">
                                <div className="relative">
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
                                            {/* <div>
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

                                            <Separator /> */}
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

                                            <Separator />
                                            {/* Area */}
                                            <div>
                                                <div className="text-xs text-muted-foreground mb-1">Área</div>
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
                    </CardHeader>

                    <CardContent>
                        {loading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        ) : (
                            <div>
                                {/* Grid of cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {paged.map(u => (
                                        <Link key={u.id} href={`/matriz/unidades/fazendas/${u.id}`}>
                                            <div className="bg-card border border-neutral-800 rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar><AvatarFallback>F</AvatarFallback></Avatar>
                                                        <div>
                                                            <div className="font-medium text-lg">{u.name}</div>
                                                            <div className="text-sm text-muted-foreground">{u.id}</div>
                                                            <div className="text-sm text-muted-foreground">{u.location}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm">Área</div>
                                                        <div className="font-medium">{u.areaHa} ha</div>
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={u.status === 'Ativa' ? 'secondary' : 'destructive'}>{u.status}</Badge>
                                                        <div className="text-sm text-muted-foreground">IoT: {u.iotHealth}%</div>
                                                    </div>
                                                </div>

                                                <div className="mt-3 text-sm text-muted-foreground">Última sync: {new Date(u.sync).toLocaleString()}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Empty state */}
                                {filtered.length === 0 && (
                                    <div className="py-8 text-center text-muted-foreground">Nenhuma fazenda encontrada.</div>
                                )}
                            </div>
                        )}
                    </CardContent>

                </Card>

                <div className='mb-8'>
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
                        {/* FAZENDA */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Fazendas mais produtivas</CardTitle>
                                <CardDescription>January - June 2024</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfigFazendasProdutivas}>
                                    <BarChart accessibilityLayer data={FazendasProdutivas} layout="vertical" margin={{ right: 16, }}>
                                        <CartesianGrid horizontal={false} />
                                        <YAxis dataKey="month" type="category" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} hide/>
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
                                <div className="flex gap-2 leading-none font-medium">
                                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="text-muted-foreground leading-none">texto
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                    <div className="w-full">
                        <Card>
                            <CardHeader>
                                <CardTitle>Produção semanal</CardTitle>
                                <CardDescription>January - June 2024</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfigProducaoSemanal}>
                                    <LineChart accessibilityLayer data={ProducaoSemanal} margin={{ left: 20, right: 20, }} >
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                        <Line dataKey="desktop" type="natural" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ChartContainer>
                            </CardContent>
                            <CardFooter className="flex-col items-start gap-2 text-sm">
                                <div className="flex gap-2 leading-none font-medium">
                                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="text-muted-foreground leading-none">
                                    (kg, litros, etc.)
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>

            </div>
        </div>
    );
}

// --- helpers locais (não exportados) ---
function handleExportCSV(units) {
    const headers = ["id", "name", "type", "location", "manager", "status", "sync", "iotHealth", "areaHa"];
    const rows = units.map(u => headers.map(h => JSON.stringify(u[h] ?? "")).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `fazendas_export_${new Date().toISOString()}.csv`; a.click(); URL.revokeObjectURL(url);
}
