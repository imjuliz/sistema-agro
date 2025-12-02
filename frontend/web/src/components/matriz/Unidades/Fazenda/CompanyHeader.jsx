// "use client";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";
// import { Badge } from '@/components/ui/badge';
// import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
// import { Building2, MapPin, Globe, Calendar, MessageSquare, Edit3 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Skeleton } from '@/components/ui/skeleton';
// import { API_URL } from '@/lib/api';
// import { useAuth } from '@/contexts/AuthContext';

// // CompanyHeader: overview dinâmico de uma única unidade (fazenda)
// // Props:
// // - id (opcional) : id da unidade; se não passado, pega de useParams()
// // - onLogActivity (opcional) : callback acionado ao clicar em "Reunião"
// export function CompanyHeader({ id: propId, onLogActivity }) {
//   const params = useParams?.() ?? {};
//   const router = useRouter();
//   const id = propId ?? params?.id;

//   const { fetchWithAuth } = useAuth();

//   const [fazenda, setFazenda] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // normalizer local
//   function normalize(u) {
//     if (!u) return null;
//     const nome = u.nome ?? u.name ?? `Unidade ${u.id ?? ""}`;
//     const cidade = u.cidade ?? null;
//     const estado = u.estado ?? null;
//     const location = (cidade ? `${cidade}${estado ? ', ' + estado : ''}` : (u.location ?? ""));
//     const manager = u.gerente?.nome ?? u.gerente ?? u.manager ?? "—";
//     const statusRaw = String(u.status ?? "").trim();
//     const status = statusRaw.length === 0 ? "ATIVA" : statusRaw.toUpperCase();
//     const latitude = u.latitude != null ? Number(u.latitude)
//       : (u.lat != null ? Number(u.lat)
//       : (u.coordenadas ? Number(String(u.coordenadas).split(',')[0]) : null));
//     const longitude = u.longitude != null ? Number(u.longitude)
//       : (u.lng != null ? Number(u.lng)
//       : (u.coordenadas ? Number(String(u.coordenadas).split(',')[1]) : null));
//     const areaHa = u.areaProdutiva ? Number(u.areaProdutiva) : (u.areaHa ?? null);
//     const site = u.site ?? u.website ?? u.url ?? null;
//     return {
//       id: Number(u.id),
//       name: nome,
//       cidade,
//       estado,
//       location,
//       manager,
//       status,
//       latitude,
//       longitude,
//       areaHa,
//       site,
//       raw: u
//     };
//   }

//   useEffect(() => {
//     let mounted = true;
//     if (!id) {
//       setLoading(false);
//       setError("ID não informado");
//       return;
//     }

//     async function load() {
//       setLoading(true);
//       setError(null);

//       // 1) tentar sessionStorage (prefetch)
//       try {
//         const cached = sessionStorage.getItem(`prefetched_fazenda_${id}`);
//         if (cached) {
//           const parsed = JSON.parse(cached);
//           const u = parsed?.unidade ?? parsed;
//           if (mounted) {
//             setFazenda(normalize(u));
//             setLoading(false);
//             // continua e atualiza em background para garantir frescor
//             refreshInBackground(id);
//             return;
//           }
//         }
//       } catch (e) {
//         // ignore parse errors
//       }

//       // 2) fetch direto
//       try {
//         const url = `${API_URL}matriz/unidades/${id}`;
//         const res = await fetchWithAuth(url, { method: "GET", credentials: "include" });
//         if (res.status === 404) {
//           if (mounted) {
//             setError("Unidade não encontrada");
//             setFazenda(null);
//             setLoading(false);
//           }
//           return;
//         }
//         const body = await res.json().catch(() => null);
//         const u = (body?.unidade ?? body ?? null);
//         if (mounted) {
//           if (!u) {
//             setError("Resposta inválida do servidor");
//             setFazenda(null);
//           } else {
//             setFazenda(normalize(u));
//             try { sessionStorage.setItem(`prefetched_fazenda_${id}`, JSON.stringify(body)); } catch(e) {}
//           }
//         }
//       } catch (err) {
//         console.error("CompanyHeader - fetch error", err);
//         if (mounted) {
//           setError("Erro ao carregar unidade");
//           setFazenda(null);
//         }
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     }

//     async function refreshInBackground(id) {
//       try {
//         const url = `${API_URL}matriz/unidades/${id}`;
//         const res = await fetchWithAuth(url, { method: "GET", credentials: "include" });
//         if (!res.ok) return;
//         const body = await res.json().catch(() => null);
//         if (!body) return;
//         try { sessionStorage.setItem(`prefetched_fazenda_${id}`, JSON.stringify(body)); } catch (e) {}
//         // opcional: atualizar estado se quiser forçar frescor:
//         // const u = body?.unidade ?? body;
//         // setFazenda(normalize(u));
//       } catch(e) { /* swallow */ }
//     }

//     load();
//     return () => { mounted = false; };
//   }, [id, fetchWithAuth]);

//   function abrirNoMaps() {
//     if (!fazenda?.latitude || !fazenda?.longitude) return;
//     const url = `https://www.google.com/maps/search/?api=1&query=${fazenda.latitude},${fazenda.longitude}`;
//     window.open(url, "_blank");
//   }

