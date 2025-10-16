"use client"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle,CardContent } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"
import {ChartContainer,ChartTooltip,ChartTooltipContent,} from "@/components/ui/chart"

export function SectionCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 px-8 max-w-7xl mx-auto w-full">
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

export const description = "A donut chart"
const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  visitors: {label: "Visitors",},
  chrome: {label: "Chrome",color: "var(--chart-1)",},
  safari: {label: "Safari",color: "var(--chart-2)",},
  firefox: {label: "Firefox",color: "var(--chart-3)",},
  edge: {label: "Edge",color: "var(--chart-4)",},
  other: {label: "Other",color: "var(--chart-5)",},
} 

export function ChartPieDonut() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />}/>
            <Pie data={chartData} dataKey="visitors" nameKey="browser" innerRadius={60}/>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
      </CardFooter>
    </Card>
  )
}
