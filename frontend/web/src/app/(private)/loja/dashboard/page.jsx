"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartBarMultiple } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import ContributorsTable from "@/components/ruixen-contributors-table"
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";
import { usePerfilProtegido } from '@/hooks/usePerfilProtegido';

export default function DashboardLoja() {
  const { fetchWithAuth } = useAuth();
  usePerfilProtegido("GERENTE_LOJA");

  return (
    <div className="flex flex-1 flex-col p-10">
      <h1 className="text-2xl font-semibold ml-10">Dashboard</h1>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-0 lg:px-6 sm:hidden"><ChartBarMultiple /></div>
          <div className="flex justify-center -mt-90 sm:mt-20"><ContributorsTable /></div>
        </div>
      </div>
    </div>
  )
}
