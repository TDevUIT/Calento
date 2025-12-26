'use client';

import { useEffect, useMemo, useRef } from 'react';
import { addDays } from 'date-fns';
import { toast } from 'sonner';
import { getEventsByDateRange } from '@/service';
import type { Event } from '@/interface';
import { useCalendarSettingsStore } from '@/store/calendar-settings.store';

type ScheduledKey = string;

type PopupReminder = {
  eventId: string;
  title: string;
  startTimeIso: string;
  remindAtMs: number;
  minutes: number;
};

const buildKey = (r: PopupReminder): ScheduledKey =>
  `${r.eventId}:${r.startTimeIso}:${r.minutes}`;

const playBeep = () => {
  try {
    const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = 880;
    g.gain.value = 0.03;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setTimeout(() => {
      o.stop();
      ctx.close?.();
    }, 250);
  } catch {
    // ignore
  }
};

export function useWebEventReminders(options?: { daysAhead?: number }) {
  const daysAhead = options?.daysAhead ?? 7;

  const enableNotifications = useCalendarSettingsStore((s) => s.enableNotifications);
  const eventReminders = useCalendarSettingsStore((s) => s.eventReminders);
  const soundEnabled = useCalendarSettingsStore((s) => s.soundEnabled);

  const scheduledTimeoutsRef = useRef<Map<ScheduledKey, number>>(new Map());
  const firedRef = useRef<Set<ScheduledKey>>(new Set());

  const enabled = enableNotifications && eventReminders;

  const timeWindow = useMemo(() => {
    const now = new Date();
    const end = addDays(now, daysAhead);
    return { startIso: now.toISOString(), endIso: end.toISOString() };
  }, [daysAhead]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const clearAll = () => {
      for (const timeoutId of scheduledTimeoutsRef.current.values()) {
        window.clearTimeout(timeoutId);
      }
      scheduledTimeoutsRef.current.clear();
    };

    if (!enabled) {
      clearAll();
      return;
    }

    const maybeRequestPermission = async () => {
      if (!('Notification' in window)) return;
      if (Notification.permission === 'default') {
        try {
          await Notification.requestPermission();
        } catch {
          // ignore
        }
      }
    };

    const showDesktopNotification = (title: string, body: string) => {
      if (!('Notification' in window)) {
        toast(body, { description: title });
        return;
      }

      if (Notification.permission !== 'granted') {
        toast(title, { description: body });
        return;
      }

      try {
        new Notification(title, {
          body,
          tag: `event-reminder-${title}`,
        });
      } catch {
        toast(title, { description: body });
      }
    };

    const schedule = async () => {
      await maybeRequestPermission();

      let events: Event[] = [];
      try {
        const res = await getEventsByDateRange(timeWindow.startIso, timeWindow.endIso, {
          page: 1,
          limit: 100,
        });
        events = res.data.items as Event[];
      } catch {
        return;
      }

      const nowMs = Date.now();

      const popupReminders: PopupReminder[] = [];
      for (const e of events) {
        const startTimeIso = typeof e.start_time === 'string' ? e.start_time : e.start_time.toISOString();
        const startMs = new Date(startTimeIso).getTime();
        if (!Number.isFinite(startMs)) continue;

        const reminders = Array.isArray(e.reminders) ? e.reminders : [];
        for (const r of reminders) {
          if (r?.method !== 'popup') continue;
          const minutes = Number(r.minutes);
          if (!Number.isFinite(minutes) || minutes < 0) continue;

          const remindAtMs = startMs - minutes * 60_000;
          if (remindAtMs <= nowMs) continue;

          popupReminders.push({
            eventId: e.id,
            title: e.title,
            startTimeIso,
            minutes,
            remindAtMs,
          });
        }
      }

      popupReminders.sort((a, b) => a.remindAtMs - b.remindAtMs);

      for (const r of popupReminders) {
        const key = buildKey(r);
        if (firedRef.current.has(key)) continue;
        if (scheduledTimeoutsRef.current.has(key)) continue;

        const delay = r.remindAtMs - Date.now();
        if (delay <= 0) continue;

        // Avoid extremely long setTimeout delays; reschedule will run periodically.
        if (delay > 24 * 60 * 60 * 1000) continue;

        const timeoutId = window.setTimeout(() => {
          firedRef.current.add(key);
          scheduledTimeoutsRef.current.delete(key);

          const body = `Starts at ${new Date(r.startTimeIso).toLocaleString()}`;
          showDesktopNotification('Event reminder', `${r.title} · ${body}`);
          if (soundEnabled) playBeep();
        }, delay);

        scheduledTimeoutsRef.current.set(key, timeoutId);
      }
    };

    void schedule();
    const intervalId = window.setInterval(() => {
      void schedule();
    }, 60_000);

    return () => {
      window.clearInterval(intervalId);
      clearAll();
    };
  }, [enabled, soundEnabled, timeWindow.endIso, timeWindow.startIso]);
}
