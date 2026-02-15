import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTeams } from '../../hooks/useTeams';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const teamSchema = z.object({
  name: z.string().min(1, 'Team name is required').max(100),
  description: z.string().optional(),
});

type TeamFormData = z.infer<typeof teamSchema>;

interface TeamFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const TeamForm = ({ onSuccess, onCancel }: TeamFormProps) => {
  const { createTeam, isCreating } = useTeams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = (data: TeamFormData) => {
    createTeam(data, {
      onSuccess: () => {
        onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Team Name"
        {...register('name')}
        error={errors.name?.message}
        placeholder="Enter team name"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Enter team description"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" isLoading={isCreating}>
          Create Team
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
