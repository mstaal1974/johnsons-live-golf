import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Player,
  Course,
  Team,
  Tournament,
  PlayerScore,
  TeamScore,
  ChatMessage,
} from "../types/golf";

interface GameState {
  // Auth
  currentUser: Player | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  
  // Tournament
  tournament: Tournament | null;
  courses: Course[];
  
  // Players and Teams
  players: Player[];
  teams: Team[];
  
  // Scores
  playerScores: PlayerScore[];
  teamScores: TeamScore[];
  
  // Chat
  chatMessages: ChatMessage[];
  
  // UI State (not persisted)
  selectedDay: string | null;
  showScoreType: "gross" | "stableford";
  
  // Actions
  setCurrentUser: (user: Player | null) => void;
  setAuthenticated: (isAuth: boolean) => void;
  setSuperAdmin: (isAdmin: boolean) => void;
  
  setTournament: (tournament: Tournament | null) => void;
  updateTournament: (updates: Partial<Tournament>) => void;
  
  setCourses: (courses: Course[]) => void;
  addCourse: (course: Course) => void;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  
  setPlayers: (players: Player[]) => void;
  addPlayer: (player: Player) => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  deletePlayer: (playerId: string) => void;
  
  setTeams: (teams: Team[]) => void;
  addTeam: (team: Team) => void;
  updateTeam: (teamId: string, updates: Partial<Team>) => void;
  deleteTeam: (teamId: string) => void;
  
  setPlayerScores: (scores: PlayerScore[]) => void;
  addPlayerScore: (score: PlayerScore) => void;
  updatePlayerScore: (playerId: string, dayId: string, score: PlayerScore) => void;
  
  setTeamScores: (scores: TeamScore[]) => void;
  addTeamScore: (score: TeamScore) => void;
  updateTeamScore: (teamId: string, dayId: string, score: TeamScore) => void;
  
  setChatMessages: (messages: ChatMessage[]) => void;
  addChatMessage: (message: ChatMessage) => void;
  
  setSelectedDay: (dayId: string | null) => void;
  setShowScoreType: (type: "gross" | "stableford") => void;
  
  clearAllTournamentData: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentUser: null,
      isAuthenticated: false,
      isSuperAdmin: false,
      tournament: null,
      courses: [],
      players: [],
      teams: [],
      playerScores: [],
      teamScores: [],
      chatMessages: [],
      selectedDay: null,
      showScoreType: "gross",

      // Auth Actions
      setCurrentUser: (user) => set({ currentUser: user }),
      setAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),
      setSuperAdmin: (isAdmin) => set({ isSuperAdmin: isAdmin }),

      // Tournament Actions
      setTournament: (tournament) => set({ tournament }),
      updateTournament: (updates) => {
        const current = get().tournament;
        if (current) {
          set({ tournament: { ...current, ...updates } });
        }
      },

      // Course Actions
      setCourses: (courses) => set({ courses }),
      addCourse: (course) =>
        set((state) => ({ courses: [...state.courses, course] })),
      updateCourse: (courseId, updates) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === courseId ? { ...c, ...updates } : c
          ),
        })),
      deleteCourse: (courseId) =>
        set((state) => ({
          courses: state.courses.filter((c) => c.id !== courseId),
        })),

      // Player Actions
      setPlayers: (players) => set({ players }),
      addPlayer: (player) =>
        set((state) => ({ players: [...state.players, player] })),
      updatePlayer: (playerId, updates) =>
        set((state) => ({
          players: state.players.map((p) =>
            p.uid === playerId ? { ...p, ...updates } : p
          ),
        })),
      deletePlayer: (playerId) =>
        set((state) => ({
          players: state.players.filter((p) => p.uid !== playerId),
        })),

      // Team Actions
      setTeams: (teams) => set({ teams }),
      addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
      updateTeam: (teamId, updates) =>
        set((state) => ({
          teams: state.teams.map((t) =>
            t.id === teamId ? { ...t, ...updates } : t
          ),
        })),
      deleteTeam: (teamId) =>
        set((state) => ({
          teams: state.teams.filter((t) => t.id !== teamId),
        })),

      // Score Actions
      setPlayerScores: (scores) => set({ playerScores: scores }),
      addPlayerScore: (score) =>
        set((state) => ({ playerScores: [...state.playerScores, score] })),
      updatePlayerScore: (playerId, dayId, score) =>
        set((state) => ({
          playerScores: state.playerScores.map((s) =>
            s.playerId === playerId && s.dayId === dayId ? score : s
          ),
        })),

      setTeamScores: (scores) => set({ teamScores: scores }),
      addTeamScore: (score) =>
        set((state) => ({ teamScores: [...state.teamScores, score] })),
      updateTeamScore: (teamId, dayId, score) =>
        set((state) => ({
          teamScores: state.teamScores.map((s) =>
            s.teamId === teamId && s.dayId === dayId ? score : s
          ),
        })),

      // Chat Actions
      setChatMessages: (messages) => set({ chatMessages: messages }),
      addChatMessage: (message) =>
        set((state) => ({
          chatMessages: [...state.chatMessages, message],
        })),

      // UI Actions
      setSelectedDay: (dayId) => set({ selectedDay: dayId }),
      setShowScoreType: (type) => set({ showScoreType: type }),

      // Clear All Data
      clearAllTournamentData: () =>
        set({
          tournament: null,
          playerScores: [],
          teamScores: [],
          teams: [],
          chatMessages: [],
          selectedDay: null,
        }),
    }),
    {
      name: "johnsons-live-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist necessary data
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        tournament: state.tournament,
        courses: state.courses,
        players: state.players,
        teams: state.teams,
        // Don't persist scores and chat - these come from Firebase
      }),
    }
  )
);
