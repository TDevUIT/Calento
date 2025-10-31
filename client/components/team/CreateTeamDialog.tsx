'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useCreateTeam } from '@/hook/team';
import { PROTECTED_ROUTES } from '@/constants/routes';

const createTeamSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().max(500).optional(),
  timezone: z.string(),
  settings: z.object({
    auto_buffer_enabled: z.boolean(),
    buffer_before_minutes: z.number().min(0).max(60),
    buffer_after_minutes: z.number().min(0).max(60),
    allow_member_invites: z.boolean(),
    require_approval: z.boolean(),
  }),
});

type CreateTeamForm = z.infer<typeof createTeamSchema>;

interface CreateTeamDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CreateTeamDialog = ({ open, onClose }: CreateTeamDialogProps) => {
  const router = useRouter();
  const createTeam = useCreateTeam();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const form = useForm<CreateTeamForm>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: '',
      description: '',
      timezone: 'Asia/Ho_Chi_Minh',
      settings: {
        auto_buffer_enabled: false,
        buffer_before_minutes: 5,
        buffer_after_minutes: 5,
        allow_member_invites: true,
        require_approval: false,
      },
    },
  });

  const onSubmit = async (data: CreateTeamForm) => {
    try {
      const result = await createTeam.mutateAsync(data);
      onClose();
      form.reset();
      if (result.data?.id) {
        router.push(PROTECTED_ROUTES.TEAM_DETAIL(result.data.id));
      }
    } catch (error) {
      console.error('Failed to create team:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Set up a new team to collaborate with your colleagues
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Engineering Team" {...field} />
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
                      placeholder="Brief description of your team..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Asia/Ho_Chi_Minh" {...field} />
                  </FormControl>
                  <FormDescription>
                    The timezone for scheduling team rituals
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="mb-4"
              >
                {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
              </Button>

              {showAdvanced && (
                <div className="space-y-6 pl-4">
                  <FormField
                    control={form.control}
                    name="settings.auto_buffer_enabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Auto Buffer</FormLabel>
                          <FormDescription>
                            Automatically add buffer time before and after meetings
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch('settings.auto_buffer_enabled') && (
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="settings.buffer_before_minutes"
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
                        name="settings.buffer_after_minutes"
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
                  )}

                  <FormField
                    control={form.control}
                    name="settings.allow_member_invites"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Allow Member Invites</FormLabel>
                          <FormDescription>
                            Members can invite others to the team
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="settings.require_approval"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Require Approval</FormLabel>
                          <FormDescription>
                            New members must be approved by admins
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={createTeam.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createTeam.isPending}>
                {createTeam.isPending ? 'Creating...' : 'Create Team'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
