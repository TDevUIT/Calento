import { useState, useEffect } from "react";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { BookingLink } from "@/service/booking.service";
import type { Task } from "@/interface/task.interface";
import { useBulkUpdatePriorities, usePriorities } from "./priority/use-priorities";
import type { ItemType, PriorityLevel } from "@/interface/priority.interface";

export interface PriorityItem {
  id: string;
  title: string;
  category: string;
  priority: string;
  metadata?: {
    dueDate?: string;
    status?: string;
    duration?: number;
    isActive?: boolean;
  };
}

export const priorityColumns = [
  { id: "critical", label: "Critical", color: "text-red-600" },
  { id: "high", label: "High priority", color: "text-gray-700" },
  { id: "medium", label: "Medium priority", color: "text-gray-700" },
  { id: "low", label: "Low priority", color: "text-gray-700" },
  { id: "disabled", label: "Disabled", color: "text-gray-500" },
];

export const usePriorityBoard = (bookingLinks?: BookingLink[], tasks?: Task[]) => {
  const [items, setItems] = useState<PriorityItem[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "Scheduling Links": true,
    "Tasks": true,
    "Habits": true,
    "Smart Meetings": true,
  });

  const { mutate: bulkUpdatePriorities } = useBulkUpdatePriorities();
  const { data: savedPriorities = [] } = usePriorities();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const allItems: PriorityItem[] = [];
    
    const getPriorityForItem = (itemId: string, itemType: string, defaultPriority: string): string => {
      const saved = savedPriorities.find(
        p => p.item_id === itemId && p.item_type === itemType
      );
      return saved ? saved.priority : defaultPriority;
    };
    
    if (bookingLinks) {
      const mappedLinks: PriorityItem[] = bookingLinks.map((link) => ({
        id: `link-${link.id}`,
        title: link.title,
        category: "Scheduling Links",
        priority: getPriorityForItem(link.id, 'booking_link', link.is_active ? "medium" : "disabled"),
      }));
      allItems.push(...mappedLinks);
    }
    
    if (tasks) {
      const mappedTasks: PriorityItem[] = tasks
        .filter(task => !task.is_deleted)
        .map((task) => ({
          id: `task-${task.id}`,
          title: task.title,
          category: "Tasks",
          priority: getPriorityForItem(task.id, 'task', task.priority),
          metadata: {
            dueDate: task.due_date ? new Date(task.due_date).toISOString() : undefined,
            status: task.status,
            duration: task.estimated_duration,
          },
        }));
      allItems.push(...mappedTasks);
    }
    
    setItems(allItems);
  }, [bookingLinks, tasks, savedPriorities]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeItem = items.find(item => item.id === activeId);
    if (!activeItem) return;

    let targetPriority: string | null = null;

    const overColumn = priorityColumns.find(col => `droppable-${col.id}` === overId);
    if (overColumn) {
      targetPriority = overColumn.id;
    } else {
      const overItem = items.find(item => item.id === overId);
      if (overItem) {
        targetPriority = overItem.priority;
      }
    }

    if (!targetPriority || activeItem.priority === targetPriority) return;

    const extractItemInfo = (id: string): { itemId: string; itemType: ItemType } | null => {
      if (id.startsWith('task-')) {
        return { itemId: id.replace('task-', ''), itemType: 'task' };
      }
      if (id.startsWith('link-')) {
        return { itemId: id.replace('link-', ''), itemType: 'booking_link' };
      }
      return null;
    };

    const itemInfo = extractItemInfo(activeId);
    if (!itemInfo) {
      console.warn('❌ Could not extract item info from:', activeId);
      return;
    }

    bulkUpdatePriorities({
      updates: [{
        item_id: itemInfo.itemId,
        item_type: itemInfo.itemType,
        priority: targetPriority as PriorityLevel,
      }]
    });
  };

  const getItemsByPriority = (priority: string) => {
    return items.filter(item => item.priority === priority);
  };

  const getItemsByPriorityAndCategory = (priority: string) => {
    const priorityItems = items.filter(item => item.priority === priority);
    const grouped: Record<string, PriorityItem[]> = {};
    
    priorityItems.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    
    return grouped;
  };

  const toggleCategoryGroup = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const expandAllCategories = () => {
    setExpandedCategories({
      "Scheduling Links": true,
      "Tasks": true,
      "Habits": true,
      "Smart Meetings": true,
    });
  };

  const collapseAllCategories = () => {
    setExpandedCategories({
      "Scheduling Links": false,
      "Tasks": false,
      "Habits": false,
      "Smart Meetings": false,
    });
  };

  const areAllCategoriesExpanded = (columnCategories: string[]) => {
    return columnCategories.every(category => expandedCategories[category] === true);
  };

  return {
    items,
    activeId,
    expandedCategories,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    getItemsByPriority,
    getItemsByPriorityAndCategory,
    toggleCategoryGroup,
    expandAllCategories,
    collapseAllCategories,
    areAllCategoriesExpanded,
  };
};
