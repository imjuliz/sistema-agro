// // "use client"
// // import React, { useState, useEffect  } from 'react';
// // import Link from "next/link";
// // import { useParams } from "next/navigation";
// // import { CompanyHeader } from '@/components/matriz/Unidades/Fazenda/CompanyHeader';
// // import { ActionBar } from '@/components/matriz/Unidades/Fazenda/ActionBar';
// // import { TabNavigation } from '@/components/matriz/Unidades/Fazenda/TabNavigation';
// // import { LeftPanel } from '@/components/matriz/Unidades/Fazenda/LeftPanel';
// // import { CenterPanel } from '@/components/matriz/Unidades/Fazenda/CenterPanel';
// // import { RightPanel } from '@/components/matriz/Unidades/Fazenda/RightPanel';
// // import { AddFazendaModal } from '@/components/matriz/Unidades/Fazenda/AddFazendaModal';
// // import { LogActivityModal } from '@/components/matriz/Unidades/Fazenda/LogActivityModal';
// // import { AddContactModal } from '@/components/matriz/Unidades/Fazenda/AddContactModal';
// // import { usePerfilProtegido } from '@/hooks/usePerfilProtegido';

// // export default function FazendaDetalhe(props) {
// //   usePerfilProtegido("GERENTE_MATRIZ");

// //   // garantir que params seja resolvido (evita o erro)
// //   const params = useParams();
// //   const { id } = params;

// //   const [activeTab, setActiveTab] = useState('overview');
// //   const [showAddJob, setShowAddJob] = useState(false);
// //   const [showLogActivity, setShowLogActivity] = useState(false);
// //   const [showAddContact, setShowAddContact] = useState(false);

// //   return (
// //     <div className="min-h-screen bg-background">
// //       <CompanyHeader onLogActivity={() => setShowLogActivity(true)} />
// //       <ActionBar
// //         onAddJob={() => setShowAddJob(true)}
// //         onLogActivity={() => setShowLogActivity(true)}
// //         onAddContact={() => setShowAddContact(true)}
// //       />
// //       <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

// //       <div className="flex mt-10 gap-6 px-6 pb-6">
// //         {/* <LeftPanel /> */}
// //         <CenterPanel activeTab={activeTab} />
// //         {/* <RightPanel onLogActivity={() => setShowLogActivity(true)} /> */}
// //       </div>

// //       {/* Modals */}
// //       <AddFazendaModal open={showAddJob} onOpenChange={setShowAddJob} />
// //       <LogActivityModal open={showLogActivity} onOpenChange={setShowLogActivity} />
// //       <AddContactModal open={showAddContact} onOpenChange={setShowAddContact} />
// //     </div>
// //   );
// // }
// "use client"
// import React, { useState, useEffect  } from 'react';
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";
// import { CompanyHeader } from '@/components/matriz/Unidades/Fazenda/CompanyHeader';
// import { ActionBar } from '@/components/matriz/Unidades/Fazenda/ActionBar';
// import { TabNavigation } from '@/components/matriz/Unidades/Fazenda/TabNavigation';
// import { LeftPanel } from '@/components/matriz/Unidades/Fazenda/LeftPanel';
// import { CenterPanel } from '@/components/matriz/Unidades/Fazenda/CenterPanel';
// import { RightPanel } from '@/components/matriz/Unidades/Fazenda/RightPanel';
// // import { AddFazendaModal } from '@/components/matriz/Unidades/Fazenda/AddFazendaModal';
// import { LogActivityModal } from '@/components/matriz/Unidades/Fazenda/LogActivityModal';
// import { AddContactModal } from '@/components/matriz/Unidades/Fazenda/AddContactModal';
// import { usePerfilProtegido } from '@/hooks/usePerfilProtegido';
// import { useAuth } from '@/contexts/AuthContext';
// import { API_URL } from '@/lib/api';

// export default function FazendaDetalhe(props) {
//   usePerfilProtegido("GERENTE_MATRIZ");

//   const params = useParams();
//   const router = useRouter();
//   const { id } = params ?? {};
//   const { fetchWithAuth } = useAuth(); // assume sua AuthContext fornece isso

//   const [activeTab, setActiveTab] = useState('overview');
//   const [showAddJob, setShowAddJob] = useState(false);
//   const [showLogActivity, setShowLogActivity] = useState(false);
//   const [showAddContact, setShowAddContact] = useState(false);

