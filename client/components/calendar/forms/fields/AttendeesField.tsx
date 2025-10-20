'use client';

import { useState, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Plus, X, Mail, Check, HelpCircle, Clock as ClockIcon, User, Users, Send, Bell, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import type { EventFormData } from '../event-form.schema';

interface AttendeesFieldProps {
  form: UseFormReturn<EventFormData>;
}

export function AttendeesField({ form }: AttendeesFieldProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const attendeesRaw = form.watch('attendees');
  const attendees = useMemo(() => attendeesRaw || [], [attendeesRaw]);

  const stats = useMemo(() => {
    const going = attendees.filter(a => a.response_status === 'accepted').length;
    const maybe = attendees.filter(a => a.response_status === 'tentative').length;
    const pending = attendees.filter(a => a.response_status === 'needsAction').length;
    const declined = attendees.filter(a => a.response_status === 'declined').length;
    return { going, maybe, pending, declined };
  }, [attendees]);

  const addAttendee = () => {
    if (!email) {
      toast.error('Please enter an email');
      return;
    }

    if (attendees.some(a => a.email === email)) {
      toast.error('Email already exists');
      return;
    }

    const newAttendee = {
      email,
      name: name || undefined,
      response_status: 'needsAction' as const,
      is_optional: false,
      is_organizer: false,
    };

    form.setValue('attendees', [...attendees, newAttendee]);
    setEmail('');
    setName('');
    toast.success('Attendee added');
  };

  const removeAttendee = (index: number) => {
    const newAttendees = attendees.filter((_, i) => i !== index);
    form.setValue('attendees', newAttendees);
    toast.success('Attendee removed');
  };

  const statusIcons = {
    accepted: { icon: Check, color: 'text-green-500', label: 'Accepted' },
    declined: { icon: X, color: 'text-red-500', label: 'Declined' },
    tentative: { icon: HelpCircle, color: 'text-yellow-500', label: 'Tentative' },
    needsAction: { icon: ClockIcon, color: 'text-gray-500', label: 'Needs Action' },
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <Label className="text-xl font-bold">Guests</Label>
            <Badge variant="secondary" className="ml-1">{attendees.length}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => toast.info('Send invitations feature')}
              className="gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              Send Invitations
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => toast.info('Reminders feature')}
              className="gap-1.5"
            >
              <Bell className="h-3.5 w-3.5" />
              Reminders ({attendees.length})
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => toast.info('Permissions feature')}
              className="gap-1.5"
            >
              <Shield className="h-3.5 w-3.5" />
              Permissions
            </Button>
          </div>
        </div>

        {/* Stats */}
        {attendees.length > 0 && (
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-600">{stats.going}</span>
              <span className="text-muted-foreground">Going</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-yellow-600">{stats.maybe}</span>
              <span className="text-muted-foreground">Maybe</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1.5">
              <ClockIcon className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-gray-600">{stats.pending}</span>
              <span className="text-muted-foreground">Pending</span>
            </div>
            {stats.declined > 0 && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1.5">
                  <X className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-600">{stats.declined}</span>
                  <span className="text-muted-foreground">Declined</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Add Guest Input */}
      <div className="space-y-3">
        <div className="relative">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              id="attendee-email"
              type="email"
              placeholder="Press Enter or click + to add guests"
              className="pl-10 pr-24 h-12 text-base border-2 focus:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
            />
            <Button 
              type="button" 
              onClick={addAttendee}
              size="icon"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-md"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          {email && (
            <p className="text-xs text-muted-foreground mt-1.5 ml-1">
              Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Enter</kbd> or click + to add
            </p>
          )}
        </div>

        {/* Optional: Display Name */}
        {email && (
          <div className="space-y-2 pl-10">
            <Label htmlFor="attendee-name" className="text-xs text-muted-foreground">
              Display Name (optional)
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                id="attendee-name"
                placeholder="John Doe"
                className="pl-9 h-9 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
              />
            </div>
          </div>
        )}
      </div>

      {attendees.length > 0 && (
        <div className="space-y-3">
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {attendees.map((attendee, index) => {
              const StatusIcon = statusIcons[attendee.response_status || 'needsAction'].icon;

              return (
                <div
                  key={index}
                  className="group flex items-center gap-3 p-3 bg-background border rounded-lg hover:border-primary/50 hover:shadow-sm transition-all"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">
                        {attendee.name || attendee.email}
                      </p>
                      {attendee.is_optional && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0">Optional</Badge>
                      )}
                    </div>
                    {attendee.name && (
                      <p className="text-xs text-muted-foreground truncate">
                        {attendee.email}
                      </p>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        attendee.response_status === 'accepted' ? 'default' :
                        attendee.response_status === 'declined' ? 'destructive' :
                        'secondary'
                      }
                      className="gap-1 text-xs"
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusIcons[attendee.response_status || 'needsAction'].label}
                    </Badge>

                    {/* Remove button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                      onClick={() => removeAttendee(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {attendees.length === 0 && (
        <div className="text-center py-8 px-4 rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/20">
          <Users className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No guests added yet
          </p>
        </div>
      )}
    </div>
  );
}
