import { LineChart } from "lucide-react";

export const metadata = { title: "Finance — EJ Finance" };

export default function FinancePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4 text-center px-6">
      <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
        <LineChart className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Finance</h1>
        <p className="text-muted-foreground mt-2 text-sm max-w-xs">
          Track income, expenses, and investments. Visualize your financial health. Coming soon.
        </p>
      </div>
    </div>
  );
}
