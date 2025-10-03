import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { TrendingUp, TrendingDown, Calendar, BarChart3, Edit, DollarSign } from 'lucide-react';
import { Category } from './CategoryManager';
import { AccountPayable } from './AccountsPayable';
import { AccountReceivable } from './AccountsReceivable';
import useLocalStorage from '../../hooks/useLocalStorage';

// interface BudgetData {
//   [year: string]: {
//     [categoryId: string]: {
//       [subcategoryId: string]: {
//         [month: number]: number; // 0-11 para Janeiro-Dezembro
//       };
//     };
//   };
// }

// interface MonthlyIncomeStatementData {
//   budgeted: number;
//   actual: number;
// }

// interface CategoryIncomeStatementData {
//   [subcategoryId: string]: MonthlyIncomeStatementData;
// }

// interface MonthlyData {
//   month: string;
//   totalRevenue: MonthlyIncomeStatementData;
//   totalExpenses: MonthlyIncomeStatementData;
//   netResult: MonthlyIncomeStatementData;
//   revenueByCategory: { [categoryId: string]: CategoryIncomeStatementData };
//   expensesByCategory: { [categoryId: string]: CategoryIncomeStatementData };
// }

// interface YearSummary {
//   totalRevenue: MonthlyIncomeStatementData;
//   totalExpenses: MonthlyIncomeStatementData;
//   netResult: MonthlyIncomeStatementData;
//   revenueByCategory: { [categoryId: string]: CategoryIncomeStatementData };
//   expensesByCategory: { [categoryId: string]: CategoryIncomeStatementData };
// }

// interface IncomeStatementProps {
//   categories: Category[];
//   accountsPayable: AccountPayable[];
//   accountsReceivable: AccountReceivable[];
// }

