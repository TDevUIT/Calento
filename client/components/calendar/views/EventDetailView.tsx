'use client';

// import { format } from 'date-fns';
// import { vi } from 'date-fns/locale';
import { useCalendarSettings } from '../shared/CalendarSettingsProvider';
import { formatTimeWithSettings, formatDateWithSettings } from '@/utils/calendar-format';
import { 
  Clock, 
  MapPin, 
  Bell, 
  Repeat,
  User,
  Link2,
  Pencil,
  Trash2,
  X,
  Mail,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ConferenceInfo } from '../shared/ConferenceInfo';
import { AttendeesList } from '../shared/AttendeesList';
import type { Event } from '@/interface/event.interface';

interface EventDetailViewProps {
  event: Event;
  onEdit?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
  /** Enable edit with EventFormModal (default: false) */
  enableEditModal?: boolean;
}

export function EventDetailView({ event, onEdit, onDelete, onClose }: EventDetailViewProps) {
  const startDate = new Date(event.start_time);
  const endDate = new Date(event.end_time);
  const { timeFormat, dateFormat } = useCalendarSettings();

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    pink: 'bg-pink-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  };

  const visibilityIcons = {
    public: <Eye className="h-3.5 w-3.5" />,
    private: <EyeOff className="h-3.5 w-3.5" />,
    confidential: <Lock className="h-3.5 w-3.5" />,
    default: null,
  };

  const formatRecurrence = (rule?: string) => {
    if (!rule) return null;
    
    if (rule.includes('FREQ=WEEKLY')) {
      const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
      const dayName = days[startDate.getDay()];
      return `Hàng tuần vào ${dayName}`;
    }
    if (rule.includes('FREQ=DAILY')) return 'Hàng ngày';
    if (rule.includes('FREQ=MONTHLY')) return 'Hàng tháng';
    if (rule.includes('FREQ=YEARLY')) return 'Hàng năm';
    
    return 'Lặp lại';
  };

  const formatTimeRange = () => {
    if (event.is_all_day) {
      return {
        dayName: formatDateWithSettings(startDate, dateFormat),
        timeRange: 'Cả ngày',
      };
    }

    const dayName = formatDateWithSettings(startDate, dateFormat);
    const startTime = formatTimeWithSettings(startDate, timeFormat);
    const endTime = formatTimeWithSettings(endDate, timeFormat);
    
    return {
      dayName,
      timeRange: `${startTime} - ${endTime}`,
    };
  };

  const { dayName, timeRange } = formatTimeRange();

  const handleShareLink = () => {
    toast.info('Tính năng chia sẻ đang phát triển');
  };

  return (
    <div className="w-full max-w-md bg-background border rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-3 border-b">
        <div className="flex items-start gap-3 flex-1">
          <div className={`h-2 w-2 rounded-full mt-2 ${colorClasses[event.color || 'blue']}`} />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold leading-tight">
              {event.title}
            </h2>
            {event.visibility && event.visibility !== 'default' && (
              <Badge variant="outline" className="mt-1.5 text-xs">
                {visibilityIcons[event.visibility]}
                <span className="ml-1 capitalize">{event.visibility}</span>
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onEdit && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={onEdit}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          {onClose && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4 max-h-[600px] overflow-y-auto">
        {/* Time */}
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium">
              {dayName}
            </p>
            <p className="text-sm text-muted-foreground">
              {timeRange}
            </p>
            {event.recurrence_rule && (
              <div className="flex items-center gap-1.5 mt-1">
                <Repeat className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {formatRecurrence(event.recurrence_rule)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Creator/Organizer */}
        {(event.creator || event.organizer_name) && (
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                {event.creator?.name || event.organizer_name || 'Unknown'}
              </p>
              <p className="text-xs text-muted-foreground">
                {event.creator?.name ? 'Người tạo' : 'Người tổ chức'}
              </p>
              {(event.creator?.email || event.organizer_email) && (
                <p className="text-xs text-muted-foreground truncate">
                  {event.creator?.email || event.organizer_email}
                </p>
              )}
            </div>
            {(event.creator?.email || event.organizer_email) && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={() => {
                  const email = event.creator?.email || event.organizer_email;
                  window.location.href = `mailto:${email}`;
                }}
              >
                <Mail className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* Conference */}
        {event.conference_data && (
          <>
            <Separator />
            <ConferenceInfo conference={event.conference_data} />
          </>
        )}

        {/* Physical location */}
        {event.location && !event.conference_data && (
          <>
            <Separator />
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm">{event.location}</p>
              </div>
            </div>
          </>
        )}

        {/* Attendees */}
        {event.attendees && event.attendees.length > 0 && (
          <>
            <Separator />
            <AttendeesList attendees={event.attendees} organizerEmail={event.creator?.email || event.organizer_email} />
          </>
        )}

        {/* Reminders */}
        {event.reminders && event.reminders.length > 0 && (
          <>
            <Separator />
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 space-y-1">
                {event.reminders.map((reminder, index) => (
                  <div key={index} className="text-sm">
                    {reminder.method === 'email' && 'Email'}
                    {reminder.method === 'popup' && 'Thông báo'}
                    {reminder.method === 'sms' && 'SMS'}
                    {' '}{reminder.minutes} phút trước
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Description */}
        {event.description && (
          <>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium">Mô tả</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {event.description}
              </p>
            </div>
          </>
        )}

        {/* Share button */}
        <div className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={handleShareLink}
          >
            <Link2 className="h-4 w-4 mr-2" />
            Chia sẻ sự kiện
          </Button>
        </div>
      </div>
    </div>
  );
}
