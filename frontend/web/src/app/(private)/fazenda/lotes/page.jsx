"use client"

import React, { useEffect, useMemo, useState, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext";
import { usePerfilProtegido } from '@/hooks/usePerfilProtegido';
import { API_URL } from "@/lib/api"
import AddLoteModal from "./AddLoteModal"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Download, Plus, Sliders, FileText, FileSpreadsheet, ChevronLeft, ChevronRight, Tractor, Search } from "lucide-react"
// aliases used in the existing markup
const DownloadIcon = Download
const FileTextIcon = FileText
const FileSpreadsheetIcon = FileSpreadsheet

const perPageOptions = [10, 20, 50]

export default function LotesPage() {
  const { user, fetchWithAuth } = useAuth()
  usePerfilProtegido("GERENTE_FAZENDA");

  const unidadeId = user?.unidadeId || user?.unidade?.id

  const [loading, setLoading] = useState(false)
  const [lotes, setLotes] = useState([])
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  // draft states and helpers referenced by the existing layout
  const [draftStatusFilters, setDraftStatusFilters] = useState({})
  const [draftTypeFilters, setDraftTypeFilters] = useState({})
  const [draftLocationFilter, setDraftLocationFilter] = useState("")
  const [draftResponsibleQuery, setDraftResponsibleQuery] = useState("")
  const [draftAreaQuery, setDraftAreaQuery] = useState("")

  const citySuggestTimer = useRef(null)
  const [citySuggestions, setCitySuggestions] = useState([])

  const [appliedFilters, setAppliedFilters] = useState({})
  const [orderBy, setOrderBy] = useState('mais_recente')

  const [openAddLote, setOpenAddLote] = useState(false)

  // map the `units` variable used by the layout to our lotes list
  const units = lotes || []
  const totalResults = units.length

  const prefetchFazenda = (id) => { /* prefetch placeholder */ }

  const resetFilters = () => {
    setDraftStatusFilters({})
    setDraftTypeFilters({})
    setDraftLocationFilter("")
    setDraftResponsibleQuery("")
    setDraftAreaQuery("")
    setAppliedFilters({})
    setCitySuggestions([])
  }

  const handleLoteCreated = (newLote) => {
    // Recarregar lista de lotes após criação
    setOpenAddLote(false)
    // Forçar recarga dos lotes
    window.location.reload()
  }

  const handleExportCSV = (items) => {
    console.debug('export csv', items?.length ?? 0)
  }

  useEffect(() => {
    if (!fetchWithAuth) return
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const res = await fetchWithAuth(`${API_URL}lotes`)
        const json = await res.json().catch(() => ({}))

        // Extract array from multiple possible response shapes:
        // - API might return the array directly
        // - or { lotes: [...] }
        // - or { lotes: { sucesso: true, lotes: [...] } }
        // - or { data: [...] }
        let arr = []
        if (Array.isArray(json)) {
          arr = json
        } else if (Array.isArray(json.lotes)) {
          arr = json.lotes
        } else if (json.lotes && Array.isArray(json.lotes.lotes)) {
          arr = json.lotes.lotes
        } else if (Array.isArray(json.data)) {
          arr = json.data
        } else {
          arr = []
        }

        // filter by unidade on client if unidadeId is available
        const filteredByUnidade = unidadeId ? arr.filter((l) => Number(l.unidadeId) === Number(unidadeId)) : arr

        if (mounted) setLotes(filteredByUnidade)
      } catch (err) {
        console.error("Error fetching lotes", err)
        if (mounted) setLotes([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [fetchWithAuth, unidadeId])

  const filtered = useMemo(() => {
    const q = String(query || "").trim().toLowerCase()
    if (!q) return lotes
    return lotes.filter((l) => {
      return (
        String(l.nome || "").toLowerCase().includes(q) ||
        String(l.tipo || "").toLowerCase().includes(q) ||
        String(l.id || "").includes(q) ||
        String(l.responsavel || "").toLowerCase().includes(q)
      )
    })
  }, [lotes, query])

  const total = filtered.length
  const paginated = useMemo(() => {
    const start = (page - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, page, perPage])

  return (
    <div className="space-y-6">
      <Card className={"mb-8"}>
        <CardHeader>
          <CardTitle className={"mb-4"}>Lista de Lotes</CardTitle>
          <div className="flex items-center justify-between pb-3 border-b dark:border-neutral-800 border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Input placeholder="Buscar lotes" value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} />
              </div>

              {/* FILTROS AVANÇADOS: usa Popover para menu parecido com dropdown */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
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

                    {/* STATUS */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Status</div>
                      <div className="flex gap-2">
                        {["Ativa", "Inativa"].map(s => (
                          <label key={s} className="flex items-center gap-2 px-2 py-1 rounded dark:hover:bg-neutral-900 hover:bg-neutral-100 cursor-pointer">
                            <Checkbox
                              checked={!!draftStatusFilters[s]}
                              onCheckedChange={() => {
                                setDraftStatusFilters(prev => ({ ...prev, [s]: !prev[s] }));
                              }}
                            />
                            <div className="text-sm">{s}</div>
                          </label>
                        ))}
                      </div>
                    </div>
                    <Separator />

                    {/* LOCALIZAÇÃO */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Localização</div>
                      <div className="relative">
                        <Input placeholder="Filtrar por cidade / estado" value={draftLocationFilter} onChange={(e) => {
                          const v = e.target.value;
                          setDraftLocationFilter(v);
                          setPage(1);
                          // debounce suggestions
                          if (citySuggestTimer.current) clearTimeout(citySuggestTimer.current);
                          citySuggestTimer.current = setTimeout(async () => {
                            try {
                              const q = v.trim();
                              if (!q || q.length < 2) { setCitySuggestions([]); return; }
                              const url = `${API_URL}unidades/cidades?query=${encodeURIComponent(q)}&limit=10`;
                              const res = await fetchWithAuth(url);
                              if (!res.ok) { setCitySuggestions([]); return; }
                              const body = await res.json().catch(() => null);
                              setCitySuggestions(body?.suggestions ?? []);
                            } catch (err) { console.error('sugestões erro', err); setCitySuggestions([]); }
                          }, 300);
                        }} />
                        {citySuggestions.length > 0 && (
                          <div className="absolute z-40 mt-1 w-full bg-card border rounded shadow max-h-48 overflow-auto">
                            {citySuggestions.map((s, idx) => (
                              <div key={idx} className="px-3 py-2 hover:bg-neutral-100 cursor-pointer" onClick={() => { setDraftLocationFilter(`${s.cidade}${s.estado ? ', ' + s.estado : ''}`); setCitySuggestions([]); }}>
                                <div className="text-sm">{s.cidade}{s.estado ? `, ${s.estado}` : ''}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <Separator />
                    {/* RESPONSAVEL - ainda nn funciona */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Responsável</div>
                      <Input
                        placeholder="Filtrar por responsável"
                        value={draftResponsibleQuery}
                        onChange={(e) => { setDraftResponsibleQuery(e.target.value); }}
                      />
                    </div>

                    <Separator />
                    {/* Area */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Área</div>
                      <Input
                        placeholder="Filtrar por área (ha)"
                        value={draftAreaQuery}
                        onChange={(e) => {
                          // aceita apenas números (garantia do usuário)
                          const digits = String(e.target.value || '').replace(/\D/g, '');
                          setDraftAreaQuery(digits);
                        }}
                      />

                    </div>

                    {/* APLICAR / RESET */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => {
                          // parse draftLocationFilter which may contain "Cidade, ESTADO"
                          const parts = String(draftLocationFilter || '').split(',').map(s => s.trim()).filter(Boolean);
                          const cidade = parts[0] || '';
                          const estado = parts[1] || '';

                          setAppliedFilters({
                            typeFilters: draftTypeFilters,
                            statusFilters: draftStatusFilters,
                            locationFilter: cidade,
                            locationEstado: estado,
                            responsibleQuery: draftResponsibleQuery,
                            areaQuery: draftAreaQuery
                          });
                          setPage(1);
                        }}
                        >
                          Aplicar
                        </Button>

                        <Button size="sm" variant="ghost" onClick={() => {
                          resetFilters();
                          setDraftAreaQuery('');
                          setDraftLocationFilter('');
                          setDraftResponsibleQuery('');
                          setCitySuggestions([]);
                        }}>Limpar</Button>
                      </div>
                    </div>

                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <span className="text-sm">Ordenar Por</span>
                    <div className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded dark:bg-neutral-800 bg-neutral-200 dark:text-neutral-300 text-neutral-700 text-xs">
                      {orderBy === 'nome_asc' ? 'AZ' : orderBy === 'nome_desc' ? 'ZA' : orderBy === 'mais_recente' ? 'REC' : 'ANT'}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start'>
                  <DropdownMenuItem onClick={() => { setOrderBy('nome_asc'); setPage(1); }}>
                    A - Z (Nome)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setOrderBy('nome_desc'); setPage(1); }}>
                    Z - A (Nome)
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { setOrderBy('mais_recente'); setPage(1); }}>
                    Mais Recente
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setOrderBy('mais_antigo'); setPage(1); }}>
                    Mais Antigo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center gap-2 ml-3">
                    <Button variant='outline' size='sm'>
                      <Search className='mr-2 h-4 w-4' />
                      Consultar lote
                    </Button>
                 
              </div>

              <Button
                variant=""
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setOpenAddLote(true)}
              >
                <span className="flex flex-row gap-3 items-center text-sm"><Plus />Novo lote</span>
              </Button>

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
              {/* Grid of cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {units.map(u => {
                  // u is a Lote object; map visual fields without changing layout
                  const loteName = u.nome || u.name || `Lote ${u.id}`
                  const unidade = u.unidade || null
                  const location = unidade ? (unidade.cidade ? `${unidade.cidade}${unidade.estado ? ', ' + unidade.estado : ''}` : (unidade.nome || unidade.name || '')) : ''
                  const areaDisplay = (u.qntdItens != null)
                    ? `${u.qntdItens} itens`
                    : (Array.isArray(u.itensEsperados) ? `${u.itensEsperados.length} itens` : '—')
                  const syncDate = u.dataEnvioReferencia ? new Date(u.dataEnvioReferencia).toLocaleString() : (u.atualizadoEm ? new Date(u.atualizadoEm).toLocaleString() : '—')

                  return (
                    <div key={u.id} className="bg-card border dark:border-neutral-800 border-neutral-200 rounded-lg p-4 shadow-sm hover:shadow-md transition ">
                      <div className="flex flex-col items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-bold text-lg">{loteName}</div>
                            <div className="text-sm text-muted-foreground">{location}</div>
                          </div>
                        </div>
                        <div className="flex flex-row gap-3 ">
                          <div className="text-base font-medium">Quantidade de itens: </div><div className="text-base font-normal">{areaDisplay}</div>
                        </div>
                      </div>
                      {/* <div className="mt-3 text-sm text-muted-foreground">Última sync: {syncDate}</div> */}
                      <div className="border-t pt-2 mt-1">
                        <Link href={`/fazenda/lotes/${u.id}`}>
                          <Button variant="ghost" size="sm" className={"cursor-pointer"}>Acompanhar produção</Button>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Empty state */}
              {units.length === 0 && !loading && (
                <div className="py-8 flex flex-col items-center gap-4 text-center text-muted-foreground">
                  <Tractor size={50} />
                  <p className="font-medium">Nenhum lote encontrado.</p>
                </div>
              )}

              {/* Pagination controls */}
              {units.length > 0 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Página <span className="font-semibold">{page}</span> de{' '}
                    <span className="font-semibold">{Math.ceil(totalResults / perPage) || 1}</span>
                    {' '} ({totalResults} resultado{totalResults !== 1 ? 's' : ''})
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(5, Math.ceil(totalResults / perPage)))].map((_, i) => {
                        const totalPages = Math.ceil(totalResults / perPage);
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(Math.ceil(totalResults / perPage), p + 1))}
                      disabled={page >= Math.ceil(totalResults / perPage)}
                    >
                      Próximo
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Por página:</span>
                    <select
                      value={perPage}
                      onChange={(e) => {
                        setPerPage(Number(e.target.value));
                        setPage(1);
                      }}
                      className="px-2 py-1 border rounded text-sm dark:bg-neutral-900 dark:border-neutral-700"
                    >
                      <option value="8">8</option>
                      <option value="16">16</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AddLoteModal
        open={openAddLote}
        onOpenChange={setOpenAddLote}
        onCreated={handleLoteCreated}
        unidadeId={unidadeId}
      />
    </div>
  )
}
