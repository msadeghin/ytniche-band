# Convex Backend — YouTube Niche Band

## Setup

1. **YouTube Data API Key:** Get a free API key from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Enable the "YouTube Data API v3"
   - Create an API key (restrict it to YouTube Data API)
   - Free tier: 10,000 units/day (enough for ~100-200 channel searches)

2. **Set the API key in Convex:**
   ```bash
   npx convex env set YOUTUBE_API_KEY your_key_here
   ```

## Architecture

- `schema.ts` — Database schema (analyses, channels, nicheBends, cache)
- `youtube.ts` — YouTube Data API v3 wrapper (Convex actions for external API calls)
- `analysis.ts` — Pure logic analysis engine (no AI dependency)
  - Format detection
  - Category classification  
  - Opportunity scoring
  - Niche bend generation
  - Validation logic

## Usage

The analysis engine works 100% with pure logic — no Claude, NexLev, or AI API needed.
All analysis algorithms are self-contained in `analysis.ts`.
