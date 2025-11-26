'use client'
import { AppSidebar } from "@/components/app-sidebar"
import FornecedoresTable from "@/components/Fornecedores"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCatalog } from '@/components/fornecedores/ProductCatalog';
// import { OrderManagement } from './OrderManagement';
import { ChatInterface } from '@/components/fornecedores/ChatInterface';
import { ComplaintSystem } from '@/components/fornecedores/ComplaintSystem';
import { ShoppingCart, MessageSquare, AlertTriangle, Search, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Card, CardContent, CardAction, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import FornecedoresCard from '@/components/fornecedores/fornecedores-card';
import { OrderManagement } from '@/components/fornecedores/OrderManagement';

export default function FornecedoresLoja() {
    return (
        <>
            <div className="flex flex-1 flex-col p-10">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="justify-center W-100%"><FornecedoresTable /></div>
                </div>
            </div>
            <div className="space-y-6 flex flex-col gap-12">
                {/* cards / kpis / indicadores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:@xl/main:grid-cols-2 @5xl/main:grid-cols-4 mb-0">
                    <Card className="h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition">
                        <CardHeader>
                            <CardDescription>Contratos Ativos</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                7
                            </CardTitle>
                            <CardAction>
                                <ShoppingCart />
                            </CardAction>
                        </CardHeader>
                    </Card>
                    <Card className="h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition">
                        <CardHeader>
                            <CardDescription>Contratos pendentes</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                3
                            </CardTitle>
                            <CardAction><Clock /></CardAction>
                        </CardHeader>
                    </Card>
                </div>
                <FornecedoresCard />
                <ProductCatalog />
                <OrderManagement />
            </div>
        </>
    )
}
