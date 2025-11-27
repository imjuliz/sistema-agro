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
import { usePerfilProtegido } from '@/hooks/usePerfilProtegido';

export default function FazendaDetalhe(props) {
  usePerfilProtegido("GERENTE_MATRIZ");

  // garantir que params seja resolvido (evita o erro)
  const params = useParams();
  const { id } = params;

  const [activeTab, setActiveTab] = useState('overview');
  const [showAddJob, setShowAddJob] = useState(false);
  const [showLogActivity, setShowLogActivity] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <CompanyHeader onLogActivity={() => setShowLogActivity(true)} />
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