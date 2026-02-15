import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsApi } from '../../api/teams';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import toast from 'react-hot-toast';

interface AddMemberFormProps {
  teamId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddMemberForm = ({ teamId, onSuccess, onCancel }: AddMemberFormProps) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const queryClient = useQueryClient();

  const addMemberMutation = useMutation({
    mutationFn: () => teamsApi.addMemberByEmail(teamId, email, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members', teamId] });
      toast.success('Team member added successfully!');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to add member');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email is required');
      return;
    }
    addMemberMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        label="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="colleague@example.com"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'admin' | 'member')}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <p className="mt-1 text-sm text-gray-500">
          Admins can manage team settings and members
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" isLoading={addMemberMutation.isPending}>
          Add Member
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
