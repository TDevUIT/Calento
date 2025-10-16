"use client";

import { useState, useEffect } from "react";
import { GripVertical, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DragDropHint() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show hint if user hasn't seen it before
    const hasSeenHint = localStorage.getItem('booking-drag-drop-hint-seen');
    if (!hasSeenHint) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('booking-drag-drop-hint-seen', 'true');
  };

  if (!isVisible) return null;

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <div className="p-1 rounded bg-blue-100 dark:bg-blue-900/50">
            <GripVertical className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              Drag & Drop to Reorder
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              You can drag and drop your booking links to reorder them. Hover over a card and use the grip handle to move it around.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
