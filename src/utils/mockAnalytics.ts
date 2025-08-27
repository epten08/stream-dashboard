import { ID } from 'appwrite';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import type { 
  ViewerSession, 
  MatchPopularity, 
  Comment, 
  Channel,
  AppUser,
  Subscription,
  Team,
  Fixture
} from '../types';

export const generateMockViewerSessions = async (channels: Channel[]): Promise<ViewerSession[]> => {
  const sessions: ViewerSession[] = [];
  const deviceTypes = ['desktop', 'mobile', 'tablet'] as const;
  const locations = ['Harare', 'Bulawayo', 'Mutare', 'Gweru', 'Masvingo'];

  for (const channel of channels) {
    const numSessions = Math.floor(Math.random() * 50) + 10;
    
    for (let i = 0; i < numSessions; i++) {
      const startTime = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000);
      const isActive = Math.random() > 0.3;
      const duration = isActive ? undefined : Math.floor(Math.random() * 7200) + 300; // 5min to 2hours
      
      const session: ViewerSession = {
        userId: `user_${Math.floor(Math.random() * 1000)}`,
        channelId: channel.$id || '',
        startTime: startTime.toISOString(),
        endTime: isActive ? undefined : new Date(startTime.getTime() + (duration || 0) * 1000).toISOString(),
        duration,
        isActive,
        deviceType: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
        location: locations[Math.floor(Math.random() * locations.length)]
      };

      try {
        const created = await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.VIEWER_SESSIONS,
          ID.unique(),
          session
        );
        sessions.push(created as unknown as ViewerSession);
      } catch (error) {
        console.warn('Failed to create viewer session:', error);
      }
    }
  }

  return sessions;
};

export const generateMockMatchPopularity = async (fixtures: Fixture[], teams: Team[]): Promise<MatchPopularity[]> => {
  const matchPopularity: MatchPopularity[] = [];

  for (const fixture of fixtures.slice(0, 20)) {
    const homeTeam = teams.find(t => t.$id === fixture.homeTeamId);
    const awayTeam = teams.find(t => t.$id === fixture.awayTeamId);
    
    if (!homeTeam || !awayTeam) continue;

    const totalViewers = Math.floor(Math.random() * 10000) + 1000;
    const peakViewers = totalViewers + Math.floor(Math.random() * 2000);
    const averageViewTime = Math.floor(Math.random() * 5400) + 600; // 10min to 1.5hours
    const totalComments = Math.floor(Math.random() * 500) + 50;
    const engagementScore = (totalComments / totalViewers) * 100;

    const match: MatchPopularity = {
      matchId: fixture.$id || '',
      homeTeam: homeTeam.name,
      awayTeam: awayTeam.name,
      totalViewers,
      peakViewers,
      averageViewTime,
      totalComments,
      engagementScore,
      date: fixture.date
    };

    try {
      const created = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.MATCH_POPULARITY,
        ID.unique(),
        match
      );
      matchPopularity.push(created as unknown as MatchPopularity);
    } catch (error) {
      console.warn('Failed to create match popularity:', error);
    }
  }

  return matchPopularity;
};

export const generateMockComments = async (channels: Channel[], users: AppUser[]): Promise<Comment[]> => {
  const comments: Comment[] = [];
  const sampleComments = [
    "Great match!", "Amazing goal!", "What a save!", "Referee needs glasses",
    "Come on team!", "Beautiful play", "That was close!", "Penalty!",
    "Incredible atmosphere", "Best match this season", "Heart attack material",
    "Defense looks solid", "Great counter attack", "Nice pass", "Goal!!!"
  ];

  for (const channel of channels) {
    const numComments = Math.floor(Math.random() * 200) + 50;
    
    for (let i = 0; i < numComments; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const timestamp = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000);
      
      const comment: Comment = {
        userId: user.$id || '',
        channelId: channel.$id || '',
        content: sampleComments[Math.floor(Math.random() * sampleComments.length)],
        timestamp: timestamp.toISOString(),
        isActive: true,
        moderationStatus: Math.random() > 0.1 ? 'approved' : 'pending'
      };

      try {
        const created = await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.COMMENTS,
          ID.unique(),
          comment
        );
        comments.push(created as unknown as Comment);
      } catch (error) {
        console.warn('Failed to create comment:', error);
      }
    }
  }

  return comments;
};

