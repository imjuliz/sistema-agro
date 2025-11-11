"use client";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { useEffect, useState } from 'react';
import React from 'react';
export function SectionCards() {

  const [saldo, setSaldo] = useState([]);
  const [qtdEstoque, setQtdEstoque] = useState([]);
  const [saldoLiq, setSaldoLiq] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => { fetchSaldoDiario(); }, []);
  useEffect(() => { fetchQtdEstoque(); }, []);
  useEffect(() => { fetchSaldoLiq(); }, []);

  const fetchSaldoDiario = async () => {
    try {
      const response = await fetch('/saldo-final');
      if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
      const data = await response.json();
      setSaldo(data);
    }
    catch (error) { setError(error.message); }
  };

  const fetchSaldoLiq = async () => {
    try {
      const response = await fetch('/saldoLiquido');
      if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
      const data = await response.json();
      setSaldoLiq(data);
    }
    catch (error) { setError(error.message); }
  };

  const fetchQtdEstoque = async () => {
    try {
      const response = await fetch('/estoqueSomar');
      if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
      const data = await response.json();
      setQtdEstoque(data);
    }
    catch (error) { setError(error.message); }
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 max-w-7xl mx-auto w-full">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Saldo diário</CardDescription>
          {error ? (<CardTitle className="text-2xl font-semibold text-red-600"> Erro ao carregar dados! </CardTitle>
          ) : saldo.length === 0 ? (
            <CardTitle className="text-2xl font-semibold text-gray-500"> Nenhum saldo verificado! </CardTitle>
          ) : (saldo.map((user) => (
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl" key={user.id}>
              {user.nome ?? user}
            </CardTitle>
          ))
          )}
          <CardAction><Badge variant="outline"><IconTrendingUp />+12.5%</Badge></CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">Saldo aumentou em 12,5%<IconTrendingUp className="size-4" /></div>
          <div className="text-muted-foreground">Bom</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Lucros</CardDescription>
          {error ? (<CardTitle className="text-2xl font-semibold text-red-600"> Erro ao carregar dados! </CardTitle>
          ) : saldoLiq.length === 0 ? (<CardTitle className="text-2xl font-semibold text-gray-500"> Nenhum lucro verificado! </CardTitle>
          ) : (saldoLiq.map((user) => (
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl" key={user.id}>{user.nome ?? user}</CardTitle>
          ))
          )}
          <CardAction><Badge variant="outline"><IconTrendingDown />-20%</Badge></CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">Gastos caíram em 20% <IconTrendingDown className="size-4" /></div>
          <div className="text-muted-foreground">Bom</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Estoque</CardDescription>
          {error ? (<CardTitle className="text-2xl font-semibold text-red-600"> Erro ao carregar dados! </CardTitle>
          ) : qtdEstoque.length === 0 ? (
            <CardTitle className="text-2xl font-semibold text-gray-500"> Nenhum estoque verificado! </CardTitle>
          ) : (qtdEstoque.map((user) => (
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl" key={user.id}>
              {user.nome ?? user}
            </CardTitle>
          ))
          )}
          <CardAction> </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">Estoque dos produtos<IconTrendingUp className="size-4" /></div>
          <div className="text-muted-foreground">Ótimo</div>
        </CardFooter>
      </Card>
    </div>
  );
}
