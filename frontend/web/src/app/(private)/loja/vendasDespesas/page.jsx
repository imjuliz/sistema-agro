"use client"
import { ChartAreaInteractive, ChartPieDonut } from "@/components/chart-area-interactive"
import ComparisonTable from "@/components/comparison-table"
import FlexiFilterTable from "@/components/flexi-filter-table"
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";
import { usePerfilProtegido } from '@/hooks/usePerfilProtegido';

export default function VendasDespesasLoja() {
  const { fetchWithAuth } = useAuth();
  usePerfilProtegido("GERENTE_LOJA");

  return (
    <div className="flex flex-1 flex-col p-10">
      <h1 className="text-2xl font-semibold ml-10">Vendas e Despesas</h1>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <ChartAreaInteractive />
          <div className="px-4 lg:px-6 flex flex-row gap-6">
            <div className="w-1/3 hidden xl:block"><ChartPieDonut /></div>
            <div className="w-full xl:w-2/3"><ComparisonTable /></div>
          </div>
        </div>
        <div className="justify-center W-100%"><FlexiFilterTable /></div>
      </div>
    </div>
  )
}
