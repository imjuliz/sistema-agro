"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Building2, MapPin, Globe, Calendar, MessageSquare, Trash, Store, PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { API_URL } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useRef } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function CompanyHeader({ id, onLogActivity }) {
  const router = useRouter();
  const { fetchWithAuth } = useAuth();

  const [loja, setLoja] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [confirmStep, setConfirmStep] = useState("intro"); // intro | input

  const resolveImageUrl = (url) => {
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url;
    const base = API_URL?.replace(/\/+$/, '') || '';
    const cleaned = String(url).replace(/^\/+/, '');
    return `${base}/${cleaned}`;
  };

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

    function handleUpdated(e) {
      if (!mounted) return;
      const detail = e?.detail;
      const normalized = normalize(detail);
      if (normalized) {
        setLoja(normalized);
        try {
          sessionStorage.setItem(`prefetched_loja_${id}`, JSON.stringify({ unidade: detail }));
        } catch {}
      }
    }

    const eventName = `unidade-updated-${id}`;
    window.addEventListener(eventName, handleUpdated);

    return () => {
      mounted = false;
      window.removeEventListener(eventName, handleUpdated);
    };
  }, [id, fetchWithAuth]);

  const parseErrorResponse = async (res) => {
    try {
      const cloned = res.clone();
      const body = await cloned.json();
      return body;
    } catch {
      try {
        const text = await res.text();
        if (text) return { erro: text };
      } catch {}
    }
    return {};
  };

  const handleDelete = () => {
    if (!id || deleting) return;
    setConfirmText("");
    setConfirmError("");
    setConfirmStep("intro");
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (confirmText !== "Excluir") {
      setConfirmError("Digite exatamente 'Excluir' para confirmar.");
      return;
    }
    setConfirmError("");
    setDeleting(true);
    try {
      const res = await fetchWithAuth(`${API_URL}unidades/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) {
        const body = await parseErrorResponse(res);
        throw new Error(body?.erro || body?.message || body?.detalhes || `Erro HTTP ${res.status}`);
      }
      setConfirmOpen(false);
      router.push("/matriz/unidades/lojas");
    } catch (err) {
      console.error("Erro ao excluir unidade:", err);
      setConfirmError(err.message || "Erro ao excluir unidade.");
    } finally {
      setDeleting(false);
    }
  };

  const handleAvatarClick = () => {
    if (uploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || uploading) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('foto', file);
      const res = await fetchWithAuth(`${API_URL}unidades/${id}/foto`, {
        method: 'POST',
        body: formData,
      });
      let body = null;
      try { body = await res.json(); } catch {}
      if (!res.ok || body?.sucesso === false) {
        const parsed = body ?? await parseErrorResponse(res);
        throw new Error(parsed?.erro || parsed?.message || parsed?.detalhes || `HTTP ${res.status}`);
      }
      const unidadeAtualizada = body?.unidade ?? body;
      // mescla dados parciais retornados (id/nome/imagemUrl) com o raw atual para não perder localização/status/etc.
      const merged = { ...(loja?.raw ?? {}), ...unidadeAtualizada };
      const normalized = normalize(merged);
      if (normalized) setLoja(normalized);
      try {
        sessionStorage.setItem(`prefetched_loja_${id}`, JSON.stringify({ unidade: merged }));
      } catch {}
      try {
        window.dispatchEvent(new CustomEvent(`unidade-updated-${id}`, { detail: merged }));
      } catch {}
    } catch (err) {
      console.error("Erro ao enviar foto da unidade:", err);
      setConfirmError(err.message || "Erro ao enviar foto.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

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
          <div className="relative">
            <Avatar className="size-12">
              {loja?.imagemUrl ? (
                <AvatarImage src={resolveImageUrl(loja.imagemUrl)} alt="Loja" />
              ) : (
                <>
                  <AvatarImage src="/api/placeholder/48/48" alt="Loja" />
                  <AvatarFallback>{(loja?.name ?? "L").slice(0, 2).toUpperCase()}</AvatarFallback>
                </>
              )}
            </Avatar>
            <button
              type="button"
              onClick={handleAvatarClick}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity hover:opacity-100"
              title="Alterar foto da unidade"
            >
              <PenSquare className="w-4 h-4 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

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
            </div>
          </div>

        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-start space-x-3">
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={handleDelete} disabled={deleting}>
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={confirmOpen} onOpenChange={(open) => { setConfirmOpen(open); if (!open) { setConfirmText(""); setConfirmError(""); setConfirmStep("intro"); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir unidade</DialogTitle>
            {confirmStep === "intro" ? (
              <DialogDescription>
                Tem certeza de que deseja excluir a unidade? Essa ação não poderá ser desfeita.
              </DialogDescription>
            ) : (
              <DialogDescription>
                Digite a palavra "Excluir" para prosseguir com a exclusão.
              </DialogDescription>
            )}
          </DialogHeader>
          {confirmStep === "input" && (
            <div className="space-y-2">
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Excluir"
                autoFocus
              />
              {confirmError && <p className="text-sm text-destructive">{confirmError}</p>}
            </div>
          )}
          <DialogFooter className="flex flex-row justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => { setConfirmOpen(false); setConfirmText(""); setConfirmError(""); setConfirmStep("intro"); }}
              disabled={deleting}
            >
              Cancelar
            </Button>
            {confirmStep === "intro" ? (
              <Button
                variant="destructive"
                onClick={() => setConfirmStep("input")}
                disabled={deleting}
              >
                Continuar
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Excluindo..." : "Excluir"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