//   // dados da fazenda
//   const [fazenda, setFazenda] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let mounted = true;
//     async function loadFazenda() {
//       if (!id) {
//         setError("ID da fazenda não informado.");
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       // 1) tenta pegar do sessionStorage (prefetch)
//       try {
//         const cached = sessionStorage.getItem(`prefetched_fazenda_${id}`);
//         if (cached) {
//           try {
//             const parsed = JSON.parse(cached);
//             // pode ser o objeto body inteiro do endpoint; normalizamos abaixo
//             const unit = parsed?.unidade ?? parsed?.data?.unidade ?? parsed ?? null;
//             if (mounted && unit) setFazenda(unit);
//           } catch (e) {
//             // ignore parse errors
//           }
//         }
//       } catch (e) {
//         // sessionStorage pode falhar em ssr (mas aqui é client), ignore
//       }

//       // 2) buscar do backend (garante dados atualizados)
//       try {
//         const url = `${API_URL}unidades/${id}`;
//         const fetcher = fetchWithAuth ?? (async (u, opts) => fetch(u, opts));
//         const res = await fetcher(url, { method: "GET", credentials: "include" });

//         // se retorna um objeto já (fetchWithAuth customizado), trate como Response
//         if (!res || typeof res.ok === "undefined") {
//           throw new Error("Resposta inválida do fetch.");
//         }

//         if (!res.ok) {
//           // tenta extrair mensagem detalhada
//           let body = null;
//           try { body = await res.json(); } catch(e) { /* noop */ }
//           const msg = body?.erro ?? body?.error ?? body?.message ?? `HTTP ${res.status}`;
//           throw new Error(String(msg));
//         }

//         const body = await res.json().catch(() => null);
//         // normaliza formatos: { unidade }, { data: { unidade } }, ou retorno cru
//         const unit = body?.unidade ?? body?.data?.unidade ?? body ?? null;

//         if (!unit) {
//           throw new Error("Resposta da API sem dados da unidade.");
//         }

//         if (mounted) {
//           setFazenda(unit);
//           // gravar cache para prefetch
//           try { sessionStorage.setItem(`prefetched_fazenda_${id}`, JSON.stringify(body)); } catch(e){/* ignore */ }
//         }
//       } catch (err) {
//         console.error("[FazendaDetalhe] erro ao buscar fazenda:", err);
//         if (mounted) setError(err.message || "Erro ao buscar fazenda.");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     }

//     loadFazenda();
//     return () => { mounted = false; };
//   }, [id, fetchWithAuth]);

//   // Se erro crítico (ex.: ID inválido), sugerimos voltar para lista
//   if (error && error.toLowerCase().includes("id da unidade inválido")) {
//     return (
//       <div className="min-h-screen p-6">
//         <div className="max-w-4xl mx-auto">
//           <h2 className="text-xl font-bold mb-4">ID inválido</h2>
//           <p className="mb-4 text-muted-foreground">O ID da fazenda é inválido ou a rota não está sendo interpretada corretamente pelo backend.</p>
//           <div className="flex gap-2">
//             <button className="btn btn-primary" onClick={() => router.push('/matriz/unidades/fazendas')}>Voltar à lista</button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <CompanyHeader fazenda={fazenda} loading={loading} onLogActivity={() => setShowLogActivity(true)} />
//       <ActionBar
//         onAddJob={() => setShowAddJob(true)}
//         onLogActivity={() => setShowLogActivity(true)}
//         onAddContact={() => setShowAddContact(true)}
//         fazenda={fazenda}
//       />
//       <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

//       <div className="flex mt-10 gap-6 px-6 pb-6">
//         {/* LeftPanel / CenterPanel / RightPanel recebem o objeto fazenda */}
//         {/* <LeftPanel fazenda={fazenda} loading={loading} /> */}
//         <CenterPanel activeTab={activeTab} fazenda={fazenda} loading={loading} />
//         {/* <RightPanel onLogActivity={() => setShowLogActivity(true)} fazenda={fazenda} loading={loading} /> */}
//       </div>

//       {/* Modals */}
//       {/* <AddFazendaModal open={showAddJob} onOpenChange={setShowAddJob} /> */}
//       <LogActivityModal open={showLogActivity} onOpenChange={setShowLogActivity} />
//       <AddContactModal open={showAddContact} onOpenChange={setShowAddContact} />
//     </div>
//   );
// }

import FazendaDetalheClient from "./FazendaDetalheClient";

export default function FazendaDetalhePage({ params }) {
  const { id } = params;

  return <FazendaDetalheClient id={id} />;
}
