import { ChartBarIcon, TrophyIcon } from '@heroicons/react/24/outline';

const Standings = () => {
  const standings = [
    { position: 1, team: 'Manchester United', played: 20, won: 15, drawn: 3, lost: 2, gf: 45, ga: 18, gd: 27, points: 48 },
    { position: 2, team: 'Arsenal', played: 20, won: 14, drawn: 4, lost: 2, gf: 42, ga: 20, gd: 22, points: 46 },
    { position: 3, team: 'Liverpool', played: 20, won: 13, drawn: 5, lost: 2, gf: 40, ga: 19, gd: 21, points: 44 },
    { position: 4, team: 'Chelsea', played: 20, won: 12, drawn: 4, lost: 4, gf: 38, ga: 22, gd: 16, points: 40 },
    { position: 5, team: 'Newcastle', played: 20, won: 10, drawn: 6, lost: 4, gf: 32, ga: 24, gd: 8, points: 36 },
    { position: 6, team: 'Tottenham', played: 20, won: 9, drawn: 7, lost: 4, gf: 35, ga: 28, gd: 7, points: 34 },
    { position: 7, team: 'Brighton', played: 20, won: 8, drawn: 5, lost: 7, gf: 30, ga: 31, gd: -1, points: 29 },
    { position: 8, team: 'West Ham', played: 20, won: 6, drawn: 8, lost: 6, gf: 28, ga: 30, gd: -2, points: 26 },
  ];

  const getPositionColor = (position: number) => {
    if (position <= 4) return 'bg-green-100 text-green-800';
    if (position <= 6) return 'bg-blue-100 text-blue-800';
    if (position >= standings.length - 2) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Standings</h1>
        <p className="text-gray-600">League tables and team rankings</p>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrophyIcon className="h-6 w-6 text-yellow-500" />
              <h2 className="text-lg font-semibold text-gray-900">Premier League 2024-25</h2>
            </div>
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">Matchday 20</span>
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
              {standings.map((team) => (
                <tr key={team.position} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${getPositionColor(team.position)}`}>
                      {team.position}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{team.team}</div>
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
                    {team.gf}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    {team.ga}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <span className={team.gd >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {team.gd >= 0 ? '+' : ''}{team.gd}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-900">
                    {team.points}
                  </td>
                </tr>
              ))}
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