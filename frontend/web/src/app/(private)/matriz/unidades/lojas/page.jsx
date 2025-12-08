// Gestão de Vendas (Lojas): Controlar as operações de varejo.
// layout: Lista de lojas → resumo de vendas e estoque. PDV (para visão geral das operações).
// Funcionalidades: Relatório de vendas por loja. Controle de estoque de cada loja. Ajuste centralizado de preços (se necessário).
"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Sliders, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, DownloadIcon, FileTextIcon, FileSpreadsheetIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { usePerfilProtegido } from '@/hooks/usePerfilProtegido';
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function LojasPage() {
  usePerfilProtegido("GERENTE_MATRIZ");
  const { fetchWithAuth } = useAuth();

  const [units, setUnits] = useState([]);
  const [mapUnits, setMapUnits] = useState([]);
  const [query, setQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("nome_asc");
  const [totalResults, setTotalResults] = useState(0);

  const [statusFilters, setStatusFilters] = useState({ ATIVA: true, INATIVA: true });
  const [citySuggestions, setCitySuggestions] = useState([]);
  const citySuggestTimer = useRef(null);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function fetchLojas() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        const loc = String(locationFilter || "").trim();
        if (loc) params.set("cidade", loc);

        // status filter
        const allowedStatuses = Object.entries(statusFilters).filter(([, v]) => v).map(([k]) => k);
        if (allowedStatuses.length > 0) params.set("status", allowedStatuses.join(","));

        params.set("page", String(page));
        params.set("perPage", String(perPage));
        params.set("orderBy", orderBy);

        const url = `${API_URL}unidades/lojas?${params.toString()}`;
        const res = await fetchWithAuth(url, { method: "GET", credentials: "include" });
        if (!res.ok) {
          toast.error("Erro ao carregar lojas");
          setUnits([]);
          setTotalResults(0);
          return;
        }
        const body = await res.json().catch(() => null);
        const unidades = body?.unidades ?? body?.data ?? [];
        const total = body?.total ?? unidades.length ?? 0;
        if (Array.isArray(unidades)) {
          const normalized = unidades.map(normalizeUnit);
          if (mounted) {
            setUnits(normalized);
            setTotalResults(total);
          }
        }
      } catch (err) {
        console.error("[fetchLojas] erro", err);
        if (mounted) {
          setUnits([]);
          setTotalResults(0);
        }
        toast.error("Erro ao carregar lojas");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchLojas();
    return () => { mounted = false; };
  }, [fetchWithAuth, query, locationFilter, statusFilters, page, perPage, orderBy]);

  useEffect(() => {
    let mounted = true;
    async function fetchMapUnits() {
      try {
        const res = await fetchWithAuth(`${API_URL}unidades/lojas`, { method: "GET", credentials: "include" });
        if (!res.ok) return;
        const body = await res.json().catch(() => null);
        const unidades = body?.unidades ?? body ?? [];
        if (mounted && Array.isArray(unidades)) {
          setMapUnits(unidades.map(normalizeUnit));
        }
      } catch (err) {
        console.warn("[fetchMapUnits lojas] erro", err);
      }
    }
    fetchMapUnits();
    return () => { mounted = false; };
  }, [fetchWithAuth]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const locFilter = String(locationFilter ?? "").trim().toLowerCase();
    const statusAllowed = statusFilters;
    return units.filter(u => {
      const matchQ = q === "" || [u.name, u.location, u.manager, String(u.id)].some(f => String(f ?? "").toLowerCase().includes(q));
      const matchLoc = locFilter === "" || String(u.location ?? "").toLowerCase().includes(locFilter);
      const matchStatus = statusAllowed[String(u.status).toUpperCase()] ?? true;
      return matchQ && matchLoc && matchStatus;
    });
  }, [units, query, locationFilter, statusFilters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => {
    setPage(p => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const paged = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page, perPage]);

  function toggleStatusFilter(status) {
    setStatusFilters(prev => ({ ...prev, [status]: !prev[status] }));
    setPage(1);
  }

  function resetFilters() {
    setQuery("");
    setLocationFilter("");
    setStatusFilters({ ATIVA: true, INATIVA: true });
    setPage(1);
  }

  function normalizeUnit(u) {
    return {
      id: Number(u.id),
      name: u.nome ?? u.name ?? `Loja ${u.id}`,
      location: (u.cidade ? `${u.cidade}${u.estado ? ', ' + u.estado : ''}` : (u.location ?? "")),
      manager: u.gerente?.nome ?? u.manager ?? "—",
      status: (u.status || "ATIVA").toString().toUpperCase() === "ATIVA" ? "Ativa" : "Inativa",
      areaHa: u.areaProdutiva ? Number(u.areaProdutiva) : 0,
      latitude: u.latitude != null ? Number(u.latitude) : null,
      longitude: u.longitude != null ? Number(u.longitude) : null,
      sync: u.atualizadoEm ?? u.criadoEm ?? new Date().toISOString(),
    };
  }

  return (
    <div className="min-h-screen px-6 py-6 bg-surface-50">
      <div className="max-w-screen-2xl mx-auto w-full">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Unidades — Lojas</h1>
            <p className="text-sm text-muted-foreground">Visão dedicada para a Matriz: resumo e detalhes de lojas</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={resetFilters}>Limpar filtros</Button>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <Card>
            <CardHeader><CardTitle>Total de lojas</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{filtered.length}</div>
              <div className="text-sm text-muted-foreground mt-1">Total de unidades do tipo Loja</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Ativas</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{filtered.filter(u => u.status === "Ativa").length}</div>
              <div className="text-sm text-muted-foreground mt-1">Lojas com status Ativa</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Inativas</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{filtered.filter(u => u.status !== "Ativa").length}</div>
              <div className="text-sm text-muted-foreground mt-1">Lojas com status Inativa</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between pb-3 border-b dark:border-neutral-800 border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Input placeholder="Buscar unidades, cidade ou responsável" value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} />
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Sliders className="h-4 w-4" />Filtros avançados
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="bottom" align="start" className="w-[360px] p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">Filtros Avançados</div>
                      <div className="text-sm text-neutral-400">{filtered.length} resultados</div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Status</div>
                        <div className="flex gap-2">
                          {["ATIVA", "INATIVA"].map(s => (
                            <label key={s} className="flex items-center gap-2 px-2 py-1 rounded dark:hover:bg-neutral-900 hover:bg-neutral-100 cursor-pointer">
                              <Checkbox checked={!!statusFilters[s]} onCheckedChange={() => toggleStatusFilter(s)} />
                              <div className="text-sm">{s === "ATIVA" ? "Ativa" : "Inativa"}</div>
                            </label>
                          ))}
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Localização</div>
                        <div className="relative">
                          <Input
                            placeholder="Filtrar por cidade / estado"
                            value={locationFilter}
                            onChange={(e) => {
                              const v = e.target.value;
                              setLocationFilter(v);
                              setPage(1);
                              if (citySuggestTimer.current) clearTimeout(citySuggestTimer.current);
                              citySuggestTimer.current = setTimeout(() => {
                                setCitySuggestions([]);
                              }, 300);
                            }}
                          />
                          {citySuggestions.length > 0 && (
                            <div className="absolute z-40 mt-1 w-full bg-card border rounded shadow max-h-48 overflow-auto">
                              {citySuggestions.map((s, idx) => (
                                <div key={idx} className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer" onClick={() => { setLocationFilter(`${s.cidade}${s.estado ? ', ' + s.estado : ''}`); setCitySuggestions([]); }}>
                                  <div className="text-sm">{s.cidade}{s.estado ? `, ${s.estado}` : ''}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline' size='sm'>
                      <DownloadIcon className='mr-2 h-4 w-4' />
                      Exportar
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem onClick={() => handleExportCSV(filtered)}>
                      <FileTextIcon className='mr-2 h-4 w-4' />
                      Exportar CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileSpreadsheetIcon className='mr-2 h-4 w-4' />
                      Exportar PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {paged.map(u => (
                    <Link key={u.id} href={`/matriz/unidades/lojas/${u.id}`}>
                      <div className="bg-card border dark:border-neutral-800 border-neutral-200 rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Avatar><AvatarFallback>L</AvatarFallback></Avatar>
                            <div>
                              <div className="font-medium text-lg">{u.name}</div>
                              <div className="text-sm text-muted-foreground">{u.location}</div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded ${u.status === 'Ativa' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                              {u.status}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 text-sm text-muted-foreground">Última atualização: {new Date(u.sync).toLocaleString()}</div>
                      </div>
                    </Link>
                  ))}
                </div>

                {filtered.length === 0 && (
                  <div className="py-8 text-center text-muted-foreground">Nenhuma loja encontrada.</div>
                )}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex items-center justify-between px-4 py-3 border-t dark:border-neutral-800 border-neutral-200">
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium">Linhas por pág.</Label>
              <Select value={String(perPage)} onValueChange={(val) => { const v = Number(val); setPerPage(v); setPage(1); }}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm">Pág. {page} de {Math.max(1, Math.ceil(filtered.length / perPage) || 1)}</div>

              <div className="inline-flex items-center gap-1 border-l dark:border-neutral-800 border-neutral-200 pl-3">
                <Button variant="ghost" size="sm" onClick={() => setPage(1)} disabled={page === 1} aria-label="Primeira página" >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} aria-label="Página anterior" >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Próxima página">
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="sm" onClick={() => setPage(totalPages)} disabled={page === totalPages} aria-label="Última página">
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-6">
          <Card>
            <CardHeader><CardTitle>Mapa</CardTitle></CardHeader>
            <CardContent>
              <div className="h-56 bg-muted rounded-md flex items-center justify-center">
                <div className="text-sm text-muted-foreground">Mapa com pins das lojas (dados carregados, não filtrados)</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function handleExportCSV(units) {
  const headers = ["id", "name", "location", "manager", "status", "sync"];
  const rows = units.map(u => headers.map(h => JSON.stringify(u[h] ?? "")).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `lojas_export_${new Date().toISOString()}.csv`; a.click(); URL.revokeObjectURL(url);
}
