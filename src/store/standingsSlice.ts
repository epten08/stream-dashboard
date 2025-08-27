import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { Query } from 'appwrite';
import type { Result, Team, League } from '../types';
import type { RootState } from './index';

export interface StandingsEntry {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  position: number;
}

interface StandingsState {
  standings: Record<string, StandingsEntry[]>;
  loading: boolean;
  error: string | null;
  selectedLeagueId: string | null;
}

const initialState: StandingsState = {
  standings: {},
  loading: false,
  error: null,
  selectedLeagueId: null,
};

export const fetchStandings = createAsyncThunk(
  'standings/fetchStandings',
  async (leagueId?: string) => {
    const queries = [Query.orderDesc('$createdAt')];
    if (leagueId) {
      queries.push(Query.equal('fixture.leagueId', leagueId));
    }
    
    const [resultsResponse, teamsResponse] = await Promise.all([
      databases.listDocuments(DATABASE_ID, COLLECTIONS.RESULTS, queries),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.TEAMS, [Query.orderAsc('name')])
    ]);

    const results = resultsResponse.documents as unknown as Result[];
    const teams = teamsResponse.documents as unknown as Team[];
    
    return { results, teams, leagueId };
  }
);

const calculateStandings = (results: Result[], teams: Team[]): Record<string, StandingsEntry[]> => {
  const standingsByLeague: Record<string, Record<string, StandingsEntry>> = {};

  results.forEach(result => {
    if (!result.fixture?.leagueId || result.status !== 'full_time') return;

    const leagueId = result.fixture.leagueId;
    const homeTeamId = result.fixture.homeTeamId;
    const awayTeamId = result.fixture.awayTeamId;

    if (!standingsByLeague[leagueId]) {
      standingsByLeague[leagueId] = {};
    }

    const league = standingsByLeague[leagueId];

    [homeTeamId, awayTeamId].forEach(teamId => {
      if (!league[teamId]) {
        const team = teams.find(t => t.$id === teamId);
        league[teamId] = {
          teamId,
          teamName: team?.name || 'Unknown Team',
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
          position: 0,
        };
      }
    });

    const homeEntry = league[homeTeamId];
    const awayEntry = league[awayTeamId];

    homeEntry.played++;
    awayEntry.played++;
    homeEntry.goalsFor += result.homeGoals;
    homeEntry.goalsAgainst += result.awayGoals;
    awayEntry.goalsFor += result.awayGoals;
    awayEntry.goalsAgainst += result.homeGoals;

    if (result.homeGoals > result.awayGoals) {
      homeEntry.won++;
      homeEntry.points += 3;
      awayEntry.lost++;
    } else if (result.homeGoals < result.awayGoals) {
      awayEntry.won++;
      awayEntry.points += 3;
      homeEntry.lost++;
    } else {
      homeEntry.drawn++;
      awayEntry.drawn++;
      homeEntry.points++;
      awayEntry.points++;
    }

    homeEntry.goalDifference = homeEntry.goalsFor - homeEntry.goalsAgainst;
    awayEntry.goalDifference = awayEntry.goalsFor - awayEntry.goalsAgainst;
  });

  const finalStandings: Record<string, StandingsEntry[]> = {};

  Object.entries(standingsByLeague).forEach(([leagueId, leagueStandings]) => {
    const sortedStandings = Object.values(leagueStandings).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.teamName.localeCompare(b.teamName);
    });

    sortedStandings.forEach((entry, index) => {
      entry.position = index + 1;
    });

    finalStandings[leagueId] = sortedStandings;
  });

  return finalStandings;
};

const standingsSlice = createSlice({
  name: 'standings',
  initialState,
  reducers: {
    setSelectedLeague: (state, action) => {
      state.selectedLeagueId = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStandings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStandings.fulfilled, (state, action) => {
        state.loading = false;
        const { results, teams } = action.payload;
        state.standings = calculateStandings(results, teams);
      })
      .addCase(fetchStandings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch standings';
      });
  },
});

export const selectStandingsByLeague = createSelector(
  [(state: RootState) => state.standings.standings, (state: RootState, leagueId: string) => leagueId],
  (standings, leagueId) => standings[leagueId] || []
);

export const selectCurrentStandings = createSelector(
  [(state: RootState) => state.standings.standings, (state: RootState) => state.standings.selectedLeagueId],
  (standings, selectedLeagueId) => {
    if (!selectedLeagueId) {
      const allStandings = Object.values(standings).flat();
      return allStandings;
    }
    return standings[selectedLeagueId] || [];
  }
);

export const { setSelectedLeague, clearError } = standingsSlice.actions;
export default standingsSlice.reducer;