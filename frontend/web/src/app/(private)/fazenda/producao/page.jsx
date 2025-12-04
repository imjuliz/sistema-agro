import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, DollarSign, Users, Eye, Edit, MoreHorizontal } from 'lucide-react';

const jobs = [
  {
    id: 1,
    title: 'Senior Full Stack Developer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120K - $160K',
    posted: '2 weeks ago',
    applications: 45,
    shortlisted: 8,
    interviewed: 3,
    status: 'active',
    urgency: 'high',
    recruiter: 'Alex Smith'
  },
  {
    id: 2,
    title: 'Product Manager',
    department: 'Product',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$130K - $170K',
    posted: '1 week ago',
    applications: 32,
    shortlisted: 6,
    interviewed: 2,
    status: 'active',
    urgency: 'medium',
    recruiter: 'Emma Wilson'
  },
  {
    id: 3,
    title: 'UX/UI Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    salary: '$90K - $120K',
    posted: '3 days ago',
    applications: 28,
    shortlisted: 5,
    interviewed: 1,
    status: 'paused',
    urgency: 'low',
    recruiter: 'Sarah Johnson'
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$110K - $150K',
    posted: '5 days ago',
    applications: 19,
    shortlisted: 4,
    interviewed: 2,
    status: 'active',
    urgency: 'high',
    recruiter: 'Mike Johnson'
  }
];

export default function JobsTab() {
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{job.title}</CardTitle> {/* nome do produto */}
                 
                </div>
                
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="size-4 mr-2" />
                  Ver mais
                </Button>
                {/* <Button variant="outline" size="sm">
                  <Edit className="size-4 mr-2" />
                  Edit
                </Button> */}
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="size-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-6">
              
              {/* Shortlisted */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Progresso</span>
                </div>
                <div className="text-2xl font-medium">{job.shortlisted}%</div>
                <Progress value={(job.shortlisted / job.applications) * 100} className="h-1" />
              </div>

            </div>

            {/* <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <Button size="sm">View Candidates</Button>
              <Button variant="outline" size="sm">Schedule Interview</Button>
              <Button variant="outline" size="sm">Share Job</Button>
            </div> */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}