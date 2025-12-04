'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { ProductCatalog } from './ProductCatalog';
// import { OrderManagement } from './OrderManagement';
import { ChatInterface } from './ChatInterface';
import { ComplaintSystem } from './ComplaintSystem';
import { ShoppingCart, MessageSquare, AlertTriangle, Search, TrendingUp, Clock, CheckCircle, FileCheck } from 'lucide-react';
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Card, CardContent, CardAction, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import FornecedoresCard from './fornecedores-card';
import ConsumidoresCard from './consumidores-card';
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
        console.log('[ConsumerDashboard] Buscando contratos externos e internos para unidadeId:', unidadeId);
        
        // 1) Busca contratos EXTERNOS da unidade
        const cRes = await fetchWithAuth(`${API_URL}verContratosExternos/${unidadeId}`, { 
          method: 'GET', 
          credentials: 'include' 
        });
        
        if (!cRes.ok) {
          throw new Error(`Erro HTTP ${cRes.status} ao buscar contratos externos`);
        }
        
        const cBody = await cRes.json().catch(() => ({}));
        let contratosArray = Array.isArray(cBody.contratosExternos) ? cBody.contratosExternos : 
                             Array.isArray(cBody.contratos) ? cBody.contratos : [];
        
        console.log('[ConsumerDashboard] Contratos externos recebidos:', contratosArray.length, contratosArray);
        
        // 2) Busca contratos onde esta unidade é FORNECEDORA para outras unidades
        try {
          const cFornecedorRes = await fetchWithAuth(`${API_URL}verContratosComFazendasAsFornecedor/${unidadeId}`, { 
            method: 'GET', 
            credentials: 'include' 
          });
          
          if (cFornecedorRes.ok) {
            const cFornecedorBody = await cFornecedorRes.json().catch(() => ({}));
            console.log('[ConsumerDashboard] Resposta completa de contratos como fornecedor:', cFornecedorBody);
            const contratosAsFornecedor = Array.isArray(cFornecedorBody.contratos) ? cFornecedorBody.contratos : 
                                          (cFornecedorBody.contratos?.contratos ? cFornecedorBody.contratos.contratos : []);
            console.log('[ConsumerDashboard] Contratos (onde esta unidade FORNECE) recebidos:', contratosAsFornecedor.length, contratosAsFornecedor);
            
            // Combina com todos os contratos
            contratosArray = [...contratosArray, ...contratosAsFornecedor];
            console.log('[ConsumerDashboard] Total de contratos (externos + fornecedor):', contratosArray.length);
          } else {
            console.warn('[ConsumerDashboard] Resposta de contratos como fornecedor não OK:', cFornecedorRes.status);
          }
        } catch (e) {
          console.warn('[ConsumerDashboard] Aviso ao buscar contratos como fornecedor:', e?.message);
        }
        
        setContratosExternos(contratosArray);

        // 3) Extrai fornecedores ÚNICOS dos contratos (EXTERNOS e FORNECEDOR)
        const fornecedoresFromContratos = contratosArray
          .map(c => c.fornecedorExterno || c.fornecedorInterno)
          .filter(f => f && typeof f.id !== 'undefined')
          .reduce((acc, f) => {
            if (!acc.find(x => x.id === f.id)) acc.push(f);
            return acc;
          }, []);

        console.log('[ConsumerDashboard] Fornecedores extraídos dos contratos:', fornecedoresFromContratos.length, fornecedoresFromContratos);

        // 4) Normaliza fornecedores para o formato esperado pelo FornecedoresCard
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

        // 5) Buscar pedidos relacionados (externos + internos)
        try {
          let allPedidos = [];
          
          // Busca pedidos externos
          const pRes = await fetchWithAuth(`${API_URL}pedidos-externos/${unidadeId}`, { 
            method: 'GET', 
            credentials: 'include' 
          });
          if (pRes.ok) {
            const pBody = await pRes.json().catch(() => ({}));
            const pedidosExternos = Array.isArray(pBody.pedidos) ? pBody.pedidos : [];
            console.log('[ConsumerDashboard] Pedidos externos recebidos:', pedidosExternos.length, pedidosExternos);
            allPedidos = [...allPedidos, ...pedidosExternos];
          }
          
          // Busca pedidos internos (de outras unidades)
          try {
            const pInternRes = await fetchWithAuth(`${API_URL}estoque-produtos/pedidos/${unidadeId}`, { 
              method: 'GET', 
              credentials: 'include' 
            });
            if (pInternRes.ok) {
              const pInternBody = await pInternRes.json().catch(() => ({}));
              const pedidosInternos = Array.isArray(pInternBody.pedidos) ? pInternBody.pedidos : (Array.isArray(pInternBody) ? pInternBody : []);
              console.log('[ConsumerDashboard] Pedidos internos recebidos:', pedidosInternos.length, pedidosInternos);
              allPedidos = [...allPedidos, ...pedidosInternos];
            }
          } catch (e) {
            console.warn('[ConsumerDashboard] Aviso ao buscar pedidos internos:', e?.message);
          }
          
          console.log('[ConsumerDashboard] Total de pedidos (externos + internos):', allPedidos.length, allPedidos);
          setPedidosExternos(allPedidos);
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
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:@xl/main:grid-cols-2 @5xl/main:grid-cols-4 mb-0">
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
      </div> */}

      {/* Tabs: Contratos como consumidor / Contratos como Fornecedor */}
      <Tabs defaultValue="consumidor" className="bg-card p-4 rounded-lg">
        <TabsList>
          <TabsTrigger value="consumidor">Contratos como consumidor</TabsTrigger>
          <TabsTrigger value="fornecedor">Contratos como fornecedor</TabsTrigger>
        </TabsList>

        <TabsContent value="consumidor" className="mt-4">
          <ContratosComoConsumidor 
            fornecedores={fornecedoresExternos} 
            contratos={contratosExternos} 
            pedidos={pedidosExternos} 
            carregando={carregandoFornecedores} 
          />
        </TabsContent>

        <TabsContent value="fornecedor" className="mt-4">
          <ContratosComoFornecedor />
        </TabsContent>
      </Tabs>

      {/* produtos */}
      {/* <ProductCatalog /> */}
      {/* produtos */}
      
    </div>
  );
}

