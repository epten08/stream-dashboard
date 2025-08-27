import { useEffect, useMemo } from 'react';
import { ChartBarIcon, TrophyIcon, FunnelIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchStandings, setSelectedLeague, selectCurrentStandings } from '../store/standingsSlice';
import { fetchLeagues } from '../store/leaguesSlice';
import { useStandingsAutoUpdate } from '../hooks/useStandingsAutoUpdate';

const Standings = () => {
  const dispatch = useAppDispatch();
  const { standings, loading, error, selectedLeagueId } = useAppSelector(state => state.standings);
  const { leagues } = useAppSelector(state => state.leagues);
  const currentStandings = useAppSelector(selectCurrentStandings);
  const { refreshStandings } = useStandingsAutoUpdate();

  useEffect(() => {
    dispatch(fetchLeagues());
    dispatch(fetchStandings());
  }, [dispatch]);

  useEffect(() => {
    if (selectedLeagueId) {
      dispatch(fetchStandings(selectedLeagueId));
    }
  }, [dispatch, selectedLeagueId]);

  const selectedLeague = useMemo(() => {
    return leagues.find(league => league.$id === selectedLeagueId);
  }, [leagues, selectedLeagueId]);

  const handleLeagueChange = (leagueId: string) => {
    dispatch(setSelectedLeague(leagueId === 'all' ? null : leagueId));
  };

  const getMatchdayInfo = () => {
    if (currentStandings.length === 0) return 'No matches played';
    const maxPlayed = Math.max(...currentStandings.map(team => team.played));
    return `Matchday ${maxPlayed}`;
  };

  const getPositionColor = (position: number) => {
    if (position <= 4) return 'bg-green-100 text-green-800';
    if (position <= 6) return 'bg-blue-100 text-blue-800';
    if (position >= currentStandings.length - 2) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading standings</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Standings</h1>
        <p className="text-gray-600">League tables and team rankings</p>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <TrophyIcon className="h-6 w-6 text-yellow-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedLeague ? selectedLeague.name : 'All Leagues'} Standings
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-4 w-4 text-gray-400" />
                <select
                  value={selectedLeagueId || 'all'}
                  onChange={(e) => handleLeagueChange(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Leagues</option>
                  {leagues.map(league => (
                    <option key={league.$id} value={league.$id}>
                      {league.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={refreshStandings}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Refresh standings"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                </button>
                <ChartBarIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">{getMatchdayInfo()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  P
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  W
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  D
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  L
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GF
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GA
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GD
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pts
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentStandings.length > 0 ? (
                currentStandings.map((team) => (
                  <tr key={team.teamId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${getPositionColor(team.position)}`}>
                        {team.position}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{team.teamName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {team.played}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-green-600 font-medium">
                      {team.won}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-yellow-600 font-medium">
                      {team.drawn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-red-600 font-medium">
                      {team.lost}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {team.goalsFor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {team.goalsAgainst}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <span className={team.goalDifference >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {team.goalDifference >= 0 ? '+' : ''}{team.goalDifference}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-900">
                      {team.points}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                    No standings data available. Results are needed to generate standings.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span className="text-gray-600">Champions League</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
              <span className="text-gray-600">Europa League</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span className="text-gray-600">Relegation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Standings;