"use client"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Pie, PieChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-8 px-8 min-w-[20%] mx-auto w-full">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Lucros</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">R$6.790</CardTitle>
          <CardAction>
            <Badge variant="outline"><IconTrendingUp />+20%</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">Lucros subiram em 20% <IconTrendingDown className="size-4" /></div>
          <div className="text-muted-foreground">Bom</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Parcerias Ativas</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">129</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}


export function SectionCards2() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-8 min-w-2xl mx-auto">
      {/* Card 1 - Próxima Colheita */}
      <div className="flex flex-col justify-between gap-4 w-full">
        <Card className="flex-1 h-full p-6 min-h-[220px]">
          <CardHeader>
            <CardDescription>Próxima Colheita</CardDescription>
            <CardTitle className="text-2xl font-semibold">Milho - 25/10</CardTitle>
          </CardHeader>

          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex gap-2 font-medium">
              Lucros subiram em 20% <IconTrendingDown className="size-4" />
            </div>
            <div className="text-muted-foreground">Bom</div>
          </CardFooter>
        </Card>

        <Stack spacing={2} direction="column" justifyContent="end">
          <Button variant="outlined">OUTLINED</Button>
          <Button variant="outlined">OUTLINED2</Button>
        </Stack>
      </div>

      {/* Card 2 - Talhões Ativos */}
      <div className="flex flex-col justify-between gap-4">
        <Card className="flex-1 h-full p-6 min-h-[220px]">
          <CardHeader>
            <CardDescription>Talhões Ativos</CardDescription>
            <CardTitle className="text-2xl font-semibold">37</CardTitle>
          </CardHeader>

          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex gap-2 font-medium">Lucros subiram em 20%</div>
            <div className="text-muted-foreground">Bom</div>
          </CardFooter>
        </Card>

        <Stack spacing={2} direction="column" justifyContent="end">
          <Button variant="outlined">OUTLINED</Button>
          <Button variant="outlined">OUTLINED2</Button>
        </Stack>
      </div>
    </div>
  );
}


export const description = "A donut chart"
const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  visitors: { label: "Visitors", },
  chrome: { label: "Chrome", color: "var(--chart-1)", },
  safari: { label: "Safari", color: "var(--chart-2)", },
  firefox: { label: "Firefox", color: "var(--chart-3)", },
  edge: { label: "Edge", color: "var(--chart-4)", },
  other: { label: "Other", color: "var(--chart-5)", },
}

export function ChartPieDonut() {
  return (
    <Card className="flex flex-col w-full max-w-[500px] h-[400px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Lotes em andamento</CardTitle>
        <CardDescription>750</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-4 flex justify-center items-center">
        <ChartContainer config={chartConfig} className="w-[90%] h-[90%] flex justify-center items-center">
          <PieChart width={300} height={300}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="visitors" nameKey="browser" innerRadius={80} outerRadius={120}/>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
