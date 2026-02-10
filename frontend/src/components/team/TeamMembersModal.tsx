import { useState } from 'react';
import { useTeamMembers } from '../../hooks/useTeamMembers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsApi } from '../../api/teams';
import { Button } from '../ui/Button';
import { AddMemberForm } from './AddMemberForm';
import toast from 'react-hot-toast';

interface TeamMembersModalProps {
  teamId: number;
  teamName: string;
  onClose: () => void;
}

export const TeamMembersModal = ({ teamId, teamName, onClose }: TeamMembersModalProps) => {
  const { members, isLoading } = useTeamMembers(teamId);
  const [showAddForm, setShowAddForm] = useState(false);
  const queryClient = useQueryClient();

  const removeMemberMutation = useMutation({
    mutationFn: (userId: number) => teamsApi.removeMember(teamId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members', teamId] });
      toast.success('Member removed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to remove member');
    },
  });

  const handleRemoveMember = (userId: number, userName: string) => {
    if (confirm(`Are you sure you want to remove ${userName} from the team?`)) {
      removeMemberMutation.mutate(userId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
              <p className="text-sm text-gray-600 mt-1">{teamName}</p>
            </div>
            <button
              onClick={onClose}
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

          {/* Add Member Form */}
          {showAddForm ? (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add New Member
              </h3>
              <AddMemberForm
                teamId={teamId}
                onSuccess={() => setShowAddForm(false)}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          ) : (
            <div className="mb-6">
              <Button onClick={() => setShowAddForm(true)}>
                + Add Member
              </Button>
            </div>
          )}

          {/* Members List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Current Members ({members.length})
            </h3>

            {isLoading ? (
              <div className="text-center py-8 text-gray-600">Loading members...</div>
            ) : members.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                No members yet. Add some to get started!
              </div>
            ) : (
              <div className="space-y-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold text-sm">
                          {member.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          member.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {member.role}
                      </span>
                      <button
                        onClick={() => handleRemoveMember(member.id, member.name)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                        disabled={removeMemberMutation.isPending}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
