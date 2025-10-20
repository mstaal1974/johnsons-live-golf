import { Hole, HoleScore } from "../types/golf";

/**
 * Calculate Stableford points for a hole
 * @param strokes - Number of strokes taken
 * @param par - Par for the hole
 * @param handicap - Player/Team handicap
 * @param strokeIndex - Stroke index of the hole (1-18)
 * @returns Stableford points
 */
export function calculateStablefordPoints(
  strokes: number,
  par: number,
  handicap: number,
  strokeIndex: number
): number {
  // Calculate the number of strokes received on this hole
  const strokesReceived = Math.floor(handicap / 18) + (strokeIndex <= (handicap % 18) ? 1 : 0);
  
  // Net score is actual strokes minus strokes received
  const netScore = strokes - strokesReceived;
  
  // Calculate points based on net score vs par
  const scoreDiff = par - netScore;
  
  if (scoreDiff >= 3) return 5; // Albatross or better
  if (scoreDiff === 2) return 4; // Eagle
  if (scoreDiff === 1) return 3; // Birdie
  if (scoreDiff === 0) return 2; // Par
  if (scoreDiff === -1) return 1; // Bogey
  
  return 0; // Double bogey or worse
}

/**
 * Calculate team handicap for Ambrose mode
 * Based on team size
 */
export function calculateTeamHandicap(playerHandicaps: number[]): number {
  const teamSize = playerHandicaps.length;
  
  if (teamSize === 0) return 0;
  if (teamSize === 1) return playerHandicaps[0];
  
  // Sort handicaps from lowest to highest
  const sorted = [...playerHandicaps].sort((a, b) => a - b);
  
  // Standard Ambrose formula based on team size
  if (teamSize === 2) {
    return Math.round(sorted[0] * 0.35 + sorted[1] * 0.15);
  } else if (teamSize === 3) {
    return Math.round(sorted[0] * 0.3 + sorted[1] * 0.15 + sorted[2] * 0.1);
  } else if (teamSize === 4) {
    return Math.round(sorted[0] * 0.25 + sorted[1] * 0.15 + sorted[2] * 0.1 + sorted[3] * 0.05);
  }
  
  // For larger teams, use a simplified formula
  return Math.round(sorted[0] * 0.25 + (sorted.slice(1).reduce((sum, h) => sum + h, 0) / (teamSize - 1)) * 0.15);
}

/**
 * Get score description (e.g., "Birdie", "Eagle")
 */
export function getScoreDescription(strokes: number, par: number): string {
  const diff = strokes - par;
  
  if (diff <= -4) return "Condor";
  if (diff === -3) return "Albatross";
  if (diff === -2) return "Eagle";
  if (diff === -1) return "Birdie";
  if (diff === 0) return "Par";
  if (diff === 1) return "Bogey";
  if (diff === 2) return "Double Bogey";
  if (diff === 3) return "Triple Bogey";
  
  return `+${diff}`;
}

/**
 * Calculate total scores from hole scores
 */
export function calculateTotals(
  holeScores: HoleScore[],
  holes: Hole[],
  handicap: number
): { totalStrokes: number; totalPoints: number } {
  let totalStrokes = 0;
  let totalPoints = 0;
  
  holeScores.forEach((holeScore) => {
    const hole = holes.find((h) => h.number === holeScore.holeNumber);
    if (hole) {
      totalStrokes += holeScore.strokes;
      totalPoints += calculateStablefordPoints(
        holeScore.strokes,
        hole.par,
        handicap,
        hole.strokeIndex
      );
    }
  });
  
  return { totalStrokes, totalPoints };
}

/**
 * Check if a score should trigger a celebration (Birdie or better)
 */
export function shouldCelebrate(strokes: number, par: number): boolean {
  return strokes <= par - 1;
}

/**
 * Generate a random avatar color for players/teams
 */
export function generateAvatarColor(): string {
  const colors = [
    "#10b981", // green
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#f59e0b", // amber
    "#ef4444", // red
    "#ec4899", // pink
    "#14b8a6", // teal
    "#f97316", // orange
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
