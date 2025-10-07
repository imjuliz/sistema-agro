// Calendário agrícola. Projeção de produção esperada. Custos estimados vs. realizados. Ferramenta simples de simulação: "Se plantar X hectares de milho, produzirá Y toneladas".



import { KanbanBoard } from '@/components/kanban/KanbanBoard';

export default function PlanejarSafra() {
  return (
    <div className="min-h-screen bg-gray-50">
      <KanbanBoard />
    </div>
  );
}