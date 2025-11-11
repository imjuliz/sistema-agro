"use client"
import * as React from 'react';
import { useState } from "react";
import { Pie, PieChart } from "recharts"
//ui
import { Card, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Layers, TriangleAlert, TrendingUpDown } from 'lucide-react'
//mui

export function SectionCards() {
    return (
        <div className="grid grid-cols-4 md:grid-cols-4 gap-8 px-8 min-w-[20%] mx-auto w-full mb-10">
            <Card className="h-fit p-0">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg">
                            <Layers className="size-10" />
                        </div>
                        <div>
                            <CardDescription>Animais ativos</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">627</CardTitle>
                            {/* <div className="text-2xl font-medium">150 ha</div>
                                      <div className="text-sm text-muted-foreground">Área Total</div> */}
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="h-fit p-0">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg">
                            <Layers className="size-10" />
                        </div>
                        <div>
                            <CardDescription>Lotes ativos</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">120</CardTitle>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="h-fit p-0">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg">
                            <TriangleAlert className="size-10" />
                        </div>
                        <div>
                            <CardDescription>Alerta de sanidade</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center justify-between">12 </CardTitle>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="h-fit p-0 gap-0">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg">
                            <TrendingUpDown className="size-10" />
                        </div>
                        <div>
                            <CardDescription>Mentabilidade por lote</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center justify-between">R$ 15,09F</CardTitle>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col items-start gap-1.5 text-sm p-4">
                    <div className="line-clamp-1 flex gap-2 font-medium">Receita - Custo por lote</div>
                    <div className="text-muted-foreground">Bom</div>
                    <Select />
                </CardFooter>
            </Card>
        </div>
    );
}

//grafico de pizza
const chartData = [
    { browser: "Bovinos", visitors: 275, fill: "var(--color-chrome)" }, { browser: "Suínos", visitors: 200, fill: "var(--color-safari)" },
    { browser: "Aves", visitors: 187, fill: "var(--color-firefox)" }
]

const chartConfig = {
    visitors: { label: "Visitors", }, chrome: { label: "Bovinos", color: "var(--chart-1)", },
    safari: { label: "Suínos", color: "var(--chart-2)", }, firefox: { label: "Aves", color: "var(--chart-3)", }
}
export function ChartPieDonut() {
    return (
        <Card className="flex flex-col w-full h-full">
            <CardHeader className="items-center pb-0">
                <CardTitle>Lotes em andamento</CardTitle>
                <CardDescription>750</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4 flex justify-center items-center">
                <ChartContainer config={chartConfig} className="w-[90%] h-[90%] flex justify-center items-center">
                    <PieChart width={300} height={300}>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie data={chartData} dataKey="visitors" nameKey="browser" innerRadius={80} outerRadius={120} />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}


const atividades = [
    { id: 1, descricao: "Engordamento dos bois", tipo: "Alimentação", lote: "127", data: "16/10", responsavel: "Ana Costa" },
    { id: 2, descricao: "Vacinação das ovelhas", tipo: "Vacinação", lote: "58", data: "16/10", responsavel: "Eduardo" },
    { id: 3, descricao: "Pesagem dos suínos", tipo: "Monitoramento", lote: "34", data: "17/10", responsavel: "Mariana Lopes" },
    { id: 4, descricao: "Limpeza dos bebedouros", tipo: "Higiene", lote: "127", data: "18/10", responsavel: "Carlos Mendes" },
    { id: 5, descricao: "Aplicação de vermífugo nos bovinos", tipo: "Medicação", lote: "127", data: "19/10", responsavel: "Fernanda Silva" },
    { id: 6, descricao: "Troca de cama das aves", tipo: "Higiene", lote: "22", data: "20/10", responsavel: "João Pereira" },
    { id: 7, descricao: "Separação dos animais por idade", tipo: "Organização", lote: "58", data: "21/10", responsavel: "Luciana Rocha" },
    { id: 8, descricao: "Inspeção veterinária dos equinos", tipo: "Saúde", lote: "45", data: "22/10", responsavel: "Roberto Lima" }
];


export function TableDemo() {
    const [categoria, setCategoria] = useState("");
    const [busca, setBusca] = useState("");

    return (
        <div className="border rounded-lg shadow-sm bg-white dark:bg-gray-900 h-full p-4">
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
            <Table>
                <TableCaption>Atividades Animais</TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-gray-800">
                        <TableHead className="w-[80px] font-semibold">ID</TableHead>
                        <TableHead className="font-semibold">Descrição</TableHead>
                        <TableHead className="font-semibold">Tipo</TableHead>
                        <TableHead className="font-semibold">Lote</TableHead>
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
                            <TableCell>{atvd.data}</TableCell>
                            <TableCell>{atvd.responsavel}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

//tabela de lotes(animais)
const lotes = [
    { id: 1, animal: "Nelore", tipo: "Bovinos", preco: "450", unMedida: "arroba", status: "Em desenvolvimento", finalidade: "Corte", qtd: "500" },
    { id: 2, animal: "Merina", tipo: "Ovinos", preco: "360", unMedida: "arroba", status: "Em reprodução", finalidade: "Lã", qtd: "275" },
    { id: 3, animal: "Galinha", tipo: "Aves", preco: "750", unMedida: "un", status: "Em engorda", finalidade: "Corte", qtd: "1200" },
    { id: 4, animal: "Nelore", tipo: "Bovinos", preco: "560", unMedida: "arroba", status: "Em reprodução", finalidade: "Corte", qtd: "320" },
    { id: 5, animal: "Angus", tipo: "Bovinos", preco: "480", unMedida: "arroba", status: "Em engorda", finalidade: "Corte", qtd: "450" },
    { id: 6, animal: "Leiteiro Holandês", tipo: "Bovinos", preco: "520", unMedida: "arroba", status: "Produzindo leite", finalidade: "Leite", qtd: "150" },
    { id: 7, animal: "Cabra Saanen", tipo: "Caprinos", preco: "390", unMedida: "arroba", status: "Em reprodução", finalidade: "Leite", qtd: "200" },
    { id: 8, animal: "Peru", tipo: "Aves", preco: "680", unMedida: "un", status: "Em engorda", finalidade: "Corte", qtd: "300" }
];

export function TableDemo2() {
    const [categoria, setCategoria] = useState("");
    const [busca, setBusca] = useState("");

    return (
        <div className="border rounded-lg shadow-sm bg-white dark:bg-gray-900 h-full p-4">
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
            <Table>
                <TableCaption>Lotes de Animais</TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-gray-800">
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
                    {lotes.map((lote) => (
                        <TableRow key={lote.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <TableCell className="font-medium">{lote.id}</TableCell>
                            <TableCell>{lote.animal}</TableCell>
                            <TableCell>{lote.tipo}</TableCell>
                            <TableCell>R$ {lote.preco}</TableCell>
                            <TableCell>{lote.qtd}{lote.unMedida}</TableCell>
                            <TableCell>{lote.status}</TableCell>
                            <TableCell>{lote.finalidade}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}