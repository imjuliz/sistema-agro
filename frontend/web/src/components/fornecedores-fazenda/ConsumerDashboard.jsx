'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCatalog } from './ProductCatalog';
// import { OrderManagement } from './OrderManagement';
import { ChatInterface } from './ChatInterface';
import { ComplaintSystem } from './ComplaintSystem';
import { ShoppingCart, MessageSquare, AlertTriangle, Search, TrendingUp, Clock, CheckCircle, FileCheck } from 'lucide-react';
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Card, CardContent, CardAction, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import FornecedoresCard from './fornecedores-card';
import { OrderManagement } from './OrderManagement';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/lib/api';

export function ConsumerDashboard({ unidadeId: unidadeIdProp = null }) {
  const { user, fetchWithAuth } = useAuth();
  const unidadeId = unidadeIdProp ?? user?.unidadeId ?? user?.unidade?.id ?? null;

  // fornecedores externos para passar ao card
  const [fornecedoresExternos, setFornecedoresExternos] = useState([]);
  const [carregandoFornecedores, setCarregandoFornecedores] = useState(false);
  const [fornecedorError, setFornecedorError] = useState(null);
  const [contratosExternos, setContratosExternos] = useState([]);
  const [pedidosExternos, setPedidosExternos] = useState([]);

  useEffect(() => {
    if (!unidadeId) return;
    const loadFornecedores = async () => {
      setCarregandoFornecedores(true);
      setFornecedorError(null);
      try {
        console.log('[ConsumerDashboard] Buscando contratos externos para unidadeId:', unidadeId);
        
        // 1) Busca contratos externos da unidade (PRIORIDADE TOTAL)
        const cRes = await fetchWithAuth(`${API_URL}verContratosExternos/${unidadeId}`, { 
          method: 'GET', 
          credentials: 'include' 
        });
        
        if (!cRes.ok) {
          throw new Error(`Erro HTTP ${cRes.status} ao buscar contratos`);
        }
        
        const cBody = await cRes.json().catch(() => ({}));
        const contratosArray = Array.isArray(cBody.contratosExternos) ? cBody.contratosExternos : 
                               Array.isArray(cBody.contratos) ? cBody.contratos : [];
        
        console.log('[ConsumerDashboard] Contratos externos recebidos:', contratosArray.length, contratosArray);
        setContratosExternos(contratosArray);

        // 2) Extrai fornecedores ÚNICOS dos contratos (fonte única)
        const fornecedoresFromContratos = contratosArray
          .map(c => c.fornecedorExterno)
          .filter(f => f && typeof f.id !== 'undefined')
          .reduce((acc, f) => {
            if (!acc.find(x => x.id === f.id)) acc.push(f);
            return acc;
          }, []);

        console.log('[ConsumerDashboard] Fornecedores extraídos dos contratos:', fornecedoresFromContratos.length, fornecedoresFromContratos);

        // 3) Normaliza fornecedores para o formato esperado pelo FornecedoresCard
        let normalized = fornecedoresFromContratos.map(f => ({
          ...f,
          id: f.id ?? f.ID ?? null,
          name: f.nomeEmpresa || f.nome || `Fornecedor ${f.id}`,
          status: (f.status && (String(f.status).toUpperCase() === 'ATIVO' || String(f.status).toUpperCase() === 'ATIVA')) ? 'Ativa' : 'Ativa',
          products: f.produtosCount ?? f.produtos ?? 0,
          category: f.categoria || f.tipo || 'Geral'
        }));

        // fallback: se não há fornecedores nos contratos, tentar endpoint específico
        if (normalized.length === 0) {
          try {
            console.log('[ConsumerDashboard] Nenhum fornecedor em contratos — tentando listarFornecedoresExternos fallback');
            const fRes = await fetchWithAuth(`${API_URL}listarFornecedoresExternos/${unidadeId}`, { method: 'GET', credentials: 'include' });
            if (fRes.ok) {
              const fBody = await fRes.json().catch(() => ({}));
              const fData = Array.isArray(fBody.fornecedores) ? fBody.fornecedores : (Array.isArray(fBody) ? fBody : []);
              normalized = fData.map(f => ({
                ...f,
                id: f.id ?? f.ID ?? null,
                name: f.nomeEmpresa || f.nome || `Fornecedor ${f.id}`,
                status: (f.status && (String(f.status).toUpperCase() === 'ATIVO' || String(f.status).toUpperCase() === 'ATIVA')) ? 'Ativa' : 'Ativa',
                products: f.produtosCount ?? f.produtos ?? 0,
                category: f.categoria || f.tipo || 'Geral'
              }));
            }
          } catch (e) {
            console.warn('[ConsumerDashboard] Fallback listarFornecedoresExternos falhou:', e?.message ?? e);
          }
        }

        console.log('[ConsumerDashboard] Fornecedores normalizados:', normalized.length, normalized);
        setFornecedoresExternos(normalized);

        // 4) Buscar pedidos relacionados (opcional)
        try {
          const pRes = await fetchWithAuth(`${API_URL}pedidos-externos/${unidadeId}`, { 
            method: 'GET', 
            credentials: 'include' 
          });
          if (pRes.ok) {
            const pBody = await pRes.json().catch(() => ({}));
            const pedidosArray = Array.isArray(pBody.pedidos) ? pBody.pedidos : [];
            console.log('[ConsumerDashboard] Pedidos externos recebidos:', pedidosArray.length, pedidosArray);
            setPedidosExternos(pedidosArray);
          }
        } catch (e) {
          console.warn('[ConsumerDashboard] Aviso ao buscar pedidos:', e?.message);
        }
      } catch (err) {
        console.error('[ConsumerDashboard] Erro carregando fornecedores externos:', err);
        setFornecedorError(String(err?.message ?? err));
        setFornecedoresExternos([]);
      } finally {
        setCarregandoFornecedores(false);
      }
    };
    loadFornecedores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unidadeId]);

  const StatCard = ({ title, value, icon: Icon, color = 'text-muted-foreground' }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">{title}</p>
            <p className={`text-2xl ${color}`}>{value}</p>
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 flex flex-col gap-12">
      {/* cards / kpis / indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:@xl/main:grid-cols-2 @5xl/main:grid-cols-4 mb-0">
        <Card className="h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition">
          <CardHeader>
            <CardDescription>Contratos Ativos</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              7
            </CardTitle>
            <CardAction>
              <FileCheck />
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition">
          <CardHeader>
            <CardDescription>Contratos pendentes</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              3
            </CardTitle>
            <CardAction>
              <Clock />
            </CardAction>
          </CardHeader>
         
        </Card>
        <Card className="h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition">
          <CardHeader>
            <CardDescription>NÃO SEI O QUE COLOCAR AQUI</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              24
            </CardTitle>
            <CardAction>
              <CheckCircle />
            </CardAction>
          </CardHeader>
        </Card>
      </div>

      {/* card de fornecedores */}
      <FornecedoresCard fornecedores={fornecedoresExternos} contratos={contratosExternos} pedidos={pedidosExternos} carregando={carregandoFornecedores} />

      {/* Tabs: Contratos como consumidor / Contratos como Fornecedor */}
      <Tabs defaultValue="consumidor" className="bg-card p-4 rounded-lg">
        <TabsList>
          <TabsTrigger value="consumidor">Contratos como consumidor</TabsTrigger>
          <TabsTrigger value="fornecedor">Contratos como Fornecedor</TabsTrigger>
        </TabsList>

        <TabsContent value="consumidor" className="mt-4">
          <ContratosComoConsumidor />
        </TabsContent>

        <TabsContent value="fornecedor" className="mt-4">
          <ContratosComoFornecedor />
        </TabsContent>
      </Tabs>

      {/* produtos */}
      <ProductCatalog />
      {/* produtos */}
      <OrderManagement pedidos={pedidosExternos} />
      
    </div>
  );
}

