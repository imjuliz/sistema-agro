"use client"
import React, { useState, useMemo } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, Pie, PieChart, Sector, Label, Bar, BarChart, LabelList, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, TrendingUp, TrendingDown, DollarSign, Award, AlertCircle, ChevronDown, ArrowUpDown, MoreHorizontal, BarChart3, Calculator, CreditCard, Wallet, Filter, } from 'lucide-react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, } from "@/components/ui/chart"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState, } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import useLocalStorage from '@/hooks/useLocalStorage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryManager, Category } from '@/components/Financeiro/CategoryManager';
import { AccountsPayable, AccountPayable } from '@/components/Financeiro/AccountsPayable';
import { AccountsReceivable, AccountReceivable } from '@/components/Financeiro/AccountsReceivable';
import { CashFlow } from '@/components/Financeiro/CashFlow';
import { IncomeStatement } from '@/components/Financeiro/IncomeStatement';

const financas = [
  {
    id: 1,
    type: 'milestone',
    title: 'Contract Renewed',
    description: 'Annual contract renewed for $150K. Increased scope to include executive search.',
    date: 'December 1, 2024',
    user: 'System',
    impact: 'positive',
    value: '$150,000'
  },
  {
    id: 2,
    type: 'placement',
    title: 'Successful Placement - Senior Developer',
    description: 'Jennifer Martinez successfully placed as Senior Full Stack Developer. Client extremely satisfied with candidate quality.',
    date: 'November 15, 2024',
    user: 'Alex Smith',
    impact: 'positive',
    fee: '$25,000'
  },
  {
    id: 3,
    type: 'issue',
    title: 'Candidate Withdrawal',
    description: 'Top candidate for Product Manager role withdrew due to competing offer. Resuming search with alternative candidates.',
    date: 'November 8, 2024',
    user: 'Emma Wilson',
    impact: 'negative'
  },
  {
    id: 4,
    type: 'milestone',
    title: 'Quarterly Business Review',
    description: 'Q3 review completed. 15 positions filled, 92% success rate. Client requested additional focus on diversity hiring.',
    date: 'October 30, 2024',
    user: 'Alex Smith',
    impact: 'positive',
    metrics: { filled: 15, successRate: '92%' }
  },
  {
    id: 5,
    type: 'placement',
    title: 'Successful Placement - UX Designer',
    description: 'Sarah Thompson placed as Lead UX Designer. Start date confirmed for November 1st.',
    date: 'October 20, 2024',
    user: 'Mike Johnson',
    impact: 'positive',
    fee: '$18,000'
  },
  {
    id: 6,
    type: 'contract',
    title: 'Scope Expansion',
    description: 'Contract expanded to include C-level executive search. Additional $50K annual value.',
    date: 'September 15, 2024',
    user: 'Alex Smith',
    impact: 'positive',
    value: '+$50,000'
  }
];

const getEventIcon = (type) => {
  switch (type) {
    case 'milestone': return <Award className="size-4" />;
    case 'placement': return <TrendingUp className="size-4" />;
    case 'issue': return <AlertCircle className="size-4" />;
    case 'contract': return <DollarSign className="size-4" />;
    default: return <Calendar className="size-4" />;
  }
};

const getEventColor = (type, impact) => {
  if (impact === 'negative') return 'bg-red-100 text-red-600';

  switch (type) {
    case 'milestone': return 'bg-purple-100 text-purple-600';
    case 'placement': return 'bg-green-100 text-green-600';
    case 'contract': return 'bg-blue-100 text-blue-600';
    case 'issue': return 'bg-red-100 text-red-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const getImpactBadge = (impact) => {
  switch (impact) {
    case 'positive': return 'default';
    case 'negative': return 'destructive';
    default: return 'secondary';
  }
};



// --------------------------------------------------------------------------------------------
// grafico de Receitas e Despesas por mês
// --------------------------------------------------------------------------------------------
const receitasDespesas = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]
const receitasDespesasConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
}