export function IncomeStatement({ categories, accountsPayable, accountsReceivable }) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [budgetData, setBudgetData] = useLocalStorage('financial-app-budget-data', {});
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [budgetValues, setBudgetValues] = useState(new Array(12).fill(0));

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

  const { incomeStatementData, yearSummary } = useMemo(() => {
    const year = parseInt(selectedYear);
    const monthlyData = [];

    // Inicializar resumo anual
    const yearSummaryy = {
      totalRevenue: { budgeted: 0, actual: 0 },
      totalExpenses: { budgeted: 0, actual: 0 },
      netResult: { budgeted: 0, actual: 0 },
      revenueByCategory: {},
      expensesByCategory: {}
    };

    for (let month = 0; month < 12; month++) {
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);

      // === RECEITAS REALIZADAS (data de competência) ===
      const actualReceivables = accountsReceivable.filter(acc => {
        const competencyDate = new Date(acc.competencyDate);
        return competencyDate >= monthStart && competencyDate <= monthEnd;
      });

      // === DESPESAS REALIZADAS (data de competência) ===
      const actualPayables = accountsPayable.filter(acc => {
        const competencyDate = new Date(acc.competencyDate);
        return competencyDate >= monthStart && competencyDate <= monthEnd;
      });

      // Calcular receitas por categoria
      const revenueByCategory = {};
      let totalActualRevenue = 0;
      let totalBudgetedRevenue = 0;

      // RECEITAS REALIZADAS
      actualReceivables.forEach(acc => {
        const subcategory = categories
          .flatMap(cat => cat.subcategories.map(sub => ({ ...sub, categoryId: cat.id })))
          .find(sub => sub.id === acc.subcategoryId);
        
        if (subcategory) {
          if (!revenueByCategory[subcategory.categoryId]) {
            revenueByCategory[subcategory.categoryId] = {};
          }
          if (!revenueByCategory[subcategory.categoryId][subcategory.id]) {
            revenueByCategory[subcategory.categoryId][subcategory.id] = { budgeted: 0, actual: 0 };
          }
          revenueByCategory[subcategory.categoryId][subcategory.id].actual += acc.amount;
          totalActualRevenue += acc.amount;
        }
      });

      // RECEITAS ORÇADAS
      categories.filter(cat => cat.type === 'entrada').forEach(category => {
        category.subcategories.forEach(subcategory => {
          const budgetAmount = budgetData[selectedYear]?.[category.id]?.[subcategory.id]?.[month] || 0;
          
          if (!revenueByCategory[category.id]) {
            revenueByCategory[category.id] = {};
          }
          if (!revenueByCategory[category.id][subcategory.id]) {
            revenueByCategory[category.id][subcategory.id] = { budgeted: 0, actual: 0 };
          }
          
          revenueByCategory[category.id][subcategory.id].budgeted = budgetAmount;
          totalBudgetedRevenue += budgetAmount;
        });
      });

      // Calcular despesas por categoria
      const expensesByCategory = {};
      let totalActualExpenses = 0;
      let totalBudgetedExpenses = 0;

      // DESPESAS REALIZADAS
      actualPayables.forEach(acc => {
        const subcategory = categories
          .flatMap(cat => cat.subcategories.map(sub => ({ ...sub, categoryId: cat.id })))
          .find(sub => sub.id === acc.subcategoryId);
        
        if (subcategory) {
          if (!expensesByCategory[subcategory.categoryId]) {
            expensesByCategory[subcategory.categoryId] = {};
          }
          if (!expensesByCategory[subcategory.categoryId][subcategory.id]) {
            expensesByCategory[subcategory.categoryId][subcategory.id] = { budgeted: 0, actual: 0 };
          }
          expensesByCategory[subcategory.categoryId][subcategory.id].actual += acc.amount;
          totalActualExpenses += acc.amount;
        }
      });

      // DESPESAS ORÇADAS
      categories.filter(cat => cat.type === 'saida').forEach(category => {
        category.subcategories.forEach(subcategory => {
          const budgetAmount = budgetData[selectedYear]?.[category.id]?.[subcategory.id]?.[month] || 0;
          
          if (!expensesByCategory[category.id]) {
            expensesByCategory[category.id] = {};
          }
          if (!expensesByCategory[category.id][subcategory.id]) {
            expensesByCategory[category.id][subcategory.id] = { budgeted: 0, actual: 0 };
          }
          
          expensesByCategory[category.id][subcategory.id].budgeted = budgetAmount;
          totalBudgetedExpenses += budgetAmount;
        });
      });

      const netBudgetedResult = totalBudgetedRevenue - totalBudgetedExpenses;
      const netActualResult = totalActualRevenue - totalActualExpenses;

      monthlyData.push({
        month: months[month],
        totalRevenue: { 
          budgeted: totalBudgetedRevenue, 
          actual: totalActualRevenue 
        },
        totalExpenses: { 
          budgeted: totalBudgetedExpenses, 
          actual: totalActualExpenses 
        },
        netResult: { 
          budgeted: netBudgetedResult, 
          actual: netActualResult 
        },
        revenueByCategory,
        expensesByCategory
      });

      // Acumular no resumo anual
      yearSummary.totalRevenue.budgeted += totalBudgetedRevenue;
      yearSummary.totalRevenue.actual += totalActualRevenue;
      yearSummary.totalExpenses.budgeted += totalBudgetedExpenses;
      yearSummary.totalExpenses.actual += totalActualExpenses;

      // Acumular categorias no resumo anual
      Object.keys(revenueByCategory).forEach(categoryId => {
        if (!yearSummary.revenueByCategory[categoryId]) {
          yearSummary.revenueByCategory[categoryId] = {};
        }
        Object.keys(revenueByCategory[categoryId]).forEach(subcategoryId => {
          if (!yearSummary.revenueByCategory[categoryId][subcategoryId]) {
            yearSummary.revenueByCategory[categoryId][subcategoryId] = { budgeted: 0, actual: 0 };
          }
          yearSummary.revenueByCategory[categoryId][subcategoryId].budgeted += 
            revenueByCategory[categoryId][subcategoryId].budgeted;
          yearSummary.revenueByCategory[categoryId][subcategoryId].actual += 
            revenueByCategory[categoryId][subcategoryId].actual;
        });
      });

      Object.keys(expensesByCategory).forEach(categoryId => {
        if (!yearSummary.expensesByCategory[categoryId]) {
          yearSummary.expensesByCategory[categoryId] = {};
        }
        Object.keys(expensesByCategory[categoryId]).forEach(subcategoryId => {
          if (!yearSummary.expensesByCategory[categoryId][subcategoryId]) {
            yearSummary.expensesByCategory[categoryId][subcategoryId] = { budgeted: 0, actual: 0 };
          }
          yearSummary.expensesByCategory[categoryId][subcategoryId].budgeted += 
            expensesByCategory[categoryId][subcategoryId].budgeted;
          yearSummary.expensesByCategory[categoryId][subcategoryId].actual += 
            expensesByCategory[categoryId][subcategoryId].actual;
        });
      });
    }

    // Calcular resultado líquido anual
    yearSummary.netResult.budgeted = yearSummary.totalRevenue.budgeted - yearSummary.totalExpenses.budgeted;
    yearSummary.netResult.actual = yearSummary.totalRevenue.actual - yearSummary.totalExpenses.actual;

    return { incomeStatementData: monthlyData, yearSummary };
  }, [selectedYear, accountsPayable, accountsReceivable, categories, budgetData]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const openBudgetEditor = (categoryId, subcategoryId) => {
    const currentBudget = budgetData[selectedYear]?.[categoryId]?.[subcategoryId] || {};
    const values = new Array(12).fill(0).map((_, index) => currentBudget[index] || 0);
    
    setBudgetValues(values);
    setEditingCategory({ categoryId, subcategoryId });
    setIsEditBudgetOpen(true);
  };

  const saveBudget = () => {
    if (!editingCategory) return;

    const newBudgetData = { ...budgetData };
    
    if (!newBudgetData[selectedYear]) {
      newBudgetData[selectedYear] = {};
    }
    if (!newBudgetData[selectedYear][editingCategory.categoryId]) {
      newBudgetData[selectedYear][editingCategory.categoryId] = {};
    }
    if (!newBudgetData[selectedYear][editingCategory.categoryId][editingCategory.subcategoryId]) {
      newBudgetData[selectedYear][editingCategory.categoryId][editingCategory.subcategoryId] = {};
    }

    budgetValues.forEach((value, index) => {
      newBudgetData[selectedYear][editingCategory.categoryId][editingCategory.subcategoryId][index] = value;
    });

    setBudgetData(newBudgetData);
    setIsEditBudgetOpen(false);
    setEditingCategory(null);
  };

  const entradas = categories.filter(cat => cat.type === 'entrada');
  const saidas = categories.filter(cat => cat.type === 'saida');

  const getCategoryYearTotal = (categoryId, type) => {
    const categoryData = type === 'revenue' 
      ? yearSummary.revenueByCategory[categoryId] 
      : yearSummary.expensesByCategory[categoryId];
    
    if (!categoryData) return { budgeted: 0, actual: 0 };
    
    return Object.values(categoryData).reduce(
      (sum, subcategory) => ({
        budgeted: sum.budgeted + subcategory.budgeted,
        actual: sum.actual + subcategory.actual
      }),
      { budgeted: 0, actual: 0 }
    );
  };

  const getSubcategoryName = (categoryId, subcategoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    const subcategory = category?.subcategories.find(sub => sub.id === subcategoryId);
    return subcategory?.name || 'N/A';
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'N/A';
  };

  return (
    <div className="space-y-6 max-w-full">
      <div className="flex justify-between items-center">
        <div>
          <h2>DRE - Demonstrativo de Resultados do Exercício</h2>
          <p className="text-muted-foreground">Análise de receitas e despesas por competência com orçamento</p>
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

      <Card className="w-full">
        <CardHeader>
          <CardTitle>DRE - {selectedYear}</CardTitle>
          <CardDescription>
            Comparação entre valores orçados e realizados por competência
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[2000px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-background z-10 min-w-[180px] border-r">Categoria</TableHead>
                  <TableHead className="sticky left-[180px] bg-background z-10 min-w-[60px] border-r">Ação</TableHead>
                  {months.map(month => (
                    <TableHead key={month} className="text-center min-w-[160px]" colSpan={2}>
                      {month}
                    </TableHead>
                  ))}
                  <TableHead className="text-center min-w-[160px] bg-blue-50" colSpan={2}>
                    <div className="flex items-center justify-center gap-1">
                      <BarChart3 className="h-4 w-4" />
                      Total {selectedYear}
                    </div>
                  </TableHead>
                </TableRow>
                <TableRow>
                  <TableHead className="sticky left-0 bg-background z-10 border-r"></TableHead>
                  <TableHead className="sticky left-[180px] bg-background z-10 border-r"></TableHead>
                  {months.map(month => (
                    <React.Fragment key={month}>
                      <TableHead className="text-center text-xs text-blue-600">Orçado</TableHead>
                      <TableHead className="text-center text-xs text-green-600">Realizado</TableHead>
                    </React.Fragment>
                  ))}
                  <TableHead className="text-center text-xs text-blue-600 bg-blue-50">Orçado</TableHead>
                  <TableHead className="text-center text-xs text-green-600 bg-blue-50">Realizado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* RECEITAS */}
                <TableRow className="bg-green-50">
                  <TableCell className="sticky left-0 bg-green-50 z-10 border-r" colSpan={2}>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <strong className="text-green-700">RECEITAS</strong>
                    </div>
                  </TableCell>
                  {incomeStatementData.map((data, index) => (
                    <React.Fragment key={index}>
                      <TableCell className="text-center text-blue-600">
                        <strong>{data.totalRevenue.budgeted > 0 ? formatCurrency(data.totalRevenue.budgeted) : '-'}</strong>
                      </TableCell>
                      <TableCell className="text-center text-green-600">
                        <strong>{data.totalRevenue.actual > 0 ? formatCurrency(data.totalRevenue.actual) : '-'}</strong>
                      </TableCell>
                    </React.Fragment>
                  ))}
                  <TableCell className="text-center text-blue-600 bg-blue-50">
                    <strong>{yearSummary.totalRevenue.budgeted > 0 ? formatCurrency(yearSummary.totalRevenue.budgeted) : '-'}</strong>
                  </TableCell>
                  <TableCell className="text-center text-green-600 bg-blue-50">
                    <strong>{yearSummary.totalRevenue.actual > 0 ? formatCurrency(yearSummary.totalRevenue.actual) : '-'}</strong>
                  </TableCell>
                </TableRow>

                {/* Receitas por Categoria */}
                {entradas.map(category => (
                  <React.Fragment key={`revenue-${category.id}`}>
                    <TableRow className="bg-green-25">
                      <TableCell className="sticky left-0 bg-green-25 z-10 pl-4 border-r">
                        <strong className="text-green-700">{category.name}</strong>
                      </TableCell>
                      <TableCell className="sticky left-[180px] bg-green-25 z-10 border-r"></TableCell>
                      {incomeStatementData.map((data, index) => {
                        const categoryData = data.revenueByCategory[category.id];
                        const budgeted = categoryData ? Object.values(categoryData).reduce((sum, sub) => sum + sub.budgeted, 0) : 0;
                        const actual = categoryData ? Object.values(categoryData).reduce((sum, sub) => sum + sub.actual, 0) : 0;
                        return (
                          <React.Fragment key={index}>
                            <TableCell className="text-center text-blue-600 text-sm">
                              {budgeted > 0 ? formatCurrency(budgeted) : '-'}
                            </TableCell>
                            <TableCell className="text-center text-green-600 text-sm">
                              {actual > 0 ? formatCurrency(actual) : '-'}
                            </TableCell>
                          </React.Fragment>
                        );
                      })}
                      {(() => {
                        const yearTotal = getCategoryYearTotal(category.id, 'revenue');
                        return (
                          <React.Fragment>
                            <TableCell className="text-center text-blue-600 text-sm bg-blue-50">
                              {yearTotal.budgeted > 0 ? formatCurrency(yearTotal.budgeted) : '-'}
                            </TableCell>
                            <TableCell className="text-center text-green-600 text-sm bg-blue-50">
                              {yearTotal.actual > 0 ? formatCurrency(yearTotal.actual) : '-'}
                            </TableCell>
                          </React.Fragment>
                        );
                      })()}
                    </TableRow>
                    {category.subcategories.map(subcategory => (
                      <TableRow key={`revenue-sub-${subcategory.id}`}>
                        <TableCell className="sticky left-0 bg-background z-10 pl-8 text-sm border-r">
                          • {subcategory.name}
                        </TableCell>
                        <TableCell className="sticky left-[180px] bg-background z-10 border-r">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openBudgetEditor(category.id, subcategory.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </TableCell>
                        {incomeStatementData.map((data, index) => {
                          const amount = data.revenueByCategory[category.id]?.[subcategory.id] || { budgeted: 0, actual: 0 };
                          return (
                            <React.Fragment key={index}>
                              <TableCell className="text-center text-blue-600 text-sm">
                                {amount.budgeted > 0 ? formatCurrency(amount.budgeted) : '-'}
                              </TableCell>
                              <TableCell className="text-center text-green-600 text-sm">
                                {amount.actual > 0 ? formatCurrency(amount.actual) : '-'}
                              </TableCell>
                            </React.Fragment>
                          );
                        })}
                        {(() => {
                          const yearAmount = yearSummary.revenueByCategory[category.id]?.[subcategory.id] || { budgeted: 0, actual: 0 };
                          return (
                            <React.Fragment>
                              <TableCell className="text-center text-blue-600 text-sm bg-blue-50">
                                {yearAmount.budgeted > 0 ? formatCurrency(yearAmount.budgeted) : '-'}
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

                {/* DESPESAS */}
                <TableRow className="bg-red-50">
                  <TableCell className="sticky left-0 bg-red-50 z-10 border-r" colSpan={2}>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <strong className="text-red-700">DESPESAS</strong>
                    </div>
                  </TableCell>
                  {incomeStatementData.map((data, index) => (
                    <React.Fragment key={index}>
                      <TableCell className="text-center text-blue-600">
                        <strong>{data.totalExpenses.budgeted > 0 ? formatCurrency(data.totalExpenses.budgeted) : '-'}</strong>
                      </TableCell>
                      <TableCell className="text-center text-red-600">
                        <strong>{data.totalExpenses.actual > 0 ? formatCurrency(data.totalExpenses.actual) : '-'}</strong>
                      </TableCell>
                    </React.Fragment>
                  ))}
                  <TableCell className="text-center text-blue-600 bg-blue-50">
                    <strong>{yearSummary.totalExpenses.budgeted > 0 ? formatCurrency(yearSummary.totalExpenses.budgeted) : '-'}</strong>
                  </TableCell>
                  <TableCell className="text-center text-red-600 bg-blue-50">
                    <strong>{yearSummary.totalExpenses.actual > 0 ? formatCurrency(yearSummary.totalExpenses.actual) : '-'}</strong>
                  </TableCell>
                </TableRow>

                {/* Despesas por Categoria */}
                {saidas.map(category => (
                  <React.Fragment key={`expense-${category.id}`}>
                    <TableRow className="bg-red-25">
                      <TableCell className="sticky left-0 bg-red-25 z-10 pl-4 border-r">
                        <strong className="text-red-700">{category.name}</strong>
                      </TableCell>
                      <TableCell className="sticky left-[180px] bg-red-25 z-10 border-r"></TableCell>
                      {incomeStatementData.map((data, index) => {
                        const categoryData = data.expensesByCategory[category.id];
                        const budgeted = categoryData ? Object.values(categoryData).reduce((sum, sub) => sum + sub.budgeted, 0) : 0;
                        const actual = categoryData ? Object.values(categoryData).reduce((sum, sub) => sum + sub.actual, 0) : 0;
                        return (
                          <React.Fragment key={index}>
                            <TableCell className="text-center text-blue-600 text-sm">
                              {budgeted > 0 ? formatCurrency(budgeted) : '-'}
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
                              {yearTotal.budgeted > 0 ? formatCurrency(yearTotal.budgeted) : '-'}
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
                        <TableCell className="sticky left-[180px] bg-background z-10 border-r">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openBudgetEditor(category.id, subcategory.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </TableCell>
                        {incomeStatementData.map((data, index) => {
                          const amount = data.expensesByCategory[category.id]?.[subcategory.id] || { budgeted: 0, actual: 0 };
                          return (
                            <React.Fragment key={index}>
                              <TableCell className="text-center text-blue-600 text-sm">
                                {amount.budgeted > 0 ? formatCurrency(amount.budgeted) : '-'}
                              </TableCell>
                              <TableCell className="text-center text-red-600 text-sm">
                                {amount.actual > 0 ? formatCurrency(amount.actual) : '-'}
                              </TableCell>
                            </React.Fragment>
                          );
                        })}
                        {(() => {
                          const yearAmount = yearSummary.expensesByCategory[category.id]?.[subcategory.id] || { budgeted: 0, actual: 0 };
                          return (
                            <React.Fragment>
                              <TableCell className="text-center text-blue-600 text-sm bg-blue-50">
                                {yearAmount.budgeted > 0 ? formatCurrency(yearAmount.budgeted) : '-'}
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

                {/* RESULTADO LÍQUIDO */}
                <TableRow className="bg-primary/10">
                  <TableCell className="sticky left-0 bg-primary/10 z-10 border-r" colSpan={2}>
                    <strong>RESULTADO LÍQUIDO</strong>
                  </TableCell>
                  {incomeStatementData.map((data, index) => (
                    <React.Fragment key={index}>
                      <TableCell className="text-center">
                        <strong className={data.netResult.budgeted >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(data.netResult.budgeted)}
                        </strong>
                      </TableCell>
                      <TableCell className="text-center">
                        <strong className={data.netResult.actual >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(data.netResult.actual)}
                        </strong>
                      </TableCell>
                    </React.Fragment>
                  ))}
                  <TableCell className="text-center bg-primary/20">
                    <strong className={yearSummary.netResult.budgeted >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(yearSummary.netResult.budgeted)}
                    </strong>
                  </TableCell>
                  <TableCell className="text-center bg-primary/20">
                    <strong className={yearSummary.netResult.actual >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(yearSummary.netResult.actual)}
                    </strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para editar orçamento */}
      <Dialog open={isEditBudgetOpen} onOpenChange={setIsEditBudgetOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Editar Orçamento - {editingCategory && getCategoryName(editingCategory.categoryId)} &gt; {editingCategory && getSubcategoryName(editingCategory.categoryId, editingCategory.subcategoryId)}
            </DialogTitle>
            <DialogDescription>
              Configure os valores orçados para cada mês do ano. Estes valores serão usados na comparação com os valores realizados.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4">
            {months.map((month, index) => (
              <div key={month}>
                <Label htmlFor={`budget-${index}`}>{month}</Label>
                <Input
                  id={`budget-${index}`}
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={budgetValues[index]}
                  onChange={(e) => {
                    const newValues = [...budgetValues];
                    newValues[index] = parseFloat(e.target.value) || 0;
                    setBudgetValues(newValues);
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={saveBudget}>Salvar Orçamento</Button>
            <Button variant="outline" onClick={() => setIsEditBudgetOpen(false)}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}