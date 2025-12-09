import { Badge } from '@/components/ui/badge';

const tabs = [
  { id: 'overview', label: 'Overview', count: null },
  // { id: 'jobs', label: 'Jobs', count: 12 },
  { id: 'estoque', label: 'Estoque', count: null },
  { id: 'equipe', label: 'Equipe', count: null },
  // { id: 'atividades', label: 'Atividades', count: null },
  { id: 'financeiro', label: 'Financeiro', count: null },
  { id: 'fornecedores', label: 'Fornecedores', count: null },
  // { id: 'comunicados', label: 'Comunicados', count: 47 },
];

const lojasTab = [
  { id: 'overview', label: 'Overview', count: null },
  { id: 'jobs', label: 'Jobs', count: 12 },
  { id: 'estoque', label: 'Estoque', count: null },
  { id: 'equipe', label: 'Equipe', count: null },
  { id: 'financeiro', label: 'Financeiro', count: null },
  { id: 'fornecedores', label: 'Fornecedores', count: null },
  { id: 'comunicados', label: 'Comunicados', count: 47 },
]

export function TabNavigation({ activeTab, onTabChange }) {
  return (
    <>
      <div className="bg-card border-b px-6">
        <div className="flex items-center gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 transition-colors ${activeTab === tab.id
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <Badge variant="secondary" className="text-xs px-2 py-0">
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>
    </>

  );
}