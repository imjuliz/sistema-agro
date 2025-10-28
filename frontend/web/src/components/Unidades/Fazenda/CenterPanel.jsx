import { OverviewTab } from './tabs/OverviewTab';
import { JobsTab } from './tabs/JobsTab';
import { EstoqueTab } from './tabs/EstoqueTab';
import { EquipeTab } from './tabs/EquipeTab';
import { AtividadesTab } from './tabs/AtividadesTab';
import { FinanceiroTab } from './tabs/FinanceiroTab';

export function CenterPanel({ activeTab }) {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'jobs':
        return <JobsTab />;
      case 'estoque':
        return <EstoqueTab />;
      case 'equipe':
        return <EquipeTab />;
      case 'atividades':
        return <AtividadesTab />;
      case 'financeiro':
        return <FinanceiroTab />;
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