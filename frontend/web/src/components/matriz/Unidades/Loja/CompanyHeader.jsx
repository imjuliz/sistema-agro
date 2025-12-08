"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Building2, MapPin, Globe, Calendar, MessageSquare, Edit3, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { API_URL } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export function CompanyHeader({ id, onLogActivity }) {
  const router = useRouter();
  const { fetchWithAuth } = useAuth();

  const [loja, setLoja] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // normalizer local
  function normalize(u) {
    if (!u) return null;
    const nome = u.nome ?? u.name ?? `Unidade ${u.id ?? ""}`;
    const cidade = u.cidade ?? null;
    const estado = u.estado ?? null;
    const location = (cidade ? `${cidade}${estado ? ', ' + estado : ''}` : (u.location ?? ""));
    const manager = u.gerente?.nome ?? u.gerente ?? u.manager ?? "—";
    const statusRaw = String(u.status ?? "").trim();
    const status = statusRaw.length === 0 ? "ATIVA" : statusRaw.toUpperCase();
    const latitude = u.latitude != null ? Number(u.latitude)
      : (u.lat != null ? Number(u.lat)
      : (u.coordenadas ? Number(String(u.coordenadas).split(',')[0]) : null));
    const longitude = u.longitude != null ? Number(u.longitude)
      : (u.lng != null ? Number(u.lng)
      : (u.coordenadas ? Number(String(u.coordenadas).split(',')[1]) : null));
    const horarioAbertura = u.horarioAbertura ?? null;
    const horarioFechamento = u.horarioFechamento ?? null;
    const site = u.site ?? u.website ?? u.url ?? null;
    return {
      id: Number(u.id),
      name: nome,
      cidade,
      estado,
      location,
      manager,
      status,
      latitude,
      longitude,
      horarioAbertura,
      horarioFechamento,
      site,
      raw: u
    };
  }

  useEffect(() => {
    let mounted = true;

    if (!id) {
      setLoading(false);
      setError("ID não informado");
      return;
    }

    async function load() {
      setLoading(true);
      setError(null);

      // 1) Tenta sessionStorage
      try {
        const cached = sessionStorage.getItem(`prefetched_loja_${id}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          const u = parsed?.unidade ?? parsed;
          if (mounted) {
            setLoja(normalize(u));
            setLoading(false);
            refreshInBackground(id);
            return;
          }
        }
      } catch {}

      // 2) Fetch direto
      try {
        const url = `${API_URL}unidades/${id}`;
        const res = await fetchWithAuth(url, { method: "GET", credentials: "include" });

        if (res.status === 404) {
          if (mounted) {
            setError("Unidade não encontrada");
            setLoja(null);
            setLoading(false);
          }
          return;
        }

        const body = await res.json().catch(() => null);
        const u = (body?.unidade ?? body ?? null);

        if (mounted) {
          if (!u) {
            setError("Resposta inválida do servidor");
            setLoja(null);
          } else {
            setLoja(normalize(u));
            try {
              sessionStorage.setItem(`prefetched_loja_${id}`, JSON.stringify(body));
            } catch {}
          }
        }
      } catch (err) {
        console.error("CompanyHeader - fetch error", err);
        if (mounted) {
          setError("Erro ao carregar unidade");
          setLoja(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    async function refreshInBackground(id) {
      try {
        const url = `${API_URL}unidades/${id}`;
        const res = await fetchWithAuth(url, { method: "GET", credentials: "include" });
        if (!res.ok) return;
        const body = await res.json().catch(() => null);
        if (!body) return;
        try { sessionStorage.setItem(`prefetched_loja_${id}`, JSON.stringify(body)); } catch {}
      } catch {}
    }

    load();
    return () => { mounted = false; };
  }, [id, fetchWithAuth]);

  if (loading) {
    return (
      <div className="bg-card">
        <div className="flex flex-wrap gap-7 items-center border-b px-6 py-4 justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-56" />
              <div className="flex gap-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card">
        <div className="px-6 py-4 text-sm text-destructive">Erro: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-card">
      <div className="flex flex-wrap gap-7 items-center border-b px-6 py-4 justify-between">
        {/* Company Info */}
        <div className="flex items-center gap-4">
          <Avatar className="size-12">
            <AvatarImage src="/api/placeholder/48/48" alt="Loja" />
            <AvatarFallback>{(loja?.name ?? "L").slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-medium">{loja?.name}</h1>
              <Badge
                variant={loja?.status === "ATIVA" ? "secondary" : "destructive"}
                className={loja?.status === "ATIVA" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
              >
                {String(loja?.status ?? "ATIVA")}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <Store className="size-4" />
                <span>Loja</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="size-4" />
                <span>{loja?.location ?? "N/I"}</span>
              </div>
              {loja?.horarioAbertura && loja?.horarioFechamento && (
                <div className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  <span>{loja.horarioAbertura} - {loja.horarioFechamento}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

