import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageSquare, MoreHorizontal, Building2, Users, Calendar, DollarSign } from 'lucide-react';

const contacts = [
  {
    id: 1,
    name: 'Sarah Johnson',
    title: 'Head of Engineering',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    avatar: '/api/placeholder/40/40',
    status: 'primary'
  },
  {
    id: 2,
    name: 'Michael Chen',
    title: 'HR Manager',
    email: 'michael.chen@techcorp.com',
    phone: '+1 (555) 234-5678',
    avatar: '/api/placeholder/40/40',
    status: 'secondary'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    title: 'Talent Acquisition Lead',
    email: 'emily.rodriguez@techcorp.com',
    phone: '+1 (555) 345-6789',
    avatar: '/api/placeholder/40/40',
    status: 'secondary'
  }
];

export function LeftPanel() {
  return (
    <div className="w-80 space-y-6">
      {/* Company Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Company Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Building2 className="size-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">Industry</div>
              <div className="text-sm text-muted-foreground">Software Technology</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="size-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">Company Size</div>
              <div className="text-sm text-muted-foreground">500-1000 employees</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="size-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">Client Since</div>
              <div className="text-sm text-muted-foreground">March 2023</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DollarSign className="size-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">Contract Value</div>
              <div className="text-sm text-muted-foreground">$150K/year</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Contacts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Key Contacts</CardTitle>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="size-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="flex items-start gap-3">
              <Avatar className="size-10">
                <AvatarImage src={contact.avatar} alt={contact.name} />
                <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-medium text-sm">{contact.name}</div>
                  {contact.status === 'primary' && (
                    <Badge variant="default" className="text-xs">Primary</Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{contact.title}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Button variant="ghost" size="sm" className="h-7 px-2">
                    <Phone className="size-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2">
                    <Mail className="size-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2">
                    <MessageSquare className="size-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}