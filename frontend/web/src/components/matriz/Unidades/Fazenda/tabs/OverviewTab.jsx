"use client"
import React, { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { API_URL } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LeftPanel } from '@/components/matriz/Unidades/Fazenda/LeftPanel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import buildImageUrl from '@/lib/image';
import { TrendingUp, TrendingDown, Users, Briefcase, Calendar, MessageSquare, ChevronDown, ArrowUpDown, MoreHorizontal, Phone, Mail, Building2, DollarSign, Bell, Clock, Plus, Tractor, LandPlot, Trees } from 'lucide-react';
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState, } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Pie, PieChart } from "recharts"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"

const recentActivities = [
  {
    id: 1,
    type: 'call',
    description: 'Phone call with Sarah Johnson about Senior Developer role',
    time: '2 hours ago',
    user: 'Alex Smith'
  },
  {
    id: 2,
    type: 'email',
    description: 'Sent candidate shortlist for Product Manager position',
    time: '4 hours ago',
    user: 'Emma Wilson'
  },
  {
    id: 3,
    type: 'meeting',
    description: 'Client meeting - Q1 hiring requirements discussion',
    time: '1 day ago',
    user: 'Alex Smith'
  },
  {
    id: 4,
    type: 'note',
    description: 'Added interview feedback for React Developer candidate',
    time: '2 days ago',
    user: 'Mike Johnson'
  }
];

const jobMetrics = [
  { title: 'Senior Developer', applications: 45, shortlisted: 8, interviewed: 3, status: 'active' },
  { title: 'Product Manager', applications: 32, shortlisted: 6, interviewed: 2, status: 'active' },
  { title: 'UX Designer', applications: 28, shortlisted: 5, interviewed: 1, status: 'paused' },
  { title: 'DevOps Engineer', applications: 19, shortlisted: 4, interviewed: 2, status: 'active' }
];

// --------------------------------------------------------------------------------
// lado esquerdo da tela
// --------------------------------------------------------------------------------
const contacts = [
  {
    id: 1,
    name: 'Sarah Johnson',
    title: 'Head of Engineering',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    avatar: '/api/placeholder/40/40',
    status: 'primary'
  },
  {
    id: 2,
    name: 'Michael Chen',
    title: 'HR Manager',
    email: 'michael.chen@techcorp.com',
    phone: '+1 (555) 234-5678',
    avatar: '/api/placeholder/40/40',
    status: 'secondary'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    title: 'Talent Acquisition Lead',
    email: 'emily.rodriguez@techcorp.com',
    phone: '+1 (555) 345-6789',
    avatar: '/api/placeholder/40/40',
    status: 'secondary'
  }
];

const reminders = [
  {
    id: 1,
    title: 'Follow up on Senior Developer role',
    time: '2:00 PM today',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Call Sarah Johnson about new requirements',
    time: 'Tomorrow 10:00 AM',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Send candidate shortlist',
    time: 'Dec 15, 3:00 PM',
    priority: 'low'
  }
];

