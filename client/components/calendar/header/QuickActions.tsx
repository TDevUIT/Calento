'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface QuickActionsProps {
  onCreateEvent: () => void;
}

export function QuickActions({ onCreateEvent }: QuickActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="default" 
        className="h-9 gap-2"
        onClick={onCreateEvent}
      >
        <Plus className="size-4" />
        <span className="font-medium">Create</span>
      </Button>
    </div>
  );
}
