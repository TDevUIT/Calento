'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Team } from '@/interface/team.interface';
import { Users, Clock, Shield } from 'lucide-react';

interface TeamOverviewProps {
  team: Team;
}

export const TeamOverview = ({ team }: TeamOverviewProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Information</CardTitle>
          <CardDescription>General details about your team</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Team Name</label>
              <p className="mt-1 text-gray-900">{team.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Timezone</label>
              <p className="mt-1 text-gray-900">{team.timezone}</p>
            </div>
          </div>

          {team.description && (
            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <p className="mt-1 text-gray-600">{team.description}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <p className="mt-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                  team.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {team.is_active ? 'Active' : 'Inactive'}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Settings</CardTitle>
          <CardDescription>Configure team collaboration features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Auto Buffer</p>
                <p className="text-xs text-gray-600">
                  {team.settings.auto_buffer_enabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>

            {team.settings.auto_buffer_enabled && (
              <>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded">
                    <Clock className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Buffer Before</p>
                    <p className="text-xs text-gray-600">
                      {team.settings.buffer_before_minutes || 0} minutes
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded">
                    <Clock className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Buffer After</p>
                    <p className="text-xs text-gray-600">
                      {team.settings.buffer_after_minutes || 0} minutes
                    </p>
                  </div>
                </div>
              </>
            )}

            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded">
                <Users className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Member Invites</p>
                <p className="text-xs text-gray-600">
                  {team.settings.allow_member_invites ? 'Allowed' : 'Not allowed'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded">
                <Shield className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Require Approval</p>
                <p className="text-xs text-gray-600">
                  {team.settings.require_approval ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
