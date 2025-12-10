// Gestão de Vendas (Lojas): Controlar as operações de varejo.
// layout: Lista de lojas → resumo de vendas e estoque. PDV (para visão geral das operações).
// Funcionalidades: Relatório de vendas por loja. Controle de estoque de cada loja. Ajuste centralizado de preços (se necessário).

"use client"
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Sliders, DownloadIcon, FileTextIcon, FileSpreadsheetIcon, Store, Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, Line, LineChart, } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { API_URL } from "@/lib/api";
import { usePerfilProtegido } from '@/hooks/usePerfilProtegido';
import { useAuth } from "@/contexts/AuthContext";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import AddLojaModal from '@/components/matriz/Unidades/Loja/AddLojaModal';

// corrige o caminho dos ícones padrão em bundlers modernos
if (typeof window !== 'undefined') {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
}

export default function LojasPage() {
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
    const [mapUnits, setMapUnits] = useState([]);

    // filtros avançados: tipos e status e local
    const [typeFilters, setTypeFilters] = useState({ Matriz: true, Fazenda: true, Loja: true }); // rascunho
    const [statusFilters, setStatusFilters] = useState({ Ativa: true, Inativa: true }); // rascunho
    const [locationQuery, setLocationQuery] = useState(''); // rascunho (responsável / área etc)

    // estados que efetivamente serão usados para filtrar (applied)
    const [draftTypeFilters, setDraftTypeFilters] = useState(typeFilters);
    const [draftStatusFilters, setDraftStatusFilters] = useState(statusFilters);
    const [draftLocationFilter, setDraftLocationFilter] = useState(""); // cidade/estado rascunho
    const [draftResponsibleQuery, setDraftResponsibleQuery] = useState("");
    const [citySuggestions, setCitySuggestions] = useState([]);
    const citySuggestTimer = useRef(null);
    const [draftCep, setDraftCep] = useState("");
    const [cepLoading, setCepLoading] = useState(false);
    const [cepError, setCepError] = useState("");
    const [cepPreenchido, setCepPreenchido] = useState(false);
    const [addLojaModalOpen, setAddLojaModalOpen] = useState(false);

    // filtros aplicados (só atualiza quando clicar em APLICAR)
    const [appliedFilters, setAppliedFilters] = useState({
        typeFilters: typeFilters,
        statusFilters: statusFilters,
        locationFilter: "",
        locationEstado: "",
        responsibleQuery: ""
    });

    useEffect(() => {
        setLoading(true);
        const t = setTimeout(() => setLoading(false), 350);
        return () => clearTimeout(t);
    }, []);

    // busca lista de lojas
    useEffect(() => {
        let mounted = true;

        async function fetchLojas() {
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
                // send status filters and type filters to backend as comma-separated lists
                const types = appliedFilters.typeFilters ? Object.entries(appliedFilters.typeFilters).filter(([, v]) => v).map(([k]) => k) : [];
                if (types.length > 0) params.set('tipos', types.join(','));
                const statuses = appliedFilters.statusFilters ? Object.entries(appliedFilters.statusFilters).filter(([, v]) => v).map(([k]) => k.toUpperCase()) : [];
                if (statuses.length > 0) params.set('status', statuses.join(','));
                params.set('page', String(page));
                params.set('perPage', String(perPage));
                params.set('orderBy', orderBy);

                const url = `${API_URL}unidades/lojas?${params.toString()}`;
                console.debug('[fetchLojas] GET', url);
                const res = await fetchWithAuth(url, { method: 'GET', credentials: 'include' });
                if (!res.ok) {
                    console.warn('[fetchLojas] resposta não OK', res.status);
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
                console.error('Erro ao carregar lojas:', err);
                if (mounted) {
                    setUnits([]);
                    setTotalResults(0);
                }
            } finally {if (mounted) setLoading(false);}
        }

        fetchLojas();
        return () => { mounted = false; };
    }, [fetchWithAuth, appliedFilters, page, perPage, query, orderBy]);

    // lista completa para o mapa (não afetada por filtros de busca/ordenar)
    useEffect(() => {
        let mounted = true;
        async function fetchMapUnits() {
            try {
                const res = await fetchWithAuth(`${API_URL}unidades/lojas`, { method: "GET", credentials: "include" });
                if (!res.ok) return;
                const body = await res.json().catch(() => null);
                const unidades = body?.unidades ?? body ?? [];
                if (mounted && Array.isArray(unidades)) {
                    setMapUnits(unidades.map(normalizeUnit));
                }
            } catch (err) {
                console.warn("[fetchMapUnits] erro", err);
            }
        }
        fetchMapUnits();
        return () => { mounted = false; };
    }, [fetchWithAuth]);

    // Buscar métricas de lojas (total, ativas, inativas, etc)
    useEffect(() => {
        let mounted = true;

        async function fetchMetrics() {
            try {
                // URL correta (conforme suas rotas backend)
                const url = `${API_URL}unidades/contar-lojas`;
                console.debug("[fetchMetrics] requesting", url);

                // usando seu fetchWithAuth (faz refresh se necessário)
                const res = await fetchWithAuth(url, { method: "GET", credentials: "include",
                    headers: { Accept: "application/json" } });

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

    // buscar unidade por id
    const router = useRouter();
    const prefetchCache = useRef(new Map());

    // Função para buscar CEP e preencher campos
    async function fetchCepAndFill(rawCep) {
        const digits = rawCep.replace(/\D/g, '');
        setCepError("");
        if (digits.length !== 8) return;
        try {
            setCepLoading(true);
            const res = await fetchWithAuth(`${API_URL}unidades/cep?cep=${digits}`, { method: 'GET' });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                setCepError(body?.erro || `Erro buscando CEP (${res.status})`);
                return;
            }
            const json = await res.json();
            if (!json?.sucesso) {
                setCepError(json?.erro || 'CEP não encontrado');
                return;
            }

            const { endereco: logradouro, complemento, bairro, cidade: localidade, estado: uf } = json;
            const enderecoMontado = [logradouro, bairro, complemento].filter(Boolean).join(", ");
            if (enderecoMontado) {
                setDraftLocationFilter(`${localidade}${uf ? ', ' + uf : ''}`);
            }
            if (localidade && uf) {
                setCepPreenchido(true);
            }
        } catch (err) {
            console.warn("Erro lookup CEP:", err);
            setCepError(typeof err === "string" ? err : err?.message || "Erro ao buscar CEP");
        } finally {
            setCepLoading(false);
        }
    }

    async function prefetchLoja(id) {
        if (!id || prefetchCache.current.has(id)) return;
        router.prefetch(`/matriz/unidades/lojas/${id}`);
        try {
            const url = `${API_URL}unidades/${id}`;
            const res = await fetchWithAuth(url);
            if (!res.ok) return;
            const body = await res.json().catch(() => null);
            prefetchCache.current.set(id, body);
            sessionStorage.setItem(`prefetched_loja_${id}`, JSON.stringify(body));
        } catch (e) { console.debug(e); }
    }

    // filtra somente lojas e aplica query + localização
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase(); // busca livre (mantém ativa)
        const locFilter = String(appliedFilters.locationFilter ?? "").trim().toLowerCase();
        const respFilter = String(appliedFilters.responsibleQuery ?? "").trim().toLowerCase();

        const statusAllowed = appliedFilters.statusFilters ?? { Ativa: true, Inativa: true };
        const typeAllowed = appliedFilters.typeFilters ?? { Matriz: true, Fazenda: true, Loja: true };

        return units.filter(u => {
            // tipo: ainda filtra apenas Lojas por padrão — mantenha se desejar
            const isLoja = String(u.type ?? "").toLowerCase() === "loja";

            // busca principal (query) continua ativa
            const matchQ =
                q === "" ||
                [u.name, u.location, u.manager, String(u.id)]
                    .some(f => String(f ?? "").toLowerCase().includes(q));

            // localização (aplicada apenas após clicar em aplicar)
            const matchLoc = locFilter === "" || String(u.location ?? "").toLowerCase().includes(locFilter);

            // responsável
            const matchResp = respFilter === "" || String(u.manager ?? "").toLowerCase().includes(respFilter);

            // status e tipo (usam appliedFilters)
            const matchStatus = !!statusAllowed[String(u.status) ?? "Ativa"];
            const matchType = !!typeAllowed[String(u.type) ?? "Loja"];

            return isLoja && matchQ && matchLoc && matchResp && matchStatus && matchType;
        });
    }, [units, query, appliedFilters]);

    const paged = useMemo(() => {
        const start = (page - 1) * perPage;
        return filtered.slice(start, start + perPage);
    }, [filtered, page, perPage]);

    // If backend provides `totalResults` then `units` is expected to contain
    // only the current page (server-side pagination). In that case render
    // `units` directly; otherwise render client-side paged results.
    const isServerPaged = !!(totalResults && totalResults > 0);
    const displayed = isServerPaged ? units : paged;

    function toggleSelect(id) {setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);}

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
            responsibleQuery: ''
        });
    }

    function selectAllOnPage() {
        const ids = displayed.map(u => u.id);
        const all = ids.every(id => selected.includes(id));
        setSelected(s => all ? s.filter(x => !ids.includes(x)) : [...new Set([...s, ...ids])]);
    }
    function bulkDelete() {
        setUnits(prev => prev.filter(u => !selected.includes(u.id)));
        setSelected([]);
    }

    // normalizador (mesma lógica que você já usa na fetchLojas)
    function formatTime(timeValue) {
        if (!timeValue) return '—';
        try {
            // Se for string
            if (typeof timeValue === 'string') {
                const trimmed = timeValue.trim();
                if (!trimmed) return '—';
                
                // Se for string ISO (ex: "1970-01-01T10:00" ou "1970-01-01T10:00:00.000Z")
                if (trimmed.includes('T')) {
                    const timePart = trimmed.split('T')[1];
                    if (timePart) {
                        // Remove timezone e milissegundos se existirem
                        const timeOnly = timePart.split('.')[0].split('Z')[0].split('+')[0];
                        const parts = timeOnly.split(':');
                        if (parts.length >= 2) {
                            const hours = parts[0].padStart(2, '0');
                            const minutes = parts[1].padStart(2, '0');
                            return `${hours}:${minutes}`;
                        }
                    }
                }
                
                // Se for string no formato HH:mm ou HH:mm:ss
                const parts = trimmed.split(':');
                if (parts.length >= 2) {
                    const hours = parts[0].padStart(2, '0');
                    const minutes = parts[1].padStart(2, '0');
                    return `${hours}:${minutes}`;
                }
            }
            // Se for Date/DateTime
            if (timeValue instanceof Date) {
                return timeValue.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            }
            // Se for objeto com horas/minutos
            if (typeof timeValue === 'object' && timeValue.hours !== undefined) {
                return `${String(timeValue.hours).padStart(2, '0')}:${String(timeValue.minutes || 0).padStart(2, '0')}`;
            }
        } catch (e) {
            console.warn('Erro ao formatar horário:', e);
        }
        return '—';
    }

    function formatDate(dateValue) {
        if (!dateValue) return '—';
        try {
            const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
            if (isNaN(date.getTime())) return '—';
            return date.toLocaleDateString('pt-BR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch (e) {
            console.warn('Erro ao formatar data:', e);
            return '—';
        }
    }

    function formatDateTime(dateValue) {
        if (!dateValue) return '—';
        try {
            const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
            if (isNaN(date.getTime())) return '—';
            return date.toLocaleString('pt-BR', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            console.warn('Erro ao formatar data/hora:', e);
            return '—';
        }
    }

    function normalizeUnit(u) {
        const rawType = String(u.tipo ?? u.type ?? '').trim();
        const type = rawType.length === 0 ? 'Loja'
            : rawType.toUpperCase() === 'LOJA' ? 'Loja'
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
            syncFormatado: formatDateTime(u.atualizadoEm ?? u.criadoEm),
            horarioAbertura: u.horarioAbertura ?? u.horario_abertura ?? null,
            horarioFechamento: u.horarioFechamento ?? u.horario_fechamento ?? null,
            horarioAberturaFormatado: formatTime(u.horarioAbertura ?? u.horario_abertura),
            horarioFechamentoFormatado: formatTime(u.horarioFechamento ?? u.horario_fechamento),
            latitude: u.latitude != null ? Number(u.latitude)
                : (u.lat != null ? Number(u.lat)
                    : (u.coordenadas ? Number(String(u.coordenadas).split(',')[0]) : null)),
            longitude: u.longitude != null ? Number(u.longitude)
                : (u.lng != null ? Number(u.lng)
                    : (u.coordenadas ? Number(String(u.coordenadas).split(',')[1]) : null)),
            raw: u
        };
    }

    // ---------------------------------------------------------------------
    // grafico de barras "Lojas com mais vendas"
    // ---------------------------------------------------------------------
    const LojasMaisVendas = [
        { month: "Loja 1", desktop: 18600, mobile: 8000 },
        { month: "Loja 2", desktop: 30500, mobile: 20000 },
        { month: "Loja 3", desktop: 23700, mobile: 12000 },
        { month: "Loja 4", desktop: 7300, mobile: 19000 },
        { month: "Loja 5", desktop: 20900, mobile: 13000 },
    ]

    const chartConfigLojasMaisVendas = {
        desktop: {
            label: "Vendas",
            color: "var(--chart-2)",
        },
        mobile: {
            label: "Mobile",
            color: "var(--chart-2)",
        },
        label: {color: "var(--background)",},
    }

    // ---------------------------------------------------------------------
    // grafico de linhas "Vendas semanais"
    // ---------------------------------------------------------------------
    const VendasSemanais = [
        { week: "Domingo", desktop: 21400 },
        { week: "Segunda-feira", desktop: 18600 },
        { week: "Terça-feira", desktop: 30500 },
        { week: "Quarta-feira", desktop: 23700 },
        { week: "Quinta-feira", desktop: 7300 },
        { week: "Sexta-feira", desktop: 20900 },
        { week: "Sábado", desktop: 21400 },
    ]
    const chartConfigVendasSemanais = {
        desktop: {
            label: "Vendas",
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

    const totalPages = Math.max(1, Math.ceil((totalResults && totalResults > 0 ? totalResults : filtered.length) / perPage));
    useEffect(() => {
        // sempre garante que a página atual seja válida quando filtros / perPage mudarem
        setPage(p => Math.min(Math.max(1, p), totalPages));
    }, [totalPages]);

    // callback quando modal criar loja com sucesso
    function handleCreated(novaUnidade) {
        try {
            const normalized = normalizeUnit(novaUnidade.unidade || novaUnidade);
            // evita duplicatas
            setUnits(prev => {
                if (prev.some(u => u.id === normalized.id)) return prev;
                return [normalized, ...prev];
            });
            // atualiza métricas
            setMetrics(prev => {
                const total = (prev.total || 0) + 1;
                const active = (prev.active || 0) + ((String(normalized.status).toUpperCase() === 'ATIVA') ? 1 : 0);
                const inactive = Math.max(0, total - active);
                return { total, active, inactive };
            });
            setPage(1);
        } catch (err) {
            console.error('handleCreated error', err);
        }
    }

    return (
        <div className="min-h-screen px-18 py-10 bg-surface-50">
            <div className="w-full">
                {/* METRICS */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <Card className={"gap-4 h-fit bg-white/5 backdrop-blur-sm border dark:border-white/10 border-black/10 transition"}>
                        <CardHeader><CardTitle>Total de Lojas</CardTitle></CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{metrics.total}</div>
                            <div className="text-sm text-muted-foreground mt-1">Total de unidades do tipo Loja</div>
                        </CardContent>
                    </Card>
                    <Card className={"gap-4 h-fit bg-white/5 backdrop-blur-sm border dark:border-white/10 border-black/10 transition"}>
                        <CardHeader><CardTitle>Ativas</CardTitle></CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{metrics.active}</div>
                            <div className="text-sm text-muted-foreground mt-1">Lojas com status Ativa</div>
                        </CardContent>
                    </Card>
                    <Card className={"gap-4 h-fit bg-white/5 backdrop-blur-sm border dark:border-white/10 border-black/10 transition"}>
                        <CardHeader><CardTitle>Inativas</CardTitle></CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{metrics.inactive}</div>
                            <div className="text-sm text-muted-foreground mt-1">Lojas com status Inativa</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters + cards */}
                <Card className={"mb-8"}>
                    <CardHeader>
                        <div className="flex items-center justify-between mb-4">
                            <CardTitle>Lista de Lojas</CardTitle>
                            <Button onClick={() => setAddLojaModalOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Nova Loja
                            </Button>
                        </div>
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
                                            <div className="text-sm text-neutral-400">{(totalResults && totalResults > 0) ? totalResults : filtered.length} resultados</div>
                                        </div>

                                        <div className="space-y-3">

                                            {/* STATUS */}
                                            <div>
                                                <div className="text-xs text-muted-foreground mb-1">Status</div>
                                                <div className="flex gap-2">
                                                    {["Ativa", "Inativa"].map(s => (
                                                        <label key={s} className="flex items-center gap-2 px-2 py-1 rounded dark:hover:bg-neutral-900 hover:bg-neutral-100 cursor-pointer">
                                                            <Checkbox checked={!!draftStatusFilters[s]} onCheckedChange={() => { setDraftStatusFilters(prev => ({ ...prev, [s]: !prev[s] }));}}/>
                                                            <div className="text-sm">{s}</div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <Separator />

                                            {/* LOCALIZAÇÃO */}
                                            <div>
                                                <div className="text-xs text-muted-foreground mb-1">Localização</div>
                                                <div className="space-y-2">
                                                    <div>
                                                        <Label className="text-xs mb-1">CEP</Label>
                                                        <Input 
                                                            placeholder="00000-000" 
                                                            value={draftCep} 
                                                            onChange={(e) => {
                                                                const v = e.target.value.replace(/\D/g, '').slice(0, 8);
                                                                const formatted = v.length > 5 ? `${v.slice(0, 5)}-${v.slice(5)}` : v;
                                                                setDraftCep(formatted);
                                                                setCepError("");
                                                                setCepPreenchido(false);
                                                                const digits = v;
                                                                if (digits.length === 8) {
                                                                    fetchCepAndFill(digits);
                                                                }
                                                            }}
                                                            onBlur={() => {
                                                                const digits = draftCep.replace(/\D/g, '');
                                                                if (digits.length === 8) {
                                                                    fetchCepAndFill(digits);
                                                                }
                                                            }}
                                                            disabled={cepPreenchido}
                                                        />
                                                        {cepLoading && <p className="text-xs text-muted-foreground mt-1">Buscando endereço...</p>}
                                                        {cepError && <p className="text-xs text-red-600 mt-1">{cepError}</p>}
                                                    </div>
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
                                                        }} disabled={cepPreenchido} />
                                                        {citySuggestions.length > 0 && !cepPreenchido && (
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
                                            </div>
                                            <Separator />
                                            {/* RESPONSAVEL */}
                                            <div>
                                                <div className="text-xs text-muted-foreground mb-1">Responsável</div>
                                                <Input placeholder="Filtrar por responsável" value={draftResponsibleQuery} onChange={(e) => { setDraftResponsibleQuery(e.target.value); }}/>
                                            </div>
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
                                                            responsibleQuery: draftResponsibleQuery
                                                        }); setPage(1); }}>
                                                        Aplicar
                                                    </Button>
                                                    <Button size="sm" variant="ghost" onClick={() => {
                                                        resetFilters();
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
                        ) : ( <div>
                                {/* Grid of cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                                    {displayed.map(u => (
                                        <Link key={u.id} href={`/matriz/unidades/lojas/${u.id}`} onMouseEnter={() => prefetchLoja(u.id)}>
                                            <div className="bg-card border dark:border-neutral-800 border-neutral-200 rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer">
                                                <div className="flex flex-col items-start justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                                    <Avatar>
                                                                        {u.raw?.imagemUrl || u.imagemUrl ? (
                                                                            <AvatarImage src={u.raw?.imagemUrl || u.imagemUrl} alt={u.name} />
                                                                        ) : (
                                                                            <AvatarFallback>{(() => {
                                                                                const parts = String(u.name || '').split(' ').filter(Boolean);
                                                                                const a = parts[0]?.[0] ?? '';
                                                                                const b = parts[1]?.[0] ?? '';
                                                                                const initials = (a + b).toUpperCase() || (String(u.name || '').slice(0,2).toUpperCase() || 'L');
                                                                                return initials;
                                                                            })()}</AvatarFallback>
                                                                        )}
                                                                    </Avatar>
                                                                    <div>
                                                            <div className="font-bold text-lg">{u.name}</div>
                                                            <div className="text-sm text-muted-foreground">{u.location}</div>
                                                        </div>
                                                    </div>
                                                    {u.horarioAberturaFormatado && u.horarioAberturaFormatado !== '—' && u.horarioFechamentoFormatado && u.horarioFechamentoFormatado !== '—' && (
                                                        <div className="flex flex-row gap-3 ">
                                                            <div className="text-base font-medium">Funcionamento: </div><div className="text-base font-normal">{u.horarioAberturaFormatado}h - {u.horarioFechamentoFormatado}h</div>
                                                        </div>
                                                    )}
                                                    {/* {u.horarioFechamentoFormatado && u.horarioFechamentoFormatado !== '—' && (
                                                        <div className="flex flex-row gap-3 ">
                                                            <div className="text-base font-medium">Fechamento: </div><div className="text-base font-normal">{u.horarioFechamentoFormatado}</div>
                                                        </div>
                                                    )} */}
                                                    <div className="flex flex-row gap-3 ">
                                                        <div className="text-base font-medium">Gerente: </div><div className="text-base font-normal">{u.manager || "—"}</div>
                                                    </div>
                                                </div>
                                                {/* {u.syncFormatado && u.syncFormatado !== '—' && (
                                                    <div className="mt-3 text-sm text-muted-foreground">Última sync: {u.syncFormatado}</div>
                                                )} */}
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Empty state */}
                                {displayed.length === 0 && !loading && (
                                    <div className="py-8 flex flex-col items-center gap-4 text-center text-muted-foreground">
                                        <Store size={50} />
                                        <p className="font-medium">Nenhuma loja encontrada.</p>
                                    </div>
                                )}

                            
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t dark:border-neutral-800 border-neutral-200">
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
                                    <SelectItem value="16">16</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="text-sm">Pág. {page} de {Math.max(1, Math.ceil((totalResults && totalResults > 0 ? totalResults : filtered.length) / perPage) || 1)}</div>

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
                </Card>
                <div className='mb-8'>
                    <Card>
                        <CardHeader><CardTitle>Mapa</CardTitle></CardHeader>
                        <CardContent>
                            <div className='h-100 rounded-md overflow-hidden z-0 relative'>
                                <MapContainer style={{ height: "100%", width: "100%" }} center={[-14.235004, -51.92528]} // fallback (centro do Brasil)
                                    zoom={4} scrollWheelZoom={false}>
                                    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

                                    { /* marcadores para unidades que possuam coordenadas válidas */}
                                    {mapUnits.filter(u => u.latitude != null && u.longitude != null).map(u => (
                                        <Marker key={u.id} position={[Number(u.latitude), Number(u.longitude)]}>
                                            <Popup>
                                                <div className="min-w-[200px]">
                                                    <div className="font-semibold">{u.name}</div>
                                                    <div className="text-sm text-muted-foreground">{u.location}</div>
                                                    {u.horarioAberturaFormatado && u.horarioAberturaFormatado !== '—' && <div className="text-xs">Abertura: {u.horarioAberturaFormatado}</div>}
                                                    {u.horarioFechamentoFormatado && u.horarioFechamentoFormatado !== '—' && <div className="text-xs">Fechamento: {u.horarioFechamentoFormatado}</div>}
                                                    <Link href={`/matriz/unidades/lojas/${u.id}`} className="text-blue-500 text-sm">Abrir</Link>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}

                                    <FitBounds markers={mapUnits.filter(u => u.latitude != null && u.longitude != null)} />
                                </MapContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* <div className="flex flex-row gap-8">
                    <div className="w-full">
                        <Card>
                            <CardHeader>
                                <CardTitle>Lojas com mais vendas</CardTitle>
                                <CardDescription>January - June 2024</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfigLojasMaisVendas}>
                                    <BarChart accessibilityLayer data={LojasMaisVendas} layout="vertical" margin={{ right: 16, }}>
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
                                <div className="text-muted-foreground leading-none">Vendas em R$
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                    <div className="w-full">
                        <Card>
                            <CardHeader>
                                <CardTitle>Vendas semanais</CardTitle>
                                <CardDescription>January - June 2024</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfigVendasSemanais}>
                                    <LineChart accessibilityLayer data={VendasSemanais} margin={{ left: 20, right: 20, }} >
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
                                    Vendas em R$
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div> */}

            </div>

            <AddLojaModal open={addLojaModalOpen} onOpenChange={setAddLojaModalOpen} onCreated={handleCreated} />
        </div>
    );
}

// --- helpers locais (não exportados) ---
function handleExportCSV(units) {
    const headers = ["id", "name", "type", "location", "manager", "status", "sync", "horarioAbertura", "horarioFechamento"];
    const rows = units.map(u => headers.map(h => JSON.stringify(u[h] ?? "")).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `lojas_export_${new Date().toISOString()}.csv`; a.click(); URL.revokeObjectURL(url);
}
