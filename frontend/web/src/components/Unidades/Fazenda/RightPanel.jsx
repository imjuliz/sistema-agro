import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Paperclip, Clock, Plus, Send } from 'lucide-react';
import { useState } from 'react';

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

const attachments = [
  { id: 1, name: 'Company_Profile_2024.pdf', size: '2.4 MB', type: 'pdf' },
  { id: 2, name: 'Job_Requirements.docx', size: '1.2 MB', type: 'doc' },
  { id: 3, name: 'Interview_Notes.txt', size: '156 KB', type: 'txt' }
];

export function RightPanel({ onLogActivity }) {
  const [quickNote, setQuickNote] = useState('');
  const [activityType, setActivityType] = useState('');

  const handleQuickLog = () => {
    if (quickNote.trim() && activityType) {
      // Handle quick activity logging
      setQuickNote('');
      setActivityType('');
    }
  };

  return (
    <div className="w-80 space-y-6">
      {/* Quick Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Log Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={activityType} onValueChange={setActivityType}>
            <SelectTrigger>
              <SelectValue placeholder="Select activity type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="call">Phone Call</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="note">Note</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Add quick notes..."
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleQuickLog} disabled={!quickNote.trim() || !activityType}>
              <Send className="size-4 mr-2" />
              Log
            </Button>
            <Button size="sm" variant="outline" onClick={onLogActivity}>
              <Plus className="size-4 mr-2" />
              Detailed
            </Button>
          </div>
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

      {/* Attachments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Recent Attachments</CardTitle>
          <Paperclip className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-3">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded cursor-pointer">
              <div className="size-8 bg-primary/10 rounded flex items-center justify-center">
                <Paperclip className="size-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{attachment.name}</div>
                <div className="text-xs text-muted-foreground">{attachment.size}</div>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full">
            <Plus className="size-4 mr-2" />
            Upload File
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}