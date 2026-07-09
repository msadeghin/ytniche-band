# 🗓️ Phase 0 — Setup & Initial Input

> Use this phase to register today's date and determine the user's starting mode.

---

## Step Zero — Register Today's Date (Mandatory)

Before any action, get today's exact date from the system or web search and record it:

```
📅 Today's Date: [YYYY-MM-DD]
📅 90-Day Boundary: [YYYY-MM-DD]   ← Today's date minus 90 days
```

All "past 90 days" checks in this workflow are calculated based on these two dates.
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

### Routing Logic

After receiving the answer:

| Answer | Action |
|--------|--------|
| **A** | Run **[Phase 1](02_PHASE_1_NICHE_DISCOVERY.md)** completely, then Phases 2 & 3 |
| **B** | Skip Phase 1, go directly to **[Phase 2](03_PHASE_2_FORMAT_ANALYSIS.md)** with that channel |
| **C** | Skip Phase 1, go directly to **[Phase 2](03_PHASE_2_FORMAT_ANALYSIS.md)** with that video/concept |
| **D** | Skip Phase 1, go directly to **[Phase 2](03_PHASE_2_FORMAT_ANALYSIS.md)** with that keyword |
