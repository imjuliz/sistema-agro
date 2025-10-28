import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageSquare, MoreHorizontal, Building2, Users, Calendar, DollarSign, Bell, Clock, Plus } from 'lucide-react';

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

const reminders = [
  {
    id: 1,
    title: 'Follow up on Senior Developer role',
    time: '2:00 PM today',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Call Sarah Johnson about new requirements',
    time: 'Tomorrow 10:00 AM',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Send candidate shortlist',
    time: 'Dec 15, 3:00 PM',
    priority: 'low'
  }
];

export function LeftPanel() {
  return (
    <div className="w-80 space-y-6">
      {/* Company Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações da unidade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Building2 className="size-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">Culturas atuais</div>
              <div className="text-sm text-muted-foreground">Foco produtivo (ex.: Milho, soja)</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="size-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">Company Size</div>
              <div className="text-sm text-muted-foreground">500-1000 funcionarios</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="size-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">Criado em</div>
              <div className="text-sm text-muted-foreground">Março de 2023</div>
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
          <CardTitle className="text-base">Contatos principais</CardTitle>
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

      {/* Reminders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Reminders</CardTitle>
          <Bell className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-3">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium">{reminder.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="size-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{reminder.time}</span>
                  </div>
                </div>
                <Badge
                  variant={reminder.priority === 'high' ? 'destructive' :
                    reminder.priority === 'medium' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {reminder.priority}
                </Badge>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full">
            <Plus className="size-4 mr-2" />
            Add Reminder
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}