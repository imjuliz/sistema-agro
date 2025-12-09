import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, Mail, MessageSquare, Calendar, FileText, Users, Clock } from 'lucide-react';

const atividades = [
  {
    id: 1,
    type: 'call',
    title: 'Phone call with Sarah Johnson',
    description: 'Discussed requirements for Senior Developer position. Sarah emphasized need for React expertise and team leadership experience.',
    duration: '45 minutes',
    time: '2 hours ago',
    user: 'Alex Smith',
    contact: 'Sarah Johnson',
    relatedTo: 'Senior Full Stack Developer',
    outcome: 'positive'
  },
  {
    id: 2,
    type: 'email',
    title: 'Sent candidate shortlist',
    description: 'Shared top 5 candidates for Product Manager role with detailed profiles and interview availability.',
    time: '4 hours ago',
    user: 'Emma Wilson',
    contact: 'David Park',
    relatedTo: 'Product Manager',
    outcome: 'neutral'
  },
  {
    id: 3,
    type: 'meeting',
    title: 'Client meeting - Q1 hiring requirements',
    description: 'Reviewed Q1 hiring plan, discussed budget allocation and priority roles. Confirmed need for 3 senior engineers.',
    duration: '1 hour 30 minutes',
    time: '1 day ago',
    user: 'Alex Smith',
    contact: 'Multiple attendees',
    relatedTo: 'General',
    outcome: 'positive'
  },
  {
    id: 4,
    type: 'note',
    title: 'Interview feedback - React Developer',
    description: 'Candidate showed strong technical skills but communication needs improvement. Sarah suggested a follow-up technical discussion.',
    time: '2 days ago',
    user: 'Mike Johnson',
    contact: 'Sarah Johnson',
    relatedTo: 'Senior Full Stack Developer',
    outcome: 'mixed'
  },
  {
    id: 5,
    type: 'call',
    title: 'Follow-up call with Emily Rodriguez',
    description: 'Coordinated interview schedules for UX Designer role. Confirmed availability for 3 candidates next week.',
    duration: '20 minutes',
    time: '3 days ago',
    user: 'Sarah Thompson',
    contact: 'Emily Rodriguez',
    relatedTo: 'UX/UI Designer',
    outcome: 'positive'
  }
];

const getActivityIcon = (type) => {
  switch (type) {
    case 'call': return <Phone className="size-4" />;
    case 'email': return <Mail className="size-4" />;
    case 'meeting': return <Users className="size-4" />;
    case 'note': return <FileText className="size-4" />;
    default: return <MessageSquare className="size-4" />;
  }
};

const getActivityColor = (type) => {
  switch (type) {
    case 'call': return 'bg-blue-100 text-blue-600';
    case 'email': return 'bg-green-100 text-green-600';
    case 'meeting': return 'bg-purple-100 text-purple-600';
    case 'note': return 'bg-orange-100 text-orange-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const getOutcomeColor = (outcome) => {
  switch (outcome) {
    case 'positive': return 'default';
    case 'negative': return 'destructive';
    case 'mixed': return 'secondary';
    default: return 'outline';
  }
};

export function AtividadesTab() {
  return (
    <div className="space-y-4">
      {atividades.map((atvd) => (
        <Card key={atvd.id} className={"p-0"}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${getActivityColor(atvd.type)}`}>
                {getActivityIcon(atvd.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium">{atvd.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <span>{atvd.user}</span>
                      <span>•</span>
                      <span>{atvd.contact}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="size-3" />
                        <span>{atvd.time}</span>
                      </div>
                      {atvd.duration && (
                        <>
                          <span>•</span>
                          <span>{atvd.duration}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {atvd.type}
                    </Badge>
                    <Badge variant={getOutcomeColor(atvd.outcome)} className="text-xs">
                      {atvd.outcome}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {atvd.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Related to: <span className="font-medium">{atvd.relatedTo}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Avatar className="size-6">
                      <AvatarImage src="/api/placeholder/24/24" />
                      <AvatarFallback className="text-xs">
                        {atvd.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


