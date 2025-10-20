'use client';

import { useState } from 'react';
import { Plus, Users, Settings, Mail, Send, Bell } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { GuestItem } from './GuestItem';
import type { EventFormData } from '../event-form.schema';
import type { EventAttendee } from '@/interface/event.interface';

interface GuestsFieldProps {
  form: UseFormReturn<EventFormData>;
  eventId?: string; // For editing existing events
  onSendInvitations?: () => void;
  onSendReminders?: () => void;
  showInvitationActions?: boolean;
}

export function GuestsField({ 
  form, 
  eventId,
  onSendInvitations,
  onSendReminders,
  showInvitationActions = false,
}: GuestsFieldProps) {
  const [guestEmail, setGuestEmail] = useState('');
  const [showPermissions, setShowPermissions] = useState(false);
  const [guestPermissions, setGuestPermissions] = useState({
    canModifyEvent: true,
    canInviteOthers: true,
    canSeeGuestList: true,
  });

  const attendees = form.watch('attendees') || [];

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addGuest = () => {
    const email = guestEmail.trim();
    
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (attendees.some(a => a.email.toLowerCase() === email.toLowerCase())) {
      toast.error('This email is already in the guest list');
      return;
    }

    const newAttendee: EventAttendee = {
      email: email.toLowerCase(),
      response_status: 'needsAction',
      is_optional: false,
      is_organizer: false,
    };

    form.setValue('attendees', [...attendees, newAttendee]);
    setGuestEmail('');
    toast.success('Guest added successfully');
  };

  const removeGuest = (index: number) => {
    const updatedAttendees = attendees.filter((_, i) => i !== index);
    form.setValue('attendees', updatedAttendees);
    toast.success('Guest removed');
  };

  const updateGuest = (index: number, updatedAttendee: EventAttendee) => {
    const updatedAttendees = [...attendees];
    updatedAttendees[index] = updatedAttendee;
    form.setValue('attendees', updatedAttendees);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addGuest();
    }
  };

  const getGuestStats = () => {
    const total = attendees.length;
    const going = attendees.filter(a => a.response_status === 'accepted').length;
    const pending = attendees.filter(a => a.response_status === 'needsAction').length;
    const maybe = attendees.filter(a => a.response_status === 'tentative').length;
    const notGoing = attendees.filter(a => a.response_status === 'declined').length;

    return { total, going, pending, maybe, notGoing };
  };

  const stats = getGuestStats();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-base font-semibold">Guests</h3>
          {attendees.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {attendees.length}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showInvitationActions && eventId && attendees.length > 0 && (
            <>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={onSendInvitations}
                className="text-xs"
              >
                <Send className="h-4 w-4 mr-1" />
                Gá»­i lá»i má»i
              </Button>
              {stats.pending > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onSendReminders}
                  className="text-xs"
                >
                  <Bell className="h-4 w-4 mr-1" />
                  Nháº¯c nhá»Ÿ ({stats.pending})
                </Button>
              )}
            </>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPermissions(!showPermissions)}
            className="text-xs"
          >
            <Settings className="h-4 w-4 mr-1" />
            Quyá»n
          </Button>
        </div>
      </div>

      {/* Add Guest Input */}
      <div className="space-y-2">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Add guests by email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              onKeyDown={handleKeyPress}
              className="pl-10 h-10"
            />
          </div>
          <Button
            type="button"
            onClick={addGuest}
            size="sm"
            className="px-3 h-10 w-10"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Press Enter or click + to add guests
        </p>
      </div>

      {/* Guest Stats */}
      {attendees.length > 0 && (
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            {stats.going} Going
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            {stats.maybe} Maybe
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            {stats.pending} Pending
          </span>
          {stats.notGoing > 0 && (
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              {stats.notGoing} Not going
            </span>
          )}
        </div>
      )}

      {/* Guest List */}
      {attendees.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {attendees.map((attendee, index) => (
            <GuestItem
              key={`${attendee.email}-${index}`}
              attendee={attendee}
              index={index}
              onRemove={removeGuest}
              onUpdate={updateGuest}
              isOrganizer={attendee.is_organizer}
              showPermissions={showPermissions}
            />
          ))}
        </div>
      )}

      {/* Guest Permissions */}
      {showPermissions && (
        <>
          <Separator />
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Guest permissions</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="modify-event"
                  checked={guestPermissions.canModifyEvent}
                  onCheckedChange={(checked) =>
                    setGuestPermissions(prev => ({ ...prev, canModifyEvent: !!checked }))
                  }
                />
                <label htmlFor="modify-event" className="text-sm cursor-pointer">
                  Modify event
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="invite-others"
                  checked={guestPermissions.canInviteOthers}
                  onCheckedChange={(checked) =>
                    setGuestPermissions(prev => ({ ...prev, canInviteOthers: !!checked }))
                  }
                />
                <label htmlFor="invite-others" className="text-sm cursor-pointer">
                  Invite others
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="see-guest-list"
                  checked={guestPermissions.canSeeGuestList}
                  onCheckedChange={(checked) =>
                    setGuestPermissions(prev => ({ ...prev, canSeeGuestList: !!checked }))
                  }
                />
                <label htmlFor="see-guest-list" className="text-sm cursor-pointer">
                  See guest list
                </label>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground">
              These permissions apply to all guests in this event
            </p>
          </div>
        </>
      )}

      {attendees.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No guests added yet</p>
          <p className="text-xs">Add guests by entering their email addresses above</p>
        </div>
      )}
    </div>
  );
}
