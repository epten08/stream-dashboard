import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  UsersIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PhotoIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import type { RootState, AppDispatch } from '../store';
import { fetchTeams, createTeam, updateTeam, deleteTeam } from '../store/teamsSlice';
import { fetchLeagues } from '../store/leaguesSlice';
import type { Team } from '../types';

const Teams = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { teams, loading, error } = useSelector((state: RootState) => state.teams);
  const { leagues } = useSelector((state: RootState) => state.leagues);
  
  const [showModal, setShowModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    leagueId: ''
  });
  const [selectedLeague, setSelectedLeague] = useState('');

  useEffect(() => {
    dispatch(fetchLeagues());
    dispatch(fetchTeams());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTeam) {
        await dispatch(updateTeam({
          id: editingTeam.$id!,
          ...formData
        })).unwrap();
      } else {
        await dispatch(createTeam(formData)).unwrap();
      }
      setShowModal(false);
      setEditingTeam(null);
      setFormData({ name: '', logo: '', leagueId: '' });
    } catch (error) {
      console.error('Error saving team:', error);
    }
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      logo: team.logo || '',
      leagueId: team.leagueId
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await dispatch(deleteTeam(id)).unwrap();
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', logo: '', leagueId: '' });
    setEditingTeam(null);
    setShowModal(false);
  };

  const getLeagueName = (leagueId: string) => {
    const league = leagues.find(l => l.$id === leagueId);
    return league ? league.name : 'Unknown League';
  };

  const filteredTeams = selectedLeague 
    ? teams.filter(team => team.leagueId === selectedLeague)
    : teams;

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
          <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-600">Manage teams and their details</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Team
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
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <div key={team.$id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  {team.logo ? (
                    <img src={team.logo} alt={`${team.name} logo`} className="h-10 w-10 object-contain" />
                  ) : (
                    <UsersIcon className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{team.name}</h3>
                  <p className="text-sm text-gray-600">{getLeagueName(team.leagueId)}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEdit(team)}
                  className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(team.$id!)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <TrophyIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                {getLeagueName(team.leagueId)}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <UsersIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                {team.players?.length || 0} players
              </div>
            </div>
            
            <div className="mt-4">
              <button className="w-full bg-green-600 text-white py-2 px-3 rounded-md hover:bg-green-700 transition-colors text-sm">
                Manage Players
              </button>
            </div>
          </div>
        ))}
        
        {filteredTeams.length === 0 && !loading && (
          <div className="col-span-full text-center py-12">
            <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedLeague ? 'No teams in this league' : 'No teams found'}
            </h3>
            <p className="text-gray-500 mb-4">
              {selectedLeague 
                ? 'Add teams to this league to get started' 
                : 'Get started by creating your first team'
              }
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Team
            </button>
          </div>
        )}
      </div>

      {/* Team Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingTeam ? 'Edit Team' : 'Add New Team'}
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
                  Team Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. Dynamos FC"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  League
                </label>
                <select
                  value={formData.leagueId}
                  onChange={(e) => setFormData({ ...formData, leagueId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo URL (optional)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://example.com/logo.png"
                  />
                  <PhotoIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>
              
              {formData.logo && (
                <div className="flex justify-center">
                  <img 
                    src={formData.logo} 
                    alt="Logo preview" 
                    className="h-16 w-16 object-contain border border-gray-200 rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
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
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {editingTeam ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;