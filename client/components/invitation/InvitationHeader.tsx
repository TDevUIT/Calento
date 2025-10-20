import { Clock, MapPin, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface InvitationHeaderProps {
  organizerName?: string;
  organizerAvatar?: string;
  title: string;
  description?: string;
  startTime: string;
  location?: string;
  isOptional?: boolean;
  formatDateTime: (dateString: string) => string;
}

export const InvitationHeader = ({
  organizerName,
  organizerAvatar,
  title,
  description,
  startTime,
  location,
  isOptional,
  formatDateTime,
}: InvitationHeaderProps) => {
  return (
    <>
      <CardHeader className="border-b bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-12 w-12 border-2 border-border">
            <AvatarImage src={organizerAvatar} alt={organizerName} />
            <AvatarFallback className="bg-blue-600 text-white">
              {organizerName?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs text-muted-foreground">You are invited by</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{organizerName}</p>
          </div>
        </div>
        <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">{title}</CardTitle>
        {description && <CardDescription className="mt-2">{description}</CardDescription>}
      </CardHeader>

      <div className="space-y-4 p-6">
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Time</p>
            <p className="text-sm text-muted-foreground">{formatDateTime(startTime)}</p>
          </div>
        </div>

        {location && (
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Location</p>
              <p className="text-sm text-muted-foreground">{location}</p>
            </div>
          </div>
        )}

        {isOptional && (
          <Badge variant="secondary" className="mt-2">
            <Users className="h-3 w-3 mr-1" />
            Optional Attendance
          </Badge>
        )}
      </div>
    </>
  );
};