// --------------------------------------------------------------------------------
// tabela de dados gerais da fazenda 
// --------------------------------------------------------------------------------
const data = [
  {
    id: "m5gr84i9",
    observacao: "Divisão de manejo",
    dado: "Talhões",
    valor: "8",
  },
  {
    id: "3u1reuv4",
    observacao: "Impacta produtividade",
    dado: "Tipo de solo",
    valor: "Argiloso / Arenoso",
  },
  {
    id: "derv1ws0",
    observacao: "Afeta irrigação",
    dado: "Topografia",
    valor: "Plana / Ondulada",
  },
  {
    id: "5kma53ae",
    observacao: "Planejamento",
    dado: "Clima",
    valor: "Tropical úmido",
  },
  {
    id: "bhqecj4p",
    observacao: "Exibir no mapa",
    dado: "Coordenadas",
    valor: "-22.908, -47.064",
  },
]

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <></>
    ),
    cell: ({ row }) => (
      <></>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "dado",
    header: "Dado",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("dado")}</div>
    ),
  },
  {
    accessorKey: "valor",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Valor
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("valor")}</div>,
  },
  {
    accessorKey: "observacao",
    header: () => <div className="">Observação</div>,
    cell: ({ row }) => (<div className="capitalize">{row.getValue("observacao")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

// --------------------------------------------------------------------------------
// grafico de Uso do Solo e Cultivo
// --------------------------------------------------------------------------------
const cultivos = [
  { cultura: "milho", area: 70, fill: "var(--chart-1)" },
  { cultura: "soja", area: 50, fill: "var(--chart-2)" },
]
const cultivosConfig = {
  area: {
    label: "Área",
  },
  milho: {
    label: "Milho",
    color: "var(--chart-1)",
  },
  soja: {
    label: "Soja",
    color: "var(--chart-2)",
  }
}

export function OverviewTab({ fazendaId }) {
  const { fetchWithAuth } = useAuth()
  const [dadosFazenda, setDadosFazenda] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})

  // Carregar dados da fazenda ao montar o componente
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true)
        if (!fazendaId) {
          console.warn("fazendaId não fornecido")
          return
        }

        const response = await fetchWithAuth(`${API_URL}unidades/${fazendaId}`)
        
        if (!response.ok) {
          console.error("Erro ao carregar dados da fazenda: status", response.status)
          return
        }

        const body = await response.json()
        const unidade = body?.unidade ?? body
        
        if (unidade) {
          setDadosFazenda(unidade)
        } else {
          console.error("Erro ao carregar dados da fazenda:", body)
        }
      } catch (error) {
        console.error("Erro ao buscar dados da fazenda:", error)
      } finally {
        setCarregando(false)
      }
    }

    if (fazendaId) {
      carregarDados()
    }
  }, [fazendaId, fetchWithAuth])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })


  return (
    <div className="flex gap-6 ">
      <div className="w-80 space-y-6">
        {/* Company Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informações da unidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="size-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Culturas atuais</div>
                <div className="text-sm text-muted-foreground">{carregando ? "Carregando..." : "Foco produtivo (ex.: Milho, soja)"}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="size-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Quantidade de funcionários</div>
                <div className="text-sm text-muted-foreground">{carregando ? "Carregando..." : dadosFazenda?.quantidadeFuncionarios || "0"}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="size-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Criado em</div>
                <div className="text-sm text-muted-foreground">{carregando ? "Carregando..." : (dadosFazenda?.criadoEm ? new Date(dadosFazenda.criadoEm).toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" }) : "-")}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="size-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">CNPJ</div>
                <div className="text-sm text-muted-foreground">{carregando ? "Carregando..." : dadosFazenda?.cnpj || "-"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Contacts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Contatos principais</CardTitle>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-start gap-3">
                <Avatar className="size-10">
                  <AvatarImage src={buildImageUrl(contact.avatar)} alt={contact.name} />
                  <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-sm">{contact.name}</div>
                    {contact.status === 'primary' && (
                      <Badge variant="default" className="text-xs">Primary</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{contact.title}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <Phone className="size-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <Mail className="size-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <MessageSquare className="size-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Reminders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Reminders</CardTitle>
            <Bell className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{reminder.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="size-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{reminder.time}</span>
                    </div>
                  </div>
                  <Badge
                    variant={reminder.priority === 'high' ? 'destructive' :
                      reminder.priority === 'medium' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {reminder.priority}
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="size-4 mr-2" />
              Add Reminder
            </Button>
          </CardContent>
        </Card>
      </div>


      <div className=" flex-1 min-w-0 space-y-6">
        {/* Dados Gerais da Área */}
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-6">
          {/* <div className="grid grid-cols-4 gap-4"> */}
          <Card className={"p-0 h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition"}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg">
                  <LandPlot className="size-10" />
                </div>
                <div>
                  <div className="text-2xl font-medium">{carregando ? "-" : (dadosFazenda?.areaTotal ? `${parseFloat(dadosFazenda.areaTotal).toFixed(2)} ha` : "0 ha")}</div>
                  <div className="text-sm text-muted-foreground">Área Total</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={"p-0 h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition"}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg">
                  <Tractor className="size-10" />
                </div>
                <div>
                  <div className="text-2xl font-medium">{carregando ? "-" : (dadosFazenda?.areaProdutiva ? `${parseFloat(dadosFazenda.areaProdutiva).toFixed(2)} ha` : "0 ha")}</div>
                  <div className="text-sm text-muted-foreground">Área Produtiva</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={"p-0 h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition"}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg">
                  <Trees className="size-10 " />
                </div>
                <div>
                  <div className="text-2xl font-medium">{carregando ? "-" : (dadosFazenda?.areaTotal && dadosFazenda?.areaProdutiva ? `${(parseFloat(dadosFazenda.areaTotal) - parseFloat(dadosFazenda.areaProdutiva)).toFixed(2)} ha` : "0 ha")}</div>
                  <div className="text-sm text-muted-foreground">Não Produtiva</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* tabela */}
        <div className="w-full">
          <div className="flex items-center py-4">
            <h3 className="leading-none font-semibold">Dados Gerais da Área</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Colunas <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Nenhum resultado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* mapa */}
        <div className=''>
          <Card>
            <CardHeader><CardTitle>Mapa</CardTitle></CardHeader>
            <CardContent>
              <div className='h-56 bg-muted rounded-md flex items-center justify-center'>
                <div>Mapa interativo (Leaflet / Mapbox) — pins das unidades</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Uso do Solo e Cultivo */}
        <div className="flex gap-8">
          {/* Gráfico de pizza (área por cultura) */}
          <Card className="flex flex-col flex-1 min-w-0">
            <CardHeader className="items-center pb-0">
              <CardTitle>Área por cultura</CardTitle>
              <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={cultivosConfig}
                className="mx-auto aspect-square max-h-[300px]"
              >
                <PieChart>
                  <ChartTooltip
                    content={<ChartTooltipContent nameKey="cultura" hideLabel />}
                  />
                  <Pie data={cultivos} dataKey="area" />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="cultura" />}
                    className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6 flex-1 min-w-0">
            {/* <div className="grid grid-cols-4 gap-4"> */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">

                  <div>
                    <div className="text-2xl font-medium">80%</div>
                    <div className="text-sm text-muted-foreground">Área produtiva</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">

                  <div>
                    <div className="text-2xl font-medium">Rotação de culturas</div>
                    <div className="text-sm text-muted-foreground">Sistema de cultivo</div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Produção e Produtividade */}

        {/* Estrutura e Infraestrutura */}

        {/* Indicadores Ambientais e Legais */}

        {/* Job Progress */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Job Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobMetrics.map((job, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{job.title}</span>
                      <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                        {job.status}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {job.applications} applications
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Shortlisted</div>
                      <div className="font-medium">{job.shortlisted}</div>
                      <Progress value={(job.shortlisted / job.applications) * 100} className="h-1 mt-1" />
                    </div>
                    <div>
                      <div className="text-muted-foreground">Interviewed</div>
                      <div className="font-medium">{job.interviewed}</div>
                      <Progress value={(job.interviewed / job.shortlisted) * 100} className="h-1 mt-1" />
                    </div>
                    <div>
                      <div className="text-muted-foreground">Offered</div>
                      <div className="font-medium">1</div>
                      <Progress value={33} className="h-1 mt-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

        {/* Recent Activity */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <Avatar className="size-8">
                    <AvatarImage src={`/api/placeholder/32/32`} />
                    <AvatarFallback>{activity.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm">{activity.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {activity.user} • {activity.time}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

      </div>
    </div>
  );
}