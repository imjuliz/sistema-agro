import { AppSidebar } from "@/components/app-sidebar"
import * as React from 'react';
import { SectionCards, EnvioLotes, TableDemo2, GraficoDeBarras, GraficoPizza,TabelaSaidas, TabelaSobDemanda } from "@/components/Fazenda/vendasDespesas"
export default function Page() {
    return (
        <div className="flex flex-1 flex-col p-10">
            <h1 className="text-2xl font-semibold mb-6 ml-10">Vendas e Despesas</h1>
            <div className="flex justify-between items-start gap-8 w-full">
                <div className="flex-1"><SectionCards /></div>
            </div>
            <div className="flex justify-between items-start gap-8 w-full mb-10">
                <div className="flex-1 flex flex-col justify-end mt-10"><GraficoDeBarras /></div>
            </div>
             <div className="flex justify-between gap-8 w-full mb-10">
                <div className="flex-1"><TableDemo2 /></div>
                <div className="flex-1"><EnvioLotes /></div>
            </div>
            <div className="flex justify-between gap-8 w-full">
                <div className="flex-1"><GraficoPizza /></div>
                <div className="flex-1"><TabelaSaidas /></div>
            </div>
             <div className="flex justify-between items-start gap-8 w-full mb-10">
                <div className="flex-1 flex flex-col justify-end mt-10"><TabelaSobDemanda /></div>
            </div>
        </div>
    )
}
