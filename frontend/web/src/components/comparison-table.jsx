"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";

export default function FinanceiroTable() {
  const { fetchWithAuth, user } = useAuth();
  const [saidas, setSaidas] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState([]);

  // Carregar saídas do backend
  useEffect(() => {
    const carregarSaidas = async () => {
      if (!user?.unidadeId) return;

      try {
        const res = await fetchWithAuth(`${API_URL}listarSaidas/${user.unidadeId}`);
        if (res.ok) {
          const body = await res.json();
          setSaidas(body.saidas || []);
        }
      } catch (error) {
        console.error("Erro ao carregar saídas:", error);
      }
    };

    carregarSaidas();
  }, [user?.unidadeId, fetchWithAuth]);

  // Seleção de linhas
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 2
        ? [...prev, id]
        : prev
    );
  };

  const resetSelection = () => setSelected([]);

  // Filtros
  const filteredData = saidas.filter((item) => {
    const matchesSearch = item.descricao?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || item.categoria === category;
    return matchesSearch && matchesCategory;
  });

  const comparedItems = saidas.filter((item) => selected.includes(item.id));

  return (
    <Card className="w-full mx-auto h-full">
      <CardContent className="p-3">
        <h2 className="text-xl font-semibold mb-4">Tabela de Saídas</h2>

        {/* Filtros */}
        <div className="flex items-center gap-3 mb-4">
          <Input
            placeholder="Pesquisar descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tudo</SelectItem>
              {[...new Set(saidas.map((s) => s.categoria).filter(Boolean))].map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={resetSelection}>
            Reset
          </Button>
        </div>

        {/* Tabela */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário ID</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Forma Pagamento</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Valor Pago</TableHead>
              <TableHead>Data Pagamento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Selecionar</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id} className={cn(selected.includes(item.id) && "bg-muted/50")}>
                <TableCell>{item.usuarioId}</TableCell>
                <TableCell>{item.descricao}</TableCell>
                <TableCell>{item.tipoMovimento}</TableCell>
                <TableCell>{item.categoria}</TableCell>
                <TableCell>{item.formaPagamento}</TableCell>
                <TableCell>R$ {item.valor}</TableCell>
                <TableCell>R$ {item.valorPago ?? 0}</TableCell>
                <TableCell>{item.dataPagamento ? new Date(item.dataPagamento).toLocaleDateString("pt-BR") : "-"}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  <Button
                    variant={selected.includes(item.id) ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => toggleSelect(item.id)}
                  >
                    {selected.includes(item.id) ? "Remover" : "Comparar"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Comparação */}
        {comparedItems.length === 2 && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Comparação</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              {[
                "Usuário ID",
                "Descrição",
                "Tipo",
                "Categoria",
                "Forma Pagamento",
                "Valor",
                "Valor Pago",
                "Data Pagamento",
                "Status",
              ].map((col, index) => (
                <React.Fragment key={col}>
                  <div className="font-semibold">{col}</div>
                  <div>{comparedItems[0][Object.keys(comparedItems[0])[index]]}</div>
                  <div>{comparedItems[1][Object.keys(comparedItems[1])[index]]}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
