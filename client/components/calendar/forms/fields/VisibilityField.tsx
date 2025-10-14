'use client';

import { useState, useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Check, ChevronDown, Globe, Lock, Eye, EyeOff } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import type { EventFormData } from '../event-form.schema';
import { VISIBILITY_OPTIONS } from '../form-constants';

interface VisibilityFieldProps {
  form: UseFormReturn<EventFormData>;
}

const visibilityIcons = {
  default: Eye,
  public: Globe,
  private: Lock,
  confidential: EyeOff,
};

export function VisibilityField({ form }: VisibilityFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom,
          left: rect.left,
          width: rect.width,
        });
      }
    };

    const handleScroll = () => {
      setIsOpen(false);
    };

    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickInside = 
        (containerRef.current && containerRef.current.contains(target)) ||
        (dropdownRef.current && dropdownRef.current.contains(target));
      
      if (!isClickInside) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <FormField
      control={form.control}
      name="visibility"
      render={({ field }) => {
        const selectedOption = VISIBILITY_OPTIONS.find((opt) => opt.value === field.value);
        const SelectedIcon = selectedOption ? visibilityIcons[selectedOption.value as keyof typeof visibilityIcons] : Eye;

        return (
          <FormItem>
            <FormControl>
              <div ref={containerRef} className="relative">
                <button
                  ref={buttonRef}
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className={cn(
                    'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <SelectedIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedOption?.label || 'Default'}</span>
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 opacity-50 transition-transform duration-200',
                      isOpen && 'rotate-180'
                    )}
                  />
                </button>

                {isOpen && (
                  <div
                    ref={dropdownRef}
                    style={{
                      position: 'fixed',
                      top: `${dropdownPosition.top}px`,
                      left: `${dropdownPosition.left}px`,
                      width: `${dropdownPosition.width}px`,
                      zIndex: 9999,
                    }}
                    className={cn(
                      'mt-1 rounded-md border bg-popover text-popover-foreground shadow-md',
                      'animate-in fade-in-80 slide-in-from-top-1'
                    )}
                  >
                    <div className="max-h-[300px] overflow-y-auto p-1">
                      {VISIBILITY_OPTIONS.map((option) => {
                        const Icon = visibilityIcons[option.value as keyof typeof visibilityIcons];
                        const isSelected = option.value === field.value;
                        
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              field.onChange(option.value);
                              setIsOpen(false);
                            }}
                            className={cn(
                              'relative flex w-full cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none',
                              'hover:bg-accent hover:text-accent-foreground',
                              'focus:bg-accent focus:text-accent-foreground',
                              isSelected && 'bg-accent/50'
                            )}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <div className="flex-1 text-left">
                                <div className="font-medium">{option.label}</div>
                                {option.description && (
                                  <div className="text-xs text-muted-foreground">{option.description}</div>
                                )}
                              </div>
                            </div>
                            {isSelected && (
                              <Check className="h-4 w-4 flex-shrink-0 ml-2 text-primary" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
