'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface PendingAction {
  id: string;
  type: string;
  title: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parameters: Record<string, any>;
  analysis?: {
    match_score?: number;
    conflicts?: string[];
    suggestions?: string[];
    availability?: {
      checked_calendars: number;
      available_slots: number;
      best_time?: string;
    };
    members?: {
      name: string;
      available: boolean;
    }[];
  };
}

interface ActionConfirmationDialogProps {
  open: boolean;
  action: PendingAction | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ActionConfirmationDialog = ({
  open,
  action,
  onConfirm,
  onCancel,
}: ActionConfirmationDialogProps) => {
  if (!action) return null;

  const renderAnalysis = () => {
    if (!action.analysis) return null;

    const { match_score, conflicts, availability, members } = action.analysis;

    return (
      <div className="space-y-4 mt-4">
        {/* AI Analysis Header */}
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <span>AI Analysis</span>
        </div>

        {/* Match Score */}
        {match_score !== undefined && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Match Score</span>
              <span className="text-sm font-semibold text-gray-900">{match_score}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  match_score >= 90
                    ? 'bg-green-500'
                    : match_score >= 70
                    ? 'bg-blue-500'
                    : 'bg-yellow-500'
                }`}
                style={{ width: `${match_score}%` }}
              />
            </div>
          </div>
        )}

        {/* Availability Info */}
        {availability && (
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">
                Checked {availability.checked_calendars} team member calendar{availability.checked_calendars > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">
                Identified {availability.available_slots} mutual availability window{availability.available_slots > 1 ? 's' : ''}
              </span>
            </div>
            {availability.best_time && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">
                  {availability.best_time} - Peak productivity time
                </span>
              </div>
            )}
          </div>
        )}

        {/* Members Availability */}
        {members && members.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Users className="h-4 w-4" />
              <span>Team Availability</span>
            </div>
            <div className="space-y-1">
              {members.map((member, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 px-3 rounded-md bg-gray-50">
                  <span className="text-sm text-gray-900">{member.name}</span>
                  {member.available ? (
                    <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                      Busy
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conflicts */}
        {conflicts && conflicts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-900">Conflicts Found</span>
            </div>
            <ul className="space-y-1">
              {conflicts.map((conflict, idx) => (
                <li key={idx} className="text-sm text-yellow-800 flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span>{conflict}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderEventDetails = () => {
    if (action.type !== 'createEvent') return null;

    const { parameters } = action;

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-semibold text-gray-900 mb-1">
              {parameters.title || action.title}
            </h4>
            {parameters.description && (
              <p className="text-sm text-gray-600 mb-3">{parameters.description}</p>
            )}
            
            <div className="space-y-2">
              {parameters.start_time && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>
                    {new Date(parameters.start_time).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                    {' • '}
                    {new Date(parameters.start_time).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                    {' - '}
                    {parameters.end_time && new Date(parameters.end_time).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
              
              {parameters.attendees && parameters.attendees.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{parameters.attendees.length} member{parameters.attendees.length > 1 ? 's' : ''} • 100% available</span>
                </div>
              )}
              
              {parameters.location && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{parameters.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{action.title}</span>
          </DialogTitle>
          <DialogDescription>
            {action.description || 'Please review the details and confirm to proceed'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {renderEventDetails()}
          {renderAnalysis()}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <CheckCircle2 className="h-4 w-4" />
            Schedule Meeting
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
