import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import type { RootState, AppDispatch } from '../store';
import { fetchResults, createResult, updateResult, deleteResult } from '../store/resultsSlice';
import { fetchFixtures } from '../store/fixturesSlice';
import { fetchTeams } from '../store/teamsSlice';
import { fetchLeagues } from '../store/leaguesSlice';
import type { Result, Goal, Card } from '../types';

const Results = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { results, loading, error } = useSelector((state: RootState) => state.results);
  const { fixtures } = useSelector((state: RootState) => state.fixtures);
  const { teams } = useSelector((state: RootState) => state.teams);
  const { leagues } = useSelector((state: RootState) => state.leagues);
  
  const [showModal, setShowModal] = useState(false);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [formData, setFormData] = useState({
    fixtureId: '',
    homeGoals: 0,
    awayGoals: 0,
    homeScorers: [] as Goal[],
    awayScorers: [] as Goal[],
    homeCards: [] as Card[],
    awayCards: [] as Card[],
    status: 'full_time' as 'full_time' | 'half_time' | 'abandoned'
  });

  const [newGoal, setNewGoal] = useState({
    playerName: '',
    minute: 0,
    type: 'goal' as 'goal' | 'penalty' | 'own_goal',
    team: 'home' as 'home' | 'away'
  });

  const [newCard, setNewCard] = useState({
    playerName: '',
    minute: 0,
    type: 'yellow' as 'yellow' | 'red',
    reason: '',
    team: 'home' as 'home' | 'away'
  });

  useEffect(() => {
    dispatch(fetchLeagues());
    dispatch(fetchTeams());
    dispatch(fetchFixtures());
    dispatch(fetchResults());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingResult) {
        await dispatch(updateResult({
          id: editingResult.$id!,
          ...formData
        })).unwrap();
      } else {
        await dispatch(createResult(formData)).unwrap();
      }
      resetForm();
    } catch (error) {
      console.error('Error saving result:', error);
    }
  };

  const handleEdit = (result: Result) => {
    setEditingResult(result);
    setFormData({
      fixtureId: result.fixtureId,
      homeGoals: result.homeGoals,
      awayGoals: result.awayGoals,
      homeScorers: result.homeScorers,
      awayScorers: result.awayScorers,
      homeCards: result.homeCards,
      awayCards: result.awayCards,
      status: result.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      try {
        await dispatch(deleteResult(id)).unwrap();
      } catch (error) {
        console.error('Error deleting result:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      fixtureId: '',
      homeGoals: 0,
      awayGoals: 0,
      homeScorers: [],
      awayScorers: [],
      homeCards: [],
      awayCards: [],
      status: 'full_time'
    });
    setEditingResult(null);
    setShowModal(false);
    setNewGoal({ playerName: '', minute: 0, type: 'goal', team: 'home' });
    setNewCard({ playerName: '', minute: 0, type: 'yellow', reason: '', team: 'home' });
  };

  const addGoal = () => {
    if (!newGoal.playerName || newGoal.minute < 1) return;

    const goal: Goal = {
      playerName: newGoal.playerName,
      minute: newGoal.minute,
      type: newGoal.type
    };

    if (newGoal.team === 'home') {
      setFormData({
        ...formData,
        homeScorers: [...formData.homeScorers, goal],
        homeGoals: formData.homeScorers.length + 1
      });
    } else {
      setFormData({
        ...formData,
        awayScorers: [...formData.awayScorers, goal],
        awayGoals: formData.awayScorers.length + 1
      });
    }

    setNewGoal({ playerName: '', minute: 0, type: 'goal', team: 'home' });
  };

  const removeGoal = (index: number, team: 'home' | 'away') => {
    if (team === 'home') {
      const newScorers = formData.homeScorers.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        homeScorers: newScorers,
        homeGoals: newScorers.length
      });
    } else {
      const newScorers = formData.awayScorers.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        awayScorers: newScorers,
        awayGoals: newScorers.length
      });
    }
  };

  const addCard = () => {
    if (!newCard.playerName || newCard.minute < 1) return;

    const card: Card = {
      playerName: newCard.playerName,
      minute: newCard.minute,
      type: newCard.type,
      reason: newCard.reason
    };

    if (newCard.team === 'home') {
      setFormData({
        ...formData,
        homeCards: [...formData.homeCards, card]
      });
    } else {
      setFormData({
        ...formData,
        awayCards: [...formData.awayCards, card]
      });
    }

    setNewCard({ playerName: '', minute: 0, type: 'yellow', reason: '', team: 'home' });
  };

  const removeCard = (index: number, team: 'home' | 'away') => {
    if (team === 'home') {
      setFormData({
        ...formData,
        homeCards: formData.homeCards.filter((_, i) => i !== index)
      });
    } else {
      setFormData({
        ...formData,
        awayCards: formData.awayCards.filter((_, i) => i !== index)
      });
    }
  };

  const getFixtureDetails = (fixtureId: string) => {
    const fixture = fixtures.find(f => f.$id === fixtureId);
    if (!fixture) return null;

    const homeTeam = teams.find(t => t.$id === fixture.homeTeamId);
    const awayTeam = teams.find(t => t.$id === fixture.awayTeamId);
    const league = leagues.find(l => l.$id === fixture.leagueId);

    return {
      fixture,
      homeTeam: homeTeam?.name || 'Unknown',
      awayTeam: awayTeam?.name || 'Unknown',
      league: league?.name || 'Unknown'
    };
  };

  const finishedFixtures = fixtures.filter(f => f.status === 'finished');

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
          <h1 className="text-2xl font-bold text-gray-900">Match Results</h1>
          <p className="text-gray-600">Record match results, goals, and disciplinary actions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Result
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {results.map((result) => {
          const details = getFixtureDetails(result.fixtureId);
          if (!details) return null;

          return (
            <div key={result.$id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-sm text-gray-600">{details.league}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-green-800 bg-green-100">
                    {result.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(result)}
                      className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(result.$id!)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 text-center">
                  <h3 className="text-lg font-semibold text-gray-900">{details.homeTeam}</h3>
                  <p className="text-sm text-gray-500">Home</p>
                </div>
                
                <div className="flex-1 text-center px-6">
                  <div className="text-3xl font-bold text-gray-900">
                    {result.homeGoals} - {result.awayGoals}
                  </div>
                </div>
                
                <div className="flex-1 text-center">
                  <h3 className="text-lg font-semibold text-gray-900">{details.awayTeam}</h3>
                  <p className="text-sm text-gray-500">Away</p>
                </div>
              </div>

              {/* Scorers and Cards Summary */}
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{details.homeTeam} Events</h4>
                  <div className="space-y-1">
                    {result.homeScorers.map((goal, i) => (
                      <div key={i} className="flex items-center text-green-600">
                        <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs mr-2">
                          ⚽
                        </span>
                        {goal.playerName} ({goal.minute}')
                      </div>
                    ))}
                    {result.homeCards.map((card, i) => (
                      <div key={i} className={`flex items-center ${card.type === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>
                        <span className={`w-6 h-6 ${card.type === 'yellow' ? 'bg-yellow-100' : 'bg-red-100'} rounded-full flex items-center justify-center text-xs mr-2`}>
                          🟨
                        </span>
                        {card.playerName} ({card.minute}')
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{details.awayTeam} Events</h4>
                  <div className="space-y-1">
                    {result.awayScorers.map((goal, i) => (
                      <div key={i} className="flex items-center text-green-600">
                        <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs mr-2">
                          ⚽
                        </span>
                        {goal.playerName} ({goal.minute}')
                      </div>
                    ))}
                    {result.awayCards.map((card, i) => (
                      <div key={i} className={`flex items-center ${card.type === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>
                        <span className={`w-6 h-6 ${card.type === 'yellow' ? 'bg-yellow-100' : 'bg-red-100'} rounded-full flex items-center justify-center text-xs mr-2`}>
                          {card.type === 'yellow' ? '🟨' : '🟥'}
                        </span>
                        {card.playerName} ({card.minute}')
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {results.length === 0 && !loading && (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500 mb-4">Record your first match result to get started</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Result
            </button>
          </div>
        )}
      </div>

      {/* Result Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingResult ? 'Edit Result' : 'Add New Result'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Match Fixture
                </label>
                <select
                  value={formData.fixtureId}
                  onChange={(e) => setFormData({ ...formData, fixtureId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Select fixture</option>
                  {finishedFixtures.map((fixture) => {
                    const details = getFixtureDetails(fixture.$id!);
                    return (
                      <option key={fixture.$id} value={fixture.$id}>
                        {details?.homeTeam} vs {details?.awayTeam} - {new Date(fixture.date).toLocaleDateString()}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'full_time' | 'half_time' | 'abandoned' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="full_time">Full Time</option>
                    <option value="half_time">Half Time</option>
                    <option value="abandoned">Abandoned</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Home Goals
                  </label>
                  <input
                    type="number"
                    value={formData.homeGoals}
                    onChange={(e) => setFormData({ ...formData, homeGoals: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="0"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Away Goals
                  </label>
                  <input
                    type="number"
                    value={formData.awayGoals}
                    onChange={(e) => setFormData({ ...formData, awayGoals: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="0"
                    readOnly
                  />
                </div>
              </div>

              {/* Goals Section */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Goals</h4>
                <div className="border border-gray-200 rounded-md p-4">
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Player name"
                      value={newGoal.playerName}
                      onChange={(e) => setNewGoal({ ...newGoal, playerName: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                      type="number"
                      placeholder="Minute"
                      value={newGoal.minute || ''}
                      onChange={(e) => setNewGoal({ ...newGoal, minute: parseInt(e.target.value) || 0 })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      min="1"
                      max="120"
                    />
                    <select
                      value={newGoal.type}
                      onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value as 'goal' | 'penalty' | 'own_goal' })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="goal">Goal</option>
                      <option value="penalty">Penalty</option>
                      <option value="own_goal">Own Goal</option>
                    </select>
                    <select
                      value={newGoal.team}
                      onChange={(e) => setNewGoal({ ...newGoal, team: e.target.value as 'home' | 'away' })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="home">Home</option>
                      <option value="away">Away</option>
                    </select>
                    <button
                      type="button"
                      onClick={addGoal}
                      className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Home Team Goals</h5>
                      {formData.homeScorers.map((goal, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded mb-1">
                          <span>{goal.playerName} ({goal.minute}') - {goal.type}</span>
                          <button
                            type="button"
                            onClick={() => removeGoal(i, 'home')}
                            className="text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Away Team Goals</h5>
                      {formData.awayScorers.map((goal, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded mb-1">
                          <span>{goal.playerName} ({goal.minute}') - {goal.type}</span>
                          <button
                            type="button"
                            onClick={() => removeGoal(i, 'away')}
                            className="text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cards Section */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Cards</h4>
                <div className="border border-gray-200 rounded-md p-4">
                  <div className="grid grid-cols-6 gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Player name"
                      value={newCard.playerName}
                      onChange={(e) => setNewCard({ ...newCard, playerName: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                      type="number"
                      placeholder="Minute"
                      value={newCard.minute || ''}
                      onChange={(e) => setNewCard({ ...newCard, minute: parseInt(e.target.value) || 0 })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      min="1"
                      max="120"
                    />
                    <select
                      value={newCard.type}
                      onChange={(e) => setNewCard({ ...newCard, type: e.target.value as 'yellow' | 'red' })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="yellow">Yellow</option>
                      <option value="red">Red</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Reason (optional)"
                      value={newCard.reason}
                      onChange={(e) => setNewCard({ ...newCard, reason: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <select
                      value={newCard.team}
                      onChange={(e) => setNewCard({ ...newCard, team: e.target.value as 'home' | 'away' })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="home">Home</option>
                      <option value="away">Away</option>
                    </select>
                    <button
                      type="button"
                      onClick={addCard}
                      className="px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                    >
                      Add
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Home Team Cards</h5>
                      {formData.homeCards.map((card, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded mb-1">
                          <span>{card.playerName} ({card.minute}') - {card.type} {card.reason && `(${card.reason})`}</span>
                          <button
                            type="button"
                            onClick={() => removeCard(i, 'home')}
                            className="text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Away Team Cards</h5>
                      {formData.awayCards.map((card, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded mb-1">
                          <span>{card.playerName} ({card.minute}') - {card.type} {card.reason && `(${card.reason})`}</span>
                          <button
                            type="button"
                            onClick={() => removeCard(i, 'away')}
                            className="text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
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
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {editingResult ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;