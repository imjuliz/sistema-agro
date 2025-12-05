"use client";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/lib/api';

function EstoqueTable() {
  const { user, fetchWithAuth } = useAuth();
  const [busca, setBusca] = useState("");
  const [estoque, setEstoque] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchEstoque() {
      const unidadeId = user?.unidadeId ?? user?.unidade?.id;
      
      if (!unidadeId) {
        console.warn('[fetchEstoque] unidadeId não disponível.');
        if (mounted) {
          setEstoque([]);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const url = `${API_URL}unidade/${unidadeId}/produtos`;
        const res = await fetchWithAuth(url, {
          method: 'GET',
          credentials: 'include',
          headers: { Accept: 'application/json' }
        });

        if (!res?.ok) {
          throw new Error(`Erro ao carregar estoque: ${res?.status}`);
        }

        const body = await res.json();
        const payload = body?.estoque ?? body?.produtos ?? body?.data ?? body ?? [];

        if (mounted) {
          setEstoque(Array.isArray(payload) ? payload : []);
          setError(null);
        }
      } catch (err) {
        console.error('[fetchEstoque] erro:', err);
        if (mounted) {
          setError(err.message);
          setEstoque([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (fetchWithAuth) {
      fetchEstoque();
    }

    return () => { mounted = false; };
  }, [fetchWithAuth, user]);

  const estoquesFiltrados = estoque.filter(item => {
    if (!busca) return true;
    const nome = item?.nome ?? item?.produto?.nome ?? '';
    const fornecedor = item?.fornecedorUnidade?.nome ?? 
                      item?.fornecedorExterno?.nomeEmpresa ?? 
                      item?.pedido?.fornecedorExterno?.nomeEmpresa ?? 
                      item?.pedido?.origemUnidade?.nome ?? '';
    
    const searchTerm = busca.toLowerCase();
    return nome.toLowerCase().includes(searchTerm) || 
           fornecedor.toLowerCase().includes(searchTerm) ||
           String(item?.id ?? '').includes(searchTerm);
  });

  useEffect(() => {
    async function listandoEstoque() {
      const response = await fetch(`http://localhost:8080/unidade/produtos`, {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });

      if (!response.ok) {
        throw new Error(`Erro ao carregar estoque: ${response.status}`);
      }
      }
      listandoEstoque()
  });

  return (
    <div className="border rounded-lg shadow-sm bg-white dark:bg-black h-full p-4 w-full">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h2 className="text-xl font-semibold">Estoque</h2>
        <Input 
          type="text" 
          placeholder="Buscar por nome, fornecedor ou ID..." 
          value={busca} 
          onChange={(e) => setBusca(e.target.value)} 
          className="w-[300px]"
        />
      </div>

      <Table>
        {loading ? (
          <TableCaption>Carregando...</TableCaption>
        ) : error ? (
          <TableCaption className="text-red-600">Erro: {error}</TableCaption>
        ) : estoquesFiltrados.length === 0 ? (
          <TableCaption>
            {busca ? 'Nenhum resultado encontrado para a busca.' : 'Nenhum produto em estoque.'}
          </TableCaption>
        ) : (
          <TableCaption>Lista de produtos em estoque</TableCaption>
        )}

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
          {estoquesFiltrados.map((item, idx) => {
            const key = item?.id ?? item?.sku ?? item?.produto?.id ?? `row-${idx}`;
            const nome = item?.nome ?? item?.produto?.nome ?? '-';
            const qtd = item?.qntdAtual ?? item?.quantidade ?? item?.qtd ?? 0;
            const unMedida = item?.unidadeBase ?? item?.unidadeMedida ?? '-';
            const valorUn = item?.precoUnitario ?? item?.valorUnitario ?? item?.valorUn ?? 0;
            const fornecedor = item?.fornecedorUnidade?.nome ?? 
                              item?.fornecedorExterno?.nomeEmpresa ?? 
                              item?.pedido?.fornecedorExterno?.nomeEmpresa ?? 
                              item?.pedido?.origemUnidade?.nome ?? '-';
            const situacao = item?.situacao ?? item?.status ?? '-';

            return (
              <TableRow 
                key={key} 
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <TableCell className="font-medium">{item?.id ?? '-'}</TableCell>
                <TableCell>{nome}</TableCell>
                <TableCell>{qtd}</TableCell>
                <TableCell>{unMedida}</TableCell>
                <TableCell>R$ {Number(valorUn).toFixed(2)}</TableCell>
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

export default EstoqueTable;