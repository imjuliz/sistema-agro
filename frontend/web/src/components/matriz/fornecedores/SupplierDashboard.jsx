'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCatalog } from './ProductCatalog';
import { OrderManagement } from './OrderManagement';
import { ChatInterface } from './ChatInterface';
import { ComplaintSystem } from './ComplaintSystem';
import { 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  AlertTriangle, 
  Plus,
  Users,
  TrendingUp,
  DollarSign
} from 'lucide-react';

export function SupplierDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const OverviewCard = ({ title, value, icon: Icon, trend }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">{title}</p>
            <p className="text-2xl">{value}</p>
            {trend && (
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                {trend}
              </p>
            )}
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Supplier Dashboard</h2>
          <p className="text-muted-foreground">Manage your products, orders, and customer relationships</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="chat">Messages</TabsTrigger>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <OverviewCard
              title="Total Products"
              value="247"
              icon={Package}
              trend="+12 this month"
            />
            <OverviewCard
              title="Active Orders"
              value="18"
              icon={ShoppingCart}
              trend="+5 today"
            />
            <OverviewCard
              title="Connected Restaurants"
              value="34"
              icon={Users}
              trend="+3 this week"
            />
            <OverviewCard
              title="Revenue (MTD)"
              value="$12,450"
              icon={DollarSign}
              trend="+15.3%"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 'ORD-001', restaurant: 'Bella Vista Restaurant', status: 'pending', amount: '$340' },
                    { id: 'ORD-002', restaurant: 'Grand Hotel Kitchen', status: 'confirmed', amount: '$890' },
                    { id: 'ORD-003', restaurant: 'Metro Bistro', status: 'delivered', amount: '$230' }
                  ].map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p>{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.restaurant}</p>
                      </div>
                      <div className="text-right">
                        <p>{order.amount}</p>
                        <Badge variant={
                          order.status === 'pending' ? 'secondary' :
                          order.status === 'confirmed' ? 'default' : 'outline'
                        }>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Premium Beef Cuts', orders: 45, revenue: '$2,340' },
                    { name: 'Fresh Organic Vegetables', orders: 38, revenue: '$1,890' },
                    { name: 'Artisan Bread Selection', orders: 32, revenue: '$980' }
                  ].map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p>{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.orders} orders</p>
                      </div>
                      <p>{product.revenue}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="catalog">
          <ProductCatalog userType="supplier" />
        </TabsContent>

        <TabsContent value="orders">
          <OrderManagement userType="supplier" />
        </TabsContent>

        <TabsContent value="chat">
          <ChatInterface userType="supplier" />
        </TabsContent>

        <TabsContent value="complaints">
          <ComplaintSystem userType="supplier" />
        </TabsContent>
      </Tabs>
    </div>
  );
}