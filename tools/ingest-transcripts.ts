#!/usr/bin/env bun
/**
 * 📄 Transcript Ingestion Tool
 *
 * Reads .txt and .vtt files from data/transcripts/, cleans them,
 * tags concepts, and writes a structured index to src/data/knowledge/transcriptIndex.json
 *
 * Usage: bun run ingest:transcripts
 */

import * as fs from "fs";
import * as path from "path";
import { transcriptResearchRules, type ResearchRule } from "../src/data/knowledge/researchRules.js";

// ─── Types ─────────────────────────────────────────────────────

interface TranscriptEntry {
  fileName: string;
  sourceName: string;
  rawLength: number;
  cleanedLength: number;
  taggedConcepts: string[];
  matchedRuleIds: string[];
  summary: string;
}

interface TranscriptIndex {
  ingestedAt: string;
  totalFiles: number;
  entries: TranscriptEntry[];
  conceptFrequency: Record<string, number>;
  ruleMatchFrequency: Record<string, number>;
}

// ─── Concept Keywords ──────────────────────────────────────────

const CONCEPT_KEYWORDS: Record<string, string[]> = {
  "ai-content": ["ai generated", "ai images", "ai video", "artificial intelligence", "midjourney", "dall-e"],
  "faceless": ["faceless", "no face", "without showing face", "voice only", "no camera"],
  "niche-bending": ["niche bend", "format transfer", "new category", "different audience", "bend"],
  "script-structure": ["hook", "open loop", "payoff", "transition", "cta", "call to action"],
  "monetization": ["rpm", "adsense", "sponsor", "affiliate", "monetized", "revenue", "income"],
  "saturation": ["saturated", "too many", "crowded", "competition", "everyone doing"],
  "production": ["animation", "voiceover", "stock footage", "editing", "render", "after effects"],
  "growth": ["algorithm", "views", "subscribers", "viral", "breakout", "ctr", "retention"],
  "policy": ["demonetization", "reused content", "policy", "copyright", "community guidelines"],
  "testing": ["test", "experiment", "low cost", "budget", "validate", "mvp"],
  "pyramid": ["bottom tier", "middle tier", "top tier", "complexity tier", "entry budget"],
  "blue-ocean": ["blue ocean", "no competition", "gap", "untapped", "unserved", "white space"],
};

// ─── Main ─────────────────────────────────────────────────────

