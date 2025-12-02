"use client";

import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { MoreVertical } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";  // Importando contexto de autenticação
import { API_URL } from "@/lib/api";  // Assumindo que você tem uma variável de URL da API

const fetchVendas = async (unidadeId, fetchWithAuth) => {
  try {
    const response = await fetchWithAuth(`${API_URL}listarVendas/${unidadeId}`);
    if (response.ok) {
      const data = await response.json();
      return data.vendas || [];  // Retorna as vendas ou um array vazio se não houver vendas
    } else {
      console.error("Erro ao buscar vendas:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Erro ao carregar vendas:", error);
    return [];
  }
};

export default function FlexiFilterTable() {
  const { fetchWithAuth, user } = useAuth();  // Usando o contexto para obter `fetchWithAuth` e `user`
  const [vendas, setVendas] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [location, setLocation] = useState("Location");
  const [minBalance, setMinBalance] = useState("");
  const [maxBalance, setMaxBalance] = useState("");
  const [joinedAfter, setJoinedAfter] = useState();

  const unidadeId = user?.unidadeId; // Pegando a unidadeId do usuário

  // Função para carregar as vendas
  useEffect(() => {
    if (unidadeId) {
      const loadVendas = async () => {
        const vendasData = await fetchVendas(unidadeId, fetchWithAuth);
        setVendas(vendasData);
      };
      loadVendas();
    }
  }, [unidadeId, fetchWithAuth]);

  const filteredData = useMemo(() => {
    return vendas.filter((item) => {
      if (status !== "All" && item.status !== status) return false;
      if (location !== "Location" && item.location !== location) return false;
      if (search && !`${item.nomeCliente} ${item.email}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (minBalance && item.total < Number(minBalance)) return false;
      if (maxBalance && item.total > Number(maxBalance)) return false;
      if (joinedAfter && new Date(item.criadoEm) < joinedAfter) return false;
      return true;
    });
  }, [vendas, search, status, location, minBalance, maxBalance, joinedAfter]);

  const toggleRow = (id) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  return (
    <div className="bg-background border rounded-lg overflow-hidden">
      <div className="p-4 flex flex-col gap-3 md:flex-row md:flex-wrap items-start md:items-center">
        <Input placeholder="Pesquise por nome ou email" value={search} onChange={(e) => setSearch(e.target.value)} className="md:w-1/4" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{status}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {["All", "Active", "Inactive"].map((s) => (
              <DropdownMenuItem key={s} onClick={() => setStatus(s)}>
                {s}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{location}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {["Location", "San Francisco", "Singapore", "London", "Madrid", "Seoul"].map((loc) => (
              <DropdownMenuItem key={loc} onClick={() => setLocation(loc)}>
                {loc}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex gap-2">
          <Input type="number" placeholder="Min $" value={minBalance} onChange={(e) => setMinBalance(e.target.value)} className="w-24" />
          <Input type="number" placeholder="Max $" value={maxBalance} onChange={(e) => setMaxBalance(e.target.value)} className="w-24" />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">{joinedAfter ? joinedAfter.toDateString() : "Joined After"}</Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Calendar mode="single" selected={joinedAfter} onSelect={setJoinedAfter} />
          </PopoverContent>
        </Popover>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>
                <Checkbox
                  checked={selectedRows.size === vendas.length}
                  onCheckedChange={(checked) =>
                    setSelectedRows(checked ? new Set(vendas.map((d) => d.id)) : new Set())
                  }
                />
              </TableHead>
              <TableHead>Id Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/30">
                <TableCell>
                  <Checkbox checked={selectedRows.has(row.id)} onCheckedChange={() => toggleRow(row.id)} />
                </TableCell>
                <TableCell className="font-medium">{row.id}</TableCell>
                <TableCell>{row.nomeCliente}</TableCell>
                <TableCell>{row.pagamento}</TableCell>
                <TableCell>
                  <Badge variant={row.status === "Active" ? "secondary" : "destructive"}>{row.status}</Badge>
                </TableCell>
                <TableCell>${row.total.toLocaleString()}</TableCell>
                <TableCell>{new Date(row.criadoEm).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Visualizar</DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Deletar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="sticky bottom-0 bg-background">
            <TableRow>
              <TableCell colSpan={7}>Total de pedidos</TableCell>
              <TableCell>{filteredData.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
