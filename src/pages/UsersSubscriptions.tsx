import { UsersIcon, CreditCardIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const UsersSubscriptions = () => {
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      subscription: 'Premium',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2024-01-16'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      subscription: 'Basic',
      status: 'active',
      joinDate: '2024-01-10',
      lastActive: '2024-01-16'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      subscription: 'Premium',
      status: 'expired',
      joinDate: '2023-12-01',
      lastActive: '2024-01-14'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      subscription: 'Basic',
      status: 'pending',
      joinDate: '2024-01-16',
      lastActive: '2024-01-16'
    }
  ];

  const subscriptionStats = [
    { name: 'Total Users', value: '1,234', icon: UsersIcon, color: 'text-blue-600' },
    { name: 'Active Subscriptions', value: '987', icon: CheckCircleIcon, color: 'text-green-600' },
    { name: 'Revenue This Month', value: '$12,450', icon: CreditCardIcon, color: 'text-purple-600' },
    { name: 'Expired/Cancelled', value: '45', icon: XCircleIcon, color: 'text-red-600' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'expired': return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'pending': return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default: return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'active': return `${baseClasses} text-green-800 bg-green-100`;
      case 'expired': return `${baseClasses} text-red-800 bg-red-100`;
      case 'pending': return `${baseClasses} text-yellow-800 bg-yellow-100`;
      default: return `${baseClasses} text-gray-800 bg-gray-100`;
    }
  };

  const getSubscriptionBadge = (subscription: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (subscription) {
      case 'Premium': return `${baseClasses} text-purple-800 bg-purple-100`;
      case 'Basic': return `${baseClasses} text-blue-800 bg-blue-100`;
      default: return `${baseClasses} text-gray-800 bg-gray-100`;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users & Subscriptions</h1>
        <p className="text-gray-600">Manage user accounts and subscription plans</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {subscriptionStats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-lg bg-gray-100`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                Export
              </button>
              <button className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Add User
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 relative">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getSubscriptionBadge(user.subscription)}>
                      {user.subscription}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(user.status)}
                      <span className={`ml-2 ${getStatusBadge(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Edit
                      </button>
                      {user.status === 'active' && (
                        <button className="text-red-600 hover:text-red-900">
                          Suspend
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersSubscriptions;