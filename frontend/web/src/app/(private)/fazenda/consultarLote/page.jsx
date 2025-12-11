"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { API_URL } from "@/lib/api"
import { usePerfilProtegido } from '@/hooks/usePerfilProtegido'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function Page() {
    const { fetchWithAuth, user } = useAuth()
    usePerfilProtegido("GERENTE_FAZENDA")

    const [lotes, setLotes] = useState([])
    const [loadingLotes, setLoadingLotes] = useState(false)
    const [loteIdInput, setLoteIdInput] = useState("")
    const [selectedLoteId, setSelectedLoteId] = useState("")

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

    const onSelectChange = (e) => {
        setSelectedLoteId(e.target.value)
        setLoteIdInput(e.target.value)
    }

    const consultarLote = async () => {
        setError(null)
        setAtividades([])
        setLoteInfo(null)
        const id = loteIdInput?.trim() || selectedLoteId
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
                setError('Nenhuma atividade encontrada para este lote.')
            }
        } catch (err) {
            console.error('Erro consultando lote:', err)
            setError('Erro ao consultar lote')
        } finally {
            setLoadingConsult(false)
        }
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Consultar atividades por lote</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    <p className="text-sm text-neutral-600">Digite o ID de um lote ou selecione um dos lotes da sua unidade. Em seguida clique em <strong>Consultar Lote</strong> para ver as atividades relacionadas.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label className="font-medium">Digite o ID do lote</Label>
                            <Input value={loteIdInput} onChange={(e) => setLoteIdInput(e.target.value)} placeholder="ex: 123" className="h-11" />
                            <p className="text-xs text-neutral-500">Você pode inserir o ID manualmente ou selecionar abaixo.</p>
                        </div>

                        <div className="space-y-2">
                            <Label className="font-medium">Ou selecione um lote da unidade</Label>
                            {loadingLotes ? (
                                <div className="h-11 flex items-center">Carregando lotes...</div>
                            ) : (
                                <select className="w-full border rounded p-2 h-11 bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100" value={selectedLoteId} onChange={onSelectChange}>
                                    <option value="">-- selecione um lote --</option>
                                    {lotes.map(l => (
                                        <option key={l.id} value={l.id}>{l.nome ? `${l.id} ${l.nome}  ` : `Lote ${l.id}`}</option>
                                    ))}
                                </select>
                            )}
                            <p className="text-xs text-neutral-500">Listando lotes de plantio e animalia da unidade.</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex ">
                                <div className="w-full gap-2 flex flex-col">
                                    <Label className="font-medium">Consultar</Label>
                                    <Button className="w-full h-11 bg-neutral-900 text-neutral-100 dark:bg-neutral-900 dark:text-neutral-100" onClick={consultarLote} disabled={loadingConsult}>{loadingConsult ? 'Consultando...' : 'Consultar Lote'}</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-2">
                        {error && (<div className="text-red-600 mb-3">{error}</div>)}

                        {(loteInfo || atividades.length > 0) && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Painel de informações do lote */}
                                {loteInfo && (
                                    <div className="lg:col-span-1 bg-neutral-50 dark:bg-neutral-950 rounded border border-neutral-200 dark:border-neutral-700 p-4">
                                        <h3 className="font-bold text-lg mb-4 text-neutral-900 dark:text-neutral-100">Informações do Lote</h3>
                                        <div className="space-y-3">
                                            {loteInfo.id && (
                                                <div>
                                                    <p className="text-xs font-semibold text-neutral-500 uppercase">ID</p>
                                                    <p className="text-sm text-neutral-800 dark:text-neutral-200">{loteInfo.id}</p>
                                                </div>
                                            )}
                                            {loteInfo.nome && (
                                                <div>
                                                    <p className="text-xs font-semibold text-neutral-500 uppercase">Nome</p>
                                                    <p className="text-sm text-neutral-800 dark:text-neutral-200">{loteInfo.nome}</p>
                                                </div>
                                            )}
                                            {loteInfo.tipoProduto && (
                                                <div>
                                                    <p className="text-xs font-semibold text-neutral-500 uppercase">Tipo de Produto</p>
                                                    <p className="text-sm text-neutral-800 dark:text-neutral-200">{loteInfo.tipoProduto}</p>
                                                </div>
                                            )}
                                            {loteInfo.tipo && (
                                                <div>
                                                    <p className="text-xs font-semibold text-neutral-500 uppercase">Tipo</p>
                                                    <p className="text-sm text-neutral-800 dark:text-neutral-200">{loteInfo.tipo}</p>
                                                </div>
                                            )}
                                            {loteInfo.status && (
                                                <div>
                                                    <p className="text-xs font-semibold text-neutral-500 uppercase">Status</p>
                                                    <p className="text-sm text-neutral-800 dark:text-neutral-200 capitalize">{loteInfo.status}</p>
                                                </div>
                                            )}
                                            {loteInfo.quantidade != null && (
                                                <div>
                                                    <p className="text-xs font-semibold text-neutral-500 uppercase">Quantidade</p>
                                                    <p className="text-sm text-neutral-800 dark:text-neutral-200">{loteInfo.quantidade} {loteInfo.unidadeMedida || ''}</p>
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
                                                    <p className="text-sm text-neutral-800 dark:text-neutral-200">{loteInfo.observacoes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Tabela de atividades */}
                                {atividades.length > 0 && (
                                    <div className={loteInfo ? 'lg:col-span-2' : 'lg:col-span-3'}>
                                        <h3 className="font-bold text-lg mb-4 text-neutral-900 dark:text-neutral-100">Atividades Realizadas</h3>
                                        <div className="overflow-x-auto border rounded">
                                            <table className="min-w-full divide-y divide-neutral-200">
                                                <thead className="bg-neutral-50">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300 dark:bg-neutral-800">ID</th>
                                                        <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300 dark:bg-neutral-800">Tipo</th>
                                                        <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300 dark:bg-neutral-800">Descrição</th>
                                                        <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300 dark:bg-neutral-800">Data Início</th>
                                                        <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300 dark:bg-neutral-800">Responsável</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-neutral-100">
                                                    {atividades.map((a, idx) => (
                                                        <tr key={a.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                                                            <td className="px-4 py-3 text-sm text-neutral-800 dark:text-neutral-300 dark:bg-neutral-950">{a.id}</td>
                                                            <td className="px-4 py-3 text-sm text-neutral-800 dark:text-neutral-300 dark:bg-neutral-950">{a.tipo || a.tipoAtvd || a.tipo_atividade || ''}</td>
                                                            <td className="px-4 py-3 text-sm text-neutral-800 dark:text-neutral-300 dark:bg-neutral-950">{a.descricao}</td>
                                                            <td className="px-4 py-3 text-sm text-neutral-800 dark:text-neutral-300 dark:bg-neutral-950">{a.dataInicio ? new Date(a.dataInicio).toLocaleString() : ''}</td>
                                                            <td className="px-4 py-3 text-sm text-neutral-800 dark:text-neutral-300 dark:bg-neutral-950">{a.responsavel?.nome || a.responsavel?.nomeCompleto || a.responsavelNome || (a.responsavelId ? String(a.responsavelId) : '')}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {!loteInfo && atividades.length === 0 && !loadingConsult && (
                            <p className="text-neutral-500">Nenhuma informação para exibir.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
