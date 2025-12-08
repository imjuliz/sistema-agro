import { OverviewTab } from './tabs/OverviewTab';
import { EstoqueTab } from './tabs/EstoqueTab';
import { EquipeTab } from './tabs/EquipeTab';
import { FinanceiroTab } from './tabs/FinanceiroTab';
import { FornecedoresTab } from './tabs/FornecedoresTab'
import { ComunicadosTab } from './tabs/ComunicadosTab'

export function CenterPanel({ activeTab, loja, loading }) {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab lojaId={loja?.id} />;
      case 'estoque':
        return  <EstoqueTab loja={loja}/>;
      case 'equipe':
        return <EquipeTab lojaId={loja?.id} />;
      case 'financeiro':
        return <FinanceiroTab />;
      case 'fornecedores':
        return <FornecedoresTab loja={loja} />;
      case 'comunicados':
        return <ComunicadosTab />;
      default:
        return <OverviewTab lojaId={loja?.id} />;
    }
  };

  return (
    <div className="flex-1">
      {renderTabContent()}
    </div>
  );
}

