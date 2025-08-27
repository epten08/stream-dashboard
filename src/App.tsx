import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import CameraFeeds from './pages/CameraFeeds';
import Leagues from './pages/Leagues';
import Teams from './pages/Teams';
import Fixtures from './pages/Fixtures';
import Results from './pages/Results';
import LeaguesTeams from './pages/LeaguesTeams';
import FixturesResults from './pages/FixturesResults';
import Standings from './pages/Standings';
import UsersSubscriptions from './pages/UsersSubscriptions';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="camera-feeds" element={<CameraFeeds />} />
            <Route path="leagues" element={<Leagues />} />
            <Route path="teams" element={<Teams />} />
            <Route path="fixtures" element={<Fixtures />} />
            <Route path="results" element={<Results />} />
            <Route path="leagues-teams" element={<LeaguesTeams />} />
            <Route path="fixtures-results" element={<FixturesResults />} />
            <Route path="standings" element={<Standings />} />
            <Route path="users-subscriptions" element={<UsersSubscriptions />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
