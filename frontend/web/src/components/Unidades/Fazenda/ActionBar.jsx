import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, UserPlus, Search, Filter, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function ActionBar({ onAddJob, onLogActivity, onAddContact }) {
  return (
    <div className="bg-card border-b px-6 py-3 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Primary Actions */}
        <div className="flex items-center gap-3">
          <Button onClick={onAddJob} size="sm">
            <Plus className="size-4 mr-2" />
            Add Job
          </Button>
          <Button onClick={onLogActivity} variant="outline" size="sm">
            <MessageSquare className="size-4 mr-2" />
            Log Activity
          </Button>
          <Button onClick={onAddContact} variant="outline" size="sm">
            <UserPlus className="size-4 mr-2" />
            Add Contact
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="size-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search jobs, candidates, activities..." 
              className="pl-10 w-80"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="size-4 mr-2" />
            Filter
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}