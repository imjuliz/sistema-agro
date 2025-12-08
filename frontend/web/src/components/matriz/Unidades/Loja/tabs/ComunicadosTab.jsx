import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, Tag, FileText, MessageSquare, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activityData = [
  {
    id: "1",
    type: "status_change",
    user: { name: "Sistema", initials: "S" },
    action: "alterou o status",
    target: "Loja",
    status: { text: "Ativa", color: "green" },
    timestamp: "06:20 PM",
    date: "DOMINGO, 06 MARÇO"
  },
  {
    id: "2",
    type: "comment",
    user: { name: "Gerente", initials: "G" },
    action: "comentou",
    target: "Post",
    comment: "Loja funcionando normalmente.",
    timestamp: "05:53 PM",
    date: "DOMINGO, 06 MARÇO"
  },
];

export function ComunicadosTab() {
  return (
    <div className="space-y-4 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Comunicados e Atividades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activityData.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <Avatar>
                  <AvatarFallback>{activity.user.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{activity.user.name}</span>
                    <span className="text-muted-foreground">{activity.action}</span>
                    <span className="font-medium">{activity.target}</span>
                  </div>
                  {activity.comment && (
                    <p className="text-sm text-muted-foreground mt-1">{activity.comment}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">{activity.date}</span>
                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
