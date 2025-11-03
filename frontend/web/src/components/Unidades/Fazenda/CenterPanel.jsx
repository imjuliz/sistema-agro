import { OverviewTab } from './tabs/OverviewTab';
import { JobsTab } from './tabs/JobsTab';
import { EstoqueTab } from './tabs/EstoqueTab';
import { EquipeTab } from './tabs/EquipeTab';
import { AtividadesTab } from './tabs/AtividadesTab';
import { FinanceiroTab } from './tabs/FinanceiroTab';
import { FornecedoresTab } from './tabs/FornecedoresTab'
import { ComunicadosTab } from './tabs/ComunicadosTab'

export function CenterPanel({ activeTab }) {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      // case 'jobs':
      //   return <JobsTab />;
      case 'estoque':
        return <EstoqueTab />;
      case 'equipe':
        return <EquipeTab />;
      case 'atividades':
        return <AtividadesTab />;
      case 'financeiro':
        return <FinanceiroTab />;
      case 'fornecedores':
        return <FornecedoresTab />;
      case 'comunicados':
        return <ComunicadosTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="flex-1">
      {renderTabContent()}
    </div>
  );
}