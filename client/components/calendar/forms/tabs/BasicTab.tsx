'use client';

import { UseFormReturn } from 'react-hook-form';
import { TabsContent } from '@/components/ui/tabs';
import type { EventFormData } from '../event-form.schema';
import { TitleField } from '../fields/TitleField';
import { TimeRangeField } from '../fields/TimeRangeField';
import { AllDayField } from '../fields/AllDayField';
import { DescriptionField } from '../fields/DescriptionField';
import { LocationField } from '../fields/LocationField';
import { ColorField } from '../fields/ColorField';

interface BasicTabProps {
  form: UseFormReturn<EventFormData>;
}

export function BasicTab({ form }: BasicTabProps) {
  return (
    <TabsContent value="basic" className="space-y-6 overflow-y-auto px-6 py-6 h-0 flex-1">
      <TitleField form={form} />
      <TimeRangeField form={form} />
      <AllDayField form={form} />
      <DescriptionField form={form} />
      <LocationField form={form} />
      <ColorField form={form} />
    </TabsContent>
  );
}
