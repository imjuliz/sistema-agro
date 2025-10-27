import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, MessageSquare, Calendar, MapPin, Briefcase, Edit, MoreHorizontal } from 'lucide-react';

const contacts = [
  {
    id: 1,
    name: 'Sarah Johnson',
    title: 'Head of Engineering',
    department: 'Engineering',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    avatar: '/api/placeholder/48/48',
    isPrimary: true,
    lastContact: '2 hours ago',
    notes: 'Key decision maker for technical roles. Prefers candidates with strong React experience.'
  },
  {
    id: 2,
    name: 'Michael Chen',
    title: 'HR Manager',
    department: 'Human Resources',
    email: 'michael.chen@techcorp.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    avatar: '/api/placeholder/48/48',
    isPrimary: false,
    lastContact: '1 day ago',
    notes: 'Handles onboarding and benefits discussions. Available for final interviews.'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    title: 'Talent Acquisition Lead',
    department: 'Human Resources',
    email: 'emily.rodriguez@techcorp.com',
    phone: '+1 (555) 345-6789',
    location: 'San Francisco, CA',
    avatar: '/api/placeholder/48/48',
    isPrimary: false,
    lastContact: '3 days ago',
    notes: 'Internal TA partner. Coordinates interview schedules and candidate feedback.'
  },
  {
    id: 4,
    name: 'David Park',
    title: 'VP of Product',
    department: 'Product',
    email: 'david.park@techcorp.com',
    phone: '+1 (555) 456-7890',
    location: 'San Francisco, CA',
    avatar: '/api/placeholder/48/48',
    isPrimary: false,
    lastContact: '1 week ago',
    notes: 'Decision maker for product roles. Prefers candidates with B2B SaaS experience.'
  }
];

export function ContactsTab() {
  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <Card key={contact.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <Avatar className="size-12">
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-lg">{contact.name}</h3>
                    {contact.isPrimary && (
                      <Badge variant="default">Primary Contact</Badge>
                    )}
                  </div>
                  <div className="text-muted-foreground mb-2">{contact.title}</div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Briefcase className="size-3" />
                      <span>{contact.department}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="size-3" />
                      <span>{contact.location}</span>
                    </div>
                    <span>Last contact: {contact.lastContact}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="size-4 mr-2" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="size-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">Contact Information</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="size-4 text-muted-foreground" />
                    <span>{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="size-4 text-muted-foreground" />
                    <span>{contact.phone}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">Quick Actions</div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Mail className="size-4 mr-2" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="size-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="size-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </div>

            {contact.notes && (
              <div className="mb-4">
                <div className="text-sm font-medium text-muted-foreground mb-2">Notes</div>
                <div className="text-sm bg-muted/50 p-3 rounded-lg">
                  {contact.notes}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-4 border-t">
              <Button size="sm">Log Activity</Button>
              <Button variant="outline" size="sm">
                <Calendar className="size-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button variant="outline" size="sm">Add Note</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}