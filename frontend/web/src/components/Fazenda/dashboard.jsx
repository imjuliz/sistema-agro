"use client"
import * as React from 'react';
import { Pie, PieChart } from "recharts"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
//ui
import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"
import { Calendar } from "../ui/calendar"
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item"
//mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { BarChart } from '@mui/x-charts/BarChart';
import ArticleIcon from '@mui/icons-material/Article';
import PersonIcon from '@mui/icons-material/Person';
import CreateIcon from '@mui/icons-material/Create';



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
      <div className="flex flex-col justify-between gap-4 w-full">
        <Card className="flex-1 h-full p-6 min-h-[220px]">
          <CardHeader>
            <CardDescription>Próxima Colheita</CardDescription>
            <CardTitle className="text-2xl font-semibold">Milho - 25/10</CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex gap-2 font-medium">
              Lucros subiram em 20% <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">Bom</div>
          </CardFooter>
        </Card>
        <Stack spacing={2} direction="column" justifyContent="end">
          <Button variant="outlined" sx={{ color: '#738C16', borderColor: '#738C16', '&:hover': { borderColor: '#5c6f12'}}}>
            <CreateIcon /> Nova atividade
          </Button>
          <Button variant="outlined" sx={{ color: '#738C16', borderColor: '#738C16', '&:hover': { borderColor: '#5c6f12'}}}>
            <ArticleIcon />Gerar relatório</Button>
        </Stack>
      </div>
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
          <Button variant="outlined" sx={{ color: '#738C16', borderColor: '#738C16', '&:hover': { borderColor: '#5c6f12'}}}>
            <PersonIcon />Registrar funcionário
          </Button>
          <Button variant="outlined" sx={{ color: '#738C16', borderColor: '#738C16', '&:hover': { borderColor: '#5c6f12'}}}>
            <CreateIcon />Nova tarefa
          </Button>
        </Stack>
      </div>
    </div>
  );
}

export function SectionCards3() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-8 min-w-2xl mx-auto">
      <div className="flex flex-col justify-between gap-4 w-full">
        <Card className="flex-1 h-full p-6 min-h-[220px]">
          <CardHeader>
            <CardDescription>Próxima Colheita</CardDescription>
            <CardTitle className="text-2xl font-semibold">Milho - 25/10</CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex gap-2 font-medium">
              Lucros subiram em 20% <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">Bom</div>
          </CardFooter>
        </Card>
        <Stack spacing={2} direction="column" justifyContent="end">
          <Button variant="outlined" sx={{ color: '#738C16', borderColor: '#738C16', '&:hover': { borderColor: '#5c6f12'}}}>
            <CreateIcon /> Nova atividade
          </Button>
          <Button variant="outlined" sx={{ color: '#738C16', borderColor: '#738C16', '&:hover': { borderColor: '#5c6f12'}}}>
            <ArticleIcon />Gerar relatório</Button>
        </Stack>
      </div>
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
          <Button variant="outlined" sx={{ color: '#738C16', borderColor: '#738C16', '&:hover': { borderColor: '#5c6f12'}}}>
            <PersonIcon />Registrar funcionário
          </Button>
          <Button variant="outlined" sx={{ color: '#738C16', borderColor: '#738C16', '&:hover': { borderColor: '#5c6f12'}}}>
            <CreateIcon />Nova tarefa
          </Button>
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
            <Pie data={chartData} dataKey="visitors" nameKey="browser" innerRadius={80} outerRadius={120} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function GraficoDeBarras() {
  return (
    <BarChart xAxis={[{ data: ['Vegetais', 'Frutas', 'Animália'], scaleType: 'band' }]}
      series={[{ data: [4, 3, 5], color: '#99BF0F' }, { data: [1, 6, 3], color: '#738C16' },]}
      height={650} barLabel="value" margin={{ left: 0 }} yAxis={[{ width: 50 }]} />
  );
}


const formatDateRange2 = (from, to) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return `${from.toLocaleTimeString('pt-BR', options)} - ${to.toLocaleTimeString('pt-BR', options)}`;
};

