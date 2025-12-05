"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useUpdateAvailability } from "@/hook";
import type { Availability } from "@/interface";
import { DayOfWeek, DAY_NAMES } from "@/interface";

interface EditAvailabilityDialogProps {
  availability: Availability | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditAvailabilityDialog = ({
  availability,
  open,
  onOpenChange,
}: EditAvailabilityDialogProps) => {
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(DayOfWeek.MONDAY);
  const [startTime, setStartTime] = useState("09:00:00");
  const [endTime, setEndTime] = useState("17:00:00");
  const [isActive, setIsActive] = useState(true);

  const updateMutation = useUpdateAvailability();

  useEffect(() => {
    if (availability) {
      setDayOfWeek(availability.day_of_week);
      setStartTime(availability.start_time);
      setEndTime(availability.end_time);
      setIsActive(availability.is_active);
    }
  }, [availability]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!availability) return;

    updateMutation.mutate(
      {
        id: availability.id,
        data: {
          day_of_week: dayOfWeek,
          start_time: startTime,
          end_time: endTime,
          is_active: isActive,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  if (!availability) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Availability Rule</DialogTitle>
          <DialogDescription>
            Update your availability for meetings and events.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="day">Day of Week</Label>
            <Select
              value={dayOfWeek.toString()}
              onValueChange={(value) => setDayOfWeek(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DAY_NAMES).map(([key, name]) => (
                  <SelectItem key={key} value={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime.slice(0, 5)}
                onChange={(e) => setStartTime(e.target.value + ":00")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={endTime.slice(0, 5)}
                onChange={(e) => setEndTime(e.target.value + ":00")}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="active">Active</Label>
            <Switch
              id="active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
