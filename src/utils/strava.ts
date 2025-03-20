import stravaApi from "strava-v3";
import { cachedFetch } from "./cache";

// Initialize the Strava client
stravaApi.config({
  access_token: "96528126683393f58b514f05fd0a4b1b5df3b3cf",
  client_id: process.env.STRAVA_CLIENT_ID || "",
  client_secret: process.env.STRAVA_CLIENT_SECRET || "",
  redirect_uri: "http://localhost",
});

// Cache TTL settings (in milliseconds)
const ACCESS_TOKEN_CACHE_TTL = 45 * 60 * 1000; // 45 minutes
const ACTIVITIES_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Types for Strava activities
export interface StravaActivity {
  id: number;
  name: string;
  distance: number; // in meters
  moving_time: number; // in seconds
  elapsed_time: number; // in seconds
  total_elevation_gain: number; // in meters
  type: string;
  sport_type: string;
  start_date: string;
  start_date_local: string;
  map: {
    summary_polyline: string;
  };
}

// Convert meters to miles
export const metersToMiles = (meters: number): number => {
  return meters * 0.000621371;
};

// Apply cycling conversion factor (3.33 miles cycling = 1 mile running/walking)
export const applyCyclingConversion = (activity: StravaActivity): number => {
  const distanceInMiles = metersToMiles(activity.distance);

  // Check if activity is cycling
  const activityType = (activity.sport_type || activity.type).toLowerCase();
  if (
    activityType === "ride" ||
    activityType === "cycling" ||
    activityType === "virtualride"
  ) {
    // Convert cycling miles to equivalent running/walking miles (3.33:1 ratio)
    return distanceInMiles / 3.33;
  }

  // For non-cycling activities, return the actual miles
  return distanceInMiles;
};

// Track raw (unconverted) and converted miles for activities
export const getActivityMiles = (activity: StravaActivity) => {
  const rawMiles = metersToMiles(activity.distance);
  const convertedMiles = applyCyclingConversion(activity);

  return {
    rawMiles,
    convertedMiles,
    isCycling: ["ride", "cycling", "virtualride"].includes(
      (activity.sport_type || activity.type).toLowerCase()
    ),
  };
};

// Function to get a new access token using refresh token
export const getAccessToken = async () => {
  return cachedFetch(
    "strava_access_token",
    async () => {
      try {
        const refreshToken = process.env.STRAVA_REFRESH_TOKEN;
        if (!refreshToken) {
          throw new Error("Strava refresh token is missing");
        }
        const response = await stravaApi.oauth.refreshToken(refreshToken);
        console.log("Strava access token refreshed:", response.access_token);
        return response.access_token;
      } catch (error) {
        console.error("Error refreshing Strava access token:", error);
        throw error;
      }
    },
    ACCESS_TOKEN_CACHE_TTL
  );
};

// Get athlete activities since a specific date
export const getActivitiesSinceDate = async (startDate: Date) => {
  const cacheKey = `strava_activities_since_${
    startDate.toISOString().split("T")[0]
  }`;

  return cachedFetch(
    cacheKey,
    async () => {
      try {
        console.log(
          `Fetching fresh Strava activities since ${startDate.toISOString()}`
        );
        // Get a fresh access token
        // @ts-expect-error - stravaApi.client doesn't have proper TypeScript definitions
        const strava = new stravaApi.client(await getAccessToken());
        // Convert date to epoch time
        const after = Math.floor(startDate.getTime() / 1000);

        // Get activities
        const activities = (await strava.athlete.listActivities({
          after,
          per_page: 200, // Maximum allowed by Strava
        })) as StravaActivity[];

        return activities;
      } catch (error) {
        console.error("Error fetching Strava activities:", error);
        throw error;
      }
    },
    ACTIVITIES_CACHE_TTL
  );
};

// Get daily activities for calendar view
export const getDailyActivities = async (startDate: Date, endDate: Date) => {
  const cacheKey = `strava_daily_activities_${
    startDate.toISOString().split("T")[0]
  }_${endDate.toISOString().split("T")[0]}`;

  return cachedFetch(
    cacheKey,
    async () => {
      try {
        const activities = await getActivitiesSinceDate(startDate);

        // Group activities by date (YYYY-MM-DD)
        const dailyActivities = activities.reduce((acc, activity) => {
          // Convert to local date and format as YYYY-MM-DD
          const date = new Date(activity.start_date_local);
          // Skip activities outside our date range
          if (date < startDate || date > endDate) return acc;

          const dateStr = date.toISOString().split("T")[0];

          if (!acc[dateStr]) {
            acc[dateStr] = 0;
          }

          // Apply cycling conversion for challenge progress
          acc[dateStr] += applyCyclingConversion(activity);
          return acc;
        }, {} as Record<string, number>);

        // Convert to array format for easier use in components
        return Object.entries(dailyActivities).map(([date, distance]) => ({
          date,
          distance,
        }));
      } catch (error) {
        console.error("Error getting daily activities:", error);
        throw error;
      }
    },
    ACTIVITIES_CACHE_TTL
  );
};

