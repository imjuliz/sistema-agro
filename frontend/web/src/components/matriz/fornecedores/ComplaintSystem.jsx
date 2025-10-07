'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  AlertTriangle, 
  Plus, 
  Eye, 
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUp,
  FileText,
  Calendar
} from 'lucide-react';

export function ComplaintSystem({ userType }) {
  const [showNewComplaint, setShowNewComplaint] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const complaints = [
    {
      id: 'CMP-001',
      title: 'Late Delivery - Order ORD-001',
      description: 'Order was delivered 2 hours late, affecting our lunch service',
      category: 'delivery',
      priority: 'high',
      status: 'open',
      submittedBy: userType === 'supplier' ? 'Bella Vista Restaurant' : 'Fresh Valley Farms',
      assignedTo: userType === 'supplier' ? 'Sales Manager' : 'Customer Support',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:20:00Z',
      orderId: 'ORD-001',
      escalated: true,
      responses: [
        {
          id: 1,
          author: 'Sales Rep',
          message: 'I apologize for the delay. There was unexpected traffic on the delivery route.',
          timestamp: '2024-01-15T11:00:00Z'
        },
        {
          id: 2,
          author: 'Restaurant Manager',
          message: 'This has happened twice this month. We need a more reliable solution.',
          timestamp: '2024-01-15T11:30:00Z'
        }
      ]
    },
    {
      id: 'CMP-002',
      title: 'Product Quality Issue - Damaged Packaging',
      description: 'Several packages of meat were damaged upon delivery, with torn vacuum seals',
      category: 'quality',
      priority: 'medium',
      status: 'in_progress',
      submittedBy: userType === 'supplier' ? 'Grand Hotel Kitchen' : 'Premium Meats Co.',
      assignedTo: userType === 'supplier' ? 'Quality Manager' : 'Customer Support',
      createdAt: '2024-01-14T09:15:00Z',
      updatedAt: '2024-01-15T08:45:00Z',
      orderId: 'ORD-002',
      escalated: false,
      responses: [
        {
          id: 1,
          author: 'Quality Manager',
          message: 'We are investigating this with our packaging team. Photos would be helpful.',
          timestamp: '2024-01-14T10:00:00Z'
        }
      ]
    },
    {
      id: 'CMP-003',
      title: 'Billing Discrepancy',
      description: 'Invoice amount does not match the agreed pricing for organic vegetables',
      category: 'billing',
      priority: 'low',
      status: 'resolved',
      submittedBy: userType === 'supplier' ? 'Metro Bistro' : 'Fresh Valley Farms',
      assignedTo: userType === 'supplier' ? 'Accounts Manager' : 'Billing Department',
      createdAt: '2024-01-12T16:20:00Z',
      updatedAt: '2024-01-13T10:15:00Z',
      orderId: 'ORD-003',
      escalated: false,
      responses: [
        {
          id: 1,
          author: 'Accounts Manager',
          message: 'You are correct. There was an error in the pricing. Corrected invoice attached.',
          timestamp: '2024-01-13T09:30:00Z'
        }
      ]
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <AlertTriangle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'open': return 'secondary';
      case 'in_progress': return 'default';
      case 'resolved': return 'outline';
      case 'closed': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (activeTab === 'all') return true;
    return complaint.status === activeTab;
  });

  const NewComplaintForm = () => (
    <Dialog open={showNewComplaint} onOpenChange={setShowNewComplaint}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submit New Complaint</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Complaint Title</Label>
            <Input id="title" placeholder="Brief description of the issue" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivery">Delivery Issue</SelectItem>
                  <SelectItem value="quality">Product Quality</SelectItem>
                  <SelectItem value="billing">Billing/Pricing</SelectItem>
                  <SelectItem value="service">Customer Service</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="orderId">Related Order ID (Optional)</Label>
            <Input id="orderId" placeholder="ORD-001" />
          </div>

          <div>
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea 
              id="description" 
              placeholder="Please provide as much detail as possible about the issue..."
              className="min-h-[120px]"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => setShowNewComplaint(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={() => setShowNewComplaint(false)} className="flex-1">
              Submit Complaint
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const ComplaintDetails = ({ complaint }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle>{complaint.title}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Complaint ID: {complaint.id}
              </p>
            </div>
            {complaint.escalated && (
              <Badge variant="destructive" className="ml-2">
                <ArrowUp className="h-3 w-3 mr-1" />
                Escalated
              </Badge>
            )}
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(complaint.status)}
                <Badge variant={getStatusVariant(complaint.status)}>
                  {complaint.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            <div>
              <Label>Priority</Label>
              <p className={`mt-1 ${getPriorityColor(complaint.priority)}`}>
                {complaint.priority.toUpperCase()}
              </p>
            </div>
            <div>
              <Label>Category</Label>
              <p className="mt-1 capitalize">{complaint.category}</p>
            </div>
            <div>
              <Label>Related Order</Label>
              <p className="mt-1">{complaint.orderId || 'N/A'}</p>
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <p className="mt-1 p-3 bg-muted rounded-lg">{complaint.description}</p>
          </div>

          <div>
            <Label>Responses & Updates</Label>
            <div className="mt-2 space-y-3">
              {complaint.responses.map((response) => (
                <div key={response.id} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <Avatar className="mt-1">
                      <AvatarFallback>{response.author.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{response.author}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(response.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{response.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="newResponse">Add Response</Label>
            <Textarea 
              id="newResponse"
              placeholder="Type your response..."
              className="mt-1"
            />
            <div className="flex gap-2 mt-2">
              <Button size="sm" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Response
              </Button>
              {userType === 'supplier' && !complaint.escalated && (
                <Button size="sm" variant="outline">
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Escalate to Manager
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3>{userType === 'supplier' ? 'Complaint Management' : 'Support & Complaints'}</h3>
          <p className="text-muted-foreground">
            {userType === 'supplier' 
              ? 'Handle customer complaints and feedback'
              : 'Submit and track your complaints and support requests'
            }
          </p>
        </div>
        <Button onClick={() => setShowNewComplaint(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Complaint
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Complaints</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <Card key={complaint.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-4">
                      <h4>{complaint.title}</h4>
                      <Badge variant={getStatusVariant(complaint.status)} className="flex items-center gap-1">
                        {getStatusIcon(complaint.status)}
                        {complaint.status.replace('_', ' ')}
                      </Badge>
                      <span className={`text-sm ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority} priority
                      </span>
                      {complaint.escalated && (
                        <Badge variant="destructive">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          Escalated
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground">
                      {userType === 'supplier' ? 'Submitted by:' : 'Assigned to:'} {complaint.submittedBy}
                    </p>
                    
                    <p className="text-sm line-clamp-2">{complaint.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Created: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Updated: {new Date(complaint.updatedAt).toLocaleDateString()}</span>
                      {complaint.orderId && (
                        <>
                          <span>•</span>
                          <span>Order: {complaint.orderId}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <ComplaintDetails complaint={complaint} />
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Respond
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredComplaints.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h4>No complaints found</h4>
              <p className="text-muted-foreground">
                {activeTab === 'all' 
                  ? 'No complaints have been submitted yet'
                  : `No ${activeTab.replace('_', ' ')} complaints found`
                }
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Complaint Management Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4>Escalation Workflow</h4>
              <p className="text-sm text-muted-foreground">
                Sales reps can escalate issues to managers for complex resolution
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4>Incident Logging</h4>
              <p className="text-sm text-muted-foreground">
                Comprehensive tracking of all complaints and their resolutions
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4>Response Tracking</h4>
              <p className="text-sm text-muted-foreground">
                Monitor response times and customer satisfaction metrics
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <NewComplaintForm />
    </div>
  );
}