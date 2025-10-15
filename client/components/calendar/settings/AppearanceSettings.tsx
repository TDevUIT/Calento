'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { CalendarSettings } from '@/store/calendar-settings.store';

interface AppearanceSettingsProps {
  settings: CalendarSettings;
  updateSetting: <K extends keyof CalendarSettings>(
    key: K,
    value: CalendarSettings[K]
  ) => void;
}

export function AppearanceSettings({ settings, updateSetting }: AppearanceSettingsProps) {
  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Compact Mode</Label>
          <p className="text-sm text-muted-foreground">
            Reduce spacing for more content
          </p>
        </div>
        <Switch
          checked={settings.compactMode}
          onCheckedChange={(checked) => updateSetting('compactMode', checked)}
        />
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Show Week Numbers</Label>
          <p className="text-sm text-muted-foreground">
            Display week numbers in month view
          </p>
        </div>
        <Switch
          checked={settings.showWeekNumbers}
          onCheckedChange={(checked) => updateSetting('showWeekNumbers', checked)}
        />
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Highlight Weekends</Label>
          <p className="text-sm text-muted-foreground">
            Different color for Saturday & Sunday
          </p>
        </div>
        <Switch
          checked={settings.highlightWeekends}
          onCheckedChange={(checked) => updateSetting('highlightWeekends', checked)}
        />
      </div>
    </div>
  );
}
