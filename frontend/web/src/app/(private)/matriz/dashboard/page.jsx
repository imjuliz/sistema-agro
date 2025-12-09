"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { usePerfilProtegido } from "@/hooks/usePerfilProtegido"
import { API_URL } from "@/lib/api"
import {
    Users,
    DollarSign,
    Box,
    AlertTriangle,
    BarChart2,
    Clock,
    Layers,
    TrendingUp,
    Download,
} from "lucide-react"
import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    PolarAngleAxis,
    PolarGrid,
    Radar,
    RadarChart,
} from "recharts"
import { useAuth } from "@/contexts/AuthContext"

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

const chartConfigBar = {
    total: {
        label: "Vendas",
        color: "var(--chart-1)",
    },
}

function formatCurrency(value) {
    return value?.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 2,
    }) ?? "R$ 0,00"
}

function formatShortDate(dateStr) {
    const d = new Date(dateStr)
    if (Number.isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
}

function ChartBarDefault({ data, range, onChangeRange }) {
    const prepared = (data?.length ? data : [{ data: "Sem dados", total: 0 }]).map(
        (item) => ({
            month: formatShortDate(item.data),
            total: Number(item.total) || 0,
        })
    )

    return (
        <Card>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <CardTitle>Vendas por período</CardTitle>
                    <CardDescription>Visão geral das lojas (7d ou 15d)</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={range === "7" ? "default" : "outline"}
                        size="sm"
                        onClick={() => onChangeRange("7")}
                    >
                        Últimos 7 dias
                    </Button>
                    <Button
                        variant={range === "15" ? "default" : "outline"}
                        size="sm"
                        onClick={() => onChangeRange("15")}
                    >
                        Últimos 15 dias
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="h-80">
                <ChartContainer config={chartConfigBar}>
                    <BarChart accessibilityLayer data={prepared}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    hideLabel
                                    formatter={(value) => formatCurrency(Number(value))}
                                />
                            }
                        />
                        <Bar dataKey="total" fill="var(--color-total)" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Tendência baseada no período selecionado <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Vendas consolidadas de todas as lojas
                </div>
            </CardFooter>
        </Card>
    )
}

const chartConfigRadar = {
    desktop: {
        label: "Produção estimada",
        color: "var(--chart-1)",
    },
}

function ChartRadarGridCircle({ data }) {
    const prepared =
        data?.length > 0
            ? data.map((item) => ({
                month: item.nome,
                desktop: Number(item.totalEstimado) || 0,
            }))
            : [{ month: "Sem dados", desktop: 0 }]

    return (
        <Card>
            <CardHeader className="items-center pb-4">
                <CardTitle>Top 5 Fazendas — Produção estimada</CardTitle>
                <CardDescription>Contratos x itens (peso total)</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
                <ChartContainer
                    config={chartConfigRadar}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <RadarChart data={prepared}>
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    hideLabel
                                    formatter={(value) => `${Number(value).toFixed(2)} kg`}
                                />
                            }
                        />
                        <PolarGrid gridType="circle" />
                        <PolarAngleAxis dataKey="month" />
                        <Radar
                            dataKey="desktop"
                            fill="var(--color-desktop)"
                            fillOpacity={0.6}
                            dot={{
                                r: 4,
                                fillOpacity: 1,
                            }}
                        />
                    </RadarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    Atualizado em tempo real <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground flex items-center gap-2 leading-none">
                    Ranking das fazendas mais produtivas
                </div>
            </CardFooter>
        </Card>
    )
}

import FullPageLoader from "@/components/FullPageLoader"

