"use client"
import React, { useState, useEffect, useMemo } from "react"
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
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Pie, PieChart } from "recharts"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';

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
  const [dadosGerais, setDadosGerais] = useState([])
  const [dadosLoading, setDadosLoading] = useState(false)
  const [dadosErro, setDadosErro] = useState(null)
  const [formNovo, setFormNovo] = useState({ dado: "", valor: "", descricao: "" })
  const [editingId, setEditingId] = useState(null)
  const [formEdit, setFormEdit] = useState({ dado: "", valor: "", descricao: "" })
  const [openNovo, setOpenNovo] = useState(false)
  const [openEditInfo, setOpenEditInfo] = useState(false)
  const [openEditLocal, setOpenEditLocal] = useState(false)
  const [formInfo, setFormInfo] = useState({ focoProdutivo: "", quantidadeFuncionarios: "", cnpj: "" })
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
        toast({ title: "Erro ao carregar dados gerais", variant: "destructive" });
        if (mounted) setDadosErro("Erro ao carregar dados gerais");
      } finally {
        if (mounted) setDadosLoading(false);
      }
    }
    carregarDadosGerais();
    return () => { mounted = false; };
  }, [lojaId, fetchWithAuth, toast]);

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
      toast({ title: "Dado criado com sucesso" });
    } catch (err) {
      console.error("[dados-gerais] criar", err);
      setDadosErro("Erro ao criar dado");
      toast({ title: "Erro ao criar dado", variant: "destructive" });
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
      toast({ title: "Dado atualizado" });
    } catch (err) {
      console.error("[dados-gerais] atualizar", err);
      setDadosErro("Erro ao atualizar dado");
      toast({ title: "Erro ao atualizar dado", variant: "destructive" });
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
      toast({ title: "Dado excluído" });
    } catch (err) {
      console.error("[dados-gerais] excluir", err);
      setDadosErro("Erro ao excluir dado");
      toast({ title: "Erro ao excluir dado", variant: "destructive" });
    }
  }

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
      focoProdutivo: Array.isArray(unidade?.focoProdutivo) ? unidade.focoProdutivo.join(", ") : (unidade?.focoProdutivo ?? ""),
      quantidadeFuncionarios: unidade?.quantidadeFuncionarios ?? "",
      cnpj: formatCnpjInput(unidade?.cnpj ?? ""),
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
        focoProdutivo: formInfo.focoProdutivo,
        cnpj: formInfo.cnpj ? formInfo.cnpj.replace(/\D/g, "") : null,
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
            {isGerenteMatriz && (
              <Button variant="outline" size="sm" onClick={() => setOpenEditInfo(true)}>
                Editar
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Briefcase className="size-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Culturas atuais</div>
                <div className="text-sm text-muted-foreground">
                  {carregando
                    ? "Carregando..."
                    : (
                      Array.isArray(dadosLoja?.focoProdutivo)
                        ? dadosLoja.focoProdutivo.join(', ')
                        : (dadosLoja?.focoProdutivo ?? '—')
                    )}
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
        <div className="grid grid-cols-3 gap-6">
          <Card className={"p-0 h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition"}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg">
                  <LandPlot className="size-10" />
                </div>
                <div>
                  <div className="text-2xl font-medium">{carregando ? "-" : (dadosLoja?.areaTotal ? `${parseFloat(dadosLoja.areaTotal).toFixed(2)} ha` : "0 ha")}</div>
                  <div className="text-sm text-muted-foreground">Área Total</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={"p-0 h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition"}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg">
                  <Tractor className="size-10" />
                </div>
                <div>
                  <div className="text-2xl font-medium">{carregando ? "-" : (dadosLoja?.areaProdutiva ? `${parseFloat(dadosLoja.areaProdutiva).toFixed(2)} ha` : "0 ha")}</div>
                  <div className="text-sm text-muted-foreground">Área Produtiva</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={"p-0 h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition"}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg">
                  <Trees className="size-10 " />
                </div>
                <div>
                  <div className="text-2xl font-medium">{carregando ? "-" : (dadosLoja?.areaTotal && dadosLoja?.areaProdutiva ? `${(parseFloat(dadosLoja.areaTotal) - parseFloat(dadosLoja.areaProdutiva)).toFixed(2)} ha` : "0 ha")}</div>
                  <div className="text-sm text-muted-foreground">Não Produtiva</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="w-full">
            <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="leading-none font-semibold">Dados Gerais da Área</h3>
              <h4 className="text-sm text-muted-foreground">Gerencie dados específicos desta unidade.</h4>
            </div>

            {isGerenteMatriz && (
              <Button size="sm" onClick={() => setOpenNovo(true)}><Plus className="mr-2 h-4 w-4" />Novo dado</Button>
            )}
          </div>

          <div className="flex justify-between items-center py-2">
            <Dialog open={openNovo} onOpenChange={setOpenNovo}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                  <DialogTitle>Novo dado</DialogTitle>
                </DialogHeader>
                <form className="space-y-3" onSubmit={handleCriarDado}>
                  <Input
                    placeholder="Dado*"
                    value={formNovo.dado}
                    onChange={(e) => setFormNovo(f => ({ ...f, dado: e.target.value }))}
                    required
                  />
                  <Input
                    placeholder="Valor*"
                    value={formNovo.valor}
                    onChange={(e) => setFormNovo(f => ({ ...f, valor: e.target.value }))}
                    required
                  />
                  <Input
                    placeholder="Descrição (opcional)"
                    value={formNovo.descricao}
                    onChange={(e) => setFormNovo(f => ({ ...f, descricao: e.target.value }))}
                  />
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpenNovo(false)}>Cancelar</Button>
                    <Button type="submit">Salvar</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {dadosErro && <div className="text-sm text-red-500 mb-2">{dadosErro}</div>}

          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="max-w-[200px]">Dado</TableHead>
                  <TableHead className="max-w-[220px]">Valor</TableHead>
                  <TableHead className="max-w-[260px]">Descrição</TableHead>
                  <TableHead className="w-[180px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dadosLoading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">Carregando...</TableCell>
                  </TableRow>
                )}
                {!dadosLoading && dadosGerais.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">Nenhum dado cadastrado.</TableCell>
                  </TableRow>
                )}
                {!dadosLoading && dadosGerais.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="max-w-[200px] whitespace-nowrap text-ellipsis overflow-hidden">
                      {editingId === item.id ? (
                        <Input value={formEdit.dado} onChange={(e) => setFormEdit(f => ({ ...f, dado: e.target.value }))} />
                      ) : (
                        item.dado
                      )}
                    </TableCell>
                    <TableCell className="max-w-[220px] whitespace-nowrap text-ellipsis overflow-hidden">
                      {editingId === item.id ? (
                        <Input value={formEdit.valor} onChange={(e) => setFormEdit(f => ({ ...f, valor: e.target.value }))} />
                      ) : (
                        item.valor
                      )}
                    </TableCell>
                    <TableCell className="max-w-[260px] break-words whitespace-pre-wrap">
                      {editingId === item.id ? (
                        <Input value={formEdit.descricao ?? ""} onChange={(e) => setFormEdit(f => ({ ...f, descricao: e.target.value }))} />
                      ) : (
                        item.descricao || "—"
                      )}
                    </TableCell>
                    <TableCell className="space-x-2">
                      {isGerenteMatriz ? (
                        editingId === item.id ? (
                          <>
                            <Button size="sm" onClick={() => handleSalvarEdicao(item.id)}>Salvar</Button>
                            <Button size="sm" variant="outline" onClick={cancelEdit}>Cancelar</Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" onClick={() => startEdit(item)}>Editar</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleExcluir(item.id)}>Excluir</Button>
                          </>
                        )
                      ) : (
                        <span className="text-xs text-muted-foreground">Somente leitura</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
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
            <Label>Culturas atuais (separe por vírgula)</Label>
            <Input
              value={formInfo.focoProdutivo}
              onChange={(e) => setFormInfo((f) => ({ ...f, focoProdutivo: e.target.value }))}
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


