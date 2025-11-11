import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, DollarSign, Calendar, FileText, Upload, Download, AlertCircle } from 'lucide-react';
import { Category } from './CategoryManager';
import { Alert, AlertDescription } from '@/components/ui/alert';

// export interface AccountPayable {
//   id: string;
//   competencyDate: string;
//   dueDate: string;
//   paymentDate?: string;
//   amount: number;
//   subcategoryId: string;
//   description: string;
//   status: 'pending' | 'paid' | 'overdue';
// }

// interface AccountsPayableProps {
//   accounts: AccountPayable[];
//   categories: Category[];
//   onAccountsChange: (accounts: AccountPayable[]) => void;
// }

// interface CSVRow {
//   [key: string]: string;
// }

export function AccountsPayable({ accounts, categories, onAccountsChange }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [importFile, setImportFile] = useState(null);
  const [importProgress, setImportProgress] = useState({ show: false, processed: 0, total: 0, errors: [], imported: 0 });

  // Estados para filtro
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState((currentDate.getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());

  const [formData, setFormData] = useState({
    competencyDate: '',
    dueDate: '',
    paymentDate: '',
    amount: '',
    subcategoryId: '',
    description: ''
  });

  const resetForm = () => {
    setFormData({
      competencyDate: '',
      dueDate: '',
      paymentDate: '',
      amount: '',
      subcategoryId: '',
      description: ''
    });
  };

  const handleAdd = () => {
    if (!formData.competencyDate || !formData.dueDate || !formData.amount || !formData.subcategoryId) {
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const status = formData.paymentDate
      ? 'paid'
      : formData.dueDate < today
        ? 'overdue'
        : 'pending';

    const newAccount = {
      id: Date.now().toString(),
      competencyDate: formData.competencyDate,
      dueDate: formData.dueDate,
      paymentDate: formData.paymentDate || undefined,
      amount: parseFloat(formData.amount),
      subcategoryId: formData.subcategoryId,
      description: formData.description,
      status
    };

    onAccountsChange([...accounts, newAccount]);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setFormData({
      competencyDate: account.competencyDate,
      dueDate: account.dueDate,
      paymentDate: account.paymentDate || '',
      amount: account.amount.toString(),
      subcategoryId: account.subcategoryId,
      description: account.description
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingAccount || !formData.competencyDate || !formData.dueDate || !formData.amount || !formData.subcategoryId) {
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const status = formData.paymentDate
      ? 'paid'
      : formData.dueDate < today
        ? 'overdue'
        : 'pending';

    const updatedAccount = {
      ...editingAccount,
      competencyDate: formData.competencyDate,
      dueDate: formData.dueDate,
      paymentDate: formData.paymentDate || undefined,
      amount: parseFloat(formData.amount),
      subcategoryId: formData.subcategoryId,
      description: formData.description,
      status
    };

    onAccountsChange(accounts.map(acc =>
      acc.id === editingAccount.id ? updatedAccount : acc
    ));

    resetForm();
    setEditingAccount(null);
    setIsEditDialogOpen(false);
  };

  const handleDelete = (id) => {
    onAccountsChange(accounts.filter(acc => acc.id !== id));
  };

  // Função melhorada para parsing de CSV com suporte a campos entre aspas
  const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = parseCSVLine(lines[0]);
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length >= headers.length) {
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        rows.push(row);
      }
    }

    return rows;
  };

  // Função para parsear uma linha CSV considerando aspas e vírgulas
  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Aspas escapadas
          current += '"';
          i += 2;
        } else {
          // Alternar estado das aspas
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === ',' && !inQuotes) {
        // Vírgula separadora fora das aspas
        result.push(current.trim());
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }

    result.push(current.trim());
    return result;
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return '';

    // Remove aspas se existirem
    const cleanDateStr = dateStr.replace(/"/g, '').trim();

    // Tenta vários formatos de data
    const formats = [
      /^(\d{2})\/(\d{2})\/(\d{4})$/, // DD/MM/YYYY
      /^(\d{4})-(\d{2})-(\d{2})$/, // YYYY-MM-DD
      /^(\d{2})-(\d{2})-(\d{4})$/, // DD-MM-YYYY
    ];

    for (const format of formats) {
      const match = cleanDateStr.match(format);
      if (match) {
        if (format === formats[1]) {
          // YYYY-MM-DD
          return `${match[1]}-${match[2]}-${match[3]}`;
        } else {
          // DD/MM/YYYY ou DD-MM-YYYY
          return `${match[3]}-${match[2]}-${match[1]}`;
        }
      }
    }

    return '';
  };

  const parseAmount = (amountStr) => {
    if (!amountStr) return 0;

    // Remove aspas, espaços e símbolos de moeda
    const cleanAmount = amountStr
      .replace(/"/g, '')
      .replace(/[R$\s]/g, '')
      .replace(/\./g, '') // Remove pontos (separadores de milhares)
      .replace(',', '.'); // Substitui vírgula por ponto (separador decimal)

    const parsed = parseFloat(cleanAmount);
    return isNaN(parsed) ? 0 : parsed;
  };

  const findSubcategoryByName = (subcategoryName) => {
    if (!subcategoryName) return null;

    const cleanName = subcategoryName.replace(/"/g, '').trim();

    for (const category of categories) {
      if (category.type === 'saida') {
        for (const subcategory of category.subcategories) {
          if (subcategory.name.toLowerCase() === cleanName.toLowerCase()) {
            return subcategory.id;
          }
        }
      }
    }

    // Se não encontrou, verifica se é uma categoria principal
    for (const category of categories) {
      if (category.type === 'saida') {
        if (category.name.toLowerCase() === cleanName.toLowerCase()) {
          // Retorna a primeira subcategoria da categoria
          if (category.subcategories.length > 0) {
            return category.subcategories[0].id;
          }
        }
      }
    }

    return null;
  };

  const handleImportCSV = async () => {
    if (!importFile) return;

    const text = await importFile.text();
    const rows = parseCSV(text);

    if (rows.length === 0) {
      setImportProgress({
        show: true,
        processed: 0,
        total: 0,
        errors: ['Arquivo CSV vazio ou formato inválido'],
        imported: 0
      });
      return;
    }

    setImportProgress({
      show: true,
      processed: 0,
      total: rows.length,
      errors: [],
      imported: 0
    });

    const newAccounts = [];
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const lineNum = i + 2; // +2 porque linha 1 é header e contamos de 1

      try {
        // Mapear colunas do CSV
        const emissao = row['Emissão'] || row['Emissao'] || '';
        const vencimento = row['Vencimento'] || '';
        const pagamento = row['Pagamento'] || '';
        const valor = row['Valor'] || '';
        const categoria = row['Categoria'] || '';
        const obs = row['Obs'] || '';

        // Validações básicas
        if (!emissao) {
          errors.push(`Linha ${lineNum}: Data de emissão é obrigatória`);
          continue;
        }

        if (!vencimento) {
          errors.push(`Linha ${lineNum}: Data de vencimento é obrigatória`);
          continue;
        }

        if (!valor) {
          errors.push(`Linha ${lineNum}: Valor é obrigatório`);
          continue;
        }

        if (!categoria) {
          errors.push(`Linha ${lineNum}: Categoria é obrigatória`);
          continue;
        }

        // Parsear dados
        const competencyDate = parseDate(emissao);
        const dueDate = parseDate(vencimento);
        const paymentDate = pagamento ? parseDate(pagamento) : '';
        const amount = parseAmount(valor);
        const subcategoryId = findSubcategoryByName(categoria);

        // Validar dados parseados
        if (!competencyDate) {
          errors.push(`Linha ${lineNum}: Data de emissão inválida (${emissao})`);
          continue;
        }

        if (!dueDate) {
          errors.push(`Linha ${lineNum}: Data de vencimento inválida (${vencimento})`);
          continue;
        }

        if (amount <= 0) {
          errors.push(`Linha ${lineNum}: Valor inválido (${valor})`);
          continue;
        }

        if (!subcategoryId) {
          errors.push(`Linha ${lineNum}: Categoria não encontrada (${categoria}). Verifique se a categoria existe ou crie uma nova.`);
          continue;
        }

        if (pagamento && !paymentDate) {
          errors.push(`Linha ${lineNum}: Data de pagamento inválida (${pagamento})`);
          continue;
        }

        // Calcular status
        const today = new Date().toISOString().split('T')[0];
        const status = paymentDate
          ? 'paid'
          : dueDate < today
            ? 'overdue'
            : 'pending';

        // Criar conta
        const newAccount = {
          id: `import-${Date.now()}-${i}`,
          competencyDate,
          dueDate,
          paymentDate: paymentDate || undefined,
          amount,
          subcategoryId,
          description: obs || `Importado do CSV - Linha ${lineNum}`,
          status
        };

        newAccounts.push(newAccount);

      } catch (error) {
        errors.push(`Linha ${lineNum}: Erro ao processar dados - ${error}`);
      }

      setImportProgress(prev => ({
        ...prev,
        processed: i + 1,
        imported: newAccounts.length
      }));
    }

    // Adicionar contas válidas
    if (newAccounts.length > 0) {
      onAccountsChange([...accounts, ...newAccounts]);
    }

    setImportProgress(prev => ({
      ...prev,
      errors,
      imported: newAccounts.length
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setImportFile(file);
      setImportProgress({ show: false, processed: 0, total: 0, errors: [], imported: 0 });
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getSubcategoryName = (subcategoryId) => {
    for (const category of categories) {
      const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
      if (subcategory) {
        return `${category.name} > ${subcategory.name}`;
      }
    }
    return 'Categoria não encontrada';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Vencido</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      default:
        return <Badge>-</Badge>;
    }
  };

  // Opções para os selects de filtro
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

  // Filtrar contas baseado no período selecionado
  const filteredAccounts = useMemo(() => {
    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);

    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);

    return accounts.filter(acc => {
      const competencyDate = new Date(acc.competencyDate);
      return competencyDate >= monthStart && competencyDate <= monthEnd;
    });
  }, [accounts, selectedMonth, selectedYear]);

  // Calcular anos disponíveis baseado nas datas de competência
  const availableYears = useMemo(() => {
    const years = new Set(accounts.map(acc => new Date(acc.competencyDate).getFullYear()));
    years.add(currentDate.getFullYear());
    return Array.from(years).sort((a, b) => b - a);
  }, [accounts, currentDate]);

  const exitCategories = categories.filter(cat => cat.type === 'saida');
  const totalPending = filteredAccounts.filter(acc => acc.status === 'pending').reduce((sum, acc) => sum + acc.amount, 0);
  const totalOverdue = filteredAccounts.filter(acc => acc.status === 'overdue').reduce((sum, acc) => sum + acc.amount, 0);
  const totalPaid = filteredAccounts.filter(acc => acc.status === 'paid').reduce((sum, acc) => sum + acc.amount, 0);

  const resetImport = () => {
    setImportFile(null);
    setImportProgress({ show: false, processed: 0, total: 0, errors: [], imported: 0 });
  };

  const getSelectedMonthName = () => {
    const monthObj = months.find(m => m.value === selectedMonth);
    return monthObj ? monthObj.label : '';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={"gap-4 h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
            <CardTitle className="text-sm">Total Pendente</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-orange-600">{formatCurrency(totalPending)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredAccounts.filter(acc => acc.status === 'pending').length} contas
            </p>
          </CardContent>
        </Card>

        <Card className={"gap-4 h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
            <CardTitle className="text-sm">Total Vencido</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-red-600">{formatCurrency(totalOverdue)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredAccounts.filter(acc => acc.status === 'overdue').length} contas
            </p>
          </CardContent>
        </Card>

        <Card className={"gap-4 h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm">Total Pago</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-green-600">{formatCurrency(totalPaid)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredAccounts.filter(acc => acc.status === 'paid').length} contas
            </p>
          </CardContent>
        </Card>

        <Card className={"gap-4 h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm ">Total Geral</CardTitle>
            <FileText className="h-4 w-4 " />
          </CardHeader>
          <CardContent>
            <div className="">{formatCurrency(totalPending + totalOverdue + totalPaid)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredAccounts.length} contas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros de Período */}
      <Card className={"gap-10"}>
        <div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 open-sans" />
              Filtro de Período
            </CardTitle>
            <CardDescription>
              Selecione o mês e ano para filtrar as contas a pagar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="month-filter">Mês</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger id="month-filter">
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
                <Label htmlFor="year-filter">Ano</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger id="year-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>


              <div className="flex gap-2">
                <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Importar CSV
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Importar Contas a Pagar via CSV
                      </DialogTitle>
                      <DialogDescription>
                        Faça upload de um arquivo CSV com as colunas: Emissão, Vencimento, Pagamento, Valor, Categoria, Obs
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="csv-file">Arquivo CSV</Label>
                        <Input
                          id="csv-file"
                          type="file"
                          accept=".csv"
                          onChange={handleFileChange}
                          className="mt-2"
                        />
                      </div>

                      {importFile && (
                        <Alert>
                          <FileText className="h-4 w-4" />
                          <AlertDescription>
                            Arquivo selecionado: {importFile.name} ({(importFile.size / 1024).toFixed(1)} KB)
                          </AlertDescription>
                        </Alert>
                      )}

                      {importProgress.show && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Processando...</span>
                            <span>{importProgress.processed} de {importProgress.total}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(importProgress.processed / importProgress.total) * 100}%` }}
                            />
                          </div>
                          <div className="text-sm text-green-600">
                            {importProgress.imported} contas importadas com sucesso
                          </div>
                        </div>
                      )}

                      {importProgress.errors.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-red-600">Erros encontrados ({importProgress.errors.length}):</span>
                          </div>
                          <div className="max-h-32 overflow-y-auto bg-red-50 p-2 rounded text-sm">
                            {importProgress.errors.map((error, index) => (
                              <div key={index} className="text-red-600">{error}</div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="mb-2">Formato do CSV esperado:</h4>
                        <div className="text-sm space-y-1">
                          <div><strong>Emissão:</strong> Data de competência (DD/MM/YYYY)</div>
                          <div><strong>Vencimento:</strong> Data de vencimento (DD/MM/YYYY)</div>
                          <div><strong>Pagamento:</strong> Data de pagamento (DD/MM/YYYY) - opcional</div>
                          <div><strong>Valor:</strong> Valor em reais (ex: "1.500,00")</div>
                          <div><strong>Categoria:</strong> Nome da subcategoria (deve existir)</div>
                          <div><strong>Obs:</strong> Descrição - opcional</div>
                        </div>
                        <div className="mt-2 text-sm text-blue-600">
                          <strong>Nota:</strong> Valores com vírgulas devem estar entre aspas. Certifique-se de que as categorias mencionadas no CSV existem no sistema como categorias de saída.
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={resetImport}>
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleImportCSV}
                        disabled={!importFile || importProgress.show}
                      >
                        Importar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Nova Conta
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nova Conta a Pagar</DialogTitle>
                      <DialogDescription>
                        Adicione uma nova conta a pagar ao sistema
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="competency-date">Data de Competência</Label>
                          <Input
                            id="competency-date"
                            type="date"
                            value={formData.competencyDate}
                            onChange={(e) => setFormData({ ...formData, competencyDate: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="due-date">Data de Vencimento</Label>
                          <Input
                            id="due-date"
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="payment-date">Data de Pagamento (opcional)</Label>
                        <Input
                          id="payment-date"
                          type="date"
                          value={formData.paymentDate}
                          onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="amount">Valor</Label>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            placeholder="0,00"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="subcategory">Subcategoria</Label>
                          <Select value={formData.subcategoryId} onValueChange={(value) => setFormData({ ...formData, subcategoryId: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma subcategoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {exitCategories.map(category => (
                                <React.Fragment key={category.id}>
                                  {category.subcategories.map(subcategory => (
                                    <SelectItem key={subcategory.id} value={subcategory.id}>
                                      {category.name} &gt; {subcategory.name}
                                    </SelectItem>
                                  ))}
                                </React.Fragment>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                          id="description"
                          placeholder="Descrição da conta a pagar"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAdd}>Adicionar</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <p>Exibindo contas de <strong>{getSelectedMonthName()} de {selectedYear}</strong></p>
              {/* {filteredAccounts.length !== accounts.length && (
              <Badge variant="secondary" className="ml-2">
                {filteredAccounts.length} de {accounts.length} contas
              </Badge>
            )} */}
            </div>
          </CardContent>
        </div>




        <div>
          <CardHeader>
            <CardTitle>Lista de Contas</CardTitle>
            <CardDescription>Todas as contas a pagar cadastradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Competência</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map(account => (
                    <TableRow key={account.id}>
                      <TableCell>{formatDate(account.competencyDate)}</TableCell>
                      <TableCell>{formatDate(account.dueDate)}</TableCell>
                      <TableCell>
                        {account.paymentDate ? formatDate(account.paymentDate) : '-'}
                      </TableCell>
                      <TableCell>{formatCurrency(account.amount)}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {getSubcategoryName(account.subcategoryId)}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {account.description}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(account.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(account)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir esta conta a pagar? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(account.id)}>
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredAccounts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        {accounts.length === 0
                          ? 'Nenhuma conta cadastrada'
                          : `Nenhuma conta encontrada para ${getSelectedMonthName()} de ${selectedYear}`
                        }
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </div>

      </Card>

      {/* <div className="flex justify-between items-center">
        <div>
          <h2>Contas a Pagar - {getSelectedMonthName()}/{selectedYear}</h2>
          <p className="text-muted-foreground">Gerencie suas contas a pagar e despesas</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Importar CSV
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Importar Contas a Pagar via CSV
                </DialogTitle>
                <DialogDescription>
                  Faça upload de um arquivo CSV com as colunas: Emissão, Vencimento, Pagamento, Valor, Categoria, Obs
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="csv-file">Arquivo CSV</Label>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="mt-2"
                  />
                </div>

                {importFile && (
                  <Alert>
                    <FileText className="h-4 w-4" />
                    <AlertDescription>
                      Arquivo selecionado: {importFile.name} ({(importFile.size / 1024).toFixed(1)} KB)
                    </AlertDescription>
                  </Alert>
                )}

                {importProgress.show && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processando...</span>
                      <span>{importProgress.processed} de {importProgress.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(importProgress.processed / importProgress.total) * 100}%` }}
                      />
                    </div>
                    <div className="text-sm text-green-600">
                      {importProgress.imported} contas importadas com sucesso
                    </div>
                  </div>
                )}

                {importProgress.errors.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-600">Erros encontrados ({importProgress.errors.length}):</span>
                    </div>
                    <div className="max-h-32 overflow-y-auto bg-red-50 p-2 rounded text-sm">
                      {importProgress.errors.map((error, index) => (
                        <div key={index} className="text-red-600">{error}</div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="mb-2">Formato do CSV esperado:</h4>
                  <div className="text-sm space-y-1">
                    <div><strong>Emissão:</strong> Data de competência (DD/MM/YYYY)</div>
                    <div><strong>Vencimento:</strong> Data de vencimento (DD/MM/YYYY)</div>
                    <div><strong>Pagamento:</strong> Data de pagamento (DD/MM/YYYY) - opcional</div>
                    <div><strong>Valor:</strong> Valor em reais (ex: "1.500,00")</div>
                    <div><strong>Categoria:</strong> Nome da subcategoria (deve existir)</div>
                    <div><strong>Obs:</strong> Descrição - opcional</div>
                  </div>
                  <div className="mt-2 text-sm text-blue-600">
                    <strong>Nota:</strong> Valores com vírgulas devem estar entre aspas. Certifique-se de que as categorias mencionadas no CSV existem no sistema como categorias de saída.
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={resetImport}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleImportCSV}
                  disabled={!importFile || importProgress.show}
                >
                  Importar
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nova Conta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Conta a Pagar</DialogTitle>
                <DialogDescription>
                  Adicione uma nova conta a pagar ao sistema
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="competency-date">Data de Competência</Label>
                    <Input
                      id="competency-date"
                      type="date"
                      value={formData.competencyDate}
                      onChange={(e) => setFormData({ ...formData, competencyDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="due-date">Data de Vencimento</Label>
                    <Input
                      id="due-date"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="payment-date">Data de Pagamento (opcional)</Label>
                  <Input
                    id="payment-date"
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Valor</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="subcategory">Subcategoria</Label>
                    <Select value={formData.subcategoryId} onValueChange={(value) => setFormData({ ...formData, subcategoryId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma subcategoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {exitCategories.map(category => (
                          <React.Fragment key={category.id}>
                            {category.subcategories.map(subcategory => (
                              <SelectItem key={subcategory.id} value={subcategory.id}>
                                {category.name} &gt; {subcategory.name}
                              </SelectItem>
                            ))}
                          </React.Fragment>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descrição da conta a pagar"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAdd}>Adicionar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div> */}




      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Conta a Pagar</DialogTitle>
            <DialogDescription>
              Modifique os dados da conta a pagar
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-competency-date">Data de Competência</Label>
                <Input
                  id="edit-competency-date"
                  type="date"
                  value={formData.competencyDate}
                  onChange={(e) => setFormData({ ...formData, competencyDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-due-date">Data de Vencimento</Label>
                <Input
                  id="edit-due-date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-payment-date">Data de Pagamento (opcional)</Label>
              <Input
                id="edit-payment-date"
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-amount">Valor</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-subcategory">Subcategoria</Label>
                <Select value={formData.subcategoryId} onValueChange={(value) => setFormData({ ...formData, subcategoryId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma subcategoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {exitCategories.map(category => (
                      <React.Fragment key={category.id}>
                        {category.subcategories.map(subcategory => (
                          <SelectItem key={subcategory.id} value={subcategory.id}>
                            {category.name} &gt; {subcategory.name}
                          </SelectItem>
                        ))}
                      </React.Fragment>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                placeholder="Descrição da conta a pagar"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}