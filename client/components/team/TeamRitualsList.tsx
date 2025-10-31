'use client';

import { useState } from 'react';
import { Plus, Calendar, Clock, MoreVertical, Trash2, Edit, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTeamRituals, useDeleteRitual } from '@/hook/team';
import { TeamRitual } from '@/interface/team.interface';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateRitualDialog } from './CreateRitualDialog';

interface TeamRitualsListProps {
  teamId: string;
  isOwner: boolean;
}

export const TeamRitualsList = ({ teamId, isOwner }: TeamRitualsListProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { data: ritualsData, isLoading } = useTeamRituals(teamId, true);
  const deleteRitual = useDeleteRitual();

  const rituals = ritualsData?.data || [];

  const handleDeleteRitual = async (ritualId: string) => {
    if (confirm('Are you sure you want to delete this ritual?')) {
      await deleteRitual.mutateAsync({ teamId, ritualId });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Rituals</CardTitle>
              <CardDescription>
                Recurring meetings and ceremonies for your team
              </CardDescription>
            </div>
            {isOwner && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Ritual
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rituals.map((ritual: TeamRitual) => (
              <div
                key={ritual.id}
                className="p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{ritual.title}</h3>
                      <Badge variant={ritual.is_active ? 'default' : 'secondary'}>
                        {ritual.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      {ritual.rotation_type !== 'none' && (
                        <Badge variant="outline" className="text-xs">
                          {ritual.rotation_type.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>

                    {ritual.description && (
                      <p className="text-sm text-gray-600 mb-3">{ritual.description}</p>
                    )}

                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{ritual.recurrence_rule}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{ritual.duration_minutes} minutes</span>
                      </div>
                      {(ritual.buffer_before > 0 || ritual.buffer_after > 0) && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs">
                            Buffer: {ritual.buffer_before}m before, {ritual.buffer_after}m after
                          </span>
                        </div>
                      )}
                    </div>

                    {ritual.rotation_type !== 'none' && ritual.rotation_order && (
                      <div className="mt-3 flex items-center gap-2">
                        <RotateCw className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          Rotation: {ritual.rotation_order.length} members
                        </span>
                      </div>
                    )}
                  </div>

                  {isOwner && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RotateCw className="h-4 w-4 mr-2" />
                          View Rotation History
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteRitual(ritual.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}

            {rituals.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No rituals yet</p>
                {isOwner && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setShowCreateDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Ritual
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <CreateRitualDialog
        teamId={teamId}
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
    </div>
  );
};
