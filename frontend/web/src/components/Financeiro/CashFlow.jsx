import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Calendar, BarChart3 } from 'lucide-react';
import { Category } from './CategoryManager';
import { AccountPayable } from './AccountsPayable';
import { AccountReceivable } from './AccountsReceivable';
import useLocalStorage from '../../hooks/useLocalStorage';

// interface CashFlowProps {
//   categories: Category[];
//   accountsPayable: AccountPayable[];
//   accountsReceivable: AccountReceivable[];
// }

// interface MonthlyFlowData { forecasted: number; actual: number;}

// interface CategoryFlowData { [subcategoryId: string]: MonthlyFlowData;}

// interface MonthlyData {
//   month: string;
//   previousBalance: MonthlyFlowData;
//   totalIncome: MonthlyFlowData;
//   totalExpenses: MonthlyFlowData;
//   netGeneration: MonthlyFlowData;
//   finalBalance: MonthlyFlowData;
//   incomeByCategory: { [categoryId: string]: CategoryFlowData };
//   expensesByCategory: { [categoryId: string]: CategoryFlowData };
// }

// interface YearSummary {
//   totalIncome: MonthlyFlowData;
//   totalExpenses: MonthlyFlowData;
//   netGeneration: MonthlyFlowData;
//   finalBalance: MonthlyFlowData;
//   incomeByCategory: { [categoryId: string]: CategoryFlowData };
//   expensesByCategory: { [categoryId: string]: CategoryFlowData };
// }

