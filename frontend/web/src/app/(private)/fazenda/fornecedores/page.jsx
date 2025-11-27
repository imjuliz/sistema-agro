import { DataTable } from "@/components/Fazenda/parceiros"
import data from "./data.json"
// Para tradução
import { useTranslation } from "@/hooks/useTranslation";
import { Transl } from '@/components/TextoTraduzido/TextoTraduzido'
//-------
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";
import { usePerfilProtegido } from '@/hooks/usePerfilProtegido';

export default function Page() {
    const { fetchWithAuth } = useAuth();
  usePerfilProtegido("GERENTE_FAZENDA");

  return (
    <div className="flex flex-col p-10 gap-10">
      <div className="@container/main flex flex-2 flex-col gap-1">
        <div className="flex flex-col gap-1 py-1 md:gap-6 md:py-6">
          <DataTable data={data} />
        </div>
      </div>
    </div>
  );
}
