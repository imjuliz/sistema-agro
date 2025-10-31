import { DataTable } from "@/components/loja/dashboard/data-table"
import data from "./data.json"
// Para tradução
import { useTranslation } from "@/hooks/useTranslation";
import { Transl } from '@/components/TextoTraduzido/TextoTraduzido'
//-------
export default function Page() {
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
