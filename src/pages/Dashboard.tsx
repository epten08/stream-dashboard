import { VideoCameraIcon, UsersIcon, TrophyIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useAppSelector } from '../hooks/redux';

const Dashboard = () => {
  const { user } = useAppSelector(state => state.auth);

  const stats = [
    { name: 'Active Camera Feeds', value: '12', icon: VideoCameraIcon, change: '+2 from yesterday' },
    { name: 'Live Matches', value: '3', icon: TrophyIcon, change: '2 scheduled today' },
    { name: 'Total Users', value: '1,234', icon: UsersIcon, change: '+12% from last month' },
    { name: 'Revenue', value: '$24,500', icon: ChartBarIcon, change: '+8% from last month' },
  ];

  const recentActivity = [
    { id: 1, action: 'New match started', details: 'Manchester United vs Arsenal', time: '5 minutes ago' },
    { id: 2, action: 'Camera feed activated', details: 'Main Stadium - Camera 3', time: '15 minutes ago' },
    { id: 3, action: 'User subscribed', details: 'Premium plan - john@example.com', time: '1 hour ago' },
    { id: 4, action: 'Match result updated', details: 'Chelsea 2-1 Liverpool', time: '2 hours ago' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">Here's what's happening with your streaming platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <VideoCameraIcon className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-blue-700 font-medium">Start New Live Stream</span>
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <TrophyIcon className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-green-700 font-medium">Add New Match</span>
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <UsersIcon className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-purple-700 font-medium">Manage Users</span>
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <ChartBarIcon className="h-5 w-5 text-yellow-600 mr-3" />
                <span className="text-yellow-700 font-medium">View Analytics</span>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View all activity →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;