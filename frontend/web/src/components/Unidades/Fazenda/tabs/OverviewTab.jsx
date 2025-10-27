import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TrendingUp, TrendingDown, Users, Briefcase, Calendar, MessageSquare } from 'lucide-react';

const recentActivities = [
  {
    id: 1,
    type: 'call',
    description: 'Phone call with Sarah Johnson about Senior Developer role',
    time: '2 hours ago',
    user: 'Alex Smith'
  },
  {
    id: 2,
    type: 'email',
    description: 'Sent candidate shortlist for Product Manager position',
    time: '4 hours ago',
    user: 'Emma Wilson'
  },
  {
    id: 3,
    type: 'meeting',
    description: 'Client meeting - Q1 hiring requirements discussion',
    time: '1 day ago',
    user: 'Alex Smith'
  },
  {
    id: 4,
    type: 'note',
    description: 'Added interview feedback for React Developer candidate',
    time: '2 days ago',
    user: 'Mike Johnson'
  }
];

const jobMetrics = [
  { title: 'Senior Developer', applications: 45, shortlisted: 8, interviewed: 3, status: 'active' },
  { title: 'Product Manager', applications: 32, shortlisted: 6, interviewed: 2, status: 'active' },
  { title: 'UX Designer', applications: 28, shortlisted: 5, interviewed: 1, status: 'paused' },
  { title: 'DevOps Engineer', applications: 19, shortlisted: 4, interviewed: 2, status: 'active' }
];

export function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="size-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-medium">12</div>
                <div className="text-sm text-muted-foreground">Active Jobs</div>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="size-3 text-green-500" />
              <span className="text-xs text-green-600">+2 this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="size-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-medium">47</div>
                <div className="text-sm text-muted-foreground">Active Candidates</div>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="size-3 text-green-500" />
              <span className="text-xs text-green-600">+12 this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="size-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-medium">23</div>
                <div className="text-sm text-muted-foreground">Interviews Scheduled</div>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingDown className="size-3 text-red-500" />
              <span className="text-xs text-red-600">-3 this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MessageSquare className="size-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-medium">156</div>
                <div className="text-sm text-muted-foreground">Activities This Month</div>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="size-3 text-green-500" />
              <span className="text-xs text-green-600">+18% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Job Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobMetrics.map((job, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{job.title}</span>
                    <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                      {job.status}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {job.applications} applications
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Shortlisted</div>
                    <div className="font-medium">{job.shortlisted}</div>
                    <Progress value={(job.shortlisted / job.applications) * 100} className="h-1 mt-1" />
                  </div>
                  <div>
                    <div className="text-muted-foreground">Interviewed</div>
                    <div className="font-medium">{job.interviewed}</div>
                    <Progress value={(job.interviewed / job.shortlisted) * 100} className="h-1 mt-1" />
                  </div>
                  <div>
                    <div className="text-muted-foreground">Offered</div>
                    <div className="font-medium">1</div>
                    <Progress value={33} className="h-1 mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <Avatar className="size-8">
                  <AvatarImage src={`/api/placeholder/32/32`} />
                  <AvatarFallback>{activity.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm">{activity.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {activity.user} • {activity.time}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}