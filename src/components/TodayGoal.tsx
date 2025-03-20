import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Confetti from "@/components/Confetti";
import ActivityIcon from "@/components/ActivityIcon";

interface TodayActivity {
  id: number;
  name: string;
  type: string;
  date: string;
  distance: number;
  isCycling: boolean;
  convertedDistance: number;
}

interface TodayGoalProps {
  todayMiles: number;
  todayMilesRemaining: number;
  dailyGoal: number;
  todayPercentComplete: number;
  todayActivities: TodayActivity[];
  isLoading: boolean;
}

const TodayGoal: React.FC<TodayGoalProps> = ({
  todayMiles = 0,
  todayMilesRemaining = 0,
  dailyGoal = 10,
  todayPercentComplete = 0,
  todayActivities = [],
  isLoading = false,
}) => {
  // State to track if we should show confetti
  const [showConfetti, setShowConfetti] = useState(false);

  // Track previous todayMiles value to detect when goal is completed
  const [prevMiles, setPrevMiles] = useState(0);

  // Check if goal was just completed
  useEffect(() => {
    if (todayMiles >= dailyGoal && prevMiles < dailyGoal) {
      setShowConfetti(true);

      // Hide confetti after animation completes
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 4000);

      return () => clearTimeout(timer);
    }

    setPrevMiles(todayMiles);
  }, [todayMiles, dailyGoal, prevMiles]);

  if (isLoading) {
    return (
      <Card className="overflow-hidden backdrop-blur-md bg-card/90 shadow-md border-opacity-50">
        <CardHeader className="pb-3">
          <Skeleton className="h-8 w-40" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Get circular progress color
  const getProgressColor = () => {
    if (todayPercentComplete >= 100) return "var(--success)";
    if (todayPercentComplete >= 50) return "var(--primary)";
    if (todayPercentComplete > 0) return "var(--warning)";
    return "var(--danger)";
  };

  // Get status message and color based on completion
  const getStatusInfo = () => {
    if (todayMiles >= dailyGoal) {
      return {
        message: "Goal Completed! 🎉",
        color: "text-success",
        bgColor: "bg-success/10",
      };
    }

    if (todayMiles > 0) {
      return {
        message: (
          <div className="flex flex-col items-center">
            <span>{todayMilesRemaining.toFixed(1)} miles to go today</span>
            <div className="flex items-center gap-1 text-xs mt-1 text-blue-500 dark:text-blue-400">
              <ActivityIcon type="Ride" size={12} className="flex-shrink-0" />
              <span>
                or {(todayMilesRemaining * 3.33).toFixed(1)} cycling miles
              </span>
            </div>
          </div>
        ),
        color: "text-warning dark:text-warning",
        bgColor: "bg-warning/10",
      };
    }

    return {
      message: "No activity recorded yet today",
      color: "text-danger",
      bgColor: "bg-danger/10",
    };
  };

  const { message, color, bgColor } = getStatusInfo();

  // Format percentage for display
  const displayPercentage = Math.min(100, Math.round(todayPercentComplete));

  return (
    <Card className="overflow-hidden backdrop-blur-md bg-card/90 shadow-md border-opacity-50 relative">
      {/* Confetti animation when goal is completed */}
      <Confetti active={showConfetti} />

      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-xl tracking-tight">
          Today&apos;s Goal
        </CardTitle>
        <div className="text-sm font-medium text-muted-foreground">
          {new Date().toLocaleDateString("en-US", { weekday: "long" })}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Circular Progress */}
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            {/* Background circle */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-muted stroke-current"
                strokeWidth="10"
                cx="50"
                cy="50"
                r="40"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset="0"
              />
              {/* Progress circle */}
              <circle
                className="stroke-current transition-all duration-700 ease-in-out"
                style={{
                  stroke: getProgressColor(),
                  strokeDashoffset: `${
                    251.2 - (251.2 * todayPercentComplete) / 100
                  }`,
                }}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="251.2"
                cx="50"
                cy="50"
                r="40"
                fill="none"
              />
            </svg>

            {/* Inner content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{displayPercentage}%</span>
              <span className="text-xs text-muted-foreground mt-1">
                {todayMiles.toFixed(1)} / {dailyGoal} mi
              </span>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className={`p-4 rounded-xl ${bgColor} backdrop-blur-sm`}>
          <p className={`text-lg font-medium text-center ${color}`}>
            {message}
          </p>
        </div>

        {/* Today&apos;s Activities */}
        {todayActivities && todayActivities.length > 0 ? (
          <>
            <Separator className="my-2" />
            <div>
              <h3 className="text-sm font-medium mb-3">
                Today&apos;s Activities
              </h3>
              <ul className="space-y-3">
                {todayActivities.map((activity) => (
                  <li
                    key={activity.id}
                    className="text-sm flex items-center justify-between p-2 rounded-lg bg-secondary/50 backdrop-blur-sm hover:bg-secondary/80 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                        <ActivityIcon type={activity.type} size={20} />
                      </span>
                      <span className="font-medium">{activity.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">
                        {activity.distance.toFixed(2)} mi
                      </span>
                      {activity.isCycling && (
                        <div className="text-xs text-muted-foreground">
                          = {activity.convertedDistance.toFixed(2)} mi
                          <span className="ml-1 opacity-70">(×0.3)</span>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {todayActivities.some((a) => a.isCycling) && (
                <div className="mt-3 text-xs p-2 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-300">
                  <div className="flex items-center gap-1">
                    <ActivityIcon
                      type="Ride"
                      size={18}
                      className="text-blue-500 dark:text-blue-300"
                    />
                    <span>
                      <strong>Cycling conversion:</strong> 3.33 miles of cycling
                      equals 1 mile toward your goal
                    </span>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground text-sm">
            <p>No activities recorded today</p>
            <p className="mt-1">Get moving to reach your daily goal!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodayGoal;
