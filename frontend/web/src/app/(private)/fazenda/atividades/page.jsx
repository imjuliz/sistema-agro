// Agricultura: Registrar Plantio (data, talhão, cultura, quantidade). Irrigação (data, área, volume). Adubação / Agrotóxicos (produto, quantidade, responsável, validade).
// Pecuária: Registrar Alimentação (tipo, lote/animal, quantidade). Vacinação e manejo veterinário (animal/lote, medicamento, dose, responsável). Histórico por lote ou por animal.
"use client"
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";
import { usePerfilProtegido } from '@/hooks/usePerfilProtegido';

export default function PlanejarSafra() {
    const { fetchWithAuth } = useAuth();
  usePerfilProtegido("GERENTE_FAZENDA");

  return (
    <div className="min-h-screen bg-gray-50"><KanbanBoard /></div>
  );
}