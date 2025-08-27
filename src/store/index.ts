import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import leaguesReducer from './leaguesSlice';
import teamsReducer from './teamsSlice';
import fixturesReducer from './fixturesSlice';
import resultsReducer from './resultsSlice';
import standingsReducer from './standingsSlice';
import usersReducer from './usersSlice';
import subscriptionsReducer from './subscriptionsSlice';
import transactionsReducer from './transactionsSlice';
import channelsReducer from './channelsSlice';
import analyticsReducer from './analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leagues: leaguesReducer,
    teams: teamsReducer,
    fixtures: fixturesReducer,
    results: resultsReducer,
    standings: standingsReducer,
    users: usersReducer,
    subscriptions: subscriptionsReducer,
    transactions: transactionsReducer,
    channels: channelsReducer,
    analytics: analyticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;