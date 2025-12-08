"use client"
import React from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { ChartBarMultiple } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import ContributorsTable from "@/components/ruixen-contributors-table"
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";
import { usePerfilProtegido } from '@/hooks/usePerfilProtegido';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Separator } from '@/components/ui/separator'
import { Users, DollarSign, Box, ShoppingCart, Clock, Truck } from 'lucide-react'

const StatCard = ({ icon: Icon, value, label, delta }) => (
  <Card className="p-0 h-full">
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-2xl font-semibold">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="p-2 bg-muted/40 rounded-md">
            <Icon className="w-6 h-6 text-muted-foreground" />
          </div>
          {delta && <Badge variant="secondary">{delta}</Badge>}
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function DashboardLoja() {
  const { fetchWithAuth } = useAuth();
  usePerfilProtegido("GERENTE_LOJA");

  // Placeholders inteligentes — trocar por fetches reais
  const stats = [
    { icon: ShoppingCart, value: '125', label: 'Vendas hoje', delta: '+8%' },
    { icon: DollarSign, value: 'R$ 12.450', label: 'Faturamento (hoje)', delta: '+4%' },
    { icon: Box, value: '320', label: 'Itens em estoque', delta: '-2%' },
    { icon: Users, value: '18', label: 'Funcionários ativos', delta: '+0' }
  ]

  const alerts = [
    { id: 1, text: '3 itens com estoque crítico', icon: Box },
    { id: 2, text: 'Caixa aberto há 12 horas', icon: Clock },
    { id: 3, text: 'Pedido fornecedor atrasado (TRUCK-123)', icon: Truck }
  ]

  return (
    <div className="min-h-screen px-18 py-10 bg-surface-50">
      <div className="">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <StatCard key={i} icon={s.icon} value={s.value} label={s.label} delta={s.delta} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Vendas por hora (últimas 24h)</span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">Hoje</Button>
                    <Button size="sm">Exportar</Button>
                  </div>
                </CardTitle>
                <CardDescription>Resumo de vendas para operador/gerente acompanhar em tempo real.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ChartBarMultiple />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Últimas Vendas</CardTitle>
                <CardDescription>Transações recentes na loja</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Venda #1024 — Cliente Maria</div>
                      <div className="text-xs text-muted-foreground">2m atrás • 3 itens</div>
                    </div>
                    <div className="font-semibold">R$ 145,00</div>
                  </li>
                  <li className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Venda #1023 — Cliente João</div>
                      <div className="text-xs text-muted-foreground">15m atrás • 1 item</div>
                    </div>
                    <div className="font-semibold">R$ 39,90</div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alertas</CardTitle>
                <CardDescription>Ações que precisam de atenção</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {alerts.map(a => (
                    <div key={a.id} className="flex items-start gap-3">
                      <div className="p-2 rounded-md bg-red-500/10">
                        <a.icon className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <div className="text-sm">{a.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Links rápidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  <a href="/(private)/loja/estoque" className="rounded-md p-3 bg-muted/5 hover:bg-muted/10 flex items-center justify-between">Estoque</a>
                  <a href="/(private)/loja/fornecedores" className="rounded-md p-3 bg-muted/5 hover:bg-muted/10 flex items-center justify-between">Fornecedores</a>
                  <a href="/(private)/loja/frenteCaixa" className="rounded-md p-3 bg-muted/5 hover:bg-muted/10 flex items-center justify-between">Frente de Caixa</a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Equipe & Ações</CardTitle>
              <CardDescription>Status de funcionários e tarefas</CardDescription>
            </CardHeader>
            <CardContent>
              <ContributorsTable />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo de Caixa</CardTitle>
              <CardDescription>Saldo atual, entradas e saídas rápidas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between"><div className="text-sm">Saldo atual</div><div className="font-semibold">R$ 4.320</div></div>
                <div className="flex justify-between"><div className="text-sm">Entradas (hoje)</div><div className="font-semibold">R$ 12.450</div></div>
                <div className="flex justify-between"><div className="text-sm">Saídas (hoje)</div><div className="font-semibold">R$ 8.130</div></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}