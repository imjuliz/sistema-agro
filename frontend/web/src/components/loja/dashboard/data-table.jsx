"use client"
import * as React from "react"
import { z } from "zod"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs"
import { TabelaFuncionarios } from "../funcionarios/tabela";

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
})

export function DataTable() {
  return (
    <Tabs defaultValue="geral" className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">View</Label>
        <Select defaultValue="geral">
          <SelectTrigger className="flex w-fit @4xl/main:hidden" size="sm" id="view-selector">
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="geral">Funcionários</SelectItem>
            <SelectItem value="fazendas">Administradores</SelectItem>
          </SelectContent>
        </Select>
        <TabsList
          className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="fazendas">Administradores</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="geral" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <h1 className="font-bold">Tabela Geral</h1>
        <TabelaFuncionarios/>
      </TabsContent>

      <TabsContent value="fazendas" className="flex flex-col px-4 lg:px-6">
        <h1 className="font-bold">Tabela de Admins</h1>
        <TabelaFuncionarios/>
      </TabsContent>
    </Tabs>
  );
}
