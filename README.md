# 100 Day Fitness Challenge Tracker

A personal fitness challenge tracker that connects to Strava to track progress toward 1,000 miles before turning 30 on June 28th.

## Features

- Connects to Strava API to fetch real activity data
- Tracks progress toward a 1,000-mile goal
- Displays statistics on pace, projection, and activity types
- Shows recent activities from Strava
- Public dashboard that anyone can view without logging in

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd 100-day-challenge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a Strava API Application

1. Go to [Strava API Settings](https://www.strava.com/settings/api)
2. Create a new application
3. Note your Client ID and Client Secret

### 4. Get Strava Refresh Token

You'll need to get a refresh token that will allow the app to fetch your activities without requiring users to log in. Follow these steps:

1. Navigate to:

```
https://www.strava.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost&response_type=code&scope=activity:read_all
```

Replace `YOUR_CLIENT_ID` with your Strava application client ID.

2. Authorize the application
3. You'll be redirected to a URL that contains an authorization code (e.g., `http://localhost?code=abc123...`)
4. Use this code to request tokens:

```bash
curl -X POST https://www.strava.com/oauth/token \
  -F client_id=YOUR_CLIENT_ID \
  -F client_secret=YOUR_CLIENT_SECRET \
  -F code=AUTHORIZATION_CODE \
  -F grant_type=authorization_code
```

5. In the response, you'll receive a `refresh_token`. Save this for the next step.

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory with your Strava credentials:

```env
# Strava API Credentials
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret
STRAVA_REFRESH_TOKEN=your_refresh_token

# Challenge Configuration
CHALLENGE_START_DATE=2024-03-20
CHALLENGE_END_DATE=2024-06-28
CHALLENGE_GOAL_MILES=1000
CHALLENGE_DAILY_GOAL=10
```

### 6. Run the development server

Instead of directly using `npm run dev`, use our smart start script to avoid running multiple instances:

```bash
./start-dev.sh
```

Open [http://localhost:3000](http://localhost:3000) to see your challenge dashboard.

### 7. Deploy to Production

For production deployment, you can use services like Vercel or Netlify:

```bash
npm run build
```

## Development Tools

This project includes custom tools to manage development server instances. For details, see [DEV-TOOLS.md](./DEV-TOOLS.md).

Key features:

- Smart start script that checks for running instances
- VSCode tasks for server management
- Keyboard shortcuts for common operations

## Technologies Used

- Next.js 15
- React 19
- TailwindCSS 4
- SWR for data fetching
- Strava API
- Shadcn UI components

## Refresh Token Management

The Strava refresh token is valid for a long time but not forever. If you encounter authentication issues, you'll need to generate a new refresh token using the steps in the setup instructions.

## Customization

You can customize your challenge by modifying the following:

- `.env.local` file for challenge dates and goal
- Component styling in the respective component files
- Data display and calculations in `src/app/page.tsx`
