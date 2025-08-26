import { VideoCameraIcon, SignalIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const CameraFeeds = () => {
  const feeds = [
    { id: 1, name: 'Main Stadium', status: 'live', viewers: 1245 },
    { id: 2, name: 'Practice Field A', status: 'live', viewers: 324 },
    { id: 3, name: 'Practice Field B', status: 'offline', viewers: 0 },
    { id: 4, name: 'Locker Room', status: 'maintenance', viewers: 0 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-green-600 bg-green-100';
      case 'offline': return 'text-red-600 bg-red-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <SignalIcon className="h-4 w-4" />;
      case 'offline': return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'maintenance': return <ExclamationTriangleIcon className="h-4 w-4" />;
      default: return <VideoCameraIcon className="h-4 w-4" />;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Camera Feeds</h1>
        <p className="text-gray-600">Monitor and manage live camera feeds</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feeds.map((feed) => (
          <div key={feed.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{feed.name}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(feed.status)}`}>
                {getStatusIcon(feed.status)}
                <span className="ml-1 capitalize">{feed.status}</span>
              </span>
            </div>
            
            <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
              {feed.status === 'live' ? (
                <div className="text-center">
                  <SignalIcon className="h-12 w-12 text-green-400 mx-auto mb-2" />
                  <p className="text-green-400 font-medium">Live Feed</p>
                </div>
              ) : (
                <div className="text-center">
                  <VideoCameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">Camera {feed.status}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Viewers: {feed.viewers}</span>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CameraFeeds;