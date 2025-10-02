// Página Dashboard: Oferecer uma visão resumida da operação.
// layout: Cards principais (produção atual, vendas totais, despesas totais, lucro líquido). Gráficos: Produção por fazenda. Vendas por loja. Evolução financeira (últimos 6 meses). Alertas: Lotes prestes a vencer. Estoque baixo. Lotes bloqueados por agrotóxicos.
// Funcionalidades: Filtros (por período, unidade, tipo de produto). Exportação rápida para PDF/Excel. Links de atalho para páginas detalhadas.

import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"

export default function Page() {
  return (
    // <SidebarProvider
    //   style={
    //     {
    //       "--sidebar-width": "calc(var(--spacing) * 72)",
    //       "--header-height": "calc(var(--spacing) * 12)"
    //     }
    //   }>
    //   <AppSidebar variant="inset" />
    //   <SidebarInset>
    //     <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div> */}
              <DataTable data={data} />
            </div>
          </div>
        </div>
    //   </SidebarInset>
    // </SidebarProvider>
  );
}
