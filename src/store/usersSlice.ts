import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID, Query } from 'appwrite';
import type { AppUser } from '../types';

interface UsersState {
  users: AppUser[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.USERS,
      [Query.orderDesc('$createdAt')]
    );
    return response.documents as unknown as AppUser[];
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (user: Omit<AppUser, '$id' | '$createdAt' | '$updatedAt'>) => {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      ID.unique(),
      user
    );
    return response as unknown as AppUser;
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, ...updates }: { id: string } & Partial<AppUser>) => {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      id,
      updates
    );
    return response as unknown as AppUser;
  }
);

export const toggleUserStatus = createAsyncThunk(
  'users/toggleUserStatus',
  async ({ id, status }: { id: string; status: 'active' | 'blocked' }) => {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      id,
      { status }
    );
    return response as unknown as AppUser;
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: string) => {
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.USERS, id);
    return id;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.unshift(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.$id === action.payload.$id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.$id === action.payload.$id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.$id !== action.payload);
      });
  },
});

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;