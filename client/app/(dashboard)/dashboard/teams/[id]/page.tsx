'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Settings, Users as UsersIcon, Calendar, TrendingUp, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTeamDetail, useLeaveTeam } from '@/hook/team';
import { useCurrentUser } from '@/hook/store/use-auth-store';
import { PROTECTED_ROUTES } from '@/constants/routes';
import { TeamOverview } from '@/components/team/TeamOverview';
import { TeamMembersList } from '@/components/team/TeamMembersList';
import { TeamRitualsList } from '@/components/team/TeamRitualsList';
import { TeamAvailability } from '@/components/team/TeamAvailability';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';


const TeamDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;

  const { data: teamData, isLoading } = useTeamDetail(teamId);
  const { user: currentUser } = useCurrentUser();
  const leaveTeam = useLeaveTeam();

  const team = teamData?.data;

  const handleLeaveTeam = async () => {
    try {
      await leaveTeam.mutateAsync(teamId);
      router.push(PROTECTED_ROUTES.DASHBOARD_TEAMS);
    } catch (error) {
      console.error('Failed to leave team:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="flex-1 p-6">
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Team not found</h2>
        <Button onClick={() => router.push(PROTECTED_ROUTES.DASHBOARD_TEAMS)}>
          Back to Teams
        </Button>
      </div>
    );
  }

  const isOwner = currentUser?.id === team.owner_id;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(PROTECTED_ROUTES.DASHBOARD_TEAMS)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Teams
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
              {team.description && (
                <p className="text-sm text-gray-600 mt-1">{team.description}</p>
              )}
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs text-gray-500">
                  Timezone: {team.timezone}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    team.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {team.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isOwner && (
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              )}
              {!isOwner && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">
                      <LogOut className="h-4 w-4 mr-2" />
                      Leave Team
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Leave Team</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to leave this team? You will need to be invited again to rejoin.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLeaveTeam}>
                        Leave Team
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">
                Overview
              </TabsTrigger>
              <TabsTrigger value="members">
                <UsersIcon className="h-4 w-4 mr-2" />
                Members
              </TabsTrigger>
              <TabsTrigger value="rituals">
                <Calendar className="h-4 w-4 mr-2" />
                Rituals
              </TabsTrigger>
              <TabsTrigger value="availability">
                <TrendingUp className="h-4 w-4 mr-2" />
                Availability
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <TeamOverview team={team} />
            </TabsContent>

            <TabsContent value="members" className="mt-6">
              <TeamMembersList teamId={teamId} isOwner={isOwner} />
            </TabsContent>

            <TabsContent value="rituals" className="mt-6">
              <TeamRitualsList teamId={teamId} isOwner={isOwner} />
            </TabsContent>

            <TabsContent value="availability" className="mt-6">
              <TeamAvailability />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TeamDetailPage;