async function main() {
  console.log("📄 Transcript Ingestion Tool");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const transcriptsDir = path.resolve(process.cwd(), "data/transcripts");
  const outputDir = path.resolve(process.cwd(), "src/data/knowledge");
  const outputPath = path.join(outputDir, "transcriptIndex.json");

  // Ensure directories exist
  if (!fs.existsSync(transcriptsDir)) {
    fs.mkdirSync(transcriptsDir, { recursive: true });
    console.log(`📁 Created: ${transcriptsDir}`);
    console.log("   (empty — add .txt or .vtt files to ingest)\n");
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Find transcript files
  const files = fs.readdirSync(transcriptsDir).filter(
    (f) => f.endsWith(".txt") || f.endsWith(".vtt")
  );

  if (files.length === 0) {
    console.log("⚠️  No .txt or .vtt files found in data/transcripts/");
    console.log("   Writing empty index. Add transcript files and re-run.\n");

    const emptyIndex: TranscriptIndex = {
      ingestedAt: new Date().toISOString(),
      totalFiles: 0,
      entries: [],
      conceptFrequency: {},
      ruleMatchFrequency: {},
    };

    fs.writeFileSync(outputPath, JSON.stringify(emptyIndex, null, 2));
    console.log(`✅ Empty index written to: ${outputPath}`);
    return;
  }

  console.log(`Found ${files.length} transcript files\n`);

  const entries: TranscriptEntry[] = [];
  const conceptFrequency: Record<string, number> = {};
  const ruleMatchFrequency: Record<string, number> = {};

  for (const file of files) {
    const filePath = path.join(transcriptsDir, file);
    const rawContent = fs.readFileSync(filePath, "utf-8");
    const rawLength = rawContent.length;

    // Clean: remove timestamps, duplicate lines, HTML tags
    const cleaned = cleanTranscript(rawContent, file.endsWith(".vtt"));
    const cleanedLength = cleaned.length;

    // Tag concepts
    const taggedConcepts = tagConcepts(cleaned);

    // Match rules
    const matchedRuleIds = matchRules(cleaned);

    // Generate summary
    const summary = generateSummary(cleaned, taggedConcepts);

    // Update frequency maps
    for (const concept of taggedConcepts) {
      conceptFrequency[concept] = (conceptFrequency[concept] || 0) + 1;
    }
    for (const ruleId of matchedRuleIds) {
      ruleMatchFrequency[ruleId] = (ruleMatchFrequency[ruleId] || 0) + 1;
    }

    // Source name from file name
    const sourceName = path
      .basename(file, path.extname(file))
      .replace(/[_-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    entries.push({
      fileName: file,
      sourceName,
      rawLength,
      cleanedLength,
      taggedConcepts,
      matchedRuleIds,
      summary,
    });

    console.log(`  ✓ ${file.padEnd(30)} → ${taggedConcepts.length} concepts, ${matchedRuleIds.length} rule matches`);
  }

  // Write index
  const index: TranscriptIndex = {
    ingestedAt: new Date().toISOString(),
    totalFiles: files.length,
    entries,
    conceptFrequency,
    ruleMatchFrequency,
  };

  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));

  console.log(`\n✅ Index written to: ${outputPath}`);
  console.log(`   ${files.length} files, ${Object.keys(conceptFrequency).length} unique concepts`);
}

// ─── Transcript Cleaning ──────────────────────────────────────

function cleanTranscript(content: string, isVtt: boolean): string {
  let cleaned = content;

  if (isVtt) {
    // Remove VTT header
    cleaned = cleaned.replace(/^WEBVTT[\s\S]*?\n\n/, "");
    // Remove timestamps (00:00:00.000 --> 00:00:05.000)
    cleaned = cleaned.replace(/\d{2}:\d{2}:\d{2}\.\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}\.\d{3}/g, "");
    // Remove cue numbers
    cleaned = cleaned.replace(/^\d+\s*$/gm, "");
  } else {
    // Remove plain text timestamps [00:00:00]
    cleaned = cleaned.replace(/\[\d{2}:\d{2}:\d{2}\]/g, "");
    cleaned = cleaned.replace(/\(\d{2}:\d{2}:\d{2}\)/g, "");
  }

  // Remove HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, "");

  // Remove duplicate consecutive lines
  const lines = cleaned.split("\n").filter((l) => l.trim());
  const uniqueLines = lines.filter((line, i, arr) => {
    if (i === 0) return true;
    const prev = arr[i - 1].trim().toLowerCase();
    const curr = line.trim().toLowerCase();
    return prev !== curr;
  });

  // Remove overly short lines (likely artifacts)
  const meaningfulLines = uniqueLines.filter((l) => l.trim().length > 10);

  return meaningfulLines.join("\n").trim();
}

// ─── Concept Tagging ──────────────────────────────────────────

function tagConcepts(text: string): string[] {
  const lowerText = text.toLowerCase();
  const found: string[] = [];

  for (const [concept, keywords] of Object.entries(CONCEPT_KEYWORDS)) {
    for (const kw of keywords) {
      if (lowerText.includes(kw)) {
        found.push(concept);
        break;
      }
    }
  }

  return [...new Set(found)].sort();
}

// ─── Rule Matching ────────────────────────────────────────────

function matchRules(text: string): string[] {
  const lowerText = text.toLowerCase();
  const matched: string[] = [];

  for (const rule of transcriptResearchRules) {
    // Check if any of the rule's signals appear in the text
    const signalMatch = rule.signals.some((signal) =>
      lowerText.includes(signal.toLowerCase().substring(0, 30))
    );

    if (signalMatch) {
      matched.push(rule.id);
    }
  }

  return matched;
}

// ─── Summary Generation ──────────────────────────────────────

function generateSummary(text: string, concepts: string[]): string {
  const lines = text.split("\n").filter((l) => l.trim());
  const firstMeaningful = lines.slice(0, 3).join(" ").substring(0, 200);
  const conceptStr = concepts.length > 0 ? concepts.join(", ") : "no concepts detected";
  return `[${conceptStr}] ${firstMeaningful}...`;
}

// ─── Run ─────────────────────────────────────────────────────

main().catch((err) => {
  console.error("❌ Ingestion failed:", err);
  process.exit(1);
});
