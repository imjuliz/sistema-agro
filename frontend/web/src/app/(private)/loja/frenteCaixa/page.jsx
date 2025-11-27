"use client"
import React, { useState } from 'react';
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
import { Plus, Minus, Search, ShoppingCart, CreditCard, User, Barcode, Percent, Receipt, Trash2 } from 'lucide-react';
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
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price } : item))
    } else {
      setCart([...cart, {id: product.id, name: product.name, price: product.price, quantity: 1, total: product.price}])
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) { setCart(cart.filter(item => item.id !== id)); }
    else {setCart(cart.map(item =>item.id === id ? { ...item, quantity: newQuantity, total: newQuantity * item.price } : item))}
  };

  const removeFromCart = (id) => { setCart(cart.filter(item => item.id !== id)); };
  const getSubtotal = () => { return cart.reduce((sum, item) => sum + item.total, 0); };
  const getDiscountAmount = () => { return getSubtotal() * (discountPercent / 100); };
  const getTax = () => { return (getSubtotal() - getDiscountAmount()) * 0.08; }; // 8% tax
  const getTotal = () => { return getSubtotal() - getDiscountAmount() + getTax(); };
  const getChange = () => { return paymentMethod === 'cash' ? Math.max(0, amountReceived - getTotal()) : 0; };
  const clearCart = () => { setCart([]); setSelectedCustomer(null); setDiscountPercent(0); setAmountReceived(0); };
  const processSale = () => {
    // Em produção, aqui processaria o pagamento e atualizaria o estoque
    console.log('Processando venda:', {
      cart,
      customer: selectedCustomer,
      subtotal: getSubtotal(),
      discount: getDiscountAmount(),
      tax: getTax(),
      total: getTotal(),
      paymentMethod,
      amountReceived: paymentMethod === 'cash' ? amountReceived : getTotal(),
      change: getChange()
    });

    clearCart();
    setIsPaymentOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Visão geral POS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas de Hoje</CardTitle>
            <ShoppingCart className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {dailyStats.totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">{dailyStats.totalTransactions} transações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Transação</CardTitle>
            <Receipt className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {dailyStats.averageTransaction.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Por transação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Divisão de Pagamentos</CardTitle>
            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <div className="flex justify-between">
                <span>Dinheiro:</span><span>R$ {dailyStats.cashSales.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cartão:</span><span>R$ {dailyStats.cardSales.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produto em Destaque</CardTitle>
            <Barcode className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{dailyStats.topProduct}</div>
            <p className="text-xs text-muted-foreground">Mais vendido hoje</p>
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
                    ) : (cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{item.name}</div>
                            <div className="text-sm text-muted-foreground">R$ {item.price.toFixed(2)} cada</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="size-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="size-3" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => removeFromCart(item.id)}><Trash2 className="size-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Desconto */}
                  {cart.length > 0 && (
                    <div className="space-y-2">
                      <Label>Desconto %</Label>
                      <div className="flex gap-2">
                        <Input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)} placeholder="0" min="0" max="100" />
                        <Button variant="outline" size="sm"><Percent className="size-4" /></Button>
                      </div>
                    </div>
                  )}

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
