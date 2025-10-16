import { AppSidebar } from "@/components/app-sidebar"
import FornecedoresTable from "@/components/Fornecedores"
import { SectionCards, ChartPieDonut, SectionCards2 } from "@/components/Fazenda/dashboard"
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
export default function Page() {
  return (
    <div className="flex flex-1 flex-col p-10">
      <h1 className="text-2xl font-semibold mb-6 ml-10">Dashboard</h1>

      <div className="flex justify-between items-start gap-8 w-full">
        <div className="flex-[0.3]"><SectionCards /></div>
        <div className="flex-[0.4] flex justify-center"><ChartPieDonut /></div>
        <div className="flex-[0.2] flex justify-end">
          {/* <Stack spacing={2} direction="column" alignItems="end">
            <Button variant="outlined">Outlined</Button>
            <Button variant="outlined">Outlined2</Button>
          </Stack> */}<SectionCards2/>
        </div>
      </div>
      <div className="mt-10 w-full"><FornecedoresTable /></div>
    </div>
  )
}

