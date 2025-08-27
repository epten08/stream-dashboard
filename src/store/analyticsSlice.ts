import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID, Query } from 'appwrite';
import type { 
  ViewerSession, 
  ChannelViewers, 
  SubscriptionGrowth, 
  MatchPopularity, 
  TeamPopularity, 
  ChannelEngagement, 
  AnalyticsOverview,
  Comment,
  Channel,
  AppUser,
  Subscription,
  Fixture,
  Team
} from '../types';

interface AnalyticsState {
  channelViewers: ChannelViewers[];
  subscriptionGrowth: SubscriptionGrowth[];
  matchPopularity: MatchPopularity[];
  teamPopularity: TeamPopularity[];
  channelEngagement: ChannelEngagement[];
  analyticsOverview: AnalyticsOverview;
  viewerSessions: ViewerSession[];
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  channelViewers: [],
  subscriptionGrowth: [],
  matchPopularity: [],
  teamPopularity: [],
  channelEngagement: [],
  analyticsOverview: {
    totalViewers: 0,
    totalSubscriptions: 0,
    totalRevenue: 0,
    totalMatches: 0,
    totalComments: 0,
    averageViewTime: 0,
    conversionRate: 0,
    churnRate: 0,
  },
  viewerSessions: [],
  comments: [],
  loading: false,
  error: null,
};

export const fetchViewerSessions = createAsyncThunk(
  'analytics/fetchViewerSessions',
  async (params?: { channelId?: string; isActive?: boolean }) => {
    const queries = [Query.orderDesc('$createdAt')];
    if (params?.channelId) {
      queries.push(Query.equal('channelId', params.channelId));
    }
    if (params?.isActive !== undefined) {
      queries.push(Query.equal('isActive', params.isActive));
    }
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.VIEWER_SESSIONS,
      queries
    );
    return response.documents as unknown as ViewerSession[];
  }
);

export const fetchComments = createAsyncThunk(
  'analytics/fetchComments',
  async (params?: { channelId?: string; matchId?: string }) => {
    const queries = [Query.orderDesc('$createdAt')];
    if (params?.channelId) {
      queries.push(Query.equal('channelId', params.channelId));
    }
    if (params?.matchId) {
      queries.push(Query.equal('matchId', params.matchId));
    }
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.COMMENTS,
      queries
    );
    return response.documents as unknown as Comment[];
  }
);

export const fetchMatchPopularity = createAsyncThunk(
  'analytics/fetchMatchPopularity',
  async () => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.MATCH_POPULARITY,
      [Query.orderDesc('totalViewers')]
    );
    return response.documents as unknown as MatchPopularity[];
  }
);

export const generateAnalytics = createAsyncThunk(
  'analytics/generateAnalytics',
  async () => {
    const [
      channelsRes,
      sessionsRes,
      subscriptionsRes,
      usersRes,
      fixturesRes,
      teamsRes,
      commentsRes,
      matchPopularityRes
    ] = await Promise.all([
      databases.listDocuments(DATABASE_ID, COLLECTIONS.CHANNELS),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.VIEWER_SESSIONS, [Query.orderDesc('$createdAt')]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.SUBSCRIPTIONS, [Query.orderDesc('$createdAt')]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.USERS),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.FIXTURES),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.TEAMS),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.COMMENTS, [Query.orderDesc('$createdAt')]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.MATCH_POPULARITY)
    ]);

    const channels = channelsRes.documents as unknown as Channel[];
    const sessions = sessionsRes.documents as unknown as ViewerSession[];
    const subscriptions = subscriptionsRes.documents as unknown as Subscription[];
    const users = usersRes.documents as unknown as AppUser[];
    const fixtures = fixturesRes.documents as unknown as Fixture[];
    const teams = teamsRes.documents as unknown as Team[];
    const comments = commentsRes.documents as unknown as Comment[];
    const matchPopularity = matchPopularityRes.documents as unknown as MatchPopularity[];

    return {
      channels,
      sessions,
      subscriptions,
      users,
      fixtures,
      teams,
      comments,
      matchPopularity
    };
  }
);

export const createViewerSession = createAsyncThunk(
  'analytics/createViewerSession',
  async (session: Omit<ViewerSession, '$id' | '$createdAt' | '$updatedAt'>) => {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.VIEWER_SESSIONS,
      ID.unique(),
      session
    );
    return response as unknown as ViewerSession;
  }
);

export const endViewerSession = createAsyncThunk(
  'analytics/endViewerSession',
  async ({ sessionId, endTime }: { sessionId: string; endTime: string }) => {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.VIEWER_SESSIONS,
      sessionId,
      { 
        endTime,
        isActive: false,
        duration: Math.floor((new Date(endTime).getTime() - new Date().getTime()) / 1000)
      }
    );
    return response as unknown as ViewerSession;
  }
);

