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

export interface Subscription {
  $id?: string;
  userId: string;
  planType: 'free' | 'basic' | 'premium';
  status: 'active' | 'expired' | 'pending' | 'cancelled';
  startDate: string;
  endDate?: string;
  channels: string[];
  price: number;
  currency: 'USD' | 'ZWL';
  $createdAt?: string;
  $updatedAt?: string;
}

export interface AppUser {
  $id?: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'blocked' | 'pending';
  role: 'user' | 'admin';
  subscription?: Subscription;
  lastActive?: string;
  $createdAt?: string;
  $updatedAt?: string;
}

export interface EcoCashTransaction {
  $id?: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: 'USD' | 'ZWL';
  phone: string;
  reference: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  transactionId?: string;
  gateway: 'ecocash' | 'onemoney' | 'telecash';
  description: string;
  $createdAt?: string;
  $updatedAt?: string;
}

export interface Channel {
  $id?: string;
  name: string;
  description: string;
  type: 'free' | 'paid';
  price?: number;
  currency?: 'USD' | 'ZWL';
  streamUrl?: string;
  isActive: boolean;
  $createdAt?: string;
  $updatedAt?: string;
}

export interface ViewerSession {
  $id?: string;
  userId?: string;
  channelId: string;
  matchId?: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  isActive: boolean;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  location?: string;
  $createdAt?: string;
  $updatedAt?: string;
}

export interface ChannelViewers {
  channelId: string;
  channelName: string;
  currentViewers: number;
  peakViewers: number;
  totalViews: number;
  averageViewTime: number;
}

export interface SubscriptionGrowth {
  date: string;
  freeSubscriptions: number;
  basicSubscriptions: number;
  premiumSubscriptions: number;
  totalSubscriptions: number;
}

export interface MatchPopularity {
  $id?: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  totalViewers: number;
  peakViewers: number;
  averageViewTime: number;
  totalComments: number;
  engagementScore: number;
  date: string;
  $createdAt?: string;
  $updatedAt?: string;
}

export interface TeamPopularity {
  teamId: string;
  teamName: string;
  totalMatches: number;
  totalViewers: number;
  averageViewersPerMatch: number;
  totalComments: number;
  engagementScore: number;
}

export interface Comment {
  $id?: string;
  userId: string;
  channelId: string;
  matchId?: string;
  content: string;
  timestamp: string;
  isActive: boolean;
  moderationStatus: 'approved' | 'pending' | 'rejected';
  $createdAt?: string;
  $updatedAt?: string;
}

export interface ChannelEngagement {
  channelId: string;
  channelName: string;
  totalComments: number;
  activeCommenters: number;
  averageCommentsPerHour: number;
  engagementRate: number;
  topCommenterIds: string[];
}

export interface AnalyticsOverview {
  totalViewers: number;
  totalSubscriptions: number;
  totalRevenue: number;
  totalMatches: number;
  totalComments: number;
  averageViewTime: number;
  conversionRate: number;
  churnRate: number;
}