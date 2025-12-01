"use client"
import * as React from 'react';
import { useState, useEffect } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/config';
import { toast } from 'sonner';
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { IconTrendingDown } from "@tabler/icons-react"
//ui
import { Card, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
//mui
import Button from '@mui/material/Button';
import { BarChart } from '@mui/x-charts/BarChart';


export function SectionCards() {
    return (
        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8 px-8 min-w-[20%] mx-auto w-full mb-10">
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Lotes disponíveis</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">275</CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">Lotes disponiveis para produção<IconTrendingDown className="size-4" /></div>
                    <div className="text-muted-foreground">Bom</div>
                    <Select />
                </CardFooter>
            </Card>

            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Próxima colheita</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">Milho - 25/10</CardTitle>
                </CardHeader>
            </Card>

            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Quantidade colhida</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl columns lg:flex items-center justify-between">12T
                        <Select>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Produto" /></SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Produto</SelectLabel>
                                    <SelectItem value="apple">Maçã</SelectItem><SelectItem value="banana">Banana</SelectItem>
                                    <SelectItem value="blueberry">Cenoura</SelectItem><SelectItem value="grapes">Milho</SelectItem>
                                    <SelectItem value="pineapple">Trigo</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </CardTitle>
                </CardHeader>
            </Card>

            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Produção média por cultura</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl columns lg:flex items-center justify-between">10T/ha
                        <Select>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Produto" /></SelectTrigger>
                            <SelectContent>
                                <SelectGroup><SelectLabel>Produto</SelectLabel>
                                    <SelectItem value="apple">Maçã</SelectItem><SelectItem value="banana">Banana</SelectItem>
                                    <SelectItem value="blueberry">Cenoura</SelectItem><SelectItem value="grapes">Milho</SelectItem>
                                    <SelectItem value="pineapple">Trigo</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </CardTitle>
                </CardHeader>
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

export function ItemVariant() {
    return (
        <div className="flex flex-col gap-6">
            <Item>
                <ItemContent>
                    <ItemTitle>Default Variant</ItemTitle>
                    <ItemDescription>Standard styling with subtle background and borders.</ItemDescription>
                </ItemContent>
                <ItemActions><Button variant="outline" size="sm">Open</Button></ItemActions>
            </Item>

            <Item variant="outline">
                <ItemContent>
                    <ItemTitle>Outline Variant</ItemTitle>
                    <ItemDescription>Outlined style with clear borders and transparent background.</ItemDescription>
                </ItemContent>
                <ItemActions><Button variant="outline" size="sm">Open</Button></ItemActions>
            </Item>

            <Item variant="muted">
                <ItemContent>
                    <ItemTitle>Muted Variant</ItemTitle>
                    <ItemDescription>Subdued appearance with muted colors for secondary content.</ItemDescription>
                </ItemContent>
                <ItemActions><Button variant="outline" size="sm">Open</Button></ItemActions>
            </Item>
        </div>
    )
}

const atividades = [
    { id: 1, descricao: "Plantio de soja", tipo: "Plantio", lote: "Lote A", talhao: "Talhão 1", data: "2025-10-01", responsavel: "Carlos Silva" },
    { id: 2, descricao: "Colheita de milho", tipo: "Colheita", lote: "Lote B", talhao: "Talhão 3", data: "2025-10-05", responsavel: "Ana Souza" },
    { id: 3, descricao: "Aplicação de fertilizante NPK", tipo: "Fertilização", lote: "Lote C", talhao: "Talhão 2", data: "2025-10-08", responsavel: "João Lima" },
    { id: 4, descricao: "Controle de pragas com inseticida", tipo: "Defensivo", lote: "Lote A", talhao: "Talhão 1", data: "2025-10-10", responsavel: "Marcos Rocha" },
    { id: 5, descricao: "Irrigação por aspersão", tipo: "Irrigação", lote: "Lote D", talhao: "Talhão 4", data: "2025-10-12", responsavel: "Fernanda Costa" },
    { id: 6, descricao: "Plantio de feijão", tipo: "Plantio", lote: "Lote E", talhao: "Talhão 5", data: "2025-10-15", responsavel: "Ricardo Alves" },
    { id: 7, descricao: "Colheita de trigo", tipo: "Colheita", lote: "Lote F", talhao: "Talhão 6", data: "2025-10-18", responsavel: "Luciana Martins" },
    { id: 8, descricao: "Aplicação de herbicida", tipo: "Defensivo", lote: "Lote B", talhao: "Talhão 3", data: "2025-10-20", responsavel: "Paulo Mendes" }
];

export function TableDemo() {
    return (
        <div className="border rounded-lg shadow-sm bg-white dark:bg-black h-full p-4">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <h2 className="text-xl font-semibold">Atividades Agrícolas</h2>
                </div>
            </div>
            <Table>
                <TableCaption>Atividades Agrícolas</TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-gray-800">
                        <TableHead className="w-[80px] font-semibold">ID</TableHead>
                        <TableHead className="font-semibold">Descrição</TableHead>
                        <TableHead className="font-semibold">Tipo</TableHead>
                        <TableHead className="font-semibold">Lote</TableHead>
                        <TableHead className="font-semibold">Talhão</TableHead>
                        <TableHead className="font-semibold">Data</TableHead>
                        <TableHead className="font-semibold">Responsavel</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {atividades.map((atvd) => (
                        <TableRow key={atvd.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <TableCell className="font-medium">{atvd.id}</TableCell>
                            <TableCell>{atvd.descricao}</TableCell>
                            <TableCell>{atvd.tipo}</TableCell>
                            <TableCell>{atvd.lote}</TableCell>
                            <TableCell>{atvd.talhao}</TableCell>
                            <TableCell>{atvd.data}</TableCell>
                            <TableCell>{atvd.responsavel}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
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
const tipos = [{ value: 'colheita', label: 'Colheita' }, { value: 'producao', label: 'Produção' },]

export function ChartLineMultiple() {
    return (
        <Card className="h-full p-4">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4 ">
                <div className="flex items-center gap-4 flex-wrap font-bold ">
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Tipos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Tipos</SelectLabel>
                                {tipos.map((tipo) => (<SelectItem key={tipo.value} value={tipo.value}>{tipo.label}</SelectItem>))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <h3 className='text-gray-500'>de</h3>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Produtos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Produtos</SelectLabel>
                                {produtos.map((produto) => (<SelectItem key={produto.value} value={produto.value}>{produto.label}</SelectItem>))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <CardDescription>January - June 2024</CardDescription>
            <CardContent>
                <ChartContainer config={chartConfig2}>
                    <LineChart accessibilityLayer data={chartData2} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Line dataKey="desktop" type="monotone" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
                        <Line dataKey="mobile" type="monotone" stroke="var(--color-mobile)" strokeWidth={2} dot={false} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

//tabela de lotes(vegetais)
const lotes = [
    { id: 1, nome: "Beterraba", tipo: "Legume", talhao: "16", plantio: '16/10', validade: '15/12', status: 'Em desenvolvimento', qtd: '600', unMedida: 'un', preco: '1,20' },
    { id: 2, nome: "Maçã", tipo: "Fruta", talhao: "05", plantio: '10/01', validade: '10/06', status: 'Em desenvolvimento', qtd: '1200', unMedida: 'kg', preco: '4,50' },
    { id: 3, nome: "Cenoura", tipo: "Raiz", talhao: "12", plantio: '05/09', validade: '05/12', status: 'Pronto para colheita', qtd: '850', unMedida: 'kg', preco: '3,80' },
    { id: 4, nome: "Alface", tipo: "Hortaliça", talhao: "03", plantio: '01/10', validade: '20/11', status: 'Pronto para colheita', qtd: '3000', unMedida: 'un', preco: '2,50' },
    { id: 5, nome: "Milho", tipo: "Grão", talhao: "20", plantio: '15/05', validade: '15/09', status: 'Colhido', qtd: '5000', unMedida: 'kg', preco: '2,00' },
    { id: 6, nome: "Abóbrinha", tipo: "Legume", talhao: "07", plantio: '20/08', validade: '10/11', status: 'Em desenvolvimento', qtd: '400', unMedida: 'kg', preco: '3,20' },
    { id: 7, nome: "Acelga", tipo: "Hortaliça", talhao: "04", plantio: '03/10', validade: '30/11', status: 'Pronto para colheita', qtd: '1500', unMedida: 'un', preco: '3,00' },
    { id: 8, nome: "Tomate", tipo: "Fruta", talhao: "11", plantio: '10/07', validade: '10/10', status: 'Colhido', qtd: '2500', unMedida: 'kg', preco: '5,50' },
];

export function TableDemo2() {
    const { user, fetchWithAuth } = useAuth();
    const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
    const [categoria, setCategoria] = useState("");
    const [busca, setBusca] = useState("");
    const [lotesState, setLotesState] = useState(lotes);

    useEffect(() => {
        let mounted = true;
        async function loadLotes() {
            if (!unidadeId) return; 
            try {
                const fetchFn = fetchWithAuth || fetch;
                const res = await fetchFn(`${API_URL}/lotesPlantio/${unidadeId}`);
                const data = await res.json().catch(() => ({}));
                if (!mounted) return;
                const arr = data?.lotes ?? data?.data ?? (Array.isArray(data) ? data : []);
                if (Array.isArray(arr) && arr.length > 0) {
                    const mapped = arr.map((l) => ({
                        id: l.id,
                        nome: l.nome || l.produto || `Lote ${l.id}`,
                        tipo: l.tipo || l.categoria || '-',
                        talhao: l.talhao || l.local || '-',
                        plantio: l.plantio || l.dataPlantio || '-',
                        validade: l.validade || l.colheitaPrevista || '-',
                        status: l.status || '-',
                        qtd: l.quantidade ?? l.qtd ?? 0,
                        unMedida: l.unidade || 'un',
                        preco: l.preco || l.precoUnitario || '-' 
                    }));
                    setLotesState(mapped);
                }
            } catch (err) {
                console.error('Erro carregando lotesPlantio:', err);
                toast.error('Erro ao carregar lotes da fazenda');
            }
        }
        loadLotes();
        return () => { mounted = false }
    }, [unidadeId, fetchWithAuth]);
    return (
        <div className="border rounded-lg shadow-sm bg-white dark:bg-black h-full p-4">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <h2 className="text-xl font-semibold">Lotes de Vegetais</h2>
                    <Select onValueChange={setCategoria}>
                        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Tipo</SelectLabel>
                                <SelectItem value="legume">Legume</SelectItem>
                                <SelectItem value="fruta">Fruta</SelectItem>
                                <SelectItem value="raiz">Raiz</SelectItem>
                                <SelectItem value="hortalica">Hortaliça</SelectItem>
                                <SelectItem value="grao">Grão</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select onValueChange={setCategoria}>
                        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Status</SelectLabel>
                                <SelectItem value="emPreparo">Em preparo</SelectItem>
                                <SelectItem value="semeado">Semeado</SelectItem>
                                <SelectItem value="desenvolvimento">Em Desenvolvimento</SelectItem>
                                <SelectItem value="colhido">Colhido</SelectItem>
                                <SelectItem value="vendido">Vendido</SelectItem>
                                <SelectItem value="descartado">Descartado</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select onValueChange={setCategoria}>
                        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Preço" /></SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Preço</SelectLabel>
                                <SelectItem value="maior">Maior preço</SelectItem>
                                <SelectItem value="menor">Menor preço</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <Input type="text" placeholder="Buscar..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-[250px]" />
            </div>
            <Table>
                <TableCaption>Lotes Vegetais</TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-gray-800">
                        <TableHead className="w-[80px] font-semibold">ID</TableHead>
                        <TableHead className="font-semibold">Produto</TableHead>
                        <TableHead className="font-semibold">Tipo</TableHead>
                        <TableHead className="font-semibold">Talhão</TableHead>
                        <TableHead className="font-semibold">Plantio</TableHead>
                        <TableHead className="font-semibold">Validade</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Quantidade</TableHead>
                        <TableHead className="font-semibold">Preço por unidade</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {lotesState.map((lote) => (
                        <TableRow key={lote.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <TableCell className="font-medium">{lote.id}</TableCell>
                            <TableCell>{lote.nome}</TableCell>
                            <TableCell>{lote.tipo}</TableCell>
                            <TableCell>{lote.talhao}</TableCell>
                            <TableCell>{lote.plantio}</TableCell>
                            <TableCell>{lote.validade}</TableCell>
                            <TableCell>{lote.status}</TableCell>
                            <TableCell>{lote.qtd}{lote.unMedida}</TableCell>
                            <TableCell>{lote.preco}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}