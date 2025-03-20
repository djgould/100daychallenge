import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import ActivityIcon from "@/components/ActivityIcon";

// Define types for activity breakdown
interface ActivityTypeStats {
  count: number;
  distance: number;
  rawDistance: number;
  convertedDistance: number;
}

interface ActivityTypeBreakdownProps {
  activityTypes: Record<string, ActivityTypeStats>;
  isLoading: boolean;
}

// Color mappings for different activity types
const activityTypeColors: Record<string, { color: string; bgColor: string }> = {
  Run: {
    color: "rgb(255, 69, 58)",
    bgColor: "rgba(255, 69, 58, 0.1)",
  },
  Ride: {
    color: "rgb(10, 132, 255)",
    bgColor: "rgba(10, 132, 255, 0.1)",
  },
  Walk: {
    color: "rgb(48, 209, 88)",
    bgColor: "rgba(48, 209, 88, 0.1)",
  },
  Hike: {
    color: "rgb(255, 214, 10)",
    bgColor: "rgba(255, 214, 10, 0.1)",
  },
  Swim: {
    color: "rgb(100, 210, 255)",
    bgColor: "rgba(100, 210, 255, 0.1)",
  },
  Workout: {
    color: "rgb(191, 90, 242)",
    bgColor: "rgba(191, 90, 242, 0.1)",
  },
  WeightTraining: {
    color: "rgb(94, 92, 230)",
    bgColor: "rgba(94, 92, 230, 0.1)",
  },
  Yoga: {
    color: "rgb(172, 142, 104)",
    bgColor: "rgba(172, 142, 104, 0.1)",
  },
  default: {
    color: "rgb(142, 142, 147)",
    bgColor: "rgba(142, 142, 147, 0.1)",
  },
};

const ActivityTypeBreakdown: React.FC<ActivityTypeBreakdownProps> = ({
  activityTypes = {},
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card className="backdrop-blur-md bg-card/90 shadow-md border-opacity-50">
        <CardHeader>
          <CardTitle className="text-xl tracking-tight">
            Activity Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Safety check - ensure activityTypes is an object
  const safeActivityTypes = activityTypes || {};

  // Sort activity types by distance (highest first)
  const sortedActivityTypes = Object.entries(safeActivityTypes).sort(
    (a, b) => b[1].distance - a[1].distance
  );

  // Calculate total distance for percentages
  const totalDistance = Object.values(safeActivityTypes).reduce(
    (sum, stats) => sum + stats.distance,
    0
  );

  if (!safeActivityTypes || Object.keys(safeActivityTypes).length === 0) {
    return (
      <Card className="backdrop-blur-md bg-card/90 shadow-md border-opacity-50">
        <CardHeader>
          <CardTitle className="text-xl tracking-tight">
            Activity Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-muted mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-muted-foreground"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                />
              </svg>
            </div>
            <p className="text-muted-foreground">No activities recorded yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Activities will appear here as you log them
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-md bg-card/90 shadow-md border-opacity-50">
      <CardHeader>
        <CardTitle className="text-xl tracking-tight">
          Activity Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Activity Type Bars */}
        <div className="space-y-4">
          {sortedActivityTypes.map(([type, stats], index) => {
            const percentage = Math.round(
              (stats.distance / totalDistance) * 100
            );
            const { color, bgColor } =
              activityTypeColors[type] || activityTypeColors.default;

            const isCycling =
              type.toLowerCase() === "ride" ||
              type.toLowerCase() === "cycling" ||
              type.toLowerCase() === "virtualride";

            return (
              <div key={type} className="space-y-2">
                {index > 0 && <Separator className="my-3" />}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: bgColor }}
                    >
                      <ActivityIcon type={type} size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{type}</h3>
                      <p className="text-xs text-muted-foreground">
                        {stats.count}{" "}
                        {stats.count === 1 ? "activity" : "activities"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {stats.rawDistance
                        ? stats.rawDistance.toFixed(1)
                        : stats.distance.toFixed(1)}{" "}
                      mi
                      {isCycling && (
                        <span className="text-xs ml-1 text-muted-foreground">
                          = {stats.convertedDistance.toFixed(1)} mi goal
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {percentage}%
                    </p>
                  </div>
                </div>

                <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Show conversion info for cycling if it exists */}
        {sortedActivityTypes.some(
          ([type]) =>
            type.toLowerCase() === "ride" ||
            type.toLowerCase() === "cycling" ||
            type.toLowerCase() === "virtualride"
        ) && (
          <div className="mt-6 p-3 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-300 text-xs">
            <div className="flex items-start gap-2">
              <ActivityIcon
                type="Ride"
                size={16}
                className="text-blue-500 dark:text-blue-300 mt-0.5"
              />
              <div>
                <p className="font-medium mb-1">Cycling Conversion</p>
                <p>
                  For challenge progress, 3.33 miles of cycling equals 1 mile of
                  walking/running.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Total Summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Total Distance</h3>
              <p className="text-xs text-muted-foreground">
                {Object.keys(safeActivityTypes).length} activity types
              </p>
            </div>
            <p className="text-xl font-bold">{totalDistance.toFixed(1)} mi</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTypeBreakdown;
