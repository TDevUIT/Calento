'use client';

import { useState } from 'react';
import { UserPlus, MoreVertical, Crown, Shield, User, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useTeamMembers,
  useRemoveMember,
  useUpdateMemberRole,
  useAcceptInvitation,
  useDeclineInvitation,
} from '@/hook/team';
import { TeamMember } from '@/interface/team.interface';
import { Skeleton } from '@/components/ui/skeleton';
import { InviteMemberDialog } from './InviteMemberDialog';
import { useCurrentUser } from '@/hook/auth';

interface TeamMembersListProps {
  teamId: string;
  isOwner: boolean;
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'owner':
      return <Crown className="h-4 w-4 text-yellow-600" />;
    case 'admin':
      return <Shield className="h-4 w-4 text-blue-600" />;
    default:
      return <User className="h-4 w-4 text-gray-600" />;
  }
};

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'owner':
      return 'bg-yellow-100 text-yellow-800';
    case 'admin':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-orange-100 text-orange-800';
    case 'declined':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const TeamMembersList = ({ teamId, isOwner }: TeamMembersListProps) => {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const { data: membersData, isLoading } = useTeamMembers(teamId);
  const { data: currentUser } = useCurrentUser();
  const removeMember = useRemoveMember();
  const updateRole = useUpdateMemberRole();
  const acceptInvitation = useAcceptInvitation();
  const declineInvitation = useDeclineInvitation();

  const members = membersData?.data || [];

  const handleRemoveMember = async (memberId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      await removeMember.mutateAsync({ teamId, memberId });
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: 'admin' | 'member') => {
    await updateRole.mutateAsync({ teamId, memberId, data: { role: newRole } });
  };

  const handleAcceptInvitation = async (memberId: string) => {
    await acceptInvitation.mutateAsync({ teamId, memberId });
  };

  const handleDeclineInvitation = async (memberId: string) => {
    await declineInvitation.mutateAsync({ teamId, memberId });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20" />
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
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                {members.length} {members.length === 1 ? 'member' : 'members'}
              </CardDescription>
            </div>
            {isOwner && (
              <Button onClick={() => setShowInviteDialog(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member: TeamMember) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.user?.avatar} />
                    <AvatarFallback>
                      {member.user?.first_name?.[0]}
                      {member.user?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">
                        {member.user?.first_name} {member.user?.last_name}
                      </p>
                      <div className="flex items-center gap-1">
                        {getRoleIcon(member.role)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-600">{member.user?.email}</p>
                      {member.user?.username && (
                        <span className="text-xs text-gray-500">
                          @{member.user.username}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant="secondary"
                        className={getRoleBadgeColor(member.role)}
                      >
                        {member.role}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={getStatusBadgeColor(member.status)}
                      >
                        {member.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {member.status === 'pending' &&
                    member.role !== 'owner' &&
                    currentUser?.id === member.user_id && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAcceptInvitation(member.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeclineInvitation(member.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                      </>
                    )}

                  {isOwner && member.role !== 'owner' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {member.role !== 'admin' && (
                          <DropdownMenuItem
                            onClick={() => handleUpdateRole(member.id, 'admin')}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Make Admin
                          </DropdownMenuItem>
                        )}
                        {member.role === 'admin' && (
                          <DropdownMenuItem
                            onClick={() => handleUpdateRole(member.id, 'member')}
                          >
                            <User className="h-4 w-4 mr-2" />
                            Make Member
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}

            {members.length === 0 && (
              <div className="text-center py-12">
                <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No members yet</p>
                {isOwner && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setShowInviteDialog(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite First Member
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <InviteMemberDialog
        teamId={teamId}
        open={showInviteDialog}
        onClose={() => setShowInviteDialog(false)}
      />
    </div>
  );
};
