import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MessageSquare, Calendar, MapPin, Briefcase, Edit, MoreHorizontal, Building2, Users, DollarSign, Bell, Clock, Plus, Sliders } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/lib/api';

const contacts = [
  {
    id: 1,
    name: 'Sarah Johnson',
    title: 'Head of Engineering',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    avatar: '/api/placeholder/40/40',
    status: 'primary'
  },
  {
    id: 2,
    name: 'Michael Chen',
    title: 'HR Manager',
    email: 'michael.chen@techcorp.com',
    phone: '+1 (555) 234-5678',
    avatar: '/api/placeholder/40/40',
    status: 'secondary'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    title: 'Talent Acquisition Lead',
    email: 'emily.rodriguez@techcorp.com',
    phone: '+1 (555) 345-6789',
    avatar: '/api/placeholder/40/40',
    status: 'secondary'
  }
];

const reminders = [
  {
    id: 1,
    title: 'Follow up on Senior Developer role',
    time: '2:00 PM today',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Call Sarah Johnson about new requirements',
    time: 'Tomorrow 10:00 AM',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Send candidate shortlist',
    time: 'Dec 15, 3:00 PM',
    priority: 'low'
  }
];

export function EquipeTab({ fazendaId }) {
  const { fetchWithAuth } = useAuth()
  const [query, setQuery] = useState('');
  const [equipe, setEquipe] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [typeFilters, setTypeFilters] = useState({ Gerente: true, Agricultor: true, "Funcionário": true }); // por default mostra todos
  const [statusFilters, setStatusFilters] = useState({ "Ativo": true, "Inativo": true });
  const [locationQuery, setLocationQuery] = useState('');
  const [page, setPage] = useState(1);

  // Carregar equipe da unidade
  useEffect(() => {
    const carregarEquipe = async () => {
      try {
        setCarregando(true)
        if (!fazendaId) {
          console.warn("fazendaId não fornecido")
          return
        }

        const response = await fetchWithAuth(`${API_URL}unidades/${fazendaId}/usuarios?page=1&perPage=100`)
        
        if (!response.ok) {
          console.error("Erro ao carregar equipe: status", response.status)
          return
        }

        const body = await response.json()
        const usuarios = body?.usuarios ?? []
        
        if (Array.isArray(usuarios)) {
          // Mapear dados do backend para o formato da tela
          const equipeFormatada = usuarios.map(user => ({
            id: user.id,
            name: user.nome,
            title: user.perfil?.funcao || 'Funcionário',
            department: user.perfil?.descricao || 'Sem departamento',
            email: user.email,
            phone: user.telefone || 'Não informado',
            location: `${user.unidade?.cidade || ''}, ${user.unidade?.estado || ''}`,
            avatar: user.ftPerfil || '/api/placeholder/48/48',
            isPrimary: false,
            lastContact: 'Não definido',
            status: user.status ? 'Ativo' : 'Inativo'
          }))
          setEquipe(equipeFormatada)
        } else {
          console.error("Erro ao carregar equipe:", body)
        }
      } catch (error) {
        console.error("Erro ao buscar equipe:", error)
      } finally {
        setCarregando(false)
      }
    }

    if (fazendaId) {
      carregarEquipe()
    }
  }, [fazendaId, fetchWithAuth])

  // Filtragem principal - integra query, tipos, status e localização
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return equipe.filter(eqp => {
      const matchQuery = q === '' || [eqp.name, eqp.email, eqp.phone].some(f => f?.toLowerCase().includes(q));
      const matchStatus = !!statusFilters[eqp.status];
      const matchLocation = locationQuery.trim() === '' || eqp.location.toLowerCase().includes(locationQuery.trim().toLowerCase());
      return matchQuery && matchStatus && matchLocation;
    });
  }, [equipe, query, statusFilters, locationQuery]);

  const toggleType = (type) => {
    setTypeFilters(prev => ({ ...prev, [type]: !prev[type] }))
  }

  const toggleStatus = (status) => {
    setStatusFilters(prev => ({ ...prev, [status]: !prev[status] }))
  }

  const resetFilters = () => {
    setQuery('')
    setLocationQuery('')
    setTypeFilters({ Gerente: true, Agricultor: true, "Funcionário": true })
    setStatusFilters({ "Ativo": true, "Inativo": true })
    setPage(1)
  }

  return (
    <div className="flex gap-6 ">
      
      <div className="flex-1 min-w-0 space-y-4">
         <div>
          {/* <CardHeader>
            <CardTitle className="text-base">Ações</CardTitle>
          </CardHeader> */}
          <div className="space-y-4">
            <div className="flex flex-row items-start gap-3">
              <div className="relative w-full">
                <Input placeholder="Buscar por nome ou email" value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} />
              </div>

              {/* FILTROS AVANÇADOS: usa Popover para menu parecido com dropdown */}
              <Popover >
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 px-3">
                    <Sliders className="h-4 w-4" />Filtros avançados
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="bottom" align="start" className="w-[360px] p-3">
                  {/* header com ações rápidas */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">Filtros Avançados</div>
                    <div className="text-sm text-neutral-400">{filtered.length} resultados</div>
                  </div>

                  <div className="space-y-3">
                    {/* funcao */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Função</div>
                      <div className="grid grid-cols-1 gap-1">
                        {["Gerente", "Agricultor", "Funcionário"].map(t => (
                          <label key={t} className="flex items-center justify-between px-2 py-1 rounded hover:bg-neutral-900 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Checkbox checked={!!typeFilters[t]} onCheckedChange={() => { toggleType(t); setPage(1); }} />
                              <div className="capitalize">{t}</div>
                            </div>
                            <div className="text-sm text-neutral-400">{equipe.filter(u => u.title === t).length}</div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <Separator />
                    {/* STATUS */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Status</div>
                      <div className="flex gap-2">
                        {["Ativo", "Inativo", "Férias", "Afastado"].map(s => (
                          <label key={s} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-neutral-900 cursor-pointer">
                            <Checkbox checked={!!statusFilters[s]} onCheckedChange={() => { toggleStatus(s); setPage(1); }} />
                            <div className="text-sm">{s}</div>
                          </label>
                        ))}
                      </div>
                    </div>
                    <Separator />

                    {/* TURNO */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Turno</div>
                      <div className="flex gap-2">
                        {["Manhã", "Tarde", "Noite"].map(s => (
                          <label key={s} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-neutral-900 cursor-pointer">
                            <Checkbox checked={!!statusFilters[s]} onCheckedChange={() => { toggleStatus(s); setPage(1); }} />
                            <div className="text-sm">{s}</div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* APLICAR / RESET */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => { setPage(1); /* já aplica por react */ }}>Aplicar</Button>
                        <Button size="sm" variant="ghost" onClick={() => resetFilters()}>Limpar</Button>
                      </div>
                    </div>

                  </div>
                </PopoverContent>
              </Popover>
              <div className=''>
                <Button className='w-full' size="sm"><Plus />Convidar</Button>
              </div>
            </div>


          </div>
        </div>

        {carregando ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Carregando equipe...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum funcionário encontrado</p>
          </div>
        ) : (
          filtered.map((eqp) => (
          <Card key={eqp.id} className={"p-0"}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <Avatar className="size-12">
                    <AvatarImage src={eqp.avatar} alt={eqp.name} />
                    <AvatarFallback>{eqp.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-lg">{eqp.name}</h3>
                      {eqp.isPrimary && (
                        <Badge variant="default">Primary Contact</Badge>
                      )}
                    </div>
                    <div className="text-muted-foreground mb-2">{eqp.title}</div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Briefcase className="size-3" />
                        <span>{eqp.department}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        <span>{eqp.location}</span>
                      </div>
                      <span>Last eqp: {eqp.lastContact}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="size-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 mb-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Contatos</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="size-4 text-muted-foreground" />
                      <span>{eqp.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="size-4 text-muted-foreground" />
                      <span>{eqp.phone}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Ações Rápidas</div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Mail className="size-4 mr-2" />
                      Email
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="size-4 mr-2" />
                      Ligar
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="size-4 mr-2" />
                      Mensagem
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t">
                {/* <Button size="sm">Log Activity</Button> */}
                <Button variant="outline" size="sm">
                  <Calendar className="size-4 mr-2" />
                  Marcar reunião
                </Button>
                <Button size="sm">Adicionar nota</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}