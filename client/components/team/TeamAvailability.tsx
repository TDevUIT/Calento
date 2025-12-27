'use client';

import { useMemo, useState } from 'react';
import { addDays, format } from 'date-fns';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useFindOptimalTimes, useGetAvailabilityHeatmap } from '@/hook/team';
import type { HeatmapSlot, OptimalMeetingTime } from '@/interface';

interface TeamAvailabilityProps {
  teamId: string;
  timezone?: string;
}

export const TeamAvailability = ({ teamId, timezone }: TeamAvailabilityProps) => {
  const [durationMinutes] = useState(30);
  const [rangeDays] = useState(7);

  const startDate = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);
  const endDate = useMemo(() => format(addDays(new Date(), rangeDays), 'yyyy-MM-dd'), [rangeDays]);

  const getHeatmap = useGetAvailabilityHeatmap();
  const findOptimalTimes = useFindOptimalTimes();

  const heatmap = getHeatmap.data?.data;
  const optimalTimes = findOptimalTimes.data?.data;

  const stats = useMemo(() => {
    const slots = heatmap?.slots ?? [];
    const avgAvailability =
      slots.length > 0
        ? Math.round(
            slots.reduce((sum: number, s: HeatmapSlot) => sum + (s.availability_percentage ?? 0), 0) /
              slots.length
          )
        : null;

    const bestSlot =
      slots.length > 0
        ? slots.reduce((best: HeatmapSlot, s: HeatmapSlot) =>
            (s.availability_percentage ?? 0) > (best.availability_percentage ?? 0) ? s : best
          )
        : null;

    const bestTimeLabel = bestSlot ? `${bestSlot.day} ${bestSlot.time}` : null;

    const membersAny = (heatmap?.members ?? []) as Array<{ timezone?: string }>;
    const timezoneSpread = membersAny.length
      ? new Set(membersAny.map((m) => m.timezone).filter(Boolean)).size
      : null;

    return {
      avgAvailability,
      bestTimeLabel,
      timezoneSpread,
    };
  }, [heatmap]);

  const handleViewHeatmap = async () => {
    await getHeatmap.mutateAsync({
      teamId,
      data: {
        start_date: startDate,
        end_date: endDate,
        timezone,
      },
    });
  };

  const handleFindOptimalTimes = async () => {
    await findOptimalTimes.mutateAsync({
      teamId,
      data: {
        start_date: startDate,
        end_date: endDate,
        duration_minutes: durationMinutes,
        timezone,
      },
    });
  };

  const isHeatmapLoading = getHeatmap.isPending;
  const isOptimalLoading = findOptimalTimes.isPending;

  const previewSlots = useMemo(() => {
    const slots = [...(heatmap?.slots ?? [])];
    if (slots.length === 0) return [];

    slots.sort((a, b) => a.datetime.localeCompare(b.datetime));

    const byDay = new Map<string, HeatmapSlot[]>();
    for (const s of slots) {
      const list = byDay.get(s.day) ?? [];
      list.push(s);
      byDay.set(s.day, list);
    }

    const dayKeys = Array.from(byDay.keys());
    const result: HeatmapSlot[] = [];
    let i = 0;
    while (result.length < 12) {
      let addedAny = false;
      for (const day of dayKeys) {
        const daySlots = byDay.get(day) ?? [];
        if (i < daySlots.length) {
          result.push(daySlots[i]);
          addedAny = true;
          if (result.length >= 12) break;
        }
      }
      if (!addedAny) break;
      i += 1;
    }

    return result;
  }, [heatmap?.slots]);

  const previewOptimalTimes = useMemo(() => {
    return [...(optimalTimes ?? [])]
      .sort((a, b) => a.datetime.localeCompare(b.datetime))
      .slice(0, 5);
  }, [optimalTimes]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Availability</CardTitle>
          <CardDescription>
            View team availability heatmap and find optimal meeting times
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    <TrendingUp className="h-3 w-3" />
                    Availability Analytics
                  </Badge>
                  <Badge variant="outline">Range: {startDate} → {endDate}</Badge>
                  {timezone && <Badge variant="secondary">{timezone}</Badge>}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleViewHeatmap}
                  disabled={isHeatmapLoading || isOptimalLoading}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {isHeatmapLoading ? 'Loading...' : 'View Heatmap'}
                </Button>
                <Button
                  type="button"
                  onClick={handleFindOptimalTimes}
                  disabled={isHeatmapLoading || isOptimalLoading}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {isOptimalLoading ? 'Finding...' : 'Find Optimal Times'}
                </Button>
              </div>
            </div>

            <Separator />

            {(previewSlots.length > 0 || previewOptimalTimes.length > 0) && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border bg-muted/20 p-4">
                  <div className="text-sm font-medium text-foreground">Heatmap preview</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Top slots by order (first {previewSlots.length})
                  </div>
                  <div className="mt-3 space-y-2">
                    {previewSlots.map((slot) => (
                      <div key={slot.datetime} className="rounded-md border border-border bg-background p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">{slot.day} {slot.time}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {slot.available_count}/{slot.total_count} available
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge variant="outline">{Math.round(slot.availability_percentage)}%</Badge>
                          </div>
                        </div>
                        <Progress className="mt-2" value={Math.round(slot.availability_percentage)} />
                      </div>
                    ))}
                    {previewSlots.length === 0 && (
                      <div className="text-sm text-muted-foreground">Run “View Heatmap” to load data.</div>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-4">
                  <div className="text-sm font-medium text-foreground">Optimal meeting times</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Suggested times (first {previewOptimalTimes.length})
                  </div>
                  <div className="mt-3 space-y-2">
                    {previewOptimalTimes.map((t: OptimalMeetingTime) => (
                      <div key={t.datetime} className="rounded-md border border-border bg-background p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">{t.day} {t.time}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {t.duration_minutes} min · score {Math.round(t.score)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge variant="outline">{Math.round(t.availability_percentage)}%</Badge>
                          </div>
                        </div>
                        <Progress className="mt-2" value={Math.round(t.availability_percentage)} />
                      </div>
                    ))}
                    {previewOptimalTimes.length === 0 && (
                      <div className="text-sm text-muted-foreground">Run “Find Optimal Times” to get suggestions.</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <div className="text-xs text-muted-foreground">Avg Availability</div>
              <div className="mt-2 flex items-end justify-between gap-3">
                <div className="text-2xl font-bold text-foreground">
                  {stats.avgAvailability !== null ? `${stats.avgAvailability}%` : '--'}
                </div>
                <div className="w-24">
                  <Progress value={stats.avgAvailability ?? 0} />
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <div className="text-xs text-muted-foreground">Best Meeting Time</div>
              <div className="mt-2 text-lg font-semibold text-foreground truncate">
                {stats.bestTimeLabel ?? '9-11 AM'}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <div className="text-xs text-muted-foreground">Timezone Spread</div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="text-2xl font-bold text-foreground">
                  {stats.timezoneSpread !== null ? stats.timezoneSpread : 3}
                </div>
                <Badge variant="secondary">
                  {stats.timezoneSpread !== null ? 'Detected' : 'Estimated'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
