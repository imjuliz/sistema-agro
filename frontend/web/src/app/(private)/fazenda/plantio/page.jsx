import { AppSidebar } from "@/components/app-sidebar"
import * as React from 'react';
import { SectionCards, TableDemo,ChartLineMultiple, TableDemo2 } from "@/components/Fazenda/plantio"
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";
import { usePerfilProtegido } from '@/hooks/usePerfilProtegido';

export default function Page() {
    const { fetchWithAuth } = useAuth();
  usePerfilProtegido("GERENTE_FAZENDA");

  return (
    <div className="flex flex-1 flex-col p-10">
      <h1 className="text-2xl font-semibold mb-6 ml-10">Plantio</h1>
      <div className="flex justify-between items-start gap-8 w-full">
        <div className="flex-1"><SectionCards /></div>
      </div>
      <div className="flex justify-between gap-8 w-full">
        <div className="flex-[0.4] xl:flex-1"><TableDemo/></div>
        <div className="flex-[0.6] xl:flex-1 hidden lg:block"><ChartLineMultiple/></div>
      </div>
       <div className="flex justify-between items-start gap-8 w-full">
        <div className="flex-1 flex flex-col justify-end mt-10"><TableDemo2/></div>
      </div>
    </div>
  )
}
