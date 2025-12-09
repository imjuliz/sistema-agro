"use client";
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const InventoryContext = createContext();

export function InventoryProvider({ children, initialData = [], useMockIfFail = true, defaultUnidadeId = null }) {
  const { user, fetchWithAuth } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Detectar role do usuário (case-insensitive)
  const userPerfilRaw = user?.perfil ?? null;
  let userPerfilNome = '';
  if (typeof userPerfilRaw === 'string') {
    userPerfilNome = String(userPerfilRaw).toUpperCase();
  } else if (typeof userPerfilRaw === 'object' && userPerfilRaw !== null) {
    userPerfilNome = String(userPerfilRaw.funcao ?? userPerfilRaw.nome ?? '').toUpperCase();
  }

  // Role checks
  const isGerenteMatriz = userPerfilNome === 'GERENTE_MATRIZ';
  const isGerenteFazenda = userPerfilNome === 'GERENTE_FAZENDA';
  const isGerenteLoja = userPerfilNome === 'GERENTE_LOJA';
  const isFuncionarioFazenda = userPerfilNome === 'FUNCIONARIO_FAZENDA';
  const isFuncionarioLoja = userPerfilNome === 'FUNCIONARIO_LOJA';
  
  // Pode ver apenas sua unidade?
  const canOnlySeeOwnUnit = isGerenteLoja || isGerenteFazenda || isFuncionarioLoja || isFuncionarioFazenda;

  const userUnidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;

  const load = useCallback(async ({ unidadeId = null, q = null } = {}) => {
    setLoading(true);
    setError(null);
    try {
      let effectiveUnidadeId = unidadeId;
      if (canOnlySeeOwnUnit) {
        if (!userUnidadeId) {
          console.warn("[Inventory] usuário sem unidadeId — retornando lista vazia (ou use mock)");
          setItems(useMockIfFail ? initialData : []);
          setLoading(false);
          return;
        }
        effectiveUnidadeId = userUnidadeId;
      }

      const params = new URLSearchParams();
      if (effectiveUnidadeId != null) params.set("unidadeId", String(effectiveUnidadeId));
      if (q) params.set("q", q);

      const url = `${API_URL}loja/estoque${params.toString() ? `?${params.toString()}` : ""}`;
      console.debug("[Inventory] carregando estoques →", url, { userId: user?.id, perfilNome: userPerfilNome, isGerenteMatriz, canOnlySeeOwnUnit, userUnidadeId });

      // tenta usar fetchWithAuth (preserva refresh token / cookies)
      let res;
      try {
        res = await fetchWithAuth(url, { method: "GET", credentials: "include" });
      } catch (wrapErr) {
        console.warn("[Inventory] fetchWithAuth falhou, tentando fetch simples:", wrapErr);
        // tentativa direta (útil para depurar se fetchWithAuth não estiver incluindo cookies)
        res = await fetch(url, { method: "GET", credentials: "include" });
      }

      // se não ok, tenta extrair mensagem do corpo
      if (!res.ok) {
        let bodyText = await res.text().catch(() => null);
        try {
          const parsed = bodyText ? JSON.parse(bodyText) : null;
          bodyText = parsed?.mensagem ?? parsed?.erro ?? parsed?.message ?? bodyText;
        } catch (e) { /* ignore */ }
        console.warn("[Inventory] resposta não OK", res.status, bodyText);
        throw new Error(bodyText || `HTTP ${res.status}`);
      }

      const body = await res.json().catch(() => null);
      const lista = Array.isArray(body) ? body : (Array.isArray(body?.estoques) ? body.estoques : (Array.isArray(body?.data) ? body.data : []));
      setItems(lista);
      console.debug("[Inventory] estoques carregados:", lista.length);
    } catch (err) {
      console.error("[Inventory] erro ao carregar estoques:", err);
      setError(String(err?.message ?? err));
      if (useMockIfFail && initialData && initialData.length) setItems(initialData);
      toast({ title: "Erro ao carregar estoques", description: String(err?.message ?? err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth, initialData, canOnlySeeOwnUnit, userUnidadeId, useMockIfFail]);

  useEffect(() => {
    load({ unidadeId: defaultUnidadeId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, defaultUnidadeId]);

  const refresh = useCallback((opts) => load(opts), [load]);

  // update/add/delete remotes (idem ao seu código anterior)...
  async function updateItemRemote(id, updates) {
    setItems(prev => prev.map(it => it.id === id ? { ...it, ...updates, updateDate: new Date().toISOString() } : it));
    try {
      const url = `${API_URL}loja/estoque/${id}`;
      const res = await fetchWithAuth(url, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updates) });
      if (!res.ok) {
        let txt = await res.text().catch(() => null);
        throw new Error(txt || `HTTP ${res.status}`);
      }
      const body = await res.json().catch(() => null);
      const updated = body?.estoque ?? body ?? null;
      if (updated) setItems(prev => prev.map(it => it.id === id ? updated : it));
      return { sucesso: true, updated };
    } catch (err) {
      console.error("updateItemRemote error", err);
      setError(String(err?.message ?? err));
      toast({ title: "Erro ao atualizar item", description: String(err?.message ?? err), variant: "destructive" });
      return { sucesso: false, erro: String(err?.message ?? err) };
    }
  }

  async function addItemRemote(data) {
    try {
      const url = `${API_URL}loja/estoque`;
      const res = await fetchWithAuth(url, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      const novo = body?.estoque ?? body?.novoEstoque ?? null;
      if (novo) setItems(prev => [novo, ...prev]);
      return { sucesso: true, novo };
    } catch (err) {
      console.error("addItemRemote error", err);
      setError(String(err?.message ?? err));
      toast({ title: "Erro ao adicionar item", description: String(err?.message ?? err), variant: "destructive" });
      return { sucesso: false, erro: String(err?.message ?? err) };
    }
  }

  async function deleteItemRemote(id) {
    const before = items;
    setItems(prev => prev.filter(it => it.id !== id));
    try {
      const url = `${API_URL}loja/estoque/${id}`;
      const res = await fetchWithAuth(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { sucesso: true };
    } catch (err) {
      console.error("deleteItemRemote error", err);
      setError(String(err?.message ?? err));
      setItems(before);
      toast({ title: "Erro ao remover item", description: String(err?.message ?? err), variant: "destructive" });
      return { sucesso: false, erro: String(err?.message ?? err) };
    }
  }

  // Atualiza qntdMin de um EstoqueProduto via endpoint dedicado e atualiza a lista local
  async function atualizarMinimumStockRemote(estoqueProdutoId, minimum) {
    try {
      const url = `${API_URL}estoque-produtos/${estoqueProdutoId}/minimum`;
      const res = await fetchWithAuth(url, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ minimumStock: Number(minimum) })
      });

      if (!res.ok) {
        let txt = await res.text().catch(() => null);
        throw new Error(txt || `HTTP ${res.status}`);
      }

      // força recarga dos estoques para refletir a mudança
      await load({ unidadeId: userUnidadeId });
      return { sucesso: true };
    } catch (err) {
      console.error('Erro ao atualizar minimumStock remoto', err);
      setError(String(err?.message ?? err));
      toast({ title: "Erro ao atualizar mínimo", description: String(err?.message ?? err), variant: "destructive" });
      return { sucesso: false, erro: String(err?.message ?? err) };
    }
  }

  // transform helpers...
  // logo após const [items, setItems] = useState(initialData);
  const storeMapping = useMemo(() => {
    // items pode ser um array de "estoques" com .unidade
    const map = {};
    (items || []).forEach(est => {
      const unidade = est?.unidade;
      if (unidade && (unidade.id || unidade.nome)) {
        map[String(unidade.id ?? est.unidadeId)] = unidade.nome ?? `Unidade ${unidade.id ?? est.unidadeId}`;
      }
    });
    return map;
  }, [items]);

  // Substituir getStoreItems original por este:
  const getStoreItems = useCallback((storeFilterName = null) => {
    const storeItems = [];

    // se items já for uma lista de "produtos" no formato antigo (mock), faça fallback:
    const looksLikeProducts = (items || []).length > 0 && !!items[0]?.currentStock;

    if (looksLikeProducts) {
      // legacy / mock format: cada item tem currentStock {AG001: 12,...}
      (items || []).forEach(item => {
        const stockObj = item.currentStock ?? item.qntdPorLoja ?? {};
        Object.entries(stockObj).forEach(([storeCode, stock]) => {
          const storeName = storeMapping[storeCode] ?? storeCode;
          if (!storeFilterName || storeFilterName === "all" || storeName === storeFilterName) {
            storeItems.push({
              id: `${item.id}-${storeCode}`,
              rawItemId: item.id,
              name: item.itemName ?? item.nome ?? item.descricao ?? "—",
              brand: item.brand ?? "—",
              category: item.category ?? "—",
              sku: item.itemCode ?? "—",
              storeCode,
              store: storeName,
              currentStock: Number(stock ?? 0),
              minimumStock: Number(((item.minimumStock && item.minimumStock[storeCode]) ?? (item.minimo && item.minimo[storeCode]) ?? 0)),
              displayStock: Number((item.storeDisplayStock && item.storeDisplayStock[storeCode]) ?? 0),
              price: Number(item.price ?? item.preco ?? 0),
              unidade: item.unidade ?? null
            });
          }
        });
      });

      return storeItems;
    }

    // novo formato: items é array de "estoques" e cada estoque tem estoqueProdutos[]
    (items || []).forEach(estoque => {
      const unidade = estoque?.unidade;
      const storeName = unidade?.nome ?? `Unidade ${estoque.unidadeId ?? estoque.id ?? '—'}`;

      if (!Array.isArray(estoque.estoqueProdutos)) return;

      estoque.estoqueProdutos.forEach(ep => {
  // currentStock / minimumStock: prefer backend-provided qntdAtual / qntdMin, fallback to quantidade/minimo
  const currentStock = Number(ep.qntdAtual ?? ep.quantidade ?? 0);
  const minimumStock = Number(ep.qntdMin ?? ep.minimo ?? ep.minimum ?? estoque.minimo ?? 0);

        // Supplier/Fornecedor origin: prefer normalized fornecedorResolved (backend) first,
        // then explicit fornecedorUnidade / fornecedorExterno, otherwise fallback to current store
        let supplierName = storeName; // fallback: current store
        const fornecedorResolved = ep.fornecedorResolved ?? null;
        if (fornecedorResolved && fornecedorResolved.nome) {
          supplierName = fornecedorResolved.nome;
        } else if (ep.fornecedorUnidade) {
          supplierName = ep.fornecedorUnidade.nome ?? `Unidade ${ep.fornecedorUnidade.id}`;
        } else if (ep.fornecedorExterno) {
          supplierName = ep.fornecedorExterno.nomeEmpresa ?? `Fornecedor ${ep.fornecedorExterno.id}`;
        }

        const item = {
          id: `${ep.id}-${estoque.unidadeId}`,
          rawItemId: ep.id,
          name: ep.nome ?? ep.produto?.nome ?? '—',
          sku: ep.sku ?? ep.produto?.sku ?? '—',
          storeCode: String(estoque.unidadeId ?? estoque.id),
          store: supplierName, // Show supplier/fornecedor origin
          fornecedorResolved: fornecedorResolved,
          fornecedorUnidade: ep.fornecedorUnidade ?? null,
          fornecedorExterno: ep.fornecedorExterno ?? null,
          currentStock,
          minimumStock,
          displayStock: Number(ep.displayStock ?? ep.exposicao ?? 0),
          price: Number(ep.precoUnitario ?? ep.preco ?? ep.price ?? 0),
          unidade: unidade ?? null,
          loteId: ep.loteId ?? null,
          produtoId: ep.produtoId ?? null,
        };

        if (!storeFilterName || storeFilterName === 'all' || supplierName === storeFilterName) {
          storeItems.push(item);
        }
      });
    });

    return storeItems;
  }, [items, storeMapping]);

  // Substituir getBrandItems por este (usa estoqueProdutos quando disponível)
  const getBrandItems = useCallback(() => {
    const brandItems = [];
    // se items for legacy produtos:
    const looksLikeProducts = (items || []).length > 0 && !!items[0]?.currentStock;
    if (looksLikeProducts) {
      const brandCounts = (items || []).reduce((acc, item) => {
        acc[item.brand] = (acc[item.brand] || 0) + 1;
        return acc;
      }, {});
      const totalItems = (items || []).length || 1;
      const brandMarketShares = {};
      Object.entries(brandCounts).forEach(([brand, count]) => {
        brandMarketShares[brand] = Math.round((count / totalItems) * 1000) / 10;
      });

      (items || []).forEach(item => {
        const stockObj = item.currentStock ?? item.qntdPorLoja ?? {};
        Object.entries(stockObj).forEach(([storeCode, stock]) => {
          const storeName = storeMapping[storeCode] ?? storeCode;
          brandItems.push({
            id: `${item.id}-${storeCode}`,
            rawItemId: item.id,
            name: item.itemName ?? item.nome,
            brand: item.brand ?? '—',
            sku: item.itemCode ?? '—',
            storeCode,
            storeName,
            currentStock: Number(stock ?? 0),
            marketShare: brandMarketShares[item.brand] ?? 0,
            price: item.price ?? 0
          });
        });
      });

      return brandItems;
    }

    // novo formato (estoques -> estoqueProdutos)
    const counts = {};
    (items || []).forEach(estoque => {
      (estoque.estoqueProdutos || []).forEach(ep => {
        counts[ep.marca ?? ep.produto?.marca ?? '—'] = (counts[ep.marca ?? ep.produto?.marca ?? '—'] || 0) + 1;
      });
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    const marketShares = {};
    Object.entries(counts).forEach(([brand, cnt]) => marketShares[brand] = Math.round((cnt / total) * 1000) / 10);

    (items || []).forEach(estoque => {
      const storeName = estoque?.unidade?.nome ?? `Unidade ${estoque.unidadeId ?? estoque.id}`;
      (estoque.estoqueProdutos || []).forEach(ep => {
        const brand = ep.marca ?? ep.produto?.marca ?? '—';
        brandItems.push({
          id: `${ep.id}-${estoque.unidadeId}`,
          rawItemId: ep.id,
          name: ep.nome ?? ep.produto?.nome ?? '—',
          brand,
          sku: ep.sku ?? ep.produto?.sku ?? '—',
          storeCode: String(estoque.unidadeId ?? estoque.id),
          storeName,
          currentStock: Number(ep.quantidade ?? ep.qntd ?? 0),
          marketShare: marketShares[brand] ?? 0,
          price: Number(ep.precoUnitario ?? ep.preco ?? 0)
        });
      });
    });

    return brandItems;
  }, [items, storeMapping]);


  return (
    <InventoryContext.Provider value={{
      items,
      loading,
      error,
      refresh,
      atualizarMinimumStockRemote,
      updateItemRemote,
      addItemRemote,
      deleteItemRemote,
      getStoreItems,
      getBrandItems,
      isGerenteMatriz,
      isGerenteFazenda,
      isGerenteLoja,
      isFuncionarioFazenda,
      isFuncionarioLoja,
      canOnlySeeOwnUnit,
      userUnidadeId,
      userPerfilNome,
      storeMapping
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used within InventoryProvider");
  return ctx;
}
