import { AppSidebar } from "@/components/app-sidebar"
import * as React from 'react';
import { SectionCards, ChartPieDonut, SectionCards2, SectionCards3, GraficoDeBarras, CalendarEventListDemo, TableDemo } from "@/components/Fazenda/dashboard"
import { TweetGrid } from "@/components/ui/tweet-grid";
export default function Page() {
  return (
    <div className="flex flex-1 flex-col p-10 dark:bg-black">
      <h1 className="text-2xl font-semibold mb-6 ml-10">Dashboard</h1>
      <div className=" grid xl:flex justify-between items-start gap-8 w-full mb-5">
        <div className="flex-[0.3]"><SectionCards /></div>
        <div className="flex-[0.4] flex justify-center"><ChartPieDonut /></div>
        <div className="flex-[0.3] flex justify-end"><SectionCards2 /></div>
      </div>
      <div className="flex justify-between items-start gap-8 w-full">
        <div className="hidden lg:block flex-[0.7] border-gray-200"><GraficoDeBarras /></div>
        <div className=" flex-1 lg:flex-[0.3] flex justify-end "><CalendarEventListDemo /></div>
      </div>
       <div className=" lg:flex justify-between items-start gap-8 w-full">
        <div className="flex-1 lg:flex-[0.6] flex justify-end "><TweetGrid /></div>
        <div className="flex-1 lg:flex-[0.4] flex flex-col lg:justify-end mt-10"><div className="mb-12"><SectionCards3/></div> <TableDemo/></div>
      </div>
    </div>
  )
}

