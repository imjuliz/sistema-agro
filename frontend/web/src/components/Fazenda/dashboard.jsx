"use client"
import * as React from 'react';
import { Pie, PieChart } from "recharts"
import { useState, useEffect } from 'react'
// import { API_URL } from '@/config';
import { API_URL } from "@/lib/api";
import { useAuth } from '@/contexts/AuthContext';
import { PlusIcon } from 'lucide-react'
import { useTheme } from "next-themes";
import { toast } from 'sonner';
//ui
import { Card, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"
import { Calendar } from "../ui/calendar"
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
//mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { BarChart } from '@mui/x-charts/BarChart';
import ArticleIcon from '@mui/icons-material/Article';
import PersonIcon from '@mui/icons-material/Person';
import CreateIcon from '@mui/icons-material/Create';

export function SectionCards() {
  const { user, fetchWithAuth } = useAuth();
  const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
  const [lucro, setLucro] = useState(null);
  const [parceriasCount, setParceriasCount] = useState(null);

 useEffect(() => {
  let mounted = true;

  async function loadSaldo() {
    if (!unidadeId) return;

    try {
      const url = `${API_URL}/somarEntradasMensais/${unidadeId}`;
      console.debug("[loadSaldo] requesting", url);

      const res = await fetchWithAuth(url, { 
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" }
      });

      console.debug("[loadSaldo] status:", res.status);

      if (res.status === 404) {
        console.warn("[loadSaldo] 404 — rota não encontrada");
        if (mounted) setLucro(0);
        return;
      }

      if (res.status === 401) {
        console.warn("[loadSaldo] 401 — não autorizado");
        if (mounted) setLucro(0);
        return;
      }

      const body = await res.json().catch(() => null);
      console.debug("[loadSaldo] body:", body);

      const saldo = Number(body?.saldo ?? 0) || 0;

      if (mounted) setLucro(saldo);

    } catch (err) {
      console.error("[loadSaldo] erro:", err);
      if (mounted) setLucro(0);
    }
  }

  loadSaldo();
  return () => { mounted = false };
}, [unidadeId, fetchWithAuth]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-8 px-8 min-w-[20%] mx-auto w-full">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Lucros</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{lucro === null ? '—' : `R$ ${Number(lucro).toLocaleString('pt-BR')}`}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Parcerias Ativas</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{parceriasCount === null ? '—' : parceriasCount}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

export function SectionCards2() {
  const { user, fetchWithAuth } = useAuth();
  const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
  const [talhoesAtivos, setTalhoesAtivos] = useState(null);
  const [proximaColheita, setProximaColheita] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!unidadeId) return;

      try {
        const fetchFn = fetchWithAuth || fetch;
        const res = await fetchFn(`${API_URL}/lotesPlantio/${unidadeId}`);
        const data = await res.json().catch(() => ({}));
        if (!mounted) return;
        const arr = data?.lotes ?? data?.data ?? (Array.isArray(data) ? data : []);
        setTalhoesAtivos(Array.isArray(arr) ? arr.length : 0);
        if (Array.isArray(arr) && arr.length > 0) {
          const dates = arr.map(l => {
            const d = l.colheita || l.validade || l.plantio || l.dataPlantio || null;
            const ms = d ? (Date.parse(d) || null) : null;
            return ms;
          }).filter(Boolean).sort((a, b) => a - b);
          if (dates.length > 0) setProximaColheita(new Date(dates[0]).toLocaleDateString('pt-BR'));
        }
      }
      catch (err) { console.error('Erro carregando talhões:', err); }

    }
    load();
    return () => { mounted = false };
  }, [unidadeId, fetchWithAuth]);

  return (
    <div className=" 2xl:grid grid-cols-1 md:grid-cols-2 gap-4 px-8 mx-auto">
      <div className="flex flex-col justify-between gap-4 w-full">
        <Card className="flex-1 h-full p-6 min-h-[220px]">
          <CardHeader>
            <CardDescription>Próxima Colheita</CardDescription>
            <CardTitle className="text-2xl font-semibold">{proximaColheita ?? '—'}</CardTitle>
          </CardHeader>
        </Card>
        <Stack spacing={2} direction="column" justifyContent="end">
          <Button variant="outlined" sx={{ color: '#738C16', borderColor: '#738C16', '&:hover': { borderColor: '#5c6f12' } }}>
            <CreateIcon /> Nova atividade
          </Button>
          <Button variant="outlined" sx={{ color: '#738C16', borderColor: '#738C16', '&:hover': { borderColor: '#5c6f12' } }}>
            <ArticleIcon />Gerar relatório</Button>
        </Stack>
      </div>
      <div className="flex flex-col justify-between gap-4">
        <Card className="flex-1 h-full p-6 min-h-[220px]">
          <CardHeader>
            <CardDescription>Talhões Ativos</CardDescription>
            <CardTitle className="text-2xl font-semibold">{talhoesAtivos === null ? '—' : talhoesAtivos}</CardTitle>
          </CardHeader>
        </Card>
        <Stack spacing={2} direction="column" justifyContent="end">
          <Button variant="outlined" sx={{ color: '#738C16', borderColor: '#738C16', '&:hover': { borderColor: '#5c6f12' } }}>
            <PersonIcon />Registrar funcionário
          </Button>
          <Button variant="outlined" sx={{ color: '#738C16', borderColor: '#738C16', '&:hover': { borderColor: '#5c6f12' } }}>
            <CreateIcon />Nova tarefa
          </Button>
        </Stack>
      </div>
    </div>
  );
}

