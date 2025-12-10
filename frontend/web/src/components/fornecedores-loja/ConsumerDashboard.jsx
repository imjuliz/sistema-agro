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
import { OrderManagement } from './OrderManagement';
import { CreatePedidoLojaModal } from './CreatePedidoLojaModal';
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
  
  // modal para criar pedido interno
  const [showCreatePedidoModal, setShowCreatePedidoModal] = useState(false)

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
        
        // 2) Busca contratos INTERNOS da unidade (com outras fazendas) - onde esta unidade CONSOME
        try {
          const cInternRes = await fetchWithAuth(`${API_URL}verContratosComFazendas/${unidadeId}`, { 
            method: 'GET', 
            credentials: 'include' 
          });
          
          if (cInternRes.ok) {
            const cInternBody = await cInternRes.json().catch(() => ({}));
            console.log('[ConsumerDashboard] Resposta completa de contratos internos (consumidor):', cInternBody);
            const contratosInternos = Array.isArray(cInternBody.contratos) ? cInternBody.contratos : 
                                       (cInternBody.contratos?.contratos ? cInternBody.contratos.contratos : []);
            console.log('[ConsumerDashboard] Contratos internos (onde esta unidade CONSOME) recebidos:', contratosInternos.length, contratosInternos);
            
            // Combina contratos externos e internos
            contratosArray = [...contratosArray, ...contratosInternos];
            console.log('[ConsumerDashboard] Total de contratos (externos + internos consumidor):', contratosArray.length);
          } else {
            console.warn('[ConsumerDashboard] Resposta de contratos internos não OK:', cInternRes.status);
          }
        } catch (e) {
          console.warn('[ConsumerDashboard] Aviso ao buscar contratos internos:', e?.message);
        }

        // 3) Busca contratos onde esta unidade é FORNECEDORA para outras unidades
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
            console.log('[ConsumerDashboard] Total de contratos (externos + internos consumidor + fornecedor):', contratosArray.length);
          } else {
            console.warn('[ConsumerDashboard] Resposta de contratos como fornecedor não OK:', cFornecedorRes.status);
          }
        } catch (e) {
          console.warn('[ConsumerDashboard] Aviso ao buscar contratos como fornecedor:', e?.message);
        }
        
        setContratosExternos(contratosArray);

        // 3) Extrai fornecedores ÚNICOS dos contratos (EXTERNOS e INTERNOS)
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

      
          <ContratosComoConsumidor 
            fornecedores={fornecedoresExternos} 
            contratos={contratosExternos} 
            pedidos={pedidosExternos} 
            carregando={carregandoFornecedores}
            unidadeId={unidadeId}
            onShowCreatePedido={() => setShowCreatePedidoModal(true)}
          />
        

      {/* produtos */}
      {/* <ProductCatalog /> */}
      {/* produtos */}

      {/* Modal para criar pedido interno */}
      <CreatePedidoLojaModal
        open={showCreatePedidoModal}
        onOpenChange={setShowCreatePedidoModal}
        unidadeId={unidadeId}
        fornecedores={fornecedoresExternos}
        onPedidoCreated={(pedido) => {
          // Atualizar lista de pedidos
          setPedidosExternos(prev => [pedido, ...prev]);
        }}
      />
      
    </div>
  );
}

function ContratosComoConsumidor({ 
  fornecedores = [], 
  contratos = [], 
  pedidos = [], 
  carregando = false,
  unidadeId = null,
  onShowCreatePedido = () => {}
}) {
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

      <div className="flex justify-end">
        <Button onClick={onShowCreatePedido}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Criar Pedido
        </Button>
      </div>

      <OrderManagement pedidos={pedidos} />
    </div>
  );
}