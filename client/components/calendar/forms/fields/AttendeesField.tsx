'use client';

import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Plus, X, Mail, Check, HelpCircle, Clock as ClockIcon, User, UserPlus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomSelect, SelectOption } from '@/components/ui/custom-select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { EventFormData } from '../event-form.schema';

interface AttendeesFieldProps {
  form: UseFormReturn<EventFormData>;
}

export function AttendeesField({ form }: AttendeesFieldProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const attendees = form.watch('attendees') || [];

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

  const updateAttendeeStatus = (index: number, status: string) => {
    const newAttendees = [...attendees];
    newAttendees[index] = {
      ...newAttendees[index],
      response_status: status as any,
    };
    form.setValue('attendees', newAttendees);
  };

  const toggleOptional = (index: number) => {
    const newAttendees = [...attendees];
    newAttendees[index] = {
      ...newAttendees[index],
      is_optional: !newAttendees[index].is_optional,
    };
    form.setValue('attendees', newAttendees);
  };

  const statusIcons = {
    accepted: { icon: Check, color: 'text-green-500', label: 'Accepted' },
    declined: { icon: X, color: 'text-red-500', label: 'Declined' },
    tentative: { icon: HelpCircle, color: 'text-yellow-500', label: 'Tentative' },
    needsAction: { icon: ClockIcon, color: 'text-gray-500', label: 'Needs Action' },
  };

  const statusOptions: SelectOption[] = Object.entries(statusIcons).map(([key, { icon: Icon, color, label }]) => ({
    value: key,
    label,
    icon: <Icon className={`h-4 w-4 ${color}`} />,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mt-1">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <Label className="text-xl font-bold">Attendees</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Add email addresses of people you want to invite to this event
          </p>
        </div>
      </div>

      <div className="space-y-4 p-5 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors">
        <div className="flex items-center gap-2 mb-3">
          <UserPlus className="h-4 w-4 text-primary" />
          <Label className="text-base font-semibold">Add New Person</Label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="attendee-email" className="text-sm font-medium">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="attendee-email"
                type="email"
                placeholder="example@email.com"
                className="pl-10 h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="attendee-name" className="text-sm font-medium">Display Name (optional)</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="attendee-name"
                placeholder="John Doe"
                className="pl-10 h-11"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
              />
            </div>
          </div>
        </div>
        <Button 
          type="button" 
          onClick={addAttendee} 
          className="w-full h-11 text-base font-medium" 
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add to List
        </Button>
      </div>

      {attendees.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            List ({attendees.length} people)
          </Label>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {attendees.map((attendee, index) => {
              const StatusIcon = statusIcons[attendee.response_status || 'needsAction'].icon;
              const statusColor = statusIcons[attendee.response_status || 'needsAction'].color;

              return (
                <div
                  key={index}
                  className="group flex items-start gap-4 p-4 bg-background border-2 rounded-xl hover:border-primary/50 hover:shadow-md transition-all"
                >
                  <div className="relative flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-background">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-background flex items-center justify-center ${
                      attendee.response_status === 'accepted' ? 'bg-green-500' :
                      attendee.response_status === 'declined' ? 'bg-red-500' :
                      attendee.response_status === 'tentative' ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`}>
                      <StatusIcon className="h-3 w-3 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div>
                      <p className="font-semibold text-base truncate">
                        {attendee.name || attendee.email}
                      </p>
                      {attendee.name && (
                        <p className="text-sm text-muted-foreground truncate flex items-center gap-1.5 mt-0.5">
                          <Mail className="h-3.5 w-3.5" />
                          {attendee.email}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <CustomSelect
                        value={attendee.response_status || 'needsAction'}
                        onValueChange={(value) => updateAttendeeStatus(index, value)}
                        options={statusOptions}
                        placeholder="Select status"
                        className="w-[160px]"
                      />

                      <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg border hover:bg-accent cursor-pointer transition-colors">
                        <Checkbox
                          checked={attendee.is_optional}
                          onCheckedChange={() => toggleOptional(index)}
                        />
                        <span className="text-sm font-medium">Optional</span>
                      </label>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeAttendee(index)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {attendees.length === 0 && (
        <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-muted-foreground/20">
          <div className="max-w-sm mx-auto">
            <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <p className="text-base font-medium text-muted-foreground mb-1">
              No attendees yet
            </p>
            <p className="text-sm text-muted-foreground/70">
              Add email addresses above to invite people to this event
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
