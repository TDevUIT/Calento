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
import { Palette, Sun, Moon, Monitor } from 'lucide-react';
import { CalendarSettings } from '../shared/types';

interface AppearanceSettingsProps {
  settings: CalendarSettings;
  updateSetting: (key: keyof CalendarSettings, value: string | boolean) => void;
}

export function AppearanceSettings({ settings, updateSetting }: AppearanceSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Theme
          </Label>
          <p className="text-sm text-muted-foreground">
            Choose your color theme
          </p>
        </div>
        <Select
          value={settings.theme}
          onValueChange={(value) => updateSetting('theme', value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                Light
              </div>
            </SelectItem>
            <SelectItem value="dark">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                Dark
              </div>
            </SelectItem>
            <SelectItem value="system">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                System
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

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
