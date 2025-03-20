import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import ActivityIcon from "@/components/ActivityIcon";

interface ChallengeStatsProps {
  totalMiles: number;
  goalMiles: number;
  daysPassed: number;
  daysRemaining: number;
  totalDays: number;
  milesPerDay: number;
  requiredPacePerDay: number;
  projectedTotal: number;
  isLoading: boolean;
}

const ChallengeStats: React.FC<ChallengeStatsProps> = ({
  totalMiles = 0,
  goalMiles = 1000,
  daysPassed = 0,
  daysRemaining = 100,
  totalDays = 100,
  milesPerDay = 0,
  requiredPacePerDay = 10,
  projectedTotal = 0,
  isLoading = false,
}) => {
  // Calculate progress percentages
  const progressPercentage = (totalMiles / goalMiles) * 100;
  const timePercentage = (daysPassed / totalDays) * 100;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="backdrop-blur-md bg-card/90 shadow-md border-opacity-50">
          <CardHeader>
            <Skeleton className="h-8 w-32" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-md bg-card/90 shadow-md border-opacity-50">
          <CardHeader>
            <Skeleton className="h-8 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Determine if on track (green) or behind (red)
  const onTrack = milesPerDay >= requiredPacePerDay;
  const paceComparisonClass = onTrack ? "text-success" : "text-danger";

  // Will meet goal?
  const willMeetGoal = projectedTotal >= goalMiles;
  const projectionClass = willMeetGoal ? "text-success" : "text-danger";

  // Format dates for display
  const formattedEndDate = new Date(
    Date.now() + daysRemaining * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="backdrop-blur-md bg-card/90 shadow-md border-opacity-50">
        <CardHeader>
          <CardTitle className="text-xl tracking-tight">
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Miles Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Miles Covered
                </h4>
                <p className="text-2xl font-bold">
                  {totalMiles.toFixed(1)}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    / {goalMiles} miles
                  </span>
                </p>
              </div>
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {progressPercentage.toFixed(1)}%
              </div>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            {/* Miles remaining with cycling equivalent */}
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{(goalMiles - totalMiles).toFixed(1)} miles to go</span>
              <div className="flex items-center gap-1 text-blue-500">
                <ActivityIcon type="Ride" size={12} className="flex-shrink-0" />
                <span>
                  or {((goalMiles - totalMiles) * 3.33).toFixed(1)} cycling
                  miles
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Time Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Time Elapsed
                </h4>
                <p className="text-2xl font-bold">
                  {daysPassed}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    / {totalDays} days
                  </span>
                </p>
              </div>
              <div className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium">
                {timePercentage.toFixed(1)}%
              </div>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-success transition-all"
                style={{ width: `${timePercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {daysRemaining} days remaining until {formattedEndDate}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-md bg-card/90 shadow-md border-opacity-50">
        <CardHeader>
          <CardTitle className="text-xl tracking-tight">
            Pace & Projections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl p-4 bg-primary/5 backdrop-blur-sm border border-primary/10">
              <h3 className="text-sm text-primary/80 font-medium mb-1">
                Current Pace
              </h3>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold">{milesPerDay.toFixed(1)}</p>
                <p className="text-xs ml-1 text-muted-foreground">mi/day</p>
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-blue-500">
                <ActivityIcon type="Ride" size={12} className="flex-shrink-0" />
                <span className="truncate">
                  ≈ {(milesPerDay * 3.33).toFixed(1)} cycling mi
                </span>
              </div>
            </div>

            <div className="rounded-xl p-4 bg-success/5 backdrop-blur-sm border border-success/10">
              <h3 className="text-sm text-success/80 font-medium mb-1">
                Required Pace
              </h3>
              <div className="flex items-baseline">
                <p className={`text-2xl font-bold ${paceComparisonClass}`}>
                  {requiredPacePerDay.toFixed(1)}
                </p>
                <p className="text-xs ml-1 text-muted-foreground">mi/day</p>
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-blue-500">
                <ActivityIcon type="Ride" size={12} className="flex-shrink-0" />
                <span className="truncate">
                  {(requiredPacePerDay * 3.33).toFixed(1)} cycling mi
                </span>
              </div>
            </div>

            <div className="rounded-xl p-4 bg-indigo-500/5 backdrop-blur-sm border border-indigo-500/10">
              <h3 className="text-sm text-indigo-500/80 font-medium mb-1">
                Days Remaining
              </h3>
              <p className="text-2xl font-bold">{daysRemaining}</p>
            </div>

            <div className="rounded-xl p-4 bg-amber-500/5 backdrop-blur-sm border border-amber-500/10">
              <h3 className="text-sm text-amber-500/80 font-medium mb-1">
                Projected Total
              </h3>
              <div className="flex items-baseline">
                <p className={`text-2xl font-bold ${projectionClass}`}>
                  {projectedTotal.toFixed(0)}
                </p>
                <p className="text-xs ml-1 text-muted-foreground">miles</p>
              </div>
            </div>
          </div>

          {/* Pace Comparison */}
          <div className="mt-4 p-4 rounded-xl bg-secondary/50 backdrop-blur-sm">
            <h3 className="text-sm font-medium mb-2">Pace Analysis</h3>
            <p className="text-sm">
              {onTrack ? (
                <span className="text-success">
                  You&apos;re ahead of pace! Keep it up! 🎉
                </span>
              ) : (
                <span className="text-danger">
                  You need to increase your pace by{" "}
                  {(requiredPacePerDay - milesPerDay).toFixed(1)} mi/day to
                  reach your goal.
                </span>
              )}
            </p>

            {/* Add cycling equivalent info */}
            {!onTrack && (
              <div className="mt-2 pt-2 border-t border-border/30">
                <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400">
                  <ActivityIcon
                    type="Ride"
                    size={16}
                    className="text-blue-500"
                  />
                  <span>
                    <strong>Cycling equivalent:</strong>{" "}
                    {((requiredPacePerDay - milesPerDay) * 3.33).toFixed(1)}{" "}
                    cycling miles/day
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChallengeStats;
