"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Search, ShoppingCart, CreditCard, User, Barcode, Percent, Receipt, Trash2, BarChart, DollarSign, Layers, } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";
import { usePerfilProtegido } from '@/hooks/usePerfilProtegido';
import { useToast } from '@/components/ui/use-toast';


export default function app() {
  const { fetchWithAuth, user } = useAuth();
  usePerfilProtegido("GERENTE_LOJA");
  const { toast } = useToast();
  // Guarda as últimas respostas (normalizadas) por endpoint/key — não causa re-render
  const lastResponsesRef = useRef({});
  const sessionExpiredRef = useRef(false);
  const router = useRouter();

  const [productsList, setProductsList] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  const [customersList, setCustomersList] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [customersError, setCustomersError] = useState(null);

  const [recentSalesList, setRecentSalesList] = useState([]);
  const [salesLoading, setSalesLoading] = useState(true);
  const [salesError, setSalesError] = useState(null);

  const [dailyStatsState, setDailyStatsState] = useState(null);
  const [financeLoading, setFinanceLoading] = useState(true);
  const [financeError, setFinanceError] = useState(null);

  // finance/dashboard states
  const [saldoFinal, setSaldoFinal] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [averageTransactionValue, setAverageTransactionValue] = useState(0);
  const [paymentsBreakdown, setPaymentsBreakdown] = useState({ PIX: 0, DINHEIRO: 0, CARTAO: 0 });
  const [topProduct, setTopProduct] = useState(null);
  // POS states (cart, filters, payment)
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [clienteNome, setClienteNome] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountReceived, setAmountReceived] = useState(0);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [caixaAberto, setCaixaAberto] = useState(false);
  const [abrindoCaixa, setAbrindoCaixa] = useState(false);
  const [fechandoCaixa, setFechandoCaixa] = useState(false);
  const [emitindoNota, setEmitindoNota] = useState(false);
  const [saldoInicial, setSaldoInicial] = useState('');
  const [saldoInicialError, setSaldoInicialError] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [clienteCpf, setClienteCpf] = useState('');
  const [caixaInfo, setCaixaInfo] = useState(null);
  
  const categories = ['all', ...Array.from(new Set((productsList || []).map(p => p.category || ''))).filter(c => c)];
  const filteredProducts = (productsList || []).filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const term = searchTerm.trim().toLowerCase();
    const productSku = (product.sku || product.barcode || '').toLowerCase();
    const matchesSearch = term === '' || product.name.toLowerCase().includes(term) || productSku.includes(term);
    return matchesCategory && matchesSearch;
  });

  const extractDigits = (value = '') => String(value || '').replace(/\D/g, '');
  const formatCpfInput = (value = '') => {
    const digits = extractDigits(value).slice(0, 11);
    const part1 = digits.slice(0, 3);
    const part2 = digits.slice(3, 6);
    const part3 = digits.slice(6, 9);
    const part4 = digits.slice(9, 11);
    let formatted = part1;
    if (part2) formatted += `.${part2}`;
    if (part3) formatted += `.${part3}`;
    if (part4) formatted += `-${part4}`;
    return formatted;
  };
  const getCpfDigits = (value = '') => extractDigits(value).slice(0, 11);

  const handleUnauthorized = () => {
    if (sessionExpiredRef.current) return;
    sessionExpiredRef.current = true;
    toast({
      title: 'Sessão expirada',
      description: 'Faça login novamente para continuar.',
      variant: 'destructive',
    });
    try { router.push('/login'); }
    catch (err) { window.location.href = '/login'; }
  };

  const addToCart = (product) => {
    if (!caixaAberto) return;
    setCart((c) => {
      const existing = c.find(i => i.id === product.id);
      if (existing) { return c.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i); }
      return [...c, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const updateQuantity = (id, newQuantity) => { setCart((c) => c.map(i => i.id === id ? { ...i, quantity: Math.max(0, newQuantity) } : i).filter(i => i.quantity > 0)) };
  const removeFromCart = (id) => { setCart((c) => c.filter(i => i.id !== id)); };
  const getSubtotal = () => cart.reduce((s, i) => s + (Number(i.price || 0) * Number(i.quantity || 0)), 0);
  const getDiscountAmount = () => (getSubtotal() * (Number(discountPercent || 0) / 100));
  const getTax = () => ((getSubtotal() - getDiscountAmount()) * 0.08);
  const getTotal = () => (getSubtotal() - getDiscountAmount() + getTax());
  const getChange = () => Math.max(0, Number(amountReceived || 0) - getTotal());
  const clearCart = () => { setCart([]); setDiscountPercent(0); setAmountReceived(0); };
  
  const verificarCaixaAberto = async () => {
    try {
      const resp = await safeFetchJson(ENDPOINTS.caixaStatus, { method: 'GET' });
      if (resp?.aberto && resp?.caixa) {
        setCaixaAberto(true);
        setCaixaInfo(resp.caixa);
        if (typeof resp.caixa?.saldoFinal !== 'undefined' && resp.caixa?.saldoFinal !== null) {
          setSaldoFinal(Number(resp.caixa.saldoFinal ?? 0));
        }
      } else {
        setCaixaAberto(false);
        setCaixaInfo(null);
      }
    } catch (err) {
      console.debug('Erro ao verificar caixa:', err);
      setCaixaAberto(false);
      setCaixaInfo(null);
    }
  };
  
  const handleAbrirCaixa = async () => {
    if (saldoInicial === '' || saldoInicial === null || Number.isNaN(Number(saldoInicial))) {
      setSaldoInicialError('Informe o saldo inicial antes de abrir o caixa.');
      return;
    }
    setSaldoInicialError('');
    setAbrindoCaixa(true);
    try {
      const resp = await safeFetchJson(ENDPOINTS.caixaAbrir, { method: 'POST', body: JSON.stringify({ saldoInicial: Number(saldoInicial || 0) }) });
      if (resp && resp.sucesso) {
        setCaixaAberto(true);
        if (resp.caixa) setCaixaInfo(resp.caixa);
        toast({ title: 'Caixa aberto', description: 'Caixa do dia iniciado com sucesso.' });
      } else {
        toast({
          title: 'Erro ao abrir caixa',
          description: resp?.erro || 'Erro desconhecido',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Erro ao abrir caixa:', err);
      toast({
        title: 'Erro ao abrir caixa',
        description: err?.message || 'Não foi possível abrir o caixa.',
        variant: 'destructive',
      });
    } finally {
      setAbrindoCaixa(false);
      verificarCaixaAberto();
    }
  };

  const handleFecharCaixa = async () => {
    setFechandoCaixa(true);
    try {
      const resp = await safeFetchJson(ENDPOINTS.caixaFechar, { method: 'POST' });
      if (resp?.sucesso) {
        const finalNumber = Number(resp?.saldoFinal ?? resp?.caixa?.saldoFinal ?? 0);
        toast({ title: 'Caixa fechado', description: `Saldo final: R$ ${finalNumber.toFixed(2)}` });
        setSaldoFinal(finalNumber);
        setCaixaInfo(resp.caixa || null);
        setCaixaAberto(false);
      } else {
        toast({
          title: 'Erro ao fechar caixa',
          description: resp?.erro || 'Erro desconhecido',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Erro ao fechar caixa:', err);
      toast({
        title: 'Erro ao fechar caixa',
        description: err?.message || 'Não foi possível fechar o caixa.',
        variant: 'destructive',
      });
    } finally {
      setFechandoCaixa(false);
      verificarCaixaAberto();
    }
  };
  
  const ENDPOINTS = {
    produtosList: '/produtos/listar',
    produtosBase: '/produtos',
    listarProdutosEstoque: (unidadeId) => `/listarProdutosEstoque/${unidadeId}`,
    saldoFinal: '/saldo-final',
    caixaAbrir: '/caixa/abrir',
    caixaStatus: '/caixa/status',
    caixaFechar: '/caixa/fechar',
    somarDiaria: (unidadeId) => `/somarDiaria/${unidadeId}`,
    vendasMedia: (unidadeId) => `/vendas/media-por-transacao/${unidadeId}`,
    vendasPagamentos: (unidadeId) => `/vendas/divisao-pagamentos/${unidadeId}`,
    produtoMaisVendido: (unidadeId) => `/financeiro/produto-mais-vendido/${unidadeId}`,
    usuariosUnidadeListar: '/usuarios/unidade/listar',
    listarVendas: (unidadeId) => `/listarVendas/${unidadeId}`,
    vendasCriar: '/vendas/criar',
    notaFiscal: (vendaId) => `/vendas/${vendaId}/nota-fiscal`
  };

  const makeUrl = (path) => {
    if (!path) return API_URL;
    if (typeof path === 'function') path = path();
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const base = (API_URL || '').replace(/\/+$/, '');
    const clean = String(path).replace(/^\/+/, '');
    return `${base}/${clean}`;
  };

  const safeFetchJson = async (path, opts = {}) => {
    // Accept either a path string or an ENDPOINTS key function/value
    const resolvedPath = (typeof path === 'string' && path in ENDPOINTS) ? ENDPOINTS[path] : path;

    // derive a stable key for storing last response
    let responseKey = 'unknown';
    try {
      if (typeof path === 'string' && path in ENDPOINTS) responseKey = path;
      else if (typeof resolvedPath === 'string') responseKey = String(resolvedPath).replace(/^\/+|\/+$/g, '').replace(/[^a-zA-Z0-9_\-]/g, '_') || 'root';
    } catch (e) { responseKey = 'unknown'; }

    // helper to persist and return result
    const persistAndReturn = (result) => {
      try { lastResponsesRef.current[responseKey] = result; window.__lastResponses = lastResponsesRef.current; } catch (e) { /* ignore */ }
      return result;
    };

    // If fetchWithAuth is available, prefer it but still build the correct URL
    if (typeof fetchWithAuth === 'function') {
      try {
        const url = makeUrl(resolvedPath);
        const merged = { credentials: 'include', headers: { 'Content-Type': 'application/json' }, ...opts };
        const resp = await fetchWithAuth(url, merged);
        const contentType = resp.headers && resp.headers.get ? resp.headers.get('content-type') || '' : '';
        if (!resp.ok) {
          const txt = await resp.text().catch(() => null);
          const status = resp.status;
          if (status === 401 || status === 403) {
            handleUnauthorized();
            return persistAndReturn({ sucesso: false, erro: 'Sessão expirada', detalhes: typeof txt === 'string' ? txt.slice(0, 2000) : null, status });
          }
          return persistAndReturn({ sucesso: false, erro: typeof txt === 'string' ? txt.slice(0, 2000) : `HTTP ${status}`, detalhes: typeof txt === 'string' ? txt.slice(0, 2000) : null, status });
        }
        if (contentType.includes('application/json')) {
          const parsed = await resp.json().catch((e) => ({ ok: false, parseError: e.message }));
          return persistAndReturn(parsed);
        }
        const text = await resp.text().catch(() => null);
        // Normaliza respostas non-JSON para um objeto JSON consistente
        const fallback = { sucesso: false, erro: typeof text === 'string' ? text.slice(0, 2000) : 'Resposta não-JSON', detalhes: typeof text === 'string' ? text.slice(0, 2000) : null, status: resp.status };
        return persistAndReturn(fallback);
      } catch (err) { console.debug('fetchWithAuth failed, falling back to direct fetch:', err.message || err) }
    }

    try {
      const url = makeUrl(resolvedPath);
      const merged = { credentials: 'include', headers: { 'Content-Type': 'application/json' }, ...opts };
      const resp = await fetch(url, merged);
      const contentType = resp.headers.get('content-type') || '';

      if (!resp.ok) {
        const txt = await resp.text().catch(() => null);
        const status = resp.status;
        if (status === 401 || status === 403) {
          handleUnauthorized();
          return persistAndReturn({ sucesso: false, erro: 'Sessão expirada', detalhes: typeof txt === 'string' ? txt.slice(0, 2000) : null, status });
        }
        return persistAndReturn({ sucesso: false, erro: typeof txt === 'string' ? txt.slice(0, 2000) : `HTTP ${status}`, detalhes: typeof txt === 'string' ? txt.slice(0, 2000) : null, status });
      }

      if (contentType.includes('application/json')) {
        const parsed = await resp.json().catch((e) => ({ ok: false, parseError: e.message }));
        return persistAndReturn(parsed);
      }
      const text = await resp.text().catch(() => null);
      return persistAndReturn({ sucesso: false, erro: typeof text === 'string' ? text.slice(0, 2000) : 'Resposta não-JSON', detalhes: typeof text === 'string' ? text.slice(0, 2000) : null, status: resp.status });
    }
    catch (error) { return persistAndReturn({ ok: false, error: error.message }); }
  };

  const emitirNotaFiscal = async (vendaId) => {
    if (!vendaId || typeof fetchWithAuth !== 'function') return;
    setEmitindoNota(true);
    try {
      const url = makeUrl(ENDPOINTS.notaFiscal(vendaId));
      const body = {
        clienteCpf: getCpfDigits(clienteCpf) || undefined,
        clienteNome: clienteNome || undefined,
        valorPagoCliente: paymentMethod === 'cash' ? amountReceived : getTotal(),
      };
      const resp = await fetchWithAuth(url, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });
      if (!resp?.ok) {
        const txt = await resp.text().catch(() => '');
        throw new Error(txt || `HTTP ${resp?.status}`);
      }
      const blob = await resp.blob();
      const fileUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `nota_fiscal_${vendaId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(fileUrl);
    } catch (error) {
      console.error('Erro ao emitir nota fiscal:', error);
      toast({
        title: 'Erro ao emitir nota fiscal',
        description: 'Venda registrada, mas não foi possível gerar a nota fiscal.',
        variant: 'destructive',
      });
    } finally {
      setEmitindoNota(false);
    }
  };

  const fetchRecentSales = async () => {
    try {
      const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
      if (!unidadeId) { setRecentSalesList([]); return; }
      const vendasResp = await safeFetchJson(ENDPOINTS.listarVendas(unidadeId));
      if (Array.isArray(vendasResp)) setRecentSalesList(vendasResp);
      else if (vendasResp && vendasResp.sucesso && Array.isArray(vendasResp.vendas)) setRecentSalesList(vendasResp.vendas);
      else if (vendasResp && Array.isArray(vendasResp.listaVendas)) setRecentSalesList(vendasResp.listaVendas);
    } catch (err) {
      console.warn('Erro ao atualizar vendas recentes:', err);
    }
  };

  const processSale = async () => {
    if (!cart || cart.length === 0) {
      toast({
        title: 'Carrinho vazio',
        description: 'Adicione produtos antes de finalizar a venda.',
        variant: 'destructive',
      });
      return;
    }
    if (!caixaAberto) {
      setPaymentMessage('Abra o caixa antes de registrar uma venda.');
      toast({
        title: 'Caixa fechado',
        description: 'Abra o caixa para registrar vendas.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const itens = cart.map((i) => {
        const numeric = Number(i.id); if (!Number.isNaN(numeric) && Number.isFinite(numeric) && numeric > 0) {
          return { produtoId: numeric, quantidade: Number(i.quantity || 1), precoUnitario: Number(i.price || 0), desconto: 0 }
        }
        return { produtoSku: String(i.id), quantidade: Number(i.quantity || 1), precoUnitario: Number(i.price || 0), desconto: 0 };
      });

      const payload = {
        pagamento: paymentMethod,
        itens,
        nomeCliente: clienteNome || undefined,
        cpfCliente: getCpfDigits(clienteCpf) || undefined,
        caixaId: caixaInfo?.id,
        valorPagoCliente: paymentMethod === 'cash' ? amountReceived : getTotal()
      };
      console.log('📤 Enviando payload para /vendas/criar:', payload);
      console.log('👤 User info (user):', user);
      
      const resp = await safeFetchJson(ENDPOINTS.vendasCriar, { method: 'POST', body: JSON.stringify(payload) });
      console.log('📥 Resposta do servidor:', resp);

      if (!resp || resp.sucesso === false) {
        console.error('Erro ao criar venda', resp);
        toast({
          title: 'Erro ao registrar venda',
          description: resp?.erro || 'Veja o console para detalhes.',
          variant: 'destructive',
        });
        return;
      }

      toast({ title: 'Venda registrada', description: 'Venda registrada com sucesso!' });
      if (resp?.venda?.id) { await emitirNotaFiscal(resp.venda.id); }
      clearCart();
      setClienteNome('');
      setClienteCpf('');
      setIsPaymentOpen(false);
      verificarCaixaAberto();
      fetchRecentSales();

      // atualizar saldo final
      const s = await safeFetchJson(ENDPOINTS.saldoFinal);
      if (s && typeof s.saldoFinal !== 'undefined') setSaldoFinal(Number(s.saldoFinal ?? 0));

    } catch (error) {
      console.error('Erro ao processar venda:', error);
      toast({
        title: 'Erro ao processar venda',
        description: error?.message || 'Veja o console para detalhes.',
        variant: 'destructive',
      });
    }
  };
  const loadFinance = async () => {
    let mounted = true;
    setFinanceLoading(true); setFinanceError(null);
    setProductsLoading(true); setProductsError(null);
    setCustomersLoading(true); setCustomersError(null);
    setSalesLoading(true); setSalesError(null);

    try {
      const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
      const [saldoRes, mediaRes, pagamentosRes, produtoRes, diarioRes] = await Promise.all([
        safeFetchJson(ENDPOINTS.saldoFinal),
        unidadeId ? safeFetchJson(ENDPOINTS.vendasMedia(unidadeId)) : Promise.resolve(null),
        unidadeId ? safeFetchJson(ENDPOINTS.vendasPagamentos(unidadeId)) : Promise.resolve(null),
        unidadeId ? safeFetchJson(ENDPOINTS.produtoMaisVendido(unidadeId)) : Promise.resolve(null),
        unidadeId ? safeFetchJson(ENDPOINTS.somarDiaria(unidadeId)) : Promise.resolve(null),
      ]);

      if (!mounted) return;
      if (saldoRes && saldoRes.sucesso !== false && typeof saldoRes.saldoFinal !== 'undefined') { setSaldoFinal(Number(saldoRes.saldoFinal ?? 0)) }
      else if (saldoRes && saldoRes.text) { console.warn('/saldo-final returned non-JSON:', saldoRes.text?.slice ? saldoRes.text.slice(0, 300) : saldoRes) }

      if (diarioRes && typeof diarioRes.total !== 'undefined') {
        setTotalSales(Number(diarioRes.total ?? 0));
      } else if (diarioRes && diarioRes.text) {
        console.warn('/somarDiaria returned non-JSON:', diarioRes.text?.slice ? diarioRes.text.slice(0, 300) : diarioRes);
      }

      if (mediaRes && mediaRes.sucesso !== false && typeof mediaRes.media !== 'undefined') {
        setTotalTransactions(Number(mediaRes.quantidade ?? 0));
        setAverageTransactionValue(Number(mediaRes.media ?? 0));
      }
      else if (mediaRes && mediaRes.text) { console.warn('/vendas/media-por-transacao returned non-JSON:', mediaRes.text?.slice ? mediaRes.text.slice(0, 300) : mediaRes); }

      if (pagamentosRes && pagamentosRes.sucesso !== false && pagamentosRes.detalhamento) {
        const det = pagamentosRes.detalhamento;
        setPaymentsBreakdown({
          PIX: Number(det.PIX ?? det.Pix ?? det.pix ?? 0),
          DINHEIRO: Number(det.DINHEIRO ?? det.Dinheiro ?? det.dinheiro ?? 0),
          CARTAO: Number(det.CARTAO ?? det.Cartao ?? det.cartao ?? 0),
        });
      }
      else if (pagamentosRes && pagamentosRes.text) { console.warn('/vendas/divisao-pagamentos returned non-JSON:', pagamentosRes.text?.slice ? pagamentosRes.text.slice(0, 300) : pagamentosRes) }

      console.log('📦 Resposta de produto mais vendido:', produtoRes);
      if (produtoRes && produtoRes.sucesso) {
        console.log('✅ Produto carregado:', produtoRes.estoqueProduto);
        setTopProduct(produtoRes.estoqueProduto || null);
      } else {
        console.warn('❌ Erro ao buscar produto mais vendido:', produtoRes);
      }

      try {
        const total = Number(diarioRes?.total ?? 0);
        const quantidade = Number(mediaRes?.quantidade ?? 0);
        const media = Number(mediaRes?.media ?? 0);
        const det = pagamentosRes?.detalhamento ?? {};
        setDailyStatsState({
          totalSales: total,
          totalTransactions: quantidade,
          averageTransaction: media,
          cashSales: Number(det.DINHEIRO ?? det.Dinheiro ?? det.dinheiro ?? 0),
          cardSales: Number(det.CARTAO ?? det.Cartao ?? det.cartao ?? 0),
          topProduct: produtoRes?.estoqueProduto?.nome ?? produtoRes?.estoqueProduto ?? null,
          peakHour: '—'
        });
      } catch (err) { console.debug('Erro ao montar dailyStatsState:', err) }

    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
      setFinanceError('Não foi possível carregar os dados financeiros.');
    }
    finally { setFinanceLoading(false); }

    // Produtos e usuários
    try {
      setProductsLoading(true); setProductsError(null);
      setCustomersLoading(true); setCustomersError(null);
      const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
      const produtosPromise = unidadeId ? safeFetchJson(ENDPOINTS.listarProdutosEstoque(unidadeId)) : safeFetchJson(ENDPOINTS.produtosList);
      const [produtosResp, usuariosResp] = await Promise.all([
        produtosPromise,
        safeFetchJson(ENDPOINTS.usuariosUnidadeListar)
      ]);

      // produtosResp can be several shapes depending on endpoint used:
      // - an array of products
      // - { produtos: [...] } (our produtosDoEstoqueController returns { id, descricao, produtos })
      // - { estoques: [...] } (older shape)
      if (Array.isArray(produtosResp)) {
        setProductsList(produtosResp.map((p) => ({
          ...p,
          sku: p.sku ?? p.barcode ?? p.codigo ?? p.id,
          barcode: p.barcode ?? p.sku ?? p.codigo ?? ''
        })));
      } else if (produtosResp && Array.isArray(produtosResp.produtos)) {
        // produtos from produtosDoEstoqueController -> map estoqueProdutos to UI product shape
        const mapped = produtosResp.produtos.map((ep) => ({
          id: ep.id,
          name: ep.nome ?? ep.produto?.nome ?? `Produto ${ep.id}`,
          price: Number(ep.precoUnitario ?? ep.preco ?? ep.price ?? 0),
          stock: Number(ep.qntdAtual ?? ep.quantidade ?? 0),
          category: ep.categoria ?? ep.produto?.categoria ?? '—',
          barcode: ep.sku ?? ep.codigo ?? '',
          sku: ep.sku ?? ep.codigo ?? '',
          image: ep.imagem ?? '/loja/placeholder/80/80'
        }));
        if (mapped.length) setProductsList(mapped);
      } else if (produtosResp && Array.isArray(produtosResp.estoques)) {
        const flattened = [];
        produtosResp.estoques.forEach(est => { (est.estoqueProdutos || []).forEach(ep => flattened.push({ id: ep.id, name: ep.nome ?? ep.produto?.nome, price: Number(ep.precoUnitario ?? ep.preco ?? ep.price ?? 0), stock: Number(ep.quantidade ?? ep.qntdAtual ?? 0), category: ep.categoria ?? ep.produto?.categoria ?? '—', barcode: ep.sku ?? ep.codigo ?? '', sku: ep.sku ?? ep.codigo ?? '', image: ep.imagem ?? '/loja/placeholder/80/80' })); });
        if (flattened.length) setProductsList(flattened);
      }
      else { if (produtosResp && produtosResp.ok === false) setProductsError(produtosResp.text || 'Erro ao carregar produtos') }

      if (usuariosResp && usuariosResp.sucesso && Array.isArray(usuariosResp.usuarios)) setCustomersList(usuariosResp.usuarios);
      else if (usuariosResp && usuariosResp.ok === false) setCustomersError(usuariosResp.text || 'Erro ao carregar clientes');
    } catch (err) {
      console.warn('Erro ao carregar produtos/usuarios:', err);
      setProductsError('Não foi possível carregar produtos.');
      setCustomersError('Não foi possível carregar clientes.');
    } finally {
      setProductsLoading(false);
      setCustomersLoading(false);
    }

    // Vendas recentes
    try {
      setSalesLoading(true); setSalesError(null);
      const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
      if (unidadeId) {
        const vendasResp = await safeFetchJson(ENDPOINTS.listarVendas(unidadeId));
        if (Array.isArray(vendasResp)) setRecentSalesList(vendasResp);
        else if (vendasResp && vendasResp.sucesso && Array.isArray(vendasResp.vendas)) setRecentSalesList(vendasResp.vendas);
        else if (vendasResp && Array.isArray(vendasResp.listaVendas)) setRecentSalesList(vendasResp.listaVendas);
        else if (vendasResp && vendasResp.ok === false) setSalesError(vendasResp.text || 'Erro ao carregar vendas');
      }
      else { setRecentSalesList([]); }
    } catch (err) {
      console.warn('Erro ao carregar vendas recentes:', err);
      setSalesError('Não foi possível carregar vendas recentes.');
    }
    finally { setSalesLoading(false); }
  };

  useEffect(() => { 
    loadFinance();
    verificarCaixaAberto();
  }, [fetchWithAuth, user]);
  return (
    <div className="min-h-screen px-18 py-10 bg-surface-50 gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas de Hoje</CardTitle>
            <ShoppingCart className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {financeLoading ? (
              <div className="text-sm text-muted-foreground">Carregando...</div>
            ) : financeError ? (<div className="text-sm text-red-600">{financeError}</div>) : (
              <>
                <div className="text-2xl font-bold">R$ {Number(totalSales).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <p className="text-xs text-muted-foreground">Total de vendas do dia</p>
              </>
            )}
          </CardContent>
        </Card> */}

        {/* Média por transação */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por transação</CardTitle>
            <BarChart className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {financeLoading ? (
              <div className="text-sm text-muted-foreground">Carregando...</div>
            ) : financeError ? (<div className="text-sm text-red-600">{financeError}</div>) : (
              <>
                <div className="text-2xl font-bold">R$ {Number(averageTransactionValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <p className="text-xs text-muted-foreground">{totalTransactions} transações hoje</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produto mais vendido</CardTitle>
            <BarChart className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {financeLoading ? (
              <div className="text-sm text-muted-foreground">Carregando...</div>
            ) : financeError ? (<div className="text-sm text-red-600">{financeError}</div>) : (
              <>
                <div className="text-2xl font-bold">{topProduct?.nome ? `${topProduct.nome}` : '—'}</div>
                <p className="text-xs text-muted-foreground">SKU: {topProduct.sku || '—'}</p>
              </>
            )}
          </CardContent>
        </Card>
        {/* Divisão por pagamentos / Produto mais vendido (compact) */}
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Divisão / Top produto</CardTitle>
            <Layers className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {financeLoading ? (<div className="text-sm text-muted-foreground">Carregando...</div>
            ) : financeError ? (
              <div className="text-sm text-red-600">{financeError}</div>) : (
              <div className="text-sm">
                <div className="flex justify-between"><span>PIX</span><strong>R$ {Number(paymentsBreakdown.PIX ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></div>
                <div className="flex justify-between"><span>Dinheiro</span><strong>R$ {Number(paymentsBreakdown.DINHEIRO ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></div>
                <div className="flex justify-between"><span>Cartão</span><strong>R$ {Number(paymentsBreakdown.CARTAO ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></div>
                <hr className="my-2" />
                <div className="text-xs text-muted-foreground">Produto mais vendido:</div>
                <div className="font-medium">{topProduct?.nome ? `${topProduct.nome}` : '—'}</div>
                {topProduct && (
                  <div className="text-xs text-muted-foreground mt-1">
                    <div className="flex justify-between">
                      <span>SKU:</span>
                      <span>{topProduct.sku || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marca:</span>
                      <span>{topProduct.marca || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vendido:</span>
                      <span>{topProduct.quantidadeVendida}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Preço:</span>
                      <span>R$ {Number(topProduct.precoUnitario ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estoque:</span>
                      <span>{topProduct.qntdAtual} un</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card> */}
      </div>

      <Tabs defaultValue="pos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pos">Frente de Caixa</TabsTrigger>
          <TabsTrigger value="sales">Histórico de Vendas</TabsTrigger>
        </TabsList>

        {!caixaAberto && (
          <Card className="border-neutral-300 dark:border-neutral-700 dark:bg-neutral-750">
            <CardHeader>
              <CardTitle className="text-neutral-900 dark:text-neutral-100">⚠️ Caixa não aberto</CardTitle>
              <CardDescription className="text-neutral-700 dark:text-neutral-300">Você precisa abrir o caixa antes de registrar vendas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label>Saldo inicial do caixa</Label>
                <Input type="number" value={saldoInicial} onChange={(e) => setSaldoInicial(e.target.value)} placeholder="0,00" step="0.01" />
                {saldoInicialError && <p className="text-sm text-red-600">{saldoInicialError}</p>}
              </div>
              <Button onClick={handleAbrirCaixa} disabled={abrindoCaixa} className="">
                {abrindoCaixa ? 'Abrindo caixa...' : '✓ Abrir Caixa'}
              </Button>
            </CardContent>
          </Card>
        )}

        {caixaAberto && (
          <Card className="border-neutral-300 dark:border-neutral-700 dark:bg-neutral-750">
            <CardHeader>
              <CardTitle className="text-neutral-900 dark:text-neutral-100">Caixa aberto</CardTitle>
              <CardDescription className="text-neutral-700 dark:text-neutral-300">Controle rápido do caixa do dia</CardDescription>
            </CardHeader>
              <CardContent className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                <div className="p-3 rounded-sm border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-650">
                  <div className="text-muted-foreground">Saldo inicial</div>
                  <div className="font-semibold">R$ {Number(caixaInfo?.saldoInicial ?? 0).toFixed(2)}</div>
                </div>
                <div className="p-3 rounded-sm border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-650">
                  <div className="text-muted-foreground">Total de vendas hoje</div>
                  <div className="font-semibold">R$ {Number(caixaInfo?.totalVendas ?? 0).toFixed(2)}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {/* <Button variant="outline" onClick={verificarCaixaAberto}>Atualizar status</Button> */}
                <Button onClick={handleFecharCaixa} disabled={fechandoCaixa}>
                  {fechandoCaixa ? 'Fechando...' : '✓ Fechar Caixa'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <TabsContent value="pos" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Seleção de Produtos */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Seleção de Produtos</CardTitle>
                  <CardDescription>Pesquisar e selecionar produtos para venda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input placeholder="Pesquise produtos com o leitor de código de barras..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                    </div>
                    {/* <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[180px]"><SelectValue placeholder="Categoria" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as categorias</SelectItem>
                        {categories.slice(1).map((category) => (<SelectItem key={category} value={category}>{category}</SelectItem>))}
                      </SelectContent>
                    </Select> */}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-h-96 overflow-y-auto">
                    {productsLoading ? (
                      <div className="text-sm text-muted-foreground p-4">Carregando produtos...</div>
                    ) : productsError ? (
                      <div className="text-sm text-red-600 p-4">{productsError} <Button variant="ghost" size="sm" onClick={() => loadFinance()}>Tentar novamente</Button></div>
                    ) : filteredProducts.length === 0 ? (
                      <div className="text-sm text-muted-foreground p-4">Nenhum produto encontrado</div>
                    ) : (
                      filteredProducts.map((product) => (
                        <Card
                          key={product.id}
                          className={`cursor-pointer hover:shadow-md transition-shadow ${!caixaAberto ? 'pointer-events-none opacity-60' : ''}`}
                          onClick={() => addToCart(product)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              {/* <img src={product.image || '/loja/placeholder/80/80'} alt={product.name} className="w-12 h-12 object-cover rounded" /> */}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{product.name}</div>
                                <div className="text-sm text-muted-foreground">{product.sku || product.barcode || '—'}</div>
                                <div className="flex justify-between items-center mt-1">
                                  <span className="font-bold text-green-600">R$ {(Number(product.price || 0)).toFixed(2)}</span>
                                  <span className="text-xs text-muted-foreground">Estoque: {product.stock ?? 0}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Carrinho e Checkout */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Carrinho de Compras</CardTitle>
                    <CardDescription>{cart.length} item(s)</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={clearCart}><Trash2 className="size-4" /></Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Cliente</Label>
                    <Input placeholder="Nome do cliente (opcional)" value={clienteNome} onChange={(e) => setClienteNome(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>CPF do cliente (opcional)</Label>
                    <Input
                      placeholder="000.000.000-00"
                      value={clienteCpf}
                      onChange={(e) => setClienteCpf(formatCpfInput(e.target.value))}
                    />
                  </div>

                  {/* Itens do Carrinho */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {cart.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">Carrinho vazio</div>
                    ) : (
                      cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{item.name}</div>
                            <div className="text-sm text-muted-foreground">R$ {item.price.toFixed(2)} cada</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="size-3" /></Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="size-3" /></Button>
                            <Button variant="outline" size="sm" onClick={() => removeFromCart(item.id)}><Trash2 className="size-3" /></Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Resumo do Carrinho */}
                  {cart.length > 0 && (
                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span><span>R$ {getSubtotal().toFixed(2)}</span>
                      </div>
                      {discountPercent > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Desconto ({discountPercent}%):</span><span>-R$ {getDiscountAmount().toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>Imposto (8%):</span><span>R$ {getTax().toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Total:</span><span>R$ {getTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  {/* Botão de Checkout */}
                  <Button className="w-full" disabled={cart.length === 0 || !caixaAberto} onClick={() => { setPaymentMessage(''); setIsPaymentOpen(true); }}>
                    <CreditCard className="size-4 mr-2" />Finalizar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* seleção de cliente substituída por input simples (clienteNome) */}

          {/* Modal de Pagamento */}
          <Dialog open={isPaymentOpen} onOpenChange={(open) => { setIsPaymentOpen(open); if (!open) setPaymentMessage(''); }}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Processar Pagamento</DialogTitle>
                <DialogDescription>Conclua a transação</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Forma de Pagamento</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Dinheiro</SelectItem>
                      <SelectItem value="credit">Cartão de Crédito</SelectItem>
                      <SelectItem value="debit">Cartão de Débito</SelectItem>
                      <SelectItem value="mobile">Pagamento Móvel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod === 'cash' && (
                  <div className="space-y-2">
                    <Label>Valor Recebido</Label><Input type="number" value={amountReceived} onChange={(e) => setAmountReceived(parseFloat(e.target.value) || 0)} placeholder="0.00" step="0.01" />
                  </div>
                )}

                <div className="space-y-2 p-4 bg-muted rounded">
                  <div className="flex justify-between">
                    <span>Valor Total:</span><span className="font-bold">R$ {getTotal().toFixed(2)}</span>
                  </div>
                  {paymentMethod === 'cash' && amountReceived > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span>Valor Recebido:</span><span>R$ {amountReceived.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Troco:</span><span className="font-bold text-green-600">R$ {getChange().toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>

                {paymentMessage && (
                  <div className="text-sm text-red-600">{paymentMessage}</div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsPaymentOpen(false)} className="flex-1">Cancelar</Button>
                  <Button onClick={processSale} className="flex-1" disabled={(paymentMethod === 'cash' && amountReceived < getTotal()) || emitindoNota}>
                    {emitindoNota ? 'Emitindo nota...' : 'Concluir Venda'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Vendas</CardTitle>
              <CardDescription>Transações recentes e dados de vendas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID da Transação</TableHead>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Itens</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Pagamento</TableHead>
                      <TableHead>Operador</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground">Carregando vendas...</TableCell>
                      </TableRow>
                    ) : salesError ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-red-600">{salesError} <Button variant="ghost" size="sm" onClick={() => loadFinance()}>Tentar novamente</Button></TableCell>
                      </TableRow>
                    ) : recentSalesList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground">Nenhuma venda encontrada</TableCell>
                      </TableRow>
                    ) : (
                      recentSalesList.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell className="font-medium">{sale.id}</TableCell>
                          <TableCell>{sale.data ?? sale.date}</TableCell>
                          <TableCell>{sale.nomeCliente ?? sale.customer}</TableCell>
                          <TableCell>{sale.itens ?? sale.items}</TableCell>
                          <TableCell>R$ {Number(sale.total ?? sale.valor ?? 0).toFixed(2)}</TableCell>
                          <TableCell>{sale.pagamento ?? sale.paymentMethod}</TableCell>
                          <TableCell>{sale.usuarioNome ?? sale.cashier}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Ver</Button>
                              <Button variant="outline" size="sm">Imprimir</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
