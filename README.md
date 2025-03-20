# 100 Day Fitness Challenge Tracker

A personal fitness challenge tracker that connects to Strava to track progress toward 1,000 miles before turning 30 on June 28th. This app provides a visual dashboard for tracking daily activities, seeing progress stats, and includes a special cycling conversion feature (3.33 miles cycling = 1 mile walking/running).

![Dashboard Screenshot](docs/dashboard.png)

## Features

- **Strava Integration**: Automatically fetches your activities from Strava
- **Redis Caching**: Persistent caching with Upstash Redis reduces API calls
- **Progress Tracking**: Visual representations of progress toward 1,000-mile goal
- **Cycling Conversion**: Special conversion factor (3.33:1) for cycling activities
- **Daily Goal Tracking**: Shows progress toward daily target with visual indicators
- **Activity Calendar**: Monthly view of all activities with achievement badges
- **Type Breakdown**: Analysis of different activity types and their contributions
- **Recent Activities**: Shows your latest activities from Strava
- **Public Dashboard**: Anyone can view without logging in

## Setting Up Your Own Challenge

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/100-day-challenge.git
cd 100-day-challenge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a Strava API Application

1. Go to [Strava API Settings](https://www.strava.com/settings/api)
2. Create a new application:
   - Application Name: "100 Day Challenge" (or any name you prefer)
   - Website: http://localhost:3000
   - Authorization Callback Domain: localhost
3. Once created, note your **Client ID** and **Client Secret**

### 4. Get Strava Refresh Token

To access your Strava data without requiring manual login each time:

1. Create an authorization URL with your Client ID:

```
https://www.strava.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost&response_type=code&scope=activity:read_all
```

2. Open this URL in a browser and click "Authorize"
3. After authorizing, you'll be redirected to a URL containing an authorization code:
   `http://localhost?code=AUTHORIZATION_CODE&scope=read,activity:read_all`
4. Copy the `AUTHORIZATION_CODE` from the URL (everything after `code=` and before `&scope`)
5. Use this code to request tokens by running this in your terminal:

```bash
curl -X POST https://www.strava.com/oauth/token \
  -F client_id=YOUR_CLIENT_ID \
  -F client_secret=YOUR_CLIENT_SECRET \
  -F code=AUTHORIZATION_CODE \
  -F grant_type=authorization_code
```

6. In the JSON response, find and save the `refresh_token` value

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory with these values:

```env
# Strava API Credentials
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret
STRAVA_REFRESH_TOKEN=your_refresh_token

# Challenge Configuration
CHALLENGE_START_DATE=2024-03-20     # Your challenge start date
CHALLENGE_END_DATE=2024-06-28       # Your challenge end date
CHALLENGE_GOAL_MILES=1000           # Total mileage goal
CHALLENGE_DAILY_GOAL=10             # Daily mileage target

# Upstash Redis (Optional - for persistent caching)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

You can customize the challenge dates and goals to match your personal targets.

### 6. Run the development server

Use our smart start script which prevents running multiple instances:

```bash
./start-dev.sh
```

Open [http://localhost:3000](http://localhost:3000) to see your challenge dashboard.

### 7. Deploy to Production

For production deployment, you can use Vercel or Netlify:

```bash
npm run build
```

Remember to set your environment variables in your hosting platform.

## Cycling Conversion Feature

This app includes a special feature for cyclists: cycling miles are converted to equivalent running/walking miles at a 3.33:1 ratio. This means:

- 3.33 miles of cycling = 1 mile toward your challenge goal
- Visual indicators throughout the app show both raw and converted distances
- Projections account for this conversion when showing pace and remaining miles needed

You can see cycling equivalents for:

- Required daily pace
- Remaining miles to goal
- Today's goal
- Each activity's contribution

## Refreshing Your Strava Token

The Strava refresh token is valid for a long time but not forever. If you encounter authentication issues:

1. Repeat the steps from section 4 to get a new authorization code
2. Generate a new refresh token with the curl command
3. Update the `STRAVA_REFRESH_TOKEN` in your `.env.local` file

## API Caching System

The app includes a smart caching system to reduce the number of API calls to Strava:

- **Redis Integration**: Uses Upstash Redis for persistent cross-instance caching
- **Caching Duration**: Data from Strava is cached for 10 minutes
- **Separate Cache Keys**: Different parts of the data have their own cache keys
- **Visual Indicators**: The UI shows when data is coming from cache
- **Token Management**: Access tokens are cached separately with longer TTL (45 minutes)

This prevents excessive API calls while still keeping data reasonably fresh. The cache automatically invalidates after 10 minutes, ensuring you'll see new activities within that timeframe.

### Setting Up Redis Caching

1. Create a free account at [Upstash](https://upstash.com/)
2. Create a new Redis database
3. Copy your `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from the Upstash dashboard
4. Add these values to your `.env.local` file

With Redis caching enabled, the app will:

- Cache data persistently across server restarts
- Share cached data across multiple instances (if deployed)
- Reduce Strava API calls to once every 10 minutes
- Show "Cached" indicator when serving cached data

## Technologies Used

- Next.js 15
- React 19
- TailwindCSS 4
- SWR for data fetching
- Strava API
- Shadcn UI components
- Upstash Redis for persistent caching

## Customization

You can customize your challenge by modifying:

- `.env.local` file for challenge dates and goal
- Component styling in the respective component files
- Data display and calculations in `src/utils/strava.ts` and `src/app/page.tsx`
- Cycling conversion ratio in `src/utils/strava.ts` (currently 3.33:1)
