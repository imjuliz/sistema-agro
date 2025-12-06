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
import { Calculator, CreditCard, Wallet, TrendingUp, TrendingDown, BarChart3, Calendar, Filter, Loader } from "lucide-react";
import { usePerfilProtegido } from "@/hooks/usePerfilProtegido";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";

// para tradução
import { useTranslation } from "@/hooks/useTranslation";
import { Transl } from "@/components/TextoTraduzido/TextoTraduzido";

export default function FinancasMatriz() {
  usePerfilProtegido("GERENTE_MATRIZ");
  const { fetchWithAuth } = useAuth();
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

  // Handlers placeholders (podem ser substituídos por implementações reais)
  const handleCategoriesChange = (next) => setCategories(next);
  const handleAccountsPayableChange = (next) => setAccountsPayable(next);
  const handleAccountsReceivableChange = (next) => setAccountsReceivable(next);
  const fetchCategoriasPost = async () => {
    try {
      const url = `http://localhost:8080/categorias`;
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {error && (<div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>)}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2"><BarChart3 className="h-4 w-4" />Dashboard</TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2"><Calculator className="h-4 w-4" />Categorias</TabsTrigger>
            <TabsTrigger value="payable" className="flex items-center gap-2"><CreditCard className="h-4 w-4" />Despesas</TabsTrigger>
            <TabsTrigger value="receivable" className="flex items-center gap-2"><Wallet className="h-4 w-4" />Receitas</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="space-y-6"> {/* Filtro de Período */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5" />Filtro de Período</CardTitle>
                <CardDescription> Selecione o mês e ano para visualizar os dados específicos do período</CardDescription>
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
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />Exibindo dados de{" "}
                  <strong>{getSelectedMonthName()} de {selectedYear}</strong>
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
                  <p className="text-xs text-muted-foreground">{dashboardStats.receivablePendingCount} contas pendentes</p>
                    </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">A Pagar</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-red-600">{formatCurrency(dashboardStats.totalPayable)}</div>
                  <p className="text-xs text-muted-foreground">{dashboardStats.payablePendingCount} contas pendentes</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Recebido</CardTitle>
                  <Wallet className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-green-600">{formatCurrency(dashboardStats.totalReceived)}</div>
                  <p className="text-xs text-muted-foreground">{dashboardStats.receivedCount} contas recebidas</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Pago</CardTitle>
                  <CreditCard className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-red-600">{formatCurrency(dashboardStats.totalPaid)}</div>
                  <p className="text-xs text-muted-foreground">{dashboardStats.paidCount} contas pagas</p>
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
                  <CardDescription>{getSelectedMonthName()} de {selectedYear} - Baseado nascontas do período</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total de Receitas</span>
                      <span className="text-green-600">{formatCurrency(dashboardStats.totalReceived +dashboardStats.totalReceivable)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total de Despesas</span>
                      <span className="text-red-600">{formatCurrency(dashboardStats.totalPaid + dashboardStats.totalPayable)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span>Resultado do Período</span>
                      <span className={dashboardStats.totalReceived + dashboardStats.totalReceivable -(dashboardStats.totalPaid + dashboardStats.totalPayable) >= 0 ? "text-green-600" : "text-red-600"}>{formatCurrency(dashboardStats.totalReceived + dashboardStats.totalReceivable -(dashboardStats.totalPaid + dashboardStats.totalPayable))}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Pendências Líquidas</span>
                        <span className={dashboardStats.totalReceivable - dashboardStats.totalPayable >=0 ? "text-green-600" : "text-red-600"}>{formatCurrency(dashboardStats.totalReceivable - dashboardStats.totalPayable)}
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
                  <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-green-600" />Contas a Receber - {getSelectedMonthName()}/{selectedYear}</CardTitle>
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
                        <div className="text-green-600">{formatCurrency(dashboardStats.totalReceived + dashboardStats.totalReceivable)}</div>
                        <div className="text-xs text-muted-foreground">{dashboardStats.receivedCount + dashboardStats.receivablePendingCount}{" "}contas</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><TrendingDown className="h-5 w-5 text-red-600" />Contas a Pagar - {getSelectedMonthName()}/{selectedYear}</CardTitle>
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
                        <div className="text-red-600">{formatCurrency(dashboardStats.totalPaid + dashboardStats.totalPayable)}</div>
                        <div className="text-xs text-muted-foreground">{dashboardStats.paidCount + dashboardStats.payablePendingCount}contas</div>
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
            ) : (<AccountsPayable accounts={accountsPayable} categories={categories} onAccountsChange={handleAccountsPayableChange} fetchWithAuth={fetchWithAuth} API_URL="" onRefresh={fetchContas}/>)}
          </TabsContent>
          <TabsContent value="receivable">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader className="h-8 w-8 animate-spin" /><span className="ml-2">Carregando contas a receber...</span>
              </div>
            ) : (<AccountsReceivable accounts={accountsReceivable} categories={categories} onAccountsChange={handleAccountsReceivableChange} fetchWithAuth={fetchWithAuth} API_URL="" onRefresh={fetchContas}/>)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