// --------------------------------------------------------------------------------------------
// grafico de Distribuição de despesas por categoria
// --------------------------------------------------------------------------------------------
const despesasPorCategoria = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]
const despesasPorCategoriaConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
}

// --------------------------------------------------------------------------------------------
// grafico de Fontes de receita
// --------------------------------------------------------------------------------------------
const fontesReceita = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]
const fontesReceitaConfig = {
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

// --------------------------------------------------------------------------------------------
// tabela de Detalhamento de custos e receitas
// --------------------------------------------------------------------------------------------
const data = [
  {
    id: "m5gr84i9",
    observacao: "Fertilizantes e defensivos",
    categoria: "Insumos agrícolas",
    tipo: 'Despesa',
    valor: 35000,
    percentual: "19%"
  },
  {
    id: "m5gr84i9",
    observacao: "Produção de janeiro",
    categoria: "Venda de soja",
    tipo: 'Receita',
    valor: 85000,
    percentual: "47%"
  },
  {
    id: "m5gr84i9",
    observacao: "Fazenda sede",
    categoria: "Energia elétrica",
    tipo: 'Despesa',
    valor: 4500,
    percentual: "2%"
  },
  {
    id: "m5gr84i9",
    observacao: "12 funcionários",
    categoria: "Mão de obra",
    tipo: 'Despesa',
    valor: 45000,
    percentual: "24%"
  },

]

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "categoria",
    header: "Categoria",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("categoria")}</div>
    ),
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("tipo")}</div>
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
          Valor (R$)
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("valor")}</div>,
  },
  {
    accessorKey: "percentual",
    header: "Percentual",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("percentual")}</div>
    ),
  },
  {
    accessorKey: "observacao",
    header: "Observação",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("observacao")}</div>
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


