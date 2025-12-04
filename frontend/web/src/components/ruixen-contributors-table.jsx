"use client";
import { Input } from "@/components/ui/input";
import {Select,SelectTrigger,SelectValue,SelectContent,SelectGroup,SelectLabel,SelectItem,} from "@/components/ui/select";
import {Table,TableBody,TableCaption,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/lib/api';

function ContribuidoresTable() {
  const { user, fetchWithAuth } = useAuth();
  const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
  const [categoria, setCategoria] = useState("");
  const [busca, setBusca] = useState("");
  const [estoque, setEstoque] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchEstoque() {
      try {
        if (!unidadeId) {
          console.warn('[fetchEstoque] unidadeId não disponível no usuário da sessão.');
          if (!mounted) return;
          setEstoque([]);
          return;
        }

        const url = `${API_URL}unidade/${unidadeId}/produtos`;
        const res = await fetchWithAuth(url, { method: 'GET', credentials: 'include', headers: { Accept: 'application/json' } });

        if (res?.status === 401) {
          if (!mounted) return;
          setEstoque([]);
          return;
        }

        const body = await res.json().catch(() => null);
        const payload = body?.estoque ?? body?.produtos ?? body?.data ?? body ?? [];

        if (!mounted) return;
        setEstoque(Array.isArray(payload) ? payload : [payload]);
      } catch (err) {
        console.error('[fetchEstoque] erro:', err);
        if (mounted) setError(String(err?.message ?? err));
      }
    }

    if (fetchWithAuth) fetchEstoque();
    return () => { mounted = false; };
  }, [fetchWithAuth]);

  return (
    <div className="border rounded-lg shadow-sm bg-white dark:bg-black h-full p-4 w-full">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="text-xl font-semibold">Estoque</h2>
{/* 
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
          </Select> */}
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
            estoque.map((lote, idx) => {
              const key = lote?.id ?? lote?.sku ?? lote?.produto?.id ?? `row-${idx}`;
              const nome = lote?.nome ?? lote?.produto?.nome ?? '';
              const qtd = lote?.qntdAtual ?? lote?.quantidade ?? lote?.qtd ?? 0;
              const unMedida = lote?.unidadeBase ?? lote?.unidadeMedida ?? '';
              const valorUn = lote?.precoUnitario ?? lote?.valorUnitario ?? lote?.valorUn ?? 0;
              const fornecedor = lote?.fornecedorUnidade?.nome ?? lote?.fornecedorExterno?.nomeEmpresa ?? lote?.pedido?.fornecedorExterno?.nomeEmpresa ?? lote?.pedido?.origemUnidade?.nome ?? '';
              const situacao = lote?.situacao ?? lote?.status ?? '';

              return (
                <TableRow key={key} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <TableCell className="font-medium">{lote?.id ?? ''}</TableCell>
                  <TableCell>{nome}</TableCell>
                  <TableCell>{qtd}</TableCell>
                  <TableCell>{unMedida}</TableCell>
                  <TableCell>R$ {Number(valorUn || 0).toFixed(2)}</TableCell>
                  <TableCell>{fornecedor}</TableCell>
                  <TableCell>{situacao}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}

export default ContribuidoresTable;
