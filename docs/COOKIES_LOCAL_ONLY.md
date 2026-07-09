# 🍪 Cookies: Local Only — Security Guide

> **Cookies are sensitive credentials. Handle them with the same care as passwords.**

## Overview

YTNiche Band uses YouTube cookies **only** for local yt-dlp metadata access. This allows the app to fetch real YouTube video/channel data without the YouTube Data API.

**Cookies are never:**
- Uploaded to any remote server
- Committed to Git
- Displayed in the app UI
- Logged to any file
- Shared with anyone

## How to Export Cookies

### Step 1: Install a cookies.txt exporter

| Browser | Recommended Extension |
|---------|---------------------|
| Chrome | [Get cookies.txt LOCALLY](https://chrome.google.com/webstore/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc) |
| Firefox | [cookies.txt](https://addons.mozilla.org/en-US/firefox/addon/cookies-txt/) |

### Step 2: Export cookies for youtube.com

1. Go to `https://www.youtube.com` and make sure you're logged in.
2. Use the extension to export cookies for `youtube.com`.
3. Save the file as `cookies.txt`.

### Step 3: Upload to YTNiche Band

1. Open `http://localhost:3000/cookie-setup`
2. Click "Upload cookies.txt"
3. Select your exported file
4. The app saves it to `private/cookies.txt`

## Security Rules

```
┌─────────────────────────────────────┐
│  🛡️  NEVER                          │
├─────────────────────────────────────┤
│  ✗ Share cookies.txt with anyone    │
│  ✗ Paste cookie content into chat   │
│  ✗ Commit cookies.txt to Git        │
│  ✗ Upload cookies to any server     │
│  ✗ Post screenshots with cookie     │
│    content visible                  │
└─────────────────────────────────────┘
```

## .gitignore Protection

The following are already in `.gitignore`:

```gitignore
.env
.env.local
.env.*.local
private/
cookies.txt
*.cookies.txt
*.cookie
```

## Cookie Expiry

YouTube cookies expire every 1–2 weeks. When they expire:

1. The app will show "Cookies expired" or fail to fetch metadata.
2. Re-export cookies from your browser.
3. Re-upload at `/cookie-setup`.

## If Cookies Are Compromised

1. Log out of all sessions in your Google Account.
2. Change your Google password.
3. Delete `private/cookies.txt`.
4. Re-export fresh cookies.

## FAQ

**Q: Can I use the app without cookies?**
Yes. The app works fully in heuristic/keyword mode without cookies. Cookies are only needed for real YouTube metadata (titles, views, subscriber counts).

**Q: Are cookies stored in the browser's localStorage?**
No. Cookies are only saved to `private/cookies.txt` on your local filesystem via the local backend server.

**Q: Does the frontend see cookie content?**
No. The frontend only receives a boolean status (`configured: true/false`). Cookie content never leaves the backend.

**Q: Can I use YouTube API key instead of cookies?**
Yes. Set `YOUTUBE_API_KEY` in your environment for API-based access. This is actually preferred when available.
