import { AppSidebar } from "@/components/app-sidebar"
import * as React from 'react';
import { SectionCards, TableDemo,ChartLineMultiple, TableDemo2, ChartPieDonut } from "@/components/Fazenda/animalia"
import { TweetGrid } from "@/components/ui/tweet-grid";
export default function Page() {
  return (
    <div className="flex flex-1 flex-col p-10">
      <h1 className="text-2xl font-semibold mb-6 ml-10">Animália</h1>
      <div className="flex justify-between items-start gap-8 w-full">
        <div className="flex-1"><SectionCards /></div>
      </div>
      <div className="flex justify-between gap-8 w-full">
        <div className="flex-1"><ChartPieDonut/></div>
        <div className="flex-1"><TableDemo/></div>
      </div>
       <div className="flex justify-between items-start gap-8 w-full">
        <div className="flex-1 flex flex-col justify-end mt-10"><TableDemo2/></div>
      </div>
    </div>
  )
}
