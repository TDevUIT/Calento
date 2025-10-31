'use client';

import { Users, Calendar, Crown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Team } from '@/interface/team.interface';

interface TeamCardProps {
  team: Team;
  onClick?: () => void;
  isOwner?: boolean;
}

export const TeamCard = ({ team, onClick, isOwner }: TeamCardProps) => {
  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {team.name}
              {isOwner && (
                <Crown className="h-4 w-4 text-yellow-600" />
              )}
            </CardTitle>
            {team.description && (
              <CardDescription className="mt-1 line-clamp-2">
                {team.description}
              </CardDescription>
            )}
          </div>
          <Badge variant={team.is_active ? 'default' : 'secondary'}>
            {team.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              <span>Members</span>
            </div>
            <span className="font-medium">View</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Rituals</span>
            </div>
            <span className="font-medium">View</span>
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Timezone</span>
              <span className="font-medium">{team.timezone}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
