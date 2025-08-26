import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID, Query } from 'appwrite';
import type { Team } from '../types';

interface TeamsState {
  teams: Team[];
  loading: boolean;
  error: string | null;
}

const initialState: TeamsState = {
  teams: [],
  loading: false,
  error: null,
};

export const fetchTeams = createAsyncThunk(
  'teams/fetchTeams',
  async (leagueId?: string) => {
    const queries = [Query.orderDesc('$createdAt')];
    if (leagueId) {
      queries.push(Query.equal('leagueId', leagueId));
    }
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.TEAMS,
      queries
    );
    return response.documents as unknown as Team[];
  }
);

export const createTeam = createAsyncThunk(
  'teams/createTeam',
  async (team: Omit<Team, '$id' | '$createdAt' | '$updatedAt'>) => {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.TEAMS,
      ID.unique(),
      team
    );
    return response as unknown as Team;
  }
);

export const updateTeam = createAsyncThunk(
  'teams/updateTeam',
  async ({ id, ...updates }: { id: string } & Partial<Team>) => {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.TEAMS,
      id,
      updates
    );
    return response as unknown as Team;
  }
);

export const deleteTeam = createAsyncThunk(
  'teams/deleteTeam',
  async (id: string) => {
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.TEAMS, id);
    return id;
  }
);

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch teams';
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.teams.unshift(action.payload);
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        const index = state.teams.findIndex(team => team.$id === action.payload.$id);
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.teams = state.teams.filter(team => team.$id !== action.payload);
      });
  },
});

export const { clearError } = teamsSlice.actions;
export default teamsSlice.reducer;