// Get today's activities for the daily goal tracker
export const getTodayActivities = async () => {
  const today = new Date().toISOString().split("T")[0];
  const cacheKey = `strava_today_activities_${today}`;

  return cachedFetch(
    cacheKey,
    async () => {
      try {
        // Start of today
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const activities = await getActivitiesSinceDate(todayStart);

        // Filter activities from today only and sum up miles
        const todayMiles = activities.reduce((sum, activity) => {
          const activityDate = new Date(activity.start_date_local);
          if (activityDate >= todayStart) {
            return sum + applyCyclingConversion(activity);
          }
          return sum;
        }, 0);

        return {
          todayMiles,
          todayActivities: activities.filter(
            (a) => new Date(a.start_date_local) >= todayStart
          ),
        };
      } catch (error) {
        console.error("Error getting today's activities:", error);
        throw error;
      }
    },
    ACTIVITIES_CACHE_TTL
  );
};

// Get challenge stats (total miles, activities, etc.)
export const getChallengeStats = async () => {
  const today = new Date().toISOString().split("T")[0];
  const cacheKey = `strava_challenge_stats_${today}`;

  return cachedFetch(
    cacheKey,
    async () => {
      try {
        console.log("Fetching fresh challenge stats from Strava");
        const startDate = new Date(
          process.env.CHALLENGE_START_DATE || "2024-03-20"
        );
        const endDate = new Date(
          process.env.CHALLENGE_END_DATE || "2024-06-28"
        );
        const dailyGoal = Number(process.env.CHALLENGE_DAILY_GOAL || 10);

        const activities = await getActivitiesSinceDate(startDate);
        const dailyActivities = await getDailyActivities(startDate, endDate);
        const { todayMiles, todayActivities } = await getTodayActivities();

        // Calculate total miles
        const totalMiles = activities.reduce((sum, activity) => {
          // Only count activities that involve distance (runs, rides, walks, etc.)
          if (activity.distance) {
            return sum + applyCyclingConversion(activity);
          }
          return sum;
        }, 0);

        // Group activities by type
        const activityTypes = activities.reduce(
          (acc, activity) => {
            const type = activity.sport_type || activity.type;
            if (!acc[type]) {
              acc[type] = {
                count: 0,
                distance: 0,
                rawDistance: 0,
                convertedDistance: 0,
              };
            }

            const { rawMiles, convertedMiles } = getActivityMiles(activity);

            acc[type].count += 1;
            acc[type].distance += convertedMiles; // For challenge progress (with conversion)
            acc[type].rawDistance += rawMiles; // Actual distance
            acc[type].convertedDistance += convertedMiles; // Converted distance
            return acc;
          },
          {} as Record<
            string,
            {
              count: number;
              distance: number;
              rawDistance: number;
              convertedDistance: number;
            }
          >
        );

        return {
          totalMiles,
          totalActivities: activities.length,
          activityTypes,
          dailyActivities,
          todayMiles,
          todayActivities: todayActivities.map((activity) => {
            const {
              rawMiles,
              convertedMiles,
              isCycling: isActivityCycling,
            } = getActivityMiles(activity);
            return {
              id: activity.id,
              name: activity.name,
              type: activity.sport_type || activity.type,
              date: activity.start_date_local,
              distance: rawMiles,
              convertedDistance: convertedMiles,
              isCycling: isActivityCycling,
            };
          }),
          dailyGoal,
          recentActivities: activities.slice(0, 5).map((activity) => {
            const {
              rawMiles,
              convertedMiles,
              isCycling: isActivityCycling,
            } = getActivityMiles(activity);
            return {
              id: activity.id,
              name: activity.name,
              type: activity.sport_type || activity.type,
              date: activity.start_date_local,
              distance: rawMiles,
              convertedDistance: convertedMiles,
              isCycling: isActivityCycling,
            };
          }),
        };
      } catch (error) {
        console.error("Error getting challenge stats:", error);
        throw error;
      }
    },
    ACTIVITIES_CACHE_TTL
  );
};
