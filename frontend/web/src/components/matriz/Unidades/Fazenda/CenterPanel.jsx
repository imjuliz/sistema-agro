import { OverviewTab } from './tabs/OverviewTab';
import { JobsTab } from './tabs/JobsTab';
import { EstoqueTab } from './tabs/EstoqueTab';
import { EquipeTab } from './tabs/EquipeTab';
import { AtividadesTab } from './tabs/AtividadesTab';
import { FinanceiroTab } from './tabs/FinanceiroTab';
import { FornecedoresTab } from './tabs/FornecedoresTab'
import { ComunicadosTab } from './tabs/ComunicadosTab'

export function CenterPanel({ activeTab, fazenda }) {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab fazendaId={fazenda?.id} />;
      // case 'jobs':
      //   return <JobsTab />;
      case 'estoque':
        return  <EstoqueTab fazenda={fazenda}/>;
      case 'equipe':
        return <EquipeTab fazendaId={fazenda?.id} />;
      // case 'atividades':
      //   return <AtividadesTab />;
      case 'financeiro':
        return <FinanceiroTab unidadeId={fazenda?.id} />;
      case 'fornecedores':
        return <FornecedoresTab fazenda={fazenda} />;
      case 'comunicados':
        return <ComunicadosTab />;
      default:
        return <OverviewTab fazendaId={fazenda?.id} />;
    }
  };

  return (
    <div className="flex-1">
      {renderTabContent()}
    </div>
  );
}