export function SectionCards3() {
  const { user, fetchWithAuth } = useAuth();
  const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
  const [nextEnvio, setNextEnvio] = useState(null);
  const [tarefasPendentes, setTarefasPendentes] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!unidadeId) return;
      try {
        const fetchFn = fetchWithAuth || fetch;
        const res = await fetchFn(`${API_URL}/lotesPlantio/${unidadeId}`);
        const data = await res.json().catch(() => ({}));
        if (!mounted) return;
        const arr = data?.lotes ?? data?.data ?? (Array.isArray(data) ? data : []);
        const pending = Array.isArray(arr) ? arr.filter(l => !l.status || (typeof l.status === 'string' && l.status.toLowerCase().indexOf('pronto') === -1)).length : 0;
        setTarefasPendentes(pending);

        const pRes = await fetchFn(`${API_URL}/listarLojasParceiras/${unidadeId}`);
        const pJson = await pRes.json().catch(() => ({}));
        const partners = pJson.lojas ?? pJson ?? [];
        if (Array.isArray(partners) && partners.length > 0) {
          const dates = partners.map(p => Date.parse(p.proximoEnvio || p.nextEnvio || p.dataEnvio || p.createdAt || null)).filter(Boolean).sort((a, b) => a - b);
          if (dates.length > 0) setNextEnvio(new Date(dates[0]).toLocaleDateString('pt-BR'));
        }
      }
      catch (err) { console.error('Erro carregando SectionCards3 dados:', err); }
    }
    load();
    return () => { mounted = false };
  }, [unidadeId, fetchWithAuth]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-8 min-w-2xl mx-auto">
      <div className="flex flex-col justify-between gap-4 w-full">
        <Card className="flex-1 h-full p-6 min-h-[220px]">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Próximo envio</CardTitle>
            <CardTitle className="text-2xl font-semibold">{nextEnvio ?? '—'}</CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Loja agronipa</div>
          </CardFooter>
        </Card>
      </div>
      <div className="flex flex-col justify-between gap-4">
        <Card className="flex-1 h-full p-6 min-h-[220px]">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Tarefas pendentes</CardTitle>
            <CardTitle className="text-2xl font-semibold">{tarefasPendentes === null ? '—' : tarefasPendentes}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