//   if (loading) {
//     // skeleton header
//     return (
//       <div className="bg-card">
//         <div className="flex flex-wrap gap-7 items-center border-b px-6 py-4 justify-between">
//           <div className="flex items-center gap-4">
//             <Skeleton className="w-12 h-12 rounded-full" />
//             <div className="space-y-2">
//               <Skeleton className="h-6 w-56" />
//               <div className="flex gap-3">
//                 <Skeleton className="h-4 w-32" />
//                 <Skeleton className="h-4 w-32" />
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center gap-4">
//             <Skeleton className="h-8 w-24" />
//             <Skeleton className="h-8 w-24" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-card">
//         <div className="px-6 py-4 text-sm text-destructive">Erro: {error}</div>
//       </div>
//     );
//   }
//   return (
//     <div className="bg-card  ">
//       <div className="flex flex-wrap gap-7 items-center border-b px-6 py-4 justify-between">
//         {/* Company Info */}
//         <div className="flex items-center gap-4">
//           <Avatar className="size-12">
//             <AvatarImage src="/api/placeholder/48/48" alt="TechCorp Solutions" />
//             <AvatarFallback>{(fazenda?.name ?? "F").slice(0,2).toUpperCase()}</AvatarFallback>
//           </Avatar>

//           <div>
//             <div className="flex items-center gap-3">
//               <h1 className="text-xl font-medium">{fazenda?.name}</h1>
//               <Badge variant={fazenda?.status === 'ATIVA' ? 'secondary' : 'destructive'} className={fazenda?.status === 'ATIVA' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
//                 {String(fazenda?.status ?? 'ATIVA')}
//               </Badge>
//             </div>
//             <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
//               <div className="flex items-center gap-1">
//                 <Building2 className="size-4" />
//                 <span>Fazenda</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <MapPin className="size-4" />
//                 <span>{fazenda?.location ?? "N/I"}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Quick Metrics */}
//         <div className="flex items-center gap-8">
//           <div className="flex items-start space-x-3">
//             {/* Primary Actions */}
//             <div className="flex space-x-2">
//               {/* <Button variant="outline" size="sm" className="flex items-center space-x-1">
//                 <Phone className="w-4 h-4" />
//                 <span>Call Log</span>
//               </Button> */}
//               <Button variant="outline" size="sm" className="flex items-center space-x-1">
//                 <MessageSquare className="w-4 h-4" />
//                 <span>Comunicado</span>
//               </Button>
//               <Button variant="outline" size="sm" className="flex items-center space-x-1" onClick={onLogActivity}>
//                 <Calendar className="w-4 h-4" />
//                 Reunião
//               </Button>

//             </div>

//             {/* Secondary Actions */}
//             <div className="flex space-x-2">
//               {/* <Button variant="ghost" size="sm">
//                 <Star className="w-4 h-4" />
//               </Button> */}
//               <Button variant="ghost" size="sm">
//                 <Edit3 className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>


//     </div>
//   );
// }

"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Building2, MapPin, Globe, Calendar, MessageSquare, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { API_URL } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

// Agora o componente NÃO usa mais useParams()
// Ele depende EXCLUSIVAMENTE da prop id
export function CompanyHeader({ id, onLogActivity }) {
  const router = useRouter();
  const { fetchWithAuth } = useAuth();

  const [fazenda, setFazenda] = useState(null);
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
    const areaHa = u.areaProdutiva ? Number(u.areaProdutiva) : (u.areaHa ?? null);
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
      areaHa,
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
        const cached = sessionStorage.getItem(`prefetched_fazenda_${id}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          const u = parsed?.unidade ?? parsed;
          if (mounted) {
            setFazenda(normalize(u));
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
            setFazenda(null);
            setLoading(false);
          }
          return;
        }

        const body = await res.json().catch(() => null);
        const u = (body?.unidade ?? body ?? null);

        if (mounted) {
          if (!u) {
            setError("Resposta inválida do servidor");
            setFazenda(null);
          } else {
            setFazenda(normalize(u));
            try {
              sessionStorage.setItem(`prefetched_fazenda_${id}`, JSON.stringify(body));
            } catch {}
          }
        }
      } catch (err) {
        console.error("CompanyHeader - fetch error", err);
        if (mounted) {
          setError("Erro ao carregar unidade");
          setFazenda(null);
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
        try { sessionStorage.setItem(`prefetched_fazenda_${id}`, JSON.stringify(body)); } catch {}
      } catch {}
    }

    load();
    return () => { mounted = false; };
  }, [id, fetchWithAuth]);

  // ---------------------------------------------------------
  // UI abaixo (NÃO alterei, apenas removi o useParams)
  // ---------------------------------------------------------

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
            <AvatarImage src="/api/placeholder/48/48" alt="Empresa" />
            <AvatarFallback>{(fazenda?.name ?? "F").slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-medium">{fazenda?.name}</h1>
              <Badge
                variant={fazenda?.status === "ATIVA" ? "secondary" : "destructive"}
                className={fazenda?.status === "ATIVA" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
              >
                {String(fazenda?.status ?? "ATIVA")}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <Building2 className="size-4" />
                <span>Fazenda</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="size-4" />
                <span>{fazenda?.location ?? "N/I"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-8">
          <div className="flex items-start space-x-3">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4" />
                <span>Comunicado</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
                onClick={onLogActivity}
              >
                <Calendar className="w-4 h-4" />
                Reunião
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
