'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Settings, Keyboard, PanelLeft } from 'lucide-react';

interface HeaderActionsProps {
  showSidebar: boolean;
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
  onOpenShortcuts: () => void;
}

export function HeaderActions({ 
  showSidebar, 
  onToggleSidebar, 
  onOpenSettings, 
  onOpenShortcuts 
}: HeaderActionsProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9"
              onClick={onOpenSettings}
            >
              <Settings className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Settings</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9"
              onClick={onOpenShortcuts}
            >
              <Keyboard className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Keyboard shortcuts (?)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9"
              onClick={onToggleSidebar}
            >
              <PanelLeft className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{showSidebar ? 'Hide' : 'Show'} sidebar</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
