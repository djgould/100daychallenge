import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DailyActivity {
  date: string;
  distance: number;
}

interface ActivityCalendarProps {
  dailyActivities: DailyActivity[];
  startDate: string;
  endDate: string;
  dailyGoal: number;
  isLoading: boolean;
}

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({
  dailyActivities = [],
  startDate = new Date().toISOString().split("T")[0],
  endDate = new Date().toISOString().split("T")[0],
  dailyGoal = 10,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card className="backdrop-blur-md bg-card/90 shadow-md border-opacity-50">
        <CardHeader>
          <CardTitle className="text-xl tracking-tight">
            Activity Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Create a map of date -> distance for quicker lookups
  const activityMap = (dailyActivities || []).reduce((acc, activity) => {
    acc[activity.date] = activity.distance;
    return acc;
  }, {} as Record<string, number>);

  // Generate calendar months from start date to end date
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  // Reset hours to ensure accurate date comparisons
  today.setHours(0, 0, 0, 0);

  // Format date as YYYY-MM-DD for comparison
  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Generate calendar months
  const months = [];
  const currentDate = new Date(start);

  // Stats for tracking day states
  const stats = {
    totalDays: 0,
    past: 0,
    today: 0,
    future: 0,
    exceededGoal: 0,
  };

  while (currentDate <= end) {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const monthName = new Date(year, month, 1).toLocaleString("default", {
      month: "long",
    });

    // Get first day of month and how many days in month
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Create days array with empty spots for proper alignment
    const days = Array(firstDayOfMonth).fill(null);

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      // Reset hours to ensure accurate date comparison
      date.setHours(0, 0, 0, 0);

      const dateKey = formatDateKey(date);

      // Determine day state with reliable time-based comparison
      const isPast = date.getTime() < today.getTime();
      const isToday = date.getTime() === today.getTime();
      const isFuture = date.getTime() > today.getTime();
      const isInRange = date >= start && date <= end;

      // Only include days in our challenge range
      if (isInRange) {
        const mileage = activityMap[dateKey] || 0;
        const percentComplete = Math.min(100, (mileage / dailyGoal) * 100);
        const exceededGoal = mileage > dailyGoal;

        // Update stats
        stats.totalDays++;
        if (isPast) stats.past++;
        if (isToday) stats.today++;
        if (isFuture) stats.future++;
        if (exceededGoal) stats.exceededGoal++;

        days.push({
          day: i,
          date: dateKey,
          mileage,
          percentComplete,
          isPast,
          isToday,
          isFuture,
          exceededGoal,
        });
      } else {
        days.push(null);
      }
    }

    months.push({
      month: monthName,
      year,
      days,
    });

    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Get visual representation based on completion percentage
  const getCompletionStyle = (
    percent: number,
    isPast: boolean,
    isToday: boolean,
    isFuture: boolean,
    exceededGoal: boolean
  ) => {
    // Define base styles
    const baseStyles = {
      ringColor: "",
      bgColor: "",
      textColor: "text-gray-800 dark:text-gray-200",
    };

    // Set colors based on completion percentage
    if (exceededGoal) {
      baseStyles.ringColor = "ring-purple-500 dark:ring-purple-400";
      baseStyles.bgColor = "bg-purple-100/50 dark:bg-purple-950/30";
    } else if (percent >= 100) {
      baseStyles.ringColor = "ring-green-500 dark:ring-green-400";
      baseStyles.bgColor = "bg-green-100/50 dark:bg-green-950/30";
    } else if (percent >= 75) {
      baseStyles.ringColor = "ring-green-400 dark:ring-green-500";
      baseStyles.bgColor = "bg-green-50/50 dark:bg-green-900/20";
    } else if (percent >= 50) {
      baseStyles.ringColor = "ring-yellow-400 dark:ring-yellow-400";
      baseStyles.bgColor = "bg-yellow-50/50 dark:bg-yellow-900/20";
    } else if (percent > 0) {
      baseStyles.ringColor = "ring-orange-400 dark:ring-orange-400";
      baseStyles.bgColor = "bg-orange-50/50 dark:bg-orange-900/20";
    } else if (isPast) {
      baseStyles.ringColor = "ring-red-300 dark:ring-red-700";
      baseStyles.bgColor = "bg-red-50/50 dark:bg-red-950/20";
      baseStyles.textColor = "text-gray-400 dark:text-gray-500";
    } else if (isFuture) {
      // Explicit future styles
      baseStyles.ringColor = "ring-gray-200 dark:ring-gray-700";
      baseStyles.bgColor = "bg-gray-50/50 dark:bg-gray-800/50";
      baseStyles.textColor = "text-gray-400 dark:text-gray-600";
    } else {
      baseStyles.ringColor = "ring-gray-200 dark:ring-gray-700";
      baseStyles.bgColor = "bg-gray-50/50 dark:bg-gray-800/50";
      baseStyles.textColor = "text-gray-400 dark:text-gray-600";
    }

    // Add today highlight
    if (isToday) {
      baseStyles.ringColor = `${baseStyles.ringColor} ring-offset-2 ring-offset-white dark:ring-offset-slate-950`;
    }

    return baseStyles;
  };

  return (
    <Card className="backdrop-blur-md bg-card/90 shadow-md border-opacity-50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl tracking-tight">
          Activity Calendar
        </CardTitle>
        <div className="text-xs text-muted-foreground flex gap-2 items-center">
          <span>{stats.exceededGoal} achievements</span>
          <div className="h-4 w-px bg-muted-foreground/20"></div>
          <span>
            {stats.past} past · {stats.today} today · {stats.future} future
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Calendar legend */}
        <div className="flex justify-center gap-3 flex-wrap text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-300 dark:bg-red-700"></div>
            <span>Missed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-orange-300 dark:bg-orange-500"></div>
            <span>&lt;50%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-300 dark:bg-yellow-500"></div>
            <span>50-74%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-300 dark:bg-green-500"></div>
            <span>75-99%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-600"></div>
            <span>100%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-purple-500 dark:bg-purple-400"></div>
            <span>Exceeded</span>
          </div>
        </div>

        {months.map((month, index) => (
          <div key={index} className="space-y-3">
            <h3 className="font-medium text-lg">
              {month.month} {month.year}
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {/* Day names */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs text-muted-foreground font-medium py-1"
                >
                  {day}
                </div>
              ))}

              {/* Calendar cells */}
              {month.days.map((day, i) => {
                if (day === null) {
                  return <div key={`empty-${i}`} className="aspect-square" />;
                }

                const { ringColor, bgColor, textColor } = getCompletionStyle(
                  day.percentComplete,
                  day.isPast,
                  day.isToday,
                  day.isFuture,
                  day.exceededGoal
                );

                // Ring width based on percentage
                const ringWidth = day.percentComplete > 0 ? "ring-2" : "ring-1";

                // Animation for today
                const todayAnimation = day.isToday
                  ? "animate-[pulse_2s_ease-in-out_1]"
                  : "";

                // Prepare tooltip content
                const tooltipContent =
                  day.mileage > 0
                    ? `${day.date}: ${day.mileage.toFixed(
                        1
                      )} / ${dailyGoal} miles (${day.percentComplete.toFixed(
                        0
                      )}%)`
                    : `${day.date}: No activity recorded`;

                // Achievement star for exceeding goal
                const achievementBadge = day.exceededGoal ? (
                  <span className="absolute -top-1 -right-1 text-xs text-yellow-500 dark:text-yellow-300 animate-[bounce_1s_ease-in-out_infinite]">
                    ⭐
                  </span>
                ) : null;

                return (
                  <TooltipProvider key={day.date}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`
                            aspect-square rounded-full flex flex-col items-center justify-center
                            ${ringWidth} ${ringColor} ${bgColor} ${textColor} ${todayAnimation}
                            transition-all duration-200 hover:scale-110 hover:shadow-md
                            active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary
                            relative cursor-pointer
                          `}
                        >
                          <span className="text-xs font-medium">{day.day}</span>

                          {/* Mileage */}
                          {day.mileage > 0 && (
                            <span className="text-[9px]">
                              {day.mileage.toFixed(1)}mi
                            </span>
                          )}

                          {/* Achievement badge */}
                          {achievementBadge}

                          {/* Only show "missed" for past days with zero mileage */}
                          {day.mileage === 0 && day.isPast && !day.isToday && (
                            <span className="text-[8px] text-red-500 dark:text-red-400">
                              missed
                            </span>
                          )}

                          {/* Show "today" indicator for today's date with no mileage */}
                          {day.mileage === 0 && day.isToday && (
                            <span className="text-[8px] text-primary">
                              today
                            </span>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        {tooltipContent}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ActivityCalendar;
