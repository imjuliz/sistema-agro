"use client"
import React, { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { API_URL } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import buildImageUrl from '@/lib/image';
import { TrendingUp, TrendingDown, Users, Calendar, MessageSquare, ChevronDown, Phone, Mail, Building2, DollarSign, Bell, Clock, Plus, Tractor, LandPlot, Trees, ScrollText, Briefcase, CreditCard } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Pie, PieChart } from "recharts"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';
import { MoreHorizontal } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const cultivos = [
  { cultura: "milho", area: 70, fill: "var(--chart-1)" },
  { cultura: "soja", area: 50, fill: "var(--chart-2)" },
]
const cultivosConfig = {
  area: {
    label: "Área",
  },
  milho: {
    label: "Milho",
    color: "var(--chart-1)",
  },
  soja: {
    label: "Soja",
    color: "var(--chart-2)",
  }
}

export function OverviewTab({ lojaId }) {
  const { fetchWithAuth, user } = useAuth()
  const { toast } = useToast();
  const [dadosLoja, setDadosLoja] = useState(null)
  const [contatosPrincipais, setContatosPrincipais] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [caixas, setCaixas] = useState([])
  const [caixasLoading, setCaixasLoading] = useState(false)
  const [openEditInfo, setOpenEditInfo] = useState(false)
  const [openEditLocal, setOpenEditLocal] = useState(false)
  const [formInfo, setFormInfo] = useState({ nome: "", status: "", quantidadeFuncionarios: "", cnpj: "", horarioAbertura: "", horarioFechamento: "" })
  const [formLocal, setFormLocal] = useState({ endereco: "", cidade: "", estado: "", cep: "", latitude: "", longitude: "" })

  const isGerenteMatriz = useMemo(() => {
    const perfil = user?.perfil;
    const val = typeof perfil === "string" ? perfil : (perfil?.funcao ?? perfil?.nome);
    return String(val || "").toUpperCase() === "GERENTE_MATRIZ";
  }, [user]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true)
        if (!lojaId) {
          console.warn("lojaId não fornecido")
          return
        }

        const response = await fetchWithAuth(`${API_URL}unidades/${lojaId}`)

        if (!response.ok) {
          console.error("Erro ao carregar dados da loja: status", response.status)
          toast({ title: "Erro ao carregar dados da loja", description: `Status ${response.status}`, variant: "destructive" });
          return
        }

        const body = await response.json()
        const unidade = body?.unidade ?? body

        if (unidade) {
          setDadosLoja(unidade)
        } else {
          console.error("Erro ao carregar dados da loja:", body)
          toast({ title: "Erro ao carregar dados da loja", variant: "destructive" });
        }
      } catch (error) {
        console.error("Erro ao buscar dados da loja:", error)
        toast({ title: "Erro ao buscar dados da loja", description: "Verifique a sua conexão.", variant: "destructive" });
      } finally {
        setCarregando(false)
      }
    }

    if (lojaId) {
      carregarDados()
    }
  }, [lojaId, fetchWithAuth, toast])

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
      });
    } catch (e) {
      // ignore in SSR or bundlers that don't allow require at runtime
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    async function carregarCaixas() {
      if (!lojaId) return;
      setCaixasLoading(true);
      try {
        // Buscar caixas da unidade de hoje
        const hoje = new Date();
        const inicioDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
        const fimDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59, 999);
        
        // Tentar endpoint específico primeiro, depois fallback
        let res;
        try {
          res = await fetchWithAuth(`${API_URL}unidades/${lojaId}/caixas?dataInicio=${inicioDoDia.toISOString()}&dataFim=${fimDoDia.toISOString()}`, { method: "GET", credentials: "include" });
        } catch (e) {
          // Fallback: buscar todos os caixas da unidade e filtrar no frontend
          res = await fetchWithAuth(`${API_URL}unidades/${lojaId}/caixas`, { method: "GET", credentials: "include" });
        }
        
        if (!res.ok) {
          if (mounted) setCaixas([]);
          return;
        }
        
        const body = await res.json().catch(() => null);
        let lista = body?.caixas ?? body?.data ?? body ?? [];
        
        // Se retornou todos os caixas, filtrar apenas os de hoje
        if (Array.isArray(lista) && lista.length > 0) {
          lista = lista.filter(c => {
            if (!c.abertoEm) return false;
            const abertoEm = new Date(c.abertoEm);
            return abertoEm >= inicioDoDia && abertoEm <= fimDoDia;
          });
        }
        
        if (mounted) setCaixas(Array.isArray(lista) ? lista : []);
      } catch (err) {
        console.error("[caixas] erro ao listar", err);
        toast({ title: "Erro ao carregar caixas", variant: "destructive" });
        if (mounted) setCaixas([]);
      } finally {
        if (mounted) setCaixasLoading(false);
      }
    }
    carregarCaixas();
    return () => { mounted = false; };
  }, [lojaId, fetchWithAuth, toast]);


  function formatCnpjInput(value) {
    const digits = String(value || "").replace(/\D/g, "").slice(0, 14);
    if (!digits) return "";
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return digits.replace(/(\d{2})(\d+)/, "$1.$2");
    if (digits.length <= 8) return digits.replace(/(\d{2})(\d{3})(\d+)/, "$1.$2.$3");
    if (digits.length <= 12) return digits.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, "$1.$2.$3/$4");
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, "$1.$2.$3/$4-$5");
  }

  function hydrateFormsFromDados(unidade) {
    setFormInfo({
      nome: unidade?.nome ?? "",
      status: unidade?.status ?? "",
      quantidadeFuncionarios: unidade?.quantidadeFuncionarios ?? "",
      cnpj: formatCnpjInput(unidade?.cnpj ?? ""),
      horarioAbertura: unidade?.horarioAbertura ?? "",
      horarioFechamento: unidade?.horarioFechamento ?? "",
    });
    setFormLocal({
      endereco: unidade?.endereco ?? "",
      cidade: unidade?.cidade ?? "",
      estado: unidade?.estado ?? "",
      cep: unidade?.cep ?? "",
      latitude: unidade?.latitude ?? "",
      longitude: unidade?.longitude ?? "",
    });
  }

  useEffect(() => {
    if (dadosLoja) hydrateFormsFromDados(dadosLoja);
  }, [dadosLoja]);

  async function salvarInfo() {
    try {
      const payload = {
        nome: formInfo.nome,
        status: formInfo.status || undefined,
        cnpj: formInfo.cnpj ? formInfo.cnpj.replace(/\D/g, "") : null,
        horarioAbertura: formInfo.horarioAbertura || null,
        horarioFechamento: formInfo.horarioFechamento || null,
      };
      const res = await fetchWithAuth(`${API_URL}unidades/${lojaId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || body?.sucesso === false) throw new Error(body?.erro || `HTTP ${res.status}`);
      const unidadeAtualizada = body?.unidade ?? body;
      setDadosLoja(prev => ({ ...prev, ...unidadeAtualizada }));
      hydrateFormsFromDados(unidadeAtualizada);
      try {
        sessionStorage.setItem(`prefetched_loja_${lojaId}`, JSON.stringify({ unidade: unidadeAtualizada }));
      } catch {}
      try {
        window.dispatchEvent(new CustomEvent(`unidade-updated-${lojaId}`, { detail: unidadeAtualizada }));
      } catch {}
      setOpenEditInfo(false);
      toast({ title: "Informações atualizadas" });
    } catch (err) {
      console.error("[unidade] atualizar info", err);
      toast({ title: "Erro ao salvar informações da unidade", variant: "destructive" });
    }
  }

  async function salvarLocal() {
    try {
      const payload = {
        endereco: formLocal.endereco,
        cidade: formLocal.cidade,
        estado: formLocal.estado,
        cep: formLocal.cep,
        latitude: formLocal.latitude ? Number(formLocal.latitude) : null,
        longitude: formLocal.longitude ? Number(formLocal.longitude) : null,
      };
      const res = await fetchWithAuth(`${API_URL}unidades/${lojaId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || body?.sucesso === false) throw new Error(body?.erro || `HTTP ${res.status}`);
      const unidadeAtualizada = body?.unidade ?? body;
      setDadosLoja(prev => ({ ...prev, ...unidadeAtualizada }));
      hydrateFormsFromDados(unidadeAtualizada);
      setOpenEditLocal(false);
      toast({ title: "Localização atualizada" });
    } catch (err) {
      console.error("[unidade] atualizar localização", err);
      toast({ title: "Erro ao salvar localização", variant: "destructive" });
    }
  }

  function formatCNPJ(value) {
    if (!value) return '-';
    const digits = String(value).replace(/\D/g, '');
    if (digits.length === 0) return '-';
    const padded = digits.padEnd(14, '0').slice(0, 14);
    return padded.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  function formatCEP(value) {
    if (!value) return '-';
    const digits = String(value).replace(/\D/g, '');
    if (!digits) return '-';
    if (digits.length <= 5) return digits;
    const d = digits.slice(0, 8).padEnd(8, '0');
    return d.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  function formatCoords(lat, lng) {
    if (lat === null || lat === undefined || lng === null || lng === undefined) return '-';
    const la = Number(lat);
    const lo = Number(lng);
    if (Number.isNaN(la) || Number.isNaN(lo)) return '-';
    return `${la.toFixed(6)}, ${lo.toFixed(6)}`;
  }

  function formatPhone(v) {
    if (!v) return '-';
    const d = String(v).replace(/\D/g, '');
    if (d.length <= 2) return d;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
  }

  function formatTime(timeValue) {
    if (!timeValue) return '—';
    try {
      // Se for string
      if (typeof timeValue === 'string') {
        const trimmed = timeValue.trim();
        if (!trimmed) return '—';
        
        // Se for string ISO (ex: "1970-01-01T10:00" ou "1970-01-01T10:00:00.000Z")
        if (trimmed.includes('T')) {
          const timePart = trimmed.split('T')[1];
          if (timePart) {
            // Remove timezone e milissegundos se existirem
            const timeOnly = timePart.split('.')[0].split('Z')[0].split('+')[0];
            const parts = timeOnly.split(':');
            if (parts.length >= 2) {
              const hours = parts[0].padStart(2, '0');
              const minutes = parts[1].padStart(2, '0');
              return `${hours}:${minutes}`;
            }
          }
        }
        
        // Se for string no formato HH:mm ou HH:mm:ss
        const parts = trimmed.split(':');
        if (parts.length >= 2) {
          const hours = parts[0].padStart(2, '0');
          const minutes = parts[1].padStart(2, '0');
          return `${hours}:${minutes}`;
        }
      }
      // Se for Date/DateTime
      if (timeValue instanceof Date) {
        return timeValue.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      }
      // Se for objeto com horas/minutos
      if (typeof timeValue === 'object' && timeValue.hours !== undefined) {
        return `${String(timeValue.hours).padStart(2, '0')}:${String(timeValue.minutes || 0).padStart(2, '0')}`;
      }
    } catch (e) {
      console.warn('Erro ao formatar horário:', e);
    }
    return '—';
  }

  function formatDate(dateValue) {
    if (!dateValue) return '—';
    try {
      const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
      if (isNaN(date.getTime())) return '—';
      return date.toLocaleDateString('pt-BR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      console.warn('Erro ao formatar data:', e);
      return '—';
    }
  }

  function formatDateTime(dateValue) {
    if (!dateValue) return '—';
    try {
      const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
      if (isNaN(date.getTime())) return '—';
      return date.toLocaleString('pt-BR', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.warn('Erro ao formatar data/hora:', e);
      return '—';
    }
  }

  function formatCurrency(value) {
    if (!value && value !== 0) return 'R$ 0,00';
    const num = Number(value);
    if (isNaN(num)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
  }

  function buildWhatsAppUrl(phone) {
    if (!phone) return '#';
    const digits = String(phone).replace(/\D/g, '');
    if (!digits) return '#';
    let full = digits;
    if ((digits.length === 10 || digits.length === 11) && !digits.startsWith('55')) {
      full = '55' + digits;
    }
    return `https://wa.me/${full}`;
  }

  useEffect(() => {
    let mounted = true;
    async function fetchContacts() {
      if (!lojaId) return;
      try {
        const url = `${API_URL}unidades/${lojaId}/usuarios`;
        const res = await fetchWithAuth(url);
        if (!res.ok) return;
        const body = await res.json().catch(() => null);
        const users = Array.isArray(body) ? body : (body?.usuarios ?? body?.usuarios ?? []);
        const usuarios = users.length ? users : (body?.unidade?.usuarios ?? []);

        const gerentes = usuarios.filter(u => u?.perfil?.funcao === 'GERENTE_LOJA');
        const funcionariosLoja = usuarios.filter(u => u?.perfil?.funcao === 'FUNCIONARIO_LOJA');

        const selected = [];
        for (const g of gerentes) {
          if (selected.length >= 3) break;
          selected.push(g);
        }
        for (const f of funcionariosLoja) {
          if (selected.length >= 3) break;
          selected.push(f);
        }

        if (mounted) setContatosPrincipais(selected.map(u => ({
          id: u.id,
          name: u.nome ?? u.name,
          title: u.perfil?.funcao ?? '',
          email: u.email,
          phone: u.telefone ?? u.phone,
          avatar: u.ftPerfil ?? null
        })));
      } catch (err) {
        // ignore
      }
    }
    fetchContacts();
    return () => { mounted = false; };
  }, [lojaId, fetchWithAuth]);

  return (
    <>
    <div className="flex gap-6 ">
      <div className="w-80 space-y-6">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-base">Informações da unidade</CardTitle>
            {/* {isGerenteMatriz && (
              <Button variant="outline" size="sm" onClick={() => setOpenEditInfo(true)}>
                Editar
              </Button>
            )} */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setOpenEditInfo(true)}>Editar</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Briefcase className="size-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Nome da unidade</div>
                <div className="text-sm text-muted-foreground">
                  {carregando ? "Carregando..." : (dadosLoja?.nome ?? "—")}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="size-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Quantidade de funcionários</div>
                <div className="text-sm text-muted-foreground">{carregando ? "Carregando..." : dadosLoja?.quantidadeFuncionarios || "0"}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="size-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Criado em</div>
                <div className="text-sm text-muted-foreground">{carregando ? "Carregando..." : formatDate(dadosLoja?.criadoEm)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ScrollText className="size-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">CNPJ</div>
                <div className="text-sm text-muted-foreground">{carregando ? "Carregando..." : formatCNPJ(dadosLoja?.cnpj)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="size-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Status</div>
                <div className="text-sm text-muted-foreground">
                  {carregando ? "Carregando..." : (dadosLoja?.status ?? "—")}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="size-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Horário de abertura</div>
                <div className="text-sm text-muted-foreground">
                  {carregando ? "Carregando..." : (formInfo.horarioAbertura ? formatTime(formInfo.horarioAbertura) : "—")}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="size-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Horário de fechamento</div>
                <div className="text-sm text-muted-foreground">
                  {carregando ? "Carregando..." : (formInfo.horarioFechamento ? formatTime(formInfo.horarioFechamento) : "—")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Contatos principais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contatosPrincipais.length === 0 ? (
              <div className="text-sm text-muted-foreground">Nenhum contato principal encontrado.</div>
            ) : (
              contatosPrincipais.map((contact) => (
                <div key={contact.id} className="flex items-start gap-3">
                  <Avatar className="size-10">
                    {contact.avatar ? (
                      <AvatarImage src={buildImageUrl(contact.avatar)} alt={contact.name} />
                    ) : (
                      <AvatarFallback>{String(contact.name || '').split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-sm">{contact.name}</div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <a href={buildWhatsAppUrl(contact.phone)} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${contact.name}`}>
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <Phone className="size-3" />
                        </Button>
                      </a>
                      <a href={`mailto:${encodeURIComponent(contact.email ?? '')}`} aria-label={`Email ${contact.name}`}>
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <Mail className="size-3" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>


      <div className=" flex-1 min-w-0 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Card className={"p-0 h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition"}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg">
                  <Clock className="size-10" />
                </div>
                <div>
                  <div className="text-2xl font-medium">{carregando ? "-" : (dadosLoja?.horarioAbertura ? formatTime(dadosLoja.horarioAbertura) : "—")}</div>
                  <div className="text-sm text-muted-foreground">Horário de abertura</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={"p-0 h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition"}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg">
                  <Clock className="size-10" />
                </div>
                <div>
                  <div className="text-2xl font-medium">{carregando ? "-" : (dadosLoja?.horarioFechamento ? formatTime(dadosLoja.horarioFechamento) : "—")}</div>
                  <div className="text-sm text-muted-foreground">Horário de fechamento</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full">
            <div className="flex flex-row justify-between mb-4">
              <div className="flex flex-col gap-2">
                <h3 className="leading-none font-semibold">Caixas do Dia</h3>
                <h4 className="text-sm text-muted-foreground">Caixas abertos hoje e faturamento.</h4>
              </div>
            </div>

          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Caixa ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Saldo Inicial</TableHead>
                  <TableHead>Saldo Final</TableHead>
                  <TableHead>Faturamento do Dia</TableHead>
                  <TableHead>Aberto em</TableHead>
                  <TableHead>Fechado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {caixasLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">Carregando...</TableCell>
                  </TableRow>
                )}
                {!caixasLoading && caixas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">Nenhum caixa encontrado para hoje.</TableCell>
                  </TableRow>
                )}
                {!caixasLoading && caixas.map((caixa) => {
                  const faturamento = caixa.saldoFinal && caixa.saldoInicial 
                    ? Number(caixa.saldoFinal) - Number(caixa.saldoInicial)
                    : 0;
                  return (
                    <TableRow key={caixa.id}>
                      <TableCell className="font-medium">#{caixa.id}</TableCell>
                      <TableCell>
                        <Badge variant={caixa.status ? "default" : "secondary"}>
                          {caixa.status ? "Aberto" : "Fechado"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(caixa.saldoInicial)}</TableCell>
                      <TableCell>{formatCurrency(caixa.saldoFinal || 0)}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(faturamento)}</TableCell>
                      <TableCell>
                        {formatDateTime(caixa.abertoEm)}
                      </TableCell>
                      <TableCell>
                        {caixa.fechadoEm ? formatDateTime(caixa.fechadoEm) : '—'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="flex flex-col gap-6 basis-[70%] min-w-0">
            <div className='h-full'>
              <Card className='h-full'>
                <CardHeader><CardTitle>Mapa</CardTitle></CardHeader>
                <CardContent className='h-full'>
                  {dadosLoja?.latitude != null && dadosLoja?.longitude != null ? (
                    <div className='h-full rounded-md overflow-hidden'>
                  <MapContainer
                    style={{ height: '100%', width: '100%', zIndex: 0 }}
                        center={[Number(dadosLoja.latitude), Number(dadosLoja.longitude)]}
                        zoom={12}
                        scrollWheelZoom={false}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[Number(dadosLoja.latitude), Number(dadosLoja.longitude)]}>
                          <Popup>
                            <div className="min-w-[160px]">
                              <div className="font-semibold">{dadosLoja?.nome ?? dadosLoja?.name}</div>
                              <div className="text-sm text-muted-foreground">{dadosLoja?.cidade ?? dadosLoja?.cidade ?? ''}</div>
                            </div>
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  ) : (
                    <div className='h-56 bg-muted rounded-md flex items-center justify-center'>
                      <div>Coordenadas não disponíveis para esta unidade.</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="basis-[30%]">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-base">Localização</CardTitle>
                {isGerenteMatriz && (
                  <Button variant="outline" size="sm" onClick={() => setOpenEditLocal(true)}>
                    Editar
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="size-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{carregando ? "Carregando..." : (dadosLoja?.endereco || '—')}</div>
                    <div className="text-sm text-muted-foreground">Endereço</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="size-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{carregando ? "Carregando..." : (dadosLoja?.cidade || '—')}</div>
                    <div className="text-sm text-muted-foreground">Cidade</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="size-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{carregando ? "Carregando..." : (dadosLoja?.estado || '—')}</div>
                    <div className="text-sm text-muted-foreground">Estado</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ScrollText className="size-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{carregando ? "Carregando..." : formatCEP(dadosLoja?.cep || dadosLoja?.cep)}</div>
                    <div className="text-sm text-muted-foreground">CEP</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ScrollText className="size-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{carregando ? "Carregando..." : formatCoords(dadosLoja?.latitude, dadosLoja?.longitude)}</div>
                    <div className="text-sm text-muted-foreground">Coordenadas</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </div>

    <Dialog open={openEditInfo} onOpenChange={setOpenEditInfo}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar informações da unidade</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Nome da unidade</Label>
            <Input
              value={formInfo.nome}
              onChange={(e) => setFormInfo((f) => ({ ...f, nome: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Status</Label>
            <Select
              value={formInfo.status || 'ATIVA'}
              onValueChange={(v) => setFormInfo((f) => ({ ...f, status: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ATIVA">ATIVA</SelectItem>
                <SelectItem value="INATIVA">INATIVA</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Horário de abertura</Label>
            <Input
              type="time"
              value={formInfo.horarioAbertura || ""}
              onChange={(e) => setFormInfo(f => ({ ...f, horarioAbertura: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Horário de fechamento</Label>
            <Input
              type="time"
              value={formInfo.horarioFechamento || ""}
              onChange={(e) => setFormInfo(f => ({ ...f, horarioFechamento: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Quantidade de funcionários</Label>
            <Input
              type="number"
              value={formInfo.quantidadeFuncionarios}
              onChange={(e) => setFormInfo((f) => ({ ...f, quantidadeFuncionarios: f.quantidadeFuncionarios }))}
              disabled
              readOnly
            />
          </div>
          <div className="space-y-1">
            <Label>CNPJ</Label>
            <Input
              value={formInfo.cnpj}
              onChange={(e) => setFormInfo((f) => ({ ...f, cnpj: formatCnpjInput(e.target.value) }))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpenEditInfo(false)}>Cancelar</Button>
          <Button onClick={salvarInfo}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog open={openEditLocal} onOpenChange={setOpenEditLocal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar localização</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Endereço</Label>
            <Input value={formLocal.endereco} onChange={(e) => setFormLocal(f => ({ ...f, endereco: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <Label>Cidade</Label>
            <Input value={formLocal.cidade} onChange={(e) => setFormLocal(f => ({ ...f, cidade: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <Label>Estado</Label>
            <Input value={formLocal.estado} onChange={(e) => setFormLocal(f => ({ ...f, estado: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <Label>CEP</Label>
            <Input value={formLocal.cep} onChange={(e) => setFormLocal(f => ({ ...f, cep: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>Latitude</Label>
              <Input value={formLocal.latitude} onChange={(e) => setFormLocal(f => ({ ...f, latitude: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Longitude</Label>
              <Input value={formLocal.longitude} onChange={(e) => setFormLocal(f => ({ ...f, longitude: e.target.value }))} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpenEditLocal(false)}>Cancelar</Button>
          <Button onClick={salvarLocal}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}


