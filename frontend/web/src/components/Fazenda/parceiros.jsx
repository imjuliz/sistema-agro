"use client"

import { useState } from "react";
import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis} from "recharts"
import { toast } from "sonner"
import { z } from "zod"
import { useIsMobile } from "@/hooks/use-mobile"
import { closestCenter, DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors, } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { arrayMove, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconCircleCheckFilled, IconDotsVertical, IconGripVertical, IconLayoutColumns, IconLoader, IconPlus, IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"
import { flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, } from "@/components/ui/drawer"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs"
import { Card, CardAction, CardDescription,  CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"
import { SortableContext } from "@dnd-kit/sortable";
export const schema = z.object({ id: z.number(), header: z.string(), type: z.string(), status: z.string(), target: z.string(), limit: z.string(), reviewer: z.string(), })



// Create a separate component for the drag handle
function DragHandle({ id }) {
    const { attributes, listeners } = useSortable({ id, })

    return (
        <Button {...attributes} {...listeners} variant="ghost" size="icon" className="text-muted-foreground size-7 hover:bg-transparent">
            <IconGripVertical className="text-muted-foreground size-3" /><span className="sr-only">Drag to reorder</span>
        </Button>
    );
}

const columns = [
    {id: "drag",header: () => null,cell: ({ row }) => <DragHandle id={row.original.id} />,},
    {id: "select",header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />
            </div>
        ),
        cell: ({ row }) => (<div className="flex items-center justify-center"><Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" /></div>),
        enableSorting: false,enableHiding: false,
    },
    {accessorKey: "header", header: "Header",cell: ({ row }) => { return <TableCellViewer item={row.original} />; },enableHiding: false,},
    {accessorKey: "type",header: "Section Type",cell: ({ row }) => (<div className="w-32"><Badge variant="outline" className="text-muted-foreground px-1.5">{row.original.type}</Badge></div>),},
    {accessorKey: "status",header: "Status",
        cell: ({ row }) => (
            <Badge variant="outline" className="text-muted-foreground px-1.5">
                {row.original.status === "Done" ? (<IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />) : (<IconLoader />)}
                {row.original.status}
            </Badge>
        ),
    },
    {accessorKey: "target",header: () => <div className="w-full text-right">Target</div>,
        cell: ({ row }) => (
            <form onSubmit={(e) => {
                e.preventDefault()
                toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {loading: `Saving ${row.original.header}`,success: "Done",error: "Error",})
            }}>
                <Label htmlFor={`${row.original.id}-target`} className="sr-only">Target</Label>
                <Input className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent" defaultValue={row.original.target} id={`${row.original.id}-target`} />
            </form>
        ),
    },
    {accessorKey: "limit",header: () => <div className="w-full text-right">Limit</div>,
        cell: ({ row }) => (
            <form onSubmit={(e) => {
                e.preventDefault()
                toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), { loading: `Saving ${row.original.header}`, success: "Done", error: "Error", })
            }}>
                <Label htmlFor={`${row.original.id}-limit`} className="sr-only">Limit</Label>
                <Input className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent" defaultValue={row.original.limit} id={`${row.original.id}-limit`} />
            </form>
        ),
    },
    {accessorKey: "reviewer",header: "Reviewer",cell: ({ row }) => {
            const isAssigned = row.original.reviewer !== "Assign reviewer"
            if (isAssigned) { return row.original.reviewer }

            return (
                <>
                    <Label htmlFor={`${row.original.id}-reviewer`} className="sr-only">Reviewer</Label>
                    <Select>
                        <SelectTrigger className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate" size="sm" id={`${row.original.id}-reviewer`}>
                            <SelectValue placeholder="Assign reviewer" />
                        </SelectTrigger>
                        <SelectContent align="end">
                            <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                            <SelectItem value="Jamik Tashpulatov">Jamik Tashpulatov</SelectItem>
                        </SelectContent>
                    </Select>
                </>
            );
        },
    },
]


