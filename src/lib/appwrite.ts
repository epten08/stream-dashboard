import { Client, Databases, Storage, Account } from 'appwrite';

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'http://localhost/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || 'stream-dashboard');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'main';
export const COLLECTIONS = {
  LEAGUES: import.meta.env.VITE_APPWRITE_LEAGUES_COLLECTION_ID || 'leagues',
  TEAMS: import.meta.env.VITE_APPWRITE_TEAMS_COLLECTION_ID || 'teams',
  FIXTURES: import.meta.env.VITE_APPWRITE_FIXTURES_COLLECTION_ID || 'fixtures',
  RESULTS: import.meta.env.VITE_APPWRITE_RESULTS_COLLECTION_ID || 'results',
  USERS: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID || 'users',
  SUBSCRIPTIONS: import.meta.env.VITE_APPWRITE_SUBSCRIPTIONS_COLLECTION_ID || 'subscriptions',
  TRANSACTIONS: import.meta.env.VITE_APPWRITE_TRANSACTIONS_COLLECTION_ID || 'transactions',
  CHANNELS: import.meta.env.VITE_APPWRITE_CHANNELS_COLLECTION_ID || 'channels',
  VIEWER_SESSIONS: import.meta.env.VITE_APPWRITE_VIEWER_SESSIONS_COLLECTION_ID || 'viewer_sessions',
  MATCH_POPULARITY: import.meta.env.VITE_APPWRITE_MATCH_POPULARITY_COLLECTION_ID || 'match_popularity',
  COMMENTS: import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID || 'comments',
};

export default client;