export function CashFlow({ categories, accountsPayable, accountsReceivable }) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [initialBalance, setInitialBalance] = useLocalStorage('financial-app-initial-balance', 0);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const years = useMemo(() => {
    const allDates = [
      ...accountsPayable.map(acc => acc.competencyDate),
      ...accountsReceivable.map(acc => acc.competencyDate)
    ];

    const yearSet = new Set(allDates.map(date => new Date(date).getFullYear()));
    yearSet.add(currentYear);

    return Array.from(yearSet).sort((a, b) => b - a);
  }, [accountsPayable, accountsReceivable, currentYear]);

  const { cashFlowData, yearSummary } = useMemo(() => {
    const year = parseInt(selectedYear);
    const monthlyData = [];
    // Saldo inicial configurável pelo usuário
    let runningForecastedBalance = initialBalance;
    let runningActualBalance = initialBalance;

    // Inicializar resumo anual
    const yearSummary = {
      totalIncome: { forecasted: 0, actual: 0 },
      totalExpenses: { forecasted: 0, actual: 0 },
      netGeneration: { forecasted: 0, actual: 0 },
      finalBalance: { forecasted: 0, actual: 0 },
      incomeByCategory: {},
      expensesByCategory: {}
    };

    for (let month = 0; month < 12; month++) {
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);

      // === CONTAS A RECEBER - PREVISTO (data de vencimento) ===
      const forecastedAccountsReceivable = accountsReceivable.filter(acc => {
        const dueDate = new Date(acc.dueDate);
        return dueDate >= monthStart && dueDate <= monthEnd;
      });

      // === CONTAS A RECEBER - REAL (data de pagamento) ===
      const actualAccountsReceivable = accountsReceivable.filter(acc => {
        if (!acc.paymentDate) return false;
        const paymentDate = new Date(acc.paymentDate);
        return paymentDate >= monthStart && paymentDate <= monthEnd;
      });

      // === CONTAS A PAGAR - PREVISTO (data de vencimento) ===
      const forecastedAccountsPayable = accountsPayable.filter(acc => {
        const dueDate = new Date(acc.dueDate);
        return dueDate >= monthStart && dueDate <= monthEnd;
      });

      // === CONTAS A PAGAR - REAL (data de pagamento) ===
      const actualAccountsPayable = accountsPayable.filter(acc => {
        if (!acc.paymentDate) return false;
        const paymentDate = new Date(acc.paymentDate);
        return paymentDate >= monthStart && paymentDate <= monthEnd;
      });

      // Calcular receitas por categoria
      const incomeByCategory = {};
      let totalForecastedIncome = 0;
      let totalActualIncome = 0;

      // RECEITAS PREVISTAS
      forecastedAccountsReceivable.forEach(acc => {
        const subcategory = categories
          .flatMap(cat => cat.subcategories.map(sub => ({ ...sub, categoryId: cat.id })))
          .find(sub => sub.id === acc.subcategoryId);

        if (subcategory) {
          if (!incomeByCategory[subcategory.categoryId]) {incomeByCategory[subcategory.categoryId] = {};}
          if (!incomeByCategory[subcategory.categoryId][subcategory.id]) {incomeByCategory[subcategory.categoryId][subcategory.id] = { forecasted: 0, actual: 0 };}
          incomeByCategory[subcategory.categoryId][subcategory.id].forecasted += acc.amount;
          totalForecastedIncome += acc.amount;
        }
      });

      // RECEITAS REAIS
      actualAccountsReceivable.forEach(acc => {
        const subcategory = categories
          .flatMap(cat => cat.subcategories.map(sub => ({ ...sub, categoryId: cat.id })))
          .find(sub => sub.id === acc.subcategoryId);

        if (subcategory) {
          if (!incomeByCategory[subcategory.categoryId]) {incomeByCategory[subcategory.categoryId] = {};}
          if (!incomeByCategory[subcategory.categoryId][subcategory.id]) {incomeByCategory[subcategory.categoryId][subcategory.id] = { forecasted: 0, actual: 0 };}
          incomeByCategory[subcategory.categoryId][subcategory.id].actual += acc.amount;
          totalActualIncome += acc.amount;
        }
      });

      // Calcular despesas por categoria
      // const expensesByCategory: { [categoryId: string]: CategoryFlowData } = {};
      // let totalForecastedExpenses = 0;
      // let totalActualExpenses = 0;

      // // DESPESAS PREVISTAS
      // forecastedAccountsPayable.forEach(acc => {
      //   const subcategory = categories
      //     .flatMap(cat => cat.subcategories.map(sub => ({ ...sub, categoryId: cat.id })))
      //     .find(sub => sub.id === acc.subcategoryId);

      //   if (subcategory) {
      //     if (!expensesByCategory[subcategory.categoryId]) { expensesByCategory[subcategory.categoryId] = {}; }
      //     if (!expensesByCategory[subcategory.categoryId][subcategory.id]) { expensesByCategory[subcategory.categoryId][subcategory.id] = { forecasted: 0, actual: 0 };}
      //     expensesByCategory[subcategory.categoryId][subcategory.id].forecasted += acc.amount;
      //     totalForecastedExpenses += acc.amount;
      //   }
      // });
      const expensesByCategory = {};
      let totalForecastedExpenses = 0;
      let totalActualExpenses = 0;

      // DESPESAS PREVISTAS
      forecastedAccountsPayable.forEach((acc) => {
        const subcategory = categories
          .flatMap((cat) =>cat.subcategories.map((sub) => ({ ...sub, categoryId: cat.id })))
          .find((sub) => sub.id === acc.subcategoryId);

        if (subcategory) {
          if (!expensesByCategory[subcategory.categoryId]) {expensesByCategory[subcategory.categoryId] = {};}
          if (!expensesByCategory[subcategory.categoryId][subcategory.id]) {
            expensesByCategory[subcategory.categoryId][subcategory.id] = {forecasted: 0,actual: 0,};
          }
          expensesByCategory[subcategory.categoryId][subcategory.id].forecasted += acc.amount;
          totalForecastedExpenses += acc.amount;
        }
      });

      // DESPESAS REAIS
      actualAccountsPayable.forEach(acc => {
        const subcategory = categories
          .flatMap(cat => cat.subcategories.map(sub => ({ ...sub, categoryId: cat.id })))
          .find(sub => sub.id === acc.subcategoryId);

        if (subcategory) {
          if (!expensesByCategory[subcategory.categoryId]) {expensesByCategory[subcategory.categoryId] = {};}
          if (!expensesByCategory[subcategory.categoryId][subcategory.id]) {expensesByCategory[subcategory.categoryId][subcategory.id] = { forecasted: 0, actual: 0 };}
          expensesByCategory[subcategory.categoryId][subcategory.id].actual += acc.amount;
          totalActualExpenses += acc.amount;
        }
      });

      const netForecastedGeneration = totalForecastedIncome - totalForecastedExpenses;
      const netActualGeneration = totalActualIncome - totalActualExpenses;

      const finalForecastedBalance = runningForecastedBalance + netForecastedGeneration;
      const finalActualBalance = runningActualBalance + netActualGeneration;

      monthlyData.push({
        month: months[month],
        previousBalance: {forecasted: runningForecastedBalance,actual: runningActualBalance},
        totalIncome: {forecasted: totalForecastedIncome,actual: totalActualIncome},
        totalExpenses: {forecasted: totalForecastedExpenses,actual: totalActualExpenses},
        netGeneration: {forecasted: netForecastedGeneration,actual: netActualGeneration},
        finalBalance: {forecasted: finalForecastedBalance,actual: finalActualBalance},
        incomeByCategory,
        expensesByCategory
      });

      // Atualizar saldos acumulados
      runningForecastedBalance = finalForecastedBalance;
      runningActualBalance = finalActualBalance;

      // Acumular no resumo anual
      yearSummary.totalIncome.forecasted += totalForecastedIncome;
      yearSummary.totalIncome.actual += totalActualIncome;
      yearSummary.totalExpenses.forecasted += totalForecastedExpenses;
      yearSummary.totalExpenses.actual += totalActualExpenses;

      // Acumular categorias no resumo anual
      Object.keys(incomeByCategory).forEach(categoryId => {
        if (!yearSummary.incomeByCategory[categoryId]) {yearSummary.incomeByCategory[categoryId] = {};}
        Object.keys(incomeByCategory[categoryId]).forEach(subcategoryId => {
          if (!yearSummary.incomeByCategory[categoryId][subcategoryId]) {yearSummary.incomeByCategory[categoryId][subcategoryId] = { forecasted: 0, actual: 0 };}
          yearSummary.incomeByCategory[categoryId][subcategoryId].forecasted +=
            incomeByCategory[categoryId][subcategoryId].forecasted;
          yearSummary.incomeByCategory[categoryId][subcategoryId].actual +=
            incomeByCategory[categoryId][subcategoryId].actual;
        });
      });

      Object.keys(expensesByCategory).forEach(categoryId => {
        if (!yearSummary.expensesByCategory[categoryId]) {yearSummary.expensesByCategory[categoryId] = {};}
        Object.keys(expensesByCategory[categoryId]).forEach(subcategoryId => {
          if (!yearSummary.expensesByCategory[categoryId][subcategoryId]) {yearSummary.expensesByCategory[categoryId][subcategoryId] = { forecasted: 0, actual: 0 };}
          yearSummary.expensesByCategory[categoryId][subcategoryId].forecasted +=
            expensesByCategory[categoryId][subcategoryId].forecasted;
          yearSummary.expensesByCategory[categoryId][subcategoryId].actual +=
            expensesByCategory[categoryId][subcategoryId].actual;
        });
      });
    }

    // Calcular totais finais do ano
    yearSummary.netGeneration.forecasted = yearSummary.totalIncome.forecasted - yearSummary.totalExpenses.forecasted;
    yearSummary.netGeneration.actual = yearSummary.totalIncome.actual - yearSummary.totalExpenses.actual;
    yearSummary.finalBalance.forecasted = initialBalance + yearSummary.netGeneration.forecasted;
    yearSummary.finalBalance.actual = initialBalance + yearSummary.netGeneration.actual;

    return { cashFlowData: monthlyData, yearSummary };
  }, [selectedYear, accountsPayable, accountsReceivable, categories, initialBalance]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(value);
  };

  const entradas = categories.filter(cat => cat.type === 'entrada');
  const saidas = categories.filter(cat => cat.type === 'saida');

  const getCategoryYearTotal = (categoryId, type) => {
    const categoryData = type === 'income'
      ? yearSummary.incomeByCategory[categoryId] : yearSummary.expensesByCategory[categoryId];

    if (!categoryData) return { forecasted: 0, actual: 0 };

    return Object.values(categoryData).reduce(
      (sum, subcategory) => ({
        forecasted: sum.forecasted + subcategory.forecasted,
        actual: sum.actual + subcategory.actual
      }),
      { forecasted: 0, actual: 0 }
    );
  };

  return (
    <div className="space-y-6 w-380 mg ml-35 ">
      <div className="flex justify-between items-center">
        <div>
          <h2>DFC - Demonstrativo de Fluxo de Caixa</h2>
          <p className="text-muted-foreground">Análise mensal e anual com previsão vs realizado</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="initial-balance">Saldo Inicial:</Label>
            <Input id="initial-balance" type="number" step="0.01" placeholder="0,00" value={initialBalance}
              onChange={(e) => setInitialBalance(parseFloat(e.target.value) || 0)} className="w-32"/>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
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
      </div>

      <Card className="w-380 ml-12 ">
        <CardHeader>
          <CardTitle>Fluxo de Caixa - {selectedYear}</CardTitle>
          <CardDescription>
            Comparação entre valores previstos (vencimento) e realizados (pagamento)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[2000px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-background z-10 min-w-[180px] border-r">Categoria</TableHead>
                  {months.map(month => (
                    <TableHead key={month} className="text-center min-w-[160px]" colSpan={2}>
                      {month}
                    </TableHead>
                  ))}
                  <TableHead className="text-center min-w-[160px] bg-blue-50" colSpan={2}>
                    <div className="flex items-center justify-center gap-1">
                      <BarChart3 className="h-4 w-4" />
                      Resumo {selectedYear}
                    </div>
                  </TableHead>
                </TableRow>
                <TableRow>
                  <TableHead className="sticky left-0 bg-background z-10 border-r"></TableHead>
                  {months.map(month => (
                    <React.Fragment key={month}>
                      <TableHead className="text-center text-xs text-blue-600">Previsto</TableHead>
                      <TableHead className="text-center text-xs text-green-600">Real</TableHead>
                    </React.Fragment>
                  ))}
                  <TableHead className="text-center text-xs text-blue-600 bg-blue-50">Previsto</TableHead>
                  <TableHead className="text-center text-xs text-green-600 bg-blue-50">Real</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Saldo Anterior */}
                <TableRow className="bg-muted/50">
                  <TableCell className="sticky left-0 bg-muted/50 z-10 border-r">
                    <Badge variant="outline">Saldo Anterior</Badge>
                  </TableCell>
                  {cashFlowData.map((data, index) => (
                    <React.Fragment key={index}>
                      <TableCell className="text-center text-sm">
                        {formatCurrency(data.previousBalance.forecasted)}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {formatCurrency(data.previousBalance.actual)}
                      </TableCell>
                    </React.Fragment>
                  ))}
                  <TableCell className="text-center text-sm bg-blue-50">
                    {formatCurrency(initialBalance)}
                  </TableCell>
                  <TableCell className="text-center text-sm bg-blue-50">
                    {formatCurrency(initialBalance)}
                  </TableCell>
                </TableRow>

                {/* Entradas por Categoria */}
                {entradas.map(category => (
                  <React.Fragment key={`income-${category.id}`}>
                    <TableRow className="bg-green-50">
                      <TableCell className="sticky left-0 bg-green-50 z-10 border-r">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <strong className="text-green-700">{category.name}</strong>
                        </div>
                      </TableCell>
                      {cashFlowData.map((data, index) => {
                        const categoryData = data.incomeByCategory[category.id];
                        const forecasted = categoryData ? Object.values(categoryData).reduce((sum, sub) => sum + sub.forecasted, 0) : 0;
                        const actual = categoryData ? Object.values(categoryData).reduce((sum, sub) => sum + sub.actual, 0) : 0;
                        return (
                          <React.Fragment key={index}>
                            <TableCell className="text-center text-blue-600 text-sm">
                              {forecasted > 0 ? formatCurrency(forecasted) : '-'}
                            </TableCell>
                            <TableCell className="text-center text-green-600 text-sm">
                              {actual > 0 ? formatCurrency(actual) : '-'}
                            </TableCell>
                          </React.Fragment>
                        );
                      })}
                      {(() => {
                        const yearTotal = getCategoryYearTotal(category.id, 'income');
                        return (
                          <React.Fragment>
                            <TableCell className="text-center text-blue-600 text-sm bg-blue-50">
                              {yearTotal.forecasted > 0 ? formatCurrency(yearTotal.forecasted) : '-'}
                            </TableCell>
                            <TableCell className="text-center text-green-600 text-sm bg-blue-50">
                              {yearTotal.actual > 0 ? formatCurrency(yearTotal.actual) : '-'}
                            </TableCell>
                          </React.Fragment>
                        );
                      })()}
                    </TableRow>
                    {category.subcategories.map(subcategory => (
                      <TableRow key={`income-sub-${subcategory.id}`}>
                        <TableCell className="sticky left-0 bg-background z-10 pl-8 text-sm border-r">
                          • {subcategory.name}
                        </TableCell>
                        {cashFlowData.map((data, index) => {
                          const amount = data.incomeByCategory[category.id]?.[subcategory.id] || { forecasted: 0, actual: 0 };
                          return (
                            <React.Fragment key={index}>
                              <TableCell className="text-center text-blue-600 text-sm">
                                {amount.forecasted > 0 ? formatCurrency(amount.forecasted) : '-'}
                              </TableCell>
                              <TableCell className="text-center text-green-600 text-sm">
                                {amount.actual > 0 ? formatCurrency(amount.actual) : '-'}
                              </TableCell>
                            </React.Fragment>
                          );
                        })}
                        {(() => {
                          const yearAmount = yearSummary.incomeByCategory[category.id]?.[subcategory.id] || { forecasted: 0, actual: 0 };
                          return (
                            <React.Fragment>
                              <TableCell className="text-center text-blue-600 text-sm bg-blue-50">
                                {yearAmount.forecasted > 0 ? formatCurrency(yearAmount.forecasted) : '-'}
                              </TableCell>
                              <TableCell className="text-center text-green-600 text-sm bg-blue-50">
                                {yearAmount.actual > 0 ? formatCurrency(yearAmount.actual) : '-'}
                              </TableCell>
                            </React.Fragment>
                          );
                        })()}
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}

                {/* Total de Entradas */}
                <TableRow className="bg-green-100">
                  <TableCell className="sticky left-0 bg-green-100 z-10 border-r">
                    <strong className="text-green-700">Total de Entradas</strong>
                  </TableCell>
                  {cashFlowData.map((data, index) => (
                    <React.Fragment key={index}>
                      <TableCell className="text-center text-blue-600">
                        <strong>{data.totalIncome.forecasted > 0 ? formatCurrency(data.totalIncome.forecasted) : '-'}</strong>
                      </TableCell>
                      <TableCell className="text-center text-green-600">
                        <strong>{data.totalIncome.actual > 0 ? formatCurrency(data.totalIncome.actual) : '-'}</strong>
                      </TableCell>
                    </React.Fragment>
                  ))}
                  <TableCell className="text-center text-blue-600 bg-blue-50">
                    <strong>{yearSummary.totalIncome.forecasted > 0 ? formatCurrency(yearSummary.totalIncome.forecasted) : '-'}</strong>
                  </TableCell>
                  <TableCell className="text-center text-green-600 bg-blue-50">
                    <strong>{yearSummary.totalIncome.actual > 0 ? formatCurrency(yearSummary.totalIncome.actual) : '-'}</strong>
                  </TableCell>
                </TableRow>

                {/* Saídas por Categoria */}
                {saidas.map(category => (
                  <React.Fragment key={`expense-${category.id}`}>
                    <TableRow className="bg-red-50">
                      <TableCell className="sticky left-0 bg-red-50 z-10 border-r">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          <strong className="text-red-700">{category.name}</strong>
                        </div>
                      </TableCell>
                      {cashFlowData.map((data, index) => {
                        const categoryData = data.expensesByCategory[category.id];
                        const forecasted = categoryData ? Object.values(categoryData).reduce((sum, sub) => sum + sub.forecasted, 0) : 0;
                        const actual = categoryData ? Object.values(categoryData).reduce((sum, sub) => sum + sub.actual, 0) : 0;
                        return (
                          <React.Fragment key={index}>
                            <TableCell className="text-center text-blue-600 text-sm">
                              {forecasted > 0 ? formatCurrency(forecasted) : '-'}
                            </TableCell>
                            <TableCell className="text-center text-red-600 text-sm">
                              {actual > 0 ? formatCurrency(actual) : '-'}
                            </TableCell>
                          </React.Fragment>
                        );
                      })}
                      {(() => {
                        const yearTotal = getCategoryYearTotal(category.id, 'expense');
                        return (
                          <React.Fragment>
                            <TableCell className="text-center text-blue-600 text-sm bg-blue-50">
                              {yearTotal.forecasted > 0 ? formatCurrency(yearTotal.forecasted) : '-'}
                            </TableCell>
                            <TableCell className="text-center text-red-600 text-sm bg-blue-50">
                              {yearTotal.actual > 0 ? formatCurrency(yearTotal.actual) : '-'}
                            </TableCell>
                          </React.Fragment>
                        );
                      })()}
                    </TableRow>
                    {category.subcategories.map(subcategory => (
                      <TableRow key={`expense-sub-${subcategory.id}`}>
                        <TableCell className="sticky left-0 bg-background z-10 pl-8 text-sm border-r">
                          • {subcategory.name}
                        </TableCell>
                        {cashFlowData.map((data, index) => {
                          const amount = data.expensesByCategory[category.id]?.[subcategory.id] || { forecasted: 0, actual: 0 };
                          return (
                            <React.Fragment key={index}>
                              <TableCell className="text-center text-blue-600 text-sm">
                                {amount.forecasted > 0 ? formatCurrency(amount.forecasted) : '-'}
                              </TableCell>
                              <TableCell className="text-center text-red-600 text-sm">
                                {amount.actual > 0 ? formatCurrency(amount.actual) : '-'}
                              </TableCell>
                            </React.Fragment>
                          );
                        })}
                        {(() => {
                          const yearAmount = yearSummary.expensesByCategory[category.id]?.[subcategory.id] || { forecasted: 0, actual: 0 };
                          return (
                            <React.Fragment>
                              <TableCell className="text-center text-blue-600 text-sm bg-blue-50">
                                {yearAmount.forecasted > 0 ? formatCurrency(yearAmount.forecasted) : '-'}
                              </TableCell>
                              <TableCell className="text-center text-red-600 text-sm bg-blue-50">
                                {yearAmount.actual > 0 ? formatCurrency(yearAmount.actual) : '-'}
                              </TableCell>
                            </React.Fragment>
                          );
                        })()}
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}

                {/* Total de Saídas */}
                <TableRow className="bg-red-100">
                  <TableCell className="sticky left-0 bg-red-100 z-10 border-r">
                    <strong className="text-red-700">Total de Saídas</strong>
                  </TableCell>
                  {cashFlowData.map((data, index) => (
                    <React.Fragment key={index}>
                      <TableCell className="text-center text-blue-600">
                        <strong>{data.totalExpenses.forecasted > 0 ? formatCurrency(data.totalExpenses.forecasted) : '-'}</strong>
                      </TableCell>
                      <TableCell className="text-center text-red-600">
                        <strong>{data.totalExpenses.actual > 0 ? formatCurrency(data.totalExpenses.actual) : '-'}</strong>
                      </TableCell>
                    </React.Fragment>
                  ))}
                  <TableCell className="text-center text-blue-600 bg-blue-50">
                    <strong>{yearSummary.totalExpenses.forecasted > 0 ? formatCurrency(yearSummary.totalExpenses.forecasted) : '-'}</strong>
                  </TableCell>
                  <TableCell className="text-center text-red-600 bg-blue-50">
                    <strong>{yearSummary.totalExpenses.actual > 0 ? formatCurrency(yearSummary.totalExpenses.actual) : '-'}</strong>
                  </TableCell>
                </TableRow>

                {/* Geração de Caixa */}
                <TableRow className="bg-blue-50">
                  <TableCell className="sticky left-0 bg-blue-50 z-10 border-r">
                    <strong className="text-blue-700">Geração de Caixa</strong>
                  </TableCell>
                  {cashFlowData.map((data, index) => (
                    <React.Fragment key={index}>
                      <TableCell className="text-center">
                        <strong className={data.netGeneration.forecasted >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(data.netGeneration.forecasted)}
                        </strong>
                      </TableCell>
                      <TableCell className="text-center">
                        <strong className={data.netGeneration.actual >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(data.netGeneration.actual)}
                        </strong>
                      </TableCell>
                    </React.Fragment>
                  ))}
                  <TableCell className="text-center bg-blue-100">
                    <strong className={yearSummary.netGeneration.forecasted >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(yearSummary.netGeneration.forecasted)}
                    </strong>
                  </TableCell>
                  <TableCell className="text-center bg-blue-100">
                    <strong className={yearSummary.netGeneration.actual >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(yearSummary.netGeneration.actual)}
                    </strong>
                  </TableCell>
                </TableRow>

                {/* Saldo Final */}
                <TableRow className="bg-primary/10">
                  <TableCell className="sticky left-0 bg-primary/10 z-10 border-r">
                    <strong>Saldo Final</strong>
                  </TableCell>
                  {cashFlowData.map((data, index) => (
                    <React.Fragment key={index}>
                      <TableCell className="text-center">
                        <strong className={data.finalBalance.forecasted >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(data.finalBalance.forecasted)}
                        </strong>
                      </TableCell>
                      <TableCell className="text-center">
                        <strong className={data.finalBalance.actual >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(data.finalBalance.actual)}
                        </strong>
                      </TableCell>
                    </React.Fragment>
                  ))}
                  <TableCell className="text-center bg-primary/20">
                    <strong className={yearSummary.finalBalance.forecasted >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(yearSummary.finalBalance.forecasted)}
                    </strong>
                  </TableCell>
                  <TableCell className="text-center bg-primary/20">
                    <strong className={yearSummary.finalBalance.actual >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(yearSummary.finalBalance.actual)}
                    </strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}