function DraggableRow({ row }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({ id: row.original.id, })

    return (
        <TableRow data-state={row.getIsSelected() && "selected"} data-dragging={isDragging} ref={setNodeRef} className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80" style={{ transform: CSS.Transform.toString(transform), transition: transition, }}>
            {row.getVisibleCells().map((cell) => (<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>))}
        </TableRow>
    );
}

const pedidos = [
    { id: 1, nome: "Lojas Agrofeliz", cnpj: "98.765.432", tel: "(11)91234567 ", email: "agroF@gmail.com", status: "Ativo" },
    { id: 2, nome: "Sonda Supermercado", cnpj: "12.345.678", tel: "(11)991231234 ", email: "sonsa@gmail.com", status: "Ativo" },
    { id: 3, nome: "Atacadão", cnpj: "13.241.128", tel: "(11)901981918", email: "atacadao@gmail.com", status: "inativo" },
    { id: 4, nome: "Fazenda São João", cnpj: "25.876.543", tel: "(19)987654321", email: "saojoao@farm.com", status: "Ativo" },
    { id: 5, nome: "Distribuidora Beta", cnpj: "40.333.222", tel: "(21)977778888", email: "beta.dist@email.com", status: "Ativo" },
    { id: 6, nome: "Mercado do Produtor", cnpj: "77.666.555", tel: "(81)934567890", email: "mercadoProd@mail.net", status: "inativo" },
    { id: 7, nome: "Cooperativa União", cnpj: "01.999.888", tel: "(47)900011122", email: "coop.uniao@outlook.com", status: "Ativo" },
    { id: 8, nome: "Hortifruti Brasil", cnpj: "32.109.876", tel: "(62)955554444", email: "hortifrutiBR@shop.com", status: "Ativo" }
];

