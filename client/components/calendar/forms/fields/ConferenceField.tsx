'use client';

import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Video, X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { EventFormData } from '../event-form.schema';
import { useGoogleAuth } from '@/hook/google/use-google-auth';
import { createGoogleMeet } from '@/service';

interface ConferenceFieldProps {
  form: UseFormReturn<EventFormData>;
}

export function ConferenceField({ form }: ConferenceFieldProps) {
  const conferenceData = form.watch('conference_data');
  const hasConference = !!conferenceData;
  const [isCreating, setIsCreating] = useState(false);
  const { isConnected, isLoading: isCheckingConnection } = useGoogleAuth();

  const addConference = async () => {
    if (!isConnected) {
      toast.error('Cần kết nối Google Account', {
        description: 'Vui lòng kết nối Google Account để tạo Google Meet link',
        action: {
          label: 'Kết nối',
          onClick: () => {
            window.location.href = '/dashboard/calendar-sync';
          },
        },
      });
      return;
    }

    const title = form.getValues('title');
    const startTime = form.getValues('start_time');
    const endTime = form.getValues('end_time');
    const description = form.getValues('description');

    if (!title || !startTime || !endTime) {
      toast.error('Vui lòng điền thông tin sự kiện', {
        description: 'Cần có tiêu đề, thời gian bắt đầu và kết thúc để tạo Google Meet',
      });
      return;
    }

    try {
      setIsCreating(true);
      
      const meetData = await createGoogleMeet({
        summary: title,
        description: description || undefined,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
      });

      form.setValue('conference_data', {
        type: 'google_meet',
        url: meetData.url,
        id: meetData.id,
      });

      toast.success('Google Meet link đã được tạo thành công!');
    } catch (error) {
      console.error('Failed to create Google Meet:', error);
      const errorMessage = (error as Error)?.message || 'Không thể tạo Google Meet link';
      
      if (errorMessage.includes('Not connected')) {
        toast.error('Cần kết nối Google Account', {
          description: 'Vui lòng kết nối lại Google Account',
        });
      } else {
        toast.error('Lỗi khi tạo Google Meet', {
          description: errorMessage,
        });
      }
    } finally {
      setIsCreating(false);
    }
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
          disabled={isCreating || isCheckingConnection}
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang tạo Google Meet...
            </>
          ) : (
            'Add Google Meet video conference'
          )}
        </Button>
        {!isConnected && !isCheckingConnection && (
          <AlertCircle className="h-4 w-4 text-amber-500" />
        )}
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
