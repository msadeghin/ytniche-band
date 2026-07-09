# 🎯 YouTube Niche Master Prompt — v6
## Discover & Build Faceless YouTube Niches | NexLev + Web Search + Code Execution

> **Prerequisite:** Paste this prompt into a new Claude session with **NexLev MCP** + **Web Search** + **Code Execution** enabled.
> Claude must execute all phases **without stopping for confirmation**.

> **🆕 v6 Changes (based on analysis of 456 video transcripts from faceless YouTube creators):**
> This version is enhanced by extracting common patterns independently used by multiple recognized creators in the space (Art of YouTube, Freedom Channels, HeadStart Channels, and others). Key additions:
> 1. **"Small Failed Channels" Gate** in Phase 1 — a saturation signal missed in the previous version.
> 2. **Phase 3.5 — Low-Cost Testing Before Full Commitment** — a new operational step that tries each Niche Bend on a small budget before full entry.
> 3. **Axis D — Audience Specificity Bend** — the fourth Bend axis, separate from Category/Format/Language.
> 4. **Complexity Tier label** on every Niche Bend proposal — identifies which layer of the competition/complexity pyramid it sits in, with exit/growth strategy.
> 5. **Format lifespan warning** in risk assessment — lower-tier formats typically last only 2–4 months.
> 6. **Dummy Account / Home-Feed Mining** complementary method for when automated NexLev search yields insufficient results.

---

## 🗓️ Step Zero — Register Today's Date (Mandatory, Before Anything)

**Before any action, get today's exact date from the system or web search and record it:**

```
📅 Today's Date: [YYYY-MM-DD]
📅 90-Day Boundary: [YYYY-MM-DD]   ← Today's date minus 90 days
```

All "past 90 days" checks in this prompt are calculated based on these two dates.
Do not check any channel without this calculation.

---

## 🚀 Start — Get Initial Input

Before anything, ask the user this question:

```
Hi! Before we begin, I need one quick answer to run the best possible analysis:

━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 What type of analysis do you want?
━━━━━━━━━━━━━━━━━━━━━━━━━━

A) 🤖 AUTO — Automatically find the best opportunity (no starting point)
B) 🔗 CHANNEL — You have a channel link you want to analyze
C) 🎬 VIDEO — You have a viral video link or title to analyze
D) 🎯 KEYWORD — You have a specific topic or keyword to bend into new niches

Reply with A / B / C / D, and include any links or descriptions as needed.
```

After receiving the answer:
- **A** → Run Phase 1 completely, then Phases 2 & 3
- **B** → Skip Phase 1, go directly to Phase 2 with that channel
- **C** → Skip Phase 1, go directly to Phase 2 with that video/concept
- **D** → Skip Phase 1, go directly to Phase 2 with that keyword

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 📡 Phase 1 — Niche Discovery
## (AUTO mode only)
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Step 1 — Broad Scan
- `get_niche_finder_categories` → browse all categories
- `search_niche_finder_channels` with `isFaceless: true` and `minMonthlyViews: 500000`
- Run across 6 to 8 promising categories
- **⛔ Completely ignore Gaming and Anime categories — exclude them from search**
- Collect all returned channels

### Step 2 — Age Filter + Faceless Verification (Three Hard Gates)

> ⚠️ **Known important issue:** Channel *registration* date and *first upload* date are not the same. Many channels registered years ago but only recently started posting. A channel registered in 2012 that uploaded its first video 45 days ago is effectively a new channel. Always check both dates separately.

Run `youtube_channel_about` on each channel. Then run `youtube_channel_videos` in ascending order (oldest first) to get the true first upload date.

For each channel extract:
- `channelCreationDate` — account registration date
- `firstVideoPublishedAt` — oldest video publish date (ascending order)

**Gate A — First Video Freshness (Hard Gate, Non-Negotiable):**
The oldest uploaded video must be published **after [90-Day Boundary from Step 0]**.
→ If the oldest video is before this date, **immediately reject** — regardless of channel registration date.
This is the primary gate. It identifies reactivated old accounts.

**Gate B — Channel Registration Date (Secondary Gate):**
Prefer channels that were registered **after [90-Day Boundary from Step 0]** as well.
If a channel is older but passes Gate A:
→ **Keep it** but label it `🔄 Reactivated`.
→ Lower priority than `🆕 New` channels.

**Gate C — Faceless Verification (Hard Gate, Non-Negotiable):**

> 🎭 **What is Faceless?**
> A faceless channel is one where no real human face appears as the main presenter. Content is produced via voiceover + animation / AI images / footage / screen recording. These channels are entirely buildable without anyone appearing on camera.

Before passing any channel, actually verify it is faceless:
- Check the last 3 thumbnails via `youtube_channel_videos`
- **Accept** if thumbnails consistently show: animation, AI images, illustrated characters, text on backgrounds, nature/space/objects footage — no real human face as the main subject
- **Accept** if the video is purely voiceover + footage/b-roll with no one speaking to camera
- **Reject** if thumbnails consistently show a real person facing the camera — this is a vlog or personal brand
- **Reject** if the channel handle, name, or description contains: `vlog`, `daily`, `my life`, `family`, `react`, `reactions`, `podcast`, `IRL`, `personal`
- If ambiguous, check `youtube_channel_about` description — faceless channels describe a topic or concept, not a person
- **⚠️ Important:** Any channel that requires a camera and physical presence should be rejected — even if NexLev marked it as faceless

**Survivor Ranking:**
- 🆕 **New** — registration + first video both after 90-day boundary → highest priority
- 🔄 **Reactivated** — old registration, but first video after 90-day boundary → eligible, lower priority
- ❌ **Rejected** — first video before 90-day boundary, or has a face, or is a vlog/personal brand

**Mandatory output for each surviving channel:**
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

### Step 3 — Consistency Check (No One-Hit Wonders)
- `youtube_channel_videos` → last 10 uploads for each candidate
- **Reject** if the best video has more than 5x the average views (= a single viral spike)
- **Keep** only channels with growing or stable view trends across the last 10 videos

### Step 3.5 — "Small Failed Channels" Gate (Hidden Saturation Signal)

> ⚠️ **This gate is independent of large competitor channels.** A niche can have zero 100K+ subscriber channels and still be saturated — if dozens of small channels have tried the same format and all remain under 1,000 views per video, either the format/market is broken or the algorithm doesn't push it. This is one of the strongest early rejection signals, invisible when only asking "Do we have big competitors?"

- Run `search_niche_finder_channels` with the same format/category filter and `maxSubscribers: 5000`, checking 15–20 small channels
- For each, check the average views of their last 5 videos
- **Warning flag (reject or reduce priority):** If ≥60% of these small channels average under 1,000 views per video despite regular posting → label the niche `🔻 Small Channel Graveyard` and severely reduce its priority
- **Healthy signal:** If most small channels have at least a few videos performing above their channel average (even if modest) → niche is healthy, proceed

### Step 4 — Revenue Validation
- `get_channel_analytics` → calculate monthly views (average views × upload frequency)
- **Reject** if monthly views < 1,000,000
- `check_channel_monetization` → reject if not monetized
- `get_video_rpm` on top 3 videos → estimate monthly revenue (monthly views ÷ 1000 × average RPM)
- **Reject** if estimated revenue < $5,000/month

### Step 5 — Format Saturation Check
- `search_niche_finder_channels` to count channels doing the same format with 100K+ subs
- **Reject** if ≥10 large channels dominate exactly the same format
- **Bonus points** if 3+ channels under 6 months old are also growing with the same format

### Phase 1 Output Table

| Channel | Link | Description | Type | Registration | First Video | Active Days | Monthly Views | Est. Revenue | Format | Big Competitors | New Growing Competitors | Opportunity Score |
|---------|------|-------------|------|-------------|-------------|-------------|---------------|--------------|--------|----------------|------------------------|-------------------|

**→ Select Channel #1 with the highest opportunity and take it to Phase 2.**

### 🕵️ Complementary Method — Dummy Account / Home-Feed Mining (Only If Needed)

> If automated NexLev search in a specific category yields weak or outdated results, suggest this manual method as a supplement (not replacement) — since many successful creators discover fresh channels exactly this way:
> - Suggest the user create a fresh YouTube account (or use Incognito mode) solely for algorithm study
> - Intentionally like/subscribe to a few small, fresh faceless videos in the target category so the Home Feed starts suggesting similar new channels
> - This method uncovers very fresh channels not yet well-indexed in analytics databases
> - Evaluate results using the same triple-gate process from Step 2 (freshness, faceless) and Step 3.5 (failed channels)

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 🔬 Phase 2 — Format Analysis & Niche Bending
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Input to this phase:** Phase 1 channel/video, or direct user input.

> 🔖 **Before anything, insert the source info like this:**
> ```
> ━━━━━━━━━━━━━━━━━━━━━━━━━━
> 📌 Analysis Source
> ━━━━━━━━━━━━━━━━━━━━━━━━━━
> Source Channel Name:   [Channel Name]
> Channel Link:          [Full URL]
> Channel Description:   [Description from youtube_channel_about]
> Core Format:           [One-sentence summary of the channel's format]
> ━━━━━━━━━━━━━━━━━━━━━━━━━━
> ```
> This base information will underpin all subsequent Niche Bends.

### Step 1 — Format Breakdown
Use `youtube_channel_outliers` + `get_bulk_video_transcripts` on the top 5 videos. Extract:

- **Visual Style:** 2D animation / 3D animation / AI avatar / talking-head / documentary / screen-record / other
- **Narrative Structure:** List / Explainer / Story / Comparison / Transformation / Day-in-the-life
- **Hook Mechanism:** Curiosity gap / Shock / Relatability / Humor / Identity trigger
- **Viral Triggers:** What psychological buttons does this format push?
- **Production Complexity:** Low (AI tools) / Medium (simple animation) / High (3D/complex)
- **Content Rhythm:** Shorts only / Long-form only / Both
- **Script Fingerprint:** `get_bulk_video_subtitles` → hook template, open loop style, payoff structure, characteristic transitions, voice cadence

### Step 1.5 — Channel Strategy Type Detection (Before Bending)

> ⚙️ **This step is mandatory and must be executed before any Niche Bend.**

Based on the format breakdown, determine which strategy the source channel uses:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━
🧭 Channel Strategy Type
━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: [FORMAT TREND | MARKET PLAY | HYBRID]

Definitions:
• FORMAT TREND  → The channel's success depends more on its unique format
                  (visual style, narrative structure, or hook mechanism)
                  ▶ Bend strategy: Change the market (category), keep the format

• MARKET PLAY   → The channel's success depends more on market/topic selection
                  (hot niche, high-demand audience, or high RPM)
                  ▶ Bend strategy: Change the format, keep the market

• HYBRID        → Both format and market play key roles
                  ▶ Bend strategy: Examine both axes

Diagnosis: [1-2 sentence explanation of why you chose this type]
━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Bend Rule Based on Strategy Type:**
- If **FORMAT TREND** → in Step 3, focus on changing categories (format stays fixed)
- If **MARKET PLAY** → in Step 3, focus on changing the format within the same or similar category
- If **HYBRID** → in Step 3, examine both axes and find the best combination

### Step 2 — Current Market Analysis
- Which of the 8 content categories (excluding Gaming and Anime) does this channel serve?
- Main audience desire / problem being solved
- Estimated RPM range: Low (<$2) / Medium ($2–$8) / High ($8–$30+)
- Saturation status: Pioneer / One of few / Growing population / Saturated

**Saturation Warning Signals — mark as saturated if:**
- 5+ channels use exactly the same format in exactly the same market
- The source channel has 1M+ subs and has been active for 12+ months
- Comments section says "This is just a copy of X"

### Step 2.5 — Internal Sub-Niche Scan (Before Cross-Category Bending)

> 🔍 **This step is mandatory — before moving to other categories, first explore within the same category.**

For the current channel's category, examine its sub-niches separately:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━
🔎 Internal Sub-Niches — [Current Category Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Sub-Niche Map by Category:**

| Category | Sub-niches to examine separately |
|----------|----------------------------------|
| Finance & Business | Budgeting / Crypto / Real Estate / Side Hustles / Stock Market / Personal Finance / Entrepreneurship |
| Tech & Software | AI Tools / Cybersecurity / SaaS / Mobile Apps / Programming / Gadgets / Future Tech |
| Health & Fitness | Weight Loss / Mental Health / Nutrition / Workout Routines / Sleep / Longevity / Biohacking |
| Education & Science | History / Psychology / Physics / Biology / Space / Philosophy / Linguistics |
| True Crime | Serial Killers / Unsolved Cases / Cults / Scams / Heists / Missing Persons / Conspiracies |
| DIY & How-To | Woodworking / Electronics / Home Repair / Crafts / Cooking / Gardening / 3D Printing |
| Beauty & Fashion | Skincare / Makeup / Men's Fashion / Sustainable Fashion / Hair / Nail Art / Fragrance |
| Lifestyle & Vlogs | Minimalism / Travel / Productivity / Relationships / Personal Growth / Food / Home Decor |

For each relevant sub-niche, quickly check:
```
Sub-niche: [Name]
Source format used here? ✅ Yes | ⚠️ Partial | 🟢 Untouched | 🟩 ZERO
Opportunity Score: [1–10]
```

→ If a sub-niche scores 7+, consider it as one of the Bend proposals.

### Step 3 — Niche Bend Opportunity Map

For **each of the 8 content categories** (excluding Gaming and Anime), check whether this format is being used there:

```
8 Macro Categories (Gaming and Anime excluded):
1. Lifestyle & Vlogs
2. Education & Science
3. DIY & How-To
4. Health & Fitness
5. Beauty & Fashion
6. True Crime
7. Finance & Business
8. Tech & Software
```

**⚠️ Before recording each category's status, search YouTube:**
Search: `[format name] [category] YouTube faceless channel`
- If results found with significant views → ✅ Already used
- If only a few small results found → ⚠️ Marginally used
- If no results found → 🟢 Untouched
- If no mentionable competitors at all (even small ones) → 🟩 ZERO COMPETITION

For each category output:
```
Category: [English Name]
Status: ✅ Already used | ⚠️ Marginally used | 🟢 Untouched | 🟩 ZERO COMPETITION
Known Channels Using This Format Here: [Channel names or "None found"]
Opportunity Score: [1–10]
Specific Niche Idea: [Concrete channel concept — one sentence]
Sample Video Titles:
  🇬🇧 [Video Title Example 1]
  🇬🇧 [Video Title Example 2]
  🇬🇧 [Video Title Example 3]
Estimated RPM: [Range from table below]
Competitive Advantage Needed: [Skill/knowledge that helps]
```

> 🟩 **What is ZERO COMPETITION?**
> When no mentionable competitor exists in this format + category combination — no big channels, no small growing channels, not even failed attempts. This is the highest degree of opportunity but must be paired with demand proof. ZERO without demand = high risk.

**RPM Reference Table:**
| Category | RPM | Best Monetization |
|----------|-----|-------------------|
| Finance & Business | $15–$40 | AdSense + Sponsors + Affiliate |
| Tech & Software | $8–$20 | Affiliate + Sponsors |
| Health & Fitness | $4–$12 | Supplements + Courses + Affiliate |
| Education & Science | $3–$10 | AdSense + Courses |
| True Crime | $3–$8 | AdSense + Merch |
| DIY & How-To | $3–$9 | Affiliate + Courses |
| Beauty & Fashion | $2–$6 | Affiliate + Brand Deals |
| Lifestyle & Vlogs | $2–$5 | Brand Deals + Merch |

### Step 3.5 — Axis C: Geography / Language / Audience Bend

> 🌍 **This is the third Bend axis — in addition to changing category or format, you can also change the target audience.**

For each proposed Bend, also examine these additional angles:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━
🌍 Axis C — Audience/Geography/Language Bend
━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Geography — Same format/niche, regional market:
• UK — British culture, laws, examples
• Australia/Canada — English-speaking markets with high RPM
• Has anyone built this for this region before? [Yes/No]

👥 Generation — Same topic, different age audience:
• Gen Z (born 1997–2012) — Different language, examples, platforms
• Millennials (born 1981–1996) — Different concerns and triggers
• Boomers (born 1946–1964) — Age-adapted content

🕰️ Era — Same format, different historical context:
• Different decades (80s, 90s, 2000s)
• Historical events as framework

🗣️ Language — Same content, different language market:
• Spanish (Latin/Spanish market — huge potential)
• Arabic (Middle East + North Africa)
• Portuguese/Brazilian (Brazil market — growing)
• Has anyone done this niche in this language? [Yes/No]

Best Axis C Bend for this channel: [Specific proposal or "Axis A/B is stronger"]
━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 3.7 — Axis D: Audience Specificity Bend

> 🎯 **This is the fourth Bend axis.** Unlike Axis A/B/C which change category, format, or language, this axis takes a *proven general format* and narrows it to a very specific sub-audience for more targeted, loyal viewership with higher RPM/ad deals. The format stays untouched — only the topical scope narrows.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Axis D — Audience Specificity Bend
━━━━━━━━━━━━━━━━━━━━━━━━━━

Current General Format: [e.g., "3D looping animation on diverse topics"]

Does a specialized version for a specific sub-audience exist?
• High-paying industry (gambling/casino, stock market, crypto) — higher ad/sponsor deals
• Fan of a specific sport/celebrity (not general sports) — higher loyalty, higher CTR
• Specific age or professional group (e.g., new parents only, truck drivers only)

Has anyone already made this format specific to this sub-audience? [Yes/No]
If no → This is an untouched specificity opportunity.

Best Axis D Bend for this channel: [Specific proposal or "Other axes are stronger"]
━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 🏔️ Complexity Tier Reference Table (For labeling each Bend in Step 4)

| Tier | Monthly Budget | Time to Monetization | Strategy |
|------|---------------|---------------------|----------|
| **Bottom of Pyramid** (Simple whiteboard/AI footage/ranking shorts) | $200–$500 | A few weeks | Fast entry, fierce competition, format lifespan typically 2–4 months; goal: reach 3–5K$/month quickly and sell channel at peak or move capital to higher tier |
| **Middle of Pyramid** (Branded 2D animation/consistent character AI influencer) | $1K–$1.5K | 1–3 months | Medium competition, needs consistent character/brand, target 15–30K$/month sustainable |
| **Top of Pyramid** (Fully branded channel with team and guidelines) | $1.5K+ & needs team | Several months | Near-zero competition, most stable income, high-value sellable asset |

### Step 4 — Top 3 Niche Bend Proposals

Ranked by: Opportunity Score + Market Size + RPM Potential + Format Transferability + YouTube Search Results

**⚠️ Final Faceless Filter — Before registering each Bend:**
Each proposed Bend must pass this question:
> "Can this channel be built 100% without showing a face, using only voiceover + animation/AI images/footage?"
→ If the answer is no or ambiguous → Remove this Bend from the list

For each proposal:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━
NICHE BEND #[N] — [Proposed Channel Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 Origin of This Bend:
Source Channel: [Source channel name + link]
Its Core Format: [One-sentence description of what the source channel did]
Strategy Type: [FORMAT TREND | MARKET PLAY | HYBRID]
Bend Axis: [A: Change Category | B: Change Format | C: Change Audience/Geography/Language | D: Audience Specificity]
Now bending to: [New Category] — Because [brief reason]

✅ Faceless Verified: This channel is fully buildable without a face — [Method: voiceover + animation/AI/footage]

🏔️ Complexity Tier: [Bottom | Middle | Top of Pyramid]
   Approx Entry Budget: [$$] | Time to Monetization: [X weeks] | Exit/Growth Strategy: [Sell at peak (20-35K$) on Flippa | Build brand & hold long-term]

ELEVATOR PITCH:
"This channel brings [format] to [market] — like [source channel] but for [new audience]"

🇬🇧 Proposed Channel Name: [Channel Name]

⏰ Why Now?
[2-3 sentences explaining why this specific moment is right for starting this niche:
Growing trend / Competitors haven't arrived yet / Proven demand / Opportunity window is open]

5 First Video Ideas:
1. 🇬🇧 [Video Title]
2. 🇬🇧 [Video Title]
3. 🇬🇧 [Video Title]
4. 🇬🇧 [Video Title]
5. 🇬🇧 [Video Title]

Thumbnail Strategy:
[Repeating visual pattern — colors, text placement, feel, subject framing]

Why It Works:
[Psychological + market argument — 2 to 3 sentences]

Risks to Watch:
[Honest 1-2 sentence assessment of what could kill this]
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## ✅ Phase 3 — Validation Through Search
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For **each** of the top 3 Niche Bends, execute this validation sequence:

### Validation Check A — Format Proof + Direct YouTube Search

**Step One — Web Search:**
Search: `"[format name] YouTube channel" [new category market] viral 2025 2026`
- Has any video in this format + market combination gone viral? (even one = format proof)
- If found: record channel name, view count, upload date

**Step Two — Direct YouTube Search (Mandatory):**
Using `nexlev:youtube_search` or web search with site:youtube.com, run these searches:
- Search: `[topic/format] [new category] site:youtube.com`
- Search: `[exact niche idea] faceless YouTube`
- Search: `[3-4 sample video titles from Step 4] site:youtube.com`

**Rejection Rule Based on YouTube Results:**
- If a channel with 100K+ subs is doing exactly this combination → **Reject this Bend**
- If a few small channels (under 50K) have tried this combination → **Proceed but mark ⚠️**
- If no YouTube results found → **🟩 ZERO COMPETITION — Proceed**

Final Status: ✅ Evidence exists | ⚠️ Weak signal | 🔴 No evidence

### Validation Check B — Concept Proof (Audience Demand)
Search: `[market topic] YouTube views most popular`
+ Search: `[market topic] "how to" OR "explained" YouTube`
- Is there proven audience demand for this topic on YouTube?
- Status: ✅ Demand proven | ⚠️ Niche exists but unproven | 🔴 Unproven

### Validation Check C — Competition Reality Check
Search: `[format + market combination] YouTube faceless channel 2025 2026`
- How many channels are doing exactly this combination?
- Are any of them large (100K+ subs)?
- Status: 🟩 ZERO COMPETITION | 🟢 Pioneer | ⚠️ Early competition | 🔴 Crowded

### Validation Check D — Trend Signal
Search: `[market topic] trending 2026` or `[market topic] viral YouTube 2026`
- Is the underlying topic growing or declining culturally?
- Status: 📈 Upward trend | ➡️ Stable | 📉 Declining

### Validation Output for Each Bend:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━
Validation Results — NICHE BEND #[N]
━━━━━━━━━━━━━━━━━━━━━━━━━━
Format Proof:          [Status] — [Evidence found or "None"]
YouTube Search:        [Status] — [Channels found or "No competitors found"]
Concept Proof:         [Status] — [Evidence found or "None"]
Competition:           [Status] — [Channels found or "🟩 ZERO"]
Trend Signal:          [Status] — [Trend direction + reason]
Final Faceless Check:  ✅ Fully faceless | ❌ Requires presence

Final Verdict:
✅ Strong Green Light — Both format proof and concept proof exist, low competition
⚠️ Proceed With Caution — Test with 3–5 videos first
🔴 High Risk — Requires original format innovation or big competitors exist

Validated Opportunity Rank: [1 / 2 / 3]
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 🧪 Phase 3.5 — Low-Cost Testing Before Full Commitment
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

> This phase is the bridge between "paper analysis" and "full investment." Even a niche that got a green light in Phase 3 should be tested on a small budget before hiring a team and mass-producing content. This was repeatedly identified in analyzed transcripts as the key difference between those who make money and those who waste it.

For Proposal #1 (final ranking winner), output this test plan:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 Low-Cost Test Plan — [Proposed Channel Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Test Budget: $100–$200 (just until you know if it works or not)

5 to 10 First Video Ideas (must be inspired by *recent* outliers from competitors, not random ideas):
[List with note on which competitor outlier inspired each idea]

Video Length: At least 1.5x the equivalent competitor video length (for more watch time)
Title/Thumbnail: Similar to competitor style — not exact copy

Publishing Pattern: Post → Skip → Post → Skip (not daily, to save test budget)
Judgment Window: 3 to 10 days after each video (sometimes takes up to 2 months; never judge earlier)

Success Criteria: At least one of the first 5 videos gets views significantly above the average of fresh channels in this niche (based on Phase 1 data)

⚠️ Important Rule: Never delete low-performing videos during the test — sometimes the algorithm pushes them with a delay.

If the test fails: Go back to Phase 1 and try the next niche from the ranked list — identify the failure reason (format? packaging? video length? or just an unlucky channel?)
━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 🧬 Phase 4 — Script DNA Extraction
## (Optional — Activated by User Confirmation)
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After Phase 3, ask: **"Would you like me to extract the script DNA from the source channel too?"**

If yes, run on the source channel's top 5 videos:
`get_bulk_video_subtitles` + `get_bulk_video_transcripts` + `youtube_video_details`

Output:

```
===================================
Script Template — [Channel Name]
Target Length: [X] minutes | Target payoff count: [N]
===================================

Hook [0:00–0:30]
Type: [Dominant hook type]
Template: «[Exact opening formula with {TOPIC}, {STAT}, {CLAIM} slots]»

OPEN LOOP #1
Template: «[Characteristic phrase with {TEASE} slot]»

PAYOFF 1 [0:30–X:XX]
Structure: [As observed — e.g., claim → example → data → actionable conclusion]
Template:
«[Section opener with channel's voice with {POINT_1}]
[Body pattern: {EVIDENCE}, {EXAMPLE}, {INSIGHT}]
[Payoff ending: {ACTIONABLE_LINE}]»

Transition Phrase: «[Exact recurring connector]»

[Continue for all N payoffs...]

Mid-Video CTA: «[Exact template if channel uses one]»

Final Ending: «[Peak delivery + final CTA]»

===================================
Voice Rules (Non-Negotiable)
===================================
- Sentence cadence: [Observed pattern]
- Readability level: [Basic]
- Perspective: [1st / 2nd / 3rd person]
- Never use: [Phrases absent from their scripts]
- Always use: [3–5 identified characteristic features]
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 📊 Final Output Structure
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After completing all phases, present the final output in this order:

```
## 🔍 Phase 1 Results — Top Discovery
[Summary table + selected Channel #1 with link and description]

## 🔬 Format Breakdown
[Visual style, narrative structure, hook mechanism, script fingerprint]
[Channel strategy type: FORMAT TREND | MARKET PLAY | HYBRID]

## 🎯 Current Market Analysis
[Market, audience, RPM, saturation status]
[Internal sub-niche scan results]

## 🗺️ Niche Bend Opportunity Map
[All 8 categories with status indicators — no Gaming/Anime]
[Including 🟩 ZERO COMPETITION for untouched categories]

## 🏆 Top 3 Niche Bend Proposals
[Full description for each Bend including: origin, Bend axis, faceless verification, why now, titles]

## ✅ Search Validation Results
[Validation for all 3 Bends — including direct YouTube search results]

## 🥇 Final Ranking (Post-Validation)
[Top 3 re-ranked based on validation data, each with Complexity Tier label]

## 🧪 Low-Cost Test Plan (Phase 3.5)
[Full test plan for Proposal #1 — budget, video ideas, publishing pattern, success criteria]

## 🚀 Quick Action Plan — Proposal #1
[First steps:]
- 🇬🇧 Proposed Channel Name: [Channel Name]
- First 3 videos to post:
  1. 🇬🇧 [Title]
  2. 🇬🇧 [Title]
  3. 🇬🇧 [Title]
- Thumbnail formula
- Production requirements (tools/style needed — all faceless)
- Estimated time to first monetization (based on similar Bends)
- One sentence about the competitive window: How long before others copy?

📝 First Video Description Template:
━━━━━━━━━━━━━━━━━━━━━━━━━
[Line 1: Hook sentence + main keyword — 150 characters]

[Paragraph 1: Video explanation — 2-3 sentences]
[Paragraph 2: What you'll learn — 2-3 sentences]

🔗 Useful Links:
[Affiliate/relevant resources]

📌 Subscribe for more: [Specific CTA]

#[hashtag1] #[hashtag2] #[hashtag3] #[hashtag4] #[hashtag5]
━━━━━━━━━━━━━━━━━━━━━━━━━

## ⚠️ Honest Risk Assessment
[What could kill each opportunity — format fatigue, saturation timeline, platform risk]
[⏳ Estimated format lifespan by tier: Bottom tier typically lasts 2–4 months before full saturation; middle and top tiers are more stable but grow slower — factor this into "how fast to move" decisions]
```

---

## 📌 Important Rules for Claude

1. **Execute all phases back-to-back without asking for confirmation** — this is an agentic workflow
2. **Never recommend copying a channel** — always be first in a new market
3. **Prefer 🟢 Untouched over ⚠️ Marginally Used** — a fresh green with medium proof beats a crowded proven market; and 🟩 ZERO with proven demand = the best possible state
4. **All proposals must be 100% faceless and doable without showing a face** — only voiceover + animation/AI images/footage — no exceptions
5. **Be specific** — generic advice is useless; give real video titles, thumbnail concepts, and tool recommendations
6. **Validate before recommending** — Phase 3 search validation is mandatory, not optional
7. **Re-rank after validation** — Phase 2 and Phase 3 rankings may differ; use Phase 3 as the final verdict
8. **One competitive advantage per proposal** — identify which of these the builder can leverage:
   - Professional expertise (dentist → dental channel)
   - Format-first discovery (first to use this format in this market)
   - Cross-industry insight (fitness person discovering a finance format)
   - Production capability (access to 3D, AI tools, unique visual style)
9. **⛔ Gaming and Anime:** Never use these two categories in any stage — discovery, analysis, or bending
10. **Always send the full channel link** — no channel is acceptable without a full URL
11. **Always mention channel descriptions** — extract from `youtube_channel_about` for every channel
12. **Mandatory bilingual visual format** — every English video title, channel name, or text must use this format:
    ```
    🇬🇧 [English text]
    🔤 Translation: [Persian meaning]
    ```
13. **Register today's date in Step 0** — all 90-day calculations must use the real date, not an estimate
14. **YouTube search for each Bend is mandatory** — before presenting any Bend, search YouTube directly. If a big competitor is found, reject that Bend
15. **Sub-niche first, then other categories** — before bending to a new category, explore sub-niches within the same category first
16. **Detect the channel's strategy type** — before any Bend, determine FORMAT TREND / MARKET PLAY / HYBRID and set the Bend strategy accordingly
17. **Small failed channels gate is mandatory** — lack of big competitors is not enough; if most small channels in the same format have failed, abandon the niche even if no 100K+ channel exists
18. **Every Niche Bend must have a Complexity Tier label** — Bottom/Middle/Top of Pyramid, with estimated budget and time horizon, so the user can decide based on their own resources
19. **Phase 3.5 (low-cost testing) is mandatory for the final proposal, not optional** — no recommendation should be given without a concrete test plan with budget and success criteria

---

## 💡 Powerful Combination Methods (Learned from Top Channels)

### Niche Transfer
Take proven content to a different market:
- Medieval life → Early humans → Pirates → Homeless
- "Why X is collapsing and why you're next" → Civilizations / Marriages / Dictators / Streamers

### Hype Injection
Proven format + celebrity-centric topics = foolproof formula:
- "The Death of Every [X] Explained" → Celebrity version

### Script Bend
Keep the proven skeleton, swap the topic with something from your niche:
- Keep the hook, open loop, and payoff structure
- Only change the subject to something from the new market

### Twist Injection
Any proven content + unexpected angle + different audience = high CTR

### Geography Bend
Same successful niche + untouched language/regional market = ZERO COMPETITION opportunity:
- Successful English Finance channel → Spanish version for Latin market
- Successful American True Crime channel → European/British crime-focused version

### Specificity Bend (Audience Narrowing)
Proven general format + narrowing to a specific sub-audience = more loyal audience + higher RPM/ad deals:
- General 3D looping channel → dedicated gambling/casino version (higher sponsor deals)
- General car channel → dedicated F1 version (loyal passionate fans)

---

*This master prompt combines NexLev Niche Finder, Niche Bending (4 axes: Category/Format/Language-Geography/Specificity), Low-Cost Pre-Commitment Testing, Script DNA Extraction, and Web Search Validation into a single automated end-to-end workflow. Compatible with Claude + NexLev MCP. — v6*
