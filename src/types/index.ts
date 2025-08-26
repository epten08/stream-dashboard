export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CameraFeed {
  id: string;
  name: string;
  status: 'live' | 'offline' | 'maintenance' | 'recording';
  viewers: number;
  streamUrl?: string;
  isActive?: boolean;
}

export interface RecordingSession {
  id: string;
  matchId: string;
  startTime: Date;
  endTime?: Date;
  status: 'recording' | 'paused' | 'stopped';
  highlights: RecordingHighlight[];
  cameraFeeds: string[];
}

export interface RecordingHighlight {
  id: string;
  timestamp: Date;
  duration: number;
  description: string;
  cameraFeedId: string;
}

export interface MatchMetadata {
  id: string;
  date: Date;
  homeTeam: string;
  awayTeam: string;
  venue: string;
  competition: string;
  recordingSession?: RecordingSession;
}

export interface League {
  $id?: string;
  name: string;
  country: string;
  type: string;
  $createdAt?: string;
  $updatedAt?: string;
}

export interface Team {
  $id?: string;
  name: string;
  logo?: string;
  leagueId: string;
  league?: League;
  players?: string[];
  $createdAt?: string;
  $updatedAt?: string;
}

export interface Fixture {
  $id?: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeam?: Team;
  awayTeam?: Team;
  date: string;
  venue: string;
  leagueId: string;
  league?: League;
  status: 'scheduled' | 'live' | 'finished' | 'postponed';
  $createdAt?: string;
  $updatedAt?: string;
}

export interface Goal {
  playerId?: string;
  playerName: string;
  minute: number;
  type: 'goal' | 'penalty' | 'own_goal';
}

export interface Card {
  playerId?: string;
  playerName: string;
  minute: number;
  type: 'yellow' | 'red';
  reason?: string;
}

export interface Result {
  $id?: string;
  fixtureId: string;
  fixture?: Fixture;
  homeGoals: number;
  awayGoals: number;
  homeScorers: Goal[];
  awayScorers: Goal[];
  homeCards: Card[];
  awayCards: Card[];
  status: 'full_time' | 'half_time' | 'abandoned';
  $createdAt?: string;
  $updatedAt?: string;
}