const calculateChannelViewers = (channels: Channel[], sessions: ViewerSession[]): ChannelViewers[] => {
  return channels.map(channel => {
    const channelSessions = sessions.filter(s => s.channelId === channel.$id);
    const activeSessions = channelSessions.filter(s => s.isActive);
    const totalViews = channelSessions.length;
    const peakViewers = Math.max(...channelSessions.map(() => activeSessions.length), 0);
    const avgViewTime = channelSessions.length > 0 
      ? channelSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / channelSessions.length
      : 0;

    return {
      channelId: channel.$id || '',
      channelName: channel.name,
      currentViewers: activeSessions.length,
      peakViewers,
      totalViews,
      averageViewTime: avgViewTime
    };
  });
};

const calculateSubscriptionGrowth = (subscriptions: Subscription[]): SubscriptionGrowth[] => {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  return last30Days.map(date => {
    const daySubscriptions = subscriptions.filter(sub => {
      const subDate = new Date(sub.$createdAt || '').toISOString().split('T')[0];
      return subDate <= date;
    });

    return {
      date,
      freeSubscriptions: daySubscriptions.filter(s => s.planType === 'free').length,
      basicSubscriptions: daySubscriptions.filter(s => s.planType === 'basic').length,
      premiumSubscriptions: daySubscriptions.filter(s => s.planType === 'premium').length,
      totalSubscriptions: daySubscriptions.length
    };
  });
};

const calculateTeamPopularity = (teams: Team[], matchPopularity: MatchPopularity[]): TeamPopularity[] => {
  return teams.map(team => {
    const teamMatches = matchPopularity.filter(m => 
      m.homeTeam === team.name || m.awayTeam === team.name
    );
    
    const totalViewers = teamMatches.reduce((sum, m) => sum + m.totalViewers, 0);
    const totalComments = teamMatches.reduce((sum, m) => sum + m.totalComments, 0);
    const avgViewers = teamMatches.length > 0 ? totalViewers / teamMatches.length : 0;
    const engagementScore = teamMatches.length > 0 
      ? teamMatches.reduce((sum, m) => sum + m.engagementScore, 0) / teamMatches.length 
      : 0;

    return {
      teamId: team.$id || '',
      teamName: team.name,
      totalMatches: teamMatches.length,
      totalViewers,
      averageViewersPerMatch: avgViewers,
      totalComments,
      engagementScore
    };
  });
};

const calculateChannelEngagement = (channels: Channel[], comments: Comment[]): ChannelEngagement[] => {
  return channels.map(channel => {
    const channelComments = comments.filter(c => c.channelId === channel.$id);
    const uniqueCommenters = [...new Set(channelComments.map(c => c.userId))];
    const hoursActive = 24;
    const avgCommentsPerHour = channelComments.length / hoursActive;
    
    const topCommenters = uniqueCommenters
      .map(userId => ({
        userId,
        count: channelComments.filter(c => c.userId === userId).length
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(c => c.userId);

    return {
      channelId: channel.$id || '',
      channelName: channel.name,
      totalComments: channelComments.length,
      activeCommenters: uniqueCommenters.length,
      averageCommentsPerHour: avgCommentsPerHour,
      engagementRate: uniqueCommenters.length > 0 ? channelComments.length / uniqueCommenters.length : 0,
      topCommenterIds: topCommenters
    };
  });
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        const { channels, sessions, subscriptions, users, fixtures, teams, comments, matchPopularity } = action.payload;
        
        state.channelViewers = calculateChannelViewers(channels, sessions);
        state.subscriptionGrowth = calculateSubscriptionGrowth(subscriptions);
        state.teamPopularity = calculateTeamPopularity(teams, matchPopularity);
        state.channelEngagement = calculateChannelEngagement(channels, comments);
        state.matchPopularity = matchPopularity;
        state.viewerSessions = sessions;
        state.comments = comments;
        
        const totalViewers = sessions.filter(s => s.isActive).length;
        const totalRevenue = subscriptions
          .filter(s => s.status === 'active')
          .reduce((sum, s) => sum + s.price, 0);
        
        state.analyticsOverview = {
          totalViewers,
          totalSubscriptions: subscriptions.length,
          totalRevenue,
          totalMatches: fixtures.length,
          totalComments: comments.length,
          averageViewTime: sessions.length > 0 
            ? sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length 
            : 0,
          conversionRate: users.length > 0 ? (subscriptions.filter(s => s.planType !== 'free').length / users.length) * 100 : 0,
          churnRate: subscriptions.length > 0 ? (subscriptions.filter(s => s.status === 'cancelled').length / subscriptions.length) * 100 : 0,
        };
      })
      .addCase(generateAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate analytics';
      })
      .addCase(fetchViewerSessions.fulfilled, (state, action) => {
        state.viewerSessions = action.payload;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(fetchMatchPopularity.fulfilled, (state, action) => {
        state.matchPopularity = action.payload;
      })
      .addCase(createViewerSession.fulfilled, (state, action) => {
        state.viewerSessions.unshift(action.payload);
      })
      .addCase(endViewerSession.fulfilled, (state, action) => {
        const index = state.viewerSessions.findIndex(s => s.$id === action.payload.$id);
        if (index !== -1) {
          state.viewerSessions[index] = action.payload;
        }
      });
  },
});

export const { clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer;