import { NextResponse } from "next/server";
import { getChallengeStats } from "@/utils/strava";
import { getCacheStats } from "@/utils/cache";

export const dynamic = "force-dynamic"; // Disable caching for this route

export async function GET() {
  try {
    // Get challenge configuration from environment variables
    const startDate = process.env.CHALLENGE_START_DATE || "2024-03-20";
    const endDate = process.env.CHALLENGE_END_DATE || "2024-06-28";
    const goalMiles = Number(process.env.CHALLENGE_GOAL_MILES || 1000);
    const dailyGoal = Number(process.env.CHALLENGE_DAILY_GOAL || 10);

    // Calculate challenge timeframe
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    // Ensure today is clamped between start and end dates
    const effectiveDate = new Date(
      Math.max(start.getTime(), Math.min(today.getTime(), end.getTime()))
    );

    const totalDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysRemaining = Math.max(
      0,
      Math.ceil(
        (end.getTime() - effectiveDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    );
    const daysPassed = Math.min(
      totalDays,
      Math.max(
        0,
        Math.ceil(
          (effectiveDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        )
      )
    );

    // Get cache stats before fetching data
    const cacheStatsBefore = await getCacheStats();

    // Start time to measure data fetch duration
    const fetchStart = Date.now();

    // Get Strava data
    const stravaStats = await getChallengeStats();

    // Calculate fetch duration
    const fetchDuration = Date.now() - fetchStart;

    // Get cache stats after fetching data
    const cacheStatsAfter = await getCacheStats();

    // Calculate progress and projections
    const progressPercentage = (stravaStats.totalMiles / goalMiles) * 100;
    const timePercentage = (daysPassed / totalDays) * 100;
    const milesPerDay =
      daysPassed > 0 ? stravaStats.totalMiles / daysPassed : 0;
    const requiredPacePerDay =
      daysRemaining > 0
        ? (goalMiles - stravaStats.totalMiles) / daysRemaining
        : 0;
    const projectedTotal = milesPerDay * totalDays;

    // Calculate today's remaining miles
    const todayMiles = stravaStats.todayMiles || 0;
    const todayMilesRemaining = Math.max(0, dailyGoal - todayMiles);
    const todayPercentComplete = Math.min(100, (todayMiles / dailyGoal) * 100);

    // Determine if data came from cache
    // With Redis, we check for error or changes in cache stats
    const wasCached =
      !cacheStatsAfter.error &&
      cacheStatsBefore.activeItems === cacheStatsAfter.activeItems;

    // Return complete stats
    return NextResponse.json({
      startDate,
      endDate,
      goalMiles,
      dailyGoal,
      totalDays,
      daysRemaining,
      daysPassed,
      totalMiles: stravaStats.totalMiles,
      progressPercentage,
      timePercentage,
      milesPerDay,
      requiredPacePerDay,
      projectedTotal,
      todayMiles,
      todayMilesRemaining,
      todayPercentComplete,
      todayActivities: stravaStats.todayActivities || [],
      dailyActivities: stravaStats.dailyActivities || [],
      activityTypes: stravaStats.activityTypes,
      totalActivities: stravaStats.totalActivities,
      recentActivities: stravaStats.recentActivities,
      _meta: {
        cachedResponse: wasCached,
        fetchDurationMs: fetchDuration,
        cacheItems: cacheStatsAfter.activeItems,
        timestamp: new Date().toISOString(),
        nextRefreshAt: wasCached
          ? null
          : new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        cacheType: "redis",
        cacheProvider: "upstash",
      },
    });
  } catch (error) {
    console.error("Error fetching challenge stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenge stats" },
      { status: 500 }
    );
  }
}
