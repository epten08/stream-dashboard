import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID, Query } from 'appwrite';
import type { Channel } from '../types';

interface ChannelsState {
  channels: Channel[];
  loading: boolean;
  error: string | null;
}

const initialState: ChannelsState = {
  channels: [],
  loading: false,
  error: null,
};

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async () => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CHANNELS,
      [Query.orderAsc('name')]
    );
    return response.documents as unknown as Channel[];
  }
);

export const createChannel = createAsyncThunk(
  'channels/createChannel',
  async (channel: Omit<Channel, '$id' | '$createdAt' | '$updatedAt'>) => {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.CHANNELS,
      ID.unique(),
      channel
    );
    return response as unknown as Channel;
  }
);

export const updateChannel = createAsyncThunk(
  'channels/updateChannel',
  async ({ id, ...updates }: { id: string } & Partial<Channel>) => {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.CHANNELS,
      id,
      updates
    );
    return response as unknown as Channel;
  }
);

export const deleteChannel = createAsyncThunk(
  'channels/deleteChannel',
  async (id: string) => {
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.CHANNELS, id);
    return id;
  }
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch channels';
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.channels.push(action.payload);
      })
      .addCase(updateChannel.fulfilled, (state, action) => {
        const index = state.channels.findIndex(channel => channel.$id === action.payload.$id);
        if (index !== -1) {
          state.channels[index] = action.payload;
        }
      })
      .addCase(deleteChannel.fulfilled, (state, action) => {
        state.channels = state.channels.filter(channel => channel.$id !== action.payload);
      });
  },
});

export const { clearError } = channelsSlice.actions;
export default channelsSlice.reducer;