import React, { useState, useMemo, useEffect } from 'react';
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

export function AccountsPayable({ accounts, categories, onAccountsChange, fetchWithAuth, API_URL, onRefresh, readOnly = false, unidadeId = null }) {
  const { toast } = useToast();
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
  const initialForm = {competencyDate: '', dueDate: '', paymentDate: '', amount: '', subcategoryId: '', description: ''};
  const initialErrors = {competencyDate: '', dueDate: '', paymentDate: '', amount: '', subcategoryId: '', description: ''};
  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);
  const [localAccounts, setLocalAccounts] = useState(accounts ?? []);
  // Paginação
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

  // Função auxiliar para converter data (reutilizável)
  const converterDataParaISO = (dataValue) => {
    if (!dataValue) return null;
    try {
      if (typeof dataValue === 'string') {
        // Formato ISO: "2025-12-12T00:00:00.000Z"
        const datePart = dataValue.split('T')[0];
        if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
          return datePart;
        }
        // Tentar parsear como Date
        const date = new Date(dataValue);
        if (!isNaN(date.getTime())) {
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        }
      }
      if (dataValue instanceof Date && !isNaN(dataValue.getTime())) {
        return `${dataValue.getFullYear()}-${String(dataValue.getMonth() + 1).padStart(2, '0')}-${String(dataValue.getDate()).padStart(2, '0')}`;
      }
    } catch (e) {
      console.warn('[AccountsPayable] Erro ao converter data:', dataValue, e);
    }
    return null;
  };

  // Sincroniza prop accounts caso mude externamente
  useEffect(() => {
    if (Array.isArray(accounts)) {
      console.log('[AccountsPayable] 📥 Recebendo contas via prop:', accounts.length);
      if (accounts.length > 0) {
        console.log('[AccountsPayable] 📋 Primeira conta da prop:', accounts[0]);
        const today = new Date().toISOString().split('T')[0];
        
        const contasMapeadas = accounts.map(c => {
          const competencyDate = converterDataParaISO(c.competencia) || c.competencyDate || '';
          const dueDate = converterDataParaISO(c.vencimento) || c.dueDate || '';
          const paymentDate = c.dataPagamento ? converterDataParaISO(c.dataPagamento) : (c.paymentDate || null);
          
          let status = 'pending';
          if (c.status === 'PAGA' || paymentDate) {
            status = 'paid';
          } else if (dueDate && dueDate < today) {
            status = 'overdue';
          }
          
          return {
            id: String(c.id),
            competencyDate,
            dueDate,
            paymentDate,
            amount: Number(c.valor ?? c.amount ?? 0),
            categoryId: c.categoriaId ? String(c.categoriaId) : null,
            subcategoryId: c.subcategoriaId ? String(c.subcategoriaId) : null,
            description: c.descricao ?? c.description ?? '',
            status
          };
        });
        
        console.log('[AccountsPayable] ✅ Contas mapeadas da prop:', contasMapeadas.map(c => ({
          id: c.id,
          competencyDate: c.competencyDate || 'N/A',
          dueDate: c.dueDate || 'N/A'
        })));
        setLocalAccounts(contasMapeadas);
      } else {
        setLocalAccounts([]);
      }
    }
  }, [accounts]);

  // Carregar contas do backend quando houver fetchWithAuth/API_URL
  useEffect(() => {
    if (!fetchWithAuth || !API_URL) return;
    let mounted = true;

    async function loadContas() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedMonth) params.set('mes', String(selectedMonth));
        if (selectedYear) params.set('ano', String(selectedYear));
        params.set('tipoMovimento', 'SAIDA');
        if (unidadeId) params.set('unidadeId', String(unidadeId));

        const url = `${API_URL}/contas-financeiras?${params.toString()}`;
        console.debug('[AccountsPayable] GET', url);
        const res = await fetchWithAuth(url, { method: 'GET', credentials: 'include' });
        
        if (!res.ok) {
          console.warn('[AccountsPayable] resposta não OK', res.status);
          if (mounted) setLocalAccounts([]);
          return;
        }

        const body = await res.json().catch(() => null);
        const dados = body?.dados ?? body?.contas ?? body ?? [];
        const lista = Array.isArray(dados) ? dados : (Array.isArray(dados.dados) ? dados.dados : []);
        
        console.log('[AccountsPayable] ✅ Contas recebidas do backend:', lista.length);
        console.log('[AccountsPayable] 📋 Primeira conta (exemplo):', lista[0]);
        if (lista.length > 0) {
          console.log('[AccountsPayable] 📅 Datas da primeira conta:', {
            competencia: lista[0].competencia,
            vencimento: lista[0].vencimento,
            tipoCompetencia: typeof lista[0].competencia,
            tipoVencimento: typeof lista[0].vencimento
          });
        }
        
        if (mounted) {
          const today = new Date().toISOString().split('T')[0];
          
          const contasMapeadas = lista.map(c => {
            // Normalizar datas para formato ISO (YYYY-MM-DD)
            const competencyDate = converterDataParaISO(c.competencia) || '';
            const dueDate = converterDataParaISO(c.vencimento) || '';
            const paymentDate = c.dataPagamento ? converterDataParaISO(c.dataPagamento) : null;
            
            // Determinar status
            let status = 'pending';
            if (c.status === 'PAGA' || paymentDate) {
              status = 'paid';
            } else if (dueDate && dueDate < today) {
              status = 'overdue';
            }
            
            const contaMapeada = {
              id: String(c.id),
              competencyDate,
              dueDate,
              paymentDate,
              amount: Number(c.valor ?? c.amount ?? 0),
              categoryId: c.categoriaId ? String(c.categoriaId) : null,
              subcategoryId: c.subcategoriaId ? String(c.subcategoriaId) : null,
              description: c.descricao ?? c.description ?? '',
              status
            };
            
            // Log de erro se não tiver datas
            if (!competencyDate && !dueDate) {
              console.error('[AccountsPayable] ❌ ERRO: Conta sem datas mapeadas!', {
                id: contaMapeada.id,
                competenciaOriginal: c.competencia,
                vencimentoOriginal: c.vencimento,
                tipoCompetencia: typeof c.competencia,
                tipoVencimento: typeof c.vencimento
              });
            }
            
            return contaMapeada;
          });
          
          console.log('[AccountsPayable] ✅ Total de contas mapeadas:', contasMapeadas.length);
          console.log('[AccountsPayable] 📊 Resumo das contas:', contasMapeadas.map(c => ({
            id: c.id,
            competencyDate: c.competencyDate || 'N/A',
            dueDate: c.dueDate || 'N/A',
            status: c.status
          })));
          setLocalAccounts(contasMapeadas);
        }
      } catch (err) {
        console.error('[AccountsPayable] erro ao carregar contas:', err);
        if (mounted) setLocalAccounts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    try {
      fetchWithAuth.__loadContas = loadContas;
    } catch (e) { /* ignore */ }
    
    loadContas();
    return () => { mounted = false; };
  }, [fetchWithAuth, API_URL, selectedMonth, selectedYear]);

  const resetForm = () => {
    setFormData(initialForm);
    setFormErrors(initialErrors);
    setEditingAccount(null);
  };
  
  // Função para validar e normalizar datas
  const validarData = (dateString) => {
    if (!dateString) return null;
    
    // Remove espaços e caracteres estranhos
    const cleanDate = dateString.trim();
    if (!cleanDate) return null;
    
    // Tenta criar a data
    const date = new Date(cleanDate);
    
    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      return null;
    }
    
    // Verifica se a data está em um range válido (1900-2100)
    const year = date.getFullYear();
    if (year < 1900 || year > 2100) {
      return null;
    }
    
    // Retorna a data no formato ISO (YYYY-MM-DD)
    return date.toISOString().split('T')[0];
  };

  const handleAdd = async () => {
    if (isReadOnly) {
      notifyReadOnly();
      return;
    }
  // Validação inicial dos campos obrigatórios (inline + toast)
  const errors = {...initialErrors};
  if (!formData.competencyDate) errors.competencyDate = 'Data de Competência é obrigatória';
  if (!formData.dueDate) errors.dueDate = 'Data de Vencimento é obrigatória';
  if (!formData.amount || Number(formData.amount) <= 0) errors.amount = 'Valor é obrigatório';
  if (!formData.subcategoryId) errors.subcategoryId = 'Subcategoria é obrigatória';
  if (!formData.description) errors.description = 'Descrição é obrigatória';
    const hasErrors = Object.values(errors).some(v => v && v.length > 0);
    if (hasErrors) {
      setFormErrors(errors);
      toast({
        title: 'Campos obrigatórios',
      description: 'Preencha todos os campos obrigatórios antes de salvar.',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Validar datas antes de enviar
      const competenciaValidada = validarData(formData.competencyDate);
      const vencimentoValidado = validarData(formData.dueDate);
      const pagamentoValidado = formData.paymentDate ? validarData(formData.paymentDate) : null;

      // Mensagens de erro mais específicas e checagem de relação entre datas
      if (!vencimentoValidado) {
        setFormErrors(prev => ({ ...prev, dueDate: 'Data de vencimento inválida' }));
        toast({ title: 'Erro de validação', description: `Data de vencimento inválida: "${formData.dueDate}".`, variant: 'destructive' });
        return;
      }

      if (formData.competencyDate && !competenciaValidada) {
        setFormErrors(prev => ({ ...prev, competencyDate: 'Data de competência inválida' }));
        toast({ title: 'Erro de validação', description: `Data de competência inválida: "${formData.competencyDate}".`, variant: 'destructive' });
        return;
      }

      if (formData.paymentDate && !pagamentoValidado) {
        setFormErrors(prev => ({ ...prev, paymentDate: 'Data de pagamento inválida' }));
        toast({ title: 'Erro de validação', description: `Data de pagamento inválida: "${formData.paymentDate}".`, variant: 'destructive' });
        return;
      }

      // Garantir que a data de pagamento não seja anterior à data de competência
      if (pagamentoValidado && competenciaValidada) {
        const pay = new Date(pagamentoValidado);
        const comp = new Date(competenciaValidada);
        if (pay < comp) {
          setFormErrors(prev => ({ ...prev, paymentDate: 'Data de pagamento não pode ser anterior à data de competência' }));
          toast({ title: 'Erro de validação', description: 'Data de pagamento não pode ser anterior à data de competência.', variant: 'destructive' });
          console.error('[AccountsPayable] paymentDate < competencyDate', pagamentoValidado, competenciaValidada);
          return;
        }
      }

      const subcategory = categories
        .flatMap(cat => cat.subcategories)
        .find(sub => sub.id === formData.subcategoryId);
      
      const categoria = categories.find(cat => cat.subcategories.some(sub => sub.id === formData.subcategoryId));
      const contaData = {
        descricao: formData.description || '',
        tipoMovimento: 'SAIDA',
        categoriaId: categoria ? parseInt(categoria.id) : null,
        subcategoriaId: subcategory ? parseInt(formData.subcategoryId) : null,
        formaPagamento: 'DINHEIRO',
        valor: parseFloat(formData.amount),
        competencia: competenciaValidada,
        vencimento: vencimentoValidado,
        documento: '',
        observacao: formData.description || ''
      };

      if (pagamentoValidado) {
        contaData.dataPagamento = pagamentoValidado;
        contaData.status = 'PAGA';
      }
      
      // Log detalhado para debug
      console.debug('[AccountsPayable] Dados a enviar (CREATE):', {
        ...contaData,
        paymentDateOriginal: formData.paymentDate,
        pagamentoValidado,
        hasDataPagamento: !!contaData.dataPagamento
      });
      
      // Corrigir URL para usar o padrão correto (sem /api/ duplicado)
      const url = API_URL ? `${API_URL}contas-financeiras` : '/api/contas-financeiras';
      console.debug('[AccountsPayable] POST', url, contaData);
      
      if (!fetchWithAuth) {
        toast({
          title: "Erro de configuração",
          description: "Função de autenticação não disponível. Por favor, recarregue a página.",
          variant: "destructive",
        });
        console.error('[AccountsPayable] fetchWithAuth não está disponível');
        return;
      }

      const response = await fetchWithAuth(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(contaData),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Erro desconhecido');
        let errorMessage = 'Erro ao criar conta';
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.erro || errorJson.detalhes || errorJson.message || errorMessage;
        } catch {
          errorMessage = errorText || `Erro HTTP ${response.status}`;
        }

        toast({
          title: "Erro ao criar conta",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      const result = await response.json().catch(() => {
        console.error('[AccountsPayable] Erro ao parsear resposta JSON');
        toast({
          title: "Erro",
          description: "Erro ao processar resposta do servidor. Por favor, tente novamente.",
          variant: "destructive",
        });
        return { sucesso: false };
      });

      // Verificar se a conta foi criada com sucesso
      // O backend retorna { sucesso: true, dados: {...} } ou status 201
      if (result.sucesso || response.status === 201 || result.dados) {
        toast({ title: 'Sucesso!', description: 'Conta a pagar criada com sucesso.', variant: 'default' });

        // Recarregar dados do backend
        if (onRefresh) {
          // Aguardar um pouco para garantir que o backend processou
          setTimeout(async () => {
            await onRefresh('payable');
          }, 300);
        } else if (fetchWithAuth && typeof fetchWithAuth.__loadContas === 'function') {
          setTimeout(async () => {
            await fetchWithAuth.__loadContas();
          }, 300);
        } else {
          // Se não houver refresh, criar conta local com dados do backend
          const today = new Date().toISOString().split('T')[0];
          // Priorizar dados do backend, depois pagamento validado, depois formData
          const paymentDateFromBackend = result.dados?.dataPagamento ? converterDataParaISO(result.dados.dataPagamento) : null;
          const finalPaymentDate = paymentDateFromBackend || pagamentoValidado || (formData.paymentDate ? converterDataParaISO(formData.paymentDate) : null);
          const status = finalPaymentDate ? 'paid' : (vencimentoValidado && vencimentoValidado < today ? 'overdue' : 'pending');
          const newAccount = {
            id: result.dados?.id?.toString() || `temp-${Date.now()}`,
            competencyDate: competenciaValidada || (result.dados?.competencia ? converterDataParaISO(result.dados.competencia) : formData.competencyDate),
            dueDate: vencimentoValidado || (result.dados?.vencimento ? converterDataParaISO(result.dados.vencimento) : formData.dueDate),
            paymentDate: finalPaymentDate || null, // Garantir que seja null se não houver
            amount: parseFloat(result.dados?.valor || formData.amount),
            categoryId: result.dados?.categoriaId ? String(result.dados.categoriaId) : null,
            subcategoryId: formData.subcategoryId,
            description: result.dados?.descricao || formData.description,
            status
          };
          console.debug('[AccountsPayable] Nova conta criada:', { paymentDate: newAccount.paymentDate, finalPaymentDate, pagamentoValidado, paymentDateFromBackend });
          setLocalAccounts(prev => {
            const updated = [newAccount, ...prev];
            if (onAccountsChange) onAccountsChange(updated);
            return updated;
          });
        }
        setFormErrors({competencyDate: '',dueDate: '',paymentDate: '',amount: '',subcategoryId: ''});
        resetForm();
        setIsAddDialogOpen(false);
      } else {
        // Se não teve sucesso explícito, mostrar erro
        const errorMsg = result.erro || result.detalhes || result.message || 'Erro ao criar conta';
        toast({
          title: "Erro ao criar conta",
          description: errorMsg,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao criar conta:', error);
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
    
    // Converter paymentDate para formato YYYY-MM-DD se existir
    let paymentDateFormatted = '';
    if (account.paymentDate) {
      try {
        const date = new Date(account.paymentDate);
        if (!isNaN(date.getTime())) {
          paymentDateFormatted = date.toISOString().split('T')[0];
        } else {
          // Tentar converter de formato string
          const normalized = converterDataParaISO(account.paymentDate);
          if (normalized) {
            paymentDateFormatted = normalized;
          }
        }
      } catch (e) {
        console.warn('[AccountsPayable] Erro ao formatar paymentDate:', e);
      }
    }
    
    setFormData({
      competencyDate: account.competencyDate || '',
      dueDate: account.dueDate || '',
      paymentDate: paymentDateFormatted,
      amount: account.amount != null ? String(account.amount) : '',
      subcategoryId: subId ? String(subId) : '',
      description: account.description || '',
    });
    setFormErrors(initialErrors);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (isReadOnly) {
      notifyReadOnly();
      return;
    }
    if (!editingAccount || !formData.competencyDate || !formData.dueDate || !formData.amount || !formData.subcategoryId || !formData.description) {
      const errors = {...initialErrors};
      if (!formData.competencyDate) errors.competencyDate = 'Data de Competência é obrigatória';
      if (!formData.dueDate) errors.dueDate = 'Data de Vencimento é obrigatória';
      if (!formData.amount) errors.amount = 'Valor é obrigatório';
      if (!formData.subcategoryId) errors.subcategoryId = 'Subcategoria é obrigatória';
      if (!formData.description) errors.description = 'Descrição é obrigatória';
      setFormErrors(errors);
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos obrigatórios antes de salvar.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Validar datas antes de enviar
      const competenciaValidada = validarData(formData.competencyDate);
      const vencimentoValidado = validarData(formData.dueDate);
      const pagamentoValidado = formData.paymentDate ? validarData(formData.paymentDate) : null;

      if (!vencimentoValidado) {
        setFormErrors(prev => ({ ...prev, dueDate: 'Data de Vencimento inválida' }));
        toast({ title: "Erro", description: "Data de vencimento inválida. Por favor, verifique a data.", variant: "destructive" });
        return;
      }

      if (formData.competencyDate && !competenciaValidada) {
        setFormErrors(prev => ({ ...prev, competencyDate: 'Data de Competência inválida' }));
        toast({ title: "Erro", description: "Data de competência inválida. Por favor, verifique a data.", variant: "destructive" });
        return;
      }

      if (formData.paymentDate && !pagamentoValidado) {
        setFormErrors(prev => ({ ...prev, paymentDate: 'Data de pagamento inválida' }));
        toast({ title: "Erro", description: "Data de pagamento inválida. Por favor, verifique a data.", variant: "destructive" });
        return;
      }

      const subcategory = categories
        .flatMap(cat => cat.subcategories)
        .find(sub => sub.id === formData.subcategoryId);
      
      const categoria = categories.find(cat => cat.subcategories.some(sub => sub.id === formData.subcategoryId));
      
      const contaData = {
        descricao: formData.description || '',
        categoriaId: categoria ? parseInt(categoria.id) : null,
        subcategoriaId: subcategory ? parseInt(formData.subcategoryId) : null,
        formaPagamento: 'DINHEIRO',
        valor: parseFloat(formData.amount),
        competencia: competenciaValidada,
        vencimento: vencimentoValidado,
        documento: '',
        observacao: formData.description || ''
      };

      if (pagamentoValidado) {
        contaData.dataPagamento = pagamentoValidado;
        contaData.status = 'PAGA';
      } else if (formData.paymentDate && formData.paymentDate.trim() !== '') {
        // Se o usuário preencheu mas não passou na validação, tentar converter novamente
        const paymentDateRetry = validarData(formData.paymentDate);
        if (paymentDateRetry) {
          contaData.dataPagamento = paymentDateRetry;
          contaData.status = 'PAGA';
        }
      } else {
        // Se não há data de pagamento, remover o campo para não sobrescrever
        contaData.dataPagamento = null;
        // Não alterar status se não houver dataPagamento
        delete contaData.status;
      }
      
      // Log detalhado para debug
      console.debug('[AccountsPayable] Dados a enviar (UPDATE):', {
        ...contaData,
        paymentDateOriginal: formData.paymentDate,
        pagamentoValidado,
        hasDataPagamento: !!contaData.dataPagamento
      });

      const url = API_URL ? `${API_URL}contas-financeiras/${editingAccount.id}` : `/api/contas-financeiras/${editingAccount.id}`;
      console.debug('[AccountsPayable] PUT', url, contaData);
      
      const response = await fetchWithAuth(url, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(contaData),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.erro || result.detalhes || 'Erro ao atualizar conta';
        throw new Error(errorMessage);
      }

      if (result.sucesso) {
        toast({
          title: "Sucesso!",
          description: "Conta a pagar atualizada com sucesso.",
          variant: "default",
        });

        if (onRefresh) {
          // Aguardar um pouco para garantir que o backend processou
          setTimeout(async () => {
            await onRefresh('payable');
          }, 300);
        } else if (fetchWithAuth && typeof fetchWithAuth.__loadContas === 'function') {
          setTimeout(async () => {
            await fetchWithAuth.__loadContas();
          }, 300);
        } else {
          const today = new Date().toISOString().split('T')[0];
          const status = formData.paymentDate ? 'paid' : formData.dueDate < today ? 'overdue' : 'pending';
          const updatedAccount = {
            ...editingAccount,
            competencyDate: formData.competencyDate,
            dueDate: formData.dueDate,
            paymentDate: formData.paymentDate || undefined,
            amount: parseFloat(formData.amount),
            categoryId: result.dados?.categoriaId ? String(result.dados.categoriaId) : editingAccount.categoryId,
            subcategoryId: formData.subcategoryId,
            description: formData.description,
            status
          };
          setLocalAccounts(prev => {
            const updated = prev.map(acc => acc.id === editingAccount.id ? updatedAccount : acc);
            if (onAccountsChange) onAccountsChange(updated);
            return updated;
          });
        }
        resetForm();
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error('Erro ao atualizar conta:', error);
      const errorMessage = error.message || 'Erro ao atualizar conta. Tente novamente.';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
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
      console.debug('[AccountsPayable] DELETE', url);
      
      const response = await fetchWithAuth(url, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        const errorMessage = result.erro || result.detalhes || 'Erro ao deletar conta';
        throw new Error(errorMessage);
      }

      toast({
        title: "Sucesso!",
        description: "Conta a pagar deletada com sucesso.",
        variant: "default",
      });

      if (onRefresh) {
        await onRefresh('payable');
      } else if (fetchWithAuth && typeof fetchWithAuth.__loadContas === 'function') {
        await fetchWithAuth.__loadContas();
      } else {
        setLocalAccounts(prev => {
          const updated = prev.filter(acc => acc.id !== deleteTargetId);
          if (onAccountsChange) onAccountsChange(updated);
          return updated;
        });
      }
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      const errorMessage = error.message || 'Erro ao deletar conta. Tente novamente.';
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
        headers.forEach((header, index) => {row[header] = values[index] || '';});
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
        if (inQuotes && line[i + 1] === '"') { current += '"';i += 2;}// Aspas escapadas
        else {inQuotes = !inQuotes;i++;}// Alternar estado das aspas
      } else if (char === ',' && !inQuotes) {
        // Vírgula separadora fora das aspas
        result.push(current.trim());
        current = '';
        i++;
      } else {current += char;i++;}
    }

    result.push(current.trim());
    return result;
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return '';
    // Remove aspas se existirem
    const cleanDateStr = dateStr.replace(/"/g, '').trim();
    const formats = [// Tenta vários formatos de data
      /^(\d{2})\/(\d{2})\/(\d{4})$/, // DD/MM/YYYY
      /^(\d{4})-(\d{2})-(\d{2})$/, // YYYY-MM-DD
      /^(\d{2})-(\d{2})-(\d{4})$/, // DD-MM-YYYY
    ];

    for (const format of formats) {
      const match = cleanDateStr.match(format);
      if (match) {
        if (format === formats[1]) {return `${match[1]}-${match[2]}-${match[3]}`;}// YYYY-MM-DD
        else {return `${match[3]}-${match[2]}-${match[1]}`;}// DD/MM/YYYY ou DD-MM-YYYY
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
    for (const category of categories) {if (category.type === 'saida') {for (const subcategory of category.subcategories) {if (subcategory.name.toLowerCase() === cleanName.toLowerCase()) {return subcategory.id;}}}}

    // Se não encontrou, verifica se é uma categoria principal
    for (const category of categories) {if (category.type === 'saida') {if (category.name.toLowerCase() === cleanName.toLowerCase()) {if (category.subcategories.length > 0) {return category.subcategories[0].id;}}}} // Retorna a primeira subcategoria da categoria

    return null;
  };

  const handleImportCSV = async () => {
    if (!importFile) return;
    const text = await importFile.text();
    const rows = parseCSV(text);
    if (rows.length === 0) {setImportProgress({show: true,processed: 0,total: 0,errors: ['Arquivo CSV vazio ou formato inválido'],imported: 0});return;}

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

        // Calcular status
        const today = new Date().toISOString().split('T')[0];
        const status = paymentDate ? 'paid' : dueDate < today ? 'overdue' : 'pending';

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

      } catch (error) {errors.push(`Linha ${lineNum}: Erro ao processar dados - ${error}`);}
      setImportProgress(prev => ({...prev,processed: i + 1,imported: newAccounts.length}));
    }

    // Adicionar contas válidas
    if (newAccounts.length > 0) {onAccountsChange([...accounts, ...newAccounts]);}
    setImportProgress(prev => ({...prev,errors,imported: newAccounts.length}));
    // Mostrar toast resumo da importação
    if (errors.length > 0) {
      toast({ title: 'Import concluída com erros', description: `${newAccounts.length} importadas, ${errors.length} erros. Veja detalhes no painel de importação.`, variant: 'destructive' });
    } else {
      toast({ title: 'Import concluída', description: `${newAccounts.length} contas importadas com sucesso.`, variant: 'default' });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setImportFile(file);
      setImportProgress({ show: false, processed: 0, total: 0, errors: [], imported: 0 });
    }
  };
  const formatCurrency = (value) => {
    const num = Number(value ?? 0);
    if (isNaN(num) || !isFinite(num)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(num);
  };
  const formatDate = (dateString) => {return new Date(dateString).toLocaleDateString('pt-BR');};
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid': return <Badge className="bg-green-100 text-green-800">Pago</Badge>;
      case 'overdue': return <Badge className="bg-red-100 text-red-800">Vencido</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      default: return <Badge>-</Badge>;
    }
  };

  // Opções para os selects de filtro
  const months = [ { value: '1', label: 'Janeiro' }, { value: '2', label: 'Fevereiro' },{ value: '3', label: 'Março' }, { value: '4', label: 'Abril' },{ value: '5', label: 'Maio' }, { value: '6', label: 'Junho' }, { value: '7', label: 'Julho' }, { value: '8', label: 'Agosto' }, { value: '9', label: 'Setembro' }, { value: '10', label: 'Outubro' }, { value: '11', label: 'Novembro' }, { value: '12', label: 'Dezembro' }];

  // Filtrar contas baseado no período selecionado
  const filteredAccounts = useMemo(() => {
    console.log('[AccountsPayable] 🔍 Iniciando filtro...', {
      totalContas: localAccounts?.length || 0,
      mes: selectedMonth,
      ano: selectedYear
    });
    
    if (!localAccounts || localAccounts.length === 0) {
      console.log('[AccountsPayable] ⚠️ Nenhuma conta local para filtrar');
      return [];
    }
    
    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);
    
    console.log('[AccountsPayable] 📊 Contas antes do filtro:', localAccounts.map(acc => ({
      id: acc.id,
      competencyDate: acc.competencyDate || 'N/A',
      dueDate: acc.dueDate || 'N/A'
    })));
    
    const filtered = localAccounts.filter(acc => {
      // Usar competencyDate como critério principal, fallback para dueDate
      const dateToCheck = acc.competencyDate || acc.dueDate;
      
      if (!dateToCheck) {
        console.warn('[AccountsPayable] ⚠️ Conta sem data:', acc.id);
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
              console.log('[AccountsPayable] ✅ Conta passou no filtro:', {
                id: acc.id,
                date: dateToCheck,
                accountYear,
                accountMonth,
                filterYear: year,
                filterMonth: month
              });
            } else {
              console.log('[AccountsPayable] ❌ Conta fora do período:', {
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
            console.log('[AccountsPayable] ✅ Conta passou no filtro (Date):', {
              id: acc.id,
              accountYear,
              accountMonth
            });
          }
          
          return matches;
        }
        
        console.warn('[AccountsPayable] ⚠️ Data inválida:', dateToCheck, acc.id);
        return false;
      } catch (error) {
        console.error('[AccountsPayable] ❌ Erro ao filtrar conta:', error, acc);
        return false;
      }
    });
    
    console.log('[AccountsPayable] ✅ Resultado do filtro:', {
      filtradas: filtered.length,
      total: localAccounts.length,
      filtradasIds: filtered.map(acc => acc.id),
      filtradasDetalhes: filtered.map(acc => ({
        id: acc.id,
        competencyDate: acc.competencyDate,
        dueDate: acc.dueDate
      }))
    });
    
    return filtered;
  }, [localAccounts, selectedMonth, selectedYear]);

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

  // Paginação
  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredAccounts.length / perPage)), [filteredAccounts.length, perPage]);
  const paginatedAccounts = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredAccounts.slice(start, start + perPage);
  }, [filteredAccounts, page, perPage]);

  // Resetar página quando filtros mudarem
  useEffect(() => {
    setPage(1);
  }, [selectedMonth, selectedYear, perPage]);

  // Garantir que a página atual seja válida
  useEffect(() => {
    setPage(p => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const exitCategories = categories.filter(cat => cat.type === 'saida');
  const totalPending = filteredAccounts.filter(acc => acc.status === 'pending').reduce((sum, acc) => {
    const amount = Number(acc.amount) || 0;
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  const totalOverdue = filteredAccounts.filter(acc => acc.status === 'overdue').reduce((sum, acc) => {
    const amount = Number(acc.amount) || 0;
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  const totalPaid = filteredAccounts.filter(acc => acc.status === 'paid').reduce((sum, acc) => {
    const amount = Number(acc.amount) || 0;
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  const resetImport = () => {setImportFile(null);setImportProgress({ show: false, processed: 0, total: 0, errors: [], imported: 0 });};
  const getSelectedMonthName = () => {const monthObj = months.find(m => m.value === selectedMonth);return monthObj ? monthObj.label : '';};

  // Função para exportar CSV do backend
  const exportarCSVBackend = async () => {
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
      params.set('tipoMovimento', 'SAIDA');

      // Verificar se API_URL já termina com / e ajustar
      const baseUrl = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
      const url = `${baseUrl}contas-financeiras/exportar/csv?${params.toString()}`;
      console.debug('[AccountsPayable] GET CSV', url);
      console.debug('[AccountsPayable] Token disponível:', !!fetchWithAuth);
      
      const response = await fetchWithAuth(url, { 
        method: 'GET', 
        credentials: 'include',
        headers: {
          'Accept': 'text/csv, application/json',
        }
      });

      if (!response.ok) {
        let errorText = '';
        try {
          errorText = await response.text();
          // Tentar parsear como JSON
          try {
            const errorJson = JSON.parse(errorText);
            errorText = errorJson.mensagem || errorJson.erro || errorJson.message || errorText;
          } catch {
            // Não é JSON, usar texto direto
          }
        } catch {
          errorText = `Erro HTTP ${response.status}`;
        }
        console.error('[AccountsPayable] Erro ao exportar CSV:', response.status, errorText);
        
        toast({
          title: "Erro ao exportar CSV",
          description: errorText || `Erro HTTP ${response.status}`,
          variant: "destructive",
        });
        return;
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      const urlBlob = URL.createObjectURL(blob);
      
      // Tentar obter o nome do arquivo do header Content-Disposition
      const contentDisposition = response.headers.get('Content-Disposition');
      const monthName = getSelectedMonthName().replace(/\s+/g, '-').toLowerCase().trim();
      let filename = `despesas_${monthName}_${selectedYear}_${new Date().getTime()}.csv`.trim();
      
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
      console.error('[AccountsPayable] Erro ao exportar CSV do backend:', error);
      toast({
        title: "Erro ao exportar CSV",
        description: "Erro ao exportar do servidor. Tente novamente.",
        variant: "destructive",
      });
    }
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
            <p className="text-xs text-muted-foreground">{filteredAccounts.filter(acc => acc.status === 'pending').length} contas</p>
          </CardContent>
        </Card>
        <Card className={"gap-4 h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
            <CardTitle className="text-sm">Total Vencido</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-red-600">{formatCurrency(totalOverdue)}</div>
            <p className="text-xs text-muted-foreground">{filteredAccounts.filter(acc => acc.status === 'overdue').length} contas</p>
          </CardContent>
        </Card>
        <Card className={"gap-4 h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm">Total Pago</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-green-600">{formatCurrency(totalPaid)}</div>
            <p className="text-xs text-muted-foreground">{filteredAccounts.filter(acc => acc.status === 'paid').length} contas</p>
          </CardContent>
        </Card>
        <Card className={"gap-4 h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm ">Total Geral</CardTitle>
            <FileText className="h-4 w-4 " />
          </CardHeader>
          <CardContent>
            <div className="">{formatCurrency(totalPending + totalOverdue + totalPaid)}</div>
            <p className="text-xs text-muted-foreground">{filteredAccounts.length} contas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros de Período */}
      <Card className={"gap-10"}>
        <div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 open-sans" />Filtro de Período</CardTitle>
            <CardDescription>Selecione o mês e ano para filtrar as contas a pagar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label>Mês</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger id="month-filter"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {months.map(month => (<SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ano</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger id="year-filter"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {availableYears.filter(y => !isNaN(y) && isFinite(y)).map(year => (
                      <SelectItem key={year} value={String(year)}>
                        {String(year)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={exportarCSVBackend}
                >
                  <Download className="h-4 w-4" />Exportar CSV
                </Button>
                {/* <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2"><Upload className="h-4 w-4" />Importar CSV</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2"><Upload className="h-5 w-5" />Importar Contas a Pagar via CSV</DialogTitle>
                      <DialogDescription>Faça upload de um arquivo CSV com as colunas: Emissão, Vencimento, Pagamento, Valor, Categoria, Obs</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="csv-file">Arquivo CSV</Label>
                        <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} className="mt-2"/>
                      </div>
                      {importFile && (
                        <Alert>
                          <FileText className="h-4 w-4" />
                          <AlertDescription>Arquivo selecionado: {importFile.name} ({(importFile.size / 1024).toFixed(1)} KB)</AlertDescription>
                        </Alert>
                      )}
                      {importProgress.show && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Processando...</span>
                            <span>{importProgress.processed} de {importProgress.total}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(importProgress.processed / importProgress.total) * 100}%` }}/>
                          </div>
                          <div className="text-sm text-green-600">{importProgress.imported} contas importadas com sucesso</div>
                        </div>
                      )}
                      {importProgress.errors.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-red-600">Erros encontrados ({importProgress.errors.length}):</span>
                          </div>
                          <div className="max-h-32 overflow-y-auto bg-red-50 p-2 rounded text-sm">
                            {importProgress.errors.map((error, index) => (<div key={index} className="text-red-600">{error}</div>))}
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
                      <Button variant="outline" onClick={resetImport}>Cancelar</Button>
                      <Button onClick={handleImportCSV} disabled={!importFile || importProgress.show}>Importar</Button>
                    </div>
                  </DialogContent>
                </Dialog> */}
                <Dialog open={isAddDialogOpen} onOpenChange={(open) => { 
                  if (open) {
                    if (isReadOnly) return;
                    setFormErrors(initialErrors);
                  } else {
                    resetForm();
                  }
                  setIsAddDialogOpen(open); 
                }}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2" disabled={isReadOnly}><Plus className="h-4 w-4" />Nova Conta</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Nova Conta a Pagar</DialogTitle>
                      <DialogDescription>Adicione uma nova conta a pagar ao sistema</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className={"pb-3"}>Data de Competência</Label>
                          <Input id="competency-date" type="date" value={formData.competencyDate} onChange={(e) => { setFormData({ ...formData, competencyDate: e.target.value }); setFormErrors(prev => ({ ...prev, competencyDate: '' })); }} className={formErrors.competencyDate ? 'border-destructive' : ''} />
                          {formErrors.competencyDate && (<p className="text-sm text-destructive mt-2">Data de Competência é obrigatório</p>)}
                        </div>
                        <div>
                          <Label className={"pb-3"}>Data de Vencimento</Label>
                          <Input id="due-date" type="date" value={formData.dueDate} onChange={(e) => { setFormData({ ...formData, dueDate: e.target.value }); setFormErrors(prev => ({ ...prev, dueDate: '' })); }} className={formErrors.dueDate ? 'border-destructive' : ''} />
                          {formErrors.dueDate && (<p className="text-sm text-destructive mt-2">Data de Vencimento é obrigatório</p>)}
                        </div>
                      </div>
                      <div>
                        <Label className={"pb-3"}>Data de Pagamento (opcional)</Label>
                        <Input id="payment-date" type="date" value={formData.paymentDate} onChange={(e) => { setFormData({ ...formData, paymentDate: e.target.value }); setFormErrors(prev => ({ ...prev, paymentDate: '' })); }} className={formErrors.paymentDate ? 'border-destructive' : ''} />
                        {formErrors.paymentDate && (<p className="text-sm text-destructive mt-2">{formErrors.paymentDate}</p>)}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className={"pb-3"}>Valor</Label>
                          <Input id="amount" type="number" step="0.01" placeholder="0,00" value={formData.amount} onChange={(e) => { setFormData({ ...formData, amount: e.target.value }); setFormErrors(prev => ({ ...prev, amount: '' })); }} className={formErrors.amount ? 'border-destructive' : ''} />
                          {formErrors.amount && (<p className="text-sm text-destructive mt-2">Valor é obrigatório</p>)}
                        </div>
                        <div>
                          <Label className={"pb-3"}>Subcategoria</Label>
                          <Select value={formData.subcategoryId} onValueChange={(value) => { setFormData({ ...formData, subcategoryId: value }); setFormErrors(prev => ({ ...prev, subcategoryId: '' })); }}>
                            <SelectTrigger className={formErrors.subcategoryId ? 'border-destructive' : ''}><SelectValue placeholder="Selecione uma subcategoria" /></SelectTrigger>
                            <SelectContent className="max-h-[200px] overflow-auto">
                              {exitCategories.map(category => (
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
                          {formErrors.subcategoryId && (<p className="text-sm text-destructive mt-2">Subcategoria é obrigatório</p>)}
                        </div>
                      </div>
                      <div>
                        <Label className={"pb-3"}>Descrição</Label>
                        <Textarea id="description" placeholder="Descrição da conta a pagar" value={formData.description} onChange={(e) => { setFormData({ ...formData, description: e.target.value }); setFormErrors(prev => ({ ...prev, description: '' })); }}/>
                        {formErrors.description && (<p className="text-sm text-destructive mt-2">{formErrors.description}</p>)}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>Cancelar</Button>
                      <Button onClick={handleAdd}>Adicionar</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <p>Exibindo contas de <strong>{getSelectedMonthName()} de {selectedYear}</strong></p>
            </div>
          </CardContent>
        </div>
        <div>
          <CardHeader>
            <CardTitle>Lista de Contas/Despesas</CardTitle>
            <CardDescription>Todas as despesas cadastradas</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando contas...
              </div>
            ) : (
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
                    {paginatedAccounts.length > 0 ? (
                      paginatedAccounts.map(account => (
                        <TableRow key={account.id}>
                          <TableCell>{account.competencyDate ? formatDate(account.competencyDate) : '-'}</TableCell>
                          <TableCell>{account.dueDate ? formatDate(account.dueDate) : '-'}</TableCell>
                          <TableCell>{account.paymentDate ? formatDate(account.paymentDate) : '-'}</TableCell>
                          <TableCell>{formatCurrency(account.amount)}</TableCell>
                          <TableCell className="max-w-xs truncate">{getSubcategoryName(account.subcategoryId, account.categoryId)}</TableCell>
                          <TableCell className="max-w-xs truncate">{account.description || '-'}</TableCell>
                          <TableCell>{getStatusBadge(account.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(account)} disabled={isReadOnly}><Edit className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(account.id)} disabled={isReadOnly}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          {localAccounts.length === 0 ? (
                            'Nenhuma conta cadastrada. Clique em "Nova Conta" para adicionar uma conta a pagar.'
                          ) : (
                            <div className="space-y-2">
                              <p>Nenhuma conta encontrada para <strong>{getSelectedMonthName()} de {selectedYear}</strong>.</p>
                              <p className="text-xs">Total de contas no sistema: <strong>{localAccounts.length}</strong></p>
                              <div className="text-xs text-muted-foreground mt-2">
                                <p>Dica: Verifique se as datas de competência ou vencimento das contas estão no mês/ano selecionado.</p>
                                <p className="mt-1">Contas disponíveis:</p>
                                <ul className="list-disc list-inside mt-1">
                                  {localAccounts.slice(0, 5).map(acc => (
                                    <li key={acc.id}>
                                      ID: {acc.id} - 
                                      Competência: {acc.competencyDate || 'N/A'} - 
                                      Vencimento: {acc.dueDate || 'N/A'}
                                    </li>
                                  ))}
                                  {localAccounts.length > 5 && <li>... e mais {localAccounts.length - 5} contas</li>}
                                </ul>
                              </div>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                {filteredAccounts.length > 0 && (
                  <CardFooter className="flex items-center justify-between px-4 py-3 border-t border-neutral-800">
                    <div className="flex items-center gap-3">
                      <Label className="text-sm font-medium">Linhas por pág.</Label>
                      <Select value={String(perPage)} onValueChange={(value) => { const v = Number(value); setPerPage(v); setPage(1); }}>
                        <SelectTrigger className="w-[70px]">
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
                      <div className="inline-flex items-center gap-1 border-l border-neutral-800 pl-3">
                        <Button variant="ghost" size="sm" onClick={() => setPage(1)} disabled={page === 1} aria-label="Primeira página">
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} aria-label="Página anterior">
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
                )}
              </div>
            )}
          </CardContent>
        </div>
      </Card>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          resetForm();
        } else {
          setFormErrors(initialErrors);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Conta a Pagar</DialogTitle>
            <DialogDescription>Modifique os dados da conta a pagar</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-competency-date">Data de Competência</Label>
                <Input id="edit-competency-date" type="date" value={formData.competencyDate} onChange={(e) => { setFormData({ ...formData, competencyDate: e.target.value }); setFormErrors(prev => ({ ...prev, competencyDate: '' })); }} className={formErrors.competencyDate ? 'border-destructive' : ''}/>
                {formErrors.competencyDate && <p className="text-sm text-destructive mt-1">{formErrors.competencyDate}</p>}
              </div>
              <div>
                <Label htmlFor="edit-due-date">Data de Vencimento</Label>
                <Input id="edit-due-date" type="date" value={formData.dueDate} onChange={(e) => { setFormData({ ...formData, dueDate: e.target.value }); setFormErrors(prev => ({ ...prev, dueDate: '' })); }} className={formErrors.dueDate ? 'border-destructive' : ''}/>
                {formErrors.dueDate && <p className="text-sm text-destructive mt-1">{formErrors.dueDate}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="edit-payment-date">Data de Pagamento (opcional)</Label>
              <Input id="edit-payment-date" type="date" value={formData.paymentDate} onChange={(e) => { setFormData({ ...formData, paymentDate: e.target.value }); setFormErrors(prev => ({ ...prev, paymentDate: '' })); }} className={formErrors.paymentDate ? 'border-destructive' : ''}/>
              {formErrors.paymentDate && <p className="text-sm text-destructive mt-1">{formErrors.paymentDate}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-amount">Valor</Label>
                <Input id="edit-amount" type="number" step="0.01" placeholder="0,00" value={formData.amount} onChange={(e) => { setFormData({ ...formData, amount: e.target.value }); setFormErrors(prev => ({ ...prev, amount: '' })); }} className={formErrors.amount ? 'border-destructive' : ''}/>
                {formErrors.amount && <p className="text-sm text-destructive mt-1">{formErrors.amount}</p>}
              </div>
              <div>
                <Label>Subcategoria</Label>
                <Select value={formData.subcategoryId} onValueChange={(value) => { setFormData({ ...formData, subcategoryId: value }); setFormErrors(prev => ({ ...prev, subcategoryId: '' })); }}>
                  <SelectTrigger className={formErrors.subcategoryId ? 'border-destructive' : ''}><SelectValue placeholder="Selecione uma subcategoria" /></SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-auto">
                    {exitCategories.map(category => (
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
                {formErrors.subcategoryId && <p className="text-sm text-destructive mt-1">{formErrors.subcategoryId}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea id="edit-description" placeholder="Descrição da conta a pagar" value={formData.description} onChange={(e) => { setFormData({ ...formData, description: e.target.value }); setFormErrors(prev => ({ ...prev, description: '' })); }}/>
              {formErrors.description && <p className="text-sm text-destructive mt-1">{formErrors.description}</p>}
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