const allEvents = [
  { title: 'Team Sync Meeting', from: '2025-06-12T12:00:00Z', to: '2025-06-12T13:00:00Z' },
  { title: 'Design Review', from: '2025-06-12T14:30:00Z', to: '2025-06-12T15:30:00Z' },
  { title: 'Reunião de Alinhamento', from: '2025-10-17T13:00:00Z', to: '2025-10-17T14:00:00Z' },
  { title: 'Apresentação Trimestral', from: '2025-10-17T18:00:00Z', to: '2025-10-17T19:30:00Z' },
];

export const CalendarEventListDemo = () => {
  const [date, setDate] = useState(new Date());
  const filteredEvents = allEvents.filter(event => new Date(event.from).toDateString() === date?.toDateString());
  return (
    <div>
      <Card className='w-full py-2'>
        <CardContent className='px-4'>
          <Calendar mode='single' selected={date} onSelect={setDate} className='w-full bg-transparent p-0' required
            modifiersClassNames={{ today: 'bg-[#738C16] text-white rounded-xl ', selected: 'rounded-xl text-white ' }} />
        </CardContent>
        <CardFooter className='flex flex-col items-start gap-3 border-t px-4 !pt-4'>
          <div className='flex w-full items-center justify-between px-1'>
            <div className='text-sm font-medium'>
              {date?.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <Button variant='ghost' size='icon' className='size-6' title='Add Event'>
              <PlusIcon /><span className='sr-only'>Adicionar evento</span>
            </Button>
          </div>
          <div className='flex w-full flex-col gap-2'>
            {filteredEvents.length > 0 ? (filteredEvents.map(event => (
                <div key={event.title} className='bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full'>
                  <div className='font-medium'>{event.title}</div>
                  <div className='text-muted-foreground text-xs'>
                    {formatDateRange2(new Date(event.from), new Date(event.to))}
                  </div>
                </div>
              ))) : (<p className="text-sm text-muted-foreground p-2">Nenhum evento para este dia.</p>)}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export function ItemVariant() {
  return (
    <div className="flex flex-col gap-6">
      <Item>
        <ItemContent>
          <ItemTitle>Default Variant</ItemTitle>
          <ItemDescription>Standard styling with subtle background and borders.</ItemDescription>
        </ItemContent>
        <ItemActions><Button variant="outline" size="sm">Open</Button></ItemActions>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Outline Variant</ItemTitle>
          <ItemDescription>
            Outlined style with clear borders and transparent background.
          </ItemDescription>
        </ItemContent>
        <ItemActions><Button variant="outline" size="sm">Open</Button></ItemActions>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Muted Variant</ItemTitle>
          <ItemDescription>
            Subdued appearance with muted colors for secondary content.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">Open</Button>
        </ItemActions>
      </Item>
    </div>
  )
}


import {Table,TableBody,TableCaption,TableCell,TableFooter,TableHead,TableHeader,TableRow,} from "@/components/ui/table"

const admins = [
  { id: 1, nome: "Mariana Souza", email: "mariana@fazenda.com", telefone: "(11) 99999-1234" },
  { id: 2, nome: "João Pereira", email: "joao@fazenda.com", telefone: "(11) 98888-5678" },
  { id: 3, nome: "Carla Mendes", email: "carla@fazenda.com", telefone: "(31) 97777-4321" },
  { id: 4, nome: "Lucas Andrade", email: "lucas@fazenda.com", telefone: "(21) 96666-8765" },
]

export function TableDemo() {
  return (
    <div className="border rounded-lg shadow-sm bg-white dark:bg-gray-900">
      <Table>
        <TableCaption>Lista de administradores da fazenda.</TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-100 dark:bg-gray-800">
            <TableHead className="w-[80px] font-semibold">ID</TableHead>
            <TableHead className="font-semibold">Nome</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Telefone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <TableCell className="font-medium">{admin.id}</TableCell>
              <TableCell>{admin.nome}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>{admin.telefone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