export function FinanceiroTab() {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
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

  // Dados padrão para inicialização
  const defaultCategories = [
    {
      id: '1',
      name: 'Salário',
      type: 'entrada',
      subcategories: [
        { id: '1-1', name: 'Salário Principal', categoryId: '1' },
        { id: '1-2', name: 'Hora Extra', categoryId: '1' }
      ]
    },
    {
      id: '2',
      name: 'Freelance',
      type: 'entrada',
      subcategories: [
        { id: '2-1', name: 'Projetos Web', categoryId: '2' },
        { id: '2-2', name: 'Consultoria', categoryId: '2' }
      ]
    },
    {
      id: '3',
      name: 'Moradia',
      type: 'saida',
      subcategories: [
        { id: '3-1', name: 'Aluguel', categoryId: '3' },
        { id: '3-2', name: 'Condomínio', categoryId: '3' },
        { id: '3-3', name: 'IPTU', categoryId: '3' }
      ]
    },
    {
      id: '4',
      name: 'Alimentação',
      type: 'saida',
      subcategories: [
        { id: '4-1', name: 'Supermercado', categoryId: '4' },
        { id: '4-2', name: 'Restaurantes', categoryId: '4' },
        { id: '4-3', name: 'Delivery', categoryId: '4' }
      ]
    },
    {
      id: '5',
      name: 'Transporte',
      type: 'saida',
      subcategories: [
        { id: '5-1', name: 'Combustível', categoryId: '5' },
        { id: '5-2', name: 'Transporte Público', categoryId: '5' },
        { id: '5-3', name: 'Manutenção Veículo', categoryId: '5' }
      ]
    }
  ];

  const defaultAccountsPayable = [
    {
      id: '1',
      competencyDate: '2024-12-01',
      dueDate: '2024-12-15',
      paymentDate: '2024-12-14',
      amount: 1200,
      subcategoryId: '3-1',
      description: 'Aluguel apartamento',
      status: 'paid'
    },
    {
      id: '2',
      competencyDate: '2024-12-01',
      dueDate: '2024-12-20',
      amount: 450,
      subcategoryId: '4-1',
      description: 'Compras do mês',
      status: 'pending'
    }
  ];

  const defaultAccountsReceivable = [
    {
      id: '1',
      competencyDate: '2024-12-01',
      dueDate: '2024-12-05',
      paymentDate: '2024-12-05',
      amount: 5000,
      subcategoryId: '1-1',
      description: 'Salário dezembro',
      status: 'received'
    },
    {
      id: '2',
      competencyDate: '2024-12-15',
      dueDate: '2024-12-30',
      amount: 1500,
      subcategoryId: '2-1',
      description: 'Projeto website cliente',
      status: 'pending'
    }
  ];

  // Estados persistidos com localStorage
  const [accountsPayable, setAccountsPayable] = useLocalStorage('financial-app-accounts-payable', defaultAccountsPayable);
  const [accountsReceivable, setAccountsReceivable] = useLocalStorage('financial-app-accounts-receivable', defaultAccountsReceivable);

  // Opções para os selects
  const months = [
    { value: '1', label: 'Janeiro' },
    { value: '2', label: 'Fevereiro' },
    { value: '3', label: 'Março' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Maio' },
    { value: '6', label: 'Junho' },
    { value: '7', label: 'Julho' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' }
  ];

  const currentDate = new Date();

  const years = useMemo(() => {
    const allDates = [
      ...accountsPayable.map(acc => acc.competencyDate),
      ...accountsReceivable.map(acc => acc.competencyDate)
    ];

    const yearSet = new Set(allDates.map(date => new Date(date).getFullYear()));
    yearSet.add(currentDate.getFullYear());

    return Array.from(yearSet).sort((a, b) => b - a);
  }, [accountsPayable, accountsReceivable, currentDate]);

  const [categories, setCategories] = useLocalStorage('financial-app-categories', defaultCategories);
  const [selectedMonth, setSelectedMonth] = useState((currentDate.getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());

  const getSelectedMonthName = () => {
    const monthObj = months.find(m => m.value === selectedMonth);
    return monthObj ? monthObj.label : '';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Filtrar dados baseado no período selecionado
  const filteredData = useMemo(() => {
    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);

    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);

    const filteredPayable = accountsPayable.filter(acc => {
      const competencyDate = new Date(acc.competencyDate);
      return competencyDate >= monthStart && competencyDate <= monthEnd;
    });

    const filteredReceivable = accountsReceivable.filter(acc => {
      const competencyDate = new Date(acc.competencyDate);
      return competencyDate >= monthStart && competencyDate <= monthEnd;
    });

    return { filteredPayable, filteredReceivable };
  }, [accountsPayable, accountsReceivable, selectedMonth, selectedYear]);

  // Cálculos para dashboard baseados nos dados filtrados
  const dashboardStats = useMemo(() => {
    const { filteredPayable, filteredReceivable } = filteredData;

    const totalReceivable = filteredReceivable
      .filter(acc => acc.status === 'pending')
      .reduce((sum, acc) => sum + acc.amount, 0);

    const totalPayable = filteredPayable
      .filter(acc => acc.status === 'pending')
      .reduce((sum, acc) => sum + acc.amount, 0);

    const totalReceived = filteredReceivable
      .filter(acc => acc.status === 'received')
      .reduce((sum, acc) => sum + acc.amount, 0);

    const totalPaid = filteredPayable
      .filter(acc => acc.status === 'paid')
      .reduce((sum, acc) => sum + acc.amount, 0);

    const receivablePendingCount = filteredReceivable.filter(acc => acc.status === 'pending').length;
    const payablePendingCount = filteredPayable.filter(acc => acc.status === 'pending').length;
    const receivedCount = filteredReceivable.filter(acc => acc.status === 'received').length;
    const paidCount = filteredPayable.filter(acc => acc.status === 'paid').length;

    return { totalReceivable, totalPayable, totalReceived, totalPaid, receivablePendingCount, payablePendingCount, receivedCount, paidCount };
  }, [filteredData]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="size-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-medium">47</div>
                <div className="text-sm text-muted-foreground">Receita total</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="size-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-medium">$890K</div>
                <div className="text-sm text-muted-foreground">Despesas totais</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="size-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-medium">94%</div>
                <div className="text-sm text-muted-foreground">Custo por cultura</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="size-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-medium">94%</div>
                <div className="text-sm text-muted-foreground">Comparativo com meta</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Receitas e Despesas por mês */}
      <Card>
        <CardHeader>
          <CardTitle>Receitas e Despesas por mês</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={receitasDespesasConfig}>
            <LineChart
              accessibilityLayer
              data={receitasDespesas}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="desktop"
                type="monotone"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="mobile"
                type="monotone"
                stroke="var(--color-mobile)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 leading-none font-medium">
                Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
              </div>
              <div className="text-muted-foreground flex items-center gap-2 leading-none">
                Showing total visitors for the last 6 months
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Distribuição de despesas por categoria */}
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Distribuição de despesas por categoria</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={despesasPorCategoriaConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={despesasPorCategoria}
                dataKey="visitors"
                nameKey="browser"
                innerRadius={60}
                strokeWidth={5}
                activeIndex={0}
                activeShape={({
                  outerRadius = 0,
                  ...props
                }) => (
                  <Sector {...props} outerRadius={outerRadius + 10} />
                )}
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 leading-none font-medium">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Showing total visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>

      {/* Fontes de receita */}
      <Card>
        <CardHeader>
          <CardTitle>Fontes de receita</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={fontesReceitaConfig}>
            <BarChart
              accessibilityLayer
              data={fontesReceita}
              layout="vertical"
              margin={{
                right: 16,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="month"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              <XAxis dataKey="desktop" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar
                dataKey="desktop"
                layout="vertical"
                fill="var(--color-desktop)"
                radius={4}
              >
                <LabelList
                  dataKey="month"
                  position="insideLeft"
                  offset={8}
                  className="fill-(--color-label)"
                  fontSize={12}
                />
                <LabelList
                  dataKey="desktop"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Showing total visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>


      {/* tabela Detalhamento de custos e receitas */}
      <div className="w-full">
        <div className="flex items-center py-4">
          <h3>Detalhamento de custos e receitas</h3>
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


      <Tabs defaultValue="payable" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payable" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />Contas a Pagar
          </TabsTrigger>
          <TabsTrigger value="receivable" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />Contas a Receber
          </TabsTrigger>
        </TabsList>

        {/* Contas a Pagar */}
        <TabsContent value="payable">
          <AccountsPayable accounts={accountsPayable} categories={categories} onAccountsChange={setAccountsPayable} />
        </TabsContent>
        {/* Contas a Receber */}
        <TabsContent value="receivable">
          <AccountsReceivable accounts={accountsReceivable} categories={categories} onAccountsChange={setAccountsReceivable} />
        </TabsContent>
      </Tabs>

      {/* <div className="space-y-4">
        {financas.map((financa) => (
          <Card key={financa.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${getEventColor(financa.type, financa.impact)}`}>
                  {getEventIcon(financa.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{financa.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Calendar className="size-3" />
                        <span>{financa.date}</span>
                        <span>•</span>
                        <span>{financa.user}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {financa.type}
                      </Badge>
                      <Badge variant={getImpactBadge(financa.impact)} className="text-xs">
                        {financa.impact}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {financa.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      {financa.value && (
                        <div className="font-medium text-green-600">{financa.value}</div>
                      )}
                      {financa.fee && (
                        <div className="font-medium text-blue-600">Fee: {financa.fee}</div>
                      )}
                      {financa.metrics && (
                        <div className="flex items-center gap-2">
                          <span>Filled: {financa.metrics.filled}</span>
                          <span>•</span>
                          <span>Success: {financa.metrics.successRate}</span>
                        </div>
                      )}
                    </div>
                    <Avatar className="size-6">
                      <AvatarImage src="/api/placeholder/24/24" />
                      <AvatarFallback className="text-xs">
                        {financa.user === 'System' ? 'SY' : financa.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div> */}
    </div>
  );
}