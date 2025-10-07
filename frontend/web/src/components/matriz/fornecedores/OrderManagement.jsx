'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  Eye,
  MessageSquare,
  Calendar,
  DollarSign
} from 'lucide-react';

export function OrderManagement({ userType }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const orders = [
    {
      id: 'ORD-001',
      customer: userType === 'supplier' ? 'Bella Vista Restaurant' : 'Fresh Valley Farms',
      items: [
        { name: 'Premium Ribeye Steaks', quantity: 20, price: 24.99 },
        { name: 'Organic Mixed Greens', quantity: 5, price: 8.50 }
      ],
      total: 542.30,
      status: 'pending',
      date: '2024-01-15',
      estimatedDelivery: '2024-01-17',
      notes: 'Please ensure cold chain delivery',
      priority: 'high'
    },
    {
      id: 'ORD-002',
      customer: userType === 'supplier' ? 'Grand Hotel Kitchen' : 'Premium Meats Co.',
      items: [
        { name: 'Fresh Atlantic Salmon', quantity: 15, price: 18.99 },
        { name: 'Artisan Sourdough Bread', quantity: 24, price: 6.75 }
      ],
      total: 446.85,
      status: 'confirmed',
      date: '2024-01-14',
      estimatedDelivery: '2024-01-16',
      notes: 'Regular delivery time is fine',
      priority: 'normal'
    },
    {
      id: 'ORD-003',
      customer: userType === 'supplier' ? 'Metro Bistro' : 'Ocean Fresh Seafood',
      items: [
        { name: 'Organic Mixed Greens', quantity: 10, price: 8.50 }
      ],
      total: 85.00,
      status: 'delivered',
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
      status: 'cancelled',
      date: '2024-01-10',
      estimatedDelivery: '2024-01-12',
      notes: 'Customer requested cancellation due to event postponement',
      priority: 'low'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'delivered': return <Truck className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'confirmed': return 'default';
      case 'delivered': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'normal': return 'text-blue-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  const OrderDetails = ({ order }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Details - {order.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Customer/Supplier</Label>
              <p>{order.customer}</p>
            </div>
            <div>
              <Label>Status</Label>
              <div className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                <Badge variant={getStatusVariant(order.status)}>
                  {order.status}
                </Badge>
              </div>
            </div>
            <div>
              <Label>Order Date</Label>
              <p>{new Date(order.date).toLocaleDateString()}</p>
            </div>
            <div>
              <Label>Estimated Delivery</Label>
              <p>{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <Label>Items Ordered</Label>
            <div className="mt-2 space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p>{item.name}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p>${item.price.toFixed(2)} each</p>
                    <p className="text-sm">${(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span>Total Amount:</span>
                <span className="text-lg">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div>
              <Label>Order Notes</Label>
              <p className="mt-1 p-3 bg-muted rounded-lg">{order.notes}</p>
            </div>
          )}

          {userType === 'supplier' && order.status === 'pending' && (
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <XCircle className="h-4 w-4 mr-2" />
                Reject Order
              </Button>
              <Button className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Order
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3>{userType === 'supplier' ? 'Order Management' : 'My Orders'}</h3>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Export Orders
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid gap-4">
            {filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <h4>{order.id}</h4>
                        <Badge variant={getStatusVariant(order.status)} className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status}
                        </Badge>
                        <span className={`text-sm ${getPriorityColor(order.priority)}`}>
                          {order.priority} priority
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground">
                        {userType === 'supplier' ? 'Customer:' : 'Supplier:'} {order.customer}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Ordered: {new Date(order.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{order.items.length} items</span>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-lg">${order.total.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <OrderDetails order={order} />
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Chat
                        </Button>
                        {userType === 'supplier' && order.status === 'pending' && (
                          <Button size="sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Process
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
              <h4>No orders found</h4>
              <p className="text-muted-foreground">
                {activeTab === 'all' 
                  ? 'No orders have been placed yet'
                  : `No ${activeTab} orders found`
                }
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}