export function DataTable({ data: initialData }) {
    const [data, setData] = React.useState(() => initialData)
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState({})
    const [columnFilters, setColumnFilters] = React.useState([])
    const [sorting, setSorting] = React.useState([])
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10, })
    const sortableId = React.useId()
    const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}))
    const dataIds = React.useMemo(() => data?.map(({ id }) => id) || [], [data])

    const table = useReactTable({
        data,columns,state: { sorting, columnVisibility, rowSelection, columnFilters, pagination, },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })


    function handleDragEnd(event) {
        const { active, over } = event
        if (active && over && active.id !== over.id) {
            setData((data) => {
                const oldIndex = dataIds.indexOf(active.id)
                const newIndex = dataIds.indexOf(over.id)
                return arrayMove(data, oldIndex, newIndex);
            })
        }
    }
    
        const [categoria, setCategoria] = useState("");
        const [status, setStatus] = useState("");
        const [busca, setBusca] = useState("");
    

    return (
        <Tabs defaultValue="geral" className="w-full flex-col justify-start gap-6">
            <div className="flex items-center justify-between px-4 lg:px-6">
                <Label htmlFor="view-selector" className="sr-only">View</Label>
                <Select defaultValue="geral">
                    <SelectTrigger className="flex w-fit @4xl/main:hidden" size="sm" id="view-selector">
                        <SelectValue placeholder="Select a view" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="geral">Parceiros</SelectItem>
                        <SelectItem value="fazendas">Contratos</SelectItem>
                    </SelectContent>
                </Select>
                <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
                    <TabsTrigger value="geral">Geral</TabsTrigger>
                    <TabsTrigger value="fazendas">Fazendas <Badge variant="secondary">3</Badge></TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <IconLayoutColumns />
                                <span className="hidden lg:inline">Customize Columns</span>
                                <span className="lg:hidden">Columns</span>
                                <IconChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {table
                                .getAllColumns()
                                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                                .map((column) => {return (<DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>{column.id}</DropdownMenuCheckboxItem>);})}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" size="sm"><IconPlus /><span className="hidden lg:inline">Add Section</span></Button>
                </div>
            </div>
            <TabsContent value="geral" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
                <div className="overflow-hidden rounded-lg border">
                    <DndContext collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd} sensors={sensors} id={sortableId}>
                        <div className="border rounded-lg shadow-sm bg-white dark:bg-gray-900 h-full p-4">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <h2 className="text-xl font-semibold">Estoque</h2>
                    <Select onValueChange={setCategoria}>
                        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Status</SelectLabel>
                                <SelectItem value="ativo">Ativo</SelectItem>
                                <SelectItem value="inativo">Inativo</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <Input type="text" placeholder="Buscar..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-[250px]" />
            </div>
            <Table>
                <TableHeader className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                // Renderiza os cabeçalhos da tabela do React Table
                                return (
                                    <TableHead key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody className="**:data-[slot=table-cell]:first:w-8">
                    {/* AQUI ESTÁ A CHAVE: USAR table.getRowModel().rows PARA PAGINAÇÃO */}
                    {table?.getRowModel()?.rows?.length ? (
                        <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                            {table.getRowModel().rows.map((row) => (
                                <DraggableRow key={row.id} row={row} />
                            ))}
                        </SortableContext>
                    ) : (
                        <TableRow>
                            {/* Ajuste o colSpan para o número correto de colunas (7) */}
                            <TableCell colSpan={7} className="h-24 text-center">
                                Sem resultados.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
                    </DndContext>
                </div>
                <div className="flex items-center justify-between px-4">
                    <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                        {table.getFilteredSelectedRowModel().rows.length} de{" "}
                        {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
                    </div>
                    <div className="flex w-full items-center gap-8 lg:w-fit">
                        <div className="hidden items-center gap-2 lg:flex">
                            <Label htmlFor="rows-per-page" className="text-sm font-medium">Linhas por página</Label>
                            <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(value) => { table.setPageSize(Number(value)) }}>
                                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>{pageSize}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-fit items-center justify-center text-sm font-medium">
                            Página {table.getState().pagination.pageIndex + 1} de{" "}
                            {table.getPageCount()}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                                <span className="sr-only">Primeira página</span><IconChevronsLeft />
                            </Button>
                            <Button variant="outline" className="size-8" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                                <span className="sr-only">Página anterior</span><IconChevronLeft />
                            </Button>
                            <Button variant="outline" className="size-8" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                                <span className="sr-only">Próxima página</span><IconChevronRight />
                            </Button>
                            <Button variant="outline" className="hidden size-8 lg:flex" size="icon" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                                <span className="sr-only">Última página</span><IconChevronsRight />
                            </Button>
                        </div>
                    </div>
                </div>
            </TabsContent>

            {/* fazendas */}
            <TabsContent value="fazendas" className="flex flex-col px-4 lg:px-6">
                <div className="aspect-video w-full flex flex-col gap-8 rounded-lg border border-dashed">
                    <div className="w-full flex flex-row justify-between">
                        <div className="w-6/10">
                            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
                                <Card className="@container/card">
                                    <CardHeader>
                                        <CardDescription>Total de unidades/filiais ativas</CardDescription>
                                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                            $1,250.00
                                        </CardTitle>
                                        <CardAction>
                                            <Badge variant="outline">
                                                <IconTrendingUp />
                                                +12.5%
                                            </Badge>
                                        </CardAction>
                                    </CardHeader>
                                </Card>
                                <Card className="@container/card">
                                    <CardHeader>
                                        <CardDescription>Faturamento total consolidado</CardDescription>
                                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                            1,234
                                        </CardTitle>
                                        <CardAction>
                                            <Badge variant="outline">
                                                <IconTrendingDown />
                                                -20%
                                            </Badge>
                                        </CardAction>
                                    </CardHeader>
                                </Card>
                                <Card className="@container/card">
                                    <CardHeader>
                                        <CardDescription>Active Accounts</CardDescription>
                                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                            45,678
                                        </CardTitle>
                                        <CardAction>
                                            <Badge variant="outline">
                                                <IconTrendingUp />
                                                +12.5%
                                            </Badge>
                                        </CardAction>
                                    </CardHeader>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    );
}
