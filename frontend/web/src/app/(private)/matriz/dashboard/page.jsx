// Página Dashboard: Oferecer uma visão resumida da operação.
// layout: Cards principais (produção atual, vendas totais, despesas totais, lucro líquido). Gráficos: Produção por fazenda. Vendas por loja. Evolução financeira (últimos 6 meses). Alertas: Lotes prestes a vencer. Estoque baixo. Lotes bloqueados por agrotóxicos.
// Funcionalidades: Filtros (por período, unidade, tipo de produto). Exportação rápida para PDF/Excel. Links de atalho para páginas detalhadas.

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/matriz/dashboard/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
// para tradução
import { useTranslation } from "@/hooks/useTranslation";
import { Transl } from '@/components/TextoTraduzido/TextoTraduzido'
import { ChartAreaGradient } from "@/components/data-table";
import { Calendar } from "@/components/ui/calendar";
import data from "./data.json"
import Component from "@/components/highlight-card";
export default function Page() {
  return (
    <div className="flex flex-col p-10 gap-10">
      <div className="@container/main flex flex-2 flex-col gap-1">
        <div className="flex flex-col gap-1 py-1 md:gap-6 md:py-6">
          <div className="flex flex-row gap-6 items-start justify-between px-4 lg:px-6 mt-10">
            <div className="w-full">
              <Component />
            </div>
            <div className="flex-1">
              <Calendar />
            </div>
          </div>
          <DataTable data={data} />
          <div className="flex flex-row gap-6 items-start justify-between px-4 lg:px-6 mt-10">
            <div className="flex-1">
              <ChartAreaGradient />
            </div>
            <div className="w-full">
              <Calendar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
