import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, DollarSign, Calendar, FileText, Upload, AlertCircle, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export function AccountsReceivable({ accounts, categories, onAccountsChange, fetchWithAuth, API_URL, onRefresh, readOnly = false, unidadeId = null }) {
  const { toast } = useToast();
  const { user } = useAuth();
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
  const initialForm = {competencyDate: '',amount: '',subcategoryId: '',description: ''};
  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false); // estado de carregamento local
  const [localAccounts, setLocalAccounts] = useState(accounts ?? []);  // lista local de contas — se `accounts` for passado como prop, usamos ele como fallback
  // paginacao
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const isReadOnly = !!readOnly;
  const notifyReadOnly = () => toast({ title: 'Modo somente leitura', description: 'O gerente da matriz pode apenas visualizar os lançamentos desta unidade.', variant: 'secondary' });
  
  // Estados para modal de exclusão
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteConfirmError, setDeleteConfirmError] = useState('');
  const [deleteStep, setDeleteStep] = useState('confirm'); // confirm | input

  useEffect(() => {if (Array.isArray(accounts) && accounts.length >= 0) setLocalAccounts(accounts);}, [accounts]);  // sincroniza prop `accounts` caso mude externamente

  // carregar contas do backend quando houver fetchWithAuth/API_URL (integração automática)
  useEffect(() => {
    if (!fetchWithAuth || !API_URL) return;
    let mounted = true;

    async function loadContas() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedMonth) params.set('mes', String(selectedMonth));// filtro por mês/ano (usa selectedMonth/selectedYear do componente)
        if (selectedYear) params.set('ano', String(selectedYear));        
        params.set('tipoMovimento', 'ENTRADA');// apenas contas de entrada para este componente (contas a receber)
        if (unidadeId) params.set('unidadeId', String(unidadeId));

        const url = `${API_URL}/contas-financeiras?${params.toString()}`;
        console.debug('[AccountsReceivable] GET', url);
        const res = await fetchWithAuth(url, { method: 'GET', credentials: 'include' });
        if (!res.ok) { console.warn('[AccountsReceivable] resposta não OK', res.status);
          if (mounted) setLocalAccounts([]);
          return;
        }

        const body = await res.json().catch(() => null);
        const dados = body?.dados ?? body?.contas ?? body ?? [];
        // normaliza para array
        const lista = Array.isArray(dados) ? dados : (Array.isArray(dados.dados) ? dados.dados : []);
        
        console.debug('[AccountsReceivable] Contas recebidas do backend:', lista.length, lista);
        
        if (mounted) {
          const contasMapeadas = lista.map(c => {
            // Normalizar competencyDate para formato YYYY-MM-DD
            let competencyDate = '';
            if (c.competencia) {
              try {
                const date = new Date(c.competencia);
                if (!isNaN(date.getTime())) {
                  competencyDate = date.toISOString().split('T')[0];
                } else {
                  competencyDate = String(c.competencia);
                }
              } catch (e) {
                competencyDate = String(c.competencia || '');
              }
            } else if (c.competencyDate) {
              competencyDate = String(c.competencyDate);
            }
            
            return {
              id: String(c.id),
              competencyDate: competencyDate,
              amount: Number(c.valor ?? c.amount ?? 0),
              categoryId: c.categoriaId ? String(c.categoriaId) : null,
              subcategoryId: c.subcategoriaId ? String(c.subcategoriaId) : null,
              description: c.descricao ?? c.description ?? '',
              status: 'received'
            };
          });
          
          console.debug('[AccountsReceivable] Contas mapeadas:', contasMapeadas.length, contasMapeadas);
          setLocalAccounts(contasMapeadas);
        }}
      catch (err) {
        console.error('[AccountsReceivable] erro ao carregar contas:', err);
        if (mounted) setLocalAccounts([]);
      } finally { if (mounted) setLoading(false); }
    }
    
    try { fetchWithAuth.__loadContas = loadContas; } catch (e) { /* ignore */ }// expor a função para chamadas internas (ex: após criar nova conta)
    loadContas();
    return () => { mounted = false; };
  }, [fetchWithAuth, API_URL, selectedMonth, selectedYear, unidadeId]);

  const resetForm = () => {setFormData(initialForm); setFormErrors({}); setEditingAccount(null);};
  
  // Função para validar e normalizar datas
  const validarData = (dateString) => {
    if (!dateString) return null;
    
    const cleanDate = dateString.trim();
    if (!cleanDate) return null;
    
    const date = new Date(cleanDate);
    
    if (isNaN(date.getTime())) {
      return null;
    }
    
    const year = date.getFullYear();
    if (year < 1900 || year > 2100) {
      return null;
    }
    
    return date.toISOString().split('T')[0];
  };

  const handleAdd = async () => {
    if (isReadOnly) {
      notifyReadOnly();
      return;
    }
    // limpar erros anteriores
    setFormErrors({});

    // validação inline (mostra mensagem abaixo do input e borda vermelha)
    const errors = {};
    if (!formData.competencyDate) errors.competencyDate = 'Data de competência é obrigatória.';
    if (!formData.amount) errors.amount = 'Valor é obrigatório.';
    if (!formData.subcategoryId) errors.subcategoryId = 'Subcategoria é obrigatória.';

    // validar formato de data quando informado
    const competenciaValidada = formData.competencyDate ? validarData(formData.competencyDate) : null;
    if (formData.competencyDate && !competenciaValidada) {
      errors.competencyDate = `Data de competência inválida: "${formData.competencyDate}".`;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast({ title: 'Campos obrigatórios', description: 'Preencha todos os campos obrigatórios antes de salvar.', variant: 'destructive' });
      return;
    }

    try {
      // já validado acima; normalizar data
      const competenciaValidadaNorm = competenciaValidada || null;

      const subcategory = categories
        .flatMap(cat => cat.subcategories)
        .find(sub => sub.id === formData.subcategoryId);
      const categoria = categories.find(cat => cat.subcategories.some(sub => sub.id === formData.subcategoryId));
      // garantir o formato esperado pelo backend
      const descricaoValor = (formData.description || `${categoria ? categoria.name : ''}${categoria && subcategory ? ' - ' : ''}${subcategory ? subcategory.name : ''}`).trim();
      const contaData = { descricao: descricaoValor || 'Conta', tipoMovimento: 'ENTRADA', categoriaId: categoria ? parseInt(categoria.id) : null, subcategoriaId: subcategory ? parseInt(formData.subcategoryId) : null, formaPagamento: 'DINHEIRO', valor: parseFloat(formData.amount), documento: '', observacao: formData.description || '' };
      if (competenciaValidadaNorm) contaData.competencia = competenciaValidadaNorm;

      const url = API_URL ? `${API_URL}contas-financeiras` : '/api/contas-financeiras';
      console.debug('[AccountsReceivable] POST payload:', contaData);
      
      if (!fetchWithAuth) {
        setFormErrors({ _global: 'Função de autenticação não disponível. Recarregue a página.' });
        return;
      }

      const response = await fetchWithAuth(url, {method: 'POST',credentials: 'include',headers: { 'Content-Type': 'application/json', },body: JSON.stringify(contaData)});
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Erro desconhecido');
        let errorMessage = 'Erro ao criar conta';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.erro || errorJson.detalhes || errorJson.message || errorMessage;
        } catch {
          errorMessage = errorText || `Erro HTTP ${response.status}`;
        }
        setFormErrors({ _global: errorMessage });
        return;
      }

      let result = null;
      try { 
        result = await response.json(); 
      } catch (e) {
        console.error('[AccountsReceivable] falha ao parsear response.json():', e);
        const text = await response.text().catch(() => '<no body>');
        console.error('[AccountsReceivable] response text:', text);
        toast({
          title: "Erro",
          description: "Erro ao processar resposta do servidor. Por favor, tente novamente.",
          variant: "destructive",
        });
        return;
      }
      if (result.sucesso) {
        toast({ title: "Sucesso!", description: "Receita criada com sucesso.", variant: "default" });
        setFormErrors({});

        // Sempre recarregar dados do backend para garantir consistência
        if (onRefresh) {
          await onRefresh('receivable');
        }
        // Sempre chamar __loadContas para garantir atualização
        if (fetchWithAuth && typeof fetchWithAuth.__loadContas === 'function') {
          // Aguardar um pouco para garantir que o backend processou
          setTimeout(() => {
            fetchWithAuth.__loadContas();
          }, 200);
        }
        if (!onRefresh && !(fetchWithAuth && typeof fetchWithAuth.__loadContas === 'function')) {
          // Fallback apenas se não houver refresh disponível
          const created = result.dados || null;
          // normalize competency dates so the client-side filter matches immediately
          const normalizeCompetency = (raw) => {
            if (!raw) return null;
            // prefer YYYY-MM-DD if possible
            const v = validarData(String(raw));
            return v || String(raw);
          };

          const newAccount = created ? (function(){
            const createdCompetency = normalizeCompetency(created.competencia || created.competencyDate) || formData.competencyDate || '';
            return {
              id: String(created.id),
              competencyDate: createdCompetency,
              amount: created && created.valor !== undefined ? Number(created.valor) : parseAmount(formData.amount),
              categoryId: created.categoriaId ? String(created.categoriaId) : null,
              subcategoryId: String(created.subcategoriaId ?? formData.subcategoryId),
              description: created.descricao ?? formData.description,
              status: 'received'
            };
          })() : {
            id: `local-${Date.now()}`,
            competencyDate: validarData(formData.competencyDate) || formData.competencyDate || '',
            amount: parseAmount(formData.amount),
            categoryId: null, // Será preenchido quando o backend retornar
            subcategoryId: formData.subcategoryId,
            description: formData.description,
            status: 'received'
          };

          setLocalAccounts(prev => {
            const updated = [newAccount, ...prev];
            if (onAccountsChange) onAccountsChange(updated);
            console.debug('[AccountsReceivable] localAccounts after add:', updated.map(a => ({ id: a.id, competencyDate: a.competencyDate })));
            return updated;
          });
        }
        resetForm();
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error('Erro ao criar receita:', error);
      const errorMessage = error.message || 'Erro ao criar conta. Tente novamente.';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (account) => {
    if (isReadOnly) {
      notifyReadOnly();
      return;
    }
    setEditingAccount(account);
    const subId = account.subcategoryId || account.categoryId || '';
    // Garantir que a data de competência esteja no formato correto para o input type="date" (YYYY-MM-DD)
    let competencyDateFormatted = account.competencyDate || '';
    if (competencyDateFormatted) {
      try {
        const date = new Date(competencyDateFormatted);
        if (!isNaN(date.getTime())) {
          competencyDateFormatted = date.toISOString().split('T')[0];
        } else if (typeof competencyDateFormatted === 'string' && competencyDateFormatted.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // Já está no formato correto
        } else {
          // Tentar converter de DD/MM/YYYY ou outros formatos
          const normalized = validarData(competencyDateFormatted);
          if (normalized) {
            competencyDateFormatted = normalized;
          }
        }
      } catch (e) {
        console.warn('[AccountsReceivable] Erro ao formatar data de competência:', e);
      }
    }
    setFormData({
      competencyDate: competencyDateFormatted,
      amount: account.amount != null ? account.amount.toString() : '',
      subcategoryId: subId ? String(subId) : '',
      description: account.description || ''
    });
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (isReadOnly) {
      notifyReadOnly();
      return;
    }
    // limpar erros anteriores
    setFormErrors({});
    if (!editingAccount) return;

    const errors = {};
    if (!formData.competencyDate) errors.competencyDate = 'Data de competência é obrigatória.';
    if (!formData.amount) errors.amount = 'Valor é obrigatório.';
    if (!formData.subcategoryId) errors.subcategoryId = 'Subcategoria é obrigatória.';

    const competenciaValidada = formData.competencyDate ? validarData(formData.competencyDate) : null;
    if (formData.competencyDate && !competenciaValidada) {
      errors.competencyDate = `Data de competência inválida: "${formData.competencyDate}".`;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast({ title: 'Campos obrigatórios', description: 'Preencha todos os campos obrigatórios antes de salvar.', variant: 'destructive' });
      return;
    }

    try {
      const subcategory = categories
        .flatMap(cat => cat.subcategories)
        .find(sub => sub.id === formData.subcategoryId);

      const categoria = categories.find(cat => cat.subcategories.some(sub => sub.id === formData.subcategoryId));
      const competenciaValidadaNorm = competenciaValidada || null;
      const contaData = { descricao: formData.description || '', categoriaId: categoria ? parseInt(categoria.id) : null, subcategoriaId: subcategory ? parseInt(formData.subcategoryId) : null, formaPagamento: editingAccount.formaPagamento || 'DINHEIRO', valor: parseFloat(formData.amount), documento: editingAccount.documento || '', observacao: formData.description || '' };
      if (competenciaValidadaNorm) contaData.competencia = competenciaValidadaNorm;
      const url = API_URL ? `${API_URL}contas-financeiras/${editingAccount.id}` : `/api/contas-financeiras/${editingAccount.id}`;
      const response = await fetchWithAuth(url, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(contaData),
      });

      let result = {};
      try { result = await response.json(); } catch (e) { /* ignore parse errors */ }

      if (!response.ok) {
        const errorMessage = result.erro || result.detalhes || result.message || `Erro HTTP ${response.status}`;
        setFormErrors({ _global: errorMessage });
        return;
      }

      if (result.sucesso) {
        toast({ title: "Sucesso!", description: "Receita atualizada com sucesso.", variant: "default" });
        // Sempre recarregar do backend para garantir dados atualizados
        if (onRefresh) {
          // Aguardar um pouco para garantir que o backend processou
          setTimeout(async () => {
            await onRefresh('receivable');
          }, 300);
        }
        // Sempre chamar __loadContas para garantir atualização
        if (fetchWithAuth && typeof fetchWithAuth.__loadContas === 'function') {
          // Aguardar um pouco para garantir que o backend processou
          setTimeout(() => {
            fetchWithAuth.__loadContas();
          }, 300);
        }
        if (!onRefresh && !(fetchWithAuth && typeof fetchWithAuth.__loadContas === 'function')) {
          // Fallback apenas se não houver refresh disponível
          const updatedAccount = {
            ...editingAccount,
            competencyDate: validarData(formData.competencyDate) || formData.competencyDate || '',
            amount: parseFloat(formData.amount),
            categoryId: result.dados?.categoriaId ? String(result.dados.categoriaId) : editingAccount.categoryId,
            subcategoryId: formData.subcategoryId,
            description: formData.description,
            status: 'received'
          };

          setLocalAccounts(prev => {
            const updated = prev.map(acc => acc.id === editingAccount.id ? updatedAccount : acc);
            if (onAccountsChange) onAccountsChange(updated);
            console.debug('[AccountsReceivable] localAccounts after update:', updated.map(a => ({ id: a.id, competencyDate: a.competencyDate })));
            return updated;
          });
        }

        resetForm();
        setEditingAccount(null);
        setIsEditDialogOpen(false);
        setFormErrors({});
      }
    } catch (error) {
      setFormErrors({ _global: error?.message || 'Erro ao atualizar conta. Tente novamente.' });
    }
  };

  const openDeleteDialog = (id) => {
    setDeleteTargetId(id);
    setDeleteConfirmText('');
    setDeleteConfirmError('');
    setDeleteStep('confirm');
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteStep === 'confirm') {
      setDeleteStep('input');
      return;
    }

    if (deleteConfirmText !== 'Excluir') {
      setDeleteConfirmError('Digite "Excluir" para confirmar.');
      return;
    }
    setDeleteConfirmError('');
    setDeleteDialogOpen(false);

    if (!deleteTargetId) return;

    try {
      const url = API_URL ? `${API_URL}contas-financeiras/${deleteTargetId}` : `/api/contas-financeiras/${deleteTargetId}`;
      const response = await fetchWithAuth(url, {method: 'DELETE',credentials: 'include',headers: { 'Content-Type': 'application/json', },});

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMessage = result.erro || result.detalhes || 'Erro ao deletar conta';
        throw new Error(errorMessage);
      }

      toast({
        title: "Sucesso!",
        description: "Conta a receber deletada com sucesso.",
        variant: "default",
      });

        // Sempre recarregar do backend para garantir dados atualizados
        if (onRefresh) {
          // Aguardar um pouco para garantir que o backend processou
          setTimeout(async () => {
            await onRefresh('receivable');
          }, 300);
        }
        // Sempre chamar __loadContas para garantir atualização
        if (fetchWithAuth && typeof fetchWithAuth.__loadContas === 'function') {
          // Aguardar um pouco para garantir que o backend processou
          setTimeout(() => {
            fetchWithAuth.__loadContas();
          }, 300);
        } else if (!onRefresh) {
        // Fallback apenas se não houver refresh disponível
        setLocalAccounts(prev => {
          const updated = prev.filter(acc => acc.id !== deleteTargetId);
          if (onAccountsChange) onAccountsChange(updated);
          console.debug('[AccountsReceivable] localAccounts after delete:', updated.map(a => ({ id: a.id, competencyDate: a.competencyDate })));
          return updated;
        });
      }
    } catch (error) {
      console.error('Erro ao deletar receita:', error);
      const errorMessage = error.message || 'Erro ao deletar receita. Tente novamente.';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
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
        headers.forEach((header, index) => { row[header] = values[index] || ''; });
        rows.push(row);
      }
    }return rows;};

  // Função para parsear uma linha CSV considerando aspas e vírgulas
  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {current += '"';i += 2;}// Aspas escapadas
        else {inQuotes = !inQuotes;i++;}
      }
      else if (char === ',' && !inQuotes) { result.push(current.trim());current = '';i++;}  // Vírgula separadora fora das aspas
      else {current += char;i++;}
    }
    result.push(current.trim());
    return result;
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return '';
    const cleanDateStr = dateStr.replace(/"/g, '').trim();    // Remove aspas se existirem
    const formats = [
      /^(\d{2})\/(\d{2})\/(\d{4})$/, // DD/MM/YYYY
      /^(\d{4})-(\d{2})-(\d{2})$/, // YYYY-MM-DD
      /^(\d{2})-(\d{2})-(\d{4})$/, // DD-MM-YYYY
    ];

    for (const format of formats) {
      const match = cleanDateStr.match(format);
      if (match) {
        if (format === formats[1]) { return `${match[1]}-${match[2]}-${match[3]}`; }
        else { return `${match[3]}-${match[2]}-${match[1]}`; }
      }
    }return '';};

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
    for (const category of categories) {if (category.type === 'entrada') {for (const subcategory of category.subcategories) {if (subcategory.name.toLowerCase() === cleanName.toLowerCase()) { return subcategory.id; }}}}

    // Se não encontrou, verifica se é uma categoria principal
    for (const category of categories) {if (category.type === 'entrada') {if (category.name.toLowerCase() === cleanName.toLowerCase()) {if (category.subcategories.length > 0) { return category.subcategories[0].id; } }}} // Retorna a primeira subcategoria da categoria
    return null;
  };

  const handleImportCSV = async () => {
    if (!importFile) return;
    const text = await importFile.text();
    const rows = parseCSV(text);

    if (rows.length === 0) {
      setImportProgress({show: true,processed: 0,total: 0,errors: ['Arquivo CSV vazio ou formato inválido'],imported: 0});
      return;
    }

    setImportProgress({show: true,processed: 0,total: rows.length,errors: [],imported: 0});

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
        if (!emissao) {errors.push(`Linha ${lineNum}: Data de emissão é obrigatória`);continue;}
        if (!vencimento) {errors.push(`Linha ${lineNum}: Data de vencimento é obrigatória`);continue;}
        if (!valor) {errors.push(`Linha ${lineNum}: Valor é obrigatório`);continue;}
        if (!categoria) {errors.push(`Linha ${lineNum}: Categoria é obrigatória`);continue;}

        // Parsear dados
        const competencyDate = parseDate(emissao);
        const dueDate = parseDate(vencimento);
        const paymentDate = pagamento ? parseDate(pagamento) : '';
        const amount = parseAmount(valor);
        const subcategoryId = findSubcategoryByName(categoria);

        // Validar dados parseados
        if (!competencyDate) {errors.push(`Linha ${lineNum}: Data de emissão inválida (${emissao})`);continue;}
        if (!dueDate) {errors.push(`Linha ${lineNum}: Data de vencimento inválida (${vencimento})`);continue;}
        if (amount <= 0) {errors.push(`Linha ${lineNum}: Valor inválido (${valor})`);continue;}
        if (!subcategoryId) {errors.push(`Linha ${lineNum}: Categoria não encontrada (${categoria}). Verifique se a categoria existe ou crie uma nova.`);continue;}
        if (pagamento && !paymentDate) {errors.push(`Linha ${lineNum}: Data de pagamento inválida (${pagamento})`);continue;}

        // Criar conta
        const newAccount = {id: `import-${Date.now()}-${i}`,competencyDate,dueDate,paymentDate: paymentDate || undefined,amount,subcategoryId,description: obs || `Importado do CSV - Linha ${lineNum}`,status: paymentDate ? 'received' : 'pending'};
        newAccounts.push(newAccount);
      }
      catch (error) { errors.push(`Linha ${lineNum}: Erro ao processar dados - ${error}`); }

      setImportProgress(prev => ({...prev,processed: i + 1,imported: newAccounts.length}));
    }

    if (newAccounts.length > 0) {
      setLocalAccounts(prev => {      // atualiza lista local e notifica pai (se existir)
        const updated = [...prev, ...newAccounts];
        if (onAccountsChange) onAccountsChange(updated);
        return updated;
      });
    }

    setImportProgress(prev => ({...prev,errors,imported: newAccounts.length}));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setImportFile(file);
      setImportProgress({ show: false, processed: 0, total: 0, errors: [], imported: 0 });
    }
  };

  const formatCurrency = (value) => {return new Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(value);};

  const formatDate = (dateString) => { return new Date(dateString).toLocaleDateString('pt-BR'); };

  const getSubcategoryName = (subcategoryId, categoryId = null) => {
    // Primeiro, tentar encontrar pela subcategoria (se houver)
    if (subcategoryId) {
      for (const category of categories) {
        const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
        if (subcategory) {
          return `${category.name} > ${subcategory.name}`;
        }
      }
    }
    
    // Se não encontrou subcategoria, tentar encontrar pela categoria diretamente
    // Isso acontece quando uma conta foi criada em uma categoria sem subcategoria
    if (categoryId) {
      const category = categories.find(cat => cat.id === categoryId);
      if (category) {
        return category.name; // Retorna apenas o nome da categoria
      }
    }
    
    // Se não encontrou nem subcategoria nem categoria, retornar mensagem de erro
    return 'Categoria não encontrada';
  };

  // Função para gerar Excel no formato de relatório financeiro
  const gerarExcelLocal = () => {
    if (!localAccounts || localAccounts.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Não há receitas cadastradas para exportar.",
        variant: "destructive",
      });
      return;
    }

    // Filtrar contas do ano selecionado
    const yearAccounts = localAccounts.filter(acc => {
      if (!acc.competencyDate) return false;
      try {
        const date = new Date(acc.competencyDate);
        return date.getFullYear() === parseInt(selectedYear);
      } catch {
        return false;
      }
    });

    if (yearAccounts.length === 0) {
      toast({
        title: "Nenhum dado para o ano selecionado",
        description: `Não há receitas cadastradas para o ano ${selectedYear}.`,
        variant: "destructive",
      });
      return;
    }

    // Organizar dados por categoria, subcategoria e mês
    const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAIO', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    
    // Preparar estrutura de dados para a planilha
    const rows = [];
    
    // Cabeçalho do relatório
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString('pt-BR') + ' - ' + dataAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    // Título do relatório
    rows.push(['Relatório de Receitas - RuralTech - ' + selectedYear, '', '', '', '', '', '', '', '', '', '', '', '', '']);
    
    // Informações da unidade e usuário
    const nomeUnidade = user?.unidade?.nome || user?.unidade?.name || 'Não informado';
    const nomeUsuario = user?.nome || user?.name || 'Não informado';
    rows.push(['Unidade: ' + nomeUnidade, 'Usuario: ' + nomeUsuario, '', '', '', '', '', '', '', '', '', '', '']);
    
    // Data e hora da exportação
    rows.push([dataFormatada, '', '', '', '', '', '', '', '', '', '', '', '']);
    rows.push([]); // Linha em branco

    // Seção RECEITA
    rows.push(['RECEITA']);
    rows.push(['', ...meses, 'ANO']);

    // Iterar categorias de entrada
    const entryCategoriesData = categories.filter(cat => cat.type === 'entrada');
    let totalReceitaPorMes = Array(12).fill(0);
    let totalReceitaAno = 0;

    entryCategoriesData.forEach(categoria => {
      const subcats = categoria.subcategories || [];
      if (subcats.length > 0) {
        rows.push([categoria.name || '<NOME DA CATEGORIA>']);
        
        // Linhas das subcategorias
        subcats.forEach(subcat => {
          const valoresMes = Array(12).fill(0);
          let totalSubcat = 0;
          
          // Buscar valores dessa subcategoria
          yearAccounts.forEach(account => {
            if (account.subcategoryId === subcat.id) {
              const date = new Date(account.competencyDate);
              const mes = date.getMonth();
              const valor = parseFloat(account.amount || 0);
              valoresMes[mes] += valor;
              totalSubcat += valor;
              totalReceitaPorMes[mes] += valor;
            }
          });
          
          totalReceitaAno += totalSubcat;
          
          const row = [subcat.name || '<NOME DA SUBCATEGORIA>'];
          valoresMes.forEach(valor => {
            row.push(valor !== 0 ? valor : '');
          });
          row.push(totalSubcat !== 0 ? totalSubcat : '');
          rows.push(row);
        });
      }
    });

    // Total Receita
    const totalRow = ['Total'];
    totalReceitaPorMes.forEach(valor => {
      totalRow.push(valor !== 0 ? valor : '');
    });
    totalRow.push(totalReceitaAno);
    rows.push(totalRow);
    rows.push([]); // Linha em branco

    // Seção DESPESAS
    rows.push(['DESPESAS']);
    rows.push(['', ...meses, 'ANO']);
    rows.push(['<NOME DA CATEGORIA>']);
    rows.push(['<NOME DA SUBCATEGORIA>', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    rows.push(['Total', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    rows.push([]); // Linha em branco

    // Seção TOTAIS
    rows.push(['TOTAIS']);
    rows.push(['', ...meses, 'ANO']);
    const totalGeralRow = ['Despesas totais'];
    totalReceitaPorMes.forEach(valor => {
      totalGeralRow.push(valor !== 0 ? valor : '');
    });
    totalGeralRow.push(totalReceitaAno);
    rows.push(totalGeralRow);

    // Criar workbook e worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    
    // Configurar largura das colunas
    const colWidths = [{ wch: 30 }];
    for (let i = 0; i < 13; i++) colWidths.push({ wch: 12 });
    worksheet['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');
    
    // Gerar arquivo Excel
    const filename = `relatorio_financeiro_${selectedYear}_${new Date().getTime()}.xlsx`.trim();
    XLSX.writeFile(workbook, filename);
    
    toast({
      title: "Relatório Excel gerado com sucesso",
      description: `Arquivo "${filename}" baixado com sucesso.`,
      variant: "default",
    });
  };

  // Função para exportar CSV do backend
  const exportarCSVBackend = async () => {
    if (!fetchWithAuth || !API_URL) {
      toast({
        title: "Erro de configuração",
        description: "Função de autenticação não disponível. Usando exportação local.",
        variant: "default",
      });
      gerarExcelLocal();
      return;
    }

    try {
      const params = new URLSearchParams();
      if (selectedMonth) params.set('mes', String(selectedMonth));
      if (selectedYear) params.set('ano', String(selectedYear));
      params.set('tipoMovimento', 'ENTRADA');

      // Verificar se API_URL já termina com / e ajustar
      const baseUrl = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
      const url = `${baseUrl}contas-financeiras/exportar/csv?${params.toString()}`;
      console.debug('[AccountsReceivable] GET CSV', url);
      
      const response = await fetchWithAuth(url, { 
        method: 'GET', 
        credentials: 'include' 
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      const urlBlob = URL.createObjectURL(blob);
      
      // Tentar obter o nome do arquivo do header Content-Disposition
      const contentDisposition = response.headers.get('Content-Disposition');
      const monthName = getSelectedMonthName().replace(/\s+/g, '-').toLowerCase().trim();
      let filename = `receitas_${monthName}_${selectedYear}_${new Date().getTime()}.csv`.trim();
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+?)"?(?:;|$)/);
        if (filenameMatch) {
          filename = filenameMatch[1].trim();
        }
      }
      
      link.setAttribute('href', urlBlob);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "CSV exportado com sucesso",
        description: `Arquivo "${filename}" baixado do servidor.`,
        variant: "default",
      });
    } catch (error) {
      console.error('[AccountsReceivable] Erro ao exportar CSV do backend:', error);
      toast({
        title: "Erro ao exportar CSV",
        description: "Erro ao exportar do servidor. Tentando exportação local...",
        variant: "default",
      });
      // Fallback para exportação local
      gerarExcelLocal();
    }
  };

  // Função para exportar Excel do backend
  const exportarExcelBackend = async () => {
    if (!fetchWithAuth || !API_URL) {
      toast({
        title: "Erro de configuração",
        description: "Função de autenticação não disponível. Usando exportação local.",
        variant: "default",
      });
      gerarExcelLocal();
      return;
    }

    try {
      const params = new URLSearchParams();
      if (selectedMonth) params.set('mes', String(selectedMonth));
      if (selectedYear) params.set('ano', String(selectedYear));
      params.set('tipoMovimento', 'ENTRADA');

      // Verificar se API_URL já termina com / e ajustar
      const baseUrl = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
      const url = `${baseUrl}contas-financeiras/exportar/excel?${params.toString()}`;
      console.debug('[AccountsReceivable] GET Excel', url);
      
      const response = await fetchWithAuth(url, { 
        method: 'GET', 
        credentials: 'include' 
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      const urlBlob = URL.createObjectURL(blob);
      
      // Tentar obter o nome do arquivo do header Content-Disposition
      const contentDisposition = response.headers.get('Content-Disposition');
      const monthName = getSelectedMonthName().replace(/\s+/g, '-').toLowerCase().trim();
      let filename = `receitas_${monthName}_${selectedYear}_${new Date().getTime()}.xlsx`.trim();
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+?)"?(?:;|$)/);
        if (filenameMatch) {
          filename = filenameMatch[1].trim();
        }
      }
      
      link.setAttribute('href', urlBlob);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Excel exportado com sucesso",
        description: `Arquivo "${filename}" baixado do servidor.`,
        variant: "default",
      });
    } catch (error) {
      console.error('[AccountsReceivable] Erro ao exportar Excel do backend:', error);
      toast({
        title: "Erro ao exportar Excel",
        description: "Erro ao exportar do servidor. Tentando exportação local...",
        variant: "default",
      });
      // Fallback para exportação local
      gerarExcelLocal();
    }
  };

  const exportarPDFBackend = async () => {
    if (!fetchWithAuth || !API_URL) {
      toast({
        title: "Erro de configuração",
        description: "Função de autenticação não disponível.",
        variant: "destructive",
      });
      return;
    }

    try {
      const params = new URLSearchParams();
      if (selectedMonth) params.set('mes', String(selectedMonth));
      if (selectedYear) params.set('ano', String(selectedYear));
      params.set('tipoMovimento', 'ENTRADA');

      // Verificar se API_URL já termina com / e ajustar
      const baseUrl = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
      const url = `${baseUrl}contas-financeiras/exportar/pdf?${params.toString()}`;
      console.debug('[AccountsReceivable] GET PDF', url);
      
      const response = await fetchWithAuth(url, { 
        method: 'GET', 
        credentials: 'include',
        headers: {
          'Accept': 'application/pdf, application/json',
        }
      });

      if (!response.ok) {
        let errorText = '';
        try {
          errorText = await response.text();
          try {
            const errorJson = JSON.parse(errorText);
            errorText = errorJson.mensagem || errorJson.erro || errorJson.message || errorText;
          } catch {
            // Não é JSON, usar texto direto
          }
        } catch {
          errorText = `Erro HTTP ${response.status}`;
        }
        console.error('[AccountsReceivable] Erro ao exportar PDF:', response.status, errorText);
        
        toast({
          title: "Erro ao exportar PDF",
          description: errorText || `Erro HTTP ${response.status}`,
          variant: "destructive",
        });
        return;
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      const urlBlob = URL.createObjectURL(blob);
      
      const contentDisposition = response.headers.get('Content-Disposition');
      const monthName = getSelectedMonthName().replace(/\s+/g, '-').toLowerCase().trim();
      let filename = `receitas_${monthName}_${selectedYear}_${new Date().getTime()}.pdf`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+?)"?(?:;|$)/);
        if (filenameMatch) {
          filename = filenameMatch[1].trim();
        }
      }
      
      link.setAttribute('href', urlBlob);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "PDF exportado com sucesso",
        description: `Arquivo "${filename}" baixado com sucesso.`,
        variant: "default",
      });
    } catch (error) {
      console.error('[AccountsReceivable] Erro ao exportar PDF do backend:', error);
      toast({
        title: "Erro ao exportar PDF",
        description: "Erro ao exportar do servidor. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const months = [{ value: '1', label: 'Janeiro' }, { value: '2', label: 'Fevereiro' }, { value: '3', label: 'Março' }, { value: '4', label: 'Abril' }, { value: '5', label: 'Maio' }, { value: '6', label: 'Junho' }, { value: '7', label: 'Julho' }, { value: '8', label: 'Agosto' }, { value: '9', label: 'Setembro' }, { value: '10', label: 'Outubro' }, { value: '11', label: 'Novembro' }, { value: '12', label: 'Dezembro' }];

  const filteredAccounts = useMemo(() => {
    if (!localAccounts || localAccounts.length === 0) return [];
    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);
    
    console.log('[AccountsReceivable] 🔍 Iniciando filtro...', {
      totalContas: localAccounts?.length || 0,
      mes: selectedMonth,
      ano: selectedYear
    });
    
    console.log('[AccountsReceivable] 📊 Contas antes do filtro:', localAccounts.map(acc => ({
      id: acc.id,
      competencyDate: acc.competencyDate || 'N/A'
    })));
    
    const filtered = localAccounts.filter(acc => {
      // Usar apenas competencyDate para receitas
      const dateToCheck = acc.competencyDate;
      
      if (!dateToCheck) {
        console.warn('[AccountsReceivable] ⚠️ Conta sem data de competência:', acc.id);
        return false;
      }
      
      try {
        // Se for string no formato YYYY-MM-DD, extrair diretamente
        if (typeof dateToCheck === 'string') {
          const dateMatch = dateToCheck.match(/^(\d{4})-(\d{2})-(\d{2})/);
          if (dateMatch) {
            const [, yearStr, monthStr] = dateMatch;
            const accountYear = parseInt(yearStr);
            const accountMonth = parseInt(monthStr);
            
            // Comparar diretamente ano e mês
            const matches = accountYear === year && accountMonth === month;
            
            if (matches) {
              console.log('[AccountsReceivable] ✅ Conta passou no filtro:', {
                id: acc.id,
                date: dateToCheck,
                accountYear,
                accountMonth,
                filterYear: year,
                filterMonth: month
              });
            } else {
              console.log('[AccountsReceivable] ❌ Conta fora do período:', {
                id: acc.id,
                date: dateToCheck,
                accountYear,
                accountMonth,
                filterYear: year,
                filterMonth: month
              });
            }
            
            return matches;
          }
        }
        
        // Se não for formato YYYY-MM-DD, tentar parsear como Date
        const accountDate = new Date(dateToCheck);
        if (!isNaN(accountDate.getTime())) {
          const accountYear = accountDate.getFullYear();
          const accountMonth = accountDate.getMonth() + 1;
          
          const matches = accountYear === year && accountMonth === month;
          
          if (matches) {
            console.log('[AccountsReceivable] ✅ Conta passou no filtro (Date):', {
              id: acc.id,
              accountYear,
              accountMonth
            });
          }
          
          return matches;
        }
        
        console.warn('[AccountsReceivable] ⚠️ Data inválida:', dateToCheck, acc.id);
        return false;
      } catch (error) {
        console.error('[AccountsReceivable] ❌ Erro ao filtrar conta:', error, acc);
        return false;
      }
    });
    
    console.log('[AccountsReceivable] ✅ Resultado do filtro:', {
      filtradas: filtered.length,
      total: localAccounts.length,
      filtradasIds: filtered.map(acc => acc.id),
      filtradasDetalhes: filtered.map(acc => ({
        id: acc.id,
        competencyDate: acc.competencyDate
      }))
    });
    
    return filtered;
  }, [localAccounts, selectedMonth, selectedYear]);

  // pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / perPage));
  useEffect(() => {
    // sempre garante que a página atual seja válida quando filtros / perPage mudarem
    setPage(p => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  // resetar página quando filtros mudarem (UX comum)
  useEffect(() => {
    setPage(1);
  }, [selectedMonth, selectedYear, perPage]);

  // items atualmente visíveis na página
  const paginatedAccounts = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredAccounts.slice(start, start + perPage);
  }, [filteredAccounts, page, perPage]);

  // Calcular anos disponíveis baseado nas datas de competência
  const availableYears = useMemo(() => {
    const years = new Set();
    years.add(currentDate.getFullYear());
    localAccounts.forEach(acc => {
      if (acc && acc.competencyDate) {
        try {
          const date = new Date(acc.competencyDate);
          if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            if (year && !isNaN(year) && isFinite(year)) {
              years.add(year);
            }
          }
        } catch {
          // Ignora datas inválidas
        }
      }
    });
    return Array.from(years).filter(y => !isNaN(y) && isFinite(y)).sort((a, b) => b - a);
  }, [localAccounts, currentDate]);

  const entryCategories = categories.filter(cat => cat.type === 'entrada');
  const totalReceived = filteredAccounts.reduce((sum, acc) => sum + (Number(acc.amount) || 0), 0);

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
      {/* Filtros de Período */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 open-sans" />Filtro de Período</CardTitle>
          <CardDescription>Selecione o mês e ano para filtrar as receitas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month-filter">Mês</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger id="month-filter"><SelectValue /></SelectTrigger>
                <SelectContent>{months.map(month => (<SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year-filter">Ano</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger id="year-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>{availableYears.map(year => (<SelectItem key={year} value={year.toString()}>{year}</SelectItem>))}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground flex flex-row gap-2">
            <Calendar className="h-4 w-4" />
            <p>Exibindo receitas de <strong>{getSelectedMonthName()} de {selectedYear}</strong>
            {filteredAccounts.length !== localAccounts.length && (<Badge variant="secondary" className="ml-2">{filteredAccounts.length} de {localAccounts.length} receitas</Badge>)}</p>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-between items-center">
        <div>
          <h2>Receitas a Receber - {getSelectedMonthName()}/{selectedYear}</h2>
          <p className="text-muted-foreground">Gerencie suas receitas</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={exportarCSVBackend}
          >
            <Download className="h-4 w-4" />Exportar CSV
          </Button>
          {!isReadOnly && (
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => { 
              if (open) {
                if (isReadOnly) return;
                setFormErrors({});
              } else {
                resetForm();
              }
              setIsAddDialogOpen(open); 
            }}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2" disabled={isReadOnly}><Plus className="h-4 w-4" />Nova Receita
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Nova Receita</DialogTitle>
                <DialogDescription>Adicione uma nova receita ao sistema</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="competency-date" className="pb-3">Data de Competência</Label>
                  <Input id="competency-date" type="date" value={formData.competencyDate} onChange={(e) => setFormData({ ...formData, competencyDate: e.target.value })} className={formErrors.competencyDate ? 'border-red-600 ring-1 ring-red-600' : ''} />
                  {formErrors.competencyDate && <p className="text-sm text-red-600 mt-1">{formErrors.competencyDate}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount" className="pb-3">Valor</Label>
                    <Input id="amount" type="number" step="0.01" placeholder="0,00" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className={formErrors.amount ? 'border-red-600 ring-1 ring-red-600' : ''} />
                    {formErrors.amount && <p className="text-sm text-red-600 mt-1">{formErrors.amount}</p>}
                  </div>
                  <div>
                    <Label htmlFor="subcategory" className="pb-3">Subcategoria</Label>
                    <Select value={formData.subcategoryId} onValueChange={(value) => setFormData({ ...formData, subcategoryId: value })}>
                      <SelectTrigger id="subcategory" className={formErrors.subcategoryId ? 'border-red-600 ring-1 ring-red-600' : ''}><SelectValue placeholder="Selecione uma subcategoria" /></SelectTrigger>
                      <SelectContent>
                        {entryCategories.map(category => (
                          <React.Fragment key={category.id}>
                            {category.subcategories.filter(sub => sub && sub.id).map(subcategory => (
                              <SelectItem key={subcategory.id} value={String(subcategory.id)}>
                                {category.name || 'Sem nome'} &gt; {subcategory.name || 'Sem nome'}
                              </SelectItem>
                            ))}
                          </React.Fragment>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.subcategoryId && <p className="text-sm text-red-600 mt-1">{formErrors.subcategoryId}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="description" className="pb-3">Descrição</Label>
                  <Textarea id="description" placeholder="Descrição da receita" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleAdd}>Adicionar</Button>
              </div>
            </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1  gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Recebido</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-green-600">{formatCurrency(totalReceived)}</div>
            <p className="text-xs text-muted-foreground">{filteredAccounts.length} receitas</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Receitas</CardTitle>
          <CardDescription>Todas as receitas cadastradas</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando receitas...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Competência</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Descrição</TableHead>
                    {!isReadOnly && <TableHead>Ações</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.length > 0 ? (
                    paginatedAccounts.map(account => (
                      <TableRow key={account.id}>
                        <TableCell>{account.competencyDate ? formatDate(account.competencyDate) : '-'}</TableCell>
                        <TableCell>{formatCurrency(account.amount)}</TableCell>
                        <TableCell className="max-w-xs truncate">{getSubcategoryName(account.subcategoryId, account.categoryId)}</TableCell>
                        <TableCell className="max-w-xs truncate">{account.description || '-'}</TableCell>
                        {!isReadOnly && (
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(account)} disabled={isReadOnly}><Edit className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(account.id)} disabled={isReadOnly}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={isReadOnly ? 4 : 5} className="text-center text-muted-foreground py-8">
                        {localAccounts.length === 0 
                          ? 'Nenhuma receita cadastrada. Clique em "Nova Receita" para adicionar novos registros.' 
                          : `Nenhuma receita encontrada para ${getSelectedMonthName()} de ${selectedYear}. Total de receita: ${localAccounts.length}`}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* {filteredAccounts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma receita encontrada.</p>
                </div>
              )} */}

              <CardFooter className="flex items-center justify-between px-4 py-3 border-t dark:border-neutral-800 border-neutral-200">
                {/* <div className="text-sm text-neutral-400">
                  {selected.length} de {filtered.length} linha(s) selecionada(s).
                </div> */}

                <div className="flex items-center gap-3">
                  <Label className="text-sm font-medium">Linhas por pág.</Label>
                  <Select value={String(perPage)} onValueChange={(val) => { const v = Number(val); setPerPage(v); setPage(1); }}>
                    <SelectTrigger className="w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="text-sm">Pág. {page} de {Math.max(1, Math.ceil(filteredAccounts.length / perPage) || 1)}</div>

                  <div className="inline-flex items-center gap-1 border-l dark:border-neutral-800 border-neutral-200 pl-3">
                    <Button variant="ghost" size="sm" onClick={() => setPage(1)} disabled={page === 1} aria-label="Primeira página" >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>

                    <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} aria-label="Página anterior" >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Próxima página">
                      <ChevronRight className="h-4 w-4" />
                    </Button>

                    <Button variant="ghost" size="sm" onClick={() => setPage(totalPages)} disabled={page === totalPages} aria-label="Última página">
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          resetForm();
        } else {
          setFormErrors({});
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Receita</DialogTitle>
            <DialogDescription>Modifique os dados da conta a receber</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {formErrors._global && <div className="text-sm text-red-600">{formErrors._global}</div>}
            <div>
              <Label htmlFor="edit-competency-date">Data de Competência</Label>
              <Input id="edit-competency-date" type="date" value={formData.competencyDate} onChange={(e) => setFormData({ ...formData, competencyDate: e.target.value })} className={formErrors.competencyDate ? 'border-red-600 ring-1 ring-red-600' : ''} />
              {formErrors.competencyDate && <p className="text-sm text-red-600 mt-1">{formErrors.competencyDate}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-amount">Valor</Label>
                <Input id="edit-amount" type="number" step="0.01" placeholder="0,00" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className={formErrors.amount ? 'border-red-600 ring-1 ring-red-600' : ''} />
                {formErrors.amount && <p className="text-sm text-red-600 mt-1">{formErrors.amount}</p>}
              </div>
              <div>
                <Label htmlFor="edit-subcategory">Subcategoria</Label>
                <Select value={formData.subcategoryId} onValueChange={(value) => setFormData({ ...formData, subcategoryId: value })}>
                  <SelectTrigger id="edit-subcategory" className={formErrors.subcategoryId ? 'border-red-600 ring-1 ring-red-600' : ''}>
                    <SelectValue placeholder="Selecione uma subcategoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {entryCategories.map(category => (
                      <React.Fragment key={category.id}>
                        {category.subcategories.filter(sub => sub && sub.id).map(subcategory => (
                          <SelectItem key={subcategory.id} value={String(subcategory.id)}>
                            {category.name || 'Sem nome'} &gt; {subcategory.name || 'Sem nome'}
                          </SelectItem>
                        ))}
                      </React.Fragment>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.subcategoryId && <p className="text-sm text-red-600 mt-1">{formErrors.subcategoryId}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea id="edit-description" placeholder="Descrição da receita" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); resetForm(); }}>Cancelar</Button>
            <Button onClick={handleUpdate}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={(open) => {
        setDeleteDialogOpen(open);
        if (!open) {
          setDeleteStep('confirm');
          setDeleteConfirmText('');
          setDeleteConfirmError('');
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Você tem certeza que deseja excluir esse item? A ação não poderá ser desfeita.</DialogTitle>
            {deleteStep === 'confirm' ? (
              <DialogDescription>Essa ação removerá o item permanentemente.</DialogDescription>
            ) : (
              <DialogDescription>Digite <strong>Excluir</strong> para confirmar.</DialogDescription>
            )}
          </DialogHeader>
          {deleteStep === 'input' && (
            <div className="space-y-3">
              <Input
                value={deleteConfirmText}
                onChange={(e) => { setDeleteConfirmText(e.target.value); setDeleteConfirmError(''); }}
                placeholder='Digite "Excluir"'
              />
              {deleteConfirmError && <p className="text-sm text-destructive">{deleteConfirmError}</p>}
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant={deleteStep === 'confirm' ? "default" : "destructive"} onClick={confirmDelete}>
              {deleteStep === 'confirm' ? 'Prosseguir' : 'Excluir'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}