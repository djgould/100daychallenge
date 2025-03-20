"use client";

import React from "react";
import ChallengeStats from "@/components/ChallengeStats";
import RecentActivities from "@/components/RecentActivities";
import ActivityTypeBreakdown from "@/components/ActivityTypeBreakdown";
import ActivityCalendar from "@/components/ActivityCalendar";
import TodayGoal from "@/components/TodayGoal";
import { useChallengeStats } from "@/utils/hooks";
import { Button } from "@/components/ui/button";

export default function Home() {
  // Fetch challenge data
  const { data, isLoading, isError, refreshData } = useChallengeStats();

  // Add state for last updated time (to avoid hydration mismatch)
  const [lastUpdated, setLastUpdated] = React.useState<string>("");

  // Update the time only on client-side
  React.useEffect(() => {
    setLastUpdated(new Date().toLocaleString());
  }, []);

  // Show error state if data fetching failed
  if (isError) {
    return (
      <div className="min-h-[100dvh] p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-background to-background dark:from-slate-900 dark:via-background dark:to-background">
        <main className="max-w-5xl mx-auto">
          <div className="text-center py-12">
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-danger/10 text-danger">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-danger mb-4">
              Data Connection Error
            </h1>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We&apos;re having trouble connecting to Strava. This could be due
              to API limits or configuration issues.
            </p>
            <Button
              onClick={() => refreshData()}
              className="bg-primary hover:bg-primary/90 text-white shadow-sm"
            >
              Try Again
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Fallback values if data is loading
  const stats =
    isLoading || !data
      ? {
          totalMiles: 0,
          goalMiles: 1000,
          dailyGoal: 10,
          daysPassed: 0,
          daysRemaining: 100,
          totalDays: 100,
          milesPerDay: 0,
          requiredPacePerDay: 10,
          projectedTotal: 0,
          todayMiles: 0,
          todayMilesRemaining: 10,
          todayPercentComplete: 0,
          todayActivities: [],
          dailyActivities: [],
          activityTypes: {},
          recentActivities: [],
          startDate: "2024-03-20",
          endDate: "2024-06-28",
        }
      : {
          totalMiles: data.totalMiles || 0,
          goalMiles: data.goalMiles || 1000,
          dailyGoal: data.dailyGoal || 10,
          daysPassed: data.daysPassed || 0,
          daysRemaining: data.daysRemaining || 100,
          totalDays: data.totalDays || 100,
          milesPerDay: data.milesPerDay || 0,
          requiredPacePerDay: data.requiredPacePerDay || 10,
          projectedTotal: data.projectedTotal || 0,
          todayMiles: data.todayMiles || 0,
          todayMilesRemaining: data.todayMilesRemaining || 10,
          todayPercentComplete: data.todayPercentComplete || 0,
          todayActivities: data.todayActivities || [],
          dailyActivities: data.dailyActivities || [],
          activityTypes: data.activityTypes || {},
          recentActivities: data.recentActivities || [],
          startDate: data.startDate || "2024-03-20",
          endDate: data.endDate || "2024-06-28",
        };

  return (
    <div className="min-h-[100dvh] p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-background to-background dark:from-slate-900 dark:via-background dark:to-background">
      <main className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 mb-2">
            100 Day Fitness Challenge
          </h1>
          <p className="text-muted-foreground">
            Tracking my journey to 1,000 miles before turning 30
          </p>
          <div className="mt-3 text-sm text-blue-600 dark:text-blue-400 inline-flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/30 py-1 px-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-bounce"
            >
              <path d="M8 21.75a5.75 5.75 0 1 0 0-11.5 5.75 5.75 0 0 0 0 11.5ZM16 21.75a5.75 5.75 0 1 0 0-11.5 5.75 5.75 0 0 0 0 11.5Z" />
              <path d="M12 6.75a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
              <path d="M11.4 8.75l-4.9 5h4l2.5-2.5 2.5 5.5M7 16.75l6.5-6.5 4.5-2.5h3.5" />
            </svg>
            <span>New: 3.33 miles of cycling = 1 mile toward goal</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <ChallengeStats
              totalMiles={stats.totalMiles}
              goalMiles={stats.goalMiles}
              daysPassed={stats.daysPassed}
              daysRemaining={stats.daysRemaining}
              totalDays={stats.totalDays}
              milesPerDay={stats.milesPerDay}
              requiredPacePerDay={stats.requiredPacePerDay}
              projectedTotal={stats.projectedTotal}
              isLoading={isLoading}
            />
          </div>

          <div className="md:col-span-1">
            <TodayGoal
              todayMiles={stats.todayMiles}
              todayMilesRemaining={stats.todayMilesRemaining}
              dailyGoal={stats.dailyGoal}
              todayPercentComplete={stats.todayPercentComplete}
              todayActivities={stats.todayActivities}
              isLoading={isLoading}
            />
          </div>
        </div>

        <div className="mb-8">
          <ActivityCalendar
            dailyActivities={stats.dailyActivities}
            startDate={stats.startDate}
            endDate={stats.endDate}
            dailyGoal={stats.dailyGoal}
            isLoading={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ActivityTypeBreakdown
            activityTypes={stats.activityTypes}
            isLoading={isLoading}
          />

          <RecentActivities
            activities={stats.recentActivities}
            isLoading={isLoading}
          />
        </div>

        <footer className="text-center text-muted-foreground text-sm mt-10 pb-8">
          <p>Data powered by Strava API • Updated hourly</p>
          <p className="mt-1">Last updated: {lastUpdated}</p>
        </footer>
      </main>
    </div>
  );
}
