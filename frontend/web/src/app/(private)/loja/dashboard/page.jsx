"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";
import { usePerfilProtegido } from '@/hooks/usePerfilProtegido';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Users, DollarSign, Box, ShoppingCart, Clock, Truck } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast';

const StatCard = ({ icon: Icon, value, label, delta }) => (
  <Card className="p-0 h-full">
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-2xl font-semibold">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="p-2 bg-muted/40 rounded-md">
            <Icon className="w-6 h-6 text-muted-foreground" />
          </div>
          {delta && <Badge variant="secondary">{delta}</Badge>}
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function DashboardLoja() {
  const { fetchWithAuth, user } = useAuth();
  const { toast } = useToast();
  usePerfilProtegido("GERENTE_LOJA");

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    vendasHoje: 0,
    faturamentoHoje: 0,
    itensEstoque: 0,
    funcionariosAtivos: 0,
    saldoFinal: 0,
  });
  const [alerts, setAlerts] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [pagamentos, setPagamentos] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [range, setRange] = useState("7");

  const currency = (v) => Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const makeUrl = (path) => {
    const base = (API_URL || '').replace(/\/+$/, '');
    return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const fetchJson = useCallback(async (path, opts = {}) => {
    const url = makeUrl(path);
    const merged = { credentials: 'include', headers: { 'Content-Type': 'application/json' }, ...opts };
    try {
      const resp = typeof fetchWithAuth === 'function' ? await fetchWithAuth(url, merged) : await fetch(url, merged);
      if (!resp) throw new Error('Sem resposta do servidor');
      if (resp.status === 401 || resp.status === 403) {
        toast({ title: 'Sessão expirada', description: 'Faça login novamente.', variant: 'destructive' });
        if (typeof window !== 'undefined') window.location.href = '/login';
        return null;
      }
      const contentType = resp.headers?.get ? resp.headers.get('content-type') || '' : '';
      const body = contentType.includes('application/json') ? await resp.json() : await resp.text();
      if (!resp.ok) {
        const erro = typeof body === 'string' ? body : body?.erro || `HTTP ${resp.status}`;
        throw new Error(erro);
      }
      return body;
    } catch (error) {
      console.warn('[dashboard] fetchJson falhou', { path, error });
      toast({ title: 'Erro ao buscar dados', description: error?.message || 'Falha na requisição.', variant: 'destructive' });
      return null;
    }
  }, [fetchWithAuth, toast]);

  const loadDashboard = useCallback(async () => {
    const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
    if (!unidadeId) { setLoading(false); return; }
    setLoading(true);
    try {
      const resumo = await fetchJson(`/loja/dashboard/resumo/${unidadeId}`);
      if (!resumo || resumo.sucesso === false) {
        toast({ title: 'Falha ao carregar dados', description: resumo?.erro || 'Sem resposta do servidor.', variant: 'destructive' });
        setLoading(false);
        return;
      }

      const s = resumo.stats || {};
      setStats({
        vendasHoje: s.vendasHoje ?? 0,
        faturamentoHoje: s.faturamentoHoje ?? 0,
        itensEstoque: s.itensEstoque ?? 0,
        funcionariosAtivos: s.funcionariosAtivos ?? 0,
        saldoFinal: s.saldoFinal ?? 0,
      });

      setPagamentos(resumo.pagamentos || null);
      setRecentSales(resumo.recentSales || []);
      setChartData(resumo.barData || []);
      setAlerts(resumo.alerts || []);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      toast({ title: 'Erro ao carregar dashboard', description: error.message || 'Falha ao buscar dados.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [fetchJson, toast, user]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const statCards = useMemo(() => ([
    { icon: ShoppingCart, value: loading ? '...' : stats.vendasHoje, label: 'Vendas hoje' },
    { icon: DollarSign, value: loading ? '...' : `R$ ${currency(stats.faturamentoHoje)}`, label: 'Faturamento (hoje)' },
    { icon: Box, value: loading ? '...' : stats.itensEstoque, label: 'Itens em estoque' },
    { icon: Users, value: loading ? '...' : stats.funcionariosAtivos, label: 'Funcionários ativos' },
  ]), [loading, stats]);

  const formatDateTime = (value) => {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  };

  const barPrepared = useMemo(() => {
    const data = Array.isArray(chartData) ? chartData : [];
    const limited = range === "7" ? data.slice(-7) : data.slice(-15);
    return limited.map((item) => ({
      month: item.label || item.month || item.data || "",
      total: Number(item.valor ?? item.total ?? 0),
    }));
  }, [chartData, range]);

  const ChartBarLoja = () => (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Vendas por período</CardTitle>
          <CardDescription>Visão desta loja (7d ou 15d)</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant={range === "7" ? "default" : "outline"} size="sm" onClick={() => setRange("7")}>
            Últimos 7 dias
          </Button>
          <Button variant={range === "15" ? "default" : "outline"} size="sm" onClick={() => setRange("15")}>
            Últimos 15 dias
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-80 overflow-hidden">
        <ChartContainer config={{ total: { label: "Total", color: "#738C16" } }} className="h-full w-full">
          <BarChart accessibilityLayer data={barPrepared} margin={{ top: 5, right: 10, left: 0, bottom: 50 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} angle={-45} textAnchor="end" interval={0}/>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel formatter={(value) => currency(value)} />}/>
            <Bar dataKey="total" fill="var(--color-total, #738C16)" radius={8} />
          </BarChart>
        </ChartContainer>
        {loading && <div className="text-sm text-muted-foreground mt-2">Carregando...</div>}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-12 py-8 bg-surface-50">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((s, i) => (
            <StatCard key={i} icon={s.icon} value={s.value} label={s.label} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ChartBarLoja />

            <Card>
              <CardHeader>
                <CardTitle>Últimas Vendas</CardTitle>
                <CardDescription>Transações recentes na loja</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {loading ? (
                    <li className="text-sm text-muted-foreground">Carregando vendas...</li>
                  ) : recentSales.length === 0 ? (
                    <li className="text-sm text-muted-foreground">Nenhuma venda encontrada.</li>
                  ) : (
                    recentSales.map((sale) => (
                      <li key={sale.id} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Venda #{sale.id} — {sale.nomeCliente ?? sale.customer ?? sale.cliente ?? 'Cliente'}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDateTime(sale.data ?? sale.date ?? sale.createdAt ?? sale.criadoEm)} • {sale.itens ?? sale.items ?? sale.quantidade ?? '—'} itens
                          </div>
                        </div>
                        <div className="font-semibold">R$ {currency(sale.total ?? sale.valor ?? sale.total_venda ?? 0)}</div>
                      </li>
                    ))
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alertas</CardTitle>
                <CardDescription>Eventos que precisam de atenção</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-sm text-muted-foreground">Carregando...</div>
                ) : alerts.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Nenhum alerta no momento.</div>
                ) : (
                  <ul className="space-y-3">
                    {alerts.map((a) => {
                      // Support different icon types: React element, component, or undefined
                      if (React.isValidElement(a.icon)) {
                        return (
                          <li key={a.id} className="flex items-center gap-3 text-sm">
                            {React.cloneElement(a.icon, { className: "w-4 h-4 text-muted-foreground" })}
                            <span>{a.text}</span>
                          </li>
                        );
                      }

                      const Icon = typeof a.icon === "function" ? a.icon : Clock;
                      return (
                        <li key={a.id} className="flex items-center gap-3 text-sm">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <span>{a.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumo de Caixa</CardTitle>
                <CardDescription>Saldo atual, entradas e saídas rápidas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {/* <div className="flex justify-between"><div className="text-sm">Saldo atual</div><div className="font-semibold">R$ {currency(stats.saldoFinal)}</div></div> */}
                  <div className="flex justify-between"><div className="text-sm">Entradas (hoje)</div><div className="font-semibold">R$ {currency(stats.faturamentoHoje)}</div></div>
                  <div className="flex justify-between"><div className="text-sm">Transações (hoje)</div><div className="font-semibold">{stats.vendasHoje}</div></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Links rápidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  <a href="/loja/estoque" className="rounded-md p-3 bg-muted/5 hover:bg-muted/10 flex items-center justify-between">Estoque</a>
                  <a href="/loja/fornecedores" className="rounded-md p-3 bg-muted/5 hover:bg-muted/10 flex items-center justify-between">Fornecedores</a>
                  <a href="/loja/frenteCaixa" className="rounded-md p-3 bg-muted/5 hover:bg-muted/10 flex items-center justify-between">Frente de Caixa</a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-6" />


      </div>
    </div>
  )
}