import Link from "next/link";
import {
  CalendarCheck,
  LineChart,
  BookOpen,
  UtensilsCrossed,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    label: "Monthly Budget",
    value: "$4,280",
    change: "+2.4%",
    trend: "up",
    icon: DollarSign,
    description: "vs last month",
  },
  {
    label: "Total Expenses",
    value: "$1,940",
    change: "-8.1%",
    trend: "down",
    icon: TrendingDown,
    description: "vs last month",
  },
  {
    label: "Net Savings",
    value: "$2,340",
    change: "+12.3%",
    trend: "up",
    icon: TrendingUp,
    description: "vs last month",
  },
  {
    label: "Active Goals",
    value: "6",
    change: "+1",
    trend: "up",
    icon: Activity,
    description: "this quarter",
  },
];

const features = [
  {
    label: "Daily Tracker",
    href: "/daily-tracker",
    icon: CalendarCheck,
    description:
      "Log your daily habits, tasks, and wellness check-ins. Stay consistent with streaks.",
    badge: "Today",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/40",
  },
  {
    label: "Finance",
    href: "/finance",
    icon: LineChart,
    description:
      "Track income, expenses, and investments. Visualize your financial health at a glance.",
    badge: "Updated",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
  },
  {
    label: "Blog",
    href: "/blog",
    icon: BookOpen,
    description:
      "Write and read personal finance insights, journal entries, and reflections.",
    badge: "3 new",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/40",
  },
  {
    label: "Food Menu",
    href: "/food-menu",
    icon: UtensilsCrossed,
    description:
      "Plan weekly meals, track nutrition, and manage your grocery budget with ease.",
    badge: "Plan week",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/40",
  },
];

export default function HomePage() {
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Hero */}
      <section className="pt-2">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">
              {now.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {greeting}, Edison
            </h1>
            <p className="text-muted-foreground mt-1.5 text-sm">
              Here&apos;s your financial overview for this month.
            </p>
          </div>
          <Button size="sm" className="mt-1 shrink-0">
            View Reports
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Overview
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const isUp = stat.trend === "up";
            return (
              <Card key={stat.label} className="border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-xs font-medium">
                      {stat.label}
                    </CardDescription>
                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span
                      className={`text-xs font-semibold ${
                        isUp
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-500 dark:text-rose-400"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {stat.description}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Feature Cards */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Sections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.href} href={feature.href} className="block group">
                <Card className="h-full border shadow-sm group-hover:shadow-md group-hover:border-primary/30 transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${feature.bg}`}
                      >
                        <Icon className={`h-5 w-5 ${feature.color}`} />
                      </div>
                      <Badge variant="secondary" className="text-[11px] shrink-0 mt-0.5">
                        {feature.badge}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                        {feature.label}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                    <div className="flex items-center gap-1 mt-4 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Open {feature.label}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
