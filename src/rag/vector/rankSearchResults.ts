import { ScoredChunk } from "../vector/types";

export function rankSearchResults(
  scored: ScoredChunk[],
  limit: number,
  minScore: number,
): ScoredChunk[] {
  const sorted = [...scored].sort((left, right) => right.score - left.score);
  const aboveThreshold = sorted.filter((entry) => entry.score >= minScore);

  if (aboveThreshold.length >= limit) {
    return aboveThreshold.slice(0, limit);
  }

  return sorted.slice(0, limit);
}
