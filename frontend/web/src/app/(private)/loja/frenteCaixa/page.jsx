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
  peakHour: '2:00 PM - 3:00 PM'
};

//---- POSModule ------
export default function POSModule() {
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
    if (existingItem) {setCart(cart.map(item =>item.id === product.id ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price } : item))}
    else {setCart([...cart, {id: product.id, name: product.name, price: product.price, quantity: 1, total: product.price}])}
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
    // In a real implementation, this would process the payment and update inventory
    console.log('Processing sale:', {
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
      {/* POS Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <ShoppingCart className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dailyStats.totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{dailyStats.totalTransactions} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
            <Receipt className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dailyStats.averageTransaction.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Split</CardTitle>
            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <div className="flex justify-between">
                <span>Cash:</span><span>${dailyStats.cashSales.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Card:</span><span>${dailyStats.cardSales.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Product</CardTitle>
            <Barcode className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{dailyStats.topProduct}</div>
            <p className="text-xs text-muted-foreground">Best selling today</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pos">Point of Sale</TabsTrigger>
          <TabsTrigger value="sales">Sales History</TabsTrigger>
          <TabsTrigger value="customers">Customer Lookup</TabsTrigger>
          <TabsTrigger value="reports">Daily Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="pos" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Product Selection */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Product Selection</CardTitle>
                  <CardDescription>Search and select products for sale</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input placeholder="Pesquise produtos com o leitor de código de barras..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
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
                                <span className="font-bold text-green-600">${product.price.toFixed(2)}</span>
                                <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>
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

            {/* Shopping Cart and Checkout */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Shopping Cart</CardTitle>
                    <CardDescription>{cart.length} items</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={clearCart}><Trash2 className="size-4" /></Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Customer</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 justify-start" onClick={() => setIsCustomerSelectOpen(true)}>
                        <User className="size-4 mr-2" />{selectedCustomer ? selectedCustomer.name : 'Walk-in Customer'}
                      </Button>
                      {selectedCustomer && (<Button variant="outline" size="sm" onClick={() => setSelectedCustomer(null)}>Clear</Button>)}
                    </div>
                  </div>

                  {/* Cart Items */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {cart.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">Cart is empty</div>
                    ) : (cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{item.name}</div>
                            <div className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</div>
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

                  {/* Discount */}
                  {cart.length > 0 && (
                    <div className="space-y-2">
                      <Label>Discount %</Label>
                      <div className="flex gap-2">
                        <Input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)} placeholder="0" min="0" max="100" />
                        <Button variant="outline" size="sm"><Percent className="size-4" /></Button>
                      </div>
                    </div>
                  )}

                  {/* Cart Summary */}
                  {cart.length > 0 && (
                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span><span>${getSubtotal().toFixed(2)}</span>
                      </div>
                      {discountPercent > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount ({discountPercent}%):</span><span>-${getDiscountAmount().toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>Tax (8%):</span><span>${getTax().toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Total:</span><span>${getTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  {/* Checkout Button */}
                  <Button className="w-full" disabled={cart.length === 0} onClick={() => setIsPaymentOpen(true)}>
                    <CreditCard className="size-4 mr-2" />Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Customer Selection Modal */}
          <Dialog open={isCustomerSelectOpen} onOpenChange={setIsCustomerSelectOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select Customer</DialogTitle>
                <DialogDescription>Choose an existing customer or continue as walk-in</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Search customers..." />
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

          {/* Payment Modal */}
          <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Process Payment</DialogTitle>
                <DialogDescription>Complete the transaction</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="credit">Credit Card</SelectItem>
                      <SelectItem value="debit">Debit Card</SelectItem>
                      <SelectItem value="mobile">Mobile Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod === 'cash' && (
                  <div className="space-y-2">
                    <Label>Amount Received</Label><Input type="number" value={amountReceived} onChange={(e) => setAmountReceived(parseFloat(e.target.value) || 0)} placeholder="0.00" step="0.01" />
                  </div>
                )}

                <div className="space-y-2 p-4 bg-muted rounded">
                  <div className="flex justify-between">
                    <span>Total Amount:</span><span className="font-bold">${getTotal().toFixed(2)}</span>
                  </div>
                  {paymentMethod === 'cash' && amountReceived > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span>Amount Received:</span><span>${amountReceived.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Change:</span><span className="font-bold text-green-600">${getChange().toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsPaymentOpen(false)} className="flex-1">Cancel</Button>
                  <Button onClick={processSale} className="flex-1" disabled={paymentMethod === 'cash' && amountReceived < getTotal()}>Complete Sale</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales History</CardTitle>
              <CardDescription>Recent transactions and sales data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Cashier</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.id}</TableCell>
                        <TableCell>{sale.date}</TableCell>
                        <TableCell>{sale.customer}</TableCell>
                        <TableCell>{sale.items}</TableCell>
                        <TableCell>${sale.total.toFixed(2)}</TableCell>
                        <TableCell>{sale.paymentMethod}</TableCell>
                        <TableCell>{sale.cashier}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Print</Button>
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
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>Search and manage customer information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input placeholder="Search customers..." className="pl-10" />
                </div>
                <Button>Add Customer</Button>
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
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">History</Button>
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
              <CardHeader><CardTitle>Daily Summary</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Sales:</span>
                    <span className="font-bold">${dailyStats.totalSales.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transactions:</span>
                    <span>{dailyStats.totalTransactions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Transaction:</span>
                    <span>${dailyStats.averageTransaction.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Peak Hour:</span>
                    <span className="text-sm">{dailyStats.peakHour}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cash</span>
                      <span>${dailyStats.cashSales.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(dailyStats.cashSales / dailyStats.totalSales) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Card</span>
                      <span>${dailyStats.cardSales.toFixed(2)}</span>
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
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Wireless Headphones</span><span>12 sold</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Coffee Mug</span><span>8 sold</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>USB Cable</span><span>6 sold</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Water Bottle</span><span>5 sold</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Generate Reports</CardTitle>
              <CardDescription>Create detailed sales and performance reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Receipt className="size-6 mb-2" />Daily Sales
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Barcode className="size-6 mb-2" />Product Performance
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <User className="size-6 mb-2" />Customer Report
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <CreditCard className="size-6 mb-2" />Payment Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}