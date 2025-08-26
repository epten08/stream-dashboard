import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ClockIcon, 
  MapPinIcon, 
  TrophyIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import type { RootState, AppDispatch } from '../store';
import { fetchFixtures, createFixture, updateFixture, deleteFixture } from '../store/fixturesSlice';
import { fetchLeagues } from '../store/leaguesSlice';
import { fetchTeams } from '../store/teamsSlice';
import type { Fixture } from '../types';

const Fixtures = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { fixtures, loading, error } = useSelector((state: RootState) => state.fixtures);
  const { leagues } = useSelector((state: RootState) => state.leagues);
  const { teams } = useSelector((state: RootState) => state.teams);
  
  const [showModal, setShowModal] = useState(false);
  const [editingFixture, setEditingFixture] = useState<Fixture | null>(null);
  const [formData, setFormData] = useState({
    homeTeamId: '',
    awayTeamId: '',
    date: '',
    venue: '',
    leagueId: '',
    status: 'scheduled' as 'scheduled' | 'live' | 'finished' | 'postponed'
  });
  const [selectedLeague, setSelectedLeague] = useState('');

  useEffect(() => {
    dispatch(fetchLeagues());
    dispatch(fetchTeams());
    dispatch(fetchFixtures());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.homeTeamId === formData.awayTeamId) {
      alert('Home and away teams cannot be the same');
      return;
    }
    
    try {
      if (editingFixture) {
        await dispatch(updateFixture({
          id: editingFixture.$id!,
          ...formData
        })).unwrap();
      } else {
        await dispatch(createFixture(formData)).unwrap();
      }
      resetForm();
    } catch (error) {
      console.error('Error saving fixture:', error);
    }
  };

  const handleEdit = (fixture: Fixture) => {
    setEditingFixture(fixture);
    setFormData({
      homeTeamId: fixture.homeTeamId,
      awayTeamId: fixture.awayTeamId,
      date: fixture.date,
      venue: fixture.venue,
      leagueId: fixture.leagueId,
      status: fixture.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this fixture?')) {
      try {
        await dispatch(deleteFixture(id)).unwrap();
      } catch (error) {
        console.error('Error deleting fixture:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      homeTeamId: '',
      awayTeamId: '',
      date: '',
      venue: '',
      leagueId: '',
      status: 'scheduled'
    });
    setEditingFixture(null);
    setShowModal(false);
  };

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.$id === teamId);
    return team ? team.name : 'Unknown Team';
  };

  const getLeagueName = (leagueId: string) => {
    const league = leagues.find(l => l.$id === leagueId);
    return league ? league.name : 'Unknown League';
  };

  const getLeagueTeams = (leagueId: string) => {
    return teams.filter(team => team.leagueId === leagueId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'live': return 'text-green-600 bg-green-100';
      case 'finished': return 'text-gray-600 bg-gray-100';
      case 'postponed': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredFixtures = selectedLeague 
    ? fixtures.filter(fixture => fixture.leagueId === selectedLeague)
    : fixtures;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fixtures</h1>
          <p className="text-gray-600">Manage match fixtures and schedules</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Fixture
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Filter by League */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by League:</label>
          <select
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Leagues</option>
            {leagues.map((league) => (
              <option key={league.$id} value={league.$id}>
                {league.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredFixtures.map((fixture) => (
          <div key={fixture.$id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <TrophyIcon className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-sm text-gray-600">{getLeagueName(fixture.leagueId)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(fixture.status)}`}>
                  {fixture.status.charAt(0).toUpperCase() + fixture.status.slice(1)}
                </span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(fixture)}
                    className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(fixture.$id!)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1 text-center">
                <h3 className="text-lg font-semibold text-gray-900">{getTeamName(fixture.homeTeamId)}</h3>
                <p className="text-sm text-gray-500">Home</p>
              </div>
              
              <div className="flex-1 text-center px-6">
                <div className="text-xl font-medium text-gray-600">VS</div>
              </div>
              
              <div className="flex-1 text-center">
                <h3 className="text-lg font-semibold text-gray-900">{getTeamName(fixture.awayTeamId)}</h3>
                <p className="text-sm text-gray-500">Away</p>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                {new Date(fixture.date).toLocaleDateString()} at {new Date(fixture.date).toLocaleTimeString()}
              </div>
              <div className="flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1" />
                {fixture.venue}
              </div>
            </div>
            
            {fixture.status === 'finished' && (
              <div className="mt-4 flex justify-center">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Result Details
                </button>
              </div>
            )}
          </div>
        ))}
        
        {filteredFixtures.length === 0 && !loading && (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedLeague ? 'No fixtures in this league' : 'No fixtures found'}
            </h3>
            <p className="text-gray-500 mb-4">
              {selectedLeague 
                ? 'Add fixtures to this league to get started' 
                : 'Get started by creating your first fixture'
              }
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Fixture
            </button>
          </div>
        )}
      </div>

      {/* Fixture Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingFixture ? 'Edit Fixture' : 'Add New Fixture'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  League
                </label>
                <select
                  value={formData.leagueId}
                  onChange={(e) => setFormData({ ...formData, leagueId: e.target.value, homeTeamId: '', awayTeamId: '' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select league</option>
                  {leagues.map((league) => (
                    <option key={league.$id} value={league.$id}>
                      {league.name}
                    </option>
                  ))}
                </select>
              </div>

              {formData.leagueId && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Home Team
                    </label>
                    <select
                      value={formData.homeTeamId}
                      onChange={(e) => setFormData({ ...formData, homeTeamId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Select home team</option>
                      {getLeagueTeams(formData.leagueId).map((team) => (
                        <option key={team.$id} value={team.$id} disabled={team.$id === formData.awayTeamId}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Away Team
                    </label>
                    <select
                      value={formData.awayTeamId}
                      onChange={(e) => setFormData({ ...formData, awayTeamId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Select away team</option>
                      {getLeagueTeams(formData.leagueId).map((team) => (
                        <option key={team.$id} value={team.$id} disabled={team.$id === formData.homeTeamId}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Venue
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g. National Stadium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'scheduled' | 'live' | 'finished' | 'postponed' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="live">Live</option>
                  <option value="finished">Finished</option>
                  <option value="postponed">Postponed</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {editingFixture ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fixtures;