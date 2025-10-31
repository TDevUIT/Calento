'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Users, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useTeams, useOwnedTeams } from '@/hook/team';
import { PROTECTED_ROUTES } from '@/constants/routes';
import { TeamCard } from '@/components/team/TeamCard';
import { CreateTeamDialog } from '@/components/team/CreateTeamDialog';
import { Skeleton } from '@/components/ui/skeleton';

const TeamsPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const { data: allTeamsData, isLoading: isLoadingAll } = useTeams();
  const { data: ownedTeamsData, isLoading: isLoadingOwned } = useOwnedTeams();

  const allTeams = allTeamsData?.data || [];
  const ownedTeams = ownedTeamsData?.data || [];

  const filteredAllTeams = allTeams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOwnedTeams = ownedTeams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTeamClick = (teamId: string) => {
    router.push(PROTECTED_ROUTES.TEAM_DETAIL(teamId));
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
              <p className="text-sm text-gray-600 mt-1">
                Collaborate with your team members and manage rituals
              </p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Team
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">
                All Teams ({allTeams.length})
              </TabsTrigger>
              <TabsTrigger value="owned">
                My Teams ({ownedTeams.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {isLoadingAll ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-48" />
                  ))}
                </div>
              ) : filteredAllTeams.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Users className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {searchQuery ? 'No teams found' : 'No teams yet'}
                    </h3>
                    <p className="text-sm text-gray-600 text-center max-w-md mb-6">
                      {searchQuery
                        ? 'Try adjusting your search criteria'
                        : 'Create your first team to start collaborating with others'}
                    </p>
                    {!searchQuery && (
                      <Button onClick={() => setShowCreateDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Team
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAllTeams.map((team) => (
                    <TeamCard
                      key={team.id}
                      team={team}
                      onClick={() => handleTeamClick(team.id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="owned" className="mt-6">
              {isLoadingOwned ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-48" />
                  ))}
                </div>
              ) : filteredOwnedTeams.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Users className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {searchQuery ? 'No teams found' : 'No teams owned yet'}
                    </h3>
                    <p className="text-sm text-gray-600 text-center max-w-md mb-6">
                      {searchQuery
                        ? 'Try adjusting your search criteria'
                        : 'Create a team to manage members and rituals'}
                    </p>
                    {!searchQuery && (
                      <Button onClick={() => setShowCreateDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Team
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOwnedTeams.map((team) => (
                    <TeamCard
                      key={team.id}
                      team={team}
                      onClick={() => handleTeamClick(team.id)}
                      isOwner
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CreateTeamDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
    </div>
  );
};

export default TeamsPage;
