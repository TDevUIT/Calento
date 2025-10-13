'use client';

import { UseFormReturn } from 'react-hook-form';
import { TabsContent } from '@/components/ui/tabs';
import type { EventFormData } from '../event-form.schema';
import { AttendeesField } from '../fields/AttendeesField';

interface AttendeesTabProps {
  form: UseFormReturn<EventFormData>;
}

export function AttendeesTab({ form }: AttendeesTabProps) {
  return (
    <TabsContent value="attendees" className="overflow-y-auto px-6 py-6 h-0 flex-1">
      <AttendeesField form={form} />
    </TabsContent>
  );
}
