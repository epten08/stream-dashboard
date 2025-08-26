import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID, Query } from 'appwrite';
import type { Fixture } from '../types';

interface FixturesState {
  fixtures: Fixture[];
  loading: boolean;
  error: string | null;
}

const initialState: FixturesState = {
  fixtures: [],
  loading: false,
  error: null,
};

export const fetchFixtures = createAsyncThunk(
  'fixtures/fetchFixtures',
  async (leagueId?: string) => {
    const queries = [Query.orderDesc('date')];
    if (leagueId) {
      queries.push(Query.equal('leagueId', leagueId));
    }
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.FIXTURES,
      queries
    );
    return response.documents as unknown as Fixture[];
  }
);

export const createFixture = createAsyncThunk(
  'fixtures/createFixture',
  async (fixture: Omit<Fixture, '$id' | '$createdAt' | '$updatedAt'>) => {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.FIXTURES,
      ID.unique(),
      fixture
    );
    return response as unknown as Fixture;
  }
);

export const updateFixture = createAsyncThunk(
  'fixtures/updateFixture',
  async ({ id, ...updates }: { id: string } & Partial<Fixture>) => {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.FIXTURES,
      id,
      updates
    );
    return response as unknown as Fixture;
  }
);

export const deleteFixture = createAsyncThunk(
  'fixtures/deleteFixture',
  async (id: string) => {
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.FIXTURES, id);
    return id;
  }
);

const fixturesSlice = createSlice({
  name: 'fixtures',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFixtures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFixtures.fulfilled, (state, action) => {
        state.loading = false;
        state.fixtures = action.payload;
      })
      .addCase(fetchFixtures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch fixtures';
      })
      .addCase(createFixture.fulfilled, (state, action) => {
        state.fixtures.unshift(action.payload);
      })
      .addCase(updateFixture.fulfilled, (state, action) => {
        const index = state.fixtures.findIndex(fixture => fixture.$id === action.payload.$id);
        if (index !== -1) {
          state.fixtures[index] = action.payload;
        }
      })
      .addCase(deleteFixture.fulfilled, (state, action) => {
        state.fixtures = state.fixtures.filter(fixture => fixture.$id !== action.payload);
      });
  },
});

export const { clearError } = fixturesSlice.actions;
export default fixturesSlice.reducer;