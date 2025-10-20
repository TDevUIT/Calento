'use client';

import { format } from 'date-fns';
import { 
  Calendar,
  Clock,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import type { Task } from '@/interface/task.interface';

interface TaskQuickPreviewProps {
  task: Task;
}

const priorityColors = {
  low: "bg-gray-100 text-gray-700 border-gray-200",
  medium: "bg-blue-100 text-blue-700 border-blue-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  critical: "bg-red-100 text-red-700 border-red-200",
};

const statusColors = {
  todo: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export function TaskQuickPreview({ task }: TaskQuickPreviewProps) {
  const isCompleted = task.status === 'completed';
  
  const creatorName = task.creator?.name || task.creator?.email || 'Unknown';
  const creatorEmail = task.creator?.email;
  const creatorAvatar = task.creator?.avatar;
  
  const getCreatorInitials = () => {
    const name = task.creator?.name?.trim();
    if (!name || name === '') return '?';
    const words = name.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return '?';
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };
  
  return (
    <div 
      className="w-96 bg-white rounded-lg overflow-hidden relative task-quick-preview border shadow-lg" 
      style={{ 
        zIndex: 999999, 
        pointerEvents: 'auto',
        position: 'relative',
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-base leading-tight ${isCompleted ? 'line-through text-gray-500' : ''}`}>
              📋 {task.title}
            </h3>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
          <Badge variant="outline" className={statusColors[task.status]}>
            {task.status.replace("_", " ")}
          </Badge>
        </div>

        {task.description && task.description.trim() && (
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">Description</p>
            <p className="text-sm text-gray-600 line-clamp-3">
              {task.description.trim()}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {task.due_date && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Due Date</p>
                <p className="font-medium">{format(new Date(task.due_date), 'MMM d, yyyy')}</p>
              </div>
            </div>
          )}

          {task.estimated_duration && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Estimated</p>
                <p className="font-medium">{task.estimated_duration} min</p>
              </div>
            </div>
          )}

          {task.completed_at && (
            <div className="flex items-center gap-2 text-sm col-span-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="font-medium">{format(new Date(task.completed_at), 'MMM d, yyyy')}</p>
              </div>
            </div>
          )}
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium text-gray-700">Tags</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <Separator />
      <div className="px-4 py-3 bg-muted/30">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 border-2 border-background">
            <AvatarImage src={creatorAvatar} alt={creatorName} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">
              {getCreatorInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm">{creatorName}</p>
            </div>
            <p className="text-xs text-muted-foreground">Creator</p>
            {creatorEmail && task.creator?.name && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">{creatorEmail}</p>
            )}
          </div>
        </div>
      </div>

      <Separator />
      <div className="px-4 py-2 bg-muted/10">
        <p className="text-xs text-muted-foreground text-center">
          Click to edit task details
        </p>
      </div>
    </div>
  );
}
