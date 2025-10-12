'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from 'lucide-react';
import { DEFAULT_CALENDAR_SETTINGS } from '../shared/constants';
import { CalendarSettings } from '../shared/types';
import { GeneralSettings } from './GeneralSettings';
import { AppearanceSettings } from './AppearanceSettings';
import { NotificationSettings } from './NotificationSettings';
import { BehaviorSettings } from './BehaviorSettings';

interface CalendarSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSettings?: Partial<CalendarSettings>;
  onSave?: (settings: CalendarSettings) => void;
}

export function CalendarSettingsDialog({ 
  open, 
  onOpenChange,
  initialSettings,
  onSave,
}: CalendarSettingsDialogProps) {
  const [settings, setSettings] = useState<CalendarSettings>({
    ...DEFAULT_CALENDAR_SETTINGS,
    ...initialSettings,
  });

  const updateSetting = (key: keyof CalendarSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave?.(settings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendar Settings
          </DialogTitle>
          <DialogDescription>
            Customize your calendar preferences and behavior
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
          </TabsList>

          <div className="mt-4 overflow-y-auto max-h-[calc(85vh-200px)]">
            <TabsContent value="general" className="space-y-6">
              <GeneralSettings settings={settings} updateSetting={updateSetting} />
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <AppearanceSettings settings={settings} updateSetting={updateSetting} />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <NotificationSettings settings={settings} updateSetting={updateSetting} />
            </TabsContent>

            <TabsContent value="behavior" className="space-y-6">
              <BehaviorSettings settings={settings} updateSetting={updateSetting} />
            </TabsContent>
          </div>
        </Tabs>

        <Separator />

        <div className="flex items-center justify-between pt-2">
          <Badge variant="outline" className="text-xs">
            Changes are saved automatically
          </Badge>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
