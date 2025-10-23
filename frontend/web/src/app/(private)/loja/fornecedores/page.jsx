import { AppSidebar } from "@/components/app-sidebar"
import FornecedoresTable from "@/components/Fornecedores"
export default function Page() {
    return (
        <div className="flex flex-1 flex-col p-10">
            {/* <h1 className="text-2xl font-semibold ml-10">Fornecedores</h1> */}
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="justify-center W-100%">
                    <FornecedoresTable />
                </div>
            </div>
        </div>
    )
}
