"use client";

import { useState } from "react";
import { Search, Filter, Columns3, HelpCircle } from "lucide-react";
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { useBookingLinks } from "@/hook/booking";
import { cn } from "@/lib/utils";
import {
  DroppableColumn,
  CategoryGroup,
  DraggableItem,
  usePriorityBoard,
  priorityColumns,
  categories,
} from "@/components/priorities";

const PrioritiesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCategories, setVisibleCategories] = useState<string[]>([
    "scheduling-links",
    "tasks",
    "habits",
    "smart-meetings",
  ]);

  const { data: bookingLinks } = useBookingLinks();
  
  const {
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
  } = usePriorityBoard(bookingLinks);

  const toggleCategoryFilter = (categoryId: string) => {
    setVisibleCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <div className="flex flex-col">
        <div className=" px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for something..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-200 bg-gray-50"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Categories</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {categories.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category.id}
                      checked={visibleCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategoryFilter(category.id)}
                    >
                      {category.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="sm" className="text-gray-600">
                <Columns3 className="h-4 w-4 mr-1" />
                Columns
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                <HelpCircle className="h-4 w-4 mr-1" />
                Help
              </Button>
            </div>
          </div>
        </div>


        <div className="flex-1 overflow-auto p-6">
          <div className="mb-4">
            <h1 className="text-lg font-semibold text-gray-900">Priorities</h1>
            <p className="text-sm text-gray-500">Manage priority for your scheduling links, tasks, habits, and meetings</p>
          </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-5 gap-4 w-full max-w-full">
              {priorityColumns.map((column) => {
                const columnItems = getItemsByPriority(column.id);
                const groupedItems = getItemsByPriorityAndCategory(column.id);
                const hasItems = Object.keys(groupedItems).length > 0;
                const columnCategories = Object.keys(groupedItems);
                const allExpanded = areAllCategoriesExpanded(columnCategories);
                
                const handleToggleAll = () => {
                  if (allExpanded) {
                    collapseAllCategories();
                  } else {
                    expandAllCategories();
                  }
                };
                
                return (
                  <div key={column.id} className="flex flex-col min-w-0 overflow-hidden">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className={cn("text-sm font-medium", column.color)}>
                        {column.label}
                      </h3>
                      {hasItems && (
                        <button 
                          onClick={handleToggleAll}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          {allExpanded ? "Collapse" : "Expand"}
                        </button>
                      )}
                    </div>

                    <DroppableColumn columnId={column.id}>
                      <SortableContext
                        id={column.id}
                        items={columnItems.map(item => item.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="min-h-full">
                          <div className="h-2" />
                          {Object.entries(groupedItems).map(([category, categoryItems]) => (
                            <CategoryGroup
                              key={category}
                              category={category}
                              items={categoryItems}
                              isExpanded={expandedCategories[category] ?? true}
                              onToggle={() => toggleCategoryGroup(category)}
                            >
                              {categoryItems.map(item => (
                                <DraggableItem key={item.id} item={item} />
                              ))}
                            </CategoryGroup>
                          ))}
                        </div>
                      </SortableContext>
                    </DroppableColumn>
                  </div>
                );
              })}
            </div>
          </DndContext>
        </div>
      </div>

    </div>
  );
};

export default PrioritiesPage;
