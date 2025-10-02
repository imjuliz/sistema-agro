'use client'
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StoreLevelView } from '@/components/StoreLevelView';
import { BrandLevelView } from '@/components/BrandLevelView';
import { SetupView } from '@/components/SetupView';
import { InventoryProvider } from '@/contexts/InventoryContext';

export default function App() {
  const [activeView, setActiveView] = useState('store');

  return (
    <InventoryProvider>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-medium mb-2">Painel de Gerenciamento de Estoque</h1>
            <p className="text-muted-foreground">Rede de Varejo para Plantio</p>
          </div>

          {/* Legend */}
          <Card className="mb-6 ">
            <CardHeader>
              <CardTitle>Legenda do Status do Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Acima do Mínimo (Stock &gt; Min + 5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span>No Mínimo / Perto do Mínimo (Min - 5 to Min + 5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Abaixo do Mínimo (Stock &lt; Min - 5)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* View Toggle */}
          <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="store">Store Level</TabsTrigger>
              <TabsTrigger value="brand">Brand Level</TabsTrigger>
              <TabsTrigger value="setup">Display Setup</TabsTrigger>
            </TabsList>

            <TabsContent value="store">
              <StoreLevelView />
            </TabsContent>

            <TabsContent value="brand">
              <BrandLevelView />
            </TabsContent>

            <TabsContent value="setup">
              <SetupView />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </InventoryProvider>
  );
}