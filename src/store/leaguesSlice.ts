import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID, Query } from 'appwrite';
import type { League } from '../types';

interface LeaguesState {
  leagues: League[];
  loading: boolean;
  error: string | null;
}

const initialState: LeaguesState = {
  leagues: [],
  loading: false,
  error: null,
};

export const fetchLeagues = createAsyncThunk(
  'leagues/fetchLeagues',
  async () => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.LEAGUES,
      [Query.orderDesc('$createdAt')]
    );
    return response.documents as unknown as League[];
  }
);

export const createLeague = createAsyncThunk(
  'leagues/createLeague',
  async (league: Omit<League, '$id' | '$createdAt' | '$updatedAt'>) => {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.LEAGUES,
      ID.unique(),
      league
    );
    return response as unknown as League;
  }
);

export const updateLeague = createAsyncThunk(
  'leagues/updateLeague',
  async ({ id, ...updates }: { id: string } & Partial<League>) => {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.LEAGUES,
      id,
      updates
    );
    return response as unknown as League;
  }
);

export const deleteLeague = createAsyncThunk(
  'leagues/deleteLeague',
  async (id: string) => {
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.LEAGUES, id);
    return id;
  }
);

const leaguesSlice = createSlice({
  name: 'leagues',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeagues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeagues.fulfilled, (state, action) => {
        state.loading = false;
        state.leagues = action.payload;
      })
      .addCase(fetchLeagues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch leagues';
      })
      .addCase(createLeague.fulfilled, (state, action) => {
        state.leagues.unshift(action.payload);
      })
      .addCase(updateLeague.fulfilled, (state, action) => {
        const index = state.leagues.findIndex(league => league.$id === action.payload.$id);
        if (index !== -1) {
          state.leagues[index] = action.payload;
        }
      })
      .addCase(deleteLeague.fulfilled, (state, action) => {
        state.leagues = state.leagues.filter(league => league.$id !== action.payload);
      });
  },
});

export const { clearError } = leaguesSlice.actions;
export default leaguesSlice.reducer;