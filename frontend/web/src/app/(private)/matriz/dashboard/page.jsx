// Dashboard moderno da Matriz usando components shadcn
"use client"
import React from 'react'
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { usePerfilProtegido } from '@/hooks/usePerfilProtegido'
import { Users, DollarSign, Box, AlertTriangle, BarChart2, Clock, Layers } from 'lucide-react'

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

export default function Page() {
  usePerfilProtegido("GERENTE_MATRIZ");

  // Dados fictícios/placeholder — substituir por fetch/props
  const stats = [
    { icon: Users, value: '182', label: 'Usuários ativos', delta: '+4%'},
    { icon: DollarSign, value: 'R$ 128.500', label: 'Faturamento (30d)', delta: '+12%'},
    { icon: Layers, value: '58', label: 'Filiais ativas', delta: '+1'}
  ]

  const quickLinks = [
    { label: 'Fazendas', href: '/(private)/matriz/unidades/fazendas', icon: BarChart2 },
    { label: 'Lojas', href: '/(private)/matriz/lojas', icon: BarChart2 },
    { label: 'Financeiro', href: '/(private)/matriz/financeiro', icon: DollarSign },
    { label: 'Configurações', href: '/(private)/matriz/configuracoes', icon: BarChart2 },
  ]

  const alerts = [
    { id: 1, text: '5 lotes vencendo em 30 dias', icon: AlertTriangle },
    { id: 2, text: 'Estoque abaixo do mínimo: 12 itens', icon: Box },
    { id: 3, text: '2 lojas com sinistros pendentes', icon: Clock }
  ]

  return (
    <div className="min-h-screen px-18 py-10 bg-surface-50">
      <div className="">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {stats.map((s, idx) => (
            <StatCard key={idx} icon={s.icon} value={s.value} label={s.label} delta={s.delta} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main charts - ocupa 2 colunas em desktop */}
          <div className="lg:col-span-2 space-y-6">
                <div className="">
                  <ChartAreaInteractive />
                </div>

            <Card>
              <CardHeader>
                <CardTitle>Top 5 Fazendas — Produção</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Fazenda Boa Vista</div>
                      <div className="text-sm text-muted-foreground">Produção estimada: 18.2 t</div>
                    </div>
                    <div className="text-sm font-semibold">18.2t</div>
                  </li>
                  <li className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Fazenda Sol</div>
                      <div className="text-sm text-muted-foreground">Produção estimada: 14.8 t</div>
                    </div>
                    <div className="text-sm font-semibold">14.8t</div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Side column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alertas</CardTitle>
                <CardDescription>Itens que precisam de atenção imediata</CardDescription>
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
                <div className="grid grid-cols-2 gap-2">
                  {quickLinks.map((q, i) => (
                    <a key={i} href={q.href} className="rounded-md p-3 bg-muted/5 hover:bg-muted/10 flex items-center justify-between">
                      <div className="text-sm">{q.label}</div>
                      <q.icon className="w-4 h-4 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Atividades recentes</CardTitle>
              <CardDescription>Últimas ações de usuários e eventos do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <div>
                    <div className="text-sm font-medium">Usuário João atualizou estoque</div>
                    <div className="text-xs text-muted-foreground">2 horas atrás</div>
                  </div>
                  <div className="text-sm">OK</div>
                </li>
                <li className="flex justify-between">
                  <div>
                    <div className="text-sm font-medium">Nova venda registrada (Loja A)</div>
                    <div className="text-xs text-muted-foreground">5 horas atrás</div>
                  </div>
                  <div className="text-sm">R$ 2.300</div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sintese Financeira</CardTitle>
              <CardDescription>Receitas, despesas e fluxo (resumo mensal)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between"><div className="text-sm">Receita (Mês)</div><div className="font-semibold">R$ 128.500</div></div>
                <div className="flex justify-between"><div className="text-sm">Despesas (Mês)</div><div className="font-semibold">R$ 98.200</div></div>
                <div className="flex justify-between"><div className="text-sm">Lucro</div><div className="font-semibold text-green-600">R$ 30.300</div></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
