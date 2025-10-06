export type GameMode = "Individual" | "Ambrose";

export interface Hole {
  number: number;
  par: number;
  strokeIndex: number; // 1-18, used for handicap calculations
}

export interface Course {
  id: string;
  name: string;
  holes: Hole[];
  totalPar: number;
}

export interface Player {
  uid: string;
  fullName: string;
  email: string;
  handicap: number;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  playerIds: string[];
  teamHandicap: number;
  color?: string;
}

export interface HoleScore {
  holeNumber: number;
  strokes: number;
  points?: number; // Stableford points
}

export interface PlayerScore {
  playerId: string;
  courseId: string;
  dayId: string;
  holes: HoleScore[];
  totalStrokes: number;
  totalPoints: number;
  timestamp: string;
}

export interface TeamScore {
  teamId: string;
  courseId: string;
  dayId: string;
  holes: HoleScore[];
  totalStrokes: number;
  totalPoints: number;
  timestamp: string;
}

export interface TournamentDay {
  id: string;
  date: string;
  courseId: string;
}

export interface Tournament {
  id: string;
  name: string;
  days: TournamentDay[];
  gameMode: GameMode;
  createdAt: string;
  createdBy: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  message: string;
  timestamp: string;
}

export interface LeaderboardEntry {
  id: string; // playerId or teamId
  name: string;
  grossScore: number;
  stablefordPoints: number;
  handicap: number;
  isTeam?: boolean;
  playerIds?: string[]; // For teams
}
