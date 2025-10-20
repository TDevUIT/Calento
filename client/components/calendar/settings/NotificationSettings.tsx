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
import { Bell } from 'lucide-react';
import { CalendarSettings } from '@/store/calendar-settings.store';
import { REMINDER_TIME_OPTIONS } from '../shared/constants';

interface NotificationSettingsProps {
  settings: CalendarSettings;
  updateSetting: <K extends keyof CalendarSettings>(
    key: K,
    value: CalendarSettings[K]
  ) => void;
  portalContainer?: HTMLElement | null;
}

export function NotificationSettings({ settings, updateSetting, portalContainer }: NotificationSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Enable Notifications
          </Label>
          <p className="text-sm text-muted-foreground">
            Receive desktop notifications
          </p>
        </div>
        <Switch
          checked={settings.enableNotifications}
          onCheckedChange={(checked) => updateSetting('enableNotifications', checked)}
        />
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Event Reminders</Label>
          <p className="text-sm text-muted-foreground">
            Get reminded before events start
          </p>
        </div>
        <Switch
          checked={settings.eventReminders}
          onCheckedChange={(checked) => updateSetting('eventReminders', checked)}
          disabled={!settings.enableNotifications}
        />
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Default Reminder Time</Label>
          <p className="text-sm text-muted-foreground">
            How early to remind you
          </p>
        </div>
        <Select
          value={settings.reminderTime}
          onValueChange={(value) => updateSetting('reminderTime', value)}
          disabled={!settings.eventReminders}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={5} container={portalContainer}>
            {REMINDER_TIME_OPTIONS.map((option) => (
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
          <Label>Sound Notifications</Label>
          <p className="text-sm text-muted-foreground">
            Play sound with notifications
          </p>
        </div>
        <Switch
          checked={settings.soundEnabled}
          onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
          disabled={!settings.enableNotifications}
        />
      </div>
    </div>
  );
}
