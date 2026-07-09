# 🧬 Transcript-Based Faceless YouTube Research Engine

> A modular, rule-based research engine that encodes patterns from successful faceless YouTube channels into reusable analysis functions.

## Overview

The Transcript Research Engine is the analytical core of YTNiche Band. It replaces the need for Claude AI + NexLev MCP by encoding the knowledge extracted from **456+ video transcripts** of successful faceless YouTube creators into pure TypeScript logic modules.

Each module represents a dimension of niche analysis that the original v6 prompt handled through LLM reasoning. Now it runs deterministically, producing consistent, auditable results without AI costs.

## Architecture

```
src/lib/analysis/
├── pyramid.ts          ── Content complexity tier classification
├── barriers.ts         ── Barrier-to-entry scoring (money, skill, insider, speed)
├── saturation.ts       ── Market lifecycle stage detection
├── nicheBending.ts     ── Four-axis niche bending proposal generator
├── scriptDNA.ts        ── Video script pattern extraction & bending
├── blueOcean.ts        ── Blue ocean gap detection
└── opportunityScore.ts ── Weighted composite opportunity score

src/data/knowledge/
├── researchRules.ts    ── All transcript-derived research rules
└── transcriptIndex.json─ (generated) Ingested transcript index
```

## Module Reference

### 1. Pyramid Classifier (`pyramid.ts`)

Classifies a content idea into one of three pyramid tiers:

| Tier | Budget | Monetization Horizon | Format Lifespan | Competition |
|------|--------|---------------------|-----------------|-------------|
| **Bottom** | $200-$500/mo | Few weeks | 2-4 months | High |
| **Middle** | $1K-$1.5K/mo | 1-3 months | 6-12 months | Moderate |
| **Top** | $1.5K+/mo + team | Several months | Years | Low |

**Key function:**
- `classifyPyramidLevel(input)` — Determines tier from production complexity, copyability, budget, skill, trend speed, and insider knowledge.

### 2. Barrier Scoring (`barriers.ts`)

Scores four key barriers that determine how hard a niche is to enter and how strong the moat is:

- **Money Barrier** — Production cost + monthly budget requirement
- **Skill Barrier** — Production skill + topic expertise needed
- **Insider Barrier** — How much insider/niche knowledge is required
- **Speed Barrier** — How fast you need to move (late-wave avoidance)

**Key functions:**
- `scoreBarriers(input)` — Returns scores for each barrier, total score, moat label, and recommendations.
- `suggestMoatStrengthening(input)` — Suggests how to improve the moat.

### 3. Saturation Detection (`saturation.ts`)

Detects which lifecycle stage a format-market combination is in:

| Stage | Characteristics | Action |
|-------|----------------|--------|
| **Too Early** | Few channels, no proof of demand | Test fast |
| **Breakout** | 2-5 channels growing, demand validated | Enter now |
| **Late Wave** | 10+ channels, format spreading | Bend first |
| **Saturated** | Small channels failing, graveyard present | Avoid |
| **Declining** | Losing audience interest | Do not enter |

**Key functions:**
- `detectMarketStage(input)` — Determines stage, saturation score, and action.
- `stageLabel(stage)` — Human-readable label.
- `isEnterable(stage)` — Quick check if the niche is worth entering.

### 4. Niche Bending (`nicheBending.ts`)

Generates niche bend proposals using four axes:

| Axis | Name | Description |
|------|------|-------------|
| A | Category Change | Take proven format to a new field |
| B | Format Change | Use different format for proven market |
| C | Language/Geography | Enter new language market |
| D | Audience Specificity | Narrow to specific sub-audience |

**Key function:**
- `generateNicheBends(input)` — Takes user interests, skills, budget and returns up to 4 bend proposals with video ideas.

### 5. Script DNA (`scriptDNA.ts`)

Extracts reusable script patterns from video metadata and bends them to new niches.

**Key functions:**
- `extractScriptDNA(input)` — Analyzes title, transcript, description to extract hook pattern, structure, retention devices, CTA pattern, and a reusable skeleton.
- `bendScriptSkeleton(input)` — Applies a source DNA skeleton to a new niche/topic.

### 6. Blue Ocean Gap (`blueOcean.ts`)

Detects format-market combinations with high demand and low supply.

**Labels:**
- **Blue Ocean** (75-100) — Ideal entry point
- **Emerging Gap** (55-74) — Some competition, room for entrants
- **Competitive** (35-54) — Differentiation needed
- **Red Ocean** (0-34) — Avoid

**Key function:**
- `scoreBlueOceanGap(input)` — Returns score (0-100), label, and detailed explanation.

### 7. Opportunity Score (`opportunityScore.ts`)

Combines all dimensions into a single weighted score.

**Formula:**
```
opportunityScore =
  0.20 * demandScore +
  0.15 * blueOceanScore +
  0.15 * barrierScore +
  0.15 * formatProofScore +
  0.10 * freshnessScore +
  0.10 * assetPotentialScore +
  0.10 * userFitScore -
  0.15 * saturationRisk -
  0.10 * policyRisk
```

**Recommendations:**
| Score | Recommendation |
|-------|---------------|
| 75-100 | **Build** — Full production |
| 55-74 | **Test** — 3-5 videos first |
| 35-54 | **Bend First** — Differentiate more |
| 0-34 | **Avoid** — Find another angle |

## Research Rules (`researchRules.ts`)

Contains **14 transcript-derived research rules** organized by category:

| Category | Rules |
|----------|-------|
| Pyramid | Bottom AI slideshow, Middle production, Top speed/insider |
| Barrier | Late-wave detection, Breakout-stage validation |
| Saturation | Small channel graveyard, Format fatigue |
| Niche Bending | Never copy always transpose, Four-axis framework |
| Script Bending | Script skeleton first, Keep skeleton swap topic |
| Blue Ocean | Gap detection, Adjacent market proof |
| Format | Proven format beats novelty |
| Policy Risk | Inauthentic content, Content originality |

## Transcript Ingestion

The `tools/ingest-transcripts.ts` tool reads `.txt` and `.vtt` files from `data/transcripts/` and:

1. Removes timestamps and duplicate subtitle lines
2. Tags concepts (ai-content, faceless, niche-bending, etc.)
3. Matches transcript content to research rules
4. Generates a structured index at `src/data/knowledge/transcriptIndex.json`

**Usage:**
```bash
bun run ingest:transcripts
```

## Integration with Convex Backend

The analysis modules can be imported into any Convex action or query:

```typescript
import { classifyPyramidLevel } from "../lib/analysis/pyramid";
import { scoreBarriers } from "../lib/analysis/barriers";
import { detectMarketStage } from "../lib/analysis/saturation";
import { calculateWeightedOpportunityScore } from "../lib/analysis/opportunityScore";
```

The existing `src/convex/analysis.ts` wraps these modules for use in the CLI and web app.

## Extending the Engine

To add new research rules:
1. Add the rule object to `transcriptResearchRules` in `researchRules.ts`
2. Add corresponding concept keywords to `tools/ingest-transcripts.ts`
3. If the rule creates a new analysis dimension, add a new module in `src/lib/analysis/`

To add analysis modules:
1. Create a file in `src/lib/analysis/` with a clean input/output interface
2. Add exports that are easy to compose in `opportunityScore.ts`
3. Integrate into `src/convex/analysis.ts` for CLI and web app use
