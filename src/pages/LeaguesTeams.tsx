import { TrophyIcon, UsersIcon, PlusIcon } from '@heroicons/react/24/outline';

const LeaguesTeams = () => {
  const leagues = [
    {
      id: 1,
      name: 'Premier League',
      teams: 8,
      season: '2024-25',
      status: 'active'
    },
    {
      id: 2,
      name: 'Championship',
      teams: 12,
      season: '2024-25',
      status: 'active'
    },
    {
      id: 3,
      name: 'Youth League',
      teams: 6,
      season: '2024-25',
      status: 'upcoming'
    }
  ];

  const teams = [
    { id: 1, name: 'Manchester United', league: 'Premier League', players: 25, coach: 'Erik ten Hag' },
    { id: 2, name: 'Arsenal', league: 'Premier League', players: 23, coach: 'Mikel Arteta' },
    { id: 3, name: 'Chelsea', league: 'Premier League', players: 24, coach: 'Mauricio Pochettino' },
    { id: 4, name: 'Liverpool', league: 'Premier League', players: 26, coach: 'Jürgen Klopp' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leagues & Teams</h1>
        <p className="text-gray-600">Manage leagues, teams, and player rosters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leagues Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Leagues</h2>
            <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add League
            </button>
          </div>
          
          <div className="space-y-4">
            {leagues.map((league) => (
              <div key={league.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <TrophyIcon className="h-6 w-6 text-yellow-500 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">{league.name}</h3>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    league.status === 'active' ? 'text-green-800 bg-green-100' : 'text-blue-800 bg-blue-100'
                  }`}>
                    {league.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Teams:</span> {league.teams}
                  </div>
                  <div>
                    <span className="font-medium">Season:</span> {league.season}
                  </div>
                </div>
                
                <div className="mt-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Manage League
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teams Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Teams</h2>
            <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Team
            </button>
          </div>
          
          <div className="space-y-4">
            {teams.map((team) => (
              <div key={team.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                  <UsersIcon className="h-6 w-6 text-gray-400" />
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">League:</span> {team.league}
                  </div>
                  <div>
                    <span className="font-medium">Players:</span> {team.players}
                  </div>
                  <div>
                    <span className="font-medium">Coach:</span> {team.coach}
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Roster
                  </button>
                  <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                    Edit Team
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaguesTeams;