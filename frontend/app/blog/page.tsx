import { BookOpen } from "lucide-react";

export const metadata = { title: "Blog — EJ Finance" };

export default function BlogPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4 text-center px-6">
      <div className="h-14 w-14 rounded-2xl bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center">
        <BookOpen className="h-7 w-7 text-violet-600 dark:text-violet-400" />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Blog</h1>
        <p className="text-muted-foreground mt-2 text-sm max-w-xs">
          Write and read personal finance insights, journal entries, and reflections. Coming soon.
        </p>
      </div>
    </div>
  );
}
