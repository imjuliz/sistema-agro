"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, } from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { MoreVertical } from "lucide-react"

const defaultData = [
    { id: 1, name: "Fazenda 02", email: "f.02@company.com", local: "São Paulo", status: "Ativa", tel:"(11) 98342-7610  ", produtos: 'Pão, Trigo, Sementes', cnpj: "01.234.567/0001-89" },
    { id: 2, name: "Fazenda 05", email: "f.05@company.com", local: "Minas Gerais", status: "Ativa", tel:"(31) 99785-2043", produtos: 'Laticinios', cnpj: "12.345.678/0001-90" },
    { id: 3, name: "Fazenda 54", email: "f.54@company.com", local: "Mato Grosso", status: "Inativa", tel: "(65) 99214-3387 ", produtos: 'Maçãs, Laranjas, Mexiricas', cnpj: "23.456.789/0001-01" },
    { id: 4, name: "Fazenda 12", email: "f.12@company.com", local: "São Paulo", status: "Ativa", tel: "(19) 99670-3321  ", produtos: 'Ovos, Farinha, Açucar ', cnpj: "34.567.890/0001-12" },
    { id: 5, name: "Fazenda 8", email: "f.08@company.com", local: "Bahia", status: "Ativa", tel: " (71) 98546-1097  ", produtos: 'Feijão, Arroz, Milho', cnpj: "45.678.901/0001-23" },
]

export default function FornecedoresTable() {
    const [data] = useState(defaultData)
    const [selectedRows, setSelectedRows] = useState(new Set())

    // Filters
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("Tudo")
    const [local, setlocal] = useState("Local")
    const [produtosAfter, setprodutosAfter] = useState()

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            if (status !== "Tudo" && item.status !== status) return false
            if (local !== "Local" && item.local !== local) return false
            if (search && !`${item.name} ${item.email}`.toLowerCase().includes(search.toLowerCase())) return false
            if (produtosAfter && item.produtos < produtosAfter) return false
            return true
        });
    }, [data, search, status, local, produtosAfter])

    const toggleRow = (id) => {
        setSelectedRows((prev) => {
            const newSet = new Set(prev)
            newSet.has(id) ? newSet.delete(id) : newSet.add(id)
            return newSet
        })
    }

    return (
        <div className="bg-background border rounded-lg overflow-hidden">
            <div className="p-4 flex flex-col gap-3 md:flex-row md:flex-wrap items-start md:items-center">
                <Input placeholder="Pesquise por nome ou email" value={search} onChange={(e) => setSearch(e.target.value)} className="md:w-1/4" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">{status}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {["Tudo", "Ativa", "Inativa"].map((s) => (
                            <DropdownMenuItem key={s} onClick={() => setStatus(s)}>{s}</DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">{local}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent> {["Local", "São Paulo", "Minas Gerais", "Mato Grosso", "São Paulo", "Bahia"].map((loc) => (
                            <DropdownMenuItem key={loc} onClick={() => setlocal(loc)}>{loc}</DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
                <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                        <TableRow>
                            <TableHead>
                                <Checkbox checked={selectedRows.size === data.length} onCheckedChange={(checked) =>setSelectedRows(checked ? new Set(data.map((d) => d.id)) : new Set())} />
                            </TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Local</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tel</TableHead>
                            <TableHead>Produtos</TableHead>
                            <TableHead>CNPJ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.map((row) => (
                            <TableRow key={row.id} className="hover:bg-muted/30">
                                <TableCell>
                                    <Checkbox checked={selectedRows.has(row.id)} onCheckedChange={() => toggleRow(row.id)} />
                                </TableCell>
                                <TableCell className="font-medium">{row.name}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.local}</TableCell>
                                <TableCell><Badge variant={row.status === "Ativa" ? "secondary" : "destructive"}>{row.status}</Badge></TableCell>
                                <TableCell>{row.tel}</TableCell>
                                <TableCell>{row.produtos}</TableCell>
                                <TableCell>{row.cnpj}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="ghost">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem>Visualizar</DropdownMenuItem>
                                            <DropdownMenuItem>Editar</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">Deletar</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter className="sticky bottom-0 bg-background">
                        <TableRow>
                            <TableCell colSpan={7}>Total de Fornecedores</TableCell>
                            <TableCell>{filteredData.length}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>
    );
}
