// // Gestão de Produção (Fazendas): Acompanhar toda a parte agrícola e pecuária.
// // layout: Visualização por fazenda → talhões/lotes. Calendário de atividades (plantio, irrigação, vacinação).
// //Funcionalidades: Registro de atividades (plantio, colheita, vacinação etc.). Planejamento de safra. Controle de estoque agrícola. Rastreabilidade: visualizar ciclo completo do produto.

// "use client"

// import React, { useEffect, useMemo, useState } from "react";
// import {
//     Card,
//     CardHeader,
//     CardTitle,
//     CardContent,
//     CardFooter,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//     Table,
//     TableHeader,
//     TableRow,
//     TableHead,
//     TableBody,
//     TableCell,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
// import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Separator } from "@/components/ui/separator";
// import { Skeleton } from "@/components/ui/skeleton";
// import { MoreHorizontal, Edit, Trash } from "lucide-react";

// // SAMPLE DATA (em app real, busque via API)
// const sampleUnits = Array.from({ length: 18 }).map((_, i) => {
//     const status = i % 6 === 0 ? "Inativa" : "Ativa";
//     return {
//         id: `F-${300 + i}`,
//         name: `Fazenda ${i + 1}`,
//         type: "Fazenda",
//         location: ["São Paulo, SP", "Campinas, SP", "Hortolândia, SP"][i % 3],
//         manager: ["Ana Souza", "Carlos Lima", "Mariana P."][i % 3],
//         status,
//         sync: new Date(Date.now() - i * 3600_000).toISOString(),
//         iotHealth: Math.floor(40 + Math.random() * 60),
//         areaHa: Math.floor(50 + Math.random() * 400),
//     };
// });

// export default function FazendasPage() {
//     const [units, setUnits] = useState(sampleUnits);
//     const [query, setQuery] = useState("");
//     const [locationFilter, setLocationFilter] = useState("");
//     const [selected, setSelected] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [page, setPage] = useState(1);
//     const [perPage, setPerPage] = useState(8);
//     const [sheetUnit, setSheetUnit] = useState(null);

//     useEffect(() => {
//         setLoading(true);
//         const t = setTimeout(() => setLoading(false), 350);
//         return () => clearTimeout(t);
//     }, []);

//     // filtra somente fazendas e aplica query + localização
//     const filtered = useMemo(() => {
//         const q = query.trim().toLowerCase();
//         return units.filter(u => {
//             const isFazenda = u.type === "Fazenda";
//             const matchQ = q === "" || [u.name, u.location, u.manager, u.id].some(f => f.toLowerCase().includes(q));
//             const matchLoc = locationFilter.trim() === "" || u.location.toLowerCase().includes(locationFilter.trim().toLowerCase());
//             return isFazenda && matchQ && matchLoc;
//         });
//     }, [units, query, locationFilter]);

//     const paged = useMemo(() => {
//         const start = (page - 1) * perPage;
//         return filtered.slice(start, start + perPage);
//     }, [filtered, page, perPage]);

//     function toggleSelect(id) {
//         setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
//     }
//     function selectAllOnPage() {
//         const ids = paged.map(u => u.id);
//         const all = ids.every(id => selected.includes(id));
//         setSelected(s => all ? s.filter(x => !ids.includes(x)) : [...new Set([...s, ...ids])]);
//     }
//     function bulkDelete() {
//         setUnits(prev => prev.filter(u => !selected.includes(u.id)));
//         setSelected([]);
//     }

//     const metrics = useMemo(() => {
//         const total = filtered.length;
//         const active = filtered.filter(u => u.status === "Ativa").length;
//         const inactive = total - active;
//         const avgIot = Math.round((filtered.reduce((s, u) => s + u.iotHealth, 0) / Math.max(1, filtered.length)) || 0);
//         const totalArea = filtered.reduce((s, u) => s + (u.areaHa || 0), 0);
//         return { total, active, inactive, avgIot, totalArea };
//     }, [filtered]);

