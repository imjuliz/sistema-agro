'use client'
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StoreLevelView } from '@/components/loja/estoque/StoreLevelView';
import { BrandLevelView } from '@/components/Estoque/BrandLevelView';
import { SetupView } from '@/components/Estoque/SetupView';
import { InventoryProvider } from '@/contexts/InventoryContext';

export default function App() {
    const [activeView, setActiveView] = useState('store');

    return (
        <InventoryProvider>
            <div className="min-h-screen bg-background p-6">
                <div className="max-w-7xl mx-auto">
                    <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
                        <TabsList className="grid w-full grid-cols-1 mb-6 text-md">
                            <TabsTrigger value="store">Estoque</TabsTrigger>
                        </TabsList>
                        <TabsContent value="store"><StoreLevelView /></TabsContent>
                    </Tabs>
                </div>
            </div>
        </InventoryProvider>
    );
}