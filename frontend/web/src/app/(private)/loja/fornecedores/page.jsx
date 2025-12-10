
"use client"
// para tradução
import { useState } from 'react';
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
    <div className="min-h-screen px-18 py-10 bg-surface-50">
      <main className="">
         <ConsumerDashboard unidadeId={loja?.id} />
      </main>
    </div>
  );
}