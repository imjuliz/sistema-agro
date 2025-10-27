import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, TrendingUp, TrendingDown, DollarSign, Award, AlertCircle } from 'lucide-react';

const historyEvents = [
  {
    id: 1,
    type: 'milestone',
    title: 'Contract Renewed',
    description: 'Annual contract renewed for $150K. Increased scope to include executive search.',
    date: 'December 1, 2024',
    user: 'System',
    impact: 'positive',
    value: '$150,000'
  },
  {
    id: 2,
    type: 'placement',
    title: 'Successful Placement - Senior Developer',
    description: 'Jennifer Martinez successfully placed as Senior Full Stack Developer. Client extremely satisfied with candidate quality.',
    date: 'November 15, 2024',
    user: 'Alex Smith',
    impact: 'positive',
    fee: '$25,000'
  },
  {
    id: 3,
    type: 'issue',
    title: 'Candidate Withdrawal',
    description: 'Top candidate for Product Manager role withdrew due to competing offer. Resuming search with alternative candidates.',
    date: 'November 8, 2024',
    user: 'Emma Wilson',
    impact: 'negative'
  },
  {
    id: 4,
    type: 'milestone',
    title: 'Quarterly Business Review',
    description: 'Q3 review completed. 15 positions filled, 92% success rate. Client requested additional focus on diversity hiring.',
    date: 'October 30, 2024',
    user: 'Alex Smith',
    impact: 'positive',
    metrics: { filled: 15, successRate: '92%' }
  },
  {
    id: 5,
    type: 'placement',
    title: 'Successful Placement - UX Designer',
    description: 'Sarah Thompson placed as Lead UX Designer. Start date confirmed for November 1st.',
    date: 'October 20, 2024',
    user: 'Mike Johnson',
    impact: 'positive',
    fee: '$18,000'
  },
  {
    id: 6,
    type: 'contract',
    title: 'Scope Expansion',
    description: 'Contract expanded to include C-level executive search. Additional $50K annual value.',
    date: 'September 15, 2024',
    user: 'Alex Smith',
    impact: 'positive',
    value: '+$50,000'
  }
];

const getEventIcon = (type) => {
  switch (type) {
    case 'milestone': return <Award className="size-4" />;
    case 'placement': return <TrendingUp className="size-4" />;
    case 'issue': return <AlertCircle className="size-4" />;
    case 'contract': return <DollarSign className="size-4" />;
    default: return <Calendar className="size-4" />;
  }
};

const getEventColor = (type, impact) => {
  if (impact === 'negative') return 'bg-red-100 text-red-600';
  
  switch (type) {
    case 'milestone': return 'bg-purple-100 text-purple-600';
    case 'placement': return 'bg-green-100 text-green-600';
    case 'contract': return 'bg-blue-100 text-blue-600';
    case 'issue': return 'bg-red-100 text-red-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const getImpactBadge = (impact) => {
  switch (impact) {
    case 'positive': return 'default';
    case 'negative': return 'destructive';
    default: return 'secondary';
  }
};

export function HistoryTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="size-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-medium">47</div>
                <div className="text-sm text-muted-foreground">Total Placements</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="size-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-medium">$890K</div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="size-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-medium">94%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {historyEvents.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${getEventColor(event.type, event.impact)}`}>
                  {getEventIcon(event.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Calendar className="size-3" />
                        <span>{event.date}</span>
                        <span>•</span>
                        <span>{event.user}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                      <Badge variant={getImpactBadge(event.impact)} className="text-xs">
                        {event.impact}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      {event.value && (
                        <div className="font-medium text-green-600">{event.value}</div>
                      )}
                      {event.fee && (
                        <div className="font-medium text-blue-600">Fee: {event.fee}</div>
                      )}
                      {event.metrics && (
                        <div className="flex items-center gap-2">
                          <span>Filled: {event.metrics.filled}</span>
                          <span>•</span>
                          <span>Success: {event.metrics.successRate}</span>
                        </div>
                      )}
                    </div>
                    <Avatar className="size-6">
                      <AvatarImage src="/api/placeholder/24/24" />
                      <AvatarFallback className="text-xs">
                        {event.user === 'System' ? 'SY' : event.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}