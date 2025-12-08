"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryManager } from "@/components/Financeiro/CategoryManager";
import { AccountsPayable } from "@/components/Financeiro/AccountsPayable";
import { AccountsReceivable } from "@/components/Financeiro/AccountsReceivable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, CreditCard, Wallet, TrendingUp, TrendingDown, BarChart3, Calendar, Filter, Loader, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { usePerfilProtegido } from "@/hooks/usePerfilProtegido";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";

// para tradução
import { useTranslation } from "@/hooks/useTranslation";
import { Transl } from "@/components/TextoTraduzido/TextoTraduzido";

export default function FinancasMatriz() {
  usePerfilProtegido("GERENTE_MATRIZ");
  const { fetchWithAuth, accessToken } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [accountsPayable, setAccountsPayable] = useState([]);
  const [accountsReceivable, setAccountsReceivable] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({totalReceivable: 0,totalPayable: 0,totalReceived: 0,totalPaid: 0,receivablePendingCount: 0,payablePendingCount: 0,receivedCount: 0,paidCount: 0,});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState((currentDate.getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());

  const fetchCategorias = async () => {
    try {
      const url = `${API_URL}categorias`;
      console.debug("[fetchCategorias] GET", url);
      const res = await fetchWithAuth(url, {method: "GET",credentials: "include",headers: {Accept: "application/json","Content-Type": "application/json",},});
      console.debug("[fetchCategorias] status:", res.status);

      if (res.status === 401) {console.warn("[fetchCategorias] 401 — não autorizado");setCategories([]);return;}
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        console.warn(
          "[fetchCategorias] resposta não OK",
          res.status,
          t.slice ? t.slice(0, 300) : t
        );
        setCategories([]);
        return;
      }

      const body = await res.json().catch(() => null);
      console.debug("[fetchCategorias] body:", body);

      const lista = body?.dados ?? (Array.isArray(body) ? body : body?.categorias ?? []);

      if (!Array.isArray(lista)) {setCategories([]);return;}

      const categoriasComSubcategorias = await Promise.all(
        lista.map(async (categoria) => {
          if (!categoria || !categoria.id) return null;
          try {
            const subUrl = `${API_URL}categorias/${categoria.id}/subcategorias`;
            const subRes = await fetchWithAuth(subUrl, {method: "GET",credentials: "include",headers: {Accept: "application/json",Authorization: `Bearer ${localStorage.getItem("accessToken")}`,},});
            const subBody = await subRes.json().catch(() => null);
            const subs = subBody?.dados ?? (Array.isArray(subBody) ? subBody : []);
            return {
              id: String(categoria.id),
              name: categoria.nome || categoria.title || "",
              type: categoria.tipo === "ENTRADA" ? "entrada" : "saida",
              subcategories: Array.isArray(subs) ? subs.map((s) => ({id: String(s.id),name: s.nome || s.title || "",categoryId: String(categoria.id),})) : [],
              financeiros: Array.isArray(categoria.financeiros) ? categoria.financeiros.map((f) => ({
                id: String(f.id),
                descricao: f.descricao || '',
                valor: Number(f.valor) || 0,
                vencimento: f.vencimento ? new Date(f.vencimento).toISOString() : null,
                status: f.status || 'PENDENTE',
                tipoMovimento: f.tipoMovimento || categoria.tipo,
                subcategoriaId: f.subcategoriaId ? String(f.subcategoriaId) : null,
                subcategoria: f.subcategoria ? { id: String(f.subcategoria.id), nome: f.subcategoria.nome } : null
              })) : [],
            };
          } catch (err) {
            console.warn("[fetchCategorias] falha ao buscar subcategorias",err);
            return {id: String(categoria.id),name: categoria.nome || "",type: categoria.tipo === "ENTRADA" ? "entrada" : "saida",subcategories: [],};
          }
        })
      );
      setCategories(categoriasComSubcategorias.filter(Boolean));
    } catch (err) {
      console.error("[fetchCategorias] erro:", err);
      setError("Erro ao carregar categorias");
      setCategories([]);
    }
  };

  // Busca contas (tipo: 'payable' | 'receivable')
  const fetchContas = async (tipo) => {
    try {
      const tipoParam = tipo === "payable" ? "pagar" : "receber";
      const url = `${API_URL}financeiro/contas?tipo=${tipoParam}&mes=${selectedMonth}&ano=${selectedYear}`;
      console.debug("[fetchContas] GET", url);
      const res = await fetchWithAuth(url, { method: "GET", credentials: "include", headers: {Accept: "application/json",},});
      console.debug("[fetchContas] status:", res.status);
      if (res.status === 401) { console.warn("[fetchContas] 401 — não autorizado");
        if (tipo === "payable") setAccountsPayable([]);
        else setAccountsReceivable([]);
        return;
      }
      if (!res.ok) { const t = await res.text().catch(() => "");
        console.warn("[fetchContas] resposta não OK", res.status, t.slice ? t.slice(0, 300) : t);
        if (tipo === "payable") setAccountsPayable([]);
        else setAccountsReceivable([]);
        return;
      }
      const body = await res.json().catch(() => null);
      console.debug("[fetchContas] body:", body);
      const contas = body?.dados ?? body?.contas ?? (Array.isArray(body) ? body : []);
      if (tipo === "payable") setAccountsPayable(Array.isArray(contas) ? contas : []);
      else setAccountsReceivable(Array.isArray(contas) ? contas : []);
    } catch (err) {
      console.error("[fetchContas] erro", err);
      if (tipo === "payable") setAccountsPayable([]);
      else setAccountsReceivable([]);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const url = `${API_URL}financeiro/dashboard`;
      console.debug("[fetchDashboardStats] GET", url);
      const res = await fetchWithAuth(url, {method: "GET",credentials: "include",headers: {Accept: "application/json"}});
      console.debug("[fetchDashboardStats] status:", res.status);

      if (res.status === 401) {
        console.warn("[fetchDashboardStats] 401 — não autorizado");
        setDashboardStats({totalReceivable: 0,totalPayable: 0,totalReceived: 0,totalPaid: 0,receivablePendingCount: 0,payablePendingCount: 0,receivedCount: 0,paidCount: 0,});
        return;
      }

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        console.warn(
          "[fetchDashboardStats] resposta não OK",
          res.status,
          t.slice ? t.slice(0, 300) : t
        );
        return;}
      const body = await res.json().catch(() => null);
      console.debug("[fetchDashboardStats] body:", body);
      // possíveis formatos de resposta: {dados: {...}} ou {...} ou lista
      const statsObj = body?.dados ?? (typeof body === "object" ? body : {});
      // Normaliza chaves que usamos
      const normalized = {
        totalReceivable: Number( statsObj.totalReceivable ?? statsObj.totalRecebimentos ?? statsObj.totalReceivable ?? 0),
        totalPayable: Number( statsObj.totalPayable ?? statsObj.totalPagamentos ?? statsObj.totalPayable ?? 0),
        totalReceived: Number(statsObj.totalReceived ?? statsObj.recebido ?? 0),
        totalPaid: Number(statsObj.totalPaid ?? statsObj.pago ?? 0),
        receivablePendingCount: Number(statsObj.receivablePendingCount ?? statsObj.recebiveisPendentes ?? 0),
        payablePendingCount: Number(statsObj.payablePendingCount ?? statsObj.pendenciasPagaveis ?? 0),
        receivedCount: Number(statsObj.receivedCount ?? statsObj.recebidos ?? 0),
        paidCount: Number(statsObj.paidCount ?? statsObj.pagos ?? 0),
      };

      setDashboardStats((prev) => ({ ...prev, ...normalized }));
    } catch (err) {console.error("[fetchDashboardStats] erro", err);}
  };

  // UseEffect agrupando buscas do dashboard (baseado no seu exemplo)
  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      if (!mounted) return;
      setLoading(true);
      try {
        // Executa buscas em paralelo quando possível
        await Promise.all([fetchCategorias(),fetchContas("payable"),fetchContas("receivable"),fetchDashboardStats(),]);
      } catch (err) {console.error("Erro ao carregar dados do financeiro:", err);if (mounted) setError("Erro ao carregar dados do financeiro");}
      finally { if (mounted) setLoading(false); }
    }
    fetchAll();
    return () => { mounted = false; };
  }, [fetchWithAuth, selectedMonth, selectedYear]);

  // Helpers mínimos usados na UI (se já existirem em outra parte remova/ajuste)
  const months = useMemo( () => [ { value: "1", label: "Janeiro" }, { value: "2", label: "Fevereiro" }, { value: "3", label: "Março" }, { value: "4", label: "Abril" }, { value: "5", label: "Maio" }, { value: "6", label: "Junho" }, { value: "7", label: "Julho" }, { value: "8", label: "Agosto" }, { value: "9", label: "Setembro" }, { value: "10", label: "Outubro" }, { value: "11", label: "Novembro" },{ value: "12", label: "Dezembro" },],[]);

  const years = useMemo(() => {const y = new Date().getFullYear();return [y - 1, y, y + 1];}, []);
  const getSelectedMonthName = () => {const found = months.find((m) => m.value === String(selectedMonth));return found ? found.label : String(selectedMonth);};
  const formatCurrency = (v) => {
    const n = Number(v ?? 0);
    if (isNaN(n) || !isFinite(n)) return 'R$ 0,00';
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  // Função auxiliar para verificar se uma conta está no mês selecionado
  const isInSelectedMonth = (dateString, month, year) => {
    if (!dateString) return false;
    try {
      // Se for string no formato YYYY-MM-DD, extrair diretamente
      if (typeof dateString === 'string') {
        const dateMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (dateMatch) {
          const [, yearStr, monthStr] = dateMatch;
          return parseInt(yearStr) === parseInt(year) && parseInt(monthStr) === parseInt(month);
        }
      }
      // Tentar parsear como Date
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return false;
      return date.getMonth() + 1 === parseInt(month) && date.getFullYear() === parseInt(year);
    } catch {
      return false;
    }
  };

  // Calcular valores baseados nas contas do mês selecionado
  const calculatedStats = useMemo(() => {
    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);

    // Filtrar contas a pagar do mês selecionado (baseado na data de competência)
    const payableInMonth = accountsPayable.filter(acc => {
      const competencyDate = acc.competencia || acc.competencyDate;
      return isInSelectedMonth(competencyDate, month, year);
    });

    // Filtrar contas a receber do mês selecionado (baseado na data de competência)
    const receivableInMonth = accountsReceivable.filter(acc => {
      const competencyDate = acc.competencia || acc.competencyDate;
      return isInSelectedMonth(competencyDate, month, year);
    });

    // Calcular contas a pagar - PENDENTES (sem data de pagamento)
    const payablePending = payableInMonth
      .filter(acc => {
        const status = acc.status || acc.statusPagamento || '';
        const hasPaymentDate = acc.dataPagamento || acc.paymentDate;
        return (!hasPaymentDate && (status === 'PENDENTE' || status === 'pending' || status === '')) || 
               (!hasPaymentDate && status !== 'PAGA' && status !== 'paid');
      })
      .reduce((sum, acc) => sum + (Number(acc.valor || acc.amount || 0)), 0);

    // Calcular contas a pagar - PAGAS (com data de pagamento)
    const payablePaid = payableInMonth
      .filter(acc => {
        const status = acc.status || acc.statusPagamento || '';
        const hasPaymentDate = acc.dataPagamento || acc.paymentDate;
        return hasPaymentDate || status === 'PAGA' || status === 'paid';
      })
      .reduce((sum, acc) => sum + (Number(acc.valor || acc.amount || 0)), 0);

    const payablePendingCount = payableInMonth.filter(acc => {
      const status = acc.status || acc.statusPagamento || '';
      const hasPaymentDate = acc.dataPagamento || acc.paymentDate;
      return (!hasPaymentDate && (status === 'PENDENTE' || status === 'pending' || status === '')) || 
             (!hasPaymentDate && status !== 'PAGA' && status !== 'paid');
    }).length;

    const payablePaidCount = payableInMonth.filter(acc => {
      const status = acc.status || acc.statusPagamento || '';
      const hasPaymentDate = acc.dataPagamento || acc.paymentDate;
      return hasPaymentDate || status === 'PAGA' || status === 'paid';
    }).length;

    // Calcular contas a receber (todas são consideradas recebidas no mês, pois já foram registradas)
    const receivedTotal = receivableInMonth
      .reduce((sum, acc) => sum + (Number(acc.valor || acc.amount || 0)), 0);

    const receivedCount = receivableInMonth.length;

    return {
      totalPayablePending: payablePending,
      totalPaid: payablePaid,
      payablePendingCount,
      paidCount: payablePaidCount,
      totalReceived: receivedTotal,
      receivedCount,
      totalReceitas: receivedTotal,
      totalDespesas: payablePaid + payablePending,
    };
  }, [accountsPayable, accountsReceivable, selectedMonth, selectedYear]);

  // Funções de exportação
  const exportarDashboardCSV = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedMonth) params.set('mes', String(selectedMonth));
      if (selectedYear) params.set('ano', String(selectedYear));

      if (!fetchWithAuth) {
        toast({
          title: "Erro de configuração",
          description: "Função de autenticação não disponível. Por favor, recarregue a página.",
          variant: "destructive",
        });
        return;
      }

      const url = `${API_URL}financeiro/dashboard/exportar/csv?${params.toString()}`;
      console.debug('[exportarDashboardCSV] URL:', url);
      console.debug('[exportarDashboardCSV] Token disponível:', !!accessToken);
      
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
        console.error('[exportarDashboardCSV] Erro:', response.status, errorText);
        
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
      
      const contentDisposition = response.headers.get('Content-Disposition');
      const monthName = getSelectedMonthName().replace(/\s+/g, '-').toLowerCase().trim();
      let filename = `dashboard_financeiro_${monthName}_${selectedYear}_${new Date().getTime()}.csv`;
      
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
        description: `Arquivo "${filename}" baixado com sucesso.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Erro ao exportar dashboard CSV:', error);
      toast({
        title: "Erro ao exportar CSV",
        description: "Erro ao exportar do servidor. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const exportarDashboardPDF = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedMonth) params.set('mes', String(selectedMonth));
      if (selectedYear) params.set('ano', String(selectedYear));

      if (!fetchWithAuth) {
        toast({
          title: "Erro de configuração",
          description: "Função de autenticação não disponível. Por favor, recarregue a página.",
          variant: "destructive",
        });
        return;
      }

      const url = `${API_URL}financeiro/dashboard/exportar/pdf?${params.toString()}`;
      console.debug('[exportarDashboardPDF] URL:', url);
      console.debug('[exportarDashboardPDF] Token disponível:', !!accessToken);
      
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
        console.error('[exportarDashboardPDF] Erro:', response.status, errorText);
        
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
      let filename = `dashboard_financeiro_${monthName}_${selectedYear}_${new Date().getTime()}.pdf`;
      
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
      console.error('Erro ao exportar dashboard PDF:', error);
      toast({
        title: "Erro ao exportar PDF",
        description: "Erro ao exportar do servidor. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Handlers placeholders (podem ser substituídos por implementações reais)
  const handleCategoriesChange = (next) => setCategories(next);
  const handleAccountsPayableChange = (next) => setAccountsPayable(next);
  const handleAccountsReceivableChange = (next) => setAccountsReceivable(next);
  const fetchCategoriasPost = async () => {
    try {
      const url = `${API_URL}categorias`;
      console.log("Buscando categorias em:", url);
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type": "application/json",Authorization: `Bearer ${localStorage.getItem("accessToken")}`,},
        body: {unidadeId: Number(unidadeId),nome,tipo,descricao,},
      });
      console.log("Resposta categorias:", response.status, response.statusText);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro ao buscar categorias:", response.status, errorText);
        throw new Error(`Erro ao buscar categorias: ${response.status} - ${errorText}`);
      }
      const result = await response.json();
      console.log("Resultado categorias:", result);
    } catch (error) {
      console.error("Erro ao buscar categorias:", err);
      setError("Erro ao carregar categorias");
    }
  };

  return (
    <div className="min-h-screen px-18 py-10 bg-surface-50">
      <div className="">
        {error && (<div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>)}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2"><BarChart3 className="h-4 w-4" />Dashboard</TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2"><Calculator className="h-4 w-4" />Categorias</TabsTrigger>
            <TabsTrigger value="payable" className="flex items-center gap-2"><CreditCard className="h-4 w-4" />Despesas</TabsTrigger>
            <TabsTrigger value="receivable" className="flex items-center gap-2"><Wallet className="h-4 w-4" />Receitas</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="space-y-6"> {/* Filtro de Período */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5" />Filtro de Período</CardTitle>
                <CardDescription>Selecione o mês e ano para visualizar os dados específicos do período</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="month-select">Mês</Label>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger id="month-select"><SelectValue /></SelectTrigger>
                      <SelectContent>{months.map((month) => (<SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year-select">Ano</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger id="year-select"><SelectValue /></SelectTrigger>
                      <SelectContent>{years.map((year) => (<SelectItem key={year} value={year.toString()}>{year}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />Exibindo dados de{" "}
                    <strong>{getSelectedMonthName()} de {selectedYear}</strong>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={exportarDashboardCSV}
                    >
                      <Download className="h-4 w-4" />Exportar CSV
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={exportarDashboardPDF}
                    >
                      <FileText className="h-4 w-4" />Exportar PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">A Pagar</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-red-600">{formatCurrency(calculatedStats.totalPayablePending)}</div>
                  <p className="text-xs text-muted-foreground">{calculatedStats.payablePendingCount} contas pendentes</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Recebido</CardTitle>
                  <Wallet className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-green-600">{formatCurrency(calculatedStats.totalReceived)}</div>
                  <p className="text-xs text-muted-foreground">{calculatedStats.receivedCount} contas recebidas</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Pago</CardTitle>
                  <CreditCard className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-red-600">{formatCurrency(calculatedStats.totalPaid)}</div>
                  <p className="text-xs text-muted-foreground">{calculatedStats.paidCount} contas pagas</p>
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
                      <Badge className="bg-green-100 text-green-800">{categories.filter((cat) => cat.type === "entrada") .length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Categorias de Saída</span>
                      <Badge className="bg-red-100 text-red-800">{categories.filter((cat) => cat.type === "saida").length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total de Subcategorias</span>
                      <Badge>{categories.reduce((sum, cat) => sum + cat.subcategories.length, 0)}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Período</CardTitle>
                  <CardDescription>{getSelectedMonthName()} de {selectedYear} - Baseado nas contas do período</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total de Receitas</span>
                      <span className="text-green-600">{formatCurrency(calculatedStats.totalReceitas)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total de Despesas</span>
                      <span className="text-red-600">{formatCurrency(calculatedStats.totalDespesas)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span>Resultado do Período</span>
                      <span className={calculatedStats.totalReceitas - calculatedStats.totalDespesas >= 0 ? "text-green-600" : "text-red-600"}>{formatCurrency(calculatedStats.totalReceitas - calculatedStats.totalDespesas)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Resumo de Movimentações por Status */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><TrendingDown className="h-5 w-5 text-red-600" />Contas a Pagar - {getSelectedMonthName()}/{selectedYear}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Pagas</span>
                      <div className="text-right">
                        <div className="text-red-600">{formatCurrency(calculatedStats.totalPaid)}</div>
                        <div className="text-xs text-muted-foreground">{calculatedStats.paidCount} contas</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pendentes</span>
                      <div className="text-right">
                        <div className="text-orange-600">{formatCurrency(calculatedStats.totalPayablePending)}</div>
                        <div className="text-xs text-muted-foreground">{calculatedStats.payablePendingCount} contas</div>
                      </div>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span>Total do Período</span>
                      <div className="text-right">
                        <div className="text-red-600">{formatCurrency(calculatedStats.totalPaid + calculatedStats.totalPayablePending)}</div>
                        <div className="text-xs text-muted-foreground">{calculatedStats.paidCount + calculatedStats.payablePendingCount} contas</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="categories">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader className="h-8 w-8 animate-spin" /><span className="ml-2">Carregando categorias...</span>
              </div>
            ) : (<CategoryManager categories={categories} onCategoriesChange={handleCategoriesChange} fetchWithAuth={fetchWithAuth} API_URL="" onRefresh={fetchCategorias}/>)}
          </TabsContent>
          <TabsContent value="payable">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader className="h-8 w-8 animate-spin" /><span className="ml-2">Carregando contas a pagar...</span>
              </div>
            ) : (<AccountsPayable accounts={accountsPayable} categories={categories} onAccountsChange={handleAccountsPayableChange} fetchWithAuth={fetchWithAuth} API_URL={API_URL} onRefresh={fetchContas}/>)}
          </TabsContent>
          <TabsContent value="receivable">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader className="h-8 w-8 animate-spin" /><span className="ml-2">Carregando contas a receber...</span>
              </div>
            ) : (<AccountsReceivable accounts={accountsReceivable} categories={categories} onAccountsChange={handleAccountsReceivableChange} fetchWithAuth={fetchWithAuth} API_URL={API_URL} onRefresh={fetchContas}/>)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