export const generateMockChannels = async (): Promise<Channel[]> => {
  const mockChannels: Omit<Channel, '$id' | '$createdAt' | '$updatedAt'>[] = [
    {
      name: 'PSL Live',
      description: 'Premier Soccer League live matches',
      type: 'paid',
      price: 15.99,
      currency: 'USD',
      streamUrl: 'https://stream.example.com/psl-live',
      isActive: true
    },
    {
      name: 'Free Sports',
      description: 'Free sports content and highlights',
      type: 'free',
      streamUrl: 'https://stream.example.com/free-sports',
      isActive: true
    },
    {
      name: 'Youth League',
      description: 'Youth league matches and development',
      type: 'paid',
      price: 8.99,
      currency: 'USD',
      streamUrl: 'https://stream.example.com/youth-league',
      isActive: true
    },
    {
      name: 'Women\'s Football',
      description: 'Women\'s football matches',
      type: 'paid',
      price: 12.99,
      currency: 'USD',
      streamUrl: 'https://stream.example.com/womens-football',
      isActive: true
    }
  ];

  const channels: Channel[] = [];
  
  for (const channelData of mockChannels) {
    try {
      const created = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.CHANNELS,
        ID.unique(),
        channelData
      );
      channels.push(created as unknown as Channel);
    } catch (error) {
      console.warn('Failed to create channel:', error);
    }
  }

  return channels;
};

export const generateMockUsers = async (): Promise<AppUser[]> => {
  const mockUsers: Omit<AppUser, '$id' | '$createdAt' | '$updatedAt'>[] = [
    {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+263771234567',
      status: 'active',
      role: 'user',
      lastActive: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+263772345678',
      status: 'active',
      role: 'user',
      lastActive: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '+263773456789',
      status: 'active',
      role: 'user',
      lastActive: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '+263774567890',
      status: 'blocked',
      role: 'user',
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      name: 'David Brown',
      email: 'david.brown@email.com',
      phone: '+263775678901',
      status: 'active',
      role: 'user',
      lastActive: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const users: AppUser[] = [];
  
  for (const userData of mockUsers) {
    try {
      const created = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        ID.unique(),
        userData
      );
      users.push(created as unknown as AppUser);
    } catch (error) {
      console.warn('Failed to create user:', error);
    }
  }

  return users;
};

export const generateMockSubscriptions = async (users: AppUser[], channels: Channel[]): Promise<Subscription[]> => {
  const subscriptions: Subscription[] = [];
  const planTypes = ['free', 'basic', 'premium'] as const;
  const prices = { free: 0, basic: 9.99, premium: 19.99 };

  for (const user of users) {
    const numSubscriptions = Math.floor(Math.random() * 3) + 1; // 1-3 subscriptions per user
    
    for (let i = 0; i < numSubscriptions; i++) {
      const planType = planTypes[Math.floor(Math.random() * planTypes.length)];
      const startDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      const subscribedChannels = channels
        .filter(() => Math.random() > 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 1)
        .map(c => c.$id || '');

      const subscription: Subscription = {
        userId: user.$id || '',
        planType,
        status: Math.random() > 0.1 ? 'active' : 'expired',
        startDate: startDate.toISOString(),
        endDate: planType !== 'free' ? new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        channels: subscribedChannels,
        price: prices[planType],
        currency: 'USD'
      };

      try {
        const created = await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.SUBSCRIPTIONS,
          ID.unique(),
          subscription
        );
        subscriptions.push(created as unknown as Subscription);
      } catch (error) {
        console.warn('Failed to create subscription:', error);
      }
    }
  }

  return subscriptions;
};