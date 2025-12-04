"use client"
import * as React from 'react';
import { useState, useEffect } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/config';
import { toast } from 'sonner';
import { Pie, PieChart } from "recharts"
//ui
import { Card, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { Input } from ,"@/components/ui/input";
import { Layers, TrendingUpDown } from 'lucide-react'
//mui

export function SectionCards() {
    const { user, fetchWithAuth } = useAuth();
    const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
    const [loading, setLoading] = useState(true);
    const [animaisCount, setAnimaisCount] = useState(0);
    const [lotesCount, setLotesCount] = useState(0);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let mounted = true;
        async function loadCounts() {
            if (!unidadeId) {
                setLoading(false);
                return;
            }
            setError(false);
            setErrorMessage("");

            try {
                const fetchFn = fetchWithAuth || fetch;
                const aRes = await fetchFn(`${API_URL}/animais`);
                if (!aRes.ok) {
                    const errBody = await aRes.json().catch(() => null);
                    throw new Error(errBody?.erro || errBody?.message || JSON.stringify(errBody) || `HTTP ${aRes.status}`);
                }
                const aJson = await aRes.json().catch(() => null);
                const animaisArr = aJson?.animais ?? (Array.isArray(aJson) ? aJson : null);
                if (!Array.isArray(animaisArr)) throw new Error('Resposta inválida ao buscar animais');
                const animaisFiltrados = animaisArr.filter((a) => Number(a.unidadeId) === Number(unidadeId));
                const lRes = await fetchFn(`${API_URL}/lotesPlantio/${unidadeId}`);
                if (!lRes.ok) {
                    const errBody = await lRes.json().catch(() => null);
                    throw new Error(errBody?.erro || errBody?.message || JSON.stringify(errBody) || `HTTP ${lRes.status}`);
                }
                const lJson = await lRes.json().catch(() => null);
                const lotesArr = lJson?.lotes ?? lJson?.data ?? (Array.isArray(lJson) ? lJson : null);
                if (!Array.isArray(lotesArr)) throw new Error('Resposta inválida ao buscar lotes');

                if (!mounted) return;
                setAnimaisCount(animaisFiltrados.length);
                setLotesCount(lotesArr.length);
            } catch (err) {
                console.error('Erro carregando contadores:', err);
                const msg = err?.message || String(err);
                setError(true);
                setErrorMessage(msg);
                toast.error('Erro ao carregar indicadores');
            }
            finally { if (mounted) setLoading(false); }
        }

        loadCounts();
        return () => { mounted = false };
    }, [unidadeId, fetchWithAuth]);

    return (
        <>
            {error && (
                <div className="mx-8 mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-800">
                    <strong>falha ao puxar informações</strong>
                    {errorMessage ? `: ${errorMessage}` : ''}
                </div>
            )}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 px-8 min-w-[20%] mx-auto w-full mb-10">
                <Card className="h-fit p-0">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg"><Layers className="size-10" /></div>
                            <div>
                                <CardDescription>Animais ativos</CardDescription>
                                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{loading ? '—' : animaisCount}</CardTitle>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="h-fit p-0">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg"><Layers className="size-10" /></div>
                            <div>
                                <CardDescription>Lotes ativos</CardDescription>
                                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{loading ? '—' : lotesCount}</CardTitle>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="h-fit p-0 gap-0">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg"><TrendingUpDown className="size-10" /></div>
                            <div>
                                <CardDescription>Rentabilidade por lote</CardDescription>
                                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center justify-between">R$ 0,00</CardTitle>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm p-4">
                        <div className="line-clamp-1 flex gap-2 font-medium">Receita - Custo por lote</div>
                        <div className="text-muted-foreground">—</div>
                        <Select />
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}

