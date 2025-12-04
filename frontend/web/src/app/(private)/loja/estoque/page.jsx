// 'use client'
// import { useState } from 'react';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { StoreLevelView } from '@/components/Estoque/StoreLevelView';
// import { InventoryProvider } from '@/contexts/InventoryContext';
// import { useAuth } from "@/contexts/AuthContext";
// import { API_URL } from "@/lib/api";
// import { useInventory } from '@/contexts/InventoryContext';
// import { Button } from '@/components/ui/button';
// import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
// import { Label } from "@/components/ui/label"
// import { Textarea } from '@/components/ui/textarea'
// import { usePerfilProtegido } from '@/hooks/usePerfilProtegido';
// import { ArrowLeftRight } from 'lucide-react';
// import { Input } from '@/components/ui/input';

// export default function estoqueLoja({ loja }) {
//   // Apenas GERENTE_LOJA e FUNCIONARIO_LOJA podem acessar estoque da loja
//   usePerfilProtegido(["GERENTE_LOJA", "FUNCIONARIO_LOJA"]);
//   const PageContent = ({ loja }) => {
//     const { refresh } = useInventory();
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [modalItem, setModalItem] = useState(null);
//     const [movimentoTipo, setMovimentoTipo] = useState('ENTRADA');
//     const [movimentoQuantidade, setMovimentoQuantidade] = useState('');
//     const [movimentoObs, setMovimentoObs] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const { fetchWithAuth } = useAuth();

//     function openMovimentoModal(item) {
//       setModalItem(item);
//       setMovimentoTipo('ENTRADA');
//       setMovimentoQuantidade('');
//       setMovimentoObs('');
//       setIsModalOpen(true);
//     }

//     function closeMovimentoModal() {
//       setIsModalOpen(false);
//       setModalItem(null);
//     }

//     async function submitMovimento() {
//       if (!modalItem) return;
//       const quantidade = Number(movimentoQuantidade);
//       if (isNaN(quantidade) || quantidade <= 0) {
//         alert('Informe uma quantidade válida maior que zero.');
//         return;
//       }

//       setIsSubmitting(true);
//       try {
//         const body = {
//           estoqueProdutoId: modalItem.rawItemId ?? modalItem.rawItemId,
//           tipoMovimento: movimentoTipo,
//           quantidade,
//           observacoes: movimentoObs || undefined
//         };

//         const url = `${API_URL}estoque/movimento`;
//         let res;
//         try {
//           res = await fetchWithAuth(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
//         } catch (e) {
//           res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
//         }

//         if (!res.ok) {
//           const txt = await res.text().catch(() => null);
//           const msg = txt || `HTTP ${res.status}`;
//           throw new Error(msg);
//         }

//         // success -> refresh inventory to show updated quantities
//         await refresh();
//         closeMovimentoModal();
//       } catch (err) {
//         console.error('Erro ao registrar movimentação', err);
//         alert(String(err?.message ?? err));
//       } finally {
//         setIsSubmitting(false);
//       }
//     }

//     return (
//       <div className="flex gap-6">

//         <div className="w-80 space-y-6">
//           {/* Company Details */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base">Legenda do Status do Estoque</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <div className="w-4 h-4 bg-green-500 rounded"></div>
//                 <div>
//                   <div className="text-sm font-medium">Acima do Mínimo</div>
//                   <div className="text-sm text-muted-foreground">(Estoque &gt; Min + 5)</div>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <div className="w-4 h-4 bg-yellow-500 rounded"></div>
//                 <div>
//                   <div className="text-sm font-medium">No Mínimo / Perto do Mínimo</div>
//                   <div className="text-sm text-muted-foreground">(Min - 5 a Min + 5)</div>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <div className="w-4 h-4 bg-red-500 rounded"></div>
//                 <div>
//                   <div className="text-sm font-medium">Abaixo do Mínimo</div>
//                   <div className="text-sm text-muted-foreground">(Estoque &lt; Min - 5)</div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <div>
//             <Button variant="" size="sm" onClick={() => openMovimentoModal(null)} className="w-full mb-2">
//               <ArrowLeftRight className="mr-2" />
//               Registrar movimentação de estoque
//             </Button>
//           </div>
//         </div>
//         <div className=" flex-1 min-w-0 space-y-6">
//           <StoreLevelView onOpenMovimento={openMovimentoModal} />
//         </div>

//         {/* Movimentação Modal (moved here from StoreLevelView) */}
//         <AlertDialog open={isModalOpen} onOpenChange={(open) => { if (!open) closeMovimentoModal(); setIsModalOpen(open); }}>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>Registrar movimentação</AlertDialogTitle>
//               <AlertDialogDescription>
//                 {modalItem ? `Item: ${modalItem.name} — Estoque atual: ${modalItem.currentStock}` : 'Selecionar item e informar os dados da movimentação.'}
//               </AlertDialogDescription>
//             </AlertDialogHeader>

//             <div className="grid gap-3 py-2">
//               <div>
//                 <Label>Tipo</Label>
//                 <Select value={movimentoTipo} onValueChange={(v) => setMovimentoTipo(v)}>
//                   <SelectTrigger className="w-full">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="ENTRADA">Entrada</SelectItem>
//                     <SelectItem value="SAIDA">Saída</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <Label>Quantidade</Label>
//                 <Input value={movimentoQuantidade} onChange={(e) => setMovimentoQuantidade(e.target.value)} placeholder="Informe a quantidade" />
//               </div>

