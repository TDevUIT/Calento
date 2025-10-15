'use client';

import React from 'react';
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
import { useCalendarSettingsStore } from '@/store/calendar-settings.store';
import { GeneralSettings } from './GeneralSettings';
import { AppearanceSettings } from './AppearanceSettings';
import { NotificationSettings } from './NotificationSettings';
import { BehaviorSettings } from './BehaviorSettings';
import { toast } from 'sonner';

interface CalendarSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CalendarSettingsDialog({ 
  open, 
  onOpenChange,
}: CalendarSettingsDialogProps) {
  const defaultView = useCalendarSettingsStore((state) => state.defaultView);
  const weekStartsOn = useCalendarSettingsStore((state) => state.weekStartsOn);
  const timeFormat = useCalendarSettingsStore((state) => state.timeFormat);
  const dateFormat = useCalendarSettingsStore((state) => state.dateFormat);
  const compactMode = useCalendarSettingsStore((state) => state.compactMode);
  const showWeekNumbers = useCalendarSettingsStore((state) => state.showWeekNumbers);
  const highlightWeekends = useCalendarSettingsStore((state) => state.highlightWeekends);
  const enableNotifications = useCalendarSettingsStore((state) => state.enableNotifications);
  const eventReminders = useCalendarSettingsStore((state) => state.eventReminders);
  const reminderTime = useCalendarSettingsStore((state) => state.reminderTime);
  const soundEnabled = useCalendarSettingsStore((state) => state.soundEnabled);
  const autoSync = useCalendarSettingsStore((state) => state.autoSync);
  const showDeclinedEvents = useCalendarSettingsStore((state) => state.showDeclinedEvents);
  const defaultEventDuration = useCalendarSettingsStore((state) => state.defaultEventDuration);
  const enableKeyboardShortcuts = useCalendarSettingsStore((state) => state.enableKeyboardShortcuts);
  
  const updateSetting = useCalendarSettingsStore((state) => state.updateSetting);
  const resetSettings = useCalendarSettingsStore((state) => state.resetSettings);

  const dialogRef = React.useRef<HTMLDivElement>(null);

  const settings = {
    defaultView,
    weekStartsOn,
    timeFormat,
    dateFormat,
    compactMode,
    showWeekNumbers,
    highlightWeekends,
    enableNotifications,
    eventReminders,
    reminderTime,
    soundEnabled,
    autoSync,
    showDeclinedEvents,
    defaultEventDuration,
    enableKeyboardShortcuts,
  };

  const handleReset = () => {
    resetSettings();
    toast.success('Settings reset to default');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent ref={dialogRef} className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendar Settings
          </DialogTitle>
          <DialogDescription>
            Customize your calendar preferences and behavior
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
          </TabsList>

          <div className="mt-4 overflow-y-auto flex-1 pr-2">
            <TabsContent value="general" className="space-y-6">
              <GeneralSettings 
                settings={settings} 
                updateSetting={updateSetting}
                portalContainer={dialogRef.current}
              />
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <AppearanceSettings settings={settings} updateSetting={updateSetting} />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <NotificationSettings 
                settings={settings} 
                updateSetting={updateSetting}
                portalContainer={dialogRef.current}
              />
            </TabsContent>

            <TabsContent value="behavior" className="space-y-6">
              <BehaviorSettings 
                settings={settings} 
                updateSetting={updateSetting}
                portalContainer={dialogRef.current}
              />
            </TabsContent>
          </div>
        </Tabs>

        <Separator />

        <div className="flex items-center justify-between pt-2">
          <Badge variant="outline" className="text-xs">
            Changes are saved automatically
          </Badge>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              Reset to Default
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