export default function Page() {
    const { checking } = usePerfilProtegido("GERENTE_MATRIZ")
    const { fetchWithAuth } = useAuth()
    const [salesRange, setSalesRange] = useState("7")
    const [salesData, setSalesData] = useState([])
    const [salesTotal, setSalesTotal] = useState(0)
    const [productionData, setProductionData] = useState([])
    const [loadingPdf, setLoadingPdf] = useState(false)
    const [activeUsers, setActiveUsers] = useState(0)
    const [activeUnits, setActiveUnits] = useState(0)
    const [financeSummary, setFinanceSummary] = useState({
        receitas: 0,
        despesas: 0,
        saldo: 0,
    })

    const apiBase = useMemo(() => (API_URL || "").replace(/\/+$/, ""), [])

    const authFetch = useCallback(
        async (url, options = {}) => {
            if (typeof fetchWithAuth === "function") {
                return fetchWithAuth(url, { credentials: "include", ...options })
            }
            return fetch(url, { credentials: "include", ...options })
        },
        [fetchWithAuth]
    )

    useEffect(() => {
        const loadSales = async () => {
            try {
                const resp = await authFetch(
                    `${apiBase}/matriz/dashboard/vendas?range=${salesRange}`
                )
                const body = await resp.json()
                setSalesData(body?.pontos || [])
                setSalesTotal(body?.totalPeriodo || 0)
            } catch (err) {
                console.error("Erro ao carregar vendas:", err)
            }
        }
        loadSales()
    }, [apiBase, authFetch, salesRange])

    useEffect(() => {
        const loadKpis = async () => {
            try {
                const resp = await authFetch(`${apiBase}/matriz/dashboard/kpis`)
                const body = await resp.json()
                setActiveUsers(Number(body?.usuariosAtivos) || 0)
                setActiveUnits(Number(body?.filiaisAtivas) || 0)
            } catch (err) {
                console.error("Erro ao carregar KPIs:", err)
            }
        }
        loadKpis()
    }, [apiBase, authFetch])

    useEffect(() => {
        const loadFinance = async () => {
            try {
                const resp = await authFetch(`${apiBase}/matriz/dashboard/financeiro`)
                const body = await resp.json()
                setFinanceSummary({
                    receitas: Number(body?.receitas) || 0,
                    despesas: Number(body?.despesas) || 0,
                    saldo: Number(body?.saldo) || 0,
                })
            } catch (err) {
                console.error("Erro ao carregar resumo financeiro:", err)
            }
        }
        loadFinance()
    }, [apiBase, authFetch])

    useEffect(() => {
        const loadProduction = async () => {
            try {
                const resp = await authFetch(`${apiBase}/matriz/dashboard/producao`)
                const body = await resp.json()
                setProductionData(body?.fazendas || [])
            } catch (err) {
                console.error("Erro ao carregar produção:", err)
            }
        }
        loadProduction()
    }, [apiBase, authFetch])

    const exportPdf = async () => {
        try {
            setLoadingPdf(true)
            const resp = await authFetch(`${apiBase}/matriz/dashboard/pdf`, {
                headers: { Accept: "application/pdf" },
            })
            const blob = await resp.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = "dashboard-matriz.pdf"
            link.click()
            window.URL.revokeObjectURL(url)
        } catch (err) {
            console.error("Erro ao exportar PDF:", err)
        } finally {
            setLoadingPdf(false)
        }
    }

    const stats = [
        {
            icon: Layers,
            value: activeUsers || 0,
            label: "Usuários ativos",
        },
        {
            icon: DollarSign,
            value: formatCurrency(salesTotal),
            label: `Faturamento (${salesRange}d)`,
        },
        {
            icon: BarChart2,
            value: `${activeUnits || 0} unidades`,
            label: "Filiais ativas",
        },
    ]

    const quickLinks = [
        { label: "Fazendas", href: "/matriz/unidades/fazendas", icon: BarChart2 },
        { label: "Lojas", href: "/matriz/lojas", icon: BarChart2 },
        { label: "Financeiro", href: "/matriz/financeiro", icon: DollarSign },
        { label: "Configurações", href: "/matriz/configuracoes", icon: BarChart2 },
    ]

    const alerts = [
        { id: 1, text: "5 lotes vencendo em 15 dias", icon: AlertTriangle },
        { id: 2, text: "Estoque abaixo do mínimo: 12 itens", icon: Box },
        { id: 3, text: "2 lojas com sinistros pendentes", icon: Clock },
    ]

    if (checking) return <FullPageLoader />

    return (
        <div className="min-h-screen px-18 py-10 bg-surface-50">
            <div className="flex items-center justify-between mb-6">
               
                <Button onClick={exportPdf} disabled={loadingPdf} className="gap-2">
                    <Download className="w-4 h-4" />
                    {loadingPdf ? "Gerando PDF..." : "Exportar PDF"}
                </Button>
            </div>

            <div>
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {stats.map((s, idx) => (
                        <StatCard key={idx} icon={s.icon} value={s.value} label={s.label} />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main charts - ocupa 2 colunas em desktop */}
                    <div className="lg:col-span-2 space-y-6">
                        <ChartBarDefault
                            data={salesData}
                            range={salesRange}
                            onChangeRange={setSalesRange}
                        />

                        <ChartRadarGridCircle data={productionData} />

                    </div>

                    {/* Side column */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Links rápidos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-2">
                                    {quickLinks.map((q, i) => (
                                        <a
                                            key={i}
                                            href={q.href}
                                            className="rounded-md p-3 bg-muted/5 hover:bg-muted/10 flex items-center justify-between"
                                        >
                                            <div className="text-sm">{q.label}</div>
                                            <q.icon className="w-4 h-4 text-muted-foreground" />
                                        </a>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Sintese Financeira</CardTitle>
                                <CardDescription>Receitas, despesas e fluxo (resumo mensal)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between">
                                        <div className="text-sm">Receita (Mês)</div>
                                        <div className="font-semibold">
                                            {formatCurrency(financeSummary.receitas)}
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="text-sm">Despesas (Mês)</div>
                                        <div className="font-semibold">
                                            {formatCurrency(financeSummary.despesas)}
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="text-sm text-muted-foreground">
                                        Resultado: {formatCurrency(financeSummary.saldo)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
        </div>
    )
}

