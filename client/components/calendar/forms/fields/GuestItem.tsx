'use client';

import { useState } from 'react';
import { X, Check, Clock, AlertCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { EventAttendee } from '@/interface';

interface GuestItemProps {
  attendee: EventAttendee;
  index: number;
  onRemove: (index: number) => void;
  onUpdate: (index: number, updatedAttendee: EventAttendee) => void;
  isOrganizer?: boolean;
  showPermissions?: boolean;
}

const responseStatusConfig = {
  accepted: { 
    label: 'Going', 
    icon: Check, 
    color: 'bg-green-100 text-green-800 border-green-200',
    iconColor: 'text-green-600'
  },
  declined: { 
    label: 'Not going', 
    icon: X, 
    color: 'bg-red-100 text-red-800 border-red-200',
    iconColor: 'text-red-600'
  },
  tentative: { 
    label: 'Maybe', 
    icon: AlertCircle, 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    iconColor: 'text-yellow-600'
  },
  needsAction: { 
    label: 'Pending', 
    icon: Clock, 
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    iconColor: 'text-gray-600'
  },
};

export function GuestItem({ 
  attendee, 
  index, 
  onRemove, 
  onUpdate, 
  isOrganizer = false
}: GuestItemProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const responseStatus = attendee.response_status || 'needsAction';
  const statusConfig = responseStatusConfig[responseStatus];
  const StatusIcon = statusConfig.icon;

  const getInitials = (email: string, name?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const handleResponseStatusChange = (newStatus: string) => {
    onUpdate(index, {
      ...attendee,
      response_status: newStatus as EventAttendee['response_status']
    });
  };

  const handleOptionalChange = (isOptional: boolean) => {
    onUpdate(index, {
      ...attendee,
      is_optional: isOptional
    });
  };

  return (
    <div className="group border rounded-lg p-3 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <Avatar className="h-8 w-8">
          <AvatarImage src="" alt={attendee.name || attendee.email} />
          <AvatarFallback className="text-xs">
            {getInitials(attendee.email, attendee.name)}
          </AvatarFallback>
        </Avatar>

        {/* Guest Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium truncate">
              {attendee.name || attendee.email.split('@')[0]}
            </p>
            {isOrganizer && (
              <Badge variant="secondary" className="text-xs">
                Organizer
              </Badge>
            )}
            {attendee.is_optional && (
              <Badge variant="outline" className="text-xs">
                Optional
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {attendee.email}
          </p>
        </div>

        {/* Response Status */}
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={`text-xs ${statusConfig.color} border`}
          >
            <StatusIcon className={`h-3 w-3 mr-1 ${statusConfig.iconColor}`} />
            {statusConfig.label}
          </Badge>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setShowDetails(!showDetails)}
            >
              <User className="h-4 w-4" />
            </Button>
            {!isOrganizer && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => onRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="mt-3 pt-3 border-t space-y-3">
          {/* Response Status Selector */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Response Status
            </label>
            <Select 
              value={responseStatus} 
              onValueChange={handleResponseStatusChange}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accepted">
                  <div className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-600" />
                    Going
                  </div>
                </SelectItem>
                <SelectItem value="declined">
                  <div className="flex items-center gap-2">
                    <X className="h-3 w-3 text-red-600" />
                    Not going
                  </div>
                </SelectItem>
                <SelectItem value="tentative">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-3 w-3 text-yellow-600" />
                    Maybe
                  </div>
                </SelectItem>
                <SelectItem value="needsAction">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-gray-600" />
                    Pending
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Optional Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`optional-${index}`}
              checked={attendee.is_optional || false}
              onCheckedChange={handleOptionalChange}
            />
            <label 
              htmlFor={`optional-${index}`}
              className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Optional attendee
            </label>
          </div>

          {/* Comment */}
          {attendee.comment && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Comment
              </label>
              <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                {attendee.comment}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
