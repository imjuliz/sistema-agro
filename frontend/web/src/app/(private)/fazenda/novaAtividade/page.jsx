"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {TruckIcon,DocumentTextIcon,BanknotesIcon,CubeIcon} from "@heroicons/react/24/outline"

export default function NovaAtividadePage() {
    const router = useRouter()

    const atividades = [
        {
            titulo: "atividade agrícola",
            icone: <svg className="w-12 h-12 text-green-800 dark:text-white -ml-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.83892 12.4543s1.24988-3.08822-.21626-5.29004C8.15656 4.96245 4.58671 4.10885 4.39794 4.2436c-.18877.13476-1.11807 3.32546.34803 5.52727 1.4661 2.20183 5.09295 2.68343 5.09295 2.68343Zm0 0C10.3389 13.4543 12 15 12 18v2c0-2-.4304-3.4188 2.0696-5.9188m0 0s-.4894-2.7888 1.1206-4.35788c1.6101-1.56907 4.4903-1.54682 4.6701-1.28428.1798.26254.4317 2.84376-1.0809 4.31786-1.61 1.5691-4.7098 1.3243-4.7098 1.3243Z" /></svg>,
            rota: "/atividades/agricola",
        },
        {
            titulo: "atividade pecuária",
            icone: <TruckIcon className="w-12 h-12 text-amber-600 -ml-5" />,
            rota: "/atividades/pecuaria",
        },
        {
            titulo: "contrato",
            icone: <DocumentTextIcon className="w-12 h-12 text-pink-600 -ml-5" />,
            rota: "/atividades/contrato",
        },
        {
            titulo: "despesas / saídas",
            icone: <BanknotesIcon className="w-12 h-12 text-green-400 -ml-5" />,
            rota: "/atividades/despesas",
        },
        {
            titulo: "envio de lotes",
            icone: <CubeIcon className="w-12 h-12 text-purple-600 -ml-5" />,
            rota: "/atividades/lotes",
        },
        {
            titulo: "planejamento",
            icone: <svg className="w-12 h-12 text-blue-800 dark:text-white -ml-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" /></svg>,
            rota: "/atividades/planejamento",
        },
    ]

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <h1 className="text-3xl font-bold mb-10">Nova atividade</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {atividades.map((item, index) => (
                    <Card key={index} className="w-64 h-64 flex flex-col items-center justify-center text-center border-2 hover:shadow-lg transition cursor-pointer" onClick={() => router.push(item.rota)}>
                        <CardHeader>{item.icone}</CardHeader>
                        <CardContent>
                            <CardTitle className="text-lg capitalize">{item.titulo}</CardTitle>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="mt-10">
                <Button onClick={() => router.push("/fazenda/dashboard")}>Voltar</Button>
            </div>
        </div>
    )
}
