export { default } from "../fornecedores-fazenda/ComplaintSystem";
'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertTriangle, Plus, Eye, MessageSquare, Clock, CheckCircle, XCircle, ArrowUp, FileText, Calendar } from 'lucide-react';

export function ComplaintSystem({ userType }) {
  const [showNewComplaint, setShowNewComplaint] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const complaints = [
    {
      id: 'CMP-001',
      title: 'Late Delivery - Order ORD-001',
      description: 'O pedido foi entregue com 2 horas de atraso, afetando nosso serviço de almoço',
      category: 'entrega',
      priority: 'alta',
      status: 'open',
      submittedBy: userType === 'supplier' ? 'Bella Vista Restaurant' : 'Fresh Valley Farms',
      assignedTo: userType === 'supplier' ? 'Sales Manager' : 'Customer Support',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:20:00Z',
      orderId: 'ORD-001',
      escalated: true,
      responses: [
        {
          id: 1,
          author: 'Sales Rep',
          message: 'Peço desculpas pelo atraso. Houve trânsito inesperado na rota de entrega.',
          timestamp: '2024-01-15T11:00:00Z'
        },
        {
          id: 2,
          author: 'Restaurant Manager',
          message: 'Isso aconteceu duas vezes este mês. Precisamos de uma solução mais confiável.',
          timestamp: '2024-01-15T11:30:00Z'
        }
      ]
    },
    {
      id: 'CMP-002',
      title: 'Product Quality Issue - Damaged Packaging',
      description: 'Vários pacotes de carne foram danificados na entrega, com lacres de vácuo rasgados',
      category: 'qualidade',
      priority: 'normal',
      status: 'in_progress',
      submittedBy: userType === 'supplier' ? 'Grand Hotel Kitchen' : 'Premium Meats Co.',
      assignedTo: userType === 'supplier' ? 'Quality Manager' : 'Customer Support',
      createdAt: '2024-01-14T09:15:00Z',
      updatedAt: '2024-01-15T08:45:00Z',
      orderId: 'ORD-002',
      escalated: false,
      responses: [
        {
          id: 1,
          author: 'Quality Manager',
          message: 'Estamos investigando isso com nossa equipe de embalagens. Fotos seriam úteis.',
          timestamp: '2024-01-14T10:00:00Z'
        }
      ]
    },
    {
      id: 'CMP-003',
      title: 'Billing Discrepancy',
      description: 'O valor da fatura não corresponde ao preço acordado para vegetais orgânicos',
      category: 'cobranca',
      priority: 'baixa',
      status: 'resolved',
      submittedBy: userType === 'supplier' ? 'Metro Bistro' : 'Fresh Valley Farms',
      assignedTo: userType === 'supplier' ? 'Accounts Manager' : 'Billing Department',
      createdAt: '2024-01-12T16:20:00Z',
      updatedAt: '2024-01-13T10:15:00Z',
      orderId: 'ORD-003',
      escalated: false,
      responses: [
        {
          id: 1,
          author: 'Accounts Manager',
          message: 'Você está correto. Houve um erro no preço. Fatura corrigida em anexo.',
          timestamp: '2024-01-13T09:30:00Z'
        }
      ]
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <AlertTriangle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'open': return 'secondary';
      case 'in_progress': return 'default';
      case 'resolved': return 'outline';
      case 'closed': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return 'text-red-600';
      case 'normal': return 'text-yellow-600';
      case 'baixa': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (activeTab === 'all') return true;
    return complaint.status === activeTab;
  });

  const NewComplaintForm = () => (
    <Dialog open={showNewComplaint} onOpenChange={setShowNewComplaint}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Enviar nova reclamação</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título da reclamação</Label>
            <Input id="title" placeholder="Breve descrição do problema" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrega">Problema de entrega</SelectItem>
                  <SelectItem value="qualidade">Qualidade do Produto</SelectItem>
                  <SelectItem value="cobranca">Faturamento/Preços</SelectItem>
                  <SelectItem value="atendimento">Atendimento ao Cliente</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Prioridade</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="orderId">ID do pedido relacionado (opcional)</Label>
            <Input id="orderId" placeholder="ORD-001" />
          </div>

          <div>
            <Label htmlFor="description">Descrição Detalhada</Label>
            <Textarea
              id="description"
              placeholder="Forneça o máximo de detalhes possível sobre o problema..."
              className="min-h-[120px]"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => setShowNewComplaint(false)} variant="outline" className="flex-1">
              Cancelar
            </Button>
            <Button onClick={() => setShowNewComplaint(false)} className="flex-1">
              Enviar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const ComplaintDetails = ({ complaint }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-1" />
          Visualizar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle>{complaint.title}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                ID da Reclamação: {complaint.id}
              </p>
            </div>
            {complaint.escalated && (
              <Badge variant="destructive" className="ml-2">
                <ArrowUp className="h-3 w-3 mr-1" />
                Escalado
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(complaint.status)}
                <Badge variant={getStatusVariant(complaint.status)}>
                  {complaint.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            <div>
              <Label>Prioridade</Label>
              <p className={`mt-1 ${getPriorityColor(complaint.priority)}`}>
                {complaint.priority.toUpperCase()}
              </p>
            </div>
            <div>
              <Label>Categoria</Label>
              <p className="mt-1 capitalize">{complaint.category}</p>
            </div>
            <div>
              <Label>Pedido Relacionado</Label>
              <p className="mt-1">{complaint.orderId || 'N/A'}</p>
            </div>
          </div>

          <div>
            <Label>Descrição</Label>
            <p className="mt-1 p-3 bg-muted rounded-lg">{complaint.description}</p>
          </div>

          <div>
            <Label>Respostas e Atualizações</Label>
            <div className="mt-2 space-y-3">
              {complaint.responses.map((response) => (
                <div key={response.id} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <Avatar className="mt-1">
                      <AvatarFallback>{response.author.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{response.author}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(response.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{response.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="newResponse">Adicionar resposta</Label>
            <Textarea id="newResponse" placeholder="Escreva sua resposta" className="mt-1" />
            <div className="flex gap-2 mt-2">
              <Button size="sm" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Adicionar resposta
              </Button>
              {userType === 'supplier' && !complaint.escalated && (
                <Button size="sm" variant="outline">
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Escalar para Gerente
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3>{userType === 'supplier' ? 'Complaint Management' : 'Support & Complaints'}</h3>
          <p className="text-muted-foreground">
            {userType === 'supplier'
              ? 'Handle customer complaints and feedback'
              : 'Submit and track your complaints and support requests'
            }
          </p>
        </div>
        <Button onClick={() => setShowNewComplaint(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Reclamação
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todas as Reclamações</TabsTrigger>
          <TabsTrigger value="open">Abertas</TabsTrigger>
          <TabsTrigger value="in_progress">Em progresso</TabsTrigger>
          <TabsTrigger value="resolved">Resolvidas</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <Card key={complaint.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-4">
                      <h4>{complaint.title}</h4>
                      <Badge variant={getStatusVariant(complaint.status)} className="flex items-center gap-1">
                        {getStatusIcon(complaint.status)}
                        {complaint.status.replace('_', ' ')}
                      </Badge>
                      <span className={`text-sm ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority} prioridade
                      </span>
                      {complaint.escalated && (
                        <Badge variant="destructive">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          Escalado
                        </Badge>
                      )}
                    </div>

                    <p className="text-muted-foreground">
                      {userType === 'supplier' ? 'Submitted by:' : 'Assigned to:'} {complaint.submittedBy}
                    </p>

                    <p className="text-sm line-clamp-2">{complaint.description}</p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Criado: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Atualizado: {new Date(complaint.updatedAt).toLocaleDateString()}</span>
                      {complaint.orderId && (
                        <>
                          <span>•</span>
                          <span>Ordem: {complaint.orderId}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <ComplaintDetails complaint={complaint} />
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Responder
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredComplaints.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h4>Nenhuma reclamação</h4>
              <p className="text-muted-foreground">
                {activeTab === 'all'
                  ? 'No complaints have been submitted yet'
                  : `No ${activeTab.replace('_', ' ')} complaints found`
                }
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Complaint Management Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4>Fluxo de trabalho de escalonamento</h4>
              <p className="text-sm text-muted-foreground">
                Os representantes de vendas podem encaminhar problemas aos gerentes para resolução complexa</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4>Registro de incidentes</h4>
              <p className="text-sm text-muted-foreground">
                Acompanhamento abrangente de todas as reclamações e suas resoluções
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4>Rastreamento de Resposta</h4>
              <p className="text-sm text-muted-foreground">
                Monitore os tempos de resposta e as métricas de satisfação do cliente
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <NewComplaintForm />
    </div>
  );
}