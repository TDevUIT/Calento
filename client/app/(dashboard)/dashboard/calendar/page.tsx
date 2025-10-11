const CalendarPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Calendar</h2>
          <p className="text-muted-foreground">
            Manage your schedule and events
          </p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Today&apos;s Events</h3>
          <p className="text-2xl font-bold mt-2">5</p>
          <p className="text-sm text-muted-foreground mt-1">
            3 meetings, 2 tasks
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">This Week</h3>
          <p className="text-2xl font-bold mt-2">24</p>
          <p className="text-sm text-muted-foreground mt-1">
            Scheduled events
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Upcoming</h3>
          <p className="text-2xl font-bold mt-2">12</p>
          <p className="text-sm text-muted-foreground mt-1">
            Pending invitations
          </p>
        </div>
      </div>
      
      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-semibold mb-4">Calendar View</h3>
        <div className="h-[600px] flex items-center justify-center text-muted-foreground">
          Calendar component will be integrated here
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;