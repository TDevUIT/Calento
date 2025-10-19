import { useState, useEffect } from "react";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { BookingLink } from "@/service/booking.service";

export interface PriorityItem {
  id: string;
  title: string;
  category: string;
  priority: string;
}

export const priorityColumns = [
  { id: "critical", label: "Critical", color: "text-red-600" },
  { id: "high", label: "High priority", color: "text-gray-700" },
  { id: "medium", label: "Medium priority", color: "text-gray-700" },
  { id: "low", label: "Low priority", color: "text-gray-700" },
  { id: "disabled", label: "Disabled", color: "text-gray-500" },
];

export const usePriorityBoard = (bookingLinks?: BookingLink[]) => {
  const [items, setItems] = useState<PriorityItem[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "Scheduling Links": true,
    "Tasks": true,
    "Habits": true,
    "Smart Meetings": true,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (bookingLinks) {
      const mappedItems: PriorityItem[] = bookingLinks.map((link) => ({
        id: link.id,
        title: link.title,
        category: "Scheduling Links",
        priority: link.is_active ? "medium" : "disabled",
      }));
      setItems(mappedItems);
    }
  }, [bookingLinks]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeItem = items.find(item => item.id === activeId);
    if (!activeItem) return;

    const overColumn = priorityColumns.find(col => `droppable-${col.id}` === overId);
    if (overColumn && activeItem.priority !== overColumn.id) {
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === activeId
            ? { ...item, priority: overColumn.id }
            : item
        )
      );
    }
  };

  const handleDragEnd = () => {
    setActiveId(null);
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
