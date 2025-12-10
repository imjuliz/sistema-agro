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
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function OrderManagement({ pedidos: pedidosProp = [], carregando = false }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPedidos, setSelectedPedidos] = useState(null);
  const [searchPedidos, setSearchPedidos] = useState('');
  const [selectedPedidosCategory, setSelectedPedidosCategory] = useState('all');
  const categoriesPedidos = ['all', 'PENDENTE', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADO'];

  // Normalizar pedidos do backend
  const normalizedOrders = (pedidosProp || []).map((p, idx) => ({
    id: p.id || `PED-${p.id}`,
    uniqueKey: `${p.id}-${idx}`, // Chave única para evitar duplicatas ao combinar pedidos externos e internos
    documentoReferencia: p.documentoReferencia || p.numeroDocumento || p.numero || p.id,
    customer: p.fornecedorExterno?.nomeEmpresa || p.contrato?.fornecedorExterno?.nomeEmpresa || p.origemUnidade?.nome || 'Fornecedor desconhecido',
    description: p.descricao || p.descricaoPedido || p.observacoes || '',
    items: (p.itens || []).map(i => ({
      name: i.produto?.nome || i.fornecedorItem?.nome || i.produtoNome || i.nome || i.descricao || `Item ${i.id || '?'}`,
      quantity: Number(i.quantidade || 0),
      price: Number(i.precoUnitario || 0)
    })),
    total: Number(p.valorTotal || (p.itens || []).reduce((sum, i) => sum + (Number(i.custoTotal) || 0), 0)),
    status: p.status === 'PENDENTE' ? 'Pendente' : 
            p.status === 'EM_TRANSITO' ? 'A caminho' :
            p.status === 'ENTREGUE' ? 'Entregue' :
            p.status === 'CANCELADO' ? 'Cancelado' : p.status,
    date: p.dataPedido || new Date().toISOString(),
    estimatedDelivery: p.dataEnvio || p.dataPedido || new Date().toISOString(),
    dataRecebimento: p.dataRecebimento || null,
    notes: p.observacoes || '',
    priority: 'normal'
  }));

  // Use normalized orders from backend. If empty, UI shows "Nenhum pedido encontrado".
  const orders = normalizedOrders;

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
           <DialogTitle>Detalhes - {order.documentoReferencia}</DialogTitle>
         </DialogHeader>
         <div className="space-y-6">
           <div className="grid grid-cols-2 gap-4">
             <div>
               <Label>Fornecedor</Label>
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
               <Label>{order.status === 'Entregue' ? 'Data de Recebimento' : 'Entrega Estimada'}</Label>
               <p className='mt-3'>
                 {order.status === 'Entregue' && order.dataRecebimento
                   ? new Date(order.dataRecebimento).toLocaleDateString()
                   : new Date(order.estimatedDelivery).toLocaleDateString()
                 }
               </p>
             </div>
           </div>
 
           {order.description && (
             <div>
               <Label>Descrição do Pedido</Label>
               <p className='mt-1 p-3 bg-muted rounded-lg'>{order.description}</p>
             </div>
           )}

           {order.items && order.items.length > 0 && (
             <div>
               <Label>Itens Comprados</Label>
               <div className="mt-2 space-y-2">
                 {order.items.map((item, index) => {
                   const itemName = item.name || `Item ${index + 1}`;
                   const quantity = item.quantity || 0;
                   const price = item.price || 0;
                   const itemTotal = quantity * price;
                   return (
                     <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                       <div>
                         <p className="font-medium">{itemName}</p>
                         <p className="text-sm text-muted-foreground">Quantidade: {quantity}</p>
                       </div>
                       <div className="text-right">
                         <p>R$ {price.toFixed(2)} cada</p>
                         <p className="text-sm">R$ {itemTotal.toFixed(2)}</p>
                       </div>
                     </div>
                   );
                 })}
               </div>
             </div>
           )}
 
           {order.notes && (
             <div>
               <Label>Notas do Pedido</Label>
               <p className="mt-1 p-3 bg-muted rounded-lg">{order.notes}</p>
             </div>
           )}

           {/* Removed Rejeitar/Confirmar buttons for external pedido details */}
         </div>
       </DialogContent>
     </Dialog>
   );

  const { fetchWithAuth } = useAuth();
  const router = useRouter();

  const handleProcess = async (orderId) => {
    try {
      const url = `${String(API_URL || '/api/').replace(/\/$/, '')}/pedidos/${orderId}/processar`;
      const res = await fetchWithAuth(url, { method: 'POST' });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) return alert(body.erro || body.message || 'Erro ao processar pedido');
      if (typeof router?.refresh === 'function') router.refresh(); else window.location.reload();
    } catch (err) {
      console.error('[handleProcess] Erro:', err);
      alert('Erro ao processar pedido: ' + (err?.message || err));
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-0">
        <h2 className="text-lg font-semibold mb-3">Pedidos</h2>
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
              <Card key={order.uniqueKey}>
                <CardContent className="px-6">
                  <div className="flex items-start justify-between gap-6 flex-col">
                    <div className="space-y-2 w-full">
                      <div className="flex items-center gap-4">
                        <h4>{order.documentoReferencia}</h4>
                        <Badge variant={getStatusVariant(order.status)} className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status}
                        </Badge>
                        
                      </div>

                      <p className="text-muted-foreground">
                        Fornecedor: {order.customer}
                      </p>

                    </div>

                    <div className="text-right space-y-2">
                      <div className="flex gap-2">
                        <OrderDetails order={order} />
                        {order.status === 'Pendente' && (
                          <Button size="sm" onClick={() => handleProcess(order.id)}>
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