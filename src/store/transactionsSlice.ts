import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID, Query } from 'appwrite';
import type { EcoCashTransaction } from '../types';

interface TransactionsState {
  transactions: EcoCashTransaction[];
  loading: boolean;
  error: string | null;
  mockPaymentProcessing: boolean;
}

const initialState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,
  mockPaymentProcessing: false,
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (userId?: string) => {
    const queries = [Query.orderDesc('$createdAt')];
    if (userId) {
      queries.push(Query.equal('userId', userId));
    }
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.TRANSACTIONS,
      queries
    );
    return response.documents as unknown as EcoCashTransaction[];
  }
);

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (transaction: Omit<EcoCashTransaction, '$id' | '$createdAt' | '$updatedAt'>) => {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.TRANSACTIONS,
      ID.unique(),
      transaction
    );
    return response as unknown as EcoCashTransaction;
  }
);

const generateTransactionId = () => {
  return `TXN${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
};

const generateReference = () => {
  return `REF${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
};

export const mockEcoCashPayment = createAsyncThunk(
  'transactions/mockEcoCashPayment',
  async (paymentData: {
    userId: string;
    subscriptionId: string;
    amount: number;
    currency: 'USD' | 'ZWL';
    phone: string;
    gateway: 'ecocash' | 'onemoney' | 'telecash';
    description: string;
  }) => {
    const transaction: Omit<EcoCashTransaction, '$id' | '$createdAt' | '$updatedAt'> = {
      ...paymentData,
      reference: generateReference(),
      status: 'pending',
      transactionId: generateTransactionId(),
    };

    const createdTransaction = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.TRANSACTIONS,
      ID.unique(),
      transaction
    );

    await new Promise(resolve => setTimeout(resolve, 2000));

    const shouldSucceed = Math.random() > 0.15;
    const finalStatus = shouldSucceed ? 'completed' : 'failed';

    const updatedTransaction = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.TRANSACTIONS,
      createdTransaction.$id,
      { status: finalStatus }
    );

    return updatedTransaction as unknown as EcoCashTransaction;
  }
);

export const updateTransactionStatus = createAsyncThunk(
  'transactions/updateTransactionStatus',
  async ({ id, status }: { id: string; status: EcoCashTransaction['status'] }) => {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.TRANSACTIONS,
      id,
      { status }
    );
    return response as unknown as EcoCashTransaction;
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
      })
      .addCase(mockEcoCashPayment.pending, (state) => {
        state.mockPaymentProcessing = true;
        state.error = null;
      })
      .addCase(mockEcoCashPayment.fulfilled, (state, action) => {
        state.mockPaymentProcessing = false;
        const index = state.transactions.findIndex(txn => txn.$id === action.payload.$id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        } else {
          state.transactions.unshift(action.payload);
        }
      })
      .addCase(mockEcoCashPayment.rejected, (state, action) => {
        state.mockPaymentProcessing = false;
        state.error = action.error.message || 'Payment failed';
      })
      .addCase(updateTransactionStatus.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(txn => txn.$id === action.payload.$id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      });
  },
});

export const { clearError } = transactionsSlice.actions;
export default transactionsSlice.reducer;