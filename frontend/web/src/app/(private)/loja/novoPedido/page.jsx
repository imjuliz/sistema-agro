import { AppSidebar } from "@/components/app-sidebar"
import MyForm from "@/components/NovoPedido"
export default function Page() {
    return (
        <div className="flex flex-1 flex-col p-10">
            <h1 className="text-2xl font-semibold ml-10">Novo Pedido</h1>
            <div className="@container/main flex flex-1 flex-col gap-2">
                <MyForm/>
            </div>
        </div>
    )
}