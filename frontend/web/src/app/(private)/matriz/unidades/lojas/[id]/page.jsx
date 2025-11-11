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

"use client"
import React, { useState } from 'react';
import Link from "next/link";
import { useParams } from "next/navigation";
import { CompanyHeader } from '@/components/matriz/Unidades/Fazenda/CompanyHeader';
import { ActionBar } from '@/components/matriz/Unidades/Fazenda/ActionBar';
import { TabNavigation } from '@/components/matriz/Unidades/Fazenda/TabNavigation';
import { LeftPanel } from '@/components/matriz/Unidades/Fazenda/LeftPanel';
import { CenterPanel } from '@/components/matriz/Unidades/Fazenda/CenterPanel';
import { RightPanel } from '@/components/matriz/Unidades/Fazenda/RightPanel';
import { AddJobModal } from '@/components/matriz/Unidades/Fazenda/AddJobModal';
import { LogActivityModal } from '@/components/matriz/Unidades/Fazenda/LogActivityModal';
import { AddContactModal } from '@/components/matriz/Unidades/Fazenda/AddContactModal';

export default function FazendaDetalhe(props) {
  // garantir que params seja resolvido (evita o erro)
   const params = useParams();
  const { id } = params;

  const [activeTab, setActiveTab] = useState('overview');
  const [showAddJob, setShowAddJob] = useState(false);
  const [showLogActivity, setShowLogActivity] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <CompanyHeader onLogActivity={() => setShowLogActivity(true)}/>
      <ActionBar 
        onAddJob={() => setShowAddJob(true)}
        onLogActivity={() => setShowLogActivity(true)}
        onAddContact={() => setShowAddContact(true)}
      />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex mt-10 gap-6 px-6 pb-6">
        {/* <LeftPanel /> */}
        <CenterPanel activeTab={activeTab} />
        {/* <RightPanel onLogActivity={() => setShowLogActivity(true)} /> */}
      </div>

      {/* Modals */}
      <AddJobModal open={showAddJob} onOpenChange={setShowAddJob} />
      <LogActivityModal open={showLogActivity} onOpenChange={setShowLogActivity} />
      <AddContactModal open={showAddContact} onOpenChange={setShowAddContact} />
    </div>
  );
}