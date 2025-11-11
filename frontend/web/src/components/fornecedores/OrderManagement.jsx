'use client'

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Package, Clock, CheckCircle, XCircle, Truck, Eye, MessageSquare, Calendar, DollarSign, Search, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function OrderManagement({ userType }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPedidos, setSelectedPedidos] = useState(null);
  const [searchPedidos, setSearchPedidos] = useState('');
  const [selectedPedidosCategory, setSelectedPedidosCategory] = useState('all');
  const categoriesPedidos = ['all', 'Pendente', 'A caminho', 'Entregue', 'Cancelado',];

  const orders = [
    {
      id: 'ORD-001',
      customer: userType === 'supplier' ? 'Bella Vista Restaurant' : 'Fresh Valley Farms',
      items: [
        { name: 'Premium Ribeye Steaks', quantity: 20, price: 24.99 },
        { name: 'Organic Mixed Greens', quantity: 5, price: 8.50 }
      ],
      total: 542.30,
      status: 'Pendente',
      date: '2024-01-15',
      estimatedDelivery: '2024-01-17',
      notes: 'Please ensure cold chain delivery',
      priority: 'alta'
    },
    {
      id: 'ORD-002',
      customer: userType === 'supplier' ? 'Grand Hotel Kitchen' : 'Premium Meats Co.',
      items: [
        { name: 'Fresh Atlantic Salmon', quantity: 15, price: 18.99 },
        { name: 'Artisan Sourdough Bread', quantity: 24, price: 6.75 }
      ],
      total: 446.85,
      status: 'Entregue',
      date: '2024-01-14',
      estimatedDelivery: '2024-01-16',
      notes: 'Regular delivery time is fine',
      priority: 'normal'
    },
    {
      id: 'ORD-003',
      customer: userType === 'supplier' ? 'Metro Bistro' : 'Ocean Fresh Seafood',
      items: [{ name: 'Organic Mixed Greens', quantity: 10, price: 8.50 }],
      total: 85.00,
      status: 'A caminho',
      date: '2024-01-12',
      estimatedDelivery: '2024-01-14',
      notes: '',
      priority: 'normal'
    },
    {
      id: 'ORD-004',
      customer: userType === 'supplier' ? 'Seaside Cafe' : 'Artisan Bakery Supply',
      items: [
        { name: 'Artisan Sourdough Bread', quantity: 12, price: 6.75 },
        { name: 'Premium Ribeye Steaks', quantity: 8, price: 24.99 }
      ],
      total: 280.92,
      status: 'Cancelado',
      date: '2024-01-10',
      estimatedDelivery: '2024-01-12',
      notes: 'Customer requested cancellation due to event postponement',
      priority: 'baixa'
    }
  ];

  // decide qual filtro de status usar: select tem prioridade; se select === 'all' usamos activeTab
   const statusFilter = selectedPedidosCategory !== 'all' ? selectedPedidosCategory : activeTab;
 
   // memoize filtro por performance
   const filteredOrders = useMemo(() => {
     const q = (searchPedidos || '').trim().toLowerCase();
 
     return orders.filter(order => {
       // filtro por status
       if (statusFilter && statusFilter !== 'all') {
         if (order.status !== statusFilter) return false;
       }
 
       // filtro por busca
       if (!q) return true;
 
       const inId = order.id.toLowerCase().includes(q);
       const inCustomer = order.customer.toLowerCase().includes(q);
       const inStatus = order.status.toLowerCase().includes(q);
       const inDate = (order.date || '').toLowerCase().includes(q);
       const inItems = (order.items || []).some(i => (i.name || '').toLowerCase().includes(q));
 
       return inId || inCustomer || inStatus || inDate || inItems;
     });
   }, [orders, searchPedidos, selectedPedidosCategory, activeTab, statusFilter]);
 
   const getStatusIcon = (status) => {
     switch (status) {
       case 'Pendente': return <Clock className="h-4 w-4" />;
       case 'Entregue': return <CheckCircle className="h-4 w-4" />;
       case 'A caminho': return <Truck className="h-4 w-4" />;
       case 'Cancelado': return <XCircle className="h-4 w-4" />;
       default: return <Package className="h-4 w-4" />;
     }
   };
 
   const getStatusVariant = (status) => {
     switch (status) {
       case 'Pendente': return 'outline';
       case 'Entregue': return 'default';
       case 'A caminho': return 'secondary';
       case 'Cancelado': return 'destructive';
       default: return 'secondary';
     }
   };
 
   const getPriorityColor = (priority) => {
     switch (priority) {
       case 'Alta': return 'text-red-600';
       case 'Normal': return 'text-blue-600';
       case 'Baixa': return 'text-gray-600';
       default: return 'text-gray-600';
     }
   };
 
 const OrderDetails = ({ order }) => (
     <Dialog>
       <DialogTrigger asChild>
         <Button variant="outline" size="sm">
           <Eye className="h-4 w-4 mr-1" />Visualizar
         </Button>
       </DialogTrigger>
       <DialogContent className="max-w-2xl">
         <DialogHeader>
           <DialogTitle>Detalhes - {order.id}</DialogTitle>
         </DialogHeader>
         <div className="space-y-6">
           <div className="grid grid-cols-2 gap-4">
             <div>
               <Label>Consumidor/Fornecedor</Label>
               <p className='mt-3'>{order.customer}</p>
             </div>
             <div>
               <Label>Status</Label>
               <div className="flex items-center gap-2 mt-3">
                 <Badge variant={getStatusVariant(order.status)}>
                   {getStatusIcon(order.status)}
                   {order.status}
                 </Badge>
               </div>
             </div>
             <div className='mt-3'>
               <Label>Data do Pedido</Label>
               <p className='mt-3'>{new Date(order.date).toLocaleDateString()}</p>
             </div>
             <div>
               <Label>Entrega Estimada</Label>
               <p className='mt-3'>{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
             </div>
           </div>
 
           <div>
             <Label>Itens Comprados</Label>
             <div className="mt-2 space-y-2">
               {order.items.map((item, index) => (
                 <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                   <div>
                     <p>{item.name}</p>
                     <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                   </div>
                   <div className="text-right">
                     <p>R$ {item.price.toFixed(2)} cada</p>
                     <p className="text-sm">R$ {(item.quantity * item.price).toFixed(2)}</p>
                   </div>
                 </div>
               ))}
             </div>
             <div className="mt-4 p-3 bg-muted rounded-lg">
               <div className="flex justify-between items-center">
                 <span>Total:</span>
                 <span className="text-lg">R$ {order.total.toFixed(2)}</span>
               </div>
             </div>
           </div>
 
           {order.notes && (
             <div>
               <Label>Order Notes</Label>
               <p className="mt-1 p-3 bg-muted rounded-lg">{order.notes}</p>
             </div>
           )}
 
           {userType === 'supplier' && order.status === 'Pendente' && (
             <div className="flex gap-2">
               <Button variant="outline" className="flex-1">
                 <XCircle className="h-4 w-4 mr-2" />
                 Rejeitar Pedido
               </Button>
               <Button className="flex-1">
                 <CheckCircle className="h-4 w-4 mr-2" />
                 Confirmar Pedido
               </Button>
             </div>
           )}
         </div>
       </DialogContent>
     </Dialog>
   );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-0">
        <h2 className="text-lg font-semibold mb-3">{userType === 'supplier' ? 'Order Management' : 'Pedidos'}</h2>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          {/* BARRA DE PESQUISA*/}
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Buscar pedido..." value={searchPedidos} onChange={(e) => setSearchPedidos(e.target.value)} className="pl-10" />
        </div>
        {/* SELECT DE PEDIDOS POR STATUS */}
        <Select value={selectedPedidosCategory} onValueChange={(val) => setSelectedPedidosCategory(val)}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categoriesPedidos.map((category) => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'Todos os pedidos' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* LISTAGEM DE PEDIDOS */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-3">
            {filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="px-6">
                  <div className="flex items-start justify-between gap-6 flex-col">
                    <div className="space-y-2 w-full">
                      <div className="flex items-center gap-4">
                        <h4>{order.id}</h4>
                        <Badge variant={getStatusVariant(order.status)} className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status}
                        </Badge>
                        <span className={`text-sm ${getPriorityColor(order.priority)}`}>
                          Prioridade {order.priority}
                        </span>
                      </div>

                      <p className="text-muted-foreground">
                        {userType === 'supplier' ? 'Customer:' : 'Fornecedor:'} {order.customer}
                      </p>

                    </div>

                    <div className="text-right space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-lg">R$ {order.total.toFixed(2)}</span>
                      </div>

                      <div className="flex gap-2">
                        <OrderDetails order={order} />
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Bate-papo
                        </Button>
                        {userType === 'supplier' && order.status === 'Pendente' && (
                          <Button size="sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Processar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-muted-foreground">Nenhum pedido encontrado</h4>
              <p className="text-muted-foreground">
                {statusFilter === 'all'
                  ? ''
                  : `Nenhum pedido ${statusFilter} encontrado`
                }
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}