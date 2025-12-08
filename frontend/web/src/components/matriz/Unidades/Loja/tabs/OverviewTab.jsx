"use client"
import React, { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { API_URL } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import buildImageUrl from '@/lib/image';
import { TrendingUp, TrendingDown, Users, Calendar, MessageSquare, ChevronDown, Phone, Mail, Building2, DollarSign, Bell, Clock, Plus, Tractor, LandPlot, Trees, ScrollText, Briefcase } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Pie, PieChart } from "recharts"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export function OverviewTab({ lojaId }) {
  const { fetchWithAuth } = useAuth()
  const [dadosLoja, setDadosLoja] = useState(null)
  const [contatosPrincipais, setContatosPrincipais] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [dadosGerais, setDadosGerais] = useState([])
  const [dadosLoading, setDadosLoading] = useState(false)
  const [dadosErro, setDadosErro] = useState(null)
  const [formNovo, setFormNovo] = useState({ dado: "", valor: "", descricao: "" })
  const [editingId, setEditingId] = useState(null)
  const [formEdit, setFormEdit] = useState({ dado: "", valor: "", descricao: "" })
  const [openNovo, setOpenNovo] = useState(false)

  // Carregar dados da loja ao montar o componente
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
          return
        }

        const body = await response.json()
        const unidade = body?.unidade ?? body

        if (unidade) {
          setDadosLoja(unidade)
        } else {
          console.error("Erro ao carregar dados da loja:", body)
        }
      } catch (error) {
        console.error("Erro ao buscar dados da loja:", error)
      } finally {
        setCarregando(false)
      }
    }

    if (lojaId) {
      carregarDados()
    }
  }, [lojaId, fetchWithAuth])

  // corrige ícones do leaflet em bundlers (mesma lógica usada em outras páginas)
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

  // Dados gerais da unidade (CRUD)
  useEffect(() => {
    let mounted = true;
    async function carregarDadosGerais() {
      if (!lojaId) return;
      setDadosLoading(true);
      setDadosErro(null);
      try {
        const res = await fetchWithAuth(`${API_URL}unidades/${lojaId}/dados-gerais`, { method: "GET", credentials: "include" });
        const body = await res.json().catch(() => null);
        const lista = body?.dados ?? body ?? [];
        if (mounted) setDadosGerais(Array.isArray(lista) ? lista : []);
      } catch (err) {
        console.error("[dados-gerais] erro ao listar", err);
        toast.error("Erro ao carregar dados gerais");
        if (mounted) setDadosErro("Erro ao carregar dados gerais");
      } finally {
        if (mounted) setDadosLoading(false);
      }
    }
    carregarDadosGerais();
    return () => { mounted = false; };
  }, [lojaId, fetchWithAuth]);

  async function handleCriarDado(e) {
    e.preventDefault();
    if (!formNovo.dado || !formNovo.valor) {
      setDadosErro("Preencha 'dado' e 'valor'.");
      return;
    }
    try {
      const res = await fetchWithAuth(`${API_URL}unidades/${lojaId}/dados-gerais`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formNovo),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || body?.sucesso === false) {
        throw new Error(body?.erro || `HTTP ${res.status}`);
      }
      const novo = body?.dado ?? body;
      setDadosGerais(prev => [novo, ...prev]);
      setFormNovo({ dado: "", valor: "", descricao: "" });
      setDadosErro(null);
      setOpenNovo(false);
      toast.success("Dado criado com sucesso");
    } catch (err) {
      console.error("[dados-gerais] criar", err);
      setDadosErro("Erro ao criar dado");
      toast.error("Erro ao criar dado");
    }
  }

  function startEdit(item) {
    setEditingId(item.id);
    setFormEdit({ dado: item.dado || "", valor: item.valor || "", descricao: item.descricao || "" });
  }

  function cancelEdit() {
    setEditingId(null);
    setFormEdit({ dado: "", valor: "", descricao: "" });
  }

  async function handleSalvarEdicao(id) {
    try {
      const res = await fetchWithAuth(`${API_URL}unidades/${lojaId}/dados-gerais/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formEdit),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || body?.sucesso === false) throw new Error(body?.erro || `HTTP ${res.status}`);
      const atualizado = body?.dado ?? body;
      setDadosGerais(prev => prev.map(d => d.id === id ? atualizado : d));
      cancelEdit();
      setDadosErro(null);
      toast.success("Dado atualizado");
    } catch (err) {
      console.error("[dados-gerais] atualizar", err);
      setDadosErro("Erro ao atualizar dado");
      toast.error("Erro ao atualizar dado");
    }
  }

  async function handleExcluir(id) {
    try {
      const res = await fetchWithAuth(`${API_URL}unidades/${lojaId}/dados-gerais/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.erro || `HTTP ${res.status}`);
      }
      setDadosGerais(prev => prev.filter(d => d.id !== id));
      toast.success("Dado excluído");
    } catch (err) {
      console.error("[dados-gerais] excluir", err);
      setDadosErro("Erro ao excluir dado");
      toast.error("Erro ao excluir dado");
    }
  }

  // formatter: CNPJ (00.000.000/0000-00)
  function formatCNPJ(value) {
    if (!value) return '-';
    const digits = String(value).replace(/\D/g, '');
    if (digits.length === 0) return '-';
    const padded = digits.padEnd(14, '0').slice(0, 14);
    return padded.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  // small phone formatter (brasileiro-ish)
  function formatPhone(v) {
    if (!v) return '-';
    const d = String(v).replace(/\D/g, '');
    if (d.length <= 2) return d;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
  }

  // monta link do WhatsApp a partir do número
  function buildWhatsAppUrl(phone) {
    if (!phone) return '#';
    const digits = String(phone).replace(/\D/g, '');
    if (!digits) return '#';
    // se parecer com número BR (10 ou 11 dígitos) e não contém country code, adiciona 55
    let full = digits;
    if ((digits.length === 10 || digits.length === 11) && !digits.startsWith('55')) {
      full = '55' + digits;
    }
    return `https://wa.me/${full}`;
  }

  // buscar contatos da unidade e escolher até 3: priorizar GERENTE_LOJA, complementar com FUNCIONARIO_LOJA
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
        // fallback: if body.unidade?.usuarios
        const usuarios = users.length ? users : (body?.unidade?.usuarios ?? []);

        // normalize and filter
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
    <div className="flex gap-6 ">
      <div className="w-80 space-y-6">
        {/* Company Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informações da unidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                <div className="text-sm text-muted-foreground">{carregando ? "Carregando..." : (dadosLoja?.criadoEm ? new Date(dadosLoja.criadoEm).toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" }) : "-")}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ScrollText className="size-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">CNPJ</div>
                <div className="text-sm text-muted-foreground">{carregando ? "Carregando..." : formatCNPJ(dadosLoja?.cnpj)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Contacts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Contatos principais</CardTitle>
            {/* <Button variant="ghost" size="sm">
              <MoreHorizontal className="size-4" />
            </Button> */}
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
                    {/* <div className="text-xs text-muted-foreground">{contact.title}</div> */}
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
                      {/* future: message button
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <MessageSquare className="size-3" />
                        </Button>
                      */}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Reminders */}
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Reminders</CardTitle>
            <Bell className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{reminder.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="size-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{reminder.time}</span>
                    </div>
                  </div>
                  <Badge
                    variant={reminder.priority === 'high' ? 'destructive' :
                      reminder.priority === 'medium' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {reminder.priority}
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="size-4 mr-2" />
              Add Reminder
            </Button>
          </CardContent>
        </Card> */}
      </div>


      <div className=" flex-1 min-w-0 space-y-6">
        {/* Dados Gerais da Área */}
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-6">
          {/* <div className="grid grid-cols-4 gap-4"> */}
          <Card className={"p-0 h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition"}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg">
                  <LandPlot className="size-10" />
                </div>
                <div>
                  <div className="text-2xl font-medium">{carregando ? "-" : (dadosLoja?.horarioAbertura || "-")}</div>
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
                  <div className="text-2xl font-medium">{carregando ? "-" : (dadosLoja?.horarioFechamento || "-")}</div>
                  <div className="text-sm text-muted-foreground">Horário de fechamento</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* tabela */}
        <div className="w-full">
         <div className='h-full'>
              <Card className='h-full'>
                <CardHeader><CardTitle>Mapa</CardTitle></CardHeader>
                <CardContent className='h-full'>
                  {dadosLoja?.latitude != null && dadosLoja?.longitude != null ? (
                    <div className='h-full rounded-md overflow-hidden'>
                      <MapContainer
                        style={{ height: '100%', width: '100%' }}
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


        {/* Produção e Produtividade */}

        {/* Estrutura e Infraestrutura */}

        {/* Indicadores Ambientais e Legais */}

        {/* Job Progress */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Job Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobMetrics.map((job, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{job.title}</span>
                      <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                        {job.status}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {job.applications} applications
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Shortlisted</div>
                      <div className="font-medium">{job.shortlisted}</div>
                      <Progress value={(job.shortlisted / job.applications) * 100} className="h-1 mt-1" />
                    </div>
                    <div>
                      <div className="text-muted-foreground">Interviewed</div>
                      <div className="font-medium">{job.interviewed}</div>
                      <Progress value={(job.interviewed / job.shortlisted) * 100} className="h-1 mt-1" />
                    </div>
                    <div>
                      <div className="text-muted-foreground">Offered</div>
                      <div className="font-medium">1</div>
                      <Progress value={33} className="h-1 mt-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

        {/* Recent Activity */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <Avatar className="size-8">
                    <AvatarImage src={`/api/placeholder/32/32`} />
                    <AvatarFallback>{activity.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm">{activity.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {activity.user} • {activity.time}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

      </div>
    </div>
  );
}