//               <div>
//                 <Label>Observações (opcional)</Label>
//                 <Textarea value={movimentoObs} onChange={(e) => setMovimentoObs(e.target.value)} />
//               </div>
//             </div>

//             <AlertDialogFooter>
//               <AlertDialogCancel onClick={closeMovimentoModal}>Fechar</AlertDialogCancel>
//               <AlertDialogAction onClick={submitMovimento} disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Registrar'}</AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </div>
//     );
//   };

//   return (
//     <InventoryProvider defaultUnidadeId={loja?.id}>
//       <PageContent loja={loja} />
//     </InventoryProvider>
//   );
// }
'use client'
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StoreLevelView } from '@/components/Estoque/StoreLevelView';
import { InventoryProvider, useInventory } from '@/contexts/InventoryContext';
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";
import { usePerfilProtegido } from '@/hooks/usePerfilProtegido';
import { ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input';

export default function estoqueFazenda() {
  const { fetchWithAuth } = useAuth();
  usePerfilProtegido("GERENTE_LOJA");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [movimentoTipo, setMovimentoTipo] = useState('ENTRADA');
  const [movimentoQuantidade, setMovimentoQuantidade] = useState('');
  const [movimentoObs, setMovimentoObs] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function openMovimentoModal(item) {
    setModalItem(item);
    setMovimentoTipo('ENTRADA');
    setMovimentoQuantidade('');
    setMovimentoObs('');
    setIsModalOpen(true);
  }

  function closeMovimentoModal() {
    setIsModalOpen(false);
    setModalItem(null);
  }

  async function submitMovimento(refreshCallback) {
    if (!modalItem) return;
    const quantidade = Number(movimentoQuantidade);
    if (isNaN(quantidade) || quantidade <= 0) {
      alert('Informe uma quantidade válida maior que zero.');
      return;
    }

    setIsSubmitting(true);
    try {
      const body = {
        estoqueProdutoId: modalItem.rawItemId ?? modalItem.rawItemId,
        tipoMovimento: movimentoTipo,
        quantidade,
        observacoes: movimentoObs || undefined
      };

      const url = `${API_URL}estoque/movimento`;
      let res;
      try {
        res = await fetchWithAuth(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      } catch (e) {
        res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      }

      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        const msg = txt || `HTTP ${res.status}`;
        throw new Error(msg);
      }

      // Atualizar os dados após sucesso
      if (refreshCallback) {
        await refreshCallback();
      }

      closeMovimentoModal();
    } catch (err) {
      console.error('Erro ao registrar movimentação', err);
      alert(String(err?.message ?? err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <InventoryProvider defaultUnidadeId={null}>
      <ConteudoEstoque 
        onOpenMovimento={openMovimentoModal}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modalItem={modalItem}
        setModalItem={setModalItem}
        movimentoTipo={movimentoTipo}
        setMovimentoTipo={setMovimentoTipo}
        movimentoQuantidade={movimentoQuantidade}
        setMovimentoQuantidade={setMovimentoQuantidade}
        movimentoObs={movimentoObs}
        setMovimentoObs={setMovimentoObs}
        isSubmitting={isSubmitting}
        submitMovimento={submitMovimento}
        closeMovimentoModal={closeMovimentoModal}
      />
    </InventoryProvider>
  );
}

function ConteudoEstoque({
  onOpenMovimento,
  isModalOpen,
  setIsModalOpen,
  modalItem,
  setModalItem,
  movimentoTipo,
  setMovimentoTipo,
  movimentoQuantidade,
  setMovimentoQuantidade,
  movimentoObs,
  setMovimentoObs,
  isSubmitting,
  submitMovimento,
  closeMovimentoModal
}) {
  const { refresh } = useInventory();
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


      </div>
      <div className=" flex-1 min-w-0 space-y-6">
        <StoreLevelView onOpenMovimento={onOpenMovimento} />
      </div>

      {/* Movimentação Modal */}
      <AlertDialog open={isModalOpen} onOpenChange={(open) => { if (!open) { setIsModalOpen(false); setModalItem(null); } else setIsModalOpen(open); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Registrar movimentação</AlertDialogTitle>
            <AlertDialogDescription>
              {modalItem ? `Item: ${modalItem.name} — Estoque atual: ${modalItem.currentStock}` : 'Selecionar item e informar os dados da movimentação.'}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid gap-3 py-2">
            <div>
              <Label>Tipo</Label>
              <Select value={movimentoTipo} onValueChange={(v) => setMovimentoTipo(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ENTRADA">Entrada</SelectItem>
                  <SelectItem value="SAIDA">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Quantidade</Label>
              <Input value={movimentoQuantidade} onChange={(e) => setMovimentoQuantidade(e.target.value)} placeholder="Informe a quantidade" />
            </div>

            <div>
              <Label>Observações (opcional)</Label>
              <Textarea value={movimentoObs} onChange={(e) => setMovimentoObs(e.target.value)} />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setIsModalOpen(false); setModalItem(null); }}>Fechar</AlertDialogCancel>
            <AlertDialogAction onClick={() => submitMovimento(refresh)} disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Registrar'}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}