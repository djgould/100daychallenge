import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import ActivityIcon from "@/components/ActivityIcon";

// Define types for recent activities
interface Activity {
  id: number;
  name: string;
  type: string;
  date: string;
  distance: number;
  convertedDistance: number;
  isCycling: boolean;
}

interface RecentActivitiesProps {
  activities: Activity[];
  isLoading: boolean;
}

// Activity type colors
const activityColors: Record<string, string> = {
  Run: "rgba(255, 69, 58, 0.1)",
  Ride: "rgba(10, 132, 255, 0.1)",
  Walk: "rgba(48, 209, 88, 0.1)",
  Hike: "rgba(255, 214, 10, 0.1)",
  Swim: "rgba(100, 210, 255, 0.1)",
  Workout: "rgba(191, 90, 242, 0.1)",
  WeightTraining: "rgba(94, 92, 230, 0.1)",
  Yoga: "rgba(172, 142, 104, 0.1)",
  default: "rgba(142, 142, 147, 0.1)",
};

const RecentActivities: React.FC<RecentActivitiesProps> = ({
  activities = [],
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card className="backdrop-blur-md bg-card/90 shadow-md border-opacity-50">
        <CardHeader>
          <CardTitle className="text-xl tracking-tight">
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50"
              >
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card className="backdrop-blur-md bg-card/90 shadow-md border-opacity-50">
        <CardHeader>
          <CardTitle className="text-xl tracking-tight">
            Recent Activities
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
                  d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                />
              </svg>
            </div>
            <p className="text-muted-foreground">No recent activities</p>
            <p className="text-xs text-muted-foreground mt-1">
              Activities will appear here as you complete them
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Function to format the relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay === 1) return "yesterday";
    if (diffDay < 7) return `${diffDay}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="backdrop-blur-md bg-card/90 shadow-md border-opacity-50">
      <CardHeader>
        <CardTitle className="text-xl tracking-tight">
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            // Get background color for activity type
            const bgColor =
              activityColors[activity.type] || activityColors.default;

            // Format relative time
            const relativeTime = getRelativeTime(activity.date);

            return (
              <div key={activity.id} className="group">
                {index > 0 && <Separator className="my-3" />}
                <div className="flex items-center gap-3 p-2 rounded-xl group-hover:bg-secondary/50 transition-colors duration-200">
                  <div
                    className="flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: bgColor }}
                  >
                    <ActivityIcon type={activity.type} size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium truncate">{activity.name}</h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {relativeTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{activity.type}</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                      <span className="font-medium">
                        {activity.distance.toFixed(2)} mi
                        {activity.isCycling && (
                          <span className="ml-1 opacity-70">
                            = {activity.convertedDistance.toFixed(2)} mi goal
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {activities.length > 0 && (
          <div className="mt-4 text-center">
            <button className="text-primary text-sm font-medium hover:underline">
              View All Activities
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
