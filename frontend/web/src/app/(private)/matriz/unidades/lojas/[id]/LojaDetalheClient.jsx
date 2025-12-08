"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CompanyHeader } from "@/components/matriz/Unidades/Loja/CompanyHeader";
import { ActionBar } from "@/components/matriz/Unidades/Loja/ActionBar";
import { TabNavigation } from "@/components/matriz/Unidades/Loja/TabNavigation";
import { CenterPanel } from "@/components/matriz/Unidades/Loja/CenterPanel";
import { LogActivityModal } from "@/components/matriz/Unidades/Loja/LogActivityModal";
import { AddContactModal } from "@/components/matriz/Unidades/Loja/AddContactModal";
import { usePerfilProtegido } from "@/hooks/usePerfilProtegido";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";

export default function LojaDetalheClient({ id }) {
  usePerfilProtegido("GERENTE_MATRIZ");

  const router = useRouter();
  const { fetchWithAuth } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [showLogActivity, setShowLogActivity] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);

  const [loja, setLoja] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadLoja() {
      if (!id) {
        setError("ID da loja não informado.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const cached = sessionStorage.getItem(`prefetched_loja_${id}`);
        if (cached) {
          const data = JSON.parse(cached);
          const unidade = data?.unidade ?? data;
          if (mounted && unidade) setLoja(unidade);
        }
      } catch {}

      try {
        const url = `${API_URL}unidades/${id}`;
        const res = await fetchWithAuth(url);

        if (!res.ok) {
          let body = null;
          try { body = await res.json(); } catch {}
          const mensagem = body?.erro ?? body?.error ?? body?.message ?? `Erro HTTP ${res.status}`;
          throw new Error(mensagem);
        }

        const body = await res.json();
        const unidade = body?.unidade ?? body;
        if (!unidade) throw new Error("Resposta inválida da API.");

        if (mounted) {
          setLoja(unidade);
          sessionStorage.setItem(`prefetched_loja_${id}`, JSON.stringify(body));
        }
      } catch (err) {
        console.error("[LojaDetalheClient] erro:", err);
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadLoja();
    return () => { mounted = false; };
  }, [id, fetchWithAuth]);

  if (error && error.toLowerCase().includes("inválid")) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">ID inválido</h2>
        <p className="mb-4 text-muted-foreground">
          O ID da loja é inválido ou não existe.
        </p>

        <button
          className="btn btn-primary"
          onClick={() => router.push("/matriz/unidades/lojas")}
        >
          Voltar à lista
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CompanyHeader
        id={id}
        onLogActivity={() => setShowLogActivity(true)}
      />

      <ActionBar
        loja={loja}
        onAddContact={() => setShowAddContact(true)}
        onLogActivity={() => setShowLogActivity(true)}
      />

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex mt-10 gap-6 px-6 pb-6">
        <CenterPanel
          activeTab={activeTab}
          loja={loja}
          loading={loading}
        />
      </div>

      <LogActivityModal
        open={showLogActivity}
        onOpenChange={setShowLogActivity}
      />

      <AddContactModal
        open={showAddContact}
        onOpenChange={setShowAddContact}
      />
    </div>
  );
}

