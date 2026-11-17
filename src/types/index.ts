export type CriterionType = 'club' | 'achievement' | 'stat';

export interface Criterion {
  id: string;
  name: string;
  shortName: string;
  type: CriterionType;
  badge?: string;
  color?: string;
  description?: string;
}

export interface Player {
  id: string;
  name: string;
  normalizedName: string;
  displayName?: string;
  clubs: string[];
  nationalCaps: number;
  nationalGoals?: number;
  achievements?: string[];
  birthYear?: number;
  position?: string;
  nationality: string;
  photoUrl?: string;
  isCultHero?: boolean; // For high rarity score bonus
}

export interface CellPosition {
  row: number;
  col: number;
}

export interface CellState {
  player: Player | null;
  isValid: boolean;
  attemptedAt?: number;
}

export interface GridPuzzle {
  id: string;
  title: string;
  date?: string;
  rows: Criterion[];
  cols: Criterion[];
  difficulty: 'Ușor' | 'Mediu' | 'Greu' | 'Mod Patron';
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  bestRarityScore: number;
}
