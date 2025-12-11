"use client"
import * as React from 'react';
import { useState, useEffect } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/config';
import { toast } from 'sonner';
import { CartesianGrid, Line, LineChart, XAxis, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { IconTrendingDown, IconArrowLeft, IconArrowRight } from "@tabler/icons-react"

// ui
import { Card, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"
import { Item, ItemContent, ItemDescription, ItemTitle, ItemActions } from "@/components/ui/item"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"

// mui
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { BarChart } from '@mui/x-charts/BarChart';
import { Transl } from '../TextoTraduzido/TextoTraduzido';

// Small helper to robustly extract array from various backend shapes
function extractArrayFromResponse(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    // common top-level names we expect
    if (Array.isArray(data.loteVegetais)) return data.loteVegetais;
    if (Array.isArray(data.lotesVegetais)) return data.lotesVegetais;
    if (Array.isArray(data.lotesAnimalia)) return data.lotesAnimalia;
    if (Array.isArray(data.loteAnimalia)) return data.loteAnimalia;
    if (Array.isArray(data.lotes)) return data.lotes;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.lotesVegetais?.loteVegetais)) return data.lotesVegetais.loteVegetais;
    if (Array.isArray(data.loteVegetais?.loteVegetais)) return data.loteVegetais.loteVegetais;

    // If the API wraps the array inside an object (e.g. { lotesAnimalia: { lotes: [...] } })
    // try to find the first array value in the object recursively (shallow search)
    if (typeof data === 'object') {
        for (const key of Object.keys(data)) {
            const val = data[key];
            if (Array.isArray(val)) return val;
            // nested object that may contain the array under a secondary key
            if (val && typeof val === 'object') {
                for (const subKey of Object.keys(val)) {
                    const subVal = val[subKey];
                    if (Array.isArray(subVal)) return subVal;
                }
            }
        }
    }

    return [];
}

// Formata uma data para `dd/mm/aaaa` (sem horário)
function formatDateShort(value) {
    if (!value) return '-';
    const d = new Date(value);
    if (!d || isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function SectionCards() {
    const { user, fetchWithAuth } = useAuth();
    const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
    const [totalLotes, setTotalLotes] = useState(null);
    const [lotesProntosVenda, setLotesProntosVenda] = useState(null);
    const [lotesImprorios, setLotesImprorios] = useState(null);
    const [quantidadeAnimais, setQuantidadeAnimais] = useState(null);

    useEffect(() => {
        let mounted = true;
        async function loadAllCounts() {
            if (!unidadeId) return;
            const fetchFn = fetchWithAuth || fetch;
            try {
                // normalize API base to avoid missing or double slashes
                const base = String(API_URL || '/api').replace(/\/$/, '');

                // diagnostic log: unidadeId may be undefined while auth loads
                console.log('[SectionCards] debug start', { unidadeId, API_URL, hasFetchWithAuth: !!fetchWithAuth, base });

                if (!unidadeId) {
                    console.log('[SectionCards] unidadeId ausente — pulando fetch (aguardando auth)');
                    return;
                }

                const urls = [
                    `${base}/totalLotesAnimalia/${unidadeId}`,
                    `${base}/lotesAnimaliaDisponiveis/${unidadeId}`,
                    `${base}/lotesAnimaliaImproprios/${unidadeId}`,
                    `${base}/contarAnimais/${unidadeId}`,
                ];

                const [resTotal, resProntos, resImpr, resAnimais] = await Promise.all(urls.map(u => fetchFn(u)));

                // log statuses for debugging
                try { console.log('[SectionCards] fetch statuses', urls.map((u, i) => ({ url: u, ok: [resTotal, resProntos, resImpr, resAnimais][i].ok, status: [resTotal, resProntos, resImpr, resAnimais][i].status }))); } catch (e) { }

                const results = await Promise.all([
                    resTotal.json().catch(() => ({})),
                    resProntos.json().catch(() => ({})),
                    resImpr.json().catch(() => ({})),
                    resAnimais.json().catch(() => ({})),
                ]);

                if (!mounted) return;

                console.log('[SectionCards] fetch results', results);

                // totalLotesAnimalia: expect { sucesso: true, quantidade } (sometimes nested)
                const totalRaw = extractNumericQuantity(results[0]);
                const parsedTotal = Number.isFinite(Number(totalRaw)) ? Number(totalRaw) : 0;
                setTotalLotes(parsedTotal);

                // lotes prontos venda
                const prontosRaw = extractNumericQuantity(results[1]);
                const parsedProntos = Number.isFinite(Number(prontosRaw)) ? Number(prontosRaw) : 0;
                setLotesProntosVenda(parsedProntos);

                // lotes improprios: may be array or nested object
                const imprRaw = extractNumericQuantity(results[2]);
                const parsedImpr = Number.isFinite(Number(imprRaw)) ? Number(imprRaw) : 0;
                setLotesImprorios(parsedImpr);

                // contarAnimais
                const animaisRaw = extractNumericQuantity(results[3]);
                const parsedAnimais = Number.isFinite(Number(animaisRaw)) ? Number(animaisRaw) : 0;
                setQuantidadeAnimais(parsedAnimais);

                console.log('[SectionCards] parsed values', { total: parsedTotal, prontos: parsedProntos, impr: parsedImpr, animais: parsedAnimais });

            } catch (err) {
                console.error('Erro carregando contadores dos cards:', err);
                if (!mounted) return;
                setTotalLotes(0);
                setLotesProntosVenda(0);
                setLotesImprorios(0);
                setQuantidadeAnimais(0);
            }
        }
        loadAllCounts();
        return () => { mounted = false }
    }, [unidadeId, fetchWithAuth]);

    return (
        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8 px-8 min-w-[20%] mx-auto w-full mb-10">
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription><Transl>Quantidade total de lotes</Transl></CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{totalLotes ?? '-'}</CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium"><Transl>Total de lotes de Animalia</Transl></div>
                    <div className="text-muted-foreground"><Transl>Resumo</Transl></div>
                </CardFooter>
            </Card>

            <Card className="@container/card">
                <CardHeader>
                    <CardDescription><Transl>Lotes prontos para venda</Transl></CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{lotesProntosVenda ?? '-'}</CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium"><Transl>Lotes de Animalia com status PRONTO</Transl></div>
                    <div className="text-muted-foreground"><Transl>Pronto para venda</Transl></div>
                </CardFooter>
            </Card>

            <Card className="@container/card">
                <CardHeader>
                    <CardDescription><Transl>Lotes impróprios</Transl></CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{lotesImprorios ?? '-'}</CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium"><Transl>Lotes de Animalia marcados como impróprios</Transl></div>
                    <div className="text-muted-foreground"><Transl>Atenção sanitária</Transl></div>
                </CardFooter>
            </Card>

            <Card className="@container/card">
                <CardHeader>
                    <CardDescription><Transl>Produção média por cultura</Transl></CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{quantidadeAnimais ?? '-'}</CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium"><Transl>Quantidade de animais na unidade</Transl></div>
                    <div className="text-muted-foreground"><Transl>Contagem de animais</Transl></div>
                </CardFooter>
            </Card>
        </div>
    );
}

//grafico de barras
export function GraficoDeBarras() {
    return (
        <BarChart xAxis={[{ data: ['Vegetais', 'Frutas', 'Animália'], scaleType: 'band' }]} series={[{ data: [4, 3, 5], color: '#99BF0F' }, { data: [1, 6, 3], color: '#738C16' },]} height={650} barLabel="value" margin={{ left: 0 }} yAxis={[{ width: 50 }]} />
    );
}

export function ChartPieLotesAnimalia() {
    const { user, fetchWithAuth } = useAuth();
    const [fetchedData, setFetchedData] = useState([]);
    const [loading, setLoading] = useState(false);

    const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            try {
                if (!unidadeId) {
                    console.warn('[ChartPieLotesAnimalia] unidadeId ausente — usando dados de demonstração');
                    return;
                }

                const fetchFn = fetchWithAuth || fetch;
                const res = await fetchFn(`${API_URL}/lotesAnimaliaPorTipo/${unidadeId}`);
                const data = await res.json().catch(() => ({}));
                if (!mounted) return;

                if (res.ok && data.sucesso && Array.isArray(data.lotesPorTipo)) {
                    const mapped = data.lotesPorTipo
                        .filter((it) => it && it._count && Number(it._count.tipo) > 0)
                        .map((it) => ({ name: it.tipo || 'OUTRO', value: Number(it._count.tipo) }));
                    setFetchedData(mapped);
                } else {
                    console.warn('Chart fetch returned no data or unexpected shape:', data);
                    setFetchedData([]);
                }
            } catch (err) {
                console.error('Erro ao carregar dados do chart de lotes por tipo:', err);
                setFetchedData([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => { mounted = false };
    }, [unidadeId, fetchWithAuth]);

    const dataToUse = Array.isArray(fetchedData) ? fetchedData : [];
    const total = dataToUse.reduce((s, item) => s + (Number(item.value) || 0), 0);
    const colors = ['#738C16', '#99BF0F', '#F59E0B', '#EF4444', '#6366F1', '#06B6D4', '#8B5CF6', '#F472B6', '#10B981'];

    return (
        <Card className="flex flex-col w-full max-w-[700px] h-[520px]">
            <CardHeader className="items-center pb-0">
                <CardTitle><Transl>Lotes por tipo</Transl></CardTitle>
                <CardDescription>{loading ? 'Carregando...' : `${total} lote(s)`}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 py-2 flex flex-col items-center justify-center">
                <ChartContainer config={{ visitors: { label: 'Lotes', color: '#738C16' } }} className="w-[95%] h-[86%] flex items-center justify-center">
                    {/* Wrapper limits max height so the chart can grow but won't be clipped by surrounding layout */}
                    <div className="w-full h-full max-h-[440px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                {/* Use larger percentage radii so the donut is visually bigger on larger screens */}
                                <Pie data={dataToUse} dataKey="value" nameKey="name" innerRadius="45%" outerRadius="72%">
                                    {dataToUse.map((entry, idx) => (
                                        <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-wrap gap-2 items-center justify-center px-4 py-1">
                <div className="flex flex-wrap gap-3 items-center justify-center text-xs">
                    {dataToUse && dataToUse.length > 0 ? (
                        dataToUse.map((d, i) => (
                            <div key={`legend-${i}`} className="flex items-center gap-2 px-1">
                                <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                                <span className="text-xs text-muted-foreground">{d.name} ({d.value})</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-xs text-muted-foreground">Nenhum dado</div>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}

export function ItemVariant() {
    return (
        <div className="flex flex-col gap-6">
            <Item>
                <ItemContent>
                    <ItemTitle><Transl>Default Variant</Transl></ItemTitle>
                    <ItemDescription><Transl>Standard styling with subtle background and borders.</Transl></ItemDescription>
                </ItemContent>
                <ItemActions><Button variant="outline" size="sm"><Transl>Open</Transl></Button></ItemActions>
            </Item>

            <Item variant="outline">
                <ItemContent>
                    <ItemTitle><Transl>Outline Variant</Transl></ItemTitle>
                    <ItemDescription><Transl>Outlined style with clear borders and transparent background.</Transl></ItemDescription>
                </ItemContent>
                <ItemActions><Button variant="outline" size="sm"><Transl>Open</Transl></Button></ItemActions>
            </Item>

            <Item variant="muted">
                <ItemContent>
                    <ItemTitle><Transl>Muted Variant</Transl></ItemTitle>
                    <ItemDescription><Transl>Subdued appearance with muted colors for secondary content.</Transl></ItemDescription>
                </ItemContent>
                <ItemActions><Button variant="outline" size="sm"><Transl>Open</Transl></Button></ItemActions>
            </Item>
        </div>
    )
}

export function TableDemo() {
    const { user, fetchWithAuth } = useAuth();
    const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
    const [atividades, setAtividades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!unidadeId) {
            setLoading(false);
            return;
        }

        const carregarAtividades = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetchWithAuth(
                    `${API_URL}/atividadesAnimalia/${unidadeId}`,
                    {
                        method: 'GET',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' }
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                console.log('📋 Dados de atividades animalia recebidos:', data);

                // O controlador retorna { sucesso: true, atividades: { atividadesAnimalia: [...] }, message: ... }
                if (data.sucesso && data.atividades) {
                    const atividadesList = data.atividades.atividadesAnimalia || data.atividades.atividades || [];
                    setAtividades(Array.isArray(atividadesList) ? atividadesList : []);
                } else {
                    setAtividades([]);
                }
            } catch (err) {
                console.error('❌ Erro ao carregar atividades de animalia:', err);
                setError(err.message || 'Erro ao carregar dados');
                setAtividades([]);
            } finally {
                setLoading(false);
            }
        };

        carregarAtividades();
    }, [unidadeId, fetchWithAuth]);

    const formatarData = (data) => {
        if (!data) return '-';
        const date = new Date(data);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };
    // pagination
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const totalPages = Math.max(1, Math.ceil(atividades.length / pageSize));
    const pageItems = atividades.slice((page - 1) * pageSize, page * pageSize);

    // reset page when data changes
    useEffect(() => { setPage(1); }, [atividades.length]);

    return (
        <div className="border rounded-lg shadow-sm bg-white dark:bg-neutral-950 flex flex-col h-[600px] p-4">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <Transl className="text-xl font-semibold">Atividades de Animalia</Transl    >
                </div>
            </div>

            {loading && <Transl className="text-muted-foreground">Carregando atividades...</Transl>}
            {error && <p className="text-red-600">Erro: {error}</p>}

            {!loading && (
                <>
                    <div className="flex-1 overflow-x-auto overflow-y-auto border rounded">
                    <Table>
                        <TableCaption>
                            {atividades.length === 0 ? 'Nenhuma atividade encontrada' : `Total de ${atividades.length} atividade(s)`}
                        </TableCaption>
                        <TableHeader>
                            <TableRow className="bg-gray-100 dark:bg-gray-800">
                                <TableHead className="w-[80px] font-semibold"><Transl>ID</Transl></TableHead>
                                <TableHead className="w-[250px] font-semibold"><Transl>Descrição</Transl></TableHead>
                                <TableHead className="font-semibold"><Transl>Tipo</Transl></TableHead>
                                <TableHead className="font-semibold"><Transl>Lote</Transl></TableHead>
                                <TableHead className="font-semibold"><Transl>Status</Transl></TableHead>
                                <TableHead className="font-semibold"><Transl>Data Início</Transl></TableHead>
                                <TableHead className="font-semibold"><Transl>Data Fim</Transl></TableHead>
                                <TableHead className="font-semibold"><Transl>Responsável</Transl></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pageItems.map((atvd) => (
                                <TableRow key={atvd.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <TableCell className="font-medium">{atvd.id}</TableCell>
                                    <TableCell className="w-[250px] max-w-[250px] truncate">{atvd.descricao}</TableCell>
                                    <TableCell>{atvd.tipo || '-'}</TableCell>
                                    <TableCell>{atvd.lote?.nome || '-'}</TableCell>
                                    <TableCell>{atvd.status || '-'}</TableCell>
                                    <TableCell>{formatarData(atvd.dataInicio)}</TableCell>
                                    <TableCell>{formatarData(atvd.dataFim)}</TableCell>
                                    <TableCell>{atvd.responsavel?.nome || '-'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-2 border-t">
                        <div className="text-sm text-muted-foreground">Mostrando {pageItems.length} de {atividades.length} registro(s)</div>
                        <div className="flex items-center gap-2">
                            <IconButton
                                aria-label="Página anterior"
                                title="Página anterior"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                className="!bg-gray-100 dark:!bg-gray-700 !text-gray-800 dark:!text-gray-100 hover:!bg-gray-200 dark:hover:!bg-gray-600 disabled:opacity-50"
                            >
                                <IconArrowLeft size={18} />
                            </IconButton>
                            <div className="text-sm">Página {page} / {totalPages}</div>
                            <IconButton
                                aria-label="Próxima página"
                                title="Próxima página"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                                className="!bg-gray-100 dark:!bg-gray-700 !text-gray-800 dark:!text-gray-100 hover:!bg-gray-200 dark:hover:!bg-gray-600 disabled:opacity-50"
                            >
                                <IconArrowRight size={18} />
                            </IconButton>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

//grafico de linhas 
const chartData2 = [
    { month: "Janeiro", desktop: 186, mobile: 80 },
    { month: "Fevereiro", desktop: 305, mobile: 200 },
    { month: "Março", desktop: 237, mobile: 120 },
    { month: "Abril", desktop: 73, mobile: 190 },
    { month: "Maio", desktop: 209, mobile: 130 },
    { month: "Junho", desktop: 214, mobile: 140 },
]
const chartConfig2 = { desktop: { label: "Desktop", color: "var(--chart-1)", }, mobile: { label: "Mobile", color: "var(--chart-2)", }, }
const produtos = [
    { value: "apple", label: "Maçã" }, { value: "banana", label: "Banana" }, { value: "blueberry", label: "Cenoura" },
    { value: "grapes", label: "Milho" }, { value: "pineapple", label: "Trigo" },
];
const tipos = [{ value: 'COLHEITA', label: 'Colheita' }, { value: 'PLANTIO', label: 'Plantio' }]

export function ChartLineMultiple() {
    const { user, fetchWithAuth } = useAuth();
    const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
    const [tipoSelecionado, setTipoSelecionado] = useState('COLHEITA');
    const [chartData, setChartData] = useState([]);
    const [loadingChart, setLoadingChart] = useState(false);

    // determine current semester months (either Jan-Jun or Jul-Dec)
    function getCurrentSemester() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // 1-12
        const startMonth = month <= 6 ? 1 : 7;
        const months = [];
        for (let m = startMonth; m < startMonth + 6; m++) {
            months.push({ month: m, year });
        }
        return months;
    }

    useEffect(() => {
        if (!unidadeId) return;
        let mounted = true;
        async function loadData() {
            setLoadingChart(true);
            try {
                const months = getCurrentSemester();
                if (tipoSelecionado === 'COLHEITA') {
                    // fetch counts per month from backend endpoint
                    const fetchFn = fetchWithAuth || fetch;
                    const promises = months.map(({ month, year }) =>
                        fetchFn(`${API_URL}/qtdColheitasMes/${unidadeId}/${month}/${year}`).then(r => r.json().catch(() => ({})))
                    );
                    const results = await Promise.all(promises);
                    const data = results.map((res, idx) => {
                        const quantidade = res?.quantidade ?? res?.quantidadeColheitas ?? res?.qtd ?? (res?.lotesColheita ?? undefined) ?? 0;
                        const m = months[idx].month;
                        const year = months[idx].year;
                        const dt = new Date(year, m - 1, 1);
                        return { month: dt.toLocaleString('pt-BR', { month: 'short' }), quantidade: Number(quantidade) || 0, monthNum: m };
                    });
                    if (!mounted) return;
                    setChartData(data);
                } else {
                    // PLANTIO: fetch activities and count 'PLANTIO' items per month locally
                    const fetchFn = fetchWithAuth || fetch;
                    const res = await fetchFn(`${API_URL}/atividadesPlantio/${unidadeId}`);
                    const payload = await res.json().catch(() => ({}));

                    // backend may return { sucesso: true, atividades: { atividadesPlantio: [...] } }
                    // or { sucesso: true, atividadesPlantio: [...] } or raw array
                    let arr = [];
                    if (payload?.sucesso && payload?.atividades) {
                        arr = payload.atividades.atividadesPlantio || payload.atividades.atividades || [];
                    } else if (Array.isArray(payload?.atividadesPlantio)) {
                        arr = payload.atividadesPlantio;
                    } else {
                        arr = extractArrayFromResponse(payload);
                    }

                    const counts = {};
                    arr.forEach((a) => {
                        const tipo = (a.tipo || a.tipoAtvd || '').toString().toUpperCase();
                        if (tipo !== 'PLANTIO') return;
                        const d = a.dataInicio ? new Date(a.dataInicio) : (a.data ? new Date(a.data) : null);
                        if (!d || isNaN(d.getTime())) return;
                        const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
                        counts[key] = (counts[key] || 0) + 1;
                    });
                    const data = months.map(({ month, year }) => {
                        const key = `${year}-${month}`;
                        const dt = new Date(year, month - 1, 1);
                        return { month: dt.toLocaleString('pt-BR', { month: 'short' }), quantidade: counts[key] ?? 0, monthNum: month };
                    });
                    if (!mounted) return;
                    setChartData(data);
                }
            } catch (err) {
                console.error('Erro carregando dados do gráfico:', err);
                setChartData([]);
            } finally {
                if (mounted) setLoadingChart(false);
            }
        }
        loadData();
        return () => { mounted = false; };
    }, [unidadeId, tipoSelecionado, fetchWithAuth]);

    return (
        <Card className="h-full p-4">
            <CardHeader>
                <CardTitle><Transl>Atividades por mês</Transl></CardTitle>
            </CardHeader>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4 ">
                <div className="flex items-center gap-4 flex-wrap font-bold ">
                    <Select onValueChange={(v) => setTipoSelecionado(v)} value={tipoSelecionado}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Tipos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel><Transl>Tipos</Transl></SelectLabel>
                                {tipos.map((tipo) => (<SelectItem key={tipo.value} value={tipo.value}>{tipo.label}</SelectItem>))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <CardDescription><Transl>Semestre atual</Transl></CardDescription>
            <CardContent>
                <ChartContainer config={chartConfig2}>
                    <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Line dataKey="quantidade" type="monotone" stroke="var(--color-desktop)" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                </ChartContainer>
                {loadingChart && <div className="text-sm text-muted-foreground mt-2"><Transl>Carregando...</Transl></div>}
            </CardContent>
        </Card>
    )
}

// tabela de lotes (vegetais) será carregada pela API

export function TableDemo2() {
    const { user, fetchWithAuth } = useAuth();
    const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;

    // filters & ui state
    const [busca, setBusca] = useState("");
    const [tipoFilter, setTipoFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priceSort, setPriceSort] = useState(""); // 'maior' | 'menor' | ''

    // data
    const [rawLotes, setRawLotes] = useState([]);
    const [lotesState, setLotesState] = useState([]);
    // pagination for lotes table
    const [pageLotes, setPageLotes] = useState(1);
    const pageSizeLotes = 10;
    const totalPagesLotes = Math.max(1, Math.ceil(lotesState.length / pageSizeLotes));
    const pageLotesItems = lotesState.slice((pageLotes - 1) * pageSizeLotes, pageLotes * pageSizeLotes);

    useEffect(() => { setPageLotes(1); }, [lotesState.length]);

    // Enum options (restricted to the requested subset)
    const tipoOptions = [
        { value: 'ALL', label: 'Todos' },
        { value: 'BOVINOS', label: 'BOVINOS' },
        { value: 'SUINOS', label: 'SUINOS' },
        { value: 'OVINOS', label: 'OVINOS' },
        { value: 'AVES', label: 'AVES' },
        { value: 'EQUINO', label: 'EQUINO' },
        { value: 'CAPRINOS', label: 'CAPRINOS' },
        { value: 'OUTRO', label: 'OUTRO' },
    ];

    // status filter: restrict to requested subset
    const statusOptions = [
        { value: 'ALL', label: 'Todos' },
        { value: 'RECEBIDO', label: 'RECEBIDO' },
        { value: 'EM_QUARENTENA', label: 'EM_QUARENTENA' },
        { value: 'AVALIACAO_SANITARIA', label: 'AVALIACAO_SANITARIA' },
        { value: 'EM_CRESCIMENTO', label: 'EM_CRESCIMENTO' },
        { value: 'EM_ENGORDA', label: 'EM_ENGORDA' },
        { value: 'EM_REPRODUCAO', label: 'EM_REPRODUCAO' },
        { value: 'LACTAÇÃO', label: 'LACTAÇÃO' },
        { value: 'ABATE', label: 'ABATE' },
        { value: 'PENDENTE', label: 'PENDENTE' },
        { value: 'PRONTO', label: 'PRONTO' },
        { value: 'BLOQUEADO', label: 'BLOQUEADO' },
        { value: 'VENDIDO', label: 'VENDIDO' },
    ];

    // helper to call backend partial update endpoint
    const handleUpdateLote = async (id, fields) => {
        if (!id) return false;
        try {
            const fetchFn = fetchWithAuth || fetch;
            const res = await fetchFn(`${API_URL}/lotes/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fields),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                console.error('Erro atualizar lote', data);
                toast.error(data.erro || data.message || 'Erro ao atualizar lote');
                return false;
            }
            // optimistic update local state
            setRawLotes(prev => prev.map(r => r.id === id ? { ...r, ...fields } : r));
            toast.success('Atualizado com sucesso');
            return true;
        } catch (err) {
            console.error('Erro atualizar lote', err);
            toast.error('Erro ao atualizar lote');
            return false;
        }
    };

    // edit mode state for rows
    const [editingId, setEditingId] = useState(null);
    const [editingValues, setEditingValues] = useState({ status: '', preco: '', statusQualidade: '' });

    const startEdit = (lote) => {
        setEditingId(lote.id);
        setEditingValues({
            status: lote.status || '',
            preco: lote.preco ?? '',
            statusQualidade: (lote.statusQualidade || '').toString().toUpperCase(),
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingValues({ status: '', preco: '', statusQualidade: '' });
    };

    const saveEdit = async (lote) => {
        const payload = {};
        if (editingValues.status && editingValues.status !== lote.status) payload.status = editingValues.status;
        if (editingValues.preco !== lote.preco) payload.preco = editingValues.preco;
        if (editingValues.statusQualidade && editingValues.statusQualidade !== lote.statusQualidade) payload.statusQualidade = editingValues.statusQualidade;
        if (Object.keys(payload).length === 0) {
            // nothing changed
            cancelEdit();
            return;
        }
        const ok = await handleUpdateLote(lote.id, payload);
        if (ok) cancelEdit();
    };

    useEffect(() => {
        let mounted = true;
        async function loadLotes() {
            if (!unidadeId) return;
            try {
                const fetchFn = fetchWithAuth || fetch;
                const res = await fetchFn(`${API_URL}/loteAnimalia/${unidadeId}`);
                const data = await res.json().catch(() => ({}));
                if (!mounted) return;

                const arr = extractArrayFromResponse(data);
                const mapped = arr.map((l) => ({
                    id: l.id,
                    nome: l.nome || l.produto || l.produtoNome || `Lote ${l.id}`,
                    // tipo: multiple possible keys in backend
                    tipo: (l.tipo || l.tipo_lote || l.tipoLote || l.tipoLoteValue || l.tipo_lote_value || '').toString().toUpperCase(),
                    talhao: l.talhao || l.local || l.localidade || '-',
                    // dataCriacao: try common created/createdAt/criadoEm fields
                    dataCriacao: l.criadoEm || l.createdAt || l.created_at || l.dataCriacao || l.data_criacao || l.created || null,
                    validade: l.validade || l.colheitaPrevista || l.validade || '-',
                    status: (l.status || l.statusLote || l.status_lote || '').toString().toUpperCase(),
                    qtd: l.quantidade ?? l.qtd ?? l.qntdItens ?? l.qntd ?? 0,
                    unMedida: l.unidade || l.unidadeMedida || l.unidade_medida || l.unMedida || 'un',
                    preco: l.preco ?? l.precoUnitario ?? l.preco_unitario ?? l.price ?? '-',
                    statusQualidade: l.statusQualidade || l.status_qualidade || l.qualidade || l.statusQual || '-'
                }));

                // sort by dataCriacao descending (most recent first)
                mapped.sort((a, b) => {
                    const ta = a.dataCriacao ? new Date(a.dataCriacao).getTime() : 0;
                    const tb = b.dataCriacao ? new Date(b.dataCriacao).getTime() : 0;
                    return tb - ta;
                });

                setRawLotes(mapped);
            } catch (err) {
                console.error('Erro carregando lotesAnimalia:', err);
                toast.error('Erro ao carregar lotes de animalia');
            }
        }
        loadLotes();
        return () => { mounted = false }
    }, [unidadeId, fetchWithAuth]);

    // price parsing helper
    const parsePriceVal = (v) => {
        if (v === null || v === undefined) return NaN;
        if (typeof v === 'number') return v;
        let s = String(v).trim();
        if (s === '' || s === '-') return NaN;
        // remove currency symbols and spaces
        s = s.replace(/[^0-9.,-]/g, '');
        // heuristics: if both '.' and ',' present, assume '.' thousands and ',' decimal
        if (s.indexOf('.') > -1 && s.indexOf(',') > -1) {
            s = s.replace(/\./g, '').replace(/,/g, '.');
        } else if (s.indexOf(',') > -1 && s.indexOf('.') === -1) {
            s = s.replace(/,/g, '.');
        }
        const n = parseFloat(s);
        return Number.isFinite(n) ? n : NaN;
    };

    // derive filtered + sorted data
    useEffect(() => {
        let items = rawLotes.slice();

        if (tipoFilter && tipoFilter !== 'ALL') {
            items = items.filter(i => (i.tipo || '').toString().toUpperCase() === tipoFilter.toString().toUpperCase());
        }
        if (statusFilter && statusFilter !== 'ALL') {
            items = items.filter(i => (i.status || '').toString().toUpperCase() === statusFilter.toString().toUpperCase());
        }
        if (busca) {
            const q = busca.toLowerCase();
            items = items.filter(i => (
                (i.nome || '').toString().toLowerCase().includes(q) ||
                (i.talhao || '').toString().toLowerCase().includes(q) ||
                (i.statusQualidade || '').toString().toLowerCase().includes(q)
            ));
        }

        if (priceSort === 'maior' || priceSort === 'menor') {
            items.sort((a, b) => {
                const pa = parsePriceVal(a.preco);
                const pb = parsePriceVal(b.preco);
                // if both numbers, compare
                if (!Number.isNaN(pa) && !Number.isNaN(pb)) {
                    return priceSort === 'maior' ? pb - pa : pa - pb;
                }
                // otherwise fallback to locale string compare
                return priceSort === 'maior' ? String(b.preco).localeCompare(String(a.preco)) : String(a.preco).localeCompare(String(b.preco));
            });
        }

        setLotesState(items);
    }, [rawLotes, busca, tipoFilter, statusFilter, priceSort]);

    return (
        <div className="border rounded-lg shadow-sm bg-white dark:bg-neutral-950 h-full p-4">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <Transl className="text-xl font-semibold">Lotes de Animais</Transl>

                    <Select onValueChange={(v) => setTipoFilter(v)} value={tipoFilter}>
                        <SelectTrigger className="w-[170px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel><Transl>Tipo (TipoLote)</Transl></SelectLabel>
                                {tipoOptions.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select onValueChange={(v) => setStatusFilter(v)} value={statusFilter}>
                        <SelectTrigger className="w-[170px]"><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel><Transl>Status (StatusLote)</Transl></SelectLabel>
                                {statusOptions.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select onValueChange={(v) => setPriceSort(v)} value={priceSort}>
                        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Ordenar preço" /></SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Preço</SelectLabel>
                                <SelectItem value="NONE"><Transl>Sem ordenação</Transl></SelectItem>
                                <SelectItem value="menor"><Transl>Menor primeiro</Transl></SelectItem>
                                <SelectItem value="maior"><Transl>Maior primeiro</Transl></SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <Input type="text" placeholder="Buscar..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-[250px]" />
            </div>

            <Table>
                <TableCaption><Transl>Lotes Animais</Transl></TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-gray-800">
                        <TableHead className="w-[80px] font-semibold">ID</TableHead>
                        <TableHead className="font-semibold">Produto</TableHead>
                        <TableHead className="font-semibold">Tipo</TableHead>
                        {/* <TableHead className="font-semibold">Talhão</TableHead> */}
                        {/* <TableHead className="font-semibold">Validade</TableHead> */}
                        <TableHead className="font-semibold">Data</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Quantidade</TableHead>
                        <TableHead className="font-semibold">Unidade de medida</TableHead>
                        <TableHead className="font-semibold">Preço</TableHead>
                        <TableHead className="font-semibold">StatusQualidade</TableHead>
                        <TableHead className="font-semibold">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pageLotesItems.map((lote) => (
                        <TableRow key={lote.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <TableCell className="font-medium">{lote.id}</TableCell>
                            <TableCell>{lote.nome}</TableCell>
                            <TableCell>{lote.tipo}</TableCell>
                            {/* <TableCell>{lote.talhao}</TableCell> */}
                            {/* removed plantio cell */}
                            {/* <TableCell>{lote.validade}</TableCell> */}
                            <TableCell>{formatDateShort(lote.dataCriacao)}</TableCell>
                            <TableCell>
                                {editingId === lote.id ? (
                                    <Select value={editingValues.status} onValueChange={(v) => setEditingValues(prev => ({ ...prev, status: v }))}>
                                        <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Status (StatusLote)</SelectLabel>
                                                {statusOptions.filter(o => o.value !== 'ALL').map(opt => (
                                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="text-sm">{lote.status}</div>
                                )}
                            </TableCell>
                            <TableCell>{lote.qtd}</TableCell>
                            <TableCell>{lote.unMedida}</TableCell>
                            <TableCell>
                                {editingId === lote.id ? (
                                    <Input value={editingValues.preco ?? ''} onChange={(e) => setEditingValues(prev => ({ ...prev, preco: e.target.value }))} className="w-[120px]" />
                                ) : (
                                    <div className="text-sm">{lote.preco}</div>
                                )}
                            </TableCell>
                            <TableCell>
                                {editingId === lote.id ? (
                                    <Select value={editingValues.statusQualidade} onValueChange={(v) => setEditingValues(prev => ({ ...prev, statusQualidade: v }))}>
                                        <SelectTrigger className="w-[160px]"><SelectValue placeholder="StatusQualidade" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Status Qualidade</SelectLabel>
                                                <SelectItem value="PROPRIO">PROPRIO</SelectItem>
                                                <SelectItem value="ALERTA">ALERTA</SelectItem>
                                                <SelectItem value="IMPROPRIO">IMPROPRIO</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="text-sm">{lote.statusQualidade}</div>
                                )}
                            </TableCell>
                            <TableCell>
                                {editingId === lote.id ? (
                                    <div className="flex items-center gap-2">
                                        <Button size="small" variant="contained" onClick={() => saveEdit(lote)}>Salvar</Button>
                                        <Button size="small" variant="outlined" onClick={cancelEdit}>Cancelar</Button>
                                    </div>
                                ) : (
                                    <div className="flex justify-end">
                                        <Button size="small" variant="outlined" onClick={() => startEdit(lote)}>Editar</Button>
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex items-center justify-between mt-3">
                <div className="text-sm text-muted-foreground">Mostrando {pageLotesItems.length} de {lotesState.length} registro(s)</div>
                <div className="flex items-center gap-2">
                    <IconButton
                        aria-label="Página anterior"
                        title="Página anterior"
                        onClick={() => setPageLotes(p => Math.max(1, p - 1))}
                        disabled={pageLotes <= 1}
                        className="!bg-gray-100 dark:!bg-gray-700 !text-gray-800 dark:!text-gray-100 hover:!bg-gray-200 dark:hover:!bg-gray-600 disabled:opacity-50"
                    >
                        <IconArrowLeft size={18} />
                    </IconButton>
                    <div className="text-sm">Página {pageLotes} / {totalPagesLotes}</div>
                    <IconButton
                        aria-label="Próxima página"
                        title="Próxima página"
                        onClick={() => setPageLotes(p => Math.min(totalPagesLotes, p + 1))}
                        disabled={pageLotes >= totalPagesLotes}
                        className="!bg-gray-100 dark:!bg-gray-700 !text-gray-800 dark:!text-gray-100 hover:!bg-gray-200 dark:hover:!bg-gray-600 disabled:opacity-50"
                    >
                        <IconArrowRight size={18} />
                    </IconButton>
                </div>
            </div>
        </div>
    )
}

// Robust extractor for numeric "quantidade" values returned in various shapes
function extractNumericQuantity(payload) {
    if (payload === null || payload === undefined) return undefined;
    if (typeof payload === 'number') return payload;
    if (typeof payload === 'string' && payload.trim() !== '' && !Number.isNaN(Number(payload))) return Number(payload);

    // direct field common cases
    if (payload.quantidade !== undefined) {
        return extractNumericQuantity(payload.quantidade);
    }
    if (payload.total !== undefined) {
        return extractNumericQuantity(payload.total);
    }

    const commonKeys = ['lotesDisponiveis', 'lotesAnimaliaDisponiveis', 'lotesAnimaliaImproprios', 'lotesImproprios', 'animais', 'qtd', 'count', 'totalLotesAnimalia'];
    for (const k of commonKeys) {
        if (payload[k] !== undefined) return extractNumericQuantity(payload[k]);
    }

    // If it's an object that wraps a numeric inside a nested object, try shallow search
    if (typeof payload === 'object') {
        // arrays: length
        if (Array.isArray(payload)) return payload.length;

        for (const key of Object.keys(payload)) {
            const val = payload[key];
            const q = extractNumericQuantity(val);
            if (q !== undefined) return q;
        }
    }

    return undefined;
}