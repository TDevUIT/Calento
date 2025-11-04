"use client";

import { useState } from "react";
import { Loader2, Trash2, Calendar } from "lucide-react";
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
} from "@/hook";
import type { Availability } from "@/interface/availability.interface";
import { AvailabilityRuleCard } from "./AvailabilityRuleCard";
import { AddAvailabilityDialog } from "./AddAvailabilityDialog";
import { EditAvailabilityDialog } from "./EditAvailabilityDialog";
import { WeeklyScheduleView } from "./WeeklyScheduleView";

export const AvailabilityManager = () => {
  const [editingAvailability, setEditingAvailability] =
    useState<Availability | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteAll, setShowDeleteAll] = useState(false);

  const { data: availabilities, isLoading } = useAvailabilities();
  const { data: schedule } = useWeeklySchedule();
  const deleteMutation = useDeleteAvailability();
  const deleteAllMutation = useDeleteAllAvailabilities();

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
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

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList>
          <TabsTrigger value="schedule">
            <Calendar className="h-4 w-4 mr-2" />
            Weekly Schedule
          </TabsTrigger>
          <TabsTrigger value="rules">Availability Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="mt-6">
          {schedule ? (
            <WeeklyScheduleView schedule={schedule} />
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No availability set
                </h3>
                <p className="text-gray-600 mb-4">
                  Add your first availability rule to get started
                </p>
                <AddAvailabilityDialog />
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
                  Add your first availability rule to get started
                </p>
                <AddAvailabilityDialog />
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
