'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCatalog } from './ProductCatalog';
import { OrderManagement } from './OrderManagement';
import { ChatInterface } from './ChatInterface';
import { ComplaintSystem } from './ComplaintSystem';
import { 
  ShoppingCart, 
  MessageSquare, 
  AlertTriangle, 
  Search,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';

export function ConsumerDashboard() {
  const [activeTab, setActiveTab] = useState('browse');

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Consumer Dashboard</h2>
          <p className="text-muted-foreground">Browse suppliers and manage your orders</p>
        </div>
        <Button>
          <Search className="h-4 w-4 mr-2" />
          Find Suppliers
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse">Browse Products</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="chat">Messages</TabsTrigger>
          <TabsTrigger value="complaints">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Active Orders"
              value="7"
              icon={ShoppingCart}
              color="text-blue-600"
            />
            <StatCard
              title="Pending Approvals"
              value="3"
              icon={Clock}
              color="text-yellow-600"
            />
            <StatCard
              title="Completed This Month"
              value="24"
              icon={CheckCircle}
              color="text-green-600"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Approved Suppliers</CardTitle>
              <p className="text-muted-foreground">Access catalogs from your approved suppliers</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Fresh Valley Farms', category: 'Organic Produce', status: 'active', products: 156 },
                  { name: 'Premium Meats Co.', category: 'Meat & Poultry', status: 'active', products: 89 },
                  { name: 'Artisan Bakery Supply', category: 'Baked Goods', status: 'active', products: 67 },
                  { name: 'Ocean Fresh Seafood', category: 'Seafood', status: 'pending', products: 134 }
                ].map((supplier, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4>{supplier.name}</h4>
                        <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}>
                          {supplier.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{supplier.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{supplier.products} products</span>
                        <Button size="sm" disabled={supplier.status !== 'active'}>
                          {supplier.status === 'active' ? 'Browse' : 'Awaiting Approval'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <ProductCatalog userType="consumer" />
        </TabsContent>

        <TabsContent value="orders">
          <OrderManagement userType="consumer" />
        </TabsContent>

        <TabsContent value="chat">
          <ChatInterface userType="consumer" />
        </TabsContent>

        <TabsContent value="complaints">
          <ComplaintSystem userType="consumer" />
        </TabsContent>
      </Tabs>
    </div>
  );
}