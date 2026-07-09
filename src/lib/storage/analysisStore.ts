// Browser-safe localStorage storage for analysis results
import type { AnalysisResult } from "../analysis/types";

const STORAGE_KEY = "ytniche-band:analyses";
const MAX_ANALYSES = 50;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function getStore(): AnalysisResult[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AnalysisResult[];
  } catch {
    return [];
  }
}

function setStore(analyses: AnalysisResult[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

/**
 * Save an analysis result to localStorage.
 * Latest results are kept first. Limited to MAX_ANALYSES entries.
 */
export function saveAnalysis(result: AnalysisResult): void {
  const analyses = getStore();
  // Remove existing entry with same ID if any
  const filtered = analyses.filter((a) => a.id !== result.id);
  filtered.unshift(result); // add to front
  setStore(filtered.slice(0, MAX_ANALYSES));
}

/**
 * Get a specific analysis by ID.
 */
export function getAnalysis(id: string): AnalysisResult | null {
  const analyses = getStore();
  return analyses.find((a) => a.id === id) ?? null;
}

/**
 * List all saved analyses (most recent first).
 */
export function listAnalyses(): AnalysisResult[] {
  return getStore();
}

/**
 * Delete an analysis by ID.
 */
export function deleteAnalysis(id: string): void {
  const analyses = getStore();
  setStore(analyses.filter((a) => a.id !== id));
}
