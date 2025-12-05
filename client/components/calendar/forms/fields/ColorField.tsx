'use client';

import { UseFormReturn } from 'react-hook-form';
import { Check, Palette } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { EventFormData } from '../event-form.schema';
import { COLOR_OPTIONS } from '../form-constants';
import { useRecentColors } from '@/hook';

interface ColorFieldProps {
  form: UseFormReturn<EventFormData>;
}

export function ColorField({ form }: ColorFieldProps) {
  const { recentColors, addRecentColor } = useRecentColors();

  return (
    <FormField
      control={form.control}
      name="color"
      render={({ field }) => {
        const handleColorSelect = (colorHex: string) => {
          field.onChange(colorHex);
          addRecentColor(colorHex);
        };

        return (
          <FormItem>
            <FormControl>
              <div className="flex items-center gap-2">
                {/* Recent/Quick color picks */}
                {recentColors.map((colorHex, index) => {
                  const isSelected = field.value === colorHex;
                  const colorOption = COLOR_OPTIONS.find(c => c.hex === colorHex);

                  return (
                    <button
                      key={`${colorHex}-${index}`}
                      type="button"
                      onClick={() => handleColorSelect(colorHex)}
                      className={`relative h-7 w-7 rounded-full transition-all hover:scale-110 flex-shrink-0 ${isSelected ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : 'opacity-70 hover:opacity-100'
                        }`}
                      style={{ backgroundColor: colorHex }}
                      title={colorOption?.label || colorHex}
                    >
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      )}
                    </button>
                  );
                })}

                {/* More colors popover */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1.5 text-xs"
                    >
                      <Palette className="h-3.5 w-3.5" />
                      <span>More</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="start" style={{ zIndex: 10002 }}>
                    <Tabs defaultValue="palette" className="w-full">
                      <TabsList className="w-full rounded-none border-b">
                        <TabsTrigger value="palette" className="flex-1">
                          Palette
                        </TabsTrigger>
                        <TabsTrigger value="custom" className="flex-1">
                          Custom
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="palette" className="p-4 m-0">
                        <div className="space-y-3">
                          <p className="text-xs text-muted-foreground">Choose a color</p>
                          <div className="grid grid-cols-8 gap-2">
                            {COLOR_OPTIONS.map((color) => {
                              const isSelected = field.value === color.value;
                              return (
                                <button
                                  key={color.value}
                                  type="button"
                                  onClick={() => handleColorSelect(color.hex)}
                                  className={`relative h-8 w-8 rounded-full transition-all hover:scale-110 ${isSelected ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : 'opacity-70 hover:opacity-100'
                                    }`}
                                  style={{ backgroundColor: color.hex }}
                                  title={color.label}
                                >
                                  {isSelected && (
                                    <Check className="h-4 w-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="custom" className="p-4 m-0">
                        <div className="space-y-3">
                          <p className="text-xs text-muted-foreground">Enter hex code or use picker</p>

                          {/* Hex input */}
                          <Input
                            type="text"
                            placeholder="#3b82f6"
                            value={field.value?.startsWith('#') ? field.value : ''}
                            onChange={(e) => {
                              let value = e.target.value.trim();
                              if (value && !value.startsWith('#')) {
                                value = '#' + value;
                              }
                              if (value === '' || /^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                field.onChange(value);
                                if (value.length === 7) {
                                  addRecentColor(value);
                                }
                              }
                            }}
                            className="font-mono text-sm"
                            maxLength={7}
                          />

                          {/* Color picker */}
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={field.value?.startsWith('#') && field.value.length === 7 ? field.value : '#3b82f6'}
                              onChange={(e) => handleColorSelect(e.target.value)}
                              className="h-10 w-full rounded border border-input cursor-pointer"
                            />
                          </div>

                          {/* Preview */}
                          {field.value && (
                            <div className="flex items-center gap-2 p-2 rounded border border-border">
                              <div
                                className="h-8 w-8 rounded-full border border-border"
                                style={{ backgroundColor: field.value }}
                              />
                              <div className="flex-1">
                                <p className="text-xs font-medium">Preview</p>
                                <p className="text-xs text-muted-foreground font-mono">{field.value}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </PopoverContent>
                </Popover>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
