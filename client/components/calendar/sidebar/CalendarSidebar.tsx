'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles, Calendar, Users } from 'lucide-react';
import { SidebarHeader } from './SidebarHeader';
import { CalendarListWithAPI } from './CalendarListWithAPI';
import { EventsList } from './EventsList';
import { CreateCalendarDialog } from '../dialogs/CreateCalendarDialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useTeams } from '@/hook/team/use-teams';
import type { Team } from '@/interface';

interface CalendarSidebarProps {
  onDateSelect?: (date: Date) => void;
  onCreateEvent?: () => void;
  onClose?: () => void;
  selectedDate?: Date;
  visibleCalendarIds?: Set<string>;
  onVisibleCalendarIdsChange?: (ids: Set<string>) => void;
  visibleTeamIds?: Set<string>;
  onVisibleTeamIdsChange?: (ids: Set<string>) => void;
}

export function CalendarSidebar({ 
 
  onCreateEvent, 
  onClose, 
  visibleCalendarIds,
  onVisibleCalendarIdsChange,
  visibleTeamIds,
  onVisibleTeamIdsChange
}: CalendarSidebarProps) {
  const [activeTab, setActiveTab] = useState<'calendar' | 'events'>('calendar');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateCalendarDialog, setShowCreateCalendarDialog] = useState(false);

  const { data: teamsResponse } = useTeams();
  const teams: Team[] = useMemo(() => teamsResponse?.data || [], [teamsResponse]);

  const [localVisibleTeamIds, setLocalVisibleTeamIds] = useState<Set<string>>(new Set());
  const effectiveVisibleTeamIds = visibleTeamIds || localVisibleTeamIds;
  const setEffectiveVisibleTeamIds = onVisibleTeamIdsChange || setLocalVisibleTeamIds;

  const toggleTeam = (id: string) => {
    // Empty set means: no team filter active (show all events, including personal).
    // When user toggles, we switch to explicit selection mode.
    const base = effectiveVisibleTeamIds.size === 0
      ? new Set(teams.map(t => t.id))
      : new Set(effectiveVisibleTeamIds);

    if (base.has(id)) base.delete(id);
    else base.add(id);

    setEffectiveVisibleTeamIds(base);
  };

  return (
    <div className="h-full flex flex-col bg-white shadow-xl border-l overflow-hidden">
      <SidebarHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClose={onClose}
      />

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        {activeTab === 'calendar' ? (
          <div className="p-4 space-y-3">
            <Button 
              onClick={onCreateEvent} 
              className="w-full gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              <span className="font-medium">Create Event</span>
              <Sparkles className="h-3.5 w-3.5 ml-auto" />
            </Button>

            <Button 
              onClick={() => setShowCreateCalendarDialog(true)} 
              variant="outline"
              className="w-full gap-2 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
            >
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Create Calendar</span>
              <Plus className="h-3.5 w-3.5 ml-auto" />
            </Button>

            <CalendarListWithAPI 
              onCreateCalendar={() => setShowCreateCalendarDialog(true)}
              visibleCalendarIds={visibleCalendarIds}
              onVisibleCalendarIdsChange={onVisibleCalendarIdsChange}
            />

            {teams.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700">Teams</h3>
                  <span className="text-xs text-gray-500">({teams.length})</span>
                </div>
                <div className="space-y-1">
                  {teams.map((team) => {
                    const isVisible = effectiveVisibleTeamIds.size === 0 || effectiveVisibleTeamIds.has(team.id);
                    return (
                      <div
                        key={team.id}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <Checkbox
                          id={`team-${team.id}`}
                          checked={isVisible}
                          onCheckedChange={() => toggleTeam(team.id)}
                          className="data-[state=checked]:bg-blue-600"
                        />
                        <Users className="h-4 w-4 text-gray-600 shrink-0" />
                        <label
                          htmlFor={`team-${team.id}`}
                          className={
                            isVisible
                              ? 'text-sm text-gray-900 font-medium truncate cursor-pointer select-none'
                              : 'text-sm text-gray-500 truncate cursor-pointer select-none'
                          }
                        >
                          {team.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <EventsList visibleCalendarIds={visibleCalendarIds} visibleTeamIds={effectiveVisibleTeamIds} />
        )}
      </div>

      <CreateCalendarDialog 
        open={showCreateCalendarDialog}
        onOpenChange={setShowCreateCalendarDialog}
      />
    </div>
  );
}
