import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  TrophyIcon, 
  UsersIcon, 
  MapPinIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import type { RootState, AppDispatch } from '../store';
import { fetchLeagues, createLeague, updateLeague, deleteLeague } from '../store/leaguesSlice';
import { fetchTeams } from '../store/teamsSlice';
import type { League } from '../types';

const Leagues = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { leagues, loading, error } = useSelector((state: RootState) => state.leagues);
  const { teams } = useSelector((state: RootState) => state.teams);
  
  const [showModal, setShowModal] = useState(false);
  const [editingLeague, setEditingLeague] = useState<League | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    type: ''
  });

  useEffect(() => {
    dispatch(fetchLeagues());
    dispatch(fetchTeams());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLeague) {
        await dispatch(updateLeague({
          id: editingLeague.$id!,
          ...formData
        })).unwrap();
      } else {
        await dispatch(createLeague(formData)).unwrap();
      }
      setShowModal(false);
      setEditingLeague(null);
      setFormData({ name: '', country: '', type: '' });
    } catch (error) {
      console.error('Error saving league:', error);
    }
  };

  const handleEdit = (league: League) => {
    setEditingLeague(league);
    setFormData({
      name: league.name,
      country: league.country,
      type: league.type
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this league?')) {
      try {
        await dispatch(deleteLeague(id)).unwrap();
      } catch (error) {
        console.error('Error deleting league:', error);
      }
    }
  };

  const getTeamCount = (leagueId: string) => {
    return teams.filter(team => team.leagueId === leagueId).length;
  };

  const resetForm = () => {
    setFormData({ name: '', country: '', type: '' });
    setEditingLeague(null);
    setShowModal(false);
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Leagues</h1>
          <p className="text-gray-600">Manage football leagues and competitions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add League
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leagues.map((league) => (
          <div key={league.$id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <TrophyIcon className="h-8 w-8 text-yellow-500 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{league.name}</h3>
                  <p className="text-sm text-gray-600">{league.type}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEdit(league)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(league.$id!)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                {league.country}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <UsersIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                {getTeamCount(league.$id!)} teams
              </div>
            </div>
            
            <div className="mt-4">
              <button className="w-full bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors text-sm">
                Manage Teams
              </button>
            </div>
          </div>
        ))}
        
        {leagues.length === 0 && !loading && (
          <div className="col-span-full text-center py-12">
            <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leagues found</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first league</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add League
            </button>
          </div>
        )}
      </div>

      {/* League Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingLeague ? 'Edit League' : 'Add New League'}
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
                  League Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Zimbabwe Premier League"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Zimbabwe"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select type</option>
                  <option value="Professional">Professional</option>
                  <option value="Semi-Professional">Semi-Professional</option>
                  <option value="Amateur">Amateur</option>
                  <option value="Youth">Youth</option>
                  <option value="Women">Women</option>
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
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {editingLeague ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leagues;