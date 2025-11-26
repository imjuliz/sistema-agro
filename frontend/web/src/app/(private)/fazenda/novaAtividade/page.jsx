"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TruckIcon, DocumentTextIcon, BanknotesIcon, CubeIcon } from "@heroicons/react/24/outline"

export default function Page() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [atividadeSelecionada, setAtividadeSelecionada] = useState(null)
    const [produtos, setProdutos] = useState([])
    const [carregandoProdutos, setCarregandoProdutos] = useState(false)

    const selecionarAtividade = async (atividade) => {
        setAtividadeSelecionada(atividade)
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
            body: JSON.stringify({...data,tipo: atividadeSelecionada.titulo,}),
        })

        if (response.ok) {
            setOpen(false)
            setAtividadeSelecionada(null)
            router.refresh()
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