//     return (
//         <div className="min-h-screen p-6 bg-surface-50">
//             <div className="max-w-screen-2xl mx-auto w-full">
//                 <header className="mb-4 flex items-center justify-between">
//                     <div>
//                         <h1 className="text-2xl font-bold">Unidades — Fazendas</h1>
//                         <p className="text-sm text-muted-foreground">Visão dedicada para a Matriz: resumo e detalhes de fazendas</p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <Button onClick={() => { setQuery(""); setLocationFilter(""); setPage(1); }}>Limpar filtros</Button>
//                         <Button variant="secondary" onClick={() => window.print()}>Imprimir</Button>
//                     </div>
//                 </header>

//                 {/* METRICS */}
//                 <div className="grid grid-cols-4 gap-4 mb-4">
//                     <Card>
//                         <CardHeader><CardTitle>Total de Fazendas</CardTitle></CardHeader>
//                         <CardContent>
//                             <div className="text-3xl font-bold">{metrics.total}</div>
//                             <div className="text-sm text-muted-foreground mt-1">Total de unidades do tipo Fazenda</div>
//                         </CardContent>
//                     </Card>

//                     <Card>
//                         <CardHeader><CardTitle>Ativas</CardTitle></CardHeader>
//                         <CardContent>
//                             <div className="text-3xl font-bold">{metrics.active}</div>
//                             <div className="text-sm text-muted-foreground mt-1">Fazendas com status Ativa</div>
//                         </CardContent>
//                     </Card>

//                     <Card>
//                         <CardHeader><CardTitle>Inativas</CardTitle></CardHeader>
//                         <CardContent>
//                             <div className="text-3xl font-bold">{metrics.inactive}</div>
//                             <div className="text-sm text-muted-foreground mt-1">Fazendas com status Inativa</div>
//                         </CardContent>
//                     </Card>

//                     <Card>
//                         <CardHeader><CardTitle>IoT (média)</CardTitle></CardHeader>
//                         <CardContent>
//                             <div className="text-3xl font-bold">{metrics.avgIot}%</div>
//                             <div className="text-sm text-muted-foreground mt-1">Média de saúde dos dispositivos</div>
//                         </CardContent>
//                     </Card>
//                 </div>

//                 {/* Filters + cards */}
//                 <Card>
//                     <CardHeader>
//                         <div className="flex items-center justify-between w-full">
//                             <div className="flex items-center gap-3">
//                                 <Input placeholder="Buscar por nome, ID ou responsável" value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} />
//                                 <Input placeholder="Filtrar por localização" value={locationFilter} onChange={e => { setLocationFilter(e.target.value); setPage(1); }} />
//                                 <Popover>
//                                     <PopoverTrigger asChild>
//                                         <Button variant="outline">Filtros</Button>
//                                     </PopoverTrigger>
//                                     <PopoverContent className="w-[260px]">
//                                         <div className="space-y-2">
//                                             <div className="text-sm font-medium">Opções rápidas</div>
//                                             <Separator />
//                                             <div className="flex items-center justify-between">
//                                                 <div className="flex items-center gap-2"><Checkbox checked /></div>
//                                                 <div className="text-sm text-muted-foreground">Mostrar apenas com IoT</div>
//                                             </div>
//                                             <div className="flex items-center justify-between">
//                                                 <div className="flex items-center gap-2"><Checkbox /></div>
//                                                 <div className="text-sm text-muted-foreground">Somente áreas maiores 100 ha</div>
//                                             </div>
//                                             <div className="flex justify-end pt-2">
//                                                 <Button size="sm" onClick={() => { /* aplicar filtros extras se houver */ }}>Aplicar</Button>
//                                             </div>
//                                         </div>
//                                     </PopoverContent>
//                                 </Popover>
//                             </div>

