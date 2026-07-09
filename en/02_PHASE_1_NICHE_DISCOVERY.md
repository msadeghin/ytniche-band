# 📡 Phase 1 — Niche Discovery

> **Mode:** AUTO only (skip if user provided a channel/video/keyword)
> **Prerequisite:** [Phase 0](01_PHASE_0_SETUP.md) — Today's date must be registered.

---

## Step 1 — Broad Scan

- `get_niche_finder_categories` → browse all categories
- `search_niche_finder_channels` with `isFaceless: true` and `minMonthlyViews: 500000`
- Run across **6 to 8 promising categories**
- **⛔ Completely ignore Gaming and Anime categories — exclude them from search**
- Collect all returned channels

---

## Step 2 — Age Filter + Faceless Verification (Three Hard Gates)

> ⚠️ **Known issue:** Channel *registration* date and *first upload* date are not the same. A channel registered in 2012 that uploaded its first video 45 days ago is effectively a new channel. Always check both separately.

Run `youtube_channel_about` on each channel. Then run `youtube_channel_videos` in **ascending order** (oldest first) to get the true first upload date.

For each channel extract:
- `channelCreationDate` — account registration date
- `firstVideoPublishedAt` — oldest video publish date (ascending order)

### Gate A — First Video Freshness (Hard Gate, Non-Negotiable)

The oldest uploaded video must be published **after [90-Day Boundary from Phase 0]**.

→ If the oldest video is before this date, **immediately reject** — regardless of channel registration date.
This is the primary gate. It identifies reactivated old accounts.

### Gate B — Channel Registration Date (Secondary Gate)

Prefer channels registered **after [90-Day Boundary from Phase 0]** as well.

If a channel is older but passes Gate A:
→ **Keep it** but label it `🔄 Reactivated`.
→ Lower priority than `🆕 New` channels.

### Gate C — Faceless Verification (Hard Gate, Non-Negotiable)

> 🎭 **What is Faceless?**
> A faceless channel shows no real human face as the main presenter. Content is produced via voiceover + animation / AI images / footage / screen recording.

Before passing any channel, verify it is faceless:
- Check the last 3 thumbnails via `youtube_channel_videos`
- **Accept** if thumbnails consistently show: animation, AI images, illustrated characters, text on backgrounds, nature/space/objects footage — no real human face as the main subject
- **Accept** if video is purely voiceover + footage/b-roll with no one speaking to camera
- **Reject** if thumbnails consistently show a real person facing the camera
- **Reject** if handle/name/description contains: `vlog`, `daily`, `my life`, `family`, `react`, `reactions`, `podcast`, `IRL`, `personal`
- If ambiguous, check `youtube_channel_about` description
- **⚠️ Any channel requiring a camera and physical presence should be rejected**

### Survivor Ranking

| Label | Criteria | Priority |
|-------|----------|----------|
| 🆕 **New** | Registration + first video both after 90-day boundary | Highest |
| 🔄 **Reactivated** | Old registration, first video after 90-day boundary | Eligible, lower |
| ❌ **Rejected** | First video before boundary, or has face, or personal brand | Excluded |

### Mandatory Output for Each Survivor

```
Channel Name:          [Name + full URL]
Channel Description:   [Brief topic description — from youtube_channel_about]
Registration Date:     [YYYY-MM-DD]
First Video Date:      [YYYY-MM-DD]   ← from oldest upload (ascending order)
Active Days:           [N days]
Channel Type:          🆕 New | 🔄 Reactivated
Faceless Verified:     ✅ Yes | ❌ No — [Reason]
Buildable Without Face: ✅ Yes | ❌ No — [Reason]
```

---

## Step 3 — Consistency Check (No One-Hit Wonders)

- `youtube_channel_videos` → last 10 uploads for each candidate
- **Reject** if the best video has more than **5x the average** views (= a single viral spike)
- **Keep** only channels with growing or stable view trends across the last 10 videos

---

## Step 3.5 — "Small Failed Channels" Gate (Hidden Saturation Signal)

> ⚠️ A niche can have zero 100K+ channels and still be saturated — if dozens of small channels tried the same format and all remain under 1,000 views.

- `search_niche_finder_channels` with same format/category and `maxSubscribers: 5000` — check 15–20 small channels
- For each, check average views of their last 5 videos
- **Warning flag:** If **≥60%** of small channels average under 1,000 views per video despite regular posting → label niche `🔻 Small Channel Graveyard` and severely reduce priority
- **Healthy signal:** If most small channels have at least some videos above their average → niche is healthy

---

## Step 4 — Revenue Validation

- `get_channel_analytics` → calculate monthly views (avg views × upload frequency)
- **Reject** if monthly views < **1,000,000**
- `check_channel_monetization` → reject if not monetized
- `get_video_rpm` on top 3 videos → estimate monthly revenue (monthly views ÷ 1000 × avg RPM)
- **Reject** if estimated revenue < **$5,000/month**

---

## Step 5 — Format Saturation Check

- `search_niche_finder_channels` to count channels doing the same format with **100K+ subs**
- **Reject** if **≥10** large channels dominate exactly the same format
- **Bonus points** if 3+ channels under 6 months old are growing with the same format

---

## Output Table

| Channel | Link | Description | Type | Registration | First Video | Active Days | Monthly Views | Est. Revenue | Format | Big Competitors | New Growing Competitors | Opportunity Score |
|---------|------|-------------|------|-------------|-------------|-------------|---------------|--------------|--------|----------------|------------------------|-------------------|

**→ Select Channel #1 with the highest opportunity and proceed to [Phase 2](03_PHASE_2_FORMAT_ANALYSIS.md).**

---

## 🕵️ Complementary Method — Dummy Account / Home-Feed Mining

> If automated NexLev search yields weak results, suggest this manual method:

- Create a fresh YouTube account (or Incognito) for algorithm study
- **Intentionally** like/subscribe to small, fresh faceless videos in the target category
- The Home Feed will start suggesting similar new channels
- Uncovers very fresh channels not yet indexed in analytics databases
- Evaluate using the same triple-gate process from Step 2 and Step 3.5
