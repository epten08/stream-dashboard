import { useState, useEffect, useMemo } from 'react';
import { 
  UsersIcon, 
  CreditCardIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  EyeIcon,
  PencilIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  BanknotesIcon,
  PhoneIcon,
  CalendarIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchUsers, toggleUserStatus } from '../store/usersSlice';
import { fetchSubscriptions } from '../store/subscriptionsSlice';
import { fetchTransactions, mockEcoCashPayment } from '../store/transactionsSlice';
import { fetchChannels } from '../store/channelsSlice';
import type { AppUser, EcoCashTransaction } from '../types';

const UsersSubscriptions = () => {
  const dispatch = useAppDispatch();
  const { users, loading: usersLoading } = useAppSelector(state => state.users);
  const { subscriptions } = useAppSelector(state => state.subscriptions);
  const { transactions, mockPaymentProcessing } = useAppSelector(state => state.transactions);
  const { channels } = useAppSelector(state => state.channels);
  
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [showTransactions, setShowTransactions] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    phone: '',
    amount: 0,
    gateway: 'ecocash' as 'ecocash' | 'onemoney' | 'telecash'
  });

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchSubscriptions());
    dispatch(fetchTransactions());
    dispatch(fetchChannels());
  }, [dispatch]);

  const subscriptionStats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
    const completedTransactions = transactions.filter(t => t.status === 'completed');
    const monthlyRevenue = completedTransactions
      .filter(t => {
        const date = new Date(t.$createdAt || '');
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      })
      .reduce((sum, t) => sum + t.amount, 0);
    const expiredCancelled = subscriptions.filter(s => ['expired', 'cancelled'].includes(s.status)).length;

    return [
      { name: 'Total Users', value: totalUsers.toString(), icon: UsersIcon, color: 'text-blue-600' },
      { name: 'Active Users', value: activeUsers.toString(), icon: CheckCircleIcon, color: 'text-green-600' },
      { name: 'Monthly Revenue', value: `$${monthlyRevenue.toFixed(2)}`, icon: CreditCardIcon, color: 'text-purple-600' },
      { name: 'Expired/Cancelled', value: expiredCancelled.toString(), icon: XCircleIcon, color: 'text-red-600' }
    ];
  }, [users, subscriptions, transactions]);

  const filteredUsers = useMemo(() => {
    if (statusFilter === 'all') return users;
    return users.filter(user => user.status === statusFilter);
  }, [users, statusFilter]);

  const getUserSubscription = (userId: string) => {
    return subscriptions.find(sub => sub.userId === userId);
  };

  const getUserTransactions = (userId: string) => {
    return transactions.filter(txn => txn.userId === userId).slice(0, 5);
  };

  const getChannelNames = (channelIds: string[]) => {
    return channels
      .filter(channel => channelIds.includes(channel.$id || ''))
      .map(channel => channel.name)
      .join(', ') || 'No channels';
  };

  const handleToggleUserStatus = async (user: AppUser) => {
    const newStatus = user.status === 'active' ? 'blocked' : 'active';
    if (user.$id) {
      await dispatch(toggleUserStatus({ id: user.$id, status: newStatus }));
    }
  };

  const handleMockPayment = async () => {
    if (!selectedUser || !selectedUser.$id) return;
    
    const userSub = getUserSubscription(selectedUser.$id);
    if (!userSub || !userSub.$id) return;

    await dispatch(mockEcoCashPayment({
      userId: selectedUser.$id,
      subscriptionId: userSub.$id,
      amount: paymentData.amount,
      currency: 'USD',
      phone: paymentData.phone,
      gateway: paymentData.gateway,
      description: `Payment for ${userSub.planType} subscription`
    }));
    
    setShowPaymentModal(false);
    setPaymentData({ phone: '', amount: 0, gateway: 'ecocash' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'blocked': return <ShieldExclamationIcon className="h-5 w-5 text-red-500" />;
      case 'pending': return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'expired': return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default: return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTransactionStatusIcon = (status: EcoCashTransaction['status']) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircleIcon className="h-4 w-4 text-red-500" />;
      case 'pending': return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      case 'cancelled': return <XCircleIcon className="h-4 w-4 text-gray-500" />;
      default: return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'active': return `${baseClasses} text-green-800 bg-green-100`;
      case 'blocked': return `${baseClasses} text-red-800 bg-red-100`;
      case 'pending': return `${baseClasses} text-yellow-800 bg-yellow-100`;
      case 'expired': return `${baseClasses} text-red-800 bg-red-100`;
      default: return `${baseClasses} text-gray-800 bg-gray-100`;
    }
  };

  const getTransactionBadge = (status: EcoCashTransaction['status']) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'completed': return `${baseClasses} text-green-800 bg-green-100`;
      case 'failed': return `${baseClasses} text-red-800 bg-red-100`;
      case 'pending': return `${baseClasses} text-yellow-800 bg-yellow-100`;
      case 'cancelled': return `${baseClasses} text-gray-800 bg-gray-100`;
      default: return `${baseClasses} text-gray-800 bg-gray-100`;
    }
  };

  const getSubscriptionBadge = (planType: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (planType) {
      case 'premium': return `${baseClasses} text-purple-800 bg-purple-100`;
      case 'basic': return `${baseClasses} text-blue-800 bg-blue-100`;
      case 'free': return `${baseClasses} text-gray-800 bg-gray-100`;
      default: return `${baseClasses} text-gray-800 bg-gray-100`;
    }
  };

  if (usersLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Users</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <button 
                onClick={() => setShowTransactions(!showTransactions)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                {showTransactions ? 'Hide' : 'Show'} Transactions
              </button>
              <button 
                onClick={() => dispatch(fetchUsers())}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="Refresh"
              >
                <ArrowPathIcon className="h-4 w-4" />
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
                  Channels
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const userSubscription = getUserSubscription(user.$id || '');
                  return (
                    <tr key={user.$id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            {user.phone && (
                              <div className="text-xs text-gray-400 flex items-center mt-1">
                                <PhoneIcon className="h-3 w-3 mr-1" />
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {userSubscription ? (
                          <div className="space-y-1">
                            <span className={getSubscriptionBadge(userSubscription.planType)}>
                              {userSubscription.planType.charAt(0).toUpperCase() + userSubscription.planType.slice(1)}
                            </span>
                            <div className="text-xs text-gray-500">
                              ${userSubscription.price}/{userSubscription.currency}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No subscription</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-32 truncate" title={getChannelNames(userSubscription?.channels || [])}>
                          {getChannelNames(userSubscription?.channels || [])}
                        </div>
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
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                          {user.$createdAt ? new Date(user.$createdAt).toLocaleDateString() : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setSelectedUser(user)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => setShowPaymentModal(true)}
                            className="text-green-600 hover:text-green-900"
                            title="Mock Payment"
                          >
                            <BanknotesIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleToggleUserStatus(user)}
                            className={user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                            title={user.status === 'active' ? 'Block User' : 'Unblock User'}
                          >
                            {user.status === 'active' ? (
                              <ShieldExclamationIcon className="h-4 w-4" />
                            ) : (
                              <ShieldCheckIcon className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No users found matching the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction History */}
      {showTransactions && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gateway
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.slice(0, 10).map((transaction) => {
                  const user = users.find(u => u.$id === transaction.userId);
                  return (
                    <tr key={transaction.$id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {transaction.reference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user?.name || 'Unknown User'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${transaction.amount.toFixed(2)} {transaction.currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-blue-800 bg-blue-100">
                          {transaction.gateway.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getTransactionStatusIcon(transaction.status)}
                          <span className={`ml-2 ${getTransactionBadge(transaction.status)}`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.$createdAt ? new Date(transaction.$createdAt).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">User Details</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">User Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Name:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedUser.name}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Email:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedUser.email}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Phone:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedUser.phone || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status:</span>
                      <span className={`ml-2 ${getStatusBadge(selectedUser.status)}`}>
                        {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">Recent Transactions</h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {getUserTransactions(selectedUser.$id || '').map((txn) => (
                      <div key={txn.$id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{txn.reference}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-900">${txn.amount.toFixed(2)}</span>
                          <span className={getTransactionBadge(txn.status)}>
                            {txn.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {getUserTransactions(selectedUser.$id || '').length === 0 && (
                      <p className="text-sm text-gray-500">No transactions found</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mock Payment Modal */}
      {showPaymentModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Mock EcoCash Payment</h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    value={paymentData.phone}
                    onChange={(e) => setPaymentData({ ...paymentData, phone: e.target.value })}
                    placeholder="+263771234567"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount (USD)</label>
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) || 0 })}
                    placeholder="10.00"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gateway</label>
                  <select
                    value={paymentData.gateway}
                    onChange={(e) => setPaymentData({ ...paymentData, gateway: e.target.value as any })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ecocash">EcoCash</option>
                    <option value="onemoney">OneMoney</option>
                    <option value="telecash">TeleCash</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMockPayment}
                  disabled={mockPaymentProcessing || !paymentData.phone || !paymentData.amount}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mockPaymentProcessing ? 'Processing...' : 'Process Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersSubscriptions;