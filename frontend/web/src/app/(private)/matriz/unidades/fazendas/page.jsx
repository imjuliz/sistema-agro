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
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Sliders, DownloadIcon, FileTextIcon, FileSpreadsheetIcon, Tractor, Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, Line, LineChart, } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, } from "@/components/ui/dropdown-menu";
import { API_URL } from "@/lib/api";
import { usePerfilProtegido } from '@/hooks/usePerfilProtegido';
import { useAuth } from "@/contexts/AuthContext";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import AddFazendaModal from '@/components/matriz/Unidades/Fazenda/AddFazendaModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// corrige o caminho dos ícones padrão em bundlers modernos
if (typeof window !== 'undefined') {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
}

export default function FazendasPage() {
    usePerfilProtegido("GERENTE_MATRIZ");
    const { user, logout, fetchWithAuth } = useAuth();

    const [units, setUnits] = useState([]);
    const [query, setQuery] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(8);
    const [sheetUnit, setSheetUnit] = useState(null);
    const [metrics, setMetrics] = useState({ total: 0, active: 0, inactive: 0 });
    const [orderBy, setOrderBy] = useState('nome_asc');
    const [totalResults, setTotalResults] = useState(0);

    // filtros avançados: tipos e status e local
    const [typeFilters, setTypeFilters] = useState({ Matriz: true, Fazenda: true, Loja: true }); // rascunho
    const [statusFilters, setStatusFilters] = useState({ Ativa: true, Inativa: true }); // rascunho
    const [locationQuery, setLocationQuery] = useState(''); // rascunho (responsável / área etc)

    // estados que efetivamente serão usados para filtrar (applied)
    const [draftTypeFilters, setDraftTypeFilters] = useState(typeFilters);
    const [draftStatusFilters, setDraftStatusFilters] = useState(statusFilters);
    const [draftLocationFilter, setDraftLocationFilter] = useState(""); // cidade/estado rascunho
    const [draftResponsibleQuery, setDraftResponsibleQuery] = useState("");
    const [draftAreaQuery, setDraftAreaQuery] = useState("");
    const [citySuggestions, setCitySuggestions] = useState([]);
    const citySuggestTimer = useRef(null);

    // filtros aplicados (só atualiza quando clicar em APLICAR)
    const [appliedFilters, setAppliedFilters] = useState({
        typeFilters: typeFilters,
        statusFilters: statusFilters,
        locationFilter: "",
        locationEstado: "",
        responsibleQuery: "",
        areaQuery: ""
    });

    useEffect(() => {
        setLoading(true);
        const t = setTimeout(() => setLoading(false), 350);
        return () => clearTimeout(t);
    }, []);

    // busca lista de fazendas
    useEffect(() => {
        let mounted = true;

        async function fetchFazendas() {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (query) params.set('q', query);
                const loc = String(appliedFilters.locationFilter || '').trim();
                if (loc) params.set('cidade', loc);
                const estadoParam = String(appliedFilters.locationEstado || '').trim();
                if (estadoParam) params.set('estado', estadoParam);
                const resp = String(appliedFilters.responsibleQuery || '').trim();
                if (resp) params.set('responsible', resp);
                const area = String(appliedFilters.areaQuery || '').trim();
                if (area) params.set('minArea', area);
                // send status filters and type filters to backend as comma-separated lists
                const types = appliedFilters.typeFilters ? Object.entries(appliedFilters.typeFilters).filter(([, v]) => v).map(([k]) => k) : [];
                if (types.length > 0) params.set('tipos', types.join(','));
                const statuses = appliedFilters.statusFilters ? Object.entries(appliedFilters.statusFilters).filter(([, v]) => v).map(([k]) => k.toUpperCase()) : [];
                if (statuses.length > 0) params.set('status', statuses.join(','));
                params.set('page', String(page));
                params.set('perPage', String(perPage));
                params.set('orderBy', orderBy);

                const url = `${API_URL}unidades/fazendas?${params.toString()}`;
                console.debug('[fetchFazendas] GET', url);
                const res = await fetchWithAuth(url, { method: 'GET', credentials: 'include' });
                if (!res.ok) {
                    console.warn('[fetchFazendas] resposta não OK', res.status);
                    setUnits([]);
                    setTotalResults(0);
                    return;
                }
                const body = await res.json().catch(() => null);
                const unidades = body?.unidades ?? [];
                const total = body?.total ?? 0;
                if (Array.isArray(unidades) && unidades.length > 0) {
                    const normalized = unidades.map(normalizeUnit);
                    if (mounted) {
                        setUnits(normalized);
                        setTotalResults(total);
                    }
                } else {
                    if (mounted) {
                        setUnits([]);
                        setTotalResults(total);
                    }
                }
            } catch (err) {
                console.error('Erro ao carregar fazendas:', err);
                if (mounted) {
                    setUnits([]);
                    setTotalResults(0);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchFazendas();
        return () => { mounted = false; };
    }, [fetchWithAuth, appliedFilters, page, perPage, query, orderBy]);

    // Buscar métricas de fazendas (total, ativas, inativas, etc)
    useEffect(() => {
        let mounted = true;

        async function fetchMetrics() {
            try {
                // URL correta (conforme suas rotas backend)
                const url = `${API_URL}unidades/contar-fazendas`;
                console.debug("[fetchMetrics] requesting", url);

                // usando seu fetchWithAuth (faz refresh se necessário)
                const res = await fetchWithAuth(url, { method: "GET", credentials: "include", headers: { Accept: "application/json" } });

                console.debug("[fetchMetrics] status:", res.status);

                if (res.status === 401) {
                    console.warn("[fetchMetrics] 401 — não autorizado (cookie/refresh faltando)");
                    if (!mounted) return;
                    setMetrics({ total: 0, active: 0, inactive: 0 });
                    return;
                }

                const body = await res.json().catch(() => null);
                console.debug("[fetchMetrics] body:", body);

                // tenta vários formatos possíveis (fallbacks)
                const total = Number(body?.total ?? body?.count ?? body?.resultado?.total ?? 0) || 0;
                const active = Number(body?.ativas ?? body?.active ?? 0) || 0;
                const inactive = Number(body?.inativas ?? body?.inactive ?? Math.max(0, total - active)) || 0;

                // fallback se backend retornou uma lista em 'unidades'
                if (total === 0 && Array.isArray(body?.unidades)) {
                    if (!mounted) return;
                    setMetrics({
                        total: body.unidades.length,
                        active: Number(body.unidades.filter(u => String(u.status).toUpperCase() === 'ATIVA').length) || 0,
                        inactive: Number(body.unidades.filter(u => String(u.status).toUpperCase() === 'INATIVA').length) || 0
                    });
                    return;
                }

                if (!mounted) return;
                setMetrics({ total, active, inactive });
            } catch (err) {
                console.error("[fetchMetrics] erro:", err);
                if (mounted) setMetrics({ total: 0, active: 0, inactive: 0 });
            }
        }

        fetchMetrics();
        return () => { mounted = false; };
    }, [fetchWithAuth]); // depende do fetchWithAuth

    // buscar ynidade por id
    const router = useRouter();
    const prefetchCache = useRef(new Map());

    async function prefetchFazenda(id) {
        if (!id || prefetchCache.current.has(id)) return;
        router.prefetch(`/matriz/unidades/fazendas/${id}`);
        try {
            const url = `${API_URL}unidades/${id}`;
            const res = await fetchWithAuth(url);
            if (!res.ok) return;
            const body = await res.json().catch(() => null);
            prefetchCache.current.set(id, body);
            sessionStorage.setItem(`prefetched_fazenda_${id}`, JSON.stringify(body));
        } catch (e) { console.debug(e); }
    }

    // filtra somente fazendas e aplica query + localização
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase(); // busca livre (mantém ativa)
        const locFilter = String(appliedFilters.locationFilter ?? "").trim().toLowerCase();
        const respFilter = String(appliedFilters.responsibleQuery ?? "").trim().toLowerCase();
        const areaFilter = String(appliedFilters.areaQuery ?? "").trim().toLowerCase();

        const statusAllowed = appliedFilters.statusFilters ?? { Ativa: true, Inativa: true };
        const typeAllowed = appliedFilters.typeFilters ?? { Matriz: true, Fazenda: true, Loja: true };

        return units.filter(u => {
            // tipo: ainda filtra apenas Fazendas por padrão — mantenha se desejar
            const isFazenda = String(u.type ?? "").toLowerCase() === "fazenda";

            // busca principal (query) continua ativa
            const matchQ =
                q === "" ||
                [u.name, u.location, u.manager, String(u.id)]
                    .some(f => String(f ?? "").toLowerCase().includes(q));

            // localização (aplicada apenas após clicar em aplicar)
            const matchLoc = locFilter === "" || String(u.location ?? "").toLowerCase().includes(locFilter);

            // responsável
            const matchResp = respFilter === "" || String(u.manager ?? "").toLowerCase().includes(respFilter);

            // área (você pode ajustar lógica numérica se quiser comparar ranges)
            const matchArea = areaFilter === "" || String(u.areaHa ?? "").toLowerCase().includes(areaFilter);

            // status e tipo (usam appliedFilters)
            const matchStatus = !!statusAllowed[String(u.status) ?? "Ativa"];
            const matchType = !!typeAllowed[String(u.type) ?? "Fazenda"];

            return isFazenda && matchQ && matchLoc && matchResp && matchArea && matchStatus && matchType;
        });
    }, [units, query, appliedFilters]);

    const paged = useMemo(() => {
        const start = (page - 1) * perPage;
        return filtered.slice(start, start + perPage);
    }, [filtered, page, perPage]);

    function toggleSelect(id) {
        setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
    }

    function toggleStatus(status) {
        setStatusFilters(prev => ({
            ...prev,
            [status]: !prev[status]
        }));
    }

    function resetFilters() {
        setQuery("");
        setLocationFilter("");
        setLocationQuery("");
        setStatusFilters({ Ativa: true, Inativa: true });
        setTypeFilters({ Matriz: true, Fazenda: true, Loja: true });
        setPage(1);
        // clear drafts and applied filters as well
        setDraftAreaQuery('');
        setDraftLocationFilter('');
        setDraftResponsibleQuery('');
        setDraftStatusFilters({ Ativa: true, Inativa: true });
        setDraftTypeFilters({ Matriz: true, Fazenda: true, Loja: true });
        setCitySuggestions([]);
        setAppliedFilters({
            typeFilters: { Matriz: true, Fazenda: true, Loja: true },
            statusFilters: { Ativa: true, Inativa: true },
            locationFilter: '',
            locationEstado: '',
            responsibleQuery: '',
            areaQuery: ''
        });
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

    // estado para controlar modal
    const [openAddFazenda, setOpenAddFazenda] = useState(false);

    // normalizador (mesma lógica que você já usa na fetchFazendas)
    function normalizeUnit(u) {
        const rawType = String(u.tipo ?? u.type ?? '').trim();
        const type = rawType.length === 0 ? 'Fazenda'
            : rawType.toUpperCase() === 'FAZENDA' ? 'Fazenda'
                : rawType[0]?.toUpperCase() + rawType.slice(1).toLowerCase();

        const rawStatus = String(u.status ?? '').trim();
        const status = rawStatus.length === 0 ? 'Ativa'
            : rawStatus.toUpperCase() === 'ATIVA' ? 'Ativa'
                : rawStatus[0]?.toUpperCase() + rawStatus.slice(1).toLowerCase();

        return {
            id: Number(u.id),
            name: u.nome ?? u.name ?? String(u.id),
            type,
            location: (u.cidade ? `${u.cidade}${u.estado ? ', ' + u.estado : ''}` : (u.location ?? "")),
            manager: (u.gerente?.nome ?? u.gerente ?? u.manager ?? "—"),
            status,
            sync: u.atualizadoEm ?? u.criadoEm ?? new Date().toISOString(),
            areaHa: u.areaProdutiva ? Number(u.areaProdutiva) : (u.areaHa ?? 0),
            latitude: u.latitude != null ? Number(u.latitude)
                : (u.lat != null ? Number(u.lat)
                    : (u.coordenadas ? Number(String(u.coordenadas).split(',')[0]) : null)),
            longitude: u.longitude != null ? Number(u.longitude)
                : (u.lng != null ? Number(u.lng)
                    : (u.coordenadas ? Number(String(u.coordenadas).split(',')[1]) : null))
        };
    }

    // callback quando modal criar fazenda com sucesso
    function handleCreated(novaUnidade) {
        try {
            const normalized = normalizeUnit(novaUnidade);
            // evita duplicatas (se por acaso já existe)
            setUnits(prev => {
                if (prev.some(u => u.id === normalized.id)) return prev;
                return [normalized, ...prev];
            });
            // atualiza métricas rápido (incrementa total e, se ativa, incrementa active)
            setMetrics(prev => {
                const total = (prev.total || 0) + 1;
                const active = (prev.active || 0) + ((String(normalized.status).toUpperCase() === 'ATIVA') ? 1 : 0);
                const inactive = Math.max(0, total - active);
                return { total, active, inactive };
            });
            // opcional: ir para primeira página para ver novo item
            setPage(1);
        } catch (err) {
            console.error('handleCreated error', err);
        }
    }


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

    function FitBounds({ markers }) {
        const map = useMap();
        useEffect(() => {
            if (!map) return;
            const coords = markers.map(m => [Number(m.latitude), Number(m.longitude)]);
            if (coords.length === 0) return;
            const bounds = L.latLngBounds(coords);
            map.fitBounds(bounds, { padding: [40, 40] }); // ajusta zoom/centro para todos os pins
        }, [map, markers]);
        return null;
    }

    const totalPages = Math.max(1, Math.ceil(units.length / perPage));
    useEffect(() => {
        // sempre garante que a página atual seja válida quando filtros / perPage mudarem
        setPage(p => Math.min(Math.max(1, p), totalPages));
    }, [totalPages]);

    return (
        <div className="min-h-screen px-18 py-10 bg-surface-50">
            <div className="w-full">
                {/* METRICS */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <Card className={"gap-4 h-fit bg-white/5 backdrop-blur-sm border dark:border-white/10 border-black/10 transition"}>
                        <CardHeader><CardTitle>Total de Fazendas</CardTitle></CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{metrics.total}</div>
                            <div className="text-sm text-muted-foreground mt-1">Total de unidades do tipo Fazenda</div>
                        </CardContent>
                    </Card>

                    <Card className={"gap-4 h-fit bg-white/5 backdrop-blur-sm border dark:border-white/10 border-black/10 transition"}>
                        <CardHeader><CardTitle>Ativas</CardTitle></CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{metrics.active}</div>
                            <div className="text-sm text-muted-foreground mt-1">Fazendas com status Ativa</div>
                        </CardContent>
                    </Card>

                    <Card className={"gap-4 h-fit bg-white/5 backdrop-blur-sm border dark:border-white/10 border-black/10 transition"}>
                        <CardHeader><CardTitle>Inativas</CardTitle></CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{metrics.inactive}</div>
                            <div className="text-sm text-muted-foreground mt-1">Fazendas com status Inativa</div>
                        </CardContent>
                    </Card>

                </div>

                {/* Filters + cards */}
                <Card className={"mb-8"}>
                    <CardHeader>
                        <CardTitle className={"mb-4"}>Lista de Fazendas</CardTitle>
                        <div className="flex items-center justify-between pb-3 border-b dark:border-neutral-800 border-neutral-200">
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

                                            {/* STATUS */}
                                            <div>
                                                <div className="text-xs text-muted-foreground mb-1">Status</div>
                                                <div className="flex gap-2">
                                                    {["Ativa", "Inativa"].map(s => (
                                                        <label key={s} className="flex items-center gap-2 px-2 py-1 rounded dark:hover:bg-neutral-900 hover:bg-neutral-100 cursor-pointer">
                                                            <Checkbox
                                                                checked={!!draftStatusFilters[s]}
                                                                onCheckedChange={() => {
                                                                    setDraftStatusFilters(prev => ({ ...prev, [s]: !prev[s] }));
                                                                }}
                                                            />
                                                            <div className="text-sm">{s}</div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <Separator />

                                            {/* LOCALIZAÇÃO */}
                                            <div>
                                                <div className="text-xs text-muted-foreground mb-1">Localização</div>
                                                <div className="relative">
                                                    <Input placeholder="Filtrar por cidade / estado" value={draftLocationFilter} onChange={(e) => {
                                                        const v = e.target.value;
                                                        setDraftLocationFilter(v);
                                                        setPage(1);
                                                        // debounce suggestions
                                                        if (citySuggestTimer.current) clearTimeout(citySuggestTimer.current);
                                                        citySuggestTimer.current = setTimeout(async () => {
                                                            try {
                                                                const q = v.trim();
                                                                if (!q || q.length < 2) { setCitySuggestions([]); return; }
                                                                const url = `${API_URL}unidades/cidades?query=${encodeURIComponent(q)}&limit=10`;
                                                                const res = await fetchWithAuth(url);
                                                                if (!res.ok) { setCitySuggestions([]); return; }
                                                                const body = await res.json().catch(() => null);
                                                                setCitySuggestions(body?.suggestions ?? []);
                                                            } catch (err) { console.error('sugestões erro', err); setCitySuggestions([]); }
                                                        }, 300);
                                                    }} />
                                                    {citySuggestions.length > 0 && (
                                                        <div className="absolute z-40 mt-1 w-full bg-card border rounded shadow max-h-48 overflow-auto">
                                                            {citySuggestions.map((s, idx) => (
                                                                <div key={idx} className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer" onClick={() => { setDraftLocationFilter(`${s.cidade}${s.estado ? ', ' + s.estado : ''}`); setCitySuggestions([]); }}>
                                                                    <div className="text-sm">{s.cidade}{s.estado ? `, ${s.estado}` : ''}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <Separator />
                                            {/* RESPONSAVEL - ainda nn funciona */}
                                            <div>
                                                <div className="text-xs text-muted-foreground mb-1">Responsável</div>
                                                <Input
                                                    placeholder="Filtrar por responsável"
                                                    value={draftResponsibleQuery}
                                                    onChange={(e) => { setDraftResponsibleQuery(e.target.value); }}
                                                />
                                            </div>

                                            <Separator />
                                            {/* Area */}
                                            {/* <div>
                                                <div className="text-xs text-muted-foreground mb-1">Área</div>
                                                <Input
                                                    placeholder="Filtrar por área (ha)"
                                                    value={draftAreaQuery}
                                                    onChange={(e) => { 
                                                        // aceita apenas números (garantia do usuário)
                                                        const digits = String(e.target.value || '').replace(/\D/g, '');
                                                        setDraftAreaQuery(digits);
                                                    }}
                                                />

                                            </div> */}

                                            {/* APLICAR / RESET */}
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Button size="sm" onClick={() => {
                                                        // parse draftLocationFilter which may contain "Cidade, ESTADO"
                                                        const parts = String(draftLocationFilter || '').split(',').map(s => s.trim()).filter(Boolean);
                                                        const cidade = parts[0] || '';
                                                        const estado = parts[1] || '';

                                                        setAppliedFilters({
                                                            typeFilters: draftTypeFilters,
                                                            statusFilters: draftStatusFilters,
                                                            locationFilter: cidade,
                                                            locationEstado: estado,
                                                            responsibleQuery: draftResponsibleQuery,
                                                            areaQuery: draftAreaQuery
                                                        });
                                                        setPage(1);
                                                    }}
                                                    >
                                                        Aplicar
                                                    </Button>

                                                    <Button size="sm" variant="ghost" onClick={() => {
                                                        resetFilters();
                                                        setDraftAreaQuery('');
                                                        setDraftLocationFilter('');
                                                        setDraftResponsibleQuery('');
                                                        setCitySuggestions([]);
                                                    }}>Limpar</Button>
                                                </div>
                                            </div>

                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                                            <span className="text-sm">Ordenar Por</span>
                                            <div className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded dark:bg-neutral-800 bg-neutral-200 dark:text-neutral-300 text-neutral-700 text-xs">
                                                {orderBy === 'nome_asc' ? 'AZ' : orderBy === 'nome_desc' ? 'ZA' : orderBy === 'mais_recente' ? 'REC' : 'ANT'}
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align='start'>
                                        <DropdownMenuItem onClick={() => { setOrderBy('nome_asc'); setPage(1); }}>
                                            A - Z (Nome)
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => { setOrderBy('nome_desc'); setPage(1); }}>
                                            Z - A (Nome)
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => { setOrderBy('mais_recente'); setPage(1); }}>
                                            Mais Recente
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => { setOrderBy('mais_antigo'); setPage(1); }}>
                                            Mais Antigo
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <div className="flex items-center gap-2 ml-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant='outline' size='sm'>
                                                <DownloadIcon className='mr-2 h-4 w-4' />
                                                Exportar
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align='end'>
                                            <DropdownMenuItem onClick={() => handleExportCSV(units)}>
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

                                <Button
                                    variant=""
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={() => setOpenAddFazenda(true)}
                                >
                                    <span className="flex flex-row gap-3 items-center text-sm"><Plus />Adicionar fazenda</span>
                                </Button>

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
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                                    {units.map(u => (
                                        <Link key={u.id} href={`/matriz/unidades/fazendas/${u.id}`} onMouseEnter={() => prefetchFazenda(u.id)}>
                                            <div className="bg-card border dark:border-neutral-800 border-neutral-200 rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer">
                                                <div className="flex flex-col items-start justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar><AvatarFallback>F</AvatarFallback></Avatar>
                                                        <div>
                                                            <div className="font-bold text-lg">{u.name}</div>
                                                            <div className="text-sm text-muted-foreground">{u.location}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-row gap-3 ">
                                                        <div className="text-base font-medium">Área: </div><div className="text-base font-normal">{u.areaHa} ha</div>
                                                    </div>
                                                    <div className="flex flex-row gap-3 ">
                                                        <div className="text-base font-medium">Gerente: </div><div className="text-base font-normal">{u.areaHa} ha</div>
                                                    </div>
                                                </div>
                                                {/* <div className="mt-3 text-sm text-muted-foreground">Última sync: {new Date(u.sync).toLocaleString()}</div> */}
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Empty state */}
                                {units.length === 0 && !loading && (
                                    <div className="py-8 flex flex-col items-center gap-4 text-center text-muted-foreground">
                                        <Tractor size={50} />
                                        <p className="font-medium">Nenhuma fazenda encontrada.</p>
                                    </div>
                                )}

                                {/* Pagination controls */}
                                {units.length > 0 && (
                                    // <div className="mt-6 flex items-center justify-between">
                                    //     <div className="text-sm text-muted-foreground">
                                    //         Página <span className="font-semibold">{page}</span> de{' '}
                                    //         <span className="font-semibold">{Math.ceil(totalResults / perPage) || 1}</span>
                                    //         {' '} ({totalResults} resultado{totalResults !== 1 ? 's' : ''})
                                    //     </div>
                                    //     <div className="flex items-center gap-2">
                                    //         <Button
                                    //             variant="outline"
                                    //             size="sm"
                                    //             onClick={() => setPage(p => Math.max(1, p - 1))}
                                    //             disabled={page === 1}
                                    //         >
                                    //             <ChevronLeft className="h-4 w-4" />
                                    //             Anterior
                                    //         </Button>
                                    //         <div className="flex items-center gap-1">
                                    //             {[...Array(Math.min(5, Math.ceil(totalResults / perPage)))].map((_, i) => {
                                    //                 const totalPages = Math.ceil(totalResults / perPage);
                                    //                 let pageNum;
                                    //                 if (totalPages <= 5) {
                                    //                     pageNum = i + 1;
                                    //                 } else if (page <= 3) {
                                    //                     pageNum = i + 1;
                                    //                 } else if (page >= totalPages - 2) {
                                    //                     pageNum = totalPages - 4 + i;
                                    //                 } else {
                                    //                     pageNum = page - 2 + i;
                                    //                 }
                                    //                 return (
                                    //                     <Button
                                    //                         key={pageNum}
                                    //                         variant={pageNum === page ? "default" : "outline"}
                                    //                         size="sm"
                                    //                         onClick={() => setPage(pageNum)}
                                    //                     >
                                    //                         {pageNum}
                                    //                     </Button>
                                    //                 );
                                    //             })}
                                    //         </div>
                                    //         <Button
                                    //             variant="outline"
                                    //             size="sm"
                                    //             onClick={() => setPage(p => Math.min(Math.ceil(totalResults / perPage), p + 1))}
                                    //             disabled={page >= Math.ceil(totalResults / perPage)}
                                    //         >
                                    //             Próximo
                                    //             <ChevronRight className="h-4 w-4" />
                                    //         </Button>
                                    //     </div>
                                    //     <div className="flex items-center gap-2">
                                    //         <span className="text-sm text-muted-foreground">Por página:</span>
                                    //         <select
                                    //             value={perPage}
                                    //             onChange={(e) => {
                                    //                 setPerPage(Number(e.target.value));
                                    //                 setPage(1);
                                    //             }}
                                    //             className="px-2 py-1 border rounded text-sm dark:bg-neutral-900 dark:border-neutral-700"
                                    //         >
                                    //             <option value="8">8</option>
                                    //             <option value="16">16</option>
                                    //             <option value="25">25</option>
                                    //             <option value="50">50</option>
                                    //         </select>
                                    //     </div>
                                    // </div>
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
                                                    <SelectItem value="4">4</SelectItem>
                                                    <SelectItem value="8">8</SelectItem>
                                                    <SelectItem value="12">12</SelectItem>
                                                    <SelectItem value="20">20</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <div className="text-sm">Pág. {page} de {Math.max(1, Math.ceil(units.length / perPage) || 1)}</div>

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
                                )}
                            </div>
                        )}
                    </CardContent>

                </Card>

                <div className='mb-8'>
                    <Card>
                        <CardHeader><CardTitle>Mapa</CardTitle></CardHeader>
                        <CardContent>
                            <div className='h-100 rounded-md overflow-hidden z-0 relative'>
                                <MapContainer
                                    style={{ height: "100%", width: "100%" }}
                                    center={[-14.235004, -51.92528]} // fallback (centro do Brasil)
                                    zoom={4}
                                    scrollWheelZoom={false}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />

                                    { /* marcadores para unidades que possuam coordenadas válidas */}
                                    {units.filter(u => u.latitude != null && u.longitude != null).map(u => (
                                        <Marker key={u.id} position={[Number(u.latitude), Number(u.longitude)]}>
                                            <Popup>
                                                <div className="min-w-[200px]">
                                                    <div className="font-semibold">{u.name}</div>
                                                    <div className="text-sm text-muted-foreground">{u.location}</div>
                                                    <div className="text-xs">Área: {u.areaHa ?? '—'} ha</div>
                                                    <Link href={`/matriz/unidades/fazendas/${u.id}`} className="text-blue-500 text-sm">Abrir</Link>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}

                                    <FitBounds markers={units.filter(u => u.latitude != null && u.longitude != null)} />
                                </MapContainer>
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

            {/* Add Fazenda Modal */}
            <AddFazendaModal
                open={openAddFazenda}
                onOpenChange={(v) => setOpenAddFazenda(v)}
                onCreated={handleCreated}
                className="z-[999]"
            />

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
