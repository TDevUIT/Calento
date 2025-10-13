'use client';

import { UseFormReturn } from 'react-hook-form';
import { TabsContent } from '@/components/ui/tabs';
import type { EventFormData } from '../event-form.schema';
import { VisibilityField } from '../fields/VisibilityField';
import { RecurrenceField } from '../fields/RecurrenceField';

interface AdvancedTabProps {
  form: UseFormReturn<EventFormData>;
}

export function AdvancedTab({ form }: AdvancedTabProps) {
  return (
    <TabsContent value="advanced" className="space-y-6 overflow-y-auto px-6 py-6 h-0 flex-1">
      <VisibilityField form={form} />
      <RecurrenceField form={form} />
    </TabsContent>
  );
}
