import { OverviewTab } from './tabs/OverviewTab';
import { JobsTab } from './tabs/JobsTab';
import { CandidatesTab } from './tabs/CandidatesTab';
import { ContactsTab } from './tabs/ContactsTab';
import { ActivitiesTab } from './tabs/ActivitiesTab';
import { HistoryTab } from './tabs/HistoryTab';

export function CenterPanel({ activeTab }) {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'jobs':
        return <JobsTab />;
      case 'candidates':
        return <CandidatesTab />;
      case 'contacts':
        return <ContactsTab />;
      case 'activities':
        return <ActivitiesTab />;
      case 'history':
        return <HistoryTab />;
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