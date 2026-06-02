import { CalendarCheck } from "lucide-react";

export const metadata = { title: "Daily Tracker — EJ Finance" };

export default function DailyTrackerPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4 text-center px-6">
      <div className="h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
        <CalendarCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Daily Tracker</h1>
        <p className="text-muted-foreground mt-2 text-sm max-w-xs">
          Log your daily habits, tasks, and wellness check-ins. This section is coming soon.
        </p>
      </div>
    </div>
  );
}
