'use client';

import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, Globe } from 'lucide-react';
import { CalendarSettings } from '@/store/calendar-settings.store';
import {
  TIME_FORMAT_OPTIONS,
  DATE_FORMAT_OPTIONS,
  WEEK_START_OPTIONS,
  VIEW_OPTIONS,
} from '../shared/constants';

interface GeneralSettingsProps {
  settings: CalendarSettings;
  updateSetting: <K extends keyof CalendarSettings>(
    key: K,
    value: CalendarSettings[K]
  ) => void;
  portalContainer?: HTMLElement | null;
}

export function GeneralSettings({ settings, updateSetting, portalContainer }: GeneralSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Default View</Label>
          <p className="text-sm text-muted-foreground">
            Choose your preferred calendar view
          </p>
        </div>
        <Select
          value={settings.defaultView}
          onValueChange={(value) => updateSetting('defaultView', value as CalendarSettings['defaultView'])}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={5} container={portalContainer}>
            {VIEW_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Week Starts On</Label>
          <p className="text-sm text-muted-foreground">
            First day of the week
          </p>
        </div>
        <Select
          value={settings.weekStartsOn}
          onValueChange={(value) => updateSetting('weekStartsOn', value as CalendarSettings['weekStartsOn'])}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={5} container={portalContainer}>
            {WEEK_START_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Time Format
          </Label>
          <p className="text-sm text-muted-foreground">
            12-hour or 24-hour format
          </p>
        </div>
        <Select
          value={settings.timeFormat}
          onValueChange={(value) => updateSetting('timeFormat', value as CalendarSettings['timeFormat'])}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={5} container={portalContainer}>
            {TIME_FORMAT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Date Format
          </Label>
          <p className="text-sm text-muted-foreground">
            How dates are displayed
          </p>
        </div>
        <Select
          value={settings.dateFormat}
          onValueChange={(value) => updateSetting('dateFormat', value as CalendarSettings['dateFormat'])}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={5} container={portalContainer}>
            {DATE_FORMAT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
