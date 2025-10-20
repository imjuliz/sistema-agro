import { AppSidebar } from "@/components/app-sidebar"
import * as React from 'react';
import { SectionCards, ChartPieDonut, SectionCards2, SectionCards3, GraficoDeBarras, CalendarEventListDemo, TableDemo } from "@/components/Fazenda/dashboard"
import { TweetGrid } from "@/components/ui/tweet-grid";
export default function Page() {
  return (
    <div className="flex flex-1 flex-col p-10">
      <h1 className="text-2xl font-semibold mb-6 ml-10">Dashboard</h1>
      <div className="flex justify-between items-start gap-8 w-full">
        <div className="flex-[0.3]"><SectionCards /></div>
        <div className="flex-[0.4] flex justify-center"><ChartPieDonut /></div>
        <div className="flex-[0.2] flex justify-end"><SectionCards2 /></div>
      </div>
      <div className="flex justify-between items-start gap-8 w-full">
        <div className="flex-[0.7]"><GraficoDeBarras /></div>
        <div className="flex-[0.3] flex justify-end "><CalendarEventListDemo /></div>
      </div>
       <div className="flex justify-between items-start gap-8 w-full">
        <div className="flex-[0.6] flex justify-end "><TweetGrid /></div>
        <div className="flex-[0.4] flex flex-col justify-end mt-10"><SectionCards3 /> <TableDemo/></div>
      </div>
    </div>
  )
}

