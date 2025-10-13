'use client';

import { UseFormReturn } from 'react-hook-form';
import { Check } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import type { EventFormData } from '../event-form.schema';
import { COLOR_OPTIONS } from '../form-constants';

interface ColorFieldProps {
  form: UseFormReturn<EventFormData>;
}

export function ColorField({ form }: ColorFieldProps) {
  return (
    <FormField
      control={form.control}
      name="color"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex items-center gap-2">
              {COLOR_OPTIONS.slice(0, 6).map((color) => {
                const isSelected = field.value === color.value;
                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => field.onChange(color.value)}
                    className={`relative h-7 w-7 rounded-full transition-all hover:scale-110 ${
                      isSelected ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.label}
                  >
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    )}
                  </button>
                );
              })}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
