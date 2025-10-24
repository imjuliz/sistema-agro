'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCatalog } from './ProductCatalog';
import { OrderManagement } from './OrderManagement';
import { ChatInterface } from './ChatInterface';
import { ComplaintSystem } from './ComplaintSystem';
import { ShoppingCart, MessageSquare, AlertTriangle, Search,TrendingUp,Clock,CheckCircle} from 'lucide-react';
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import {
  Card,
  CardContent,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import FornecedoresCard from './fornecedores-card';

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
          <h2>Dashboard do Consumidor</h2>
          <p className="text-muted-foreground">Pesquise fornecedores e gerencie seus pedidos</p>
        </div>
        <Button>
          <Search className="h-4 w-4 mr-2" />Ache fornecedores
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse">Ache Produtos</TabsTrigger>
          <TabsTrigger value="orders">Meus Pedidos</TabsTrigger>
          <TabsTrigger value="chat">Mensagens</TabsTrigger>
          <TabsTrigger value="complaints">Ajuda</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="Pedidos Ativos" value="7" icon={ShoppingCart} color="text-blue-600"/>
            <StatCard title="Aprovações pendentes" value="3" icon={Clock} color="text-yellow-600"/>
            <StatCard title="Concluído este mês" value="24" icon={CheckCircle} color="text-green-600"/>
          </div> */}

          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 md:grid-cols-3 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:@xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pedidos Ativos</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            7
          </CardTitle>
          <CardAction>
            {/* <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge> */}
            <ShoppingCart />
          </CardAction>
        </CardHeader>
        {/* <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter> */}
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Aprovações pendentes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            3
          </CardTitle>
          <CardAction>
            {/* <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge> */}
            <Clock />
          </CardAction>
        </CardHeader>
        {/* <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter> */}
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Concluído este mês</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            24
          </CardTitle>
          <CardAction>
            {/* <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge> */}
            <CheckCircle />
          </CardAction>
        </CardHeader>
        {/* <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter> */}
      </Card>
      
    </div>

          {/* <Card>
            <CardHeader>
              <CardTitle>Fornecedores Aprovados</CardTitle>
              <p className="text-muted-foreground">Acesse catálogos de seus fornecedores aprovados</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Animals', category: 'Animais', status: 'ativa', products: 156 },
                  { name: 'Nature Co.', category: 'Insumos', status: 'ativa', products: 89 },
                  { name: 'PetFood', category: 'Rações', status: 'ativa', products: 67 },
                  { name: 'EcoMundo', category: 'Plantas', status: 'ativa', products: 134 }
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
                        <span className="text-sm">{supplier.products} produtos</span>
                        <Button size="sm" disabled={supplier.status !== 'active'}>
                          {supplier.status === 'active' ? 'Browse' : 'Awaiting Approval'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card> */}
<FornecedoresCard />

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