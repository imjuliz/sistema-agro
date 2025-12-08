// // app/(private)/matriz/unidades/fazendas/[id]/page.jsx
// import React from "react";
// import Link from "next/link";

// export default async function FazendaDetalhe(props) {
//   // garantir que params seja resolvido (evita o erro)
//   const params = await props.params;
//   const { id } = params;

//   // dados fake por enquanto
//   const fakeData = {
//     name: `Fazenda ${id}`,
//     location: "Campinas, SP",
//     area: 150,
//     iotHealth: 82,
//     manager: "Ana Souza",
//     sync: new Date().toISOString(),
//   };

//   return (
//     <div className="min-h-screen p-6 bg-surface-50">
//       <div className="max-w-screen-md mx-auto">
//         <h1 className="text-3xl font-bold mb-2">{fakeData.name}</h1>
//         <p className="text-sm text-muted-foreground mb-6">{fakeData.location}</p>

//         <div className="space-y-3">
//           <div><strong>ID:</strong> {id}</div>
//           <div><strong>Responsável:</strong> {fakeData.manager}</div>
//           <div><strong>Área:</strong> {fakeData.area} ha</div>
//           <div><strong>Saúde IoT:</strong> {fakeData.iotHealth}%</div>
//           <div><strong>Última sync:</strong> {new Date(fakeData.sync).toLocaleString()}</div>
//         </div>

//         <div className="mt-8">
//           {/* Link em vez de onClick para evitar event handler num Server Component */}
//           <Link href="/matriz/unidades/fazendas" className="px-4 py-2 rounded bg-neutral-800 text-white hover:bg-neutral-700">
//             Voltar
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

import LojaDetalheClient from "./LojaDetalheClient";

export default async function LojaDetalhePage({ params }) {
  const { id } = await params;
  return <LojaDetalheClient id={id} />;
}