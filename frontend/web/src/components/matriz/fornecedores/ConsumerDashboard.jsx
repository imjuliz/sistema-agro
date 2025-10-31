'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCatalog } from './ProductCatalog';
// import { OrderManagement } from './OrderManagement';
import { ChatInterface } from './ChatInterface';
import { ComplaintSystem } from './ComplaintSystem';
import { ShoppingCart, MessageSquare, AlertTriangle, Search, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Card, CardContent, CardAction, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import FornecedoresCard from './fornecedores-card';
import { OrderManagement } from './OrderManagement';

export function ConsumerDashboard() {

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
    <div className="space-y-6 flex flex-col gap-12">
      {/* cards / kpis / indicadores */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 md:grid-cols-3 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:@xl/main:grid-cols-2 @5xl/main:grid-cols-4 mb-0">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Contratos Ativos</CardDescription>
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
            <CardDescription>Contratos pendentes</CardDescription>
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
            <CardDescription>NÃO SEI O QUE COLOCAR AQUI</CardDescription>
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

      {/* card de fornecedores */}
      <FornecedoresCard />
      {/* produtos */}
      <ProductCatalog />
      {/* produtos */}
      <OrderManagement />
      
    </div>
  );
}