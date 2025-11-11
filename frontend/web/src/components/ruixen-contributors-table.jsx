"use client";
import { Input } from "@/components/ui/input";
import {Select,SelectTrigger,SelectValue,SelectContent,SelectGroup,SelectLabel,SelectItem,} from "@/components/ui/select";
import {Table,TableBody,TableCaption,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table";
import { useEffect, useState } from "react";

function ContribuidoresTable() {
  const [categoria, setCategoria] = useState("");
  const [busca, setBusca] = useState("");
  const [estoque, setEstoque] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {fetchEstoque();}, []);

  const fetchEstoque = async () => {
    try {
      const response = await fetch("/estoque/listar");
      if (!response.ok) {throw new Error(`HTTP error! status: ${response.status}`);}
      const data = await response.json();
      setEstoque(data);
    } catch (error) {setError(error.message);}
  };

  return (
    <div className="border rounded-lg shadow-sm bg-white dark:bg-black h-full p-4 w-full">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="text-xl font-semibold">Estoque</h2>

          <Select onValueChange={setCategoria}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tipo</SelectLabel>
                <SelectItem value="bovinos">Bovinos</SelectItem>
                <SelectItem value="suinos">Suínos</SelectItem>
                <SelectItem value="aves">Aves</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select onValueChange={setCategoria}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="reproducao">Em reprodução</SelectItem>
                <SelectItem value="engorda">Em engorda</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select onValueChange={setCategoria}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Preço" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Preço</SelectLabel>
                <SelectItem value="id">Id</SelectItem>
                <SelectItem value="tipo">Tipo</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Input type="text" placeholder="Buscar..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-[250px]"/>
      </div>

      <Table>
        {error ? (<TableCaption className="text-red-600">Erro ao carregar dados do estoque!</TableCaption>
        ) : estoque.length === 0 ? (<TableCaption>Nenhum estoque verificado!</TableCaption>)
          : ( <TableCaption>Tabela de estoque</TableCaption>)}

        <TableHeader>
          <TableRow className="bg-gray-100 dark:bg-gray-800">
            <TableHead className="w-[80px] font-semibold">ID</TableHead>
            <TableHead className="font-semibold">Nome</TableHead>
            <TableHead className="font-semibold">Qtd</TableHead>
            <TableHead className="font-semibold">Un. medida</TableHead>
            <TableHead className="font-semibold">Valor un.</TableHead>
            <TableHead className="font-semibold">Fornecedor</TableHead>
            <TableHead className="font-semibold">Situação</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {estoque.length > 0 &&
            estoque.map((lote) => (
              <TableRow key={lote.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <TableCell className="font-medium">{lote.id}</TableCell>
                <TableCell>{lote.nome}</TableCell>
                <TableCell>{lote.qtd}</TableCell>
                <TableCell>{lote.unMedida}</TableCell>
                <TableCell>R$ {lote.valorUn}</TableCell>
                <TableCell>{lote.fornecedor}</TableCell>
                <TableCell>{lote.situacao}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ContribuidoresTable;