export const description = "A donut chart"
export function ChartPieDonut() {
  const { user, fetchWithAuth } = useAuth();
  const [fetchedData, setFetchedData] = useState([]);
  const [fetchedConfig, setFetchedConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lotesCount, setLotesCount] = useState(null);

  const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        if (!unidadeId) {
          console.warn('[ChartPieDonut] unidadeId ausente — usando dados de demonstração');
          return;
        }

        const fetchFn = fetchWithAuth || fetch;
        const res = await fetchFn(`${API_URL}/lotes/${unidadeId}/status-counts`);
        const data = await res.json().catch(() => ({}));
        if (!mounted) return;
        if (res.ok && data.sucesso && Array.isArray(data.chart)) {
          const mapped = data.chart.map((c) => ({ browser: c.label, visitors: Number(c.value) }));
          setFetchedData(mapped);
          setFetchedConfig({ visitors: { label: 'Lotes', color: '#738C16' } });
        }
        else { console.warn('Dashboard fetch returned no data, using demo data.', data); }
      }
      catch (err) { console.error('Erro ao carregar dados do dashboard:', err); }
      finally { if (mounted) setLoading(false); }
    }
    load();
    return () => { mounted = false };
  }, [unidadeId, fetchWithAuth]);

  // useEffect(() => {
  //   let mounted = true;
  //   async function loadLotesCount() {
  //     if (!unidadeId) return;
  //     try {
  //       const fetchFn = fetchWithAuth || fetch;
  //       const res = await fetchFn(`${API_URL}/lotesPlantio/${unidadeId}`);
  //       const data = await res.json().catch(() => ({}));
  //       if (!mounted) return;
  //       const arr = data?.lotes ?? data?.data ?? (Array.isArray(data) ? data : []);
  //       if (!Array.isArray(arr)) {
  //         setLotesCount(0);
  //         return;
  //       }
  //       const finalized = ['PRONTO', 'FINALIZADO', 'CONCLUIDO', 'CONCLUÍDO', 'TERMINADO', 'ENCERRADO', 'CANCELADO'];
  //       const activeCount = arr.filter(l => {
  //         const s = (l.status || l.statusLote || l.status_lote || '').toString().toUpperCase();
  //         return !finalized.includes(s);
  //       }).length;
  //       setLotesCount(activeCount);
  // //     } catch (err) {
  // //       console.error('Erro ao carregar lotes para contagem:', err);
  // //       setLotesCount(0);
  // //     }
  // //   }
  // //   loadLotesCount();
  // //   return () => { mounted = false };
  // }, [unidadeId, fetchWithAuth]);

  const dataToUse = Array.isArray(fetchedData) ? fetchedData : [];
  const configToUse = fetchedConfig || { visitors: { label: 'Lotes', color: '#738C16' } };
  const totalVisitors = dataToUse.reduce((s, item) => s + (Number(item.visitors) || 0), 0);

  return (
    <Card className="flex flex-col w-full max-w-[500px] h-[400px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Lotes em andamento</CardTitle>
        <CardDescription>{lotesCount === null ? (loading ? 'Carregando...' : '-') : lotesCount}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4 flex justify-center items-center">
        <ChartContainer config={configToUse} className="w-[90%] h-[90%] flex justify-center items-center">
          <PieChart width={300} height={300}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={dataToUse} dataKey="visitors" nameKey="browser" innerRadius={80} outerRadius={120} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function GraficoDeBarras() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4">
      <BarChart xAxis={[
        { data: ["Vegetais", "Frutas", "Animália"], scaleType: "band", tickLabelStyle: { fill: isDark ? "#ffffff" : "#000000" }, labelStyle: { fill: isDark ? "#ffffff" : "#000000" } },
      ]}
        yAxis={[{ width: 50, tickLabelStyle: { fill: isDark ? "#ffffff" : "#000000", }, },]}
        series={[{ data: [4, 3, 5], color: "#99BF0F" }, { data: [1, 6, 3], color: "#738C16" },]}
        height={650} barLabel="value" margin={{ left: 60, right: 30, top: 30, bottom: 30 }}
        sx={{
          "& .MuiChartsGrid-line": { stroke: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)", },
          "& .MuiChartsAxis-line": { stroke: isDark ? "#ffffff88" : "#00000066", },
          "& .MuiChartsAxis-tick": { stroke: isDark ? "#ffffff88" : "#00000066", },
        }}
      />
    </div>
  );
}

const formatDateRange2 = (from, to) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return `${from.toLocaleTimeString('pt-BR', options)} - ${to.toLocaleTimeString('pt-BR', options)}`;
};

