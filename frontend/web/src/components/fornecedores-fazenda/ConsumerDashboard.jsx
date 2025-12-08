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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import FornecedoresCard from './fornecedores-card';
import ConsumidoresCard from './consumidores-card';
import { OrderManagement } from './OrderManagement';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/lib/api';

export function ConsumerDashboard({ unidadeId: unidadeIdProp = null }) {
  const { user, fetchWithAuth } = useAuth();
  const unidadeId = unidadeIdProp ?? user?.unidadeId ?? user?.unidade?.id ?? null;
  const isGerente = (user?.perfil?.funcao === 'GERENTE_MATRIZ' || user?.perfil?.funcao === 'GERENTE_FAZENDA');

  // fornecedores externos para passar ao card
  const [fornecedoresExternos, setFornecedoresExternos] = useState([]);
  const [carregandoFornecedores, setCarregandoFornecedores] = useState(false);
  const [fornecedorError, setFornecedorError] = useState(null);
  const [contratosExternos, setContratosExternos] = useState([]);
  const [pedidosExternos, setPedidosExternos] = useState([]);
  // modal / form para criar fornecedor externo
  const [showAddFornecedorModal, setShowAddFornecedorModal] = useState(false)
  const [novoNomeEmpresa, setNovoNomeEmpresa] = useState("")
  const [novoDescricaoEmpresa, setNovoDescricaoEmpresa] = useState("")
  const [novoCnpjCpf, setNovoCnpjCpf] = useState("")
  const [novoEmail, setNovoEmail] = useState("")
  const [novoTelefone, setNovoTelefone] = useState("")
  const [novoEndereco, setNovoEndereco] = useState("")
  const [novoStatus, setNovoStatus] = useState('ATIVO')
  const [creatingFornecedor, setCreatingFornecedor] = useState(false)

  const loadFornecedores = async () => {
    if (!unidadeId) return;
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
          let fornecedorContratos = Array.isArray(cFornecedorBody.contratos) ? cFornecedorBody.contratos : (Array.isArray(cFornecedorBody) ? cFornecedorBody : []);
          // combine arrays
          contratosArray = contratosArray.concat(fornecedorContratos || []);
        }
      } catch (e) {
        // não fatal
        console.warn('[ConsumerDashboard] Erro ao buscar contratos como fornecedor:', e);
      }

      setContratosExternos(contratosArray);

      // 3) Extrai fornecedores ÚNICOS dos contratos (EXTERNOS e FORNECEDOR)
      const fornecedoresFromContratos = (contratosArray || [])
        .map(c => c.fornecedorExterno || c.fornecedorInterno)
        .filter(f => f && typeof f.id !== 'undefined')
        .reduce((acc, f) => {
          if (!acc.some(x => x && x.id === f.id)) acc.push(f);
          return acc;
        }, []);

      console.log('[ConsumerDashboard] Fornecedores extraídos dos contratos:', fornecedoresFromContratos.length, fornecedoresFromContratos);

      // 4) Normaliza fornecedores para o formato esperado pelo FornecedoresCard
      let normalized = (fornecedoresFromContratos || []).map(f => ({
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
          const allRes = await fetchWithAuth(`${API_URL}fornecedores/externos`, { method: 'GET' });
          if (allRes.ok) {
            const allBody = await allRes.json().catch(() => ({}));
            const all = Array.isArray(allBody.fornecedores) ? allBody.fornecedores : allBody;
            normalized = (Array.isArray(all) ? all : []).map(f => ({ id: f.id, name: f.nomeEmpresa || f.nome, status: f.status || 'ATIVO', products: 0, category: f.categoria || 'Geral' }));
          }
        } catch (e) {
          console.warn('[ConsumerDashboard] erro tentando fallback de fornecedores externos:', e);
        }
      }

      console.log('[ConsumerDashboard] Fornecedores normalizados:', normalized.length, normalized);
      setFornecedoresExternos(normalized);

      // 5) Buscar pedidos relacionados (externos + internos)
      try {
        const pedidosRes = await fetchWithAuth(`${API_URL}pedidos-externos/${unidadeId}`, { method: 'GET' });
        if (pedidosRes.ok) {
          const pb = await pedidosRes.json().catch(() => ({}));
          const pedidosArr = Array.isArray(pb.pedidos) ? pb.pedidos : [];
          setPedidosExternos(pedidosArr);
        }
      } catch (e) {
        console.warn('[ConsumerDashboard] erro buscando pedidos externos', e);
      }
    } catch (err) {
      console.error('[ConsumerDashboard] Erro carregando fornecedores externos:', err);
      setFornecedorError(String(err?.message ?? err));
      setFornecedoresExternos([]);
    } finally {
      setCarregandoFornecedores(false);
    }
  }

  useEffect(() => {
    loadFornecedores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unidadeId]);

  const handleCreateFornecedor = async () => {
    if (!novoNomeEmpresa || !novoDescricaoEmpresa || !novoCnpjCpf || !novoTelefone) {
      alert('Preencha os campos obrigatórios: nome, descrição, CNPJ/CPF e telefone');
      return;
    }
    setCreatingFornecedor(true);
    try {
      const payload = {
        nomeEmpresa: novoNomeEmpresa,
        descricaoEmpresa: novoDescricaoEmpresa,
        cnpjCpf: novoCnpjCpf,
        email: novoEmail || null,
        telefone: novoTelefone,
        endereco: novoEndereco || null,
        status: novoStatus || 'ATIVO'
      };
      const res = await fetchWithAuth(`${API_URL}fornecedores/externos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const body = await res.json().catch(() => ({}));
      if (res.status === 403) {
        alert('Você não tem permissão para criar fornecedores.');
      } else if (res.ok && (body.sucesso || body.fornecedorExterno)) {
        // sucesso
  setShowAddFornecedorModal(false);
  setNovoNomeEmpresa(''); setNovoDescricaoEmpresa(''); setNovoCnpjCpf(''); setNovoEmail(''); setNovoTelefone(''); setNovoEndereco(''); setNovoStatus('ATIVO');
        alert('Fornecedor externo criado com sucesso');
        // atualizar lista
        await loadFornecedores();
      } else {
        console.error('Erro criando fornecedor:', body);
        alert(body.erro || body.message || 'Erro ao criar fornecedor');
      }
    } catch (err) {
      console.error('Erro criando fornecedor externo:', err);
      alert('Erro ao criar fornecedor externo');
    } finally {
      setCreatingFornecedor(false);
    }
  }

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
          <div className="flex justify-end mb-4">
            {/* Botão sempre visível para facilitar testes; abre o modal mesmo para não-gerentes. */}
            <Button onClick={() => setShowAddFornecedorModal(true)} aria-disabled={!isGerente} title={!isGerente ? 'Você não possui permissão para salvar — apenas GERENTE_MATRIZ ou GERENTE_FAZENDA' : undefined}>
              Adicionar Fornecedor
            </Button>
          </div>
          <ContratosComoConsumidor 
            fornecedores={fornecedoresExternos} 
            contratos={contratosExternos} 
            pedidos={pedidosExternos} 
            carregando={carregandoFornecedores} 
          />

          <Dialog open={showAddFornecedorModal} onOpenChange={setShowAddFornecedorModal}>
            <DialogContent className="max-w-lg w-full">
              <DialogHeader>
                <DialogTitle>Novo Fornecedor Externo</DialogTitle>
                <DialogDescription>Preencha os dados do fornecedor externo</DialogDescription>
              </DialogHeader>

              <div className="space-y-3 mt-4">
                <div>
                  <Label>Nome da Empresa *</Label>
                  <Input value={novoNomeEmpresa} onChange={(e) => setNovoNomeEmpresa(e.target.value)} />
                </div>
                <div>
                  <Label>Descrição *</Label>
                  <Input value={novoDescricaoEmpresa} onChange={(e) => setNovoDescricaoEmpresa(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>CNPJ / CPF *</Label>
                    <Input value={novoCnpjCpf} onChange={(e) => setNovoCnpjCpf(e.target.value)} />
                  </div>
                  <div>
                    <Label>Telefone *</Label>
                    <Input value={novoTelefone} onChange={(e) => setNovoTelefone(e.target.value)} />
                  </div>
                </div>
                  <div>
                    <Label>Status *</Label>
                    <select value={novoStatus} onChange={(e) => setNovoStatus(e.target.value)} className="w-full border rounded p-2 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-900">
                      <option value="ATIVO">ATIVO</option>
                      <option value="INATIVO">INATIVO</option>
                    </select>
                  </div>
                <div>
                  <Label>Email</Label>
                  <Input value={novoEmail} onChange={(e) => setNovoEmail(e.target.value)} />
                </div>
                <div>
                  <Label>Endereço</Label>
                  <Input value={novoEndereco} onChange={(e) => setNovoEndereco(e.target.value)} />
                </div>

                <DialogFooter>
                  <div className="flex gap-2 w-full">
                    <Button type="button" variant="secondary" onClick={() => setShowAddFornecedorModal(false)}>Cancelar</Button>
                    <Button type="button" className="ml-auto" onClick={handleCreateFornecedor} disabled={creatingFornecedor}>{creatingFornecedor ? 'Salvando...' : 'Salvar'}</Button>
                  </div>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
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