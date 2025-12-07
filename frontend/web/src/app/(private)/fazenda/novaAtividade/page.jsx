"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TruckIcon, DocumentTextIcon, BanknotesIcon, CubeIcon } from "@heroicons/react/24/outline"
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";
import { usePerfilProtegido } from '@/hooks/usePerfilProtegido';

export default function Page() {
    const { fetchWithAuth, user } = useAuth();
    usePerfilProtegido("GERENTE_FAZENDA");

    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [atividadeSelecionada, setAtividadeSelecionada] = useState(null)
    const [produtos, setProdutos] = useState([])
    const [carregandoProdutos, setCarregandoProdutos] = useState(false)
    const [showAgricolaModal, setShowAgricolaModal] = useState(false)
    const [showLoteModal, setShowLoteModal] = useState(false)
    const [lotes, setLotes] = useState([])
    const [usuarios, setUsuarios] = useState([])
    const [carregandoLotes, setCarregandoLotes] = useState(false)
    const [carregandoUsuarios, setCarregandoUsuarios] = useState(false)

    // form state for criar lote
    const [loteNome, setLoteNome] = useState("")
    const [tipoProdutoLote, setTipoProdutoLote] = useState("PLANTIO")
    const [tipoLote, setTipoLote] = useState("OUTRO")
    const [quantidadeLote, setQuantidadeLote] = useState("")
    const [precoLote, setPrecoLote] = useState("")
    const [unidadeMedidaLote, setUnidadeMedidaLote] = useState("")
    const [observacoesLote, setObservacoesLote] = useState("")
    const [statusLote, setStatusLote] = useState("PRONTO")
    const [responsavelLote, setResponsavelLote] = useState("")

    // form state for atividade agrícola
    const [descricao, setDescricao] = useState("")
    const [tipoAtvd, setTipoAtvd] = useState("PLANTIO")
    const [loteId, setLoteId] = useState("")
    const [dataInicioDate, setDataInicioDate] = useState("")
    const [dataInicioTime, setDataInicioTime] = useState("")
    const [dataFimDate, setDataFimDate] = useState("")
    const [dataFimTime, setDataFimTime] = useState("")
    const [responsavelId, setResponsavelId] = useState("")
    const [statusAtvd, setStatusAtvd] = useState("PENDENTE")

    const selecionarAtividade = async (atividade) => {
        setAtividadeSelecionada(atividade)

        const tituloLower = String(atividade.titulo || "").toLowerCase();
        if (tituloLower.includes("agrícola") || tituloLower.includes("agricola") || tituloLower.includes("atividade agrícola")) {
            // open centered modal and preload lotes + usuarios
            setShowAgricolaModal(true)
            const fetchFn = fetchWithAuth || fetch
            setCarregandoLotes(true)
            setCarregandoUsuarios(true)
            try {
                const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null
                if (unidadeId) {
                    // normalize API_URL to avoid double slashes
                    const base = String(API_URL || '/api').replace(/\/$/, '')
                    const r1 = await fetchFn(`${base}/lotesPlantio/${unidadeId}`)
                    const d1 = await r1.json().catch(() => ({}))

                    // robust extractor: backend sometimes nests the array under different keys and even wraps the result object
                    const extractArray = (obj) => {
                        if (!obj) return []
                        if (Array.isArray(obj)) return obj
                        // common direct keys
                        const directKeys = ['lotesPlantio', 'lotesVegetais', 'loteVegetais', 'lotes', 'data', 'lotesP', 'lotesPlantios'];
                        for (const k of directKeys) if (Array.isArray(obj[k])) return obj[k]
                        // sometimes controller returns { lotesVegetais: { loteVegetais: [...] } }
                        if (obj.lotesVegetais && Array.isArray(obj.lotesVegetais.loteVegetais)) return obj.lotesVegetais.loteVegetais
                        if (obj.lotesVegetais && Array.isArray(obj.lotesVegetais)) return obj.lotesVegetais
                        if (obj.loteVegetais && Array.isArray(obj.loteVegetais)) return obj.loteVegetais
                        if (obj.lotes && Array.isArray(obj.lotes)) return obj.lotes
                        // sometimes wrapped like { sucesso: true, loteVegetais: [...] }
                        if (Array.isArray(obj.loteVegetais)) return obj.loteVegetais
                        // last resort: scan object values for first array
                        const vals = Object.values(obj)
                        for (const v of vals) if (Array.isArray(v)) return v
                        return []
                    }

                    const rawLotes = extractArray(d1)
                    // filter out sold lotes
                    const filtered = (rawLotes || []).filter(l => String(l?.status || '').toUpperCase() !== 'VENDIDO')
                    setLotes(filtered)
                } else {
                    setLotes([])
                }
            } catch (err) {
                console.error('Erro carregando lotes:', err)
                setLotes([])
            } finally {
                setCarregandoLotes(false)
            }

            try {
                const base = String(API_URL || '/api').replace(/\/$/, '')
                const r2 = await fetchFn(`${base}/usuarios/unidade/listar`)
                const d2 = await r2.json().catch(() => ({}))
                const maybeUsers = d2?.usuarios || d2?.funcionarios || d2?.data || d2?.usuariosUnidade || (Array.isArray(d2) ? d2 : [])
                const usersArr = Array.isArray(maybeUsers) ? maybeUsers : (Array.isArray(d2?.usuarios) ? d2.usuarios : [])
                setUsuarios(usersArr)
                // if current user is in list, preselect as responsável
                if (user && usersArr.some(u => Number(u.id) === Number(user.id))) {
                    setResponsavelId(String(user.id))
                }
            } catch (err) {
                console.error('Erro carregando usuários:', err)
                setUsuarios([])
            } finally {
                setCarregandoUsuarios(false)
            }

            return
        }

        // abrir modal para criar lote
        if (tituloLower.includes("lote") || tituloLower.includes("criar lote") || tituloLower.includes("novo lote")) {
            setShowLoteModal(true)
            const fetchFn = fetchWithAuth || fetch
            setCarregandoUsuarios(true)
            try {
                const base = String(API_URL || '/api').replace(/\/$/, '')
                const r2 = await fetchFn(`${base}/usuarios/unidade/listar`)
                const d2 = await r2.json().catch(() => ({}))
                const maybeUsers = d2?.usuarios || d2?.funcionarios || d2?.data || d2?.usuariosUnidade || (Array.isArray(d2) ? d2 : [])
                const usersArr = Array.isArray(maybeUsers) ? maybeUsers : (Array.isArray(d2?.usuarios) ? d2.usuarios : [])
                setUsuarios(usersArr)
                if (user && usersArr.some(u => Number(u.id) === Number(user.id))) {
                    setResponsavelLote(String(user.id))
                }
            } catch (err) {
                console.error('Erro carregando usuários para lote:', err)
                setUsuarios([])
            } finally {
                setCarregandoUsuarios(false)
            }
            return
        }

        setOpen(true)

        if (atividade.necessitaProdutos) {
            setCarregandoProdutos(true)
            const res = await fetch("/api/produtos")
            const dados = await res.json()
            setProdutos(dados?.produtos || [])
            setCarregandoProdutos(false)
        }
    }
    const enviarFormulario = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData)
        if (formData.getAll("produtos").length > 0) { data.produtos = formData.getAll("produtos") }

        const response = await fetch(atividadeSelecionada.rotaApi, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, tipo: atividadeSelecionada.titulo, }),
        })

        if (response.ok) {
            setOpen(false)
            setAtividadeSelecionada(null)
            router.refresh()
        }
    }

    const enviarAtividadeAgricola = async (e) => {
        e?.preventDefault?.()
        try {
            const fetchFn = fetchWithAuth || fetch
            const makeISO = (date, time) => {
                if (!date) return null
                if (!time) return new Date(date).toISOString()
                const combined = `${date}T${time}`
                const d = new Date(combined)
                return isNaN(d.getTime()) ? new Date(date).toISOString() : d.toISOString()
            }

            const payload = {
                descricao: descricao || null,
                tipo: tipoAtvd || null,
                loteId: loteId ? Number(loteId) : null,
                dataInicio: makeISO(dataInicioDate, dataInicioTime),
                dataFim: dataFimDate ? makeISO(dataFimDate, dataFimTime) : null,
                responsavelId: responsavelId ? Number(responsavelId) : null,
                status: statusAtvd || null,
            }

            const res = await fetchFn(`${API_URL}/criarAtividadePlantio`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            const body = await res.json().catch(() => ({}))
            if (res.ok) {
                setShowAgricolaModal(false)
                setDescricao("")
                setTipoAtvd("PLANTIO")
                setLoteId("")
                setDataInicioDate("")
                setDataInicioTime("")
                setDataFimDate("")
                setDataFimTime("")
                setResponsavelId("")
                setStatusAtvd("PENDENTE")
                router.refresh()
            } else {
                console.error('Erro criando atividade:', body)
                alert(body?.erro || body?.message || 'Erro ao criar atividade')
            }
        } catch (err) {
            console.error('Erro enviando atividade agrícola:', err)
            alert('Erro ao enviar atividade')
        }
    }

    const enviarCriarLote = async (e) => {
        e?.preventDefault?.()
        try {
            const fetchFn = fetchWithAuth || fetch
            const base = String(API_URL || '/api').replace(/\/$/, '')
            const payload = {
                unidadeId: user?.unidadeId ?? user?.unidade?.id,
                responsavelId: responsavelLote ? Number(responsavelLote) : user?.id,
                nome: loteNome || null,
                tipo: tipoLote || null,
                tipoProduto: tipoProdutoLote || null,
                quantidade: quantidadeLote ? Number(quantidadeLote) : null,
                preco: precoLote ? Number(precoLote) : null,
                unidadeMedida: unidadeMedidaLote || null,
                observacoes: observacoesLote || null,
                status: statusLote || null,
            }

            const res = await fetchFn(`${base}/criarLote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            const body = await res.json().catch(() => ({}))
            if (res.ok) {
                setShowLoteModal(false)
                setLoteNome("")
                setTipoProdutoLote("PLANTIO")
                setTipoLote("OUTRO")
                setQuantidadeLote("")
                setPrecoLote("")
                setUnidadeMedidaLote("")
                setObservacoesLote("")
                setStatusLote("PRONTO")
                setResponsavelLote("")
                router.refresh()
            } else {
                console.error('Erro criando lote:', body)
                alert(body?.erro || body?.message || 'Erro ao criar lote')
            }
        } catch (err) {
            console.error('Erro enviando criar lote:', err)
            alert('Erro ao criar lote')
        }
    }

    const atividades = [
        {
            titulo: "atividade agrícola",
            rotaApi: "/api/atividades/agricola/criar",
            campos: [
                { name: "descricao", label: "Descrição", type: "text" },
                { name: "tipo", label: "Tipo()", type: "text" },
                { name: "loteId", label: "ID do lote", type: "number" },
                { name: "dataInicio", label: "Data de inicio", type: "date" },
                { name: "dataFim", label: "Data de término", type: "date" },
                { name: "responsavelId", label: "ID do responsável", type: "number" },
                { name: "status", label: "Status", type: "text" },
            ],
            icone: (
                <svg className="w-12 h-12 text-green-800 dark:text-white -ml-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.83892 12.4543s1.24988-3.08822-.21626-5.29004C8.15656 4.96245 4.58671 4.10885 4.39794 4.2436c-.18877.13476-1.11807 3.32546.34803 5.52727 1.4661 2.20183 5.09295 2.68343 5.09295 2.68343Zm0 0C10.3389 13.4543 12 15 12 18v2c0-2-.4304-3.4188 2.0696-5.9188m0 0s-.4894-2.7888 1.1206-4.35788c1.6101-1.56907 4.4903-1.54682 4.6701-1.28428.1798.26254.4317 2.84376-1.0809 4.31786-1.61 1.5691-4.7098 1.3243-4.7098 1.3243Z" />
                </svg>
            ),
        },
        {
            titulo: "atividade animalia",
            rotaApi: "/api/atividades/pecuaria/criar",
            necessitaProdutos: true,
            campos: [
                { name: "animalId", label: "ID animal", type: "number" },
                { name: "insumoId", label: "ID do insumo", type: "number" },
                { name: "descricao", label: "Descrição", type: "text" },
                { name: "tipo", label: "Tipo de atividade()", type: "text" },
                { name: "loteId", label: "ID do lote", type: "number" },
                { name: "dataInicio", label: "Data de inicio", type: "date" },
                { name: "dataFim", label: "Data de término", type: "date" },
                { name: "responsavelId", label: "ID do responsável", type: "number" },
                { name: "status", label: "Status", type: "text" },
                { name: "anexos", label: "Anexos", type: "file" },
            ],
            icone: <TruckIcon className="w-12 h-12 text-amber-600 -ml-5" />,
        },
        {
            titulo: "criar lote",
            rotaApi: "/criarLote",
            campos: [
                { name: "nome", label: "Nome do lote", type: "text" },
            ],
            icone: <CubeIcon className="w-12 h-12 text-sky-600 -ml-5" />,
        },
        {
            titulo: "contrato",
            rotaApi: "/api/atividades/contrato/criar",
            campos: [
                { name: "fornecedor", label: "Fornecedor", type: "text" },
                { name: "arquivo", label: "Upload do contrato", type: "file" },
                { name: "dataInicio", label: "Data de inicio", type: "date" },
                { name: "dataFim", label: "Data de fim", type: "date" },
                { name: "dataEnvio", label: "Data de envio", type: "date" },
                { name: "frequenciaEntregas", label: "Frequência de entregas", type: "text" },
                { name: "diaPagamento", label: "Dia de pagamento", type: "date" },
                { name: "formaPagamento", label: "Tipo de pagamento(dinheiro, cartão ou pix)", type: "text" },
                { name: "valorTotal", label: "Valor total", type: "number" },
                { name: "itens", label: "Itens", type: "select-multiple" },],
            icone: <DocumentTextIcon className="w-12 h-12 text-pink-600 -ml-5" />,
        },
        {
            titulo: "despesas / saídas",
            rotaApi: "/api/atividades/financeiro/criar",
            campos: [{ name: "descricao", label: "Descrição", type: "text" },
            { name: "tipoSaida", label: "Tipo de saída()", type: "text" },
            { name: "valor", label: "Valor", type: "number" },
            { name: "data", label: "Data", type: "date" }
            ],
            icone: <BanknotesIcon className="w-12 h-12 text-green-400 -ml-5" />,
        }
    ]

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <h1 className="text-3xl font-bold mb-10">Nova atividade</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                {atividades.map((item, index) => (
                    <Card key={index} className="w-64 h-64 flex flex-col items-center justify-center text-center border-2 hover:shadow-lg transition cursor-pointer" onClick={() => selecionarAtividade(item)}>
                        <CardHeader>{item.icone}</CardHeader>
                        <CardContent><CardTitle className="text-lg capitalize">{item.titulo}</CardTitle></CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-10"><Button onClick={() => router.push("/fazenda/dashboard")}>Voltar</Button></div>
            <Dialog open={showAgricolaModal} onOpenChange={setShowAgricolaModal}>
                <DialogContent className="max-w-lg w-full">
                    <DialogHeader>
                        <DialogTitle>Nova atividade agrícola</DialogTitle>
                        <DialogDescription>Preencha os dados abaixo</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={enviarAtividadeAgricola} className="space-y-4 mt-4">
                        <div>
                            <Label>Descrição</Label>
                            <Input value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                        </div>

                        <div>
                            <Label>Tipo</Label>
                            <select value={tipoAtvd} onChange={(e) => setTipoAtvd(e.target.value)} className="w-full border rounded p-2 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-900">
                                <option value="PLANTIO">PLANTIO</option>
                                <option value="COLHEITA">COLHEITA</option>
                                <option value="IRRIGACAO">IRRIGACAO</option>
                                <option value="ADUBACAO">ADUBACAO</option>
                                <option value="USO_AGROTOXICO">USO_AGROTOXICO</option>
                            </select>
                        </div>

                        <div>
                            <Label>Lote</Label>
                            {carregandoLotes ? (<p>Carregando lotes...</p>) : (
                                <select value={loteId} onChange={(e) => setLoteId(e.target.value)} className="w-full border rounded p-2 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-900">
                                    <option value="">Selecione um lote</option>
                                    {lotes.map((l) => (<option key={l.id} value={l.id}>{l?.nome ?? `Lote ${l.id}`}</option>))}
                                </select>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label>Data Início</Label>
                                <Input type="date" value={dataInicioDate} onChange={(e) => setDataInicioDate(e.target.value)} />
                            </div>
                            <div>
                                <Label>Hora Início (opcional)</Label>
                                <Input type="time" value={dataInicioTime} onChange={(e) => setDataInicioTime(e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label>Data Fim (opcional)</Label>
                                <Input type="date" value={dataFimDate} onChange={(e) => setDataFimDate(e.target.value)} />
                            </div>
                            <div>
                                <Label>Hora Fim (opcional)</Label>
                                <Input type="time" value={dataFimTime} onChange={(e) => setDataFimTime(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <Label>Responsável</Label>
                            {carregandoUsuarios ? (<p>Carregando usuários...</p>) : (
                                <select value={responsavelId} onChange={(e) => setResponsavelId(e.target.value)} className="w-full border rounded p-2 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-900">
                                    <option value="">Selecione um responsável</option>
                                    {usuarios.map((u) => (<option key={u.id} value={u.id}>{`${u.id} - ${u.nome || u.nomeCompleto || u.nome_usuario || u.nomeUsuario || u.nome}`}</option>))}
                                </select>
                            )}
                        </div>

                        <div>
                            <Label>Status</Label>
                            <select value={statusAtvd} onChange={(e) => setStatusAtvd(e.target.value)} className="w-full border rounded p-2 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-900">
                                <option value="PENDENTE">PENDENTE</option>
                                <option value="EM_ANDAMENTO">EM_ANDAMENTO</option>
                                <option value="CONCLUIDA">CONCLUIDA</option>
                                <option value="CANCELADA">CANCELADA</option>
                            </select>
                        </div>

                        <DialogFooter>
                            <div className="flex gap-2 w-full">
                                <Button type="button" variant="secondary" onClick={() => setShowAgricolaModal(false)}>Cancelar</Button>
                                <Button type="submit" className="ml-auto">Salvar</Button>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={showLoteModal} onOpenChange={setShowLoteModal}>
                <DialogContent className="max-w-lg w-full">
                    <DialogHeader>
                        <DialogTitle>Novo lote</DialogTitle>
                        <DialogDescription>Preencha os dados do lote</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={enviarCriarLote} className="space-y-4 mt-4">
                        <div>
                            <Label>Nome</Label>
                            <Input value={loteNome} onChange={(e) => setLoteNome(e.target.value)} />
                        </div>

                        <div>
                            <Label>Tipo Produto</Label>
                            <select value={tipoProdutoLote} onChange={(e) => { setTipoProdutoLote(e.target.value); setTipoLote('OUTRO') }} className="w-full border rounded p-2 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-900">
                                <option value="PLANTIO">PLANTIO</option>
                                <option value="ANIMALIA">ANIMALIA</option>
                            </select>
                        </div>

                        <div>
                            <Label>Tipo</Label>
                            <select value={tipoLote} onChange={(e) => setTipoLote(e.target.value)} className="w-full border rounded p-2 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-900">
                                {tipoProdutoLote === 'PLANTIO' ? (
                                    ["LEGUME", "FRUTA", "VERDURA", "GRAOS", "SOJA", "OUTRO"].map(t => (<option key={t} value={t}>{t}</option>))
                                ) : (
                                    ["GADO", "BOVINOS", "SUINOS", "LEITE", "OVINOS", "AVES", "EQUINO", "CAPRINOS", "OUTRO"].map(t => (<option key={t} value={t}>{t}</option>))
                                )}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label>Quantidade</Label>
                                <Input type="number" value={quantidadeLote} onChange={(e) => setQuantidadeLote(e.target.value)} />
                            </div>
                            <div>
                                <Label>Preço</Label>
                                <Input type="number" step="0.01" value={precoLote} onChange={(e) => setPrecoLote(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <Label>Unidade de medida</Label>
                            <select value={unidadeMedidaLote} onChange={(e) => setUnidadeMedidaLote(e.target.value)} className="w-full border rounded p-2 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-900">
                                <option value="">Selecione</option>
                                <option value="UNIDADE">UN</option>
                                <option value="T">TONELADA</option>
                                <option value="CABECA">CABEÇA</option>
                                <option value="ARROBA">ARROBA</option>
                                <option value="KG">KG</option>
                                <option value="L">L</option>
                                <option value="M2">M2</option>
                                <option value="HA">HA</option>
                            </select>
                        </div>

                        <div>
                            <Label>Observações</Label>
                            <Input value={observacoesLote} onChange={(e) => setObservacoesLote(e.target.value)} />
                        </div>

                        <div>
                            <Label>Responsável</Label>
                            {carregandoUsuarios ? (<p>Carregando usuários...</p>) : (
                                <select value={responsavelLote} onChange={(e) => setResponsavelLote(e.target.value)} className="w-full border rounded p-2 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-900">
                                    <option value="">Selecione um responsável</option>
                                    {usuarios.map((u) => (<option key={u.id} value={u.id}>{`${u.id} - ${u.nome || u.nomeCompleto || u.nome_usuario || u.nomeUsuario || u.nome}`}</option>))}
                                </select>
                            )}
                        </div>

                        <div>
                            <Label>Status</Label>
                            <select value={statusLote} onChange={(e) => setStatusLote(e.target.value)} className="w-full border rounded p-2 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-900">
                                <option value="">Selecione</option>
                                {(tipoProdutoLote === 'PLANTIO'
                                    ? ["PENDENTE", "SEMEADO", "CRESCIMENTO", "COLHEITA", "COLHIDO", "BLOQUEADO", "VENDIDO", "OUTRO"]
                                    : ["PENDENTE", "RECEBIDO", "EM_QUARENTENA", "AVALIACAO_SANITARIA", "EM_CRESCIMENTO", "EM_ENGORDA", "EM_REPRODUCAO", "LACTAÇÃO", "ABATE", "PRONTO", "BLOQUEADO", "VENDIDO"]
                                ).map((s) => (<option key={s} value={s}>{s}</option>))}
                            </select>
                        </div>

                        <DialogFooter>
                            <div className="flex gap-2 w-full">
                                <Button type="button" variant="secondary" onClick={() => setShowLoteModal(false)}>Cancelar</Button>
                                <Button type="submit" className="ml-auto">Salvar</Button>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent className="p-6 w-[450px] ml-auto">
                    <DrawerHeader>
                        <DrawerTitle>{atividadeSelecionada?.titulo}</DrawerTitle>
                        <DrawerDescription>Preencha os dados abaixo</DrawerDescription>
                    </DrawerHeader>

                    {atividadeSelecionada && (
                        <form onSubmit={enviarFormulario} className="space-y-4 mt-4">
                            {atividadeSelecionada.campos.map((campo) => (
                                <div key={campo.name}>
                                    <Label>{campo.label}</Label>
                                    {campo.type === "select-multiple" &&
                                        atividadeSelecionada?.necessitaProdutos && (
                                            carregandoProdutos ? (<p>Carregando produtos...</p>) : (
                                                <select name="produtos" multiple className="w-full border rounded p-2">
                                                    {produtos.map((p) => (<option key={p.id} value={p.id}>{p.nome}</option>))}
                                                </select>
                                            )
                                        )}
                                    {campo.type !== "select-multiple" && (<Input name={campo.name} type={campo.type} />)}
                                </div>
                            ))}
                            <Button type="submit" className="w-full">Salvar</Button>
                        </form>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    )
}
