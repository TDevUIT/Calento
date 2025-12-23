"use client";

import { useState } from "react";
import { Trash2, Calendar, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAvailabilities,
  useWeeklySchedule,
  useDeleteAvailability,
  useDeleteAllAvailabilities,
  useBulkCreateAvailability,
} from "@/hook";
import type { Availability } from "@/interface";
import { AvailabilityRuleCard } from "./AvailabilityRuleCard";
import { AddAvailabilityDialog } from "./AddAvailabilityDialog";
import { EditAvailabilityDialog } from "./EditAvailabilityDialog";
import { WeeklyScheduleView } from "./WeeklyScheduleView";
import { AvailabilityManagerSkeleton, WeeklyScheduleSkeleton } from "./AvailabilitySkeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const AvailabilityManager = () => {
  const [editingAvailability, setEditingAvailability] =
    useState<Availability | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteAll, setShowDeleteAll] = useState(false);
  const [activeTab, setActiveTab] = useState("schedule");

  const { data: availabilities, isLoading, error, refetch } = useAvailabilities();
  const { data: schedule, isLoading: scheduleLoading } = useWeeklySchedule();
  const deleteMutation = useDeleteAvailability();
  const deleteAllMutation = useDeleteAllAvailabilities();
  const bulkCreateMutation = useBulkCreateAvailability();

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  const handleDeleteAll = () => {
    deleteAllMutation.mutate(undefined, {
      onSuccess: () => setShowDeleteAll(false),
    });
  };

  const handleSetDefaultHours = () => {
    const defaultRules = [
      { day_of_week: 1, start_time: "09:00:00", end_time: "17:00:00", is_active: true }, // Monday
      { day_of_week: 2, start_time: "09:00:00", end_time: "17:00:00", is_active: true }, // Tuesday
      { day_of_week: 3, start_time: "09:00:00", end_time: "17:00:00", is_active: true }, // Wednesday
      { day_of_week: 4, start_time: "09:00:00", end_time: "17:00:00", is_active: true }, // Thursday
      { day_of_week: 5, start_time: "09:00:00", end_time: "17:00:00", is_active: true }, // Friday
    ];

    bulkCreateMutation.mutate({ availabilities: defaultRules });
  };

  if (isLoading) {
    return <AvailabilityManagerSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Failed to load availability data. {error.message}</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            className="ml-4"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Availability</h2>
          <p className="text-gray-600">
            Manage your weekly availability for meetings and events
          </p>
        </div>
        <div className="flex gap-2">
          {availabilities && availabilities.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowDeleteAll(true)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
          <AddAvailabilityDialog />
        </div>
      </div>

      <Tabs defaultValue="schedule" className="w-full" onValueChange={setActiveTab}>
        <div className="border-2 border-black dark:border-white rounded-lg p-2 bg-muted/30 max-w-1/2">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-transparent gap-2">
            <TabsTrigger
              value="schedule"
              className="gap-2 data-[state=active]:bg-background data-[state=active]:border-2 data-[state=active]:border-black data-[state=active]:dark:border-white data-[state=active]:shadow-md rounded-md py-3 px-3 justify-start transition-all hover:bg-background/50 border-2 border-transparent"
            >
              <Calendar className="h-4 w-4" />
              Weekly Schedule
            </TabsTrigger>
            <TabsTrigger
              value="rules"
              className="gap-2 data-[state=active]:bg-background data-[state=active]:border-2 data-[state=active]:border-black data-[state=active]:dark:border-white data-[state=active]:shadow-md rounded-md py-3 px-3 justify-start transition-all hover:bg-background/50 border-2 border-transparent"
            >
              Availability Rules
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="schedule" className="mt-6">
          {scheduleLoading ? (
            <WeeklyScheduleSkeleton />
          ) : schedule ? (
            <WeeklyScheduleView schedule={schedule} />
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No availability set
                </h3>
                <p className="text-gray-600 mb-4">
                  Set default working hours or add custom availability rules
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    onClick={handleSetDefaultHours}
                    disabled={bulkCreateMutation.isPending}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {bulkCreateMutation.isPending ? "Setting up..." : "Set Default Hours (9AM-5PM)"}
                  </Button>
                  <AddAvailabilityDialog />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rules" className="mt-6 space-y-4">
          {availabilities && availabilities.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availabilities.map((availability) => (
                <AvailabilityRuleCard
                  key={availability.id}
                  availability={availability}
                  onEdit={setEditingAvailability}
                  onDelete={setDeleteId}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No availability rules
                </h3>
                <p className="text-gray-600 mb-4">
                  Set default working hours or add custom availability rules
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    onClick={handleSetDefaultHours}
                    disabled={bulkCreateMutation.isPending}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {bulkCreateMutation.isPending ? "Setting up..." : "Set Default Hours (9AM-5PM)"}
                  </Button>
                  <AddAvailabilityDialog />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <EditAvailabilityDialog
        availability={editingAvailability}
        open={!!editingAvailability}
        onOpenChange={(open) => !open && setEditingAvailability(null)}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Availability Rule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this availability rule? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteAll} onOpenChange={setShowDeleteAll}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Availability Rules</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all availability rules? This will
              remove all your weekly availability settings. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAll}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteAllMutation.isPending ? "Deleting..." : "Delete All"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
