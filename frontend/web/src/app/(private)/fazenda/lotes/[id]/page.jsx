"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, MoreHorizontal, ArrowLeft } from 'lucide-react';

export default function LoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchWithAuth } = useAuth();
  const loteId = params.id;

  const [loading, setLoading] = useState(true);
  const [itens, setItens] = useState([]);
  const [lote, setLote] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fetchWithAuth || !loteId) return;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Carregar dados do lote
        const loteRes = await fetchWithAuth(`${API_URL}lotes/${loteId}`);
        const loteData = await loteRes.json().catch(() => ({}));

        if (!loteRes.ok) {
          setError("Erro ao carregar lote");
          setLoading(false);
          return;
        }

        const loteObj = loteData.lote || loteData;
        setLote(loteObj);

        // Extrair itens do campo itensEsperados
        if (loteObj.itensEsperados && Array.isArray(loteObj.itensEsperados)) {
          setItens(loteObj.itensEsperados);
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar dados do lote");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [fetchWithAuth, loteId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-red-600">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (itens.length === 0) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">Nenhum item neste lote</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para {lote?.nome}
        </Button>
      </div>

      {itens.map((item, idx) => (
        <Card key={idx}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{item.nome}</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">ID do Item: {item.itemId}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="size-4 mr-2" />
                  Ver mais
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="size-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">Quantidade</p>
                <p className="text-2xl font-semibold">{item.quantidade}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Unidade</p>
                <Badge variant="outline" className="text-base">{item.unidadeMedida}</Badge>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Preço Unitário</p>
                <p className="text-2xl font-semibold">R$ {Number(item.precoUnitario || 0).toFixed(2)}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Valor Total</p>
                <p className="text-2xl font-semibold">
                  R$ {(item.quantidade * (item.precoUnitario || 0)).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Etapas de produção */}
            {item.etapasProducao && item.etapasProducao.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-4">Etapas de Produção</h4>
                <div className="space-y-4">
                  {item.etapasProducao.map((etapa, eIdx) => (
                    <div key={eIdx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{etapa.nome}</p>
                        {etapa.duracao && (
                          <span className="text-sm text-muted-foreground">{etapa.duracao} dias</span>
                        )}
                      </div>
                      {etapa.descricao && (
                        <p className="text-sm text-muted-foreground">{etapa.descricao}</p>
                      )}
                      <Progress value={0} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}