// Página Dashboard: Oferecer uma visão resumida da operação.
// layout: Cards principais (produção atual, vendas totais, despesas totais, lucro líquido). Gráficos: Produção por fazenda. Vendas por loja. Evolução financeira (últimos 6 meses). Alertas: Lotes prestes a vencer. Estoque baixo. Lotes bloqueados por agrotóxicos.
// Funcionalidades: Filtros (por período, unidade, tipo de produto). Exportação rápida para PDF/Excel. Links de atalho para páginas detalhadas.
"use client"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/Fazenda/parceiros"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { ChartAreaGradient } from "@/components/data-table";
import { Calendar } from "@/components/ui/calendar";
import data from "./data.json"
import Component from "@/components/highlight-card";
// Para tradução
import { useTranslation } from "@/hooks/useTranslation";
import { Transl } from '@/components/TextoTraduzido/TextoTraduzido'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, Briefcase, MessageSquare, ChevronDown, ArrowUpDown, MoreHorizontal, Phone, Mail, Building2, DollarSign, Bell, Clock, Plus, Tractor, LandPlot, Trees } from 'lucide-react';
import { usePerfilProtegido } from '@/hooks/usePerfilProtegido';

//-------
export default function Page() {
  usePerfilProtegido("GERENTE_MATRIZ");

  return (
    <div className="flex flex-col p-10 gap-10">
      <div className="@container/main flex flex-2 flex-col gap-1">
        <div className="flex flex-col gap-1 py-1 md:gap-6 md:py-6">

          <div className="grid grid-cols-3 gap-6">
            <Card className={"p-0 h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition"}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg">
                    <LandPlot className="size-10" />
                  </div>
                  <div>
                    <div className="text-2xl font-medium">150</div>
                    <div className="text-sm text-muted-foreground">Total de unidades/filiais ativas</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={"p-0 h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition"}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg">
                    <Tractor className="size-10" />
                  </div>
                  <div>
                    <div className="text-2xl font-medium">R$ 2.000,00</div>
                    <div className="text-sm text-muted-foreground">Faturamento total consolidado</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={"p-0 h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition"}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg">
                    <Trees className="size-10 " />
                  </div>
                  <div>
                    <div className="text-2xl font-medium">30 ha</div>
                    <div className="text-sm text-muted-foreground">Não Produtiva</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DataTable data={data} />
          <div className="flex flex-row gap-6 items-start justify-between px-4 lg:px-6 mt-10">
            <div className="flex-1">
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
