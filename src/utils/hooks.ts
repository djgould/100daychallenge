import useSWR from "swr";

// Define challenge stats type
export interface ChallengeData {
  startDate: string;
  endDate: string;
  goalMiles: number;
  dailyGoal: number;
  totalDays: number;
  daysRemaining: number;
  daysPassed: number;
  totalMiles: number;
  progressPercentage: number;
  timePercentage: number;
  milesPerDay: number;
  requiredPacePerDay: number;
  projectedTotal: number;
  todayMiles: number;
  todayMilesRemaining: number;
  todayPercentComplete: number;
  todayActivities: Array<{
    id: number;
    name: string;
    type: string;
    date: string;
    distance: number;
    convertedDistance: number;
    isCycling: boolean;
  }>;
  dailyActivities: Array<{
    date: string;
    distance: number;
  }>;
  activityTypes: Record<
    string,
    {
      count: number;
      distance: number;
      rawDistance: number;
      convertedDistance: number;
    }
  >;
  totalActivities: number;
  recentActivities: Array<{
    id: number;
    name: string;
    type: string;
    date: string;
    distance: number;
    convertedDistance: number;
    isCycling: boolean;
  }>;
  _meta?: {
    cachedResponse: boolean;
    fetchDurationMs: number;
    cacheItems: number;
    timestamp: string;
    nextRefreshAt: string | null;
  };
}

// Function to fetch data from the API
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Hook to fetch challenge stats
export function useChallengeStats() {
  const { data, error, isLoading, mutate } = useSWR<ChallengeData>(
    "/api/strava/stats",
    fetcher,
    {
      refreshInterval: 3600000, // Auto refresh every hour
      revalidateOnFocus: false,
      dedupingInterval: 600000, // Dedupe requests within 10 minutes
    }
  );

  return {
    data,
    isLoading,
    isError: error,
    refreshData: mutate,
  };
}
