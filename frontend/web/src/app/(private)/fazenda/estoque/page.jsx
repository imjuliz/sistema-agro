'use client'
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StoreLevelView } from '@/components/Estoque/StoreLevelView';
import { InventoryProvider } from '@/contexts/InventoryContext';
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";
import { usePerfilProtegido } from '@/hooks/usePerfilProtegido';
import {ArrowLeftRight } from 'lucide-react';

export default function estoqueFazenda() {
  const { fetchWithAuth } = useAuth();
  usePerfilProtegido("GERENTE_FAZENDA");

  const [activeView, setActiveView] = useState('store');

  return (
 <div className="flex gap-6">

      <div className="w-80 space-y-6">
        {/* Company Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Legenda do Status do Estoque</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <div>
                <div className="text-sm font-medium">Acima do Mínimo</div>
                <div className="text-sm text-muted-foreground">(Estoque &gt; Min + 5)</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <div>
                <div className="text-sm font-medium">No Mínimo / Perto do Mínimo</div>
                <div className="text-sm text-muted-foreground">(Min - 5 a Min + 5)</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <div>
                <div className="text-sm font-medium">Abaixo do Mínimo</div>
                <div className="text-sm text-muted-foreground">(Estoque &lt; Min - 5)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <Button variant="" size="sm" className="w-full mb-2">
            <ArrowLeftRight className="mr-2" />
            Registrar movimentação de estoque 
          </Button>
        </div>
      </div>
      <div className=" flex-1 min-w-0 space-y-6">
      <InventoryProvider defaultUnidadeId={fazenda?.id}>
          <StoreLevelView />
        </InventoryProvider>

      </div>
    </div>
  );
}