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
};

export default client;