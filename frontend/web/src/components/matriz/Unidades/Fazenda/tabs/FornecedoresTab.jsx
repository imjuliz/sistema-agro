// // Gestão de Fornecedores, Insumos e Ativos: Organizar toda a base de recursos do negócio.
// // layout: Fornecedores -> Cadastro de fornecedores (nome, contato, tipo de insumo fornecido). Histórico de compras. Insumos -> Tabela com insumos (sementes, adubos, rações, agrotóxicos). Estoque consolidado. Alertas de vencimento. Ativos -> Cadastro de máquinas e animais. Para animais: ficha veterinária individual. Para máquinas: controle de manutenção.

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
import { ConsumerDashboard } from '@/components/fornecedores-fazenda/ConsumerDashboard';
// icon
import { Store, Building2 } from 'lucide-react';

export function FornecedoresTab({ fazenda }){

  return (
    <div className="">
      <main className="">
         <ConsumerDashboard unidadeId={fazenda?.id} />
      </main>
    </div>
  );
}