function ContratosComoConsumidor() {
  const { user, fetchWithAuth } = useAuth();
  const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contratos, setContratos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    if (!unidadeId) return;
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const cRes = await fetchWithAuth(`${API_URL}verContratosExternos/${unidadeId}`, { method: 'GET', credentials: 'include' });
        const cBody = await cRes.json().catch(() => ({}));
        const cData = cBody.contratosExternos ?? cBody.contratos ?? [];
        const contratosArray = Array.isArray(cData) ? cData : [];
        setContratos(contratosArray);

        // Extrai fornecedores externos únicos diretamente dos contratos (prioridade)
        const fornecedoresFromContratos = contratosArray
          .map(c => c.fornecedorExterno)
          .filter(f => f && (typeof f.id !== 'undefined'))
          .reduce((acc, f) => {
            if (!acc.find(x => x.id === f.id)) acc.push(f);
            return acc;
          }, []);

        if (fornecedoresFromContratos.length > 0) {
          setFornecedores(fornecedoresFromContratos);
        } else {
          // fallback: chama endpoint específico caso os contratos não retornem fornecedor direto
          const fRes = await fetchWithAuth(`${API_URL}listarFornecedoresExternos/${unidadeId}`, { method: 'GET', credentials: 'include' });
          const fBody = await fRes.json().catch(() => ({}));
          const fData = fBody.fornecedores ?? [];
          setFornecedores(Array.isArray(fData) ? fData : []);
        }

        const pRes = await fetchWithAuth(`${API_URL}estoque-produtos/pedidos-origem/${unidadeId}`, { method: 'GET', credentials: 'include' });
        const pBody = await pRes.json().catch(() => ({}));
        const pData = pBody.pedidos ?? [];
        setPedidos(Array.isArray(pData) ? pData : []);
      } catch (err) {
        console.error('Erro ao carregar dados consumidor:', err);
        setError(String(err?.message ?? err));
      } finally { setLoading(false); }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unidadeId]);

  if (!unidadeId) return <div className="p-4">Unidade não identificada na sessão.</div>;
  if (loading) return <div className="p-4">Carregando dados...</div>;
  if (error) return <div className="p-4 text-destructive">Erro: {error}</div>;

  return (
    <div className="space-y-6 flex flex-col gap-12">
      {/* cards / kpis / indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:@xl/main:grid-cols-2 @5xl/main:grid-cols-4 mb-0">
        <Card className="h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition">
          <CardHeader>
            <CardDescription>Contratos Ativos</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              7
            </CardTitle>
            <CardAction>
              <FileCheck />
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition">
          <CardHeader>
            <CardDescription>Contratos pendentes</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              3
            </CardTitle>
            <CardAction>
              <Clock />
            </CardAction>
          </CardHeader>
         
        </Card>
        <Card className="h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition">
          <CardHeader>
            <CardDescription>NÃO SEI O QUE COLOCAR AQUI</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              24
            </CardTitle>
            <CardAction>
              <CheckCircle />
            </CardAction>
          </CardHeader>
        </Card>
      </div>

      {/* card de fornecedores */}
      <FornecedoresCard fornecedores={fornecedoresExternos} contratos={contratosExternos} pedidos={pedidosExternos} carregando={carregandoFornecedores} />

      <OrderManagement pedidos={pedidosExternos} />
      
    </div>
  );
}

