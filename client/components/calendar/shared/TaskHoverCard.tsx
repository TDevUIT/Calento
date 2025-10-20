'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import type { Task } from '@/interface/task.interface';
import { TaskQuickPreview } from './TaskQuickPreview';

interface TaskHoverCardProps {
  task: Task;
  children: React.ReactNode;
  onEdit?: () => void;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  autoPosition?: boolean;
}

export function TaskHoverCard({
  task,
  children,
  side: defaultSide = 'right',
  align: defaultAlign = 'start',
  autoPosition = true,
}: TaskHoverCardProps) {
  const [open, setOpen] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [position, setPosition] = useState<{
    side: 'top' | 'right' | 'bottom' | 'left';
    align: 'start' | 'center' | 'end';
  }>({
    side: defaultSide,
    align: defaultAlign,
  });
  const triggerElementRef = useRef<HTMLElement | null>(null);

  const calculateBestPosition = useCallback(() => {
    if (!autoPosition || !triggerElementRef.current) {
      return { side: defaultSide, align: defaultAlign };
    }

    const rect = triggerElementRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const distanceToRight = viewportWidth - rect.right;
    const distanceToLeft = rect.left;
    const distanceToTop = rect.top;
    const distanceToBottom = viewportHeight - rect.bottom;

    const maxDistance = Math.max(
      distanceToRight,
      distanceToLeft,
      distanceToTop,
      distanceToBottom
    );

    let side: 'top' | 'right' | 'bottom' | 'left' = defaultSide;
    let align: 'start' | 'center' | 'end' = defaultAlign;

    if (maxDistance === distanceToRight && distanceToRight > 350) {
      side = 'right';
      align = rect.top < 100 ? 'start' : rect.bottom > viewportHeight - 100 ? 'end' : 'center';
    } else if (maxDistance === distanceToLeft && distanceToLeft > 350) {
      side = 'left';
      align = rect.top < 100 ? 'start' : rect.bottom > viewportHeight - 100 ? 'end' : 'center';
    } else if (maxDistance === distanceToBottom && distanceToBottom > 250) {
      side = 'bottom';
      align = rect.left < 100 ? 'start' : rect.right > viewportWidth - 100 ? 'end' : 'center';
    } else if (maxDistance === distanceToTop && distanceToTop > 250) {
      side = 'top';
      align = rect.left < 100 ? 'start' : rect.right > viewportWidth - 100 ? 'end' : 'center';
    } else {
      side = distanceToRight > distanceToBottom ? 'right' : 'bottom';
      align = 'start';
    }

    return { side, align };
  }, [autoPosition, defaultSide, defaultAlign]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && autoPosition) {
      const newPosition = calculateBestPosition();
      setPosition(newPosition);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    triggerElementRef.current = e.currentTarget as HTMLElement;
  };

  return (
    <HoverCard open={open && !isClicking} onOpenChange={handleOpenChange} openDelay={500} closeDelay={100}>
      <HoverCardTrigger 
        asChild
        onPointerDown={() => {
          setIsClicking(true);
          setOpen(false);
        }}
        onPointerUp={() => {
          setTimeout(() => setIsClicking(false), 300);
        }}
        onClick={() => {
          setOpen(false);
        }}
        onMouseEnter={handleMouseEnter}
      >
        {children}
      </HoverCardTrigger>
      <HoverCardContent 
        side={position.side} 
        align={position.align}
        className="w-auto p-0 border-0 bg-transparent shadow-none task-hover-card pointer-events-auto"
        sideOffset={8}
        alignOffset={0}
        style={{ zIndex: 999999, pointerEvents: 'auto' }}
        onPointerDownOutside={() => {
          setOpen(false);
        }}
        collisionPadding={20}
        avoidCollisions={true}
      >
        <TaskQuickPreview task={task} />
      </HoverCardContent>
    </HoverCard>
  );
}
