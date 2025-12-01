"use client"
import React, { useState , useEffect} from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Search, ShoppingCart, CreditCard, User, Barcode, Percent, Receipt, Trash2 , BarChart, DollarSign, Layers, } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";
import { usePerfilProtegido } from '@/hooks/usePerfilProtegido';


const products = [
  { id: 'PROD-001', name: 'Wireless Headphones', price: 89.99, stock: 45, category: 'Electronics', barcode: '123456789012', image: '/api/placeholder/80/80' },
  { id: 'PROD-002', name: 'Office Chair', price: 299.99, stock: 8, category: 'Furniture', barcode: '123456789013', image: '/api/placeholder/80/80' },
  { id: 'PROD-003', name: 'Water Bottle', price: 24.99, stock: 120, category: 'Home & Garden', barcode: '123456789014', image: '/api/placeholder/80/80' },
  { id: 'PROD-004', name: 'Laptop Stand', price: 45.00, stock: 32, category: 'Electronics', barcode: '123456789015', image: '/api/placeholder/80/80' },
  { id: 'PROD-005', name: 'Yoga Mat', price: 69.99, stock: 35, category: 'Sports & Fitness', barcode: '123456789016', image: '/api/placeholder/80/80' },
  { id: 'PROD-006', name: 'Coffee Mug', price: 12.99, stock: 78, category: 'Home & Garden', barcode: '123456789017', image: '/api/placeholder/80/80' },
  { id: 'PROD-007', name: 'USB Cable', price: 19.99, stock: 156, category: 'Electronics', barcode: '123456789018', image: '/api/placeholder/80/80' },
  { id: 'PROD-008', name: 'Desk Lamp', price: 89.99, stock: 23, category: 'Furniture', barcode: '123456789019', image: '/api/placeholder/80/80' }
];

