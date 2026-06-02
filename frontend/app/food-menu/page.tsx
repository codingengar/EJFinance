import { UtensilsCrossed } from "lucide-react";

export const metadata = { title: "Food Menu — EJ Finance" };

export default function FoodMenuPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4 text-center px-6">
      <div className="h-14 w-14 rounded-2xl bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center">
        <UtensilsCrossed className="h-7 w-7 text-orange-600 dark:text-orange-400" />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Food Menu</h1>
        <p className="text-muted-foreground mt-2 text-sm max-w-xs">
          Plan weekly meals, track nutrition, and manage your grocery budget. Coming soon.
        </p>
      </div>
    </div>
  );
}
