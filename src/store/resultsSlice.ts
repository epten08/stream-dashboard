import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID, Query } from 'appwrite';
import type { Result } from '../types';

interface ResultsState {
  results: Result[];
  loading: boolean;
  error: string | null;
}

const initialState: ResultsState = {
  results: [],
  loading: false,
  error: null,
};

export const fetchResults = createAsyncThunk(
  'results/fetchResults',
  async (fixtureId?: string) => {
    const queries = [Query.orderDesc('$createdAt')];
    if (fixtureId) {
      queries.push(Query.equal('fixtureId', fixtureId));
    }
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.RESULTS,
      queries
    );
    return response.documents as unknown as Result[];
  }
);

export const createResult = createAsyncThunk(
  'results/createResult',
  async (result: Omit<Result, '$id' | '$createdAt' | '$updatedAt'>) => {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.RESULTS,
      ID.unique(),
      result
    );
    return response as unknown as Result;
  }
);

export const updateResult = createAsyncThunk(
  'results/updateResult',
  async ({ id, ...updates }: { id: string } & Partial<Result>) => {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.RESULTS,
      id,
      updates
    );
    return response as unknown as Result;
  }
);

export const deleteResult = createAsyncThunk(
  'results/deleteResult',
  async (id: string) => {
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.RESULTS, id);
    return id;
  }
);

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch results';
      })
      .addCase(createResult.fulfilled, (state, action) => {
        state.results.unshift(action.payload);
      })
      .addCase(updateResult.fulfilled, (state, action) => {
        const index = state.results.findIndex(result => result.$id === action.payload.$id);
        if (index !== -1) {
          state.results[index] = action.payload;
        }
      })
      .addCase(deleteResult.fulfilled, (state, action) => {
        state.results = state.results.filter(result => result.$id !== action.payload);
      });
  },
});

export const { clearError } = resultsSlice.actions;
export default resultsSlice.reducer;