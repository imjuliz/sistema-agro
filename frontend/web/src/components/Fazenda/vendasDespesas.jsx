"use client"
import * as React from 'react';
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
//ui
import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
//mui
import { BarChart } from "@mui/x-charts";

export function SectionCards() {
    return (
        <div className="grid grid-cols-4 md:grid-cols-4 gap-8 px-8 min-w-[20%] mx-auto w-full mb-10">
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Diária</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">R$10.966,00</CardTitle>
                </CardHeader>
                <CardFooter>17/10</CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Lucro</CardDescription>
                    <CardAction>
                        <Badge variant="outline">Outubro 25</Badge>
                    </CardAction>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">R$18.090,00</CardTitle>
                </CardHeader>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Próximo envio</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center justify-between">20/10</CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="text-muted-foreground">Lojas Agrofeliz</div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Lojas parceiras</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center justify-between">
                        124
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>
    );
}

//tabela de estoque
const lotes = [
    { id: 1, nome: "Ração para bovinos", qtd: "1200", unMedida: "kg", categoria: "Alimentação Animal", validade: "2025-12-15" },
    { id: 2, nome: "Adubo orgânico", qtd: "800", unMedida: "kg", categoria: "Fertilizante", validade: "2026-03-10" },
    { id: 3, nome: "Vacina contra febre aftosa", qta: "300", unMedida: "doses", categoria: "Medicamentos", validade: "2025-11-01" },
    { id: 4, nome: "Sementes de milho", qtd: "150", unMedida: "kg", categoria: "Sementes", validade: "2026-01-20" },
    { id: 5, nome: "Inseticida agrícola", qtd: "75", unMedida: "litros", categoria: "Defensivos", validade: "2025-10-30" },
    { id: 6, nome: "Ração para aves", qtd: "950", unMedida: "kg", categoria: "Alimentação Animal", validade: "2025-12-05" },
    { id: 7, nome: "Ferramentas de manejo", qtd: "45", unMedida: "un", categoria: "Equipamentos", validade: "Indeterminado" },
    { id: 8, nome: "Sementes de trigo", qtd: "200", unMedida: "kg", categoria: "Sementes", validade: "2026-02-28" }
];
export function TableDemo2() {
    const [categoria, setCategoria] = useState("");
    const [status, setStatus] = useState("");
    const [busca, setBusca] = useState("");

    return (
        <div className="border rounded-lg shadow-sm bg-white dark:bg-gray-900 h-full p-4">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <h2 className="text-xl font-semibold">Estoque</h2>
                    <Select onValueChange={setCategoria}>
                        <SelectTrigger className="w-[150px]"> <SelectValue placeholder="Categoria" /> </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Categoria</SelectLabel>
                                <SelectItem value="AlimentacaoAnimal">Alimentação Animal</SelectItem>
                                <SelectItem value="Defensivos">Defensivos</SelectItem>
                                <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                                <SelectItem value="Fertilizante">Fertilizante</SelectItem>
                                <SelectItem value="Medicamentos">Medicamentos</SelectItem>
                                <SelectItem value="Sementes	">Sementes</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <Input type="text" placeholder="Buscar..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-[250px]" />
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-gray-800">
                        <TableHead className="w-[80px] font-semibold">ID</TableHead>
                        <TableHead className="font-semibold">Nome</TableHead>
                        <TableHead className="font-semibold">Qta</TableHead>
                        <TableHead className="font-semibold">Categoria</TableHead>
                        <TableHead className="font-semibold">Validade</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {lotes
                        .filter((lote) =>
                            (!categoria || lote.tipo === categoria) &&
                            (!status || lote.status === status) &&
                            (!busca || lote.animal.toLowerCase().includes(busca.toLowerCase()))
                        )
                        .map((lote) => (
                            <TableRow key={lote.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <TableCell className="font-medium">{lote.id}</TableCell>
                                <TableCell>{lote.nome}</TableCell>
                                <TableCell>{lote.qtd}{lote.unMedida}</TableCell>
                                <TableCell>{lote.categoria}</TableCell>
                                <TableCell> {lote.validade}</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    );
}

const produtos = [{ value: "anual", label: "Anual" }, { value: "mensal", label: "Mensal" }];

export function GraficoDeBarras() {
    const [produtoSelecionado, setProdutoSelecionado] = useState("");
    const [ano, setAno] = useState(2025);

    const mudarAno = (delta) => setAno((prev) => prev + delta);
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

    // Exemplo de dados fictícios por mês
    const dadosSeries = [
        { data: [3, 2, 4, 5, 6, 4, 3, 2, 5, 6, 4, 3], color: "#99BF0F" },
        { data: [2, 3, 1, 4, 5, 3, 2, 4, 3, 2, 5, 4], color: "#738C16" }
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <div className="flex-1 flex justify-end">
                    <Select onValueChange={setProdutoSelecionado}>
                        <SelectTrigger className="w-[180px]"><SelectValue placeholder="Anual" /></SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Produto</SelectLabel>
                                {produtos.map((produto) => (<SelectItem key={produto.value} value={produto.value}>{produto.label}</SelectItem>))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                    <button onClick={() => mudarAno(-1)} className="p-2 hover:bg-gray-200 rounded">
                        <ChevronLeft size={20} />
                    </button>
                    <input type="number" value={ano} onChange={(e) => setAno(Number(e.target.value))} className="border rounded px-3 py-2 w-[100px] text-center" />
                    <button onClick={() => mudarAno(1)} className="p-2 hover:bg-gray-200 rounded">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Gráfico de Barras por mês */}
            <BarChart xAxis={[{ data: meses, scaleType: "band" }]} series={dadosSeries} height={650} barLabel="value" margin={{ left: 0 }} yAxis={[{ width: 50 }]}/>
        </div>
    );
}

//tabela de envio de lotes
const clientes = [
    { id: 1, cliente: "Lojas Agrofeliz", lote: "67", qtd: "2", contrato: "150", status: "Enviado" },
    { id: 2, cliente: "Atacadão", lote: "91", qtd: "3", contrato: "67", status: "Entregue" },
    { id: 3, cliente: "Lojas Agrofeliz", lote: "66", qtd: "1", contrato: "151", status: "Pendente" },
    { id: 4, cliente: "Mercado Rural", lote: "72", qtd: "4", contrato: "89", status: "Enviado" },
    { id: 5, cliente: "Distribuidora Campo Forte", lote: "85", qtd: "2", contrato: "102", status: "Entregue" },
    { id: 6, cliente: "Agrocenter", lote: "78", qtd: "5", contrato: "93", status: "Pendente" },
    { id: 7, cliente: "Lojas Agrofeliz", lote: "69", qtd: "3", contrato: "152", status: "Enviado" },
    { id: 8, cliente: "Atacadão", lote: "92", qtd: "2", contrato: "68", status: "Entregue" }
];

export function EnvioLotes() {
    const [categoria, setCategoria] = useState("");
    const [status, setStatus] = useState("");
    const [busca, setBusca] = useState("");

    return (
        <div className="border rounded-lg shadow-sm bg-white dark:bg-gray-900 h-full p-4">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <h2 className="text-xl font-semibold">Estoque</h2>
                    <Select onValueChange={setCategoria}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Ordenar por</SelectLabel>
                                <SelectItem value="id">Id</SelectItem>
                                <SelectItem value="cliente">Alfabetica</SelectItem>
                                <SelectItem value="contrato">Contrato</SelectItem>
                                <SelectItem value="status">Pendente</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <Input type="text" placeholder="Buscar..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-[250px]" />
            </div>
            {/* Tabela */}
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-gray-800">
                        <TableHead className="w-[80px] font-semibold">ID</TableHead>
                        <TableHead className="font-semibold">Cliente</TableHead>
                        <TableHead className="font-semibold">Lote</TableHead>
                        <TableHead className="font-semibold">qtd</TableHead>
                        <TableHead className="font-semibold">Contrato</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clientes
                        .filter((cliente) =>
                            (!categoria || cliente.tipo === categoria) &&
                            (!status || cliente.status === status) &&
                            (!busca || cliente.cliente.toLowerCase().includes(busca.toLowerCase()))
                        )
                        .map((cliente) => (
                            <TableRow key={cliente.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <TableCell className="font-medium">{cliente.id}</TableCell>
                                <TableCell>{cliente.cliente}</TableCell>
                                <TableCell>{cliente.lote}</TableCell>
                                <TableCell>{cliente.qtd}</TableCell>
                                <TableCell> {cliente.contrato}</TableCell>
                                <TableCell> {cliente.status}</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    );
}