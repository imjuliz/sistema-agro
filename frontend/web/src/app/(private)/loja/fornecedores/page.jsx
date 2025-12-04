// "use client";

// import React, { useState, useEffect } from "react";
// // Para tradução
// import { useTranslation } from "@/hooks/useTranslation";
// import { Transl } from "@/components/TextoTraduzido/TextoTraduzido";
// //-------
// import { useAuth } from "@/contexts/AuthContext";
// import { API_URL } from "@/lib/api";
// import { usePerfilProtegido } from "@/hooks/usePerfilProtegido";

// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ProductCatalog } from "@/components/fornecedores-fazenda/ProductCatalog";
// // import { OrderManagement } from './OrderManagement';
// import { ChatInterface } from "@/components/fornecedores-fazenda/ChatInterface";
// import { ComplaintSystem } from "@/components/fornecedores-fazenda/ComplaintSystem";
// import { ShoppingCart, MessageSquare, AlertTriangle, Search, TrendingUp, Clock, CheckCircle, FileCheck } from "lucide-react";
// import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
// import { Card, CardContent, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import FornecedoresCard from "@/components/fornecedores-fazenda/fornecedores-card";
// import { OrderManagement } from "@/components/fornecedores-fazenda/OrderManagement";

// export default function ConsumerDashboard() {
//   const { fetchWithAuth, user } = useAuth();
//   usePerfilProtegido("GERENTE_LOJA");

//   const [fornecedores, setFornecedores] = useState([]);
//   const [contratos, setContratos] = useState([]);
//   const [pedidos, setPedidos] = useState([]);
//   const [carregando, setCarregando] = useState(true);

//   useEffect(() => {
//     const carregarDados = async () => {
//       try {
//         setCarregando(true);
//         const unidadeId = user?.unidadeId;

//         if (!unidadeId) {
//           console.error("Unidade não identificada");
//           return;
//         }

//         // Carrega fornecedores internos
//         const resFornecedores = await fetchWithAuth(
//           `${API_URL}listarFornecedoresInternos/${unidadeId}`
//         );
//         if (resFornecedores.ok) {
//           const bodyFornecedores = await resFornecedores.json();
//           setFornecedores(bodyFornecedores.fornecedores || []);
//         }

//         // Carrega contratos (onde a unidade é CONSUMIDOR)
//         let allContratos = [];
//         const resContratos = await fetchWithAuth(
//           `${API_URL}verContratosComFazendas/${unidadeId}`
//         );
//         if (resContratos.ok) {
//           const bodyContratos = await resContratos.json();
//           allContratos = bodyContratos.contratos || [];
//         }

//         // Carrega contratos onde a unidade é FORNECEDORA
//         try {
//           const resContratosFornecedor = await fetchWithAuth(
//             `${API_URL}verContratosComFazendasAsFornecedor/${unidadeId}`
//           );
//           if (resContratosFornecedor.ok) {
//             const bodyContratosFornecedor = await resContratosFornecedor.json();
//             const contratosFornecedor = bodyContratosFornecedor.contratos || [];
//             allContratos = [...allContratos, ...contratosFornecedor];
//           }
//         } catch (e) {
//           console.warn('Erro ao buscar contratos como fornecedor:', e);
//         }

//         setContratos(allContratos);

//         // Carrega pedidos
//         const resPedidos = await fetchWithAuth(
//           `${API_URL}estoque-produtos/pedidos/${unidadeId}`
//         );
//         if (resPedidos.ok) {
//           const bodyPedidos = await resPedidos.json();
//           setPedidos(bodyPedidos.pedidos || []);
//         }
//       } catch (error) {
//         console.error("Erro ao carregar dados:", error);
//       } finally {
//         setCarregando(false);
//       }
//     };

//     if (user?.unidadeId) {
//       carregarDados();
//     }
//   }, [user?.unidadeId, fetchWithAuth]);

//   const totalFornecedores = fornecedores.length;
//   const totalContratos = contratos.length;
//   const pedidosPendentes = pedidos.filter(
//     (p) => p.status === "PENDENTE" || p.status === "EM_TRANSITO"
//   ).length;

//   const StatCard = ({ title, value, icon: Icon, color = "text-muted-foreground" }) => (
//     <Card>
//       <CardContent className="p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-muted-foreground">{title}</p>
//             <p className={`text-2xl ${color}`}>{value}</p>
//           </div>
//           <Icon className={`h-8 w-8 ${color}`} />
//         </div>
//       </CardContent>
//     </Card>
//   );

//   return (
//     <div className="space-y-6 flex flex-col gap-12">
//       {/* cards / kpis / indicadores */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:@xl/main:grid-cols-2 @5xl/main:grid-cols-4 mb-0">
//         <Card className="h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition">
//           <CardHeader>
//             <CardDescription>Contratos Ativos</CardDescription>
//             <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//               {carregando ? "-" : totalContratos}
//             </CardTitle>
//             <CardAction>
//               <FileCheck />
//             </CardAction>
//           </CardHeader>
//         </Card>

//         <Card className="h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition">
//           <CardHeader>
//             <CardDescription>Pedidos pendentes</CardDescription>
//             <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//               {carregando ? "-" : pedidosPendentes}
//             </CardTitle>
//             <CardAction>
//               <Clock />
//             </CardAction>
//           </CardHeader>
//         </Card>

//         <Card className="h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition">
//           <CardHeader>
//             <CardDescription>Fornecedores</CardDescription>
//             <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//               {carregando ? "-" : totalFornecedores}
//             </CardTitle>
//             <CardAction>
//               <CheckCircle />
//             </CardAction>
//           </CardHeader>
//         </Card>
//       </div>

//       {/* card de fornecedores */}
//       <FornecedoresCard fornecedores={fornecedores} contratos={contratos} pedidos={pedidos} carregando={carregando} />
//       {/* produtos */}
//       <ProductCatalog contratos={contratos} carregando={carregando} />
//       {/* gerenciamento de pedidos */}
//       <OrderManagement pedidos={pedidos} carregando={carregando} />
//     </div>
//   );
// }
"use client"
// para tradução
import { useState } from 'react';
import { useTranslation } from "@/hooks/useTranslation";
import { Transl } from '@/components/TextoTraduzido/TextoTraduzido'
// components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { SupplierDashboard } from '@/components/matriz/fornecedores/SupplierDashboard';
import { ConsumerDashboard } from '@/components/fornecedores-loja/ConsumerDashboard';
// icon
import { Store, Building2 } from 'lucide-react';

export default function FornecedoresPage(){
  // Get unidadeId from user context or route params
  const [loja] = useState(null);

  return (
    <div className="">
      <main className="">
         <ConsumerDashboard unidadeId={loja?.id} />
      </main>
    </div>
  );
}