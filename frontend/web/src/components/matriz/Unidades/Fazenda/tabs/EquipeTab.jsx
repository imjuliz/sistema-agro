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

const equipe = [
  {
    id: 1,
    name: 'Sarah Johnson',
    title: 'Head of Engineering',
    department: 'Engineering',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    avatar: '/api/placeholder/48/48',
    isPrimary: true,
    lastContact: '2 hours ago',
  },
  {
    id: 2,
    name: 'Michael Chen',
    title: 'HR Manager',
    department: 'Human Resources',
    email: 'michael.chen@techcorp.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    avatar: '/api/placeholder/48/48',
    isPrimary: false,
    lastContact: '1 day ago',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    title: 'Talent Acquisition Lead',
    department: 'Human Resources',
    email: 'emily.rodriguez@techcorp.com',
    phone: '+1 (555) 345-6789',
    location: 'San Francisco, CA',
    avatar: '/api/placeholder/48/48',
    isPrimary: false,
    lastContact: '3 days ago',
  },
  {
    id: 4,
    name: 'David Park',
    title: 'VP of Product',
    department: 'Product',
    email: 'david.park@techcorp.com',
    phone: '+1 (555) 456-7890',
    location: 'San Francisco, CA',
    avatar: '/api/placeholder/48/48',
    isPrimary: false,
    lastContact: '1 week ago',
  }
];

// --------------------------------------------------------------------------------
// lado esquerdo da tela
// --------------------------------------------------------------------------------
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

const sampleUnits = Array.from({ length: 12 }).map((_, i) => {
  const types = ["Matriz", "Fazenda", "Loja"];
  const t = types[i % 3];
  return {
    id: `U-${100 + i}`,
    name: `${t} ${i + 1}`,
    type: t,
    location: ["São Paulo, SP", "Campinas, SP", "Hortolândia, SP"][i % 3],
    manager: ["Ana Souza", "Carlos Lima", "Mariana P."][i % 3],
    status: i % 5 === 0 ? "Inativa" : "Ativa",
    sync: new Date(Date.now() - i * 3600_000).toISOString(),
    iotHealth: Math.floor(Math.random() * 100),
  };
});

export function EquipeTab() {
  const [query, setQuery] = useState('');
  const [units, setUnits] = useState(sampleUnits);
  const [typeFilters, setTypeFilters] = useState({ Matriz: true, Fazenda: true, Loja: true }); // por default mostra todos
  const [statusFilters, setStatusFilters] = useState({ Ativa: true, Inativa: true });
  const [locationQuery, setLocationQuery] = useState('');

  // filtragem principal - integra query, tipos, status e localização
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return units.filter(u => {
      const matchQuery = q === '' || [u.name, u.location, u.manager, u.id].some(f => f.toLowerCase().includes(q));
      const matchType = !!typeFilters[u.type]; // verifica o checkbox do tipo
      const matchStatus = !!statusFilters[u.status];
      const matchLocation = locationQuery.trim() === '' || u.location.toLowerCase().includes(locationQuery.trim().toLowerCase());
      return matchQuery && matchType && matchStatus && matchLocation;
    });
  }, [units, query, typeFilters, statusFilters, locationQuery]);

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
                        {["Gerente", "Agricultor", "Sei lá"].map(t => (
                          <label key={t} className="flex items-center justify-between px-2 py-1 rounded hover:bg-neutral-900 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Checkbox checked={!!typeFilters[t]} onCheckedChange={() => { toggleType(t); setPage(1); }} />
                              <div className="capitalize">{t}</div>
                            </div>
                            <div className="text-sm text-neutral-400">{units.filter(u => u.type === t).length}</div>
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

        {equipe.map((eqp) => (
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