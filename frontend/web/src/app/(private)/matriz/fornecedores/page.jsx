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
import { ConsumerDashboard } from '@/components/matriz/fornecedores/ConsumerDashboard';
// icon
import { Store, Building2 } from 'lucide-react';


export default function Fornecedores(){

  const [currentRole, setCurrentRole] = useState('guest');

  const RoleSelector = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Supplier Consumer Platform (SCP)</CardTitle>
        <p className="text-center text-muted-foreground">
          B2B platform connecting food suppliers with restaurants and hotels
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => setCurrentRole('supplier')}>
            <Store className="h-8 w-8" />
            <div>
              <div>Fornecedor</div>
              <div className="text-sm text-muted-foreground">Gerenciar catálogos e pedidos</div>
            </div>
          </Button>
          
          <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => setCurrentRole('consumer')}>
            <Building2 className="h-8 w-8" />
            <div>
              <div>Consumidor</div>
              <div className="text-sm text-muted-foreground">Navegue e solicite produtos</div>
            </div>
          </Button>
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="mb-2">Recursos do MVP incluídos:</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Gerenciamento de catálogo</Badge>
            <Badge variant="secondary">Ordenar fluxos de trabalho</Badge>
            <Badge variant="secondary">Sistema de bate-papo</Badge>
            <Badge variant="secondary">Tratamento de reclamações</Badge>
            <Badge variant="secondary">Registro de incidentes</Badge>
            <Badge variant="secondary">Acesso baseado em link</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (currentRole === 'guest') {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center"><RoleSelector /></div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1>SCP Dashboard</h1>
            <Badge variant={currentRole === 'supplier' ? 'default' : 'secondary'}>
              {currentRole === 'supplier' ? 'Supplier Portal' : 'Consumer Portal'}
            </Badge>
          </div>
          <Button variant="outline" onClick={() => setCurrentRole('guest')}>
            Switch Role
          </Button>
        </div>
      </header> */}

      <main className="container mx-auto p-6">
        {currentRole === 'consumer' && <ConsumerDashboard />}
      </main>
    </div>
  );
}