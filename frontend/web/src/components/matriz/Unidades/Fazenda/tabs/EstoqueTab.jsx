'use client'
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Mail, Phone, Calendar, Star, Eye, MessageSquare, MoreHorizontal, Building2, Users, DollarSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StoreLevelView } from '@/components/Estoque/StoreLevelView';
import { InventoryProvider } from '@/contexts/InventoryContext';

const estoque = [
  {
    id: 1,
    name: 'Jennifer Martinez',
    title: 'Senior Full Stack Developer',
    email: 'jennifer.martinez@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    experience: '8 years',
    appliedFor: 'Senior Full Stack Developer',
    status: 'interviewing',
    stage: 'Technical Interview',
    rating: 4.8,
    lastActivity: '2 hours ago',
    avatar: '/api/placeholder/40/40',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS']
  },
  {
    id: 2,
    name: 'David Chen',
    title: 'Product Manager',
    email: 'david.chen@email.com',
    phone: '+1 (555) 234-5678',
    location: 'New York, NY',
    experience: '6 years',
    appliedFor: 'Product Manager',
    status: 'shortlisted',
    stage: 'Resume Review',
    rating: 4.5,
    lastActivity: '1 day ago',
    avatar: '/api/placeholder/40/40',
    skills: ['Product Strategy', 'Analytics', 'Agile', 'Leadership']
  },
  {
    id: 3,
    name: 'Sarah Thompson',
    title: 'UX/UI Designer',
    email: 'sarah.thompson@email.com',
    phone: '+1 (555) 345-6789',
    location: 'Austin, TX',
    experience: '5 years',
    appliedFor: 'UX/UI Designer',
    status: 'offered',
    stage: 'Offer Extended',
    rating: 4.9,
    lastActivity: '3 hours ago',
    avatar: '/api/placeholder/40/40',
    skills: ['Figma', 'Sketch', 'Prototyping', 'User Research']
  },
  {
    id: 4,
    name: 'Michael Rodriguez',
    title: 'DevOps Engineer',
    email: 'michael.rodriguez@email.com',
    phone: '+1 (555) 456-7890',
    location: 'Seattle, WA',
    experience: '7 years',
    appliedFor: 'DevOps Engineer',
    status: 'new',
    stage: 'Application Received',
    rating: null,
    lastActivity: '5 hours ago',
    avatar: '/api/placeholder/40/40',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform']
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'new': return 'default';
    case 'shortlisted': return 'secondary';
    case 'interviewing': return 'default';
    case 'offered': return 'default';
    case 'rejected': return 'destructive';
    default: return 'secondary';
  }
};


export function EstoqueTab() {

  return (
    <div className="flex gap-6">

      <div className="w-80 space-y-6">
        {/* Company Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Legenda do Status do Estoque</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <div>
                <div className="text-sm font-medium">Acima do Mínimo</div>
                <div className="text-sm text-muted-foreground">(Estoque &gt; Min + 5)</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <div>
                <div className="text-sm font-medium">No Mínimo / Perto do Mínimo</div>
                <div className="text-sm text-muted-foreground">(Min - 5 a Min + 5)</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <div>
                <div className="text-sm font-medium">Abaixo do Mínimo</div>
                <div className="text-sm text-muted-foreground">(Estoque &lt; Min - 5)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className=" flex-1 min-w-0 space-y-6">
        <InventoryProvider>
          <StoreLevelView />
        </InventoryProvider>

      </div>
    </div>
  );
}