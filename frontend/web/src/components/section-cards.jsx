"use client";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { useEffect, useState } from 'react';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from "@/config";
export function SectionCards() {

  const [saldo, setSaldo] = useState(0);
  const [qtdEstoque, setQtdEstoque] = useState(0);
  const [saldoLiq, setSaldoLiq] = useState(0);
  const [error, setError] = useState(null);

  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    let mounted = true;

    async function fetchSaldoDiario() {
      try {
        const url = `${API_URL}/saldo-final`;
        const res = await fetchWithAuth(url, { method: 'GET', credentials: 'include', headers: { Accept: 'application/json' } });
        if (!res.ok) {
          const text = await res.text().catch(() => null);
          console.error('[fetchSaldoDiario] server responded with error', { status: res.status, statusText: res.statusText, bodyText: text });
          if (!mounted) return;
          setError(`Erro do servidor: ${res.status} ${res.statusText}`);
          setSaldo([]);
          return;
        }

        const body = await res.json().catch(async () => {
          const t = await res.text().catch(() => null);
          console.warn('[fetchSaldoDiario] resposta não-JSON, texto:', t);
          return null;
        });
        const saldoValue = body?.saldoFinal ?? body?.data ?? 0;
        const payload = typeof saldoValue === 'number' ? saldoValue : 0;

        if (!mounted) return;
        setSaldo(payload);
      } catch (err) {
        console.error('[fetchSaldoDiario] erro:', err);
        if (mounted) setError(String(err?.message ?? err));
      }
    }

    if (fetchWithAuth) fetchSaldoDiario();
    return () => { mounted = false; };
  }, [fetchWithAuth]);

  useEffect(() => {
    let mounted = true;

    async function fetchSaldoLiq() {
      try {
        const url = `${API_URL}/saldoLiquido`;
        const res = await fetchWithAuth(url, { method: 'GET', credentials: 'include', headers: { Accept: 'application/json' } });

        if (!res.ok) {
          const text = await res.text().catch(() => null);
          console.error('[fetchSaldoLiq] server responded with error', { status: res.status, statusText: res.statusText, bodyText: text });
          if (!mounted) return;
          setError(`Erro do servidor: ${res.status} ${res.statusText}`);
          setSaldoLiq([]);
          return;
        }

        const body = await res.json().catch(async () => {
          const t = await res.text().catch(() => null);
          console.warn('[fetchSaldoLiq] resposta não-JSON, texto:', t);
          return null;
        });
        const saldoLiqValue = body?.saldoLiquido ?? body?.data ?? 0;
        const payload = typeof saldoLiqValue === 'number' ? saldoLiqValue : 0;

        if (!mounted) return;
        setSaldoLiq(payload);
      } catch (err) {
        console.error('[fetchSaldoLiq] erro:', err);
        if (mounted) setError(String(err?.message ?? err));
      }
    }

    if (fetchWithAuth) fetchSaldoLiq();
    return () => { mounted = false; };
  }, [fetchWithAuth]);

  useEffect(() => {
    let mounted = true;

    async function fetchQtdEstoque() {
      try {
        const url = `${API_URL}/estoqueSomar`;
        const res = await fetchWithAuth(url, { method: 'GET', credentials: 'include', headers: { Accept: 'application/json' } });

        if (!res.ok) {
          const text = await res.text().catch(() => null);
          console.error('[fetchQtdEstoque] server responded with error', { status: res.status, statusText: res.statusText, bodyText: text });
          if (!mounted) return;
          setError(`Erro do servidor: ${res.status} ${res.statusText}`);
          setQtdEstoque([]);
          return;
        }

        const body = await res.json().catch(async () => {
          const t = await res.text().catch(() => null);
          console.warn('[fetchQtdEstoque] resposta não-JSON, texto:', t);
          return null;
        });
        const qtdValue = body?.totalItens ?? body?.data ?? 0;
        const payload = typeof qtdValue === 'number' ? qtdValue : 0;

        if (!mounted) return;
        setQtdEstoque(payload);
      } catch (err) {
        console.error('[fetchQtdEstoque] erro:', err);
        if (mounted) setError(String(err?.message ?? err));
      }
    }

    if (fetchWithAuth) fetchQtdEstoque();
    return () => { mounted = false; };
  }, [fetchWithAuth]);

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 max-w-7xl mx-auto w-full">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Saldo diário</CardDescription>
          {error ? (<CardTitle className="text-2xl font-semibold text-red-600"> Erro ao carregar dados! </CardTitle>
          ) : saldo === 0 ? (
            <CardTitle className="text-2xl font-semibold text-gray-500"> Nenhum saldo verificado! </CardTitle>
          ) : (
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {saldo}
            </CardTitle>
          )}
          <CardAction className="md:hidden"><Badge variant="outline"><IconTrendingUp />+12.5%</Badge></CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">Saldo aumentou em 12,5%<IconTrendingUp className="size-4 " /></div>
          <div className="text-muted-foreground">Bom</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Lucros</CardDescription>
          {error ? (<CardTitle className="text-2xl font-semibold text-red-600"> Erro ao carregar dados! </CardTitle>
          ) : saldoLiq === 0 ? (<CardTitle className="text-2xl font-semibold text-gray-500"> Nenhum lucro verificado! </CardTitle>
          ) : (
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {saldoLiq}
            </CardTitle>
          )}
          <CardAction className="md:hidden"><Badge variant="outline"><IconTrendingDown />-20%</Badge></CardAction>
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
          ) : qtdEstoque === 0 ? (
            <CardTitle className="text-2xl font-semibold text-gray-500"> Nenhum estoque verificado! </CardTitle>
          ) : (
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {qtdEstoque}
            </CardTitle>
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
