import { NavLink } from 'react-router-dom';
import {
  VideoCameraIcon,
  TrophyIcon,
  ChartBarIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
  DocumentTextIcon,
  UserGroupIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logoutUser } from '../../store/authSlice';

const navigation = [
  { name: 'Camera Feeds', href: '/dashboard/camera-feeds', icon: VideoCameraIcon },
  { name: 'Leagues', href: '/dashboard/leagues', icon: TrophyIcon },
  { name: 'Teams', href: '/dashboard/teams', icon: UserGroupIcon },
  { name: 'Fixtures', href: '/dashboard/fixtures', icon: MapPinIcon },
  { name: 'Results', href: '/dashboard/results', icon: DocumentTextIcon },
  { name: 'Standings', href: '/dashboard/standings', icon: ChartBarIcon },
  { name: 'Users & Subscriptions', href: '/dashboard/users-subscriptions', icon: UsersIcon },
];

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="flex flex-col w-64 bg-gray-800">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <h1 className="text-white text-xl font-bold">Stream Dashboard</h1>
      </div>
      
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <item.icon className="mr-3 h-6 w-6" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        <div className="flex-shrink-0 p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-white text-sm">
              <div className="font-medium">{user?.name}</div>
              <div className="text-gray-300 text-xs">{user?.email}</div>
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;