export const CalendarEventListDemo = () => {
  const { user, fetchWithAuth } = useAuth();
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;

  useEffect(() => {
    let mounted = true;
    async function loadEvents() {
      if (!unidadeId) return;
      setLoadingEvents(true);
      try {
        const fetchFn = fetchWithAuth || fetch;
        const res = await fetchFn(`${API_URL}/lotesPlantio/${unidadeId}`);
        const data = await res.json().catch(() => ({}));
        if (!mounted) return;
        const arr = data?.lotes ?? data?.data ?? (Array.isArray(data) ? data : []);
        if (Array.isArray(arr) && arr.length > 0) {
          const mapped = arr.map((l, idx) => {
            const fromMs = Date.parse(l.plantio || l.dataPlantio || l.createdAt || new Date()) || Date.now();
            const fromIso = new Date(fromMs).toISOString();
            const toIso = new Date(fromMs + 60 * 60 * 1000).toISOString();
            return {
              id: l.id ?? idx,
              title: l.nome || l.produto || l.tipo || `Lote ${l.id ?? idx}`,
              from: fromIso,
              to: toIso,
            };
          });
          setEvents(mapped);
        }
        else { setEvents([]); }
      } catch (err) {
        console.error('Erro ao carregar eventos do calendário:', err);
        toast.error('Erro ao carregar eventos do calendário');
      }
      finally { if (mounted) setLoadingEvents(false); }
    }
    loadEvents();
    return () => { mounted = false };
  }, [unidadeId, fetchWithAuth]);

  const filteredEvents = events.filter(event => new Date(event.from).toDateString() === date?.toDateString());

  return (
    <div>
      <Card className='w-full py-2 border-gray-200 dark:border-gray-700'>
        <CardContent className='px-4'>
          <Calendar mode='single' selected={date} onSelect={setDate} className='w-full bg-transparent p-0' required modifiersClassNames={{ today: 'bg-[#738C16] text-white rounded-xl ', selected: 'rounded-xl text-white ' }} />
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
            {loadingEvents ? (
              <p className="text-sm text-muted-foreground p-2">Carregando eventos...</p>
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <div key={event.id ?? event.title} className='bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full'>
                  <div className='font-medium'>{event.title}</div>
                  <div className='text-muted-foreground text-xs'>{formatDateRange2(new Date(event.from), new Date(event.to))}</div>
                </div>
              ))
            ) : (<p className="text-sm text-muted-foreground p-2">Nenhum evento para este dia.</p>)}
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
          <ItemDescription>Outlined style with clear borders and transparent background.</ItemDescription>
        </ItemContent>
        <ItemActions><Button variant="outline" size="sm">Open</Button></ItemActions>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Muted Variant</ItemTitle>
          <ItemDescription>Subdued appearance with muted colors for secondary content.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">Open</Button>
        </ItemActions>
      </Item>
    </div>
  )
}

export function TableDemo() {
  const { user, fetchWithAuth } = useAuth();
  const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
  const [adminsState, setAdminsState] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadAdmins() {
      if (!unidadeId) return;
      setLoadingAdmins(true);
      try {
        const fetchFn = fetchWithAuth || fetch;
        const res = await fetchFn(`${API_URL}/usuarios/unidade/listar`);
        const json = await res.json().catch(() => ({}));
        if (!mounted) return;
        if (res.ok && json.sucesso && Array.isArray(json.usuarios)) {
          const mapped = json.usuarios.map(u => ({ id: u.id, nome: u.nome, email: u.email, telefone: u.telefone }));
          setAdminsState(mapped);
        }
        else {setAdminsState([]);}
      } catch (err) {
        console.error('Erro ao carregar administradores:', err);
        toast.error('Erro ao carregar administradores');
      }
      finally {if (mounted) setLoadingAdmins(false);}
    }
    loadAdmins();
    return () => { mounted = false };
  }, [unidadeId, fetchWithAuth]);

  return (
    <div className="border rounded-lg shadow-sm bg-white dark:bg-black">
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
          {loadingAdmins ? (
            <TableRow><TableCell colSpan={4} className="text-center">Carregando...</TableCell></TableRow>
          ) : adminsState.length === 0 ? (
            <TableRow><TableCell colSpan={4} className="text-center">Nenhum administrador encontrado.</TableCell></TableRow>
          ) : (
            adminsState.map((admin) => (
              <TableRow key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <TableCell className="font-medium">{admin.id}</TableCell>
                <TableCell>{admin.nome}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.telefone}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
