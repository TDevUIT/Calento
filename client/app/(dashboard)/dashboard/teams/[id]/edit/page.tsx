'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Settings } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';

import { PROTECTED_ROUTES } from '@/constants/routes';
import { useTeamDetail, useUpdateTeam } from '@/hook/team';
import { useCurrentUser } from '@/hook/store/use-auth-store';

const TIMEZONES = [
  { value: 'Asia/Ho_Chi_Minh', label: 'Ho Chi Minh (GMT+7)' },
  { value: 'Asia/Bangkok', label: 'Bangkok (GMT+7)' },
  { value: 'Asia/Singapore', label: 'Singapore (GMT+8)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)' },
  { value: 'America/New_York', label: 'New York (GMT-5)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8)' },
  { value: 'Europe/London', label: 'London (GMT+0)' },
  { value: 'Europe/Paris', label: 'Paris (GMT+1)' },
  { value: 'Australia/Sydney', label: 'Sydney (GMT+10)' },
];

const teamEditSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional().or(z.literal('')),
  timezone: z.string(),
  is_active: z.boolean(),
  settings: z.object({
    auto_buffer_enabled: z.boolean().optional(),
    buffer_before_minutes: z.number().min(0).max(60).optional(),
    buffer_after_minutes: z.number().min(0).max(60).optional(),
    allow_member_invites: z.boolean().optional(),
    require_approval: z.boolean().optional(),
  }),
});

type TeamEditForm = z.infer<typeof teamEditSchema>;

const TeamEditPage = () => {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;

  const { data: teamData, isLoading } = useTeamDetail(teamId);
  const { user: currentUser } = useCurrentUser();
  const updateTeam = useUpdateTeam();

  const team = teamData?.data;
  const isOwner = currentUser?.id && team?.owner_id ? currentUser.id === team.owner_id : false;

  const [showAdvanced, setShowAdvanced] = useState(false);

  const defaultValues = useMemo<TeamEditForm>(() => {
    return {
      name: team?.name ?? '',
      description: team?.description ?? '',
      timezone: team?.timezone ?? 'Asia/Ho_Chi_Minh',
      is_active: team?.is_active ?? true,
      settings: {
        auto_buffer_enabled: team?.settings?.auto_buffer_enabled ?? false,
        buffer_before_minutes: team?.settings?.buffer_before_minutes ?? 5,
        buffer_after_minutes: team?.settings?.buffer_after_minutes ?? 5,
        allow_member_invites: team?.settings?.allow_member_invites ?? true,
        require_approval: team?.settings?.require_approval ?? false,
      },
    };
  }, [team]);

  const form = useForm<TeamEditForm>({
    resolver: zodResolver(teamEditSchema),
    defaultValues,
    values: defaultValues,
  });

  useEffect(() => {
    if (!isLoading && team && !isOwner) {
      router.replace(PROTECTED_ROUTES.TEAM_DETAIL(teamId));
    }
  }, [isLoading, isOwner, router, team, teamId]);

  const onSubmit = async (data: TeamEditForm) => {
    await updateTeam.mutateAsync({
      teamId,
      data: {
        name: data.name,
        description: data.description ? data.description : undefined,
        timezone: data.timezone,
        is_active: data.is_active,
        settings: {
          auto_buffer_enabled: data.settings.auto_buffer_enabled,
          buffer_before_minutes: data.settings.buffer_before_minutes,
          buffer_after_minutes: data.settings.buffer_after_minutes,
          allow_member_invites: data.settings.allow_member_invites,
          require_approval: data.settings.require_approval,
        },
      },
    });

    router.push(PROTECTED_ROUTES.TEAM_DETAIL(teamId));
  };

  if (isLoading || !team) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="mb-6">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!isOwner) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push(PROTECTED_ROUTES.TEAM_DETAIL(teamId))}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Settings className="h-4 w-4" />
          <span className="text-sm">Team Settings</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Team</CardTitle>
          <CardDescription>Update team information and policies</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            {TIMEZONES.map((tz) => (
                              <SelectItem key={tz.value} value={tz.value}>
                                {tz.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>Used for team scheduling and availability</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Team Active</FormLabel>
                        <FormDescription>Disable to pause team activity</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Accordion
                type="single"
                collapsible
                value={showAdvanced ? 'advanced' : ''}
                onValueChange={(value) => setShowAdvanced(value === 'advanced')}
              >
                <AccordionItem value="advanced" className="border-0">
                  <AccordionTrigger className="py-2">Advanced settings</AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="settings.auto_buffer_enabled"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Auto Buffer</FormLabel>
                              <FormDescription>Automatically add buffer time before and after meetings</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {form.watch('settings.auto_buffer_enabled') && (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                                    value={field.value ?? 0}
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
                                    value={field.value ?? 0}
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
                              <FormDescription>Members can invite others to the team</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={!!field.value} onCheckedChange={field.onChange} />
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
                              <FormDescription>New members must be approved by admins</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(PROTECTED_ROUTES.TEAM_DETAIL(teamId))}
                  disabled={updateTeam.isPending}
                  size="sm"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateTeam.isPending} size="sm">
                  {updateTeam.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamEditPage;
