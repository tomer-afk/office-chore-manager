import { useState } from 'react';
import { useTeams } from '../hooks/useTeams';
import { useChores } from '../hooks/useChores';
import { Button } from '../components/ui/Button';
import { ChoreCard } from '../components/chores/ChoreCard';
import { ChoreForm } from '../components/chores/ChoreForm';
import { CalendarView } from '../components/chores/calendar';
import { TeamForm } from '../components/team/TeamForm';
import { TeamMembersModal } from '../components/team/TeamMembersModal';

export const ChoresPage = () => {
  const { teams, isLoading: teamsLoading } = useTeams();
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateTeamForm, setShowCreateTeamForm] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Use the first team by default
  const currentTeamId = selectedTeamId || teams[0]?.id;

  const { chores, isLoading: choresLoading, deleteChore, completeChore } = useChores(
    currentTeamId,
    { status: filterStatus }
  );

  if (teamsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!teams.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-8 text-center max-w-md mx-auto">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No Teams Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Create your first team to start managing chores with your colleagues
            </p>
            <Button onClick={() => setShowCreateTeamForm(true)}>
              + Create Team
            </Button>
          </div>

          {/* Create Team Modal */}
          {showCreateTeamForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Create Team
                    </h2>
                    <button
                      onClick={() => setShowCreateTeamForm(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <TeamForm
                    onSuccess={() => setShowCreateTeamForm(false)}
                    onCancel={() => setShowCreateTeamForm(false)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chores</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your team's chores
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateTeamForm(true)}
              >
                + New Team
              </Button>
              <Button onClick={() => setShowCreateForm(true)}>
                + New Chore
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Team Selector and Manage Button */}
        <div className="mb-6 flex items-end gap-4">
          {teams.length > 1 && (
            <div className="flex-1 max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Team
              </label>
              <select
                value={currentTeamId || ''}
                onChange={(e) => setSelectedTeamId(Number(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {currentTeamId && (
            <Button
              variant="outline"
              onClick={() => setShowMembersModal(true)}
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Manage Team
            </Button>
          )}
        </div>

        {/* Status Filter and View Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-4 py-2 rounded-md ${
                filterStatus === 'active'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-2 rounded-md ${
                filterStatus === 'completed'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilterStatus('')}
              className={`px-4 py-2 rounded-md ${
                filterStatus === ''
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              All
            </button>
          </div>
          <div className="flex rounded-md border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm font-medium ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-2 text-sm font-medium border-l border-gray-300 ${
                viewMode === 'calendar'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chores Content */}
        {viewMode === 'calendar' && currentTeamId ? (
          <CalendarView
            teamId={currentTeamId}
            filterStatus={filterStatus}
            onComplete={(chore) => completeChore({ id: chore.id })}
            onDelete={(chore) => {
              if (confirm('Are you sure you want to delete this chore?')) {
                deleteChore(chore.id);
              }
            }}
          />
        ) : choresLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading chores...</div>
          </div>
        ) : chores.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">No chores found. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chores.map((chore) => (
              <ChoreCard
                key={chore.id}
                chore={chore}
                onComplete={() => completeChore({ id: chore.id })}
                onDelete={() => {
                  if (confirm('Are you sure you want to delete this chore?')) {
                    deleteChore(chore.id);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Chore Modal */}
      {showCreateForm && currentTeamId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Create New Chore
                </h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <ChoreForm
                teamId={currentTeamId}
                onSuccess={() => setShowCreateForm(false)}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateTeamForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Create Team
                </h2>
                <button
                  onClick={() => setShowCreateTeamForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <TeamForm
                onSuccess={() => setShowCreateTeamForm(false)}
                onCancel={() => setShowCreateTeamForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Team Members Modal */}
      {showMembersModal && currentTeamId && (
        <TeamMembersModal
          teamId={currentTeamId}
          teamName={teams.find(t => t.id === currentTeamId)?.name || 'Team'}
          onClose={() => setShowMembersModal(false)}
        />
      )}
    </div>
  );
};