function ContratosComoFornecedor() {
  const { user, fetchWithAuth } = useAuth();
  const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contratos, setContratos] = useState([]);
  const [fornecedoras, setFornecedoras] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    if (!unidadeId) return;
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const cRes = await fetchWithAuth(`${API_URL}verContratosComLojas/${unidadeId}`, { method: 'GET', credentials: 'include' });
        const cBody = await cRes.json().catch(() => ({}));
        const cData = cBody.contratos ?? [];
        setContratos(Array.isArray(cData) ? cData : []);

        const fRes = await fetchWithAuth(`${API_URL}listarFornecedoresInternos/${unidadeId}`, { method: 'GET', credentials: 'include' });
        const fBody = await fRes.json().catch(() => ({}));
        const fData = fBody.fornecedores ?? [];
        setFornecedoras(Array.isArray(fData) ? fData : []);

        const pRes = await fetchWithAuth(`${API_URL}estoque-produtos/pedidos/${unidadeId}`, { method: 'GET', credentials: 'include' });
        const pBody = await pRes.json().catch(() => ({}));
        const pData = Array.isArray(pBody.pedidos) ? pBody.pedidos : (Array.isArray(pBody) ? pBody : []);
        setPedidos(pData);
      } catch (err) {
        console.error('Erro ao carregar dados fornecedor:', err);
        setError(String(err?.message ?? err));
      } finally { setLoading(false); }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unidadeId]);

  if (!unidadeId) return <div className="p-4">Unidade não identificada na sessão.</div>;
  if (loading) return <div className="p-4">Carregando dados...</div>;
  if (error) return <div className="p-4 text-destructive">Erro: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-muted rounded">Contratos: {contratos.length}</div>
        <div className="p-4 bg-muted rounded">Lojas/Clientes: {fornecedoras.length}</div>
        <div className="p-4 bg-muted rounded">Pedidos: {pedidos.length}</div>
      </div>

      <section>
        <h3 className="text-lg font-medium">Contratos (fornecedor)</h3>
        <ul className="mt-2 space-y-2">
          {contratos.length === 0 && <li>Nenhum contrato encontrado.</li>}
          {contratos.map((c) => (
            <li key={c.id} className="p-3 border rounded">
              <div className="font-semibold">Contrato #{c.id} — Status: {c.status}</div>
              <div className="text-sm">Loja/Unidade: {c.unidade?.nome ?? c.unidade?.id ?? '—'}</div>
              <div className="mt-2">
                <strong>Itens:</strong>
                <ul className="list-disc pl-6">
                  {(c.itens || []).map((i, idx) => <li key={idx}>{i.nome ?? '—'}</li>)}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-medium">Pedidos relacionados</h3>
        <ul className="mt-2 space-y-2">
          {pedidos.length === 0 && <li>Nenhum pedido encontrado.</li>}
          {pedidos.map(p => (
            <li key={p.id} className="p-3 border rounded">
              <div className="font-semibold">Pedido #{p.id} — Status: {p.status}</div>
              <div className="text-sm">Data: {p.dataPedido ?? p.data}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}