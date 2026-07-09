# 🔬 Phase 2 — Format Analysis & Niche Bending

> **Input:** Phase 1 channel/video, or direct user input (channel link / video / keyword)
> **Prerequisite:** Today's date registered from Phase 0

---

## Source Information Header

Before anything, insert the source info like this:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 Analysis Source
━━━━━━━━━━━━━━━━━━━━━━━━━━
Source Channel Name:   [Channel Name]
Channel Link:          [Full URL]
Channel Description:   [Description from youtube_channel_about]
Core Format:           [One-sentence summary of the channel's format]
━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Step 1 — Format Breakdown

Use `youtube_channel_outliers` + `get_bulk_video_transcripts` on the top 5 videos.

### Extract These Elements

| Element | Options |
|---------|---------|
| **Visual Style** | 2D animation / 3D animation / AI avatar / talking-head / documentary / screen-record / other |
| **Narrative Structure** | List / Explainer / Story / Comparison / Transformation / Day-in-the-life |
| **Hook Mechanism** | Curiosity gap / Shock / Relatability / Humor / Identity trigger |
| **Viral Triggers** | What psychological buttons does this format push? |
| **Production Complexity** | Low (AI tools) / Medium (simple animation) / High (3D/complex) |
| **Content Rhythm** | Shorts only / Long-form only / Both |
| **Script Fingerprint** | `get_bulk_video_subtitles` → hook template, open loop style, payoff structure, characteristic transitions, voice cadence |

---

## Step 1.5 — Channel Strategy Type Detection (Mandatory)

Determine which strategy the source channel uses:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━
🧭 Channel Strategy Type
━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: [FORMAT TREND | MARKET PLAY | HYBRID]

Definitions:
• FORMAT TREND  → Success depends more on unique format
                  (visual style, narrative, hook mechanism)
                  ▶ Bend strategy: Change market (category), keep format

• MARKET PLAY   → Success depends more on market/topic selection
                  (hot niche, high-demand audience, high RPM)
                  ▶ Bend strategy: Change format, keep market

• HYBRID        → Both format and market play key roles
                  ▶ Bend strategy: Examine both axes

Diagnosis: [1-2 sentence explanation]
━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Bend Rule by Strategy Type

| Strategy Type | Focus in Step 3 |
|--------------|----------------|
| **FORMAT TREND** | Change categories (format stays fixed) |
| **MARKET PLAY** | Change format within same or similar category |
| **HYBRID** | Examine both axes |

---

## Step 2 — Current Market Analysis

- Which of the 8 content categories (excluding Gaming and Anime) does this channel serve?
- Main audience desire / problem being solved
- Estimated RPM range: Low (<$2) / Medium ($2–$8) / High ($8–$30+)
- Saturation status: Pioneer / One of few / Growing population / Saturated

### Saturation Warning Signals

| Signal | Mark as saturated if... |
|--------|----------------------|
| 🔴 | 5+ channels use exactly the same format in exactly the same market |
| 🔴 | Source channel has 1M+ subs and 12+ months active |
| 🔴 | Comments say "This is just a copy of X" |

---

## Step 2.5 — Internal Sub-Niche Scan (Mandatory)

> Before moving to other categories, explore sub-niches *within* the same category first.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━
🔎 Internal Sub-Niches — [Current Category Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Sub-Niche Map by Category

| Category | Sub-niches to examine |
|----------|----------------------|
| **Finance & Business** | Budgeting / Crypto / Real Estate / Side Hustles / Stock Market / Personal Finance / Entrepreneurship |
| **Tech & Software** | AI Tools / Cybersecurity / SaaS / Mobile Apps / Programming / Gadgets / Future Tech |
| **Health & Fitness** | Weight Loss / Mental Health / Nutrition / Workout Routines / Sleep / Longevity / Biohacking |
| **Education & Science** | History / Psychology / Physics / Biology / Space / Philosophy / Linguistics |
| **True Crime** | Serial Killers / Unsolved Cases / Cults / Scams / Heists / Missing Persons / Conspiracies |
| **DIY & How-To** | Woodworking / Electronics / Home Repair / Crafts / Cooking / Gardening / 3D Printing |
| **Beauty & Fashion** | Skincare / Makeup / Men's Fashion / Sustainable Fashion / Hair / Nail Art / Fragrance |
| **Lifestyle & Vlogs** | Minimalism / Travel / Productivity / Relationships / Personal Growth / Food / Home Decor |

### Output Format for Each Relevant Sub-Niche

```
Sub-niche: [Name]
Source format used here? ✅ Yes | ⚠️ Partial | 🟢 Untouched | 🟩 ZERO
Opportunity Score: [1–10]
```

→ If a sub-niche scores **7+**, consider it as one of the Bend proposals.

---

## Step 3 — Niche Bend Opportunity Map

For **each of the 8 content categories** (no Gaming/Anime), check if the format is being used there.

### The 8 Categories

1. Lifestyle & Vlogs
2. Education & Science
3. DIY & How-To
4. Health & Fitness
5. Beauty & Fashion
6. True Crime
7. Finance & Business
8. Tech & Software

### Search Method

Search: `[format name] [category] YouTube faceless channel`

| Result | Status |
|--------|--------|
| Results found with significant views | ✅ Already used |
| Only a few small results | ⚠️ Marginally used |
| No results found | 🟢 Untouched |
| No mentionable competitors at all | 🟩 ZERO COMPETITION |

### Output for Each Category

```
Category: [English Name]
Status: ✅ Already used | ⚠️ Marginally used | 🟢 Untouched | 🟩 ZERO COMPETITION
Known Channels Using This Format Here: [Names or "None found"]
Opportunity Score: [1–10]
Specific Niche Idea: [Concrete channel concept — one sentence]
Sample Video Titles:
  🇬🇧 [Video Title 1]
  🇬🇧 [Video Title 2]
  🇬🇧 [Video Title 3]
Estimated RPM: [Range from table]
Competitive Advantage Needed: [Skill/knowledge that helps]
```

> 🟩 **ZERO COMPETITION** = No mentionable competitor exists. Highest opportunity degree, but must be paired with demand proof.

### RPM Reference Table

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

---

## Step 3.5 — Axis C: Geography / Language / Audience Bend

```
━━━━━━━━━━━━━━━━━━━━━━━━━━
🌍 Axis C — Audience/Geography/Language Bend
━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Geography — Same format/niche, regional market:
• UK — British culture, laws, examples
• Australia/Canada — English-speaking markets with high RPM
• Has anyone built this for this region before? [Yes/No]

👥 Generation — Same topic, different age audience:
• Gen Z (born 1997–2012)
• Millennials (born 1981–1996)
• Boomers (born 1946–1964)

🕰️ Era — Same format, different historical context:
• Different decades (80s, 90s, 2000s)
• Historical events as framework

🗣️ Language — Same content, different language market:
• Spanish (Latin/Spanish market — huge potential)
• Arabic (Middle East + North Africa)
• Portuguese/Brazilian (Brazil — growing)
• Has anyone done this niche in this language? [Yes/No]

Best Axis C Bend for this channel: [Proposal or "Axis A/B is stronger"]
━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Step 3.7 — Axis D: Audience Specificity Bend

```
━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Axis D — Audience Specificity Bend
━━━━━━━━━━━━━━━━━━━━━━━━━━

Current General Format: [e.g., "3D looping animation on diverse topics"]

Does a specialized version for a specific sub-audience exist?
• High-paying industry (gambling/casino, stock market, crypto)
• Fan of a specific sport/celebrity (not general sports)
• Specific age/professional group (e.g., new parents only)

Has anyone already made this format specific to this sub-audience? [Yes/No]
If no → This is an untouched specificity opportunity.

Best Axis D Bend for this channel: [Proposal or "Other axes are stronger"]
━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🏔️ Complexity Tier Reference Table

| Tier | Monthly Budget | Time to Monetization | Strategy |
|------|---------------|---------------------|----------|
| **Bottom of Pyramid** (Simple whiteboard/AI footage/ranking shorts) | $200–$500 | Few weeks | Fast entry, fierce competition, format lifespan 2–4 months; target 3–5K$/month, sell at peak |
| **Middle of Pyramid** (Branded 2D animation/consistent AI influencer) | $1K–$1.5K | 1–3 months | Medium competition, needs consistent brand, target 15–30K$/month sustainable |
| **Top of Pyramid** (Fully branded channel with team) | $1.5K+ & team | Several months | Near-zero competition, most stable, high-value sellable asset |

---

## Step 4 — Top 3 Niche Bend Proposals

> **Ranked by:** Opportunity Score + Market Size + RPM Potential + Format Transferability + YouTube Search Results

### Final Faceless Filter

Each proposed Bend must pass:
> "Can this channel be built 100% without showing a face, using only voiceover + animation/AI images/footage?"
→ If no or ambiguous → Remove this Bend.

### Proposal Template

```
━━━━━━━━━━━━━━━━━━━━━━━━━━
NICHE BEND #[N] — [Proposed Channel Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 Origin of This Bend:
Source Channel: [Name + link]
Its Core Format: [One-sentence description]
Strategy Type: [FORMAT TREND | MARKET PLAY | HYBRID]
Bend Axis: [A | B | C | D]
Now bending to: [New Category] — Because [reason]

✅ Faceless Verified: Fully buildable without a face — [voiceover + animation/AI/footage]

🏔️ Complexity Tier: [Bottom | Middle | Top]
   Budget: [$$] | Time to Monetization: [X weeks] | Exit Strategy: [Sell on Flippa | Build brand]

ELEVATOR PITCH:
"This channel brings [format] to [market] — like [source] but for [new audience]"

🇬🇧 Proposed Channel Name: [Name]

⏰ Why Now?
[2-3 sentences on timing]

5 First Video Ideas:
1. 🇬🇧 [Title]
2. 🇬🇧 [Title]
3. 🇬🇧 [Title]
4. 🇬🇧 [Title]
5. 🇬🇧 [Title]

Thumbnail Strategy:
[Colors, text placement, feel, framing]

Why It Works:
[Psychological + market argument — 2-3 sentences]

Risks to Watch:
[Honest 1-2 sentence assessment]
```

---

## ➡️ Next Phase

Proceed to **[Phase 3 — Search Validation](04_PHASE_3_VALIDATION.md)** for each of the top 3 Bends.