export function ChartPieDonut() {
    const { user, fetchWithAuth } = useAuth();
    const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
    const [chartDataState, setChartDataState] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let mounted = true;
        async function loadChart() {
            if (!unidadeId) {
                setLoading(false);
                return;
            }
            // reset errors before new attempt
            setError(false);
            setErrorMessage("");
            try {
                const fetchFn = fetchWithAuth || fetch;
                const res = await fetchFn(`${API_URL}/dashboard/fazenda/${unidadeId}`);
                if (!res.ok) {
                    const errBody = await res.json().catch(() => null);
                    throw new Error(errBody?.erro || errBody?.message || JSON.stringify(errBody) || `HTTP ${res.status}`);
                }
                const json = await res.json().catch(() => null);
                const chart = json?.chart ?? null;
                if (!Array.isArray(chart)) throw new Error('Resposta inválida ao buscar gráfico');
                if (!mounted) return;
                setChartDataState(chart);
            } catch (err) {
                console.error('Erro carregando chart:', err);
                const msg = err?.message || String(err);
                setError(true);
                setErrorMessage(msg);
                toast.error('Erro ao carregar gráfico');
            }
            finally {if (mounted) setLoading(false);}
        }
        loadChart();
        return () => { mounted = false };
    }, [unidadeId, fetchWithAuth]);

    const config = { visitors: { label: "Valor" } };

    return (
        <Card className="flex flex-col w-full h-full">
            <CardHeader className="items-center pb-0">
                <CardTitle>Lotes em andamento</CardTitle>
                <CardDescription>{loading ? '—' : (chartDataState.reduce((s, i) => s + (i.value || 0), 0) || '—')}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4 flex justify-center items-center">
                {error ? (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded">
                        <strong>falha ao puxar informações</strong>
                        {errorMessage ? `: ${errorMessage}` : ''}
                    </div>
                ) : (
                    <ChartContainer config={config} className="w-[90%] h-[90%] flex justify-center items-center">
                        <PieChart width={300} height={300}>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Pie data={chartDataState} dataKey="value" nameKey="label" innerRadius={80} outerRadius={120} />
                        </PieChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
};

export function TableDemo() {
    const { user, fetchWithAuth } = useAuth();
    const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
    const [categoria, setCategoria] = useState("");
    const [busca, setBusca] = useState("");
    const [atividadesState, setAtividadesState] = useState([]);
    const [atividadesError, setAtividadesError] = useState(false);
    const [atividadesErrorMessage, setAtividadesErrorMessage] = useState("");

    useEffect(() => {
        let mounted = true;
        let localError = false;
        async function loadLotesAnimais() {
            if (!unidadeId) return;
            // reset errors
            setAtividadesError(false);
            setAtividadesErrorMessage("");
            try {
                const fetchFn = fetchWithAuth || fetch;
                const res = await fetchFn(`${API_URL}/lotesPlantio/${unidadeId}`);
                if (!res.ok) {
                    const errBody = await res.json().catch(() => null);
                    throw new Error(errBody?.erro || errBody?.message || JSON.stringify(errBody) || `HTTP ${res.status}`);
                }
                const data = await res.json().catch(() => null);
                if (!mounted) return;
                    const arr = data?.lotes ?? data?.data ?? (Array.isArray(data) ? data : null);
                    if (!Array.isArray(arr)) throw new Error('Resposta inválida ao buscar lotes/atividades');
                if (Array.isArray(arr)) {
                    const mappedActivities = arr.slice(0, 8).map((l, idx) => ({
                        id: l.id ?? idx + 1,
                        descricao: l.nome || l.produto || `Lote ${l.id}`,
                        tipo: l.tipo || 'Monitoramento',
                        lote: l.talhao || l.local || '-',
                        data: l.plantio || l.dataPlantio || '-',
                        responsavel: l.responsavel || '-'
                    }));
                    setAtividadesState(mappedActivities);
                }
            } catch (err) {
                console.error('Erro carregando dados de animais:', err);
                const msg = err?.message || String(err);
                setAtividadesState([]);
                setAtividadesError(true);
                setAtividadesErrorMessage(msg);
                toast.error('Erro ao carregar dados de animais');
            }
        }
        loadLotesAnimais();
        return () => { mounted = false };
    }, [unidadeId, fetchWithAuth]);

    return (
        <div className="border rounded-lg shadow-sm bg-white dark:bg-black h-full p-4">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <h2 className="text-xl font-semibold">Atividades</h2>
                    <Select onValueChange={setCategoria}>
                        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Ordenar por" /></SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Ordenar por</SelectLabel>
                                <SelectItem value="id">Id</SelectItem>
                                <SelectItem value="tipo">Tipo</SelectItem>
                                <SelectItem value="data">Data</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <Input type="text" placeholder="Buscar..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-[250px]" />
            </div>
            {atividadesError ? (
                    <div className="p-3 rounded bg-red-50 border border-red-200 text-red-800">
                        <strong>falha ao puxar informações</strong>
                    {atividadesErrorMessage ? `: ${atividadesErrorMessage}` : ''}
                </div>
            ) : atividadesState.length === 0 ? (
                <div className="p-3 text-sm text-muted-foreground">Nenhuma atividade encontrada.</div>
            ) : (
                <Table>
                <TableCaption>Atividades Animais</TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-gray-700">
                        <TableHead className="w-[80px] font-semibold">ID</TableHead>
                        <TableHead className="font-semibold">Descrição</TableHead>
                        <TableHead className="font-semibold">Tipo</TableHead>
                        <TableHead className="font-semibold">Lote</TableHead>
                        <TableHead className="font-semibold">Data</TableHead>
                        <TableHead className="font-semibold">Responsavel</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {atividadesState.map((atvd) => (
                        <TableRow key={atvd.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <TableCell className="font-medium">{atvd.id}</TableCell>
                            <TableCell>{atvd.descricao}</TableCell>
                            <TableCell>{atvd.tipo}</TableCell>
                            <TableCell>{atvd.lote}</TableCell>
                            <TableCell>{atvd.data}</TableCell>
                            <TableCell>{atvd.responsavel}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            )}
        </div>
    )
}

export function TableDemo2() {
    const { user, fetchWithAuth } = useAuth();
    const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
    const [categoria, setCategoria] = useState("");
    const [busca, setBusca] = useState("");
    const [lotesAnimais, setLotesAnimais] = useState([]);
    const [lotesAnimaisError, setLotesAnimaisError] = useState(false);
    const [lotesAnimaisErrorMessage, setLotesAnimaisErrorMessage] = useState("");

    useEffect(() => {
        let mounted = true;
        async function loadAnimais() {
            if (!unidadeId) return;
            // reset errors
            setLotesAnimaisError(false);
            setLotesAnimaisErrorMessage("");
            try {
                const fetchFn = fetchWithAuth || fetch;
                const res = await fetchFn(`${API_URL}/animais`);
                if (!res.ok) {
                    const errBody = await res.json().catch(() => null);
                    throw new Error(errBody?.erro || errBody?.message || JSON.stringify(errBody) || `HTTP ${res.status}`);
                }
                const json = await res.json().catch(() => null);
                    const arr = json?.animais ?? (Array.isArray(json) ? json : null);
                    if (!Array.isArray(arr)) throw new Error('Resposta inválida ao buscar animais');
                    const filtered = arr.filter(a => Number(a.unidadeId) === Number(unidadeId));
                if (!mounted) return;
                setLotesAnimais(filtered);
            } catch (err) {
                console.error('Erro carregando animais:', err);
                const msg = err?.message || String(err);
                setLotesAnimais([]);
                setLotesAnimaisError(true);
                setLotesAnimaisErrorMessage(msg);
                toast.error('Erro ao carregar lotes de animais');
            }
        }
        loadAnimais();
        return () => { mounted = false };
    }, [unidadeId, fetchWithAuth]);

    return (
        <div className="border rounded-lg shadow-sm bg-white dark:bg-black h-full p-4">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <h2 className="text-xl font-semibold">Lotes de Animais</h2>
                    <Select onValueChange={setCategoria}>
                        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Tipo</SelectLabel>
                                <SelectItem value="bovinos">Bovinos</SelectItem>
                                <SelectItem value="suinos">Suínos</SelectItem>
                                <SelectItem value="aves">Aves</SelectItem>
                                <SelectItem value="ovinos">Ovinos</SelectItem>
                                <SelectItem value="caprinos">Caprinos</SelectItem>
                                <SelectItem value="equinos">Equinos</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select onValueChange={setCategoria}>
                        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Status</SelectLabel>
                                <SelectItem value="ativo">Ativo</SelectItem>
                                <SelectItem value="reproducao">Em reprodução</SelectItem>
                                <SelectItem value="engorda">Em engorda</SelectItem>
                                <SelectItem value="tratamento">Em tratamento</SelectItem>
                                <SelectItem value="pronto">Pronto para abate</SelectItem>
                                <SelectItem value="abatido">Abatido</SelectItem>
                                <SelectItem value="vendido">Vendido</SelectItem>
                                <SelectItem value="cancelado">Cancelado</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select onValueChange={setCategoria}>
                        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Preço" /></SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Preço</SelectLabel>
                                <SelectItem value="id">Id</SelectItem>
                                <SelectItem value="tipo">Tipo</SelectItem>
                                <SelectItem value="data">Data</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <Input type="text" placeholder="Buscar..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-[250px]" />
            </div>
            {lotesAnimaisError ? (
                <div className="p-3 rounded bg-red-50 border border-red-200 text-red-800">
                    <strong>falha ao puxar informações</strong>
                    {lotesAnimaisErrorMessage ? `: ${lotesAnimaisErrorMessage}` : ''}
                </div>
            ) : (
                <Table>
                <TableCaption>Lotes de Animais</TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-gray-700">
                        <TableHead className="w-[80px] font-semibold">ID</TableHead>
                        <TableHead className="font-semibold">Animal</TableHead>
                        <TableHead className="font-semibold">Tipo</TableHead>
                        <TableHead className="font-semibold">preco</TableHead>
                        <TableHead className="font-semibold">Quantidade</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Finalidade</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {lotesAnimais.map((a) => (
                        <TableRow key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <TableCell className="font-medium">{a.id}</TableCell>
                            <TableCell>{a.animal}</TableCell>
                            <TableCell>{a.raca}</TableCell>
                            <TableCell>{a.quantidade ?? '-'}</TableCell>
                            <TableCell>{a.tipo}</TableCell>
                            <TableCell>{a.custo ? `R$ ${a.custo}` : '-'}</TableCell>
                            <TableCell>{a.loteId ?? '-'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            )}
        </div>
    )
}