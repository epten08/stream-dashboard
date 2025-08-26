import { CalendarIcon, ClockIcon, CheckCircleIcon, PlayCircleIcon } from '@heroicons/react/24/outline';

const FixturesResults = () => {
  const fixtures = [
    {
      id: 1,
      homeTeam: 'Manchester United',
      awayTeam: 'Arsenal',
      date: '2024-01-15',
      time: '15:00',
      status: 'completed',
      homeScore: 2,
      awayScore: 1,
      league: 'Premier League'
    },
    {
      id: 2,
      homeTeam: 'Chelsea',
      awayTeam: 'Liverpool',
      date: '2024-01-16',
      time: '17:30',
      status: 'live',
      homeScore: 1,
      awayScore: 1,
      league: 'Premier League'
    },
    {
      id: 3,
      homeTeam: 'Arsenal',
      awayTeam: 'Chelsea',
      date: '2024-01-20',
      time: '16:00',
      status: 'scheduled',
      league: 'Premier League'
    },
    {
      id: 4,
      homeTeam: 'Liverpool',
      awayTeam: 'Manchester United',
      date: '2024-01-22',
      time: '14:00',
      status: 'scheduled',
      league: 'Premier League'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'live': return <PlayCircleIcon className="h-5 w-5 text-red-500" />;
      case 'scheduled': return <ClockIcon className="h-5 w-5 text-blue-500" />;
      default: return <CalendarIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'completed': return `${baseClasses} text-green-800 bg-green-100`;
      case 'live': return `${baseClasses} text-red-800 bg-red-100`;
      case 'scheduled': return `${baseClasses} text-blue-800 bg-blue-100`;
      default: return `${baseClasses} text-gray-800 bg-gray-100`;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Fixtures & Results</h1>
        <p className="text-gray-600">View upcoming matches and past results</p>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Match Schedule</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                This Week
              </button>
              <button className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                All Fixtures
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {fixtures.map((fixture) => (
            <div key={fixture.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(fixture.status)}
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900">{fixture.homeTeam}</span>
                      
                      {fixture.status === 'completed' || fixture.status === 'live' ? (
                        <div className="flex items-center space-x-2 text-xl font-bold text-gray-900">
                          <span>{fixture.homeScore}</span>
                          <span className="text-gray-400">-</span>
                          <span>{fixture.awayScore}</span>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-lg">vs</div>
                      )}
                      
                      <span className="font-medium text-gray-900">{fixture.awayTeam}</span>
                    </div>
                    
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>{fixture.league}</span>
                      <span>•</span>
                      <span>{fixture.date} at {fixture.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={getStatusBadge(fixture.status)}>
                    {fixture.status.charAt(0).toUpperCase() + fixture.status.slice(1)}
                  </span>
                  
                  {fixture.status === 'live' && (
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Watch Live
                    </button>
                  )}
                  
                  {fixture.status === 'scheduled' && (
                    <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FixturesResults;