import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive, ChartBarMultiple } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import data from "./data.json"
import ContributorsTable from "@/components/ruixen-contributors-table"
export default function Page() {
  return (
    <div className="flex flex-1 flex-col p-10">
      <h1 className="text-2xl font-semibold ml-10">Dashboard</h1>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartBarMultiple />
          </div>
          <h1 className="text-2xl font-semibold ml-10">Estoque</h1>
          <div className="flex justify-center W-100%">
            <ContributorsTable /></div>
        </div>
      </div>
    </div>
  )
}