//                             <div className="flex items-center gap-2">
//                                 {selected.length > 0 && <div className="text-sm text-neutral-300">{selected.length} selecionada(s)</div>}
//                                 <Button variant="ghost" onClick={() => { /* export CSV logic */ handleExportCSV(filtered); }}>Exportar CSV</Button>
//                                 <Button variant="destructive" onClick={bulkDelete}><Trash className="h-4 w-4" /></Button>
//                             </div>
//                         </div>
//                     </CardHeader>

//                     <CardContent>
//                         {loading ? (
//                             <div className="space-y-2">
//                                 <Skeleton className="h-8 w-full" />
//                                 <Skeleton className="h-8 w-full" />
//                                 <Skeleton className="h-8 w-full" />
//                             </div>
//                         ) : (
//                             <div>
//                                 {/* Grid of cards */}
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                                     {paged.map(u => (
//                                         <div key={u.id} className="bg-card border border-neutral-800 rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer">
//                                             <div className="flex items-start justify-between gap-3">
//                                                 <div className="flex items-center gap-3">
//                                                     <Avatar><AvatarFallback>F</AvatarFallback></Avatar>
//                                                     <div>
//                                                         <div className="font-medium text-lg">{u.name}</div>
//                                                         <div className="text-sm text-muted-foreground">{u.id}</div>
//                                                         <div className="text-sm text-muted-foreground">{u.location}</div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="text-right">
//                                                     <div className="text-sm">Área</div>
//                                                     <div className="font-medium">{u.areaHa} ha</div>
//                                                 </div>
//                                             </div>

//                                             <div className="mt-3 flex items-center justify-between">
//                                                 <div className="flex items-center gap-2">
//                                                     <Badge variant={u.status === 'Ativa' ? 'secondary' : 'destructive'}>{u.status}</Badge>
//                                                     <div className="text-sm text-muted-foreground">IoT: {u.iotHealth}%</div>
//                                                 </div>
//                                             </div>

//                                             <div className="mt-3 text-sm text-muted-foreground">Última sync: {new Date(u.sync).toLocaleString()}</div>
//                                         </div>
//                                     ))}
//                                 </div>

//                                 {/* Empty state */}
//                                 {filtered.length === 0 && (
//                                     <div className="py-8 text-center text-muted-foreground">Nenhuma fazenda encontrada.</div>
//                                 )}
//                             </div>
//                         )}
//                     </CardContent>

//                 </Card>

//             </div>
//         </div>
//     );
// }

// // --- helpers locais (não exportados) ---
// function handleExportCSV(units) {
//     const headers = ["id", "name", "type", "location", "manager", "status", "sync", "iotHealth", "areaHa"];
//     const rows = units.map(u => headers.map(h => JSON.stringify(u[h] ?? "")).join(','));
//     const csv = [headers.join(','), ...rows].join('\n');
//     const blob = new Blob([csv], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url; a.download = `fazendas_export_${new Date().toISOString()}.csv`; a.click(); URL.revokeObjectURL(url);
// }
"use client";

import React from "react";
import { Avatar } from "@/ui/components/avatar";
import { Badge } from "@/ui/components/badge";
import { Button } from "@/ui/components/button";
import { IconButton } from "@/ui/components/IconButton";
import { IconWithBackground } from "@/ui/components/IconWithBackground";
import { LinkButton } from "@/ui/components/LinkButton";
import { Tabs } from "@/ui/components/tabs";
// import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { ArrowRight } from "@subframe/core";
import { Calendar } from "@subframe/core";
import { CircleDollarSign } from "@subframe/core";
import { Clock } from "@subframe/core";
import { Contact } from "@subframe/core";
import { DollarSign } from "@subframe/core";
import { Flag } from "@subframe/core";
import { GalleryVerticalEnd } from "@subframe/core";
import { Globe } from "@subframe/core";
import { Kanban } from "@subframe/core";
import { Mail } from "@subframe/core";
import { MailPlus } from "@subframe/core";
import { MapPin } from "@subframe/core";
import { MoveHorizontal } from "@subframe/core";
import { CirclePlus } from "@subframe/core";
import { FeatherStar } from "@subframe/core";
import { FeatherTag } from "@subframe/core";
import { FeatherText } from "@subframe/core";
import { FeatherUser } from "@subframe/core";
import { FeatherUserCheck } from "@subframe/core";
import { FeatherWrench } from "@subframe/core";
import { FeatherZap } from "@subframe/core";
import { ArrowRight, Calendar, CircleDollarSign, Clock, Contact, DollarSign, Flag, GalleryVerticalEnd, Globe, Kanban, Mail, MailPlus, MapPin, MoveHorizontal, CirclePlus, Star, Tag, TextAlignCenter, User, UserCheck, Wrench, Zap } from 'lucide-react'

function CompanyProfileDetail() {
  return (
    // <DefaultPageLayout>
    <div className="container max-w-none flex h-full w-full flex-col items-start gap-6 bg-default-background py-12">
      <div className="flex w-full flex-col items-start gap-4">
        <div className="flex w-full items-center gap-4">
          <div className="flex grow shrink-0 basis-0 items-center gap-3">
            <Avatar
              image="https://res.cloudinary.com/subframe/image/upload/v1724690133/uploads/302/tswlwr0qfwwhkgbjwplw.png"
              square={true}
            >
              A
            </Avatar>
            <span className="text-heading-2 font-heading-2 text-default-font">
              sweetgreen
            </span>
            <IconButton
              size="small"
              icon={<FeatherStar />}
              onClick={(event) => { }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="neutral-secondary"
              icon={<GalleryVerticalEnd />}
              onClick={(event) => { }}
            >
              Add to list
            </Button>
            <Button
              variant="neutral-secondary"
              icon={<FeatherWrench />}
              onClick={(event) => { }}
            >
              Run workflow
            </Button>
            <Button
              variant="neutral-secondary"
              icon={<MailPlus />}
              onClick={(event) => { }}
            >
              Compose email
            </Button>
          </div>
        </div>
        <div className="flex w-full items-center gap-2">
          <Badge variant="neutral" icon={<FeatherZap />}>
            Alex Smith
          </Badge>
          <div className="flex h-4 w-px flex-none flex-col items-center gap-2 bg-neutral-border" />
          <Badge variant="neutral" icon={<Mail />}>
            Alex Smith - about 3 hours ago
          </Badge>
        </div>
      </div>
      <div className="flex w-full items-start gap-6">
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6">
          <div className="flex w-full flex-col items-start gap-4">
            <Tabs>
              <Tabs.Item active={true}>Activity</Tabs.Item>
              <Tabs.Item active={false}>Emails</Tabs.Item>
              <Tabs.Item>Team</Tabs.Item>
              <Tabs.Item>Notes</Tabs.Item>
              <Tabs.Item>Tasks</Tabs.Item>
              <Tabs.Item>Files</Tabs.Item>
            </Tabs>
          </div>
          <div className="flex w-full flex-col items-start gap-4">
            <span className="text-heading-3 font-heading-3 text-default-font">
              Activity
            </span>
            <span className="text-body font-body text-subtext-color">
              2025
            </span>
            <div className="flex w-full flex-col items-start">
              <div className="flex w-full items-center gap-4 pb-4">
                <Badge variant="neutral">This week</Badge>
                <div className="flex h-px grow shrink-0 basis-0 flex-col items-center gap-2 bg-neutral-border" />
              </div>
              <div className="flex w-full items-start gap-6">
                <div className="flex flex-col items-center gap-2 self-stretch">
                  <IconWithBackground
                    size="small"
                    icon={<FeatherZap />}
                    square={true}
                  />
                  <div className="flex w-px grow shrink-0 basis-0 flex-col items-center gap-2 bg-neutral-border" />
                </div>
                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-3 pb-4">
                  <div className="flex w-full items-center gap-2">
                    <Avatar
                      size="small"
                      image="https://res.cloudinary.com/subframe/image/upload/v1711417514/shared/ubsk7cs5hnnaj798efej.jpg"
                    >
                      A
                    </Avatar>
                    <span className="text-body-bold font-body-bold text-default-font">
                      Alex Smith changed 7 attributes in
                    </span>
                    <Badge
                      variant="neutral"
                      icon={<CircleDollarSign />}
                    >
                      Sales
                    </Badge>
                    <span className="text-caption font-caption text-subtext-color">
                      3 mins ago
                    </span>
                  </div>
                  <div className="flex w-full items-center gap-2">
                    <div className="flex items-center px-1 py-1">
                      <Kanban className="text-body font-body text-subtext-color" />
                    </div>
                    <span className="text-body font-body text-subtext-color">
                      Stage
                    </span>
                    <ArrowRight className="text-body-bold font-body-bold text-subtext-color" />
                    <Badge variant="neutral">Meeting</Badge>
                  </div>
                  <div className="flex w-full items-center gap-2">
                    <div className="flex items-center px-1 py-1">
                      <Flag className="text-body font-body text-subtext-color" />
                    </div>
                    <span className="text-body font-body text-subtext-color">
                      Priority
                    </span>
                    <ArrowRight className="text-body-bold font-body-bold text-subtext-color" />
                    <Badge variant="neutral">Medium</Badge>
                  </div>
                  <div className="flex w-full items-center gap-2">
                    <div className="flex items-center px-1 py-1">
                      <FeatherUser className="text-body font-body text-subtext-color" />
                    </div>
                    <span className="text-body font-body text-subtext-color">
                      Owner
                    </span>
                    <ArrowRight className="text-body-bold font-body-bold text-subtext-color" />
                    <div className="flex items-center gap-1">
                      <Avatar
                        size="x-small"
                        image="https://res.cloudinary.com/subframe/image/upload/v1711417514/shared/ubsk7cs5hnnaj798efej.jpg"
                      >
                        A
                      </Avatar>
                      <span className="text-body font-body text-default-font">
                        Alex Smith
                      </span>
                    </div>
                  </div>
                  <div className="flex w-full items-center gap-2">
                    <div className="flex items-center px-1 py-1">
                      <DollarSign className="text-body font-body text-subtext-color" />
                    </div>
                    <span className="text-body font-body text-subtext-color">
                      Contract value
                    </span>
                    <ArrowRight className="text-body-bold font-body-bold text-subtext-color" />
                    <span className="text-body font-body text-default-font">
                      $50,000.00
                    </span>
                  </div>
                  <div className="flex w-full items-center gap-2">
                    <div className="flex items-center px-1 py-1">
                      <Contact className="text-body font-body text-subtext-color" />
                    </div>
                    <span className="text-body font-body text-subtext-color">
                      Point of Contact
                    </span>
                    <ArrowRight className="text-body-bold font-body-bold text-subtext-color" />
                    <div className="flex items-center gap-1">
                      <Avatar
                        size="x-small"
                        image="https://res.cloudinary.com/subframe/image/upload/v1724690133/uploads/302/tswlwr0qfwwhkgbjwplw.png"
                        square={true}
                      >
                        A
                      </Avatar>
                      <span className="text-body font-body text-default-font">
                        sweetgreen
                      </span>
                    </div>
                  </div>
                  <div className="flex w-full items-center gap-2">
                    <div className="flex items-center px-1 py-1">
                      <Calendar className="text-body font-body text-subtext-color" />
                    </div>
                    <span className="text-body font-body text-subtext-color">
                      Projected close date
                    </span>
                    <ArrowRight className="text-body-bold font-body-bold text-subtext-color" />
                    <span className="text-body font-body text-default-font">
                      Mar 1st 2025
                    </span>
                  </div>
                  <div className="flex w-full items-center gap-2">
                    <div className="flex items-center px-1 py-1">
                      <FeatherStar className="text-body font-body text-subtext-color" />
                    </div>
                    <span className="text-body font-body text-subtext-color">
                      Close confidence
                    </span>
                    <ArrowRight className="text-body-bold font-body-bold text-subtext-color" />
                    <div className="flex items-center gap-1">
                      <FeatherStar className="text-body font-body text-brand-primary" />
                      <FeatherStar className="text-body font-body text-brand-primary" />
                      <FeatherStar className="text-body font-body text-brand-primary" />
                      <FeatherStar className="text-body font-body text-brand-primary" />
                      <FeatherStar className="text-body font-body text-neutral-300" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-full items-start gap-6">
                <div className="flex flex-col items-center gap-2 self-stretch">
                  <div className="flex h-2 w-px flex-none flex-col items-center gap-2 bg-neutral-border" />
                  <IconWithBackground
                    size="small"
                    icon={<GalleryVerticalEnd />}
                    square={true}
                  />
                  <div className="flex w-px grow shrink-0 basis-0 flex-col items-center gap-2 bg-neutral-border" />
                </div>
                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2 py-4">
                  <div className="flex w-full items-center gap-2">
                    <Avatar
                      size="small"
                      image="https://res.cloudinary.com/subframe/image/upload/v1724690133/uploads/302/tswlwr0qfwwhkgbjwplw.png"
                      square={true}
                    >
                      A
                    </Avatar>
                    <span className="text-body-bold font-body-bold text-default-font">
                      sweetgreen was added to
                    </span>
                    <Badge
                      variant="neutral"
                      icon={<CircleDollarSign />}
                    >
                      Sales
                    </Badge>
                    <span className="text-caption font-caption text-subtext-color">
                      8 mins ago
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex w-full items-start gap-6">
                <div className="flex flex-col items-center gap-2 self-stretch">
                  <div className="flex h-2 w-px flex-none flex-col items-center gap-2 bg-neutral-border" />
                  <IconWithBackground
                    size="small"
                    icon={<CirclePlus />}
                    square={true}
                  />
                  <div className="flex w-px grow shrink-0 basis-0 flex-col items-center gap-2 bg-neutral-border" />
                </div>
                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2 py-4">
                  <div className="flex w-full items-center gap-2">
                    <Avatar
                      size="small"
                      image="https://res.cloudinary.com/subframe/image/upload/v1723780683/uploads/302/miu3qrdcodj27aeo9mu9.png"
                      square={true}
                    >
                      A
                    </Avatar>
                    <span className="text-body-bold font-body-bold text-default-font">
                      sweetgreen was created
                    </span>
                    <span className="text-caption font-caption text-subtext-color">
                      about 4 hrs ago
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex w-full items-center gap-4 py-4">
                <Badge variant="neutral">January</Badge>
                <div className="flex h-px grow shrink-0 basis-0 flex-col items-center gap-2 bg-neutral-border" />
              </div>
              <div className="flex w-full items-start gap-6">
                <div className="flex flex-col items-center gap-2 self-stretch">
                  <IconWithBackground
                    size="small"
                    icon={<GalleryVerticalEnd />}
                    square={true}
                  />
                </div>
                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
                  <div className="flex w-full items-center gap-2">
                    <Avatar
                      size="small"
                      image="https://res.cloudinary.com/subframe/image/upload/v1711417514/shared/ubsk7cs5hnnaj798efej.jpg"
                    >
                      A
                    </Avatar>
                    <span className="text-body-bold font-body-bold text-default-font">
                      Alex Smith first contacted sweetgreen
                    </span>
                    <span className="text-caption font-caption text-subtext-color">
                      2 mo ago
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-px flex-none flex-col items-center gap-2 self-stretch bg-neutral-border" />
        <div className="flex w-96 flex-none flex-col items-start gap-6">
          <div className="flex w-full flex-col items-start gap-4">
            <Tabs>
              <Tabs.Item active={true}>Details</Tabs.Item>
              <Tabs.Item active={false}>Comments</Tabs.Item>
            </Tabs>
          </div>
          <div className="flex w-full flex-col items-start gap-4">
            <span className="text-heading-3 font-heading-3 text-default-font">
              Profile Details
            </span>
            <div className="flex w-full flex-col items-start gap-3">
              <div className="flex w-full items-center gap-2">
                <div className="flex grow shrink-0 basis-0 items-center gap-2">
                  <Globe className="text-body font-body text-subtext-color" />
                  <span className="text-body font-body text-subtext-color">
                    Domain
                  </span>
                </div>
                <div className="flex grow shrink-0 basis-0 items-center gap-2">
                  <LinkButton
                    onClick={(
                      event
                    ) => { }}
                  >
                    sweetgreen.com
                  </LinkButton>
                </div>
              </div>
              <div className="flex w-full items-center gap-2">
                <div className="flex grow shrink-0 basis-0 items-center gap-2">
                  <Contact className="text-body font-body text-subtext-color" />
                  <span className="text-body font-body text-subtext-color">
                    Name
                  </span>
                </div>
                <div className="flex grow shrink-0 basis-0 items-center gap-2">
                  <span className="line-clamp-1 grow shrink-0 basis-0 text-body font-body text-default-font">
                    sweetgreen
                  </span>
                </div>
              </div>
              <div className="flex w-full items-center gap-2">
                <div className="flex grow shrink-0 basis-0 items-center gap-2">
                  <FeatherText className="text-body font-body text-subtext-color" />
                  <span className="text-body font-body text-subtext-color">
                    Description
                  </span>
                </div>
                <div className="flex grow shrink-0 basis-0 items-center gap-2">
                  <span className="line-clamp-1 grow shrink-0 basis-0 text-body font-body text-default-font">
                    sweetgreen offers simple, seasonal, and healthy salads.
                  </span>
                </div>
              </div>
              <div className="flex w-full items-center gap-2">
                <div className="flex grow shrink-0 basis-0 items-center gap-2">
                  <FeatherTag className="text-body font-body text-subtext-color" />
                  <span className="text-body font-body text-subtext-color">
                    Categories
                  </span>
                </div>
                <div className="flex grow shrink-0 basis-0 items-center gap-2">
                  <Badge>Retail</Badge>
                  <Badge>Food</Badge>
                  <Badge>B2C</Badge>
                </div>
              </div>
              <Button
                variant="neutral-secondary"
                size="small"
                onClick={(event) => { }}
              >
                Show all
              </Button>
            </div>
          </div>
          <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-border" />
          <div className="flex w-full flex-col items-start gap-4">
            <div className="flex w-full items-center gap-2">
              <span className="grow shrink-0 basis-0 text-heading-3 font-heading-3 text-default-font">
                Lists
              </span>
              <Button
                variant="neutral-secondary"
                size="small"
                icon={<GalleryVerticalEnd />}
                onClick={(event) => { }}
              >
                Add to list
              </Button>
            </div>
            <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-4 py-4">
              <div className="flex w-full items-center gap-2">
                <div className="flex grow shrink-0 basis-0 items-center gap-2">
                  <IconWithBackground
                    variant="neutral"
                    icon={<CircleDollarSign />}
                  />
                  <span className="text-body-bold font-body-bold text-default-font">
                    Sales
                  </span>
                  <span className="text-caption font-caption text-subtext-color">
                    Created 3 days ago
                  </span>
                </div>
                <IconButton
                  size="small"
                  icon={<MoveHorizontal />}
                  onClick={(event) => { }}
                />
              </div>
              <div className="flex w-full flex-col items-start gap-3">
                <div className="flex w-full items-center gap-2">
                  <div className="flex grow shrink-0 basis-0 items-center gap-2">
                    <Kanban className="text-body font-body text-subtext-color" />
                    <span className="text-body font-body text-subtext-color">
                      Stage
                    </span>
                  </div>
                  <div className="flex grow shrink-0 basis-0 items-center gap-2">
                    <Badge variant="neutral">Meeting</Badge>
                  </div>
                </div>
                <div className="flex w-full items-center gap-2">
                  <div className="flex grow shrink-0 basis-0 items-center gap-2">
                    <Contact className="text-body font-body text-subtext-color" />
                    <span className="text-body font-body text-subtext-color">
                      Priority
                    </span>
                  </div>
                  <div className="flex grow shrink-0 basis-0 items-center gap-2">
                    <Badge variant="neutral">Medium</Badge>
                  </div>
                </div>
                <div className="flex w-full items-center gap-2">
                  <div className="flex grow shrink-0 basis-0 items-center gap-2">
                    <FeatherText className="text-body font-body text-subtext-color" />
                    <span className="text-body font-body text-subtext-color">
                      Owner
                    </span>
                  </div>
                  <div className="flex grow shrink-0 basis-0 items-center gap-1">
                    <Avatar
                      size="x-small"
                      image="https://res.cloudinary.com/subframe/image/upload/v1711417514/shared/ubsk7cs5hnnaj798efej.jpg"
                    >
                      A
                    </Avatar>
                    <span className="text-body font-body text-default-font">
                      Alex Smith
                    </span>
                  </div>
                </div>
                <Button
                  variant="neutral-secondary"
                  size="small"
                  onClick={(event) => { }}
                >
                  Show all
                </Button>
              </div>
            </div>
            <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-4 py-4">
              <div className="flex w-full items-center gap-2">
                <div className="flex grow shrink-0 basis-0 items-center gap-2">
                  <IconWithBackground
                    variant="neutral"
                    icon={<Calendar />}
                  />
                  <span className="text-body-bold font-body-bold text-default-font">
                    Meetings
                  </span>
                  <span className="text-caption font-caption text-subtext-color">
                    Updated today
                  </span>
                </div>
                <IconButton
                  size="small"
                  onClick={(event) => { }}
                />
              </div>
              <div className="flex w-full flex-col items-start gap-3">
                <div className="flex w-full items-center gap-2">
                  <div className="flex grow shrink-0 basis-0 items-center gap-2">
                    <FeatherUserCheck className="text-body font-body text-subtext-color" />
                    <span className="text-body font-body text-subtext-color">
                      With
                    </span>
                  </div>
                  <div className="flex grow shrink-0 basis-0 items-center gap-1">
                    <Avatar
                      size="x-small"
                      image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80"
                    >
                      J
                    </Avatar>
                    <span className="text-body font-body text-default-font">
                      Jennifer Lopez
                    </span>
                  </div>
                </div>
                <div className="flex w-full items-center gap-2">
                  <div className="flex grow shrink-0 basis-0 items-center gap-2">
                    <MapPin className="text-body font-body text-subtext-color" />
                    <span className="text-body font-body text-subtext-color">
                      Location
                    </span>
                  </div>
                  <div className="flex grow shrink-0 basis-0 items-center gap-2">
                    <Badge variant="neutral">Conference Room A</Badge>
                  </div>
                </div>
                <div className="flex w-full items-center gap-2">
                  <div className="flex grow shrink-0 basis-0 items-center gap-2">
                    <Clock className="text-body font-body text-subtext-color" />
                    <span className="text-body font-body text-subtext-color">
                      Duration
                    </span>
                  </div>
                  <div className="flex grow shrink-0 basis-0 items-center gap-2">
                    <Badge variant="neutral">45 minutes</Badge>
                  </div>
                </div>
                <Button
                  variant="neutral-secondary"
                  size="small"
                  onClick={(event) => { }}
                >
                  View details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </DefaultPageLayout>
  );
}

export default CompanyProfileDetail;