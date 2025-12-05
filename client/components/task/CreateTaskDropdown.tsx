"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Minus, Calendar as CalendarIcon, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTask } from "@/hook/task";
import { TaskPriority, TaskStatus } from "@/interface";

const taskSchema = z.object({
  title: z.string().min(1, "Task title is required").max(200),
  duration: z.number().min(15).max(480),
  min_duration: z.number().min(15).optional(),
  max_duration: z.number().max(480).optional(),
  priority: z.nativeEnum(TaskPriority),
  schedule_after: z.string().optional(),
  due_date: z.string().optional(),
  notes: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface CreateTaskDropdownProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export const CreateTaskDropdown = ({
  open: controlledOpen,
  onOpenChange,
  children,
}: CreateTaskDropdownProps = {}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [showNoteArea, setShowNoteArea] = useState(false);
  const { mutate: createTask, isPending } = useCreateTask();
  const popoverRef = useRef<HTMLDivElement>(null);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      duration: 60,
      min_duration: 30,
      max_duration: 120,
      priority: TaskPriority.MEDIUM,
      schedule_after: "",
      due_date: "",
      notes: "",
    },
  });

  const duration = form.watch("duration");

  const handleDurationChange = (increment: number) => {
    const newDuration = Math.max(15, Math.min(480, duration + increment));
    form.setValue("duration", newDuration);
  };

  const onSubmit = (data: TaskFormValues) => {
    const taskData = {
      title: data.title,
      priority: data.priority,
      status: TaskStatus.TODO,
      estimated_duration: data.duration,
      schedule_after: data.schedule_after || undefined,
      due_date: data.due_date || undefined,
      notes: data.notes || undefined,
    };

    createTask(taskData, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
      },
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} mins`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} hr ${mins} mins` : `${hours} hr`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {controlledOpen === undefined ? (
        <PopoverTrigger asChild>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </PopoverTrigger>
      ) : children ? (
        <PopoverTrigger asChild>
          {children}
        </PopoverTrigger>
      ) : null}
      <PopoverContent
        ref={popoverRef}
        className="w-[400px] p-0 bg-white border shadow-2xl !z-[99999]"
        align="end"
        side="bottom"
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div className="flex items-center justify-end -mt-2 -mr-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Input
              placeholder="Task name..."
              {...form.register("title")}
              className="border-2 border-blue-500 focus:border-blue-600"
            />
            {form.formState.errors.title && (
              <p className="text-xs text-red-500">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-gray-600">Duration</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center justify-between px-3 py-2 border rounded-md">
                <span className="text-sm">{formatDuration(duration)}</span>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleDurationChange(-15)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleDurationChange(15)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Min duration</Label>
              <Input
                type="number"
                placeholder="30 mins"
                {...form.register("min_duration", { valueAsNumber: true })}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Max duration</Label>
              <Input
                type="number"
                placeholder="2 hrs"
                {...form.register("max_duration", { valueAsNumber: true })}
                className="text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-gray-600">Priority</Label>
            <Select
              value={form.watch("priority")}
              onValueChange={(value) =>
                form.setValue("priority", value as TaskPriority)
              }
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent container={popoverRef.current} className="!z-[100000]">
                <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
                <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
                <SelectItem value={TaskPriority.CRITICAL}>Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Schedule after</Label>
              <Input
                type="datetime-local"
                {...form.register("schedule_after")}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Due date</Label>
              <Input
                type="datetime-local"
                {...form.register("due_date")}
                className="text-sm"
              />
            </div>
          </div>

          {showNoteArea && (
            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Notes</Label>
              <Textarea
                placeholder="Add notes..."
                {...form.register("notes")}
                className="text-sm resize-none"
                rows={3}
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400"
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 transition-colors ${
                  showNoteArea ? "text-blue-600" : "text-gray-400"
                }`}
                onClick={() => setShowNoteArea(!showNoteArea)}
              >
                <FileText className="h-4 w-4" />
              </Button>
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};
