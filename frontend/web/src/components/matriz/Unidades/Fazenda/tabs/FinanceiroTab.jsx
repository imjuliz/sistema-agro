"use client"
import ReactDOM from "react-dom";
import React, { useState, useMemo, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/config';
import { CartesianGrid, Line, LineChart, XAxis, Pie, PieChart, Sector, Label, Bar, BarChart, LabelList, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, TrendingUp, TrendingDown, DollarSign, Award, AlertCircle, ChevronDown, ArrowUpDown, MoreHorizontal, BarChart3, Calculator, CreditCard, Wallet, Filter, Receipt, BanknoteArrowDown, BanknoteArrowUp, Crosshair, Package, Loader, X, Download, Trash2 } from 'lucide-react';
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
import { DataTableActionBar, DataTableActionBarAction, DataTableActionBarSelection } from "@/components/Tabelas/DataTableActionBar";
import { DataTablePagination } from "@/components/Tabelas/DataTablePagination";

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
  { month: "Janeiro", receitas: 186, despesas: 80 },
  { month: "Fevereiro", receitas: 305, despesas: 200 },
  { month: "Março", receitas: 237, despesas: 120 },
  { month: "Abril", receitas: 73, despesas: 190 },
  { month: "Maio", receitas: 209, despesas: 130 },
  { month: "Junho", receitas: 214, despesas: 140 },
]
const receitasDespesasConfig = {
  receitas: {
    label: "Receitas",
    color: "var(--chart-1)",
  },
  despesas: {
    label: "Despesas",
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
  { month: "Janeiro", desktop: 186, mobile: 80 },
  { month: "Fevereiro", desktop: 305, mobile: 200 },
  { month: "Março", desktop: 237, mobile: 120 },
  { month: "Abril", desktop: 73, mobile: 190 },
  { month: "Maio", desktop: 209, mobile: 130 },
  { month: "Junho", desktop: 214, mobile: 140 },
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
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onCheckedChange={(v) => table.toggleAllRowsSelected(!!v)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label={`Select row ${row.id}`}
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
    header: "Valor (R$)"
    // header: ({ column }) => {
    //    return (
    //      <Button
    //        variant="ghost"
    //        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //      >
    //        Valor (R$)
    //        <ArrowUpDown /> 
    //      </Button> 
    //    )
    // }
    ,
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


export function FinanceiroTab({ unidadeId }) {
  const { fetchWithAuth, user } = useAuth();
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  
  // Estados para dados do backend
  const [categories, setCategories] = useState([]);
  const [accountsPayable, setAccountsPayable] = useState([]);
  const [accountsReceivable, setAccountsReceivable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const table = useReactTable({
    data,
    columns,
    // onSortingChange: setSorting,
    // onColumnFiltersChange: setColumnFilters,
    // getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    // getSortedRowModel: getSortedRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
    // onColumnVisibilityChange: setColumnVisibility,
    // onRowSelectionChange: setRowSelection,

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      // pagination: { pageSize },
    },
  })

  const userPerfilRaw = user?.perfil ?? null;
  const perfilNome = typeof userPerfilRaw === 'string'
    ? userPerfilRaw.toUpperCase()
    : String(userPerfilRaw?.funcao ?? userPerfilRaw?.nome ?? '').toUpperCase();
  const isGerenteMatriz = perfilNome === 'GERENTE_MATRIZ';
  const userUnidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
  const readOnly = isGerenteMatriz && unidadeId && unidadeId !== userUnidadeId;

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
  const [selectedMonth, setSelectedMonth] = useState((currentDate.getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());

  const years = useMemo(() => {
    const allDates = [
      ...accountsPayable.map(acc => acc.competencia || acc.competencyDate),
      ...accountsReceivable.map(acc => acc.competencia || acc.competencyDate)
    ];

    const yearSet = new Set(allDates.map(date => {
      const d = new Date(date);
      return d.getFullYear();
    }));
    yearSet.add(currentDate.getFullYear());

    return Array.from(yearSet).sort((a, b) => b - a);
  }, [accountsPayable, accountsReceivable, currentDate]);

  // Funções para buscar dados do backend
  const fetchCategorias = async () => {
    try {
      const qs = unidadeId ? `?unidadeId=${unidadeId}` : '';
      const response = await fetchWithAuth(`${API_URL}/categorias${qs}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        const msg = text || `Status ${response.status}`;
        setError('Erro ao carregar categorias');
        return;
      }

      const result = await response.json().catch(() => null);
      if (result.sucesso && result.dados) {
        // Buscar subcategorias para cada categoria
        const categoriasComSubcategorias = await Promise.all(
          result.dados.map(async (categoria) => {
            try {
              const subResponse = await fetchWithAuth(
                `${API_URL}/api/categorias/${categoria.id}/subcategorias`,
                {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
              );

              if (subResponse.ok) {
                const subResult = await subResponse.json();
                return {
                  id: categoria.id.toString(),
                  name: categoria.nome,
                  type: categoria.tipo === 'ENTRADA' ? 'entrada' : 'saida',
                  subcategories: subResult.sucesso && subResult.dados
                    ? subResult.dados.map(sub => ({
                        id: sub.id.toString(),
                        name: sub.nome,
                        categoryId: categoria.id.toString()
                      }))
                    : []
                };
              }
              return {
                id: categoria.id.toString(),
                name: categoria.nome,
                type: categoria.tipo === 'ENTRADA' ? 'entrada' : 'saida',
                subcategories: []
              };
            } catch (err) {
              console.error('Erro ao buscar subcategorias:', err);
              return {
                id: categoria.id.toString(),
                name: categoria.nome,
                type: categoria.tipo === 'ENTRADA' ? 'entrada' : 'saida',
                subcategories: []
              };
            }
          })
        );
        setCategories(categoriasComSubcategorias);
      }
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
      setError('Erro ao carregar categorias');
    }
  };

  const fetchContas = async () => {
    try {
      const mes = parseInt(selectedMonth);
      const ano = parseInt(selectedYear);

      const unidadeQs = unidadeId ? `&unidadeId=${unidadeId}` : '';
      const response = await fetchWithAuth(
        `${API_URL}/contas-financeiras?mes=${mes}&ano=${ano}${unidadeQs}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        const msg = text || `Status ${response.status}`;
        setError('Erro ao carregar contas');
        return;
      }

      const result = await response.json().catch(() => null);
      if (result.sucesso && result.dados) {
        // Separar contas a pagar e a receber
        const contasPagar = [];
        const contasReceber = [];

        result.dados.forEach(conta => {
          const isReceita = conta.tipoMovimento === 'ENTRADA';
          const status = conta.status === 'PAGA' || conta.status === 'RECEBIDA'
            ? (isReceita ? 'received' : 'paid')
            : conta.status === 'VENCIDA'
            ? 'overdue'
            : 'pending';

          const contaFormatada = {
            id: conta.id.toString(),
            competencyDate: conta.competencia || conta.competenciaData,
            dueDate: conta.vencimento || conta.vencimentoData,
            paymentDate: conta.dataPagamento || conta.dataRecebimento || undefined,
            amount: parseFloat(conta.valor),
            subcategoryId: conta.subcategoriaId ? conta.subcategoriaId.toString() : conta.categoriaId?.toString() || '',
            description: conta.descricao || '',
            status: status,
            categoriaId: conta.categoriaId?.toString() || '',
            formaPagamento: conta.formaPagamento || '',
            documento: conta.documento || '',
            observacao: conta.observacao || ''
          };

          if (isReceita) {
            contasReceber.push(contaFormatada);
          } else {
            contasPagar.push(contaFormatada);
          }
        });

        setAccountsPayable(contasPagar);
        setAccountsReceivable(contasReceber);
      }
    } catch (err) {
      console.error('Erro ao buscar contas:', err);
      setError('Erro ao carregar contas');
    }
  };

  // useEffect para carregar dados iniciais
  useEffect(() => {
    if (!unidadeId) return; // aguarda unidade para evitar carregar matriz por engano
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([fetchCategorias(), fetchContas()]);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados financeiros');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [unidadeId]); // recarregar ao trocar unidade

  // Recarregar contas quando mês/ano mudar
  useEffect(() => {
    if (!loading && unidadeId) {
      fetchContas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear, unidadeId]);

  const getSelectedMonthName = () => {
    const monthObj = months.find(m => m.value === selectedMonth);
    return monthObj ? monthObj.label : '';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Funções para salvar no backend
  const handleCategoriesChange = async (newCategories) => {
    setCategories(newCategories);
    // As mudanças de categorias serão salvas pelos componentes filhos
  };

  const handleAccountsPayableChange = async (newAccounts) => {
    setAccountsPayable(newAccounts);
    // As mudanças de contas serão salvas pelos componentes filhos
  };

  const handleAccountsReceivableChange = async (newAccounts) => {
    setAccountsReceivable(newAccounts);
    // As mudanças de contas serão salvas pelos componentes filhos
  };

  // Filtrar dados baseado no período selecionado
  const filteredData = useMemo(() => {
    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);

    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);

    const filteredPayable = accountsPayable.filter(acc => {
      const competencyDate = new Date(acc.competencyDate || acc.competencia);
      return competencyDate >= monthStart && competencyDate <= monthEnd;
    });

    const filteredReceivable = accountsReceivable.filter(acc => {
      const competencyDate = new Date(acc.competencyDate || acc.competencia);
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

  if (loading && categories.length === 0 && accountsPayable.length === 0 && accountsReceivable.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        
        <span className="ml-2">Carregando dados financeiros...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className={"p-0 h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition"}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg">
                <BanknoteArrowUp className="size-10" />
              </div>
              <div>
                <div className="text-2xl font-medium">47</div>
                <div className="text-sm text-muted-foreground">Receita total</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={"p-0 h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition"}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg">
                <BanknoteArrowDown className="size-10" />
              </div>
              <div>
                <div className="text-2xl font-medium">$890K</div>
                <div className="text-sm text-muted-foreground">Despesas totais</div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div> */}

      {/* <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Receitas e Despesas por mês</CardTitle>
            <CardDescription>Janeiro - Mês Atual AnoAtual</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={receitasDespesasConfig}>
              <LineChart accessibilityLayer data={receitasDespesas} margin={{ left: 12, right: 12, }} >
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Line dataKey="receitas" type="monotone" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                <Line dataKey="despesas" type="monotone" stroke="var(--chart-4)" strokeWidth={2} dot={false} />
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
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie data={despesasPorCategoria} dataKey="visitors" nameKey="browser" innerRadius={60} strokeWidth={5} activeIndex={0} activeShape={({ outerRadius = 0, ...props
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

        <Card>
          <CardHeader>
            <CardTitle>Fontes de receita</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={fontesReceitaConfig}>
              <BarChart accessibilityLayer data={fontesReceita} layout="vertical" margin={{ right: 16, }}>
                <CartesianGrid horizontal={false} />
                <YAxis dataKey="month" type="category" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} hide />
                <XAxis dataKey="desktop" type="number" hide />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Bar dataKey="desktop" layout="vertical" fill="var(--color-desktop)" radius={4}>
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
            <div className="text-muted-foreground leading-none">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
      </div> */}

      <Tabs defaultValue="payable" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payable" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />Despesas
          </TabsTrigger>
          <TabsTrigger value="receivable" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />Receitas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payable">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              
              <span className="ml-2">Carregando contas a pagar...</span>
            </div>
          ) : error ? (
            <div className="p-4 text-red-500">{error}</div>
          ) : (
            <AccountsPayable 
              accounts={accountsPayable} 
              categories={categories} 
              onAccountsChange={handleAccountsPayableChange}
              fetchWithAuth={fetchWithAuth}
              API_URL={API_URL}
              onRefresh={fetchContas}
              readOnly={readOnly}
              unidadeId={unidadeId}
            />
          )}
        </TabsContent>
        {/* Contas a Receber */}
        <TabsContent value="receivable">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              
              <span className="ml-2">Carregando contas a receber...</span>
            </div>
          ) : error ? (
            <div className="p-4 text-red-500">{error}</div>
          ) : (
            <AccountsReceivable 
              accounts={accountsReceivable} 
              categories={categories} 
              onAccountsChange={handleAccountsReceivableChange}
              fetchWithAuth={fetchWithAuth}
              API_URL={API_URL}
              onRefresh={fetchContas}
              readOnly={readOnly}
              unidadeId={unidadeId}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}