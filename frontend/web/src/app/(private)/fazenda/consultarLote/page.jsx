"use client"
import { useEffect, useState, useMemo } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { API_URL } from "@/lib/api"
import { usePerfilProtegido } from '@/hooks/usePerfilProtegido'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { Search, SearchX, ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight } from 'lucide-react'

export default function ConsultarLote() {
    const { fetchWithAuth, user } = useAuth()
    usePerfilProtegido("GERENTE_FAZENDA")

    const [lotes, setLotes] = useState([])
    const [loadingLotes, setLoadingLotes] = useState(false)
    const [loteIdInput, setLoteIdInput] = useState("")
    const [selectedLoteId, setSelectedLoteId] = useState("__placeholder")

    const [loadingConsult, setLoadingConsult] = useState(false)
    const [atividades, setAtividades] = useState([])
    const [loteInfo, setLoteInfo] = useState(null)
    const [error, setError] = useState(null)

    const base = String(API_URL || '/api').replace(/\/$/, '')

    // helper: encontra primeiro array em objeto (profundidade limitada)
    const findFirstArray = (obj, depth = 3, seen = new WeakSet()) => {
        if (!obj || depth < 0) return null
        if (Array.isArray(obj)) return obj
        if (typeof obj !== 'object') return null
        if (seen.has(obj)) return null
        seen.add(obj)

        if (obj.lotesAnimalia && Array.isArray(obj.lotesAnimalia)) return obj.lotesAnimalia
        if (obj.loteVegetais && Array.isArray(obj.loteVegetais)) return obj.loteVegetais
        if (obj.lote && Array.isArray(obj.lote)) return obj.lote

        for (const k of Object.keys(obj)) {
            try {
                const v = obj[k]
                const res = findFirstArray(v, depth - 1, seen)
                if (Array.isArray(res)) return res
            } catch (e) { }
        }
        return null
    }

    // helper: converte texto para Title Case (cada palavra com inicial maiúscula), respeitando acentuação PT-BR
    const titleCase = (value) => {
        if (value == null) return ''
        const s = String(value).trim()
        if (!s) return ''
        return s
            .toLocaleLowerCase('pt-BR')
            .split(/\s+/)
            .map(w => w ? (w.charAt(0).toLocaleUpperCase('pt-BR') + w.slice(1)) : '')
            .join(' ')
    }

    useEffect(() => {
        const loadLotes = async () => {
            setLoadingLotes(true)
            try {
                const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null
                if (!unidadeId) {
                    setLotes([])
                    return
                }

                const fetchFn = fetchWithAuth || fetch

                // buscar plantio
                const urls = [
                    `${base}/lotesPlantio/${unidadeId}`,
                    `${base}/loteAnimalia/${unidadeId}`,
                ]

                const results = await Promise.all(urls.map(u => fetchFn(u).then(r => r.json().catch(() => ({}))).catch(() => ({}))))

                let combined = []
                for (const r of results) {
                    const arr = findFirstArray(r) || []
                    combined = combined.concat(arr)
                }

                // dedupe by id
                const map = new Map()
                for (const l of combined) {
                    if (l && l.id != null) map.set(Number(l.id), l)
                }
                const final = Array.from(map.values()).sort((a, b) => (a.id - b.id))
                setLotes(final)
            } catch (err) {
                console.error('Erro carregando lotes:', err)
                setLotes([])
            } finally {
                setLoadingLotes(false)
            }
        }

        loadLotes()
    }, [fetchWithAuth, user])

    const onSelectChange = (v) => {
        if (v === "__placeholder") {
            setSelectedLoteId("__placeholder")
            setLoteIdInput("")
        } else {
            setSelectedLoteId(v)
            setLoteIdInput(v)
        }
    }

    const consultarLote = async () => {
        setError(null)
        setAtividades([])
        setLoteInfo(null)
        const id = loteIdInput?.trim() || (selectedLoteId === "__placeholder" ? "" : selectedLoteId)
        if (!id) {
            setError('Informe um ID de lote ou selecione um lote')
            return
        }

        setLoadingConsult(true)
        try {
            const fetchFn = fetchWithAuth || fetch

            // Buscar informações do lote (tenta múltiplas rotas até encontrar uma resposta válida)
            const tryUrls = [
                `${base}/verLote/${id}`,
                `${base}/lotes/${id}`,
                `${API_URL}lotes/${id}`,
                `/verLote/${id}`,
                `/lotes/${id}`,
            ];

            let loteData = null;
            let loteRes = null;
            for (const u of tryUrls) {
                try {
                    console.log('[ConsultarLote] Tentando URL:', u)
                    loteRes = await fetchFn(u)
                } catch (err) {
                    console.warn('[ConsultarLote] Erro ao chamar', u, err)
                    loteRes = null
                }
                if (loteRes && loteRes.ok) {
                    loteData = await loteRes.json().catch(() => ({}))
                    console.log('[ConsultarLote] Dados do lote (brutos) de', u, loteData)
                    break
                } else if (loteRes) {
                    // log status for debugging
                    console.log('[ConsultarLote] resposta não OK de', u, loteRes.status)
                }
            }

            // Extrair dados do lote (pode estar aninhado)
            let loteFound = null
            if (loteData && typeof loteData === 'object') {
                if (loteData.lote) {
                    loteFound = loteData.lote
                } else if (loteData.lotes && Array.isArray(loteData.lotes) && loteData.lotes.length > 0) {
                    // alguns endpoints retornam { lotes: [...] }
                    loteFound = loteData.lotes[0]
                } else if (!Array.isArray(loteData)) {
                    loteFound = loteData
                }
            }

            // Alguns controllers/modelos retornam wrapper adicional: { sucesso: true, lote: {...}, message }
            if (loteFound && typeof loteFound === 'object' && loteFound.sucesso && loteFound.lote) {
                loteFound = loteFound.lote
            }

            console.log('[ConsultarLote] Lote encontrado (após tentativas/unwrap):', loteFound)
            setLoteInfo(loteFound)

            // Buscar atividades do lote
            const url = `${base}/atividadesLote/${id}`
            const res = await fetchFn(url)
            const data = await res.json().catch(() => ({}))

            // extrair arrays possíveis
            let found = []
            if (Array.isArray(data)) found = data
            else if (Array.isArray(data.atividades)) found = data.atividades
            else if (Array.isArray(data.atividadesPlantio)) found = data.atividadesPlantio
            else if (Array.isArray(data.atividadesAnimalia)) found = data.atividadesAnimalia
            else {
                // procurar qualquer array recursivamente
                const arr = findFirstArray(data)
                if (Array.isArray(arr)) found = arr
            }

            setAtividades(found || [])
            if (!found || found.length === 0) {
                // Não mostrar as informações do lote se não houver atividades
                setLoteInfo(null)
                setError('Nenhuma atividade encontrada para este lote.')
            }
        } catch (err) {
            console.error('Erro consultando lote:', err)
            setError('Erro ao consultar lote')
        } finally {
            setLoadingConsult(false)
        }
    }

    // paginacao
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    // pagination helpers for atividades
    const filteredItems = atividades || [];
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / perPage));

    // keep current page valid when totalPages changes
    useEffect(() => {
        setPage(p => Math.min(Math.max(1, p), totalPages));
    }, [totalPages]);

    // reset to first page when atividades or perPage change
    useEffect(() => {
        setPage(1);
    }, [atividades, perPage]);

    const paginatedItems = useMemo(() => {
        const start = (page - 1) * perPage;
        return filteredItems.slice(start, start + perPage);
    }, [filteredItems, page, perPage]);


    return (
        <div className="min-h-screen px-18 py-10 bg-surface-50">

            <div className="flex gap-8">
                <Card className="w-full p-0 border-none">
                    <CardHeader className="p-0">
                        <CardTitle>Consultar atividades por lote</CardTitle>
                        <CardDescription>Digite o ID de um lote <strong>ou</strong> selecione um dos lotes da sua unidade. Em seguida clique na lupa de consulta para ver as informações e atividades relacionadas.</CardDescription>
                    </CardHeader>

                    <CardContent className="p-0 flex flex-col gap-10">
                        {/* <p className="text-sm text-neutral-600 mb-4"></p> */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label className="font-medium">Digite o ID do lote</Label>
                                <Input value={loteIdInput} onChange={(e) => setLoteIdInput(e.target.value)} placeholder="ex: 123" />
                                <p className="text-xs text-neutral-500">Você pode inserir o ID manualmente</p>
                            </div>

                            <div className="space-y-2">
                                <Label className="font-medium">Ou selecione um lote da unidade</Label>
                                {loadingLotes ? (
                                    <div className="text-sm flex items-center">Carregando lotes...</div>
                                ) : (
                                    <div className="flex flex-row gap-6">
                                        <Select value={selectedLoteId} onValueChange={onSelectChange}>
                                            <SelectTrigger className="h-11 w-full">
                                                <SelectValue placeholder="Selecione um lote" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="__placeholder">Selecione um lote</SelectItem>
                                                {lotes.map(l => (
                                                    <SelectItem key={l.id} value={String(l.id)}>{l.nome ? `ID ${l.id}: ${l.nome}  ` : `Lote ${l.id}`}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <div className="gap-2 flex flex-col">
                                            {/* <Label className="font-medium">Consultar</Label> */}
                                            <Button size="sm" variant="default" onClick={consultarLote} disabled={loadingConsult}><Search /></Button>
                                        </div>
                                    </div>
                                )}
                                <p className="text-xs text-neutral-500">Você pode selecionar algum lote</p>
                            </div>

                        </div>

                        <div>
                            {error && (<div className="text-red-600 mb-3">{error}</div>)}

                            {atividades.length > 0 && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Painel de informações do lote */}
                                    {loteInfo && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Informações do Lote</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                {loteInfo.id && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-neutral-500 uppercase">ID</p>
                                                        <p className="text-sm text-neutral-800 dark:text-neutral-200">{loteInfo.id}</p>
                                                    </div>
                                                )}
                                                {loteInfo.nome && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-neutral-500 uppercase">Nome</p>
                                                        <p className="text-sm text-neutral-800 dark:text-neutral-200">{titleCase(loteInfo.nome)}</p>
                                                    </div>
                                                )}
                                                {loteInfo.tipoProduto && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-neutral-500 uppercase">Tipo de Produto</p>
                                                        <p className="text-sm text-neutral-800 dark:text-neutral-200">{titleCase(loteInfo.tipoProduto)}</p>
                                                    </div>
                                                )}
                                                {loteInfo.tipo && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-neutral-500 uppercase">Tipo</p>
                                                        <p className="text-sm text-neutral-800 dark:text-neutral-200">{titleCase(loteInfo.tipo)}</p>
                                                    </div>
                                                )}
                                                {loteInfo.status && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-neutral-500 uppercase">Status</p>
                                                        <p className="text-sm text-neutral-800 dark:text-neutral-200">{titleCase(loteInfo.status)}</p>
                                                    </div>
                                                )}
                                                {loteInfo.quantidade != null && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-neutral-500 uppercase">Quantidade</p>
                                                        <p className="text-sm text-neutral-800 dark:text-neutral-200">{loteInfo.quantidade} {loteInfo.unidadeMedida ? titleCase(loteInfo.unidadeMedida) : ''}</p>
                                                    </div>
                                                )}
                                                {loteInfo.preco != null && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-neutral-500 uppercase">Preço</p>
                                                        <p className="text-sm text-neutral-800 dark:text-neutral-200">R$ {Number(loteInfo.preco).toFixed(2)}</p>
                                                    </div>
                                                )}
                                                {loteInfo.criadoEm && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-neutral-500 uppercase">Data de Criação</p>
                                                        <p className="text-sm text-neutral-800 dark:text-neutral-200">{new Date(loteInfo.criadoEm).toLocaleString('pt-BR')}</p>
                                                    </div>
                                                )}
                                                {loteInfo.atualizadoEm && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-neutral-500 uppercase">Última Atualização</p>
                                                        <p className="text-sm text-neutral-800 dark:text-neutral-200">{new Date(loteInfo.atualizadoEm).toLocaleString('pt-BR')}</p>
                                                    </div>
                                                )}
                                                {loteInfo.observacoes && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-neutral-500 uppercase">Observações</p>
                                                        <p className="text-sm text-neutral-800 dark:text-neutral-200">{titleCase(loteInfo.observacoes)}</p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Tabela de atividades */}
                                    {atividades.length > 0 && (
                                        <Card className={loteInfo ? 'lg:col-span-2' : 'lg:col-span-3' + "h-fit"}>
                                            <CardHeader>
                                                <CardTitle>Atividades Realizadas</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            {/* <TableHead>ID</TableHead> */}
                                                            <TableHead>Tipo</TableHead>
                                                            <TableHead>Descrição</TableHead>
                                                            <TableHead>Data de Início</TableHead>
                                                            <TableHead>Responsável</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {paginatedItems.map((a, idx) => (
                                                            <TableRow key={a.id || idx}>
                                                                {/* <TableCell className="max-w-xs"><div className="font-medium">{a.id}</div></TableCell> */}
                                                                <TableCell className="max-w-xs"><div className="font-medium">{titleCase(a.tipo || a.tipoAtvd || a.tipo_atividade || '')}</div></TableCell>
                                                                <TableCell className="max-w-xs"><div className="font-medium">{titleCase(a.descricao)}</div></TableCell>
                                                                <TableCell className="max-w-xs"><div className="font-medium">{a.dataInicio ? new Date(a.dataInicio).toLocaleString() : ''}</div></TableCell>
                                                                <TableCell className="max-w-xs"><div className="font-medium">{titleCase(a.responsavel?.nome || a.responsavel?.nomeCompleto || a.responsavelNome || (a.responsavelId ? String(a.responsavelId) : ''))}</div></TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>

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

                                                        <div className="text-sm">Pág. {page} de {totalPages}</div>

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
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            )}

                            {!loteInfo && atividades.length === 0 && !loadingConsult && (
                                <div className="flex flex-col gap-2 items-center justify-center">
                                    <SearchX className="text-neutral-500" />
                                    <p className="text-neutral-500">Nenhuma informação para exibir.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
