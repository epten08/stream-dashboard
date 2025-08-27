import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID, Query } from 'appwrite';
import type { Subscription } from '../types';

interface SubscriptionsState {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionsState = {
  subscriptions: [],
  loading: false,
  error: null,
};

export const fetchSubscriptions = createAsyncThunk(
  'subscriptions/fetchSubscriptions',
  async (userId?: string) => {
    const queries = [Query.orderDesc('$createdAt')];
    if (userId) {
      queries.push(Query.equal('userId', userId));
    }
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.SUBSCRIPTIONS,
      queries
    );
    return response.documents as unknown as Subscription[];
  }
);

export const createSubscription = createAsyncThunk(
  'subscriptions/createSubscription',
  async (subscription: Omit<Subscription, '$id' | '$createdAt' | '$updatedAt'>) => {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.SUBSCRIPTIONS,
      ID.unique(),
      subscription
    );
    return response as unknown as Subscription;
  }
);

export const updateSubscription = createAsyncThunk(
  'subscriptions/updateSubscription',
  async ({ id, ...updates }: { id: string } & Partial<Subscription>) => {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.SUBSCRIPTIONS,
      id,
      updates
    );
    return response as unknown as Subscription;
  }
);

export const cancelSubscription = createAsyncThunk(
  'subscriptions/cancelSubscription',
  async (id: string) => {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.SUBSCRIPTIONS,
      id,
      { status: 'cancelled' }
    );
    return response as unknown as Subscription;
  }
);

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch subscriptions';
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.subscriptions.unshift(action.payload);
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        const index = state.subscriptions.findIndex(sub => sub.$id === action.payload.$id);
        if (index !== -1) {
          state.subscriptions[index] = action.payload;
        }
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        const index = state.subscriptions.findIndex(sub => sub.$id === action.payload.$id);
        if (index !== -1) {
          state.subscriptions[index] = action.payload;
        }
      });
  },
});

export const { clearError } = subscriptionsSlice.actions;
export default subscriptionsSlice.reducer;