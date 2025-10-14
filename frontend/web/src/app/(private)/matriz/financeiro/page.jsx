"use client"
import React, { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoryManager, Category } from '@/components/Financeiro/CategoryManager';
import { AccountsPayable, AccountPayable } from '@/components/Financeiro/AccountsPayable';
import { AccountsReceivable, AccountReceivable } from '@/components/Financeiro/AccountsReceivable';
import { CashFlow } from '@/components/Financeiro/CashFlow';
import { IncomeStatement } from '@/components/Financeiro/IncomeStatement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Calculator, CreditCard, Wallet, TrendingUp, TrendingDown, BarChart3, FileText, Calendar, Filter } from 'lucide-react';

// para tradução
import { useTranslation } from "@/hooks/useTranslation";
import { Transl } from '@/components/TextoTraduzido/TextoTraduzido'

export default function App() {
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
  const [categories, setCategories] = useLocalStorage('financial-app-categories', defaultCategories);
  const [accountsPayable, setAccountsPayable] = useLocalStorage('financial-app-accounts-payable', defaultAccountsPayable);
  const [accountsReceivable, setAccountsReceivable] = useLocalStorage('financial-app-accounts-receivable', defaultAccountsReceivable);

  // Estados para filtro do dashboard
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState((currentDate.getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());

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

  const years = useMemo(() => {
    const allDates = [
      ...accountsPayable.map(acc => acc.competencyDate),
      ...accountsReceivable.map(acc => acc.competencyDate)
    ];

    const yearSet = new Set(allDates.map(date => new Date(date).getFullYear()));
    yearSet.add(currentDate.getFullYear());

    return Array.from(yearSet).sort((a, b) => b - a);
  }, [accountsPayable, accountsReceivable, currentDate]);

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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getSelectedMonthName = () => {
    const monthObj = months.find(m => m.value === selectedMonth);
    return monthObj ? monthObj.label : '';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="mb-2">Financeiro</h1>
              <p className="text-muted-foreground">
                Orçamento da empresa
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              💾 Dados salvos automaticamente
            </div>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />Dashboard
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />Categorias
            </TabsTrigger>
            <TabsTrigger value="payable" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />Contas a Pagar
            </TabsTrigger>
            <TabsTrigger value="receivable" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />Contas a Receber
            </TabsTrigger>
            <TabsTrigger value="cashflow" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />DFC
            </TabsTrigger>
            <TabsTrigger value="dre" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />DRE
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Filtro de Período */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />Filtro de Período
                </CardTitle>
                <CardDescription>
                  Selecione o mês e ano para visualizar os dados específicos do período
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="month-select">Mês</Label>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger id="month-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map(month => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year-select">Ano</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger id="year-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(year => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Exibindo dados de <strong>{getSelectedMonthName()} de {selectedYear}</strong>
                </div>
              </CardContent>
            </Card>

            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">A Receber</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-green-600">{formatCurrency(dashboardStats.totalReceivable)}</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats.receivablePendingCount} contas pendentes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">A Pagar</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-red-600">{formatCurrency(dashboardStats.totalPayable)}</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats.payablePendingCount} contas pendentes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Recebido</CardTitle>
                  <Wallet className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-green-600">{formatCurrency(dashboardStats.totalReceived)}</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats.receivedCount} contas recebidas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Pago</CardTitle>
                  <CreditCard className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-red-600">{formatCurrency(dashboardStats.totalPaid)}</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats.paidCount} contas pagas
                  </p>
                </CardContent>
              </Card>
            </div>
            {/* Cards de Resumo Detalhado */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo das Categorias</CardTitle>
                  <CardDescription>Organização atual das suas categorias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Categorias de Entrada</span>
                      <Badge className="bg-green-100 text-green-800">
                        {categories.filter(cat => cat.type === 'entrada').length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Categorias de Saída</span>
                      <Badge className="bg-red-100 text-red-800">
                        {categories.filter(cat => cat.type === 'saida').length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total de Subcategorias</span>
                      <Badge>
                        {categories.reduce((sum, cat) => sum + cat.subcategories.length, 0)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Período</CardTitle>
                  <CardDescription>
                    {getSelectedMonthName()} de {selectedYear} - Baseado nas contas do período
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total de Receitas</span>
                      <span className="text-green-600">
                        {formatCurrency(dashboardStats.totalReceived + dashboardStats.totalReceivable)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total de Despesas</span>
                      <span className="text-red-600">
                        {formatCurrency(dashboardStats.totalPaid + dashboardStats.totalPayable)}
                      </span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span>Resultado do Período</span>
                      <span className={
                        (dashboardStats.totalReceived + dashboardStats.totalReceivable) -
                          (dashboardStats.totalPaid + dashboardStats.totalPayable) >= 0 ? 'text-green-600' : 'text-red-600'
                      }>
                        {formatCurrency(
                          (dashboardStats.totalReceived + dashboardStats.totalReceivable) -
                          (dashboardStats.totalPaid + dashboardStats.totalPayable)
                        )}
                      </span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Pendências Líquidas</span>
                        <span className={dashboardStats.totalReceivable - dashboardStats.totalPayable >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(dashboardStats.totalReceivable - dashboardStats.totalPayable)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumo de Movimentações por Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Contas a Receber - {getSelectedMonthName()}/{selectedYear}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Recebidas</span>
                      <div className="text-right">
                        <div className="text-green-600">{formatCurrency(dashboardStats.totalReceived)}</div>
                        <div className="text-xs text-muted-foreground">{dashboardStats.receivedCount} contas</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pendentes</span>
                      <div className="text-right">
                        <div className="text-orange-600">{formatCurrency(dashboardStats.totalReceivable)}</div>
                        <div className="text-xs text-muted-foreground">{dashboardStats.receivablePendingCount} contas</div>
                      </div>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span>Total do Período</span>
                      <div className="text-right">
                        <div className="text-green-600">
                          {formatCurrency(dashboardStats.totalReceived + dashboardStats.totalReceivable)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {dashboardStats.receivedCount + dashboardStats.receivablePendingCount} contas
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    Contas a Pagar - {getSelectedMonthName()}/{selectedYear}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Pagas</span>
                      <div className="text-right">
                        <div className="text-red-600">{formatCurrency(dashboardStats.totalPaid)}</div>
                        <div className="text-xs text-muted-foreground">{dashboardStats.paidCount} contas</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pendentes</span>
                      <div className="text-right">
                        <div className="text-orange-600">{formatCurrency(dashboardStats.totalPayable)}</div>
                        <div className="text-xs text-muted-foreground">{dashboardStats.payablePendingCount} contas</div>
                      </div>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span>Total do Período</span>
                      <div className="text-right">
                        <div className="text-red-600">
                          {formatCurrency(dashboardStats.totalPaid + dashboardStats.totalPayable)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {dashboardStats.paidCount + dashboardStats.payablePendingCount}contas
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManager categories={categories} onCategoriesChange={setCategories} />
          </TabsContent>

          <TabsContent value="payable">
            <AccountsPayable accounts={accountsPayable} categories={categories} onAccountsChange={setAccountsPayable} />
          </TabsContent>

          <TabsContent value="receivable">
            <AccountsReceivable accounts={accountsReceivable} categories={categories} onAccountsChange={setAccountsReceivable} />
          </TabsContent>

          {/* Tabs com largura total para DFC e DRE */}
          <TabsContent value="cashflow" className="-mx-4 w-300 relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw]">
            <div className="px-4">
              <CashFlow categories={categories} accountsPayable={accountsPayable} accountsReceivable={accountsReceivable} />
            </div>
          </TabsContent>

          <TabsContent value="dre" className="-mx-4 w-screen relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw]">
            <div className="px-4">
              <IncomeStatement categories={categories} accountsPayable={accountsPayable} accountsReceivable={accountsReceivable} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}