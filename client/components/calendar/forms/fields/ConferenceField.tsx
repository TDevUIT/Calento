'use client';

import { UseFormReturn } from 'react-hook-form';
import { Video, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { EventFormData } from '../event-form.schema';

interface ConferenceFieldProps {
  form: UseFormReturn<EventFormData>;
}

export function ConferenceField({ form }: ConferenceFieldProps) {
  const conferenceData = form.watch('conference_data');
  const hasConference = !!conferenceData;

  const addConference = () => {
    form.setValue('conference_data', {
      type: 'google_meet',
      url: '',
    });
  };

  const removeConference = () => {
    form.setValue('conference_data', undefined);
  };

  if (!hasConference) {
    return (
      <div className="flex items-center gap-3 py-3 border-b border-border/40">
        <div className="h-5 w-5 flex-shrink-0">
          <Video className="h-5 w-5 text-muted-foreground" />
        </div>
        <Button
          type="button"
          variant="ghost"
          className="flex-1 justify-start h-9 px-2 text-sm font-normal text-muted-foreground hover:text-foreground"
          onClick={addConference}
        >
          Add Google Meet video conference
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/40">
      <Video className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      <Input
        type="url"
        placeholder="https://meet.google.com/abc-defg-hij"
        value={conferenceData.url}
        onChange={(e) =>
          form.setValue('conference_data', {
            ...conferenceData,
            url: e.target.value,
          })
        }
        className="flex-1 h-9 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={removeConference}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