const customers = [
  { id: 'CUST-001', name: 'John Smith', email: 'john@email.com', phone: '+1-555-0101', loyaltyPoints: 1250 },
  { id: 'CUST-002', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1-555-0102', loyaltyPoints: 890 },
  { id: 'CUST-003', name: 'Michael Chen', email: 'michael@email.com', phone: '+1-555-0103', loyaltyPoints: 2340 },
  { id: 'CUST-004', name: 'Emily Rodriguez', email: 'emily@email.com', phone: '+1-555-0104', loyaltyPoints: 567 }
];

const recentSales = [
  {id: 'TXN-001',date: '2024-01-26 14:23',customer: 'John Smith',items: 3,total: 234.97,paymentMethod: 'Credit Card',cashier: 'Alice Wilson',status: 'completed'},
  {id: 'TXN-002',date: '2024-01-26 14:18',customer: 'Walk-in Customer',items: 1,total: 89.99,paymentMethod: 'Cash',cashier: 'Bob Johnson',status: 'completed'},
  {id: 'TXN-003',date: '2024-01-26 14:12',customer: 'Sarah Johnson',items: 2,total: 159.98,paymentMethod: 'Debit Card',cashier: 'Alice Wilson',status: 'completed'}
];

const dailyStats = {
  totalSales: 2847.65,
  totalTransactions: 24,
  averageTransaction: 118.65,
  cashSales: 856.43,
  cardSales: 1991.22,
  topProduct: 'Wireless Headphones',
  peakHour: '14:00 - 15:00'
};

//---- POSModule ------
export default function POSModule() {
  const { fetchWithAuth } = useAuth();
  usePerfilProtegido("GERENTE_LOJA");

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
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isCustomerSelectOpen, setIsCustomerSelectOpen] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountReceived, setAmountReceived] = useState(0);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch = term === '' || product.name.toLowerCase().includes(term) || (product.barcode && product.barcode.includes(term));
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    setCart((c) => {
      const existing = c.find(i => i.id === product.id);
      if (existing) {
        return c.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...c, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const updateQuantity = (id, newQuantity) => {
    setCart((c) => c.map(i => i.id === id ? { ...i, quantity: Math.max(0, newQuantity) } : i).filter(i => i.quantity > 0));
  };

  const removeFromCart = (id) => { setCart((c) => c.filter(i => i.id !== id)); };
  const getSubtotal = () => cart.reduce((s, i) => s + (Number(i.price || 0) * Number(i.quantity || 0)), 0);
  const getDiscountAmount = () => (getSubtotal() * (Number(discountPercent || 0) / 100));
  const getTax = () => ((getSubtotal() - getDiscountAmount()) * 0.08);
  const getTotal = () => (getSubtotal() - getDiscountAmount() + getTax());
  const getChange = () => Math.max(0, Number(amountReceived || 0) - getTotal());
  const clearCart = () => { setCart([]); setDiscountPercent(0); setAmountReceived(0); };
  // Resilient fetch helper: try fetchWithAuth (context), fallback to direct fetch to API_URL with credentials included
  const safeFetchJson = async (path, opts = {}) => {
    const makeUrl = (p) => {
      if (!p) return p;
      // if path already absolute, return as-is
      if (/^https?:\/\//i.test(p)) return p;
      const defaultBase = 'http://localhost:3000/api';
      const rawBase = (API_URL && API_URL.trim()) || defaultBase;
      const base = rawBase.replace(/\/$/, ''); // remove trailing slash

      // normalize endpoint to start with '/'
      let endpoint = p.startsWith('/') ? p : `/${p}`;

      // If endpoint already contains /api at start, avoid duplicating it
      if (endpoint.startsWith('/api/')) {
        if (base.endsWith('/api')) return base + endpoint.slice(4); // remove '/api' from endpoint
        return base + endpoint;
      }

      // endpoint does not start with /api
      if (base.endsWith('/api')) return base + endpoint; // base already provides /api
      return base + '/api' + endpoint; // add /api between
    };

    // try fetchWithAuth first (keeps existing auth flow)
    if (typeof fetchWithAuth === 'function') {
      try {
        const url = makeUrl(path);
        const resp = await fetchWithAuth(url, opts);
        const contentType = resp.headers && resp.headers.get ? resp.headers.get('content-type') || '' : '';
        if (!resp.ok) {
          const txt = await resp.text().catch(() => null);
          return { ok: false, status: resp.status, text: txt };
        }
        if (contentType.includes('application/json')) return await resp.json().catch((e) => ({ ok: false, parseError: e.message }));
        const text = await resp.text().catch(() => null);
        return { ok: false, text };
      } catch (err) {
        console.debug('fetchWithAuth failed, falling back to direct fetch:', err.message || err);
      }
    }

    // fallback: direct fetch to API_URL with credentials included
    try {
      const url = makeUrl(path);
      const merged = { credentials: 'include', headers: { 'Content-Type': 'application/json' }, ...opts };
      const resp = await fetch(url, merged);
      const contentType = resp.headers.get('content-type') || '';
      if (!resp.ok) {
        const txt = await resp.text().catch(() => null);
        return { ok: false, status: resp.status, text: txt };
      }
      if (contentType.includes('application/json')) return await resp.json().catch((e) => ({ ok: false, parseError: e.message }));
      const text = await resp.text().catch(() => null);
      return { ok: false, text };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  };

  const processSale = async () => {
    if (!cart || cart.length === 0) {
      alert('Carrinho vazio. Adicione produtos antes de finalizar.');
      return;
    }

    try {
      const itens = cart.map((i) => {
        const numeric = Number(i.id);
        if (!Number.isNaN(numeric) && Number.isFinite(numeric) && numeric > 0) {
          return { produtoId: numeric, quantidade: Number(i.quantity || 1), precoUnitario: Number(i.price || 0), desconto: 0 };
        }
        return { produtoSku: String(i.id), quantidade: Number(i.quantity || 1), precoUnitario: Number(i.price || 0), desconto: 0 };
      });

      const payload = { pagamento: paymentMethod, itens };

      const resp = await safeFetchJson('/vendas/criar', { method: 'POST', body: JSON.stringify(payload) });

      if (!resp || resp.sucesso === false) {
        console.error('Erro ao criar venda', resp);
        alert('Erro ao registrar venda. Veja o console para detalhes.');
        return;
      }

      alert('Venda registrada com sucesso!');
      clearCart();
      setIsPaymentOpen(false);

      // atualizar saldo final
      const s = await safeFetchJson('/saldo-final');
      if (s && typeof s.saldoFinal !== 'undefined') setSaldoFinal(Number(s.saldoFinal ?? 0));

    } catch (error) {
      console.error('Erro ao processar venda:', error);
      alert('Erro ao processar venda. Veja console para detalhes.');
    }
  };
  useEffect(() => {
    let mounted = true;

    

    const loadFinance = async () => {
      try {
        const [saldoRes, mediaRes, pagamentosRes, produtoRes] = await Promise.all([
          safeFetchJson('/saldo-final'),
          safeFetchJson('/vendas/media-por-transacao'),
          safeFetchJson('/vendas/divisao-pagamentos'),
          safeFetchJson('/financeiro/produto-mais-vendido'),
        ]);

        if (!mounted) return;

        if (saldoRes && saldoRes.sucesso !== false && typeof saldoRes.saldoFinal !== 'undefined') {
          setSaldoFinal(Number(saldoRes.saldoFinal ?? 0));
        } else if (saldoRes && saldoRes.text) {
          console.warn('/saldo-final returned non-JSON:', saldoRes.text?.slice ? saldoRes.text.slice(0, 300) : saldoRes);
        }

        if (mediaRes && mediaRes.sucesso !== false && typeof mediaRes.media !== 'undefined') {
          setTotalSales(Number(mediaRes.total ?? 0));
          setTotalTransactions(Number(mediaRes.quantidade ?? 0));
          setAverageTransactionValue(Number(mediaRes.media ?? 0));
        } else if (mediaRes && mediaRes.text) {
          console.warn('/vendas/media-por-transacao returned non-JSON:', mediaRes.text?.slice ? mediaRes.text.slice(0, 300) : mediaRes);
        }

        if (pagamentosRes && pagamentosRes.sucesso !== false && pagamentosRes.detalhamento) {
          const det = pagamentosRes.detalhamento;
          setPaymentsBreakdown({
            PIX: Number(det.PIX ?? det.Pix ?? det.pix ?? 0),
            DINHEIRO: Number(det.DINHEIRO ?? det.Dinheiro ?? det.dinheiro ?? 0),
            CARTAO: Number(det.CARTAO ?? det.Cartao ?? det.cartao ?? 0),
          });
        } else if (pagamentosRes && pagamentosRes.text) {
          console.warn('/vendas/divisao-pagamentos returned non-JSON:', pagamentosRes.text?.slice ? pagamentosRes.text.slice(0, 300) : pagamentosRes);
        }

        if (produtoRes && produtoRes.sucesso) {
          setTopProduct(produtoRes.produto || null);
        } else if (produtoRes && produtoRes.text) {
          console.warn('/financeiro/produto-mais-vendido returned non-JSON:', produtoRes.text?.slice ? produtoRes.text.slice(0, 300) : produtoRes);
        }

      } catch (error) {
        console.error('Erro ao carregar dados financeiros:', error);
      }
    };

    loadFinance();
    return () => { mounted = false; };
  }, [fetchWithAuth]);
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas de Hoje</CardTitle>
              <ShoppingCart className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {Number(totalSales).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <p className="text-xs text-muted-foreground">{totalTransactions} transações</p>
            </CardContent>
          </Card>

         

          {/* Média por transação */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média por transação</CardTitle>
              <BarChart className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {Number(averageTransactionValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <p className="text-xs text-muted-foreground">{totalTransactions} transações hoje</p>
            </CardContent>
          </Card>

          {/* Divisão por pagamentos / Produto mais vendido (compact) */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Divisão / Top produto</CardTitle>
              <Layers className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div className="flex justify-between"><span>PIX</span><strong>R$ {Number(paymentsBreakdown.PIX ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></div>
                <div className="flex justify-between"><span>Dinheiro</span><strong>R$ {Number(paymentsBreakdown.DINHEIRO ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></div>
                <div className="flex justify-between"><span>Cartão</span><strong>R$ {Number(paymentsBreakdown.CARTAO ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></div>
                <hr className="my-2" />
                <div className="text-xs text-muted-foreground">Produto mais vendido:</div>
                <div className="font-medium">{topProduct ? `${topProduct.nome} (${topProduct.quantidadeVendida})` : '—'}</div>
              </div>
            </CardContent>
          </Card>
        

        

       

       
      </div>

      <Tabs defaultValue="pos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pos">Frente de Caixa</TabsTrigger>
          <TabsTrigger value="sales">Histórico de Vendas</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
          <TabsTrigger value="reports">Relatórios Diários</TabsTrigger>
        </TabsList>

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
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[180px]"><SelectValue placeholder="Categoria" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as categorias</SelectItem>
                        {categories.slice(1).map((category) => (<SelectItem key={category} value={category}>{category}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-h-96 overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => addToCart(product)}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{product.name}</div>
                              <div className="text-sm text-muted-foreground">{product.category}</div>
                              <div className="flex justify-between items-center mt-1">
                                <span className="font-bold text-green-600">R$ {product.price.toFixed(2)}</span>
                                <span className="text-xs text-muted-foreground">Estoque: {product.stock}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 justify-start" onClick={() => setIsCustomerSelectOpen(true)}>
                        <User className="size-4 mr-2" />{selectedCustomer ? selectedCustomer.name : 'Cliente avulso'}
                      </Button>
                      {selectedCustomer && (<Button variant="outline" size="sm" onClick={() => setSelectedCustomer(null)}>Limpar</Button>)}
                    </div>
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
                  <Button className="w-full" disabled={cart.length === 0} onClick={() => setIsPaymentOpen(true)}>
                    <CreditCard className="size-4 mr-2" />Finalizar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Modal de Seleção de Cliente */}
          <Dialog open={isCustomerSelectOpen} onOpenChange={setIsCustomerSelectOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Selecionar Cliente</DialogTitle>
                <DialogDescription>Escolha um cliente existente ou prossiga como cliente avulso</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Buscar clientes..." />
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {customers.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-muted" onClick={() => {setSelectedCustomer(customer);setIsCustomerSelectOpen(false);}}>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                      </div>
                      <div className="text-sm"><Badge variant="outline">{customer.loyaltyPoints} pts</Badge></div>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Modal de Pagamento */}
          <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
            <DialogContent>
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

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsPaymentOpen(false)} className="flex-1">Cancelar</Button>
                  <Button onClick={processSale} className="flex-1" disabled={paymentMethod === 'cash' && amountReceived < getTotal()}>Concluir Venda</Button>
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
                    {recentSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.id}</TableCell>
                        <TableCell>{sale.date}</TableCell>
                        <TableCell>{sale.customer}</TableCell>
                        <TableCell>{sale.items}</TableCell>
                        <TableCell>R$ {sale.total.toFixed(2)}</TableCell>
                        <TableCell>{sale.paymentMethod}</TableCell>
                        <TableCell>{sale.cashier}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Ver</Button>
                            <Button variant="outline" size="sm">Imprimir</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Clientes</CardTitle>
              <CardDescription>Pesquisar e gerenciar informações dos clientes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input placeholder="Buscar clientes..." className="pl-10" />
                </div>
                <Button>Adicionar Cliente</Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {customers.map((customer) => (
                  <Card key={customer.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">{customer.email}</div>
                          <div className="text-sm text-muted-foreground">{customer.phone}</div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{customer.loyaltyPoints} pts</Badge>
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm">Editar</Button>
                            <Button variant="outline" size="sm">Histórico</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader><CardTitle>Resumo Diário</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Vendas Totais:</span>
                    <span className="font-bold">R$ {dailyStats.totalSales.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transações:</span>
                    <span>{dailyStats.totalTransactions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Média por Transação:</span>
                    <span>R$ {dailyStats.averageTransaction.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hora de Pico:</span>
                    <span className="text-sm">{dailyStats.peakHour}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Dinheiro</span>
                      <span>R$ {dailyStats.cashSales.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(dailyStats.cashSales / dailyStats.totalSales) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cartão</span>
                      <span>R$ {dailyStats.cardSales.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(dailyStats.cardSales / dailyStats.totalSales) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Produtos Principais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Wireless Headphones</span><span>12 vendidos</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Coffee Mug</span><span>8 vendidos</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>USB Cable</span><span>6 vendidos</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Water Bottle</span><span>5 vendidos</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Gerar Relatórios</CardTitle>
              <CardDescription>Criar relatórios detalhados de vendas e desempenho</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Receipt className="size-6 mb-2" />Vendas Diárias
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Barcode className="size-6 mb-2" />Desempenho do Produto
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <User className="size-6 mb-2" />Relatório de Clientes
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <CreditCard className="size-6 mb-2" />Análise de Pagamentos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
