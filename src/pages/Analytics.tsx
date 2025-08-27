import { useEffect, useState } from 'react';
import {
  ChartBarIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  ChatBubbleLeftRightIcon,
  TrophyIcon,
  UsersIcon,
  PlayIcon,
  ArrowPathIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { generateAnalytics } from '../store/analyticsSlice';

const Analytics = () => {
  const dispatch = useAppDispatch();
  const {
    channelViewers,
    subscriptionGrowth,
    matchPopularity,
    teamPopularity,
    channelEngagement,
    analyticsOverview,
    loading,
    error
  } = useAppSelector(state => state.analytics);

  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'viewers' | 'subscriptions' | 'engagement'>('viewers');

  useEffect(() => {
    dispatch(generateAnalytics());
  }, [dispatch]);

  const refreshAnalytics = () => {
    dispatch(generateAnalytics());
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const analyticsCards = [
    {
      title: 'Total Live Viewers',
      value: formatNumber(analyticsOverview.totalViewers),
      icon: EyeIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12.3%'
    },
    {
      title: 'Active Subscriptions',
      value: formatNumber(analyticsOverview.totalSubscriptions),
      icon: UsersIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8.7%'
    },
    {
      title: 'Total Comments',
      value: formatNumber(analyticsOverview.totalComments),
      icon: ChatBubbleLeftRightIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+23.1%'
    },
    {
      title: 'Avg. Watch Time',
      value: formatDuration(analyticsOverview.averageViewTime),
      icon: ClockIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+5.2%'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading analytics</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={refreshAnalytics}
                className="bg-red-100 px-3 py-2 text-sm font-medium text-red-800 rounded-md hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Real-time insights into your streaming platform performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as '7d' | '30d' | '90d')}
              className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button
              onClick={refreshAnalytics}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Refresh Analytics"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {analyticsCards.map((card) => (
          <div key={card.title} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">{card.change}</span>
              <span className="text-sm text-gray-500 ml-1">from last period</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Live Viewers by Channel */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Live Viewers by Channel</h2>
            <EyeIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {channelViewers.length > 0 ? (
              channelViewers.slice(0, 6).map((channel) => (
                <div key={channel.channelId} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{channel.channelName}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <PlayIcon className="h-3 w-3 mr-1" />
                      {formatNumber(channel.totalViews)} total views
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{channel.currentViewers}</p>
                    <p className="text-xs text-gray-500">live now</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No viewer data available</p>
            )}
          </div>
        </div>

        {/* Subscription Growth */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Subscription Growth</h2>
            <ArrowTrendingUpIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {subscriptionGrowth.length > 0 ? (
              <div className="space-y-3">
                {['premium', 'basic', 'free'].map((type) => {
                  const latestData = subscriptionGrowth[subscriptionGrowth.length - 1];
                  const count = type === 'premium' ? latestData?.premiumSubscriptions : 
                               type === 'basic' ? latestData?.basicSubscriptions : 
                               latestData?.freeSubscriptions;
                  const color = type === 'premium' ? 'text-purple-600' : 
                               type === 'basic' ? 'text-blue-600' : 'text-gray-600';
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          type === 'premium' ? 'bg-purple-600' : 
                          type === 'basic' ? 'bg-blue-600' : 'bg-gray-400'
                        } mr-3`}></div>
                        <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
                      </div>
                      <span className={`text-sm font-semibold ${color}`}>{count || 0}</span>
                    </div>
                  );
                })}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Total</span>
                    <span className="text-sm font-bold text-gray-900">
                      {subscriptionGrowth[subscriptionGrowth.length - 1]?.totalSubscriptions || 0}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No subscription data available</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Watched Matches */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Most Watched Matches</h2>
            <TrophyIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {matchPopularity.length > 0 ? (
              matchPopularity.slice(0, 5).map((match, index) => (
                <div key={match.$id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-semibold text-gray-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {match.homeTeam} vs {match.awayTeam}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {new Date(match.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatNumber(match.totalViewers)}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <ChatBubbleLeftRightIcon className="h-3 w-3 mr-1" />
                      {formatNumber(match.totalComments)} comments
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No match data available</p>
            )}
          </div>
        </div>

        {/* Team Popularity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Popular Teams</h2>
            <ChartBarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {teamPopularity.length > 0 ? (
              teamPopularity
                .sort((a, b) => b.totalViewers - a.totalViewers)
                .slice(0, 5)
                .map((team, index) => (
                  <div key={team.teamId} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{team.teamName}</p>
                        <p className="text-xs text-gray-500">{team.totalMatches} matches</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatNumber(team.averageViewersPerMatch)} avg
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatNumber(team.totalViewers)} total
                      </p>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No team data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Channel Engagement */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Channel Engagement</h2>
          <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Channel</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Comments</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Active Users</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Avg/Hour</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Engagement Rate</th>
              </tr>
            </thead>
            <tbody>
              {channelEngagement.length > 0 ? (
                channelEngagement.map((channel) => (
                  <tr key={channel.channelId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-gray-900">{channel.channelName}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-900">{formatNumber(channel.totalComments)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-900">{formatNumber(channel.activeCommenters)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-900">{channel.averageCommentsPerHour.toFixed(1)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-900">{channel.engagementRate.toFixed(1)}%</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No engagement data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;