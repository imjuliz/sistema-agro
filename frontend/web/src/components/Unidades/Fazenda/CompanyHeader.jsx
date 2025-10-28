import React from "react";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Building2, MapPin, Globe, Calendar, MessageSquare, Edit3,  } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CompanyHeader({ onLogActivity }) {
  return (
    <div className="bg-card  ">
      <div className="flex items-center border-b px-6 py-4 justify-between">
        {/* Company Info */}
        <div className="flex items-center gap-4">
          <Avatar className="size-12">
            <AvatarImage src="/api/placeholder/48/48" alt="TechCorp Solutions" />
            <AvatarFallback>TC</AvatarFallback>
          </Avatar>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-medium">TechCorp Solutions</h1>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Ativo
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <Building2 className="size-4" />
                <span>Fazenda</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="size-4" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="size-4" />
                <span>techcorp.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="flex items-center gap-8">
          <div className="flex items-start space-x-3">
            {/* Primary Actions */}
            <div className="flex space-x-2">
              {/* <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>Call Log</span>
              </Button> */}
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4" />
                <span>Comunicado</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-1" onClick={onLogActivity}>
                <Calendar className="w-4 h-4" />
                Reunião
              </Button>

            </div>

            {/* Secondary Actions */}
            <div className="flex space-x-2">
              {/* <Button variant="ghost" size="sm">
                <Star className="w-4 h-4" />
              </Button> */}
              <Button variant="ghost" size="sm">
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}