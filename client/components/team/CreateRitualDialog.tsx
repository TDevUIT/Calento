'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useCreateRitual } from '@/hook/team';

const createRitualSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(100),
  description: z.string().max(500).optional(),
  recurrence_rule: z.string().min(1, 'Recurrence rule is required'),
  duration_minutes: z.number().min(15).max(480),
  buffer_before: z.number().min(0).max(60),
  buffer_after: z.number().min(0).max(60),
  rotation_type: z.enum(['none', 'round_robin', 'random', 'load_balanced']),
});

type CreateRitualForm = z.infer<typeof createRitualSchema>;

interface CreateRitualDialogProps {
  teamId: string;
  open: boolean;
  onClose: () => void;
}

export const CreateRitualDialog = ({ teamId, open, onClose }: CreateRitualDialogProps) => {
  const createRitual = useCreateRitual();

  const form = useForm<CreateRitualForm>({
    resolver: zodResolver(createRitualSchema),
    defaultValues: {
      title: '',
      description: '',
      recurrence_rule: 'FREQ=WEEKLY;BYDAY=MO',
      duration_minutes: 60,
      buffer_before: 0,
      buffer_after: 0,
      rotation_type: 'none',
    },
  });

  const onSubmit = async (data: CreateRitualForm) => {
    try {
      await createRitual.mutateAsync({ teamId, data });
      onClose();
      form.reset();
    } catch (error) {
      console.error('Failed to create ritual:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Team Ritual</DialogTitle>
          <DialogDescription>
            Set up a recurring meeting or ceremony for your team
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title*</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Daily Standup" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of this ritual..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="recurrence_rule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recurrence*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FREQ=DAILY">Daily</SelectItem>
                        <SelectItem value="FREQ=WEEKLY;BYDAY=MO">Weekly (Monday)</SelectItem>
                        <SelectItem value="FREQ=WEEKLY;BYDAY=TU">Weekly (Tuesday)</SelectItem>
                        <SelectItem value="FREQ=WEEKLY;BYDAY=WE">Weekly (Wednesday)</SelectItem>
                        <SelectItem value="FREQ=WEEKLY;BYDAY=TH">Weekly (Thursday)</SelectItem>
                        <SelectItem value="FREQ=WEEKLY;BYDAY=FR">Weekly (Friday)</SelectItem>
                        <SelectItem value="FREQ=MONTHLY;BYMONTHDAY=1">Monthly (1st)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>How often this ritual occurs</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)*</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="15"
                        max="480"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Meeting duration</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="buffer_before"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buffer Before (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="60"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buffer_after"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buffer After (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="60"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="rotation_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rotation Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rotation type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Rotation</SelectItem>
                      <SelectItem value="round_robin">Round Robin</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                      <SelectItem value="load_balanced">Load Balanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How to assign responsibility for this ritual
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={createRitual.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createRitual.isPending}>
                {createRitual.isPending ? 'Creating...' : 'Create Ritual'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
