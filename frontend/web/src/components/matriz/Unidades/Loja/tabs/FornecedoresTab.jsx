"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConsumerDashboard } from '@/components/fornecedores-fazenda/ConsumerDashboard';

export function FornecedoresTab({ loja }){
  return (
    <div className="">
      <main className="">
         <ConsumerDashboard unidadeId={loja?.id} />
      </main>
    </div>
  );
}
