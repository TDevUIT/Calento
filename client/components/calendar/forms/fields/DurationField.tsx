'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DurationFieldProps {
  value: number;
  onChange: (minutes: number) => void;
}

const DURATION_OPTIONS = [
  { label: '15 phÃºt', value: 15 },
  { label: '30 phÃºt', value: 30 },
  { label: '45 phÃºt', value: 45 },
  { label: '1 tiáº¿ng', value: 60 },
  { label: '1.5 tiáº¿ng', value: 90 },
  { label: '2 tiáº¿ng', value: 120 },
  { label: '3 tiáº¿ng', value: 180 },
  { label: '4 tiáº¿ng', value: 240 },
  { label: 'Cáº£ ngÃ y', value: 480 },
];

export function DurationField({ value, onChange }: DurationFieldProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap">Thá»i lÆ°á»£ng:</span>
      <Select
        value={value.toString()}
        onValueChange={(val) => onChange(Number(val))}
      >
        <SelectTrigger className="h-9 w-[140px] bg-transparent border border-input hover:bg-accent/50 focus:ring-0 focus:ring-offset-0">
          <SelectValue placeholder="Chá»n thá»i lÆ°á»£ng" />
        </SelectTrigger>
        <SelectContent className="z-[10002]">
          {DURATION_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