function ContratosComoConsumidor({ fornecedores = [], contratos = [], pedidos = [], carregando = false }) {
  // This tab receives pre-fetched data from the parent `ConsumerDashboard` via props.
  return (
    <div className="space-y-6 flex flex-col gap-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:@xl/main:grid-cols-2 @5xl/main:grid-cols-4 mb-0">
        <Card className="h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition">
          <CardHeader>
            <CardDescription>Contratos Ativos</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">7</CardTitle>
            <CardAction><FileCheck /></CardAction>
          </CardHeader>
        </Card>
        <Card className="h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition">
          <CardHeader>
            <CardDescription>Contratos pendentes</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">3</CardTitle>
            <CardAction><Clock /></CardAction>
          </CardHeader>
        </Card>
        <Card className="h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition">
          <CardHeader>
            <CardDescription>NÃO SEI O QUE COLOCAR AQUI</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">24</CardTitle>
            <CardAction><CheckCircle /></CardAction>
          </CardHeader>
        </Card>
      </div>

      <FornecedoresCard fornecedores={fornecedores} contratos={contratos} pedidos={pedidos} carregando={carregando} />

      <OrderManagement pedidos={pedidos} />
    </div>
  );
}

function ContratosComoFornecedor() {
  const { user, fetchWithAuth } = useAuth();
  const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contratos, setContratos] = useState([]);
  const [lojaConsumidoras, setLojaConsumidoras] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    if (!unidadeId) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1) Buscar contratos onde essa unidade é fornecedora (CORRETO: verContratosComFazendasAsFornecedor)
        console.log('[ContratosComoFornecedor] Buscando contratos como fornecedor para unidadeId:', unidadeId);
        const cRes = await fetchWithAuth(`${API_URL}verContratosComFazendasAsFornecedor/${unidadeId}`, { method: 'GET', credentials: 'include' });
        
        if (!cRes.ok) {
          throw new Error(`Erro HTTP ${cRes.status} ao buscar contratos como fornecedor`);
        }
        
        const cBody = await cRes.json().catch(() => ({}));
        console.log('[ContratosComoFornecedor] Resposta do backend:', cBody);

        // Normalizar diferentes formatos de resposta possíveis:
        // - API pode retornar: []
        // - { sucesso: true, contratos: [...] }
        // - { sucesso: true, contratos: { contratos: [...] } } (dupla-encapsulação)
        // - { contratos: [...] }
        let contratosArray = [];
        if (Array.isArray(cBody)) {
          contratosArray = cBody;
        } else if (Array.isArray(cBody.contratos)) {
          contratosArray = cBody.contratos;
        } else if (cBody.contratos && Array.isArray(cBody.contratos.contratos)) {
          contratosArray = cBody.contratos.contratos;
        } else if (Array.isArray(cBody.data)) {
          contratosArray = cBody.data;
        } else {
          // fallback: try to find first array value in the object
          for (const key of Object.keys(cBody || {})) {
            if (Array.isArray(cBody[key])) { contratosArray = cBody[key]; break; }
            if (cBody[key] && Array.isArray(cBody[key].contratos)) { contratosArray = cBody[key].contratos; break; }
          }
        }

        console.log('[ContratosComoFornecedor] Contratos encontrados (normalized):', contratosArray.length, contratosArray);
        setContratos(contratosArray);

        // 2) Extrai LOJAS CONSUMIDORAS ÚNICAS dos contratos (campo 'unidade' em cada contrato)
        const lojasFromContratos = contratosArray
          .map(c => c.unidade)  // 'unidade' é a loja consumidora (compradora)
          .filter(u => u && typeof u.id !== 'undefined')
          .reduce((acc, u) => {
            if (!acc.find(x => x.id === u.id)) acc.push(u);
            return acc;
          }, []);

        console.log('[ContratosComoFornecedor] Lojas consumidoras extraídas:', lojasFromContratos.length, lojasFromContratos);

        // 3) Normaliza lojas consumidoras para o formato esperado pelo ConsumidoresCard
        const normalized = lojasFromContratos.map(loja => ({
          ...loja,
          id: loja.id ?? loja.ID ?? null,
          name: loja.nome || `Loja ${loja.id}`,
          status: (loja.status && (String(loja.status).toUpperCase() === 'ATIVO' || String(loja.status).toUpperCase() === 'ATIVA')) ? 'Ativa' : 'Ativa',
          products: loja.produtosCount ?? loja.produtos ?? 0,
          category: loja.categoria || loja.tipo || 'Geral',
          cidade: loja.cidade,
          estado: loja.estado
        }));
        console.log('[ContratosComoFornecedor] Lojas normalizadas:', normalized.length, normalized);
        setLojaConsumidoras(normalized);

        // 4) Buscar pedidos relacionados
        try {
          // Buscar pedidos onde a fazenda (unidadeId) é a origem (pedidos que a fazenda fez para lojas)
          const pRes = await fetchWithAuth(`${API_URL}estoque-produtos/pedidos-origem/${unidadeId}`, { method: 'GET', credentials: 'include' });
          const pBody = await pRes.json().catch(() => ({}));
          const pData = Array.isArray(pBody.pedidos) ? pBody.pedidos : (Array.isArray(pBody) ? pBody : []);
          console.log('[ContratosComoFornecedor] Pedidos encontrados (origem):', pData.length, pData);
          setPedidos(pData);
        } catch (e) {
          console.warn('[ContratosComoFornecedor] Aviso ao buscar pedidos (origem):', e?.message);
        }
      } catch (err) {
        console.error('[ContratosComoFornecedor] Erro ao carregar dados:', err);
        setError(String(err?.message ?? err));
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unidadeId]);

  if (!unidadeId) return <div className="p-4">Unidade não identificada na sessão.</div>;
  if (loading) return <div className="p-4">Carregando dados...</div>;
  if (error) return <div className="p-4 text-destructive">Erro: {error}</div>;

  return (
    <div className="space-y-6 flex flex-col gap-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:@xl/main:grid-cols-2 @5xl/main:grid-cols-4 mb-0">
        <Card className="h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition">
          <CardHeader>
            <CardDescription>Contratos Ativos</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {contratos.filter(c => c.status === 'ATIVO').length}
            </CardTitle>
            <CardAction><FileCheck /></CardAction>
          </CardHeader>
        </Card>
        <Card className="h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition">
          <CardHeader>
            <CardDescription>Lojas Consumidoras</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {lojaConsumidoras.length}
            </CardTitle>
            <CardAction><ShoppingCart /></CardAction>
          </CardHeader>
        </Card>
        <Card className="h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition">
          <CardHeader>
            <CardDescription>Pedidos Pendentes</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {pedidos.filter(p => p.status === 'PENDENTE').length}
            </CardTitle>
            <CardAction><Clock /></CardAction>
          </CardHeader>
        </Card>
      </div>

      {/* Exibe as lojas consumidoras com seus contratos associados usando ConsumidoresCard */}
      <ConsumidoresCard fornecedores={lojaConsumidoras} contratos={contratos} pedidos={pedidos} carregando={loading} />

      <OrderManagement pedidos={pedidos} />
    </div>
  );
}