'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle2 } from 'lucide-react';
import { CalendarSettings } from '@/store/calendar-settings.store';
import { EVENT_DURATION_OPTIONS } from '../shared/constants';

interface BehaviorSettingsProps {
  settings: CalendarSettings;
  updateSetting: <K extends keyof CalendarSettings>(
    key: K,
    value: CalendarSettings[K]
  ) => void;
  portalContainer?: HTMLElement | null;
}

export function BehaviorSettings({ settings, updateSetting, portalContainer }: BehaviorSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Auto Sync
          </Label>
          <p className="text-sm text-muted-foreground">
            Automatically sync with Google Calendar
          </p>
        </div>
        <Switch
          checked={settings.autoSync}
          onCheckedChange={(checked) => updateSetting('autoSync', checked)}
        />
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Show Declined Events</Label>
          <p className="text-sm text-muted-foreground">
            Display events you&apos;ve declined
          </p>
        </div>
        <Switch
          checked={settings.showDeclinedEvents}
          onCheckedChange={(checked) => updateSetting('showDeclinedEvents', checked)}
        />
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Default Event Duration</Label>
          <p className="text-sm text-muted-foreground">
            Default length for new events
          </p>
        </div>
        <Select
          value={settings.defaultEventDuration}
          onValueChange={(value) => updateSetting('defaultEventDuration', value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={5} container={portalContainer}>
            {EVENT_DURATION_OPTIONS.map((option) => (
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
          <Label>Keyboard Shortcuts</Label>
          <p className="text-sm text-muted-foreground">
            Enable keyboard navigation
          </p>
        </div>
        <Switch
          checked={settings.enableKeyboardShortcuts}
          onCheckedChange={(checked) => updateSetting('enableKeyboardShortcuts', checked)}
        />
      </div>
    </div>
  );
}
