import { AppSidebar } from "@/components/app-sidebar"
import FornecedoresTable from "@/components/Fornecedores"
import { SectionCards, ChartPieDonut } from "@/components/Fazenda/dashboard"
export default function Page() {
    return (
        <div className="flex flex-1 flex-col p-10">
            <h1 className="text-2xl font-semibold ml-10">Dashboard</h1>
            <div className="@container/main flex flex-1 flex-col gap-2">
            <div>
                <SectionCards/>
                <ChartPieDonut/>
            </div>
                <div className="justify-center W-100%">
                    <FornecedoresTable />
                </div>
            </div>
        </div>
    )
}
