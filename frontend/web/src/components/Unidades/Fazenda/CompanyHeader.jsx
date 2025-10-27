import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Building2, MapPin, Globe, Users, Calendar } from 'lucide-react';

export function CompanyHeader() {
  return (
    <div className="bg-card border-b px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Company Info */}
        <div className="flex items-center gap-4">
          <Avatar className="size-12">
            <AvatarImage src="/api/placeholder/48/48" alt="TechCorp Solutions" />
            <AvatarFallback>TC</AvatarFallback>
          </Avatar>
          
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-medium">TechCorp Solutions</h1>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Active Client
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <Building2 className="size-4" />
                <span>Technology</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="size-4" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="size-4" />
                <span>techcorp.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-2xl font-medium text-primary">12</div>
            <div className="text-xs text-muted-foreground">Open Jobs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-medium text-primary">47</div>
            <div className="text-xs text-muted-foreground">Active Candidates</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-medium text-primary">8</div>
            <div className="text-xs text-muted-foreground">Contacts</div>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="size-4" />
              <span>Last activity: 2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}