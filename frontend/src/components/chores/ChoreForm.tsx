import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useChores } from '../../hooks/useChores';
import { useTeamMembers } from '../../hooks/useTeamMembers';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Chore } from '../../types/chore';

const choreSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  assigned_to: z.number().optional().nullable(),
  due_date: z.string().min(1, 'Due date is required'),
  is_recurring: z.boolean(),
  recurrence_pattern: z.enum(['daily', 'weekly', 'monthly', 'custom']).optional(),
  recurrence_interval: z.number().min(1).optional(),
  recurrence_days_of_week: z.array(z.number()).optional(),
});

type ChoreFormData = z.infer<typeof choreSchema>;

interface ChoreFormProps {
  teamId: number;
  chore?: Chore;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ChoreForm = ({ teamId, chore, onSuccess, onCancel }: ChoreFormProps) => {
  const { members } = useTeamMembers(teamId);
  const { createChore, updateChore, isCreating, isUpdating } = useChores(teamId);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChoreFormData>({
    resolver: zodResolver(choreSchema),
    defaultValues: {
      title: chore?.title || '',
      description: chore?.description || '',
      priority: chore?.priority || 'medium',
      color: chore?.color || '#3B82F6',
      assigned_to: chore?.assigned_to || null,
      due_date: chore?.due_date
        ? new Date(chore.due_date).toISOString().split('T')[0]
        : '',
      is_recurring: chore?.is_recurring || false,
      recurrence_pattern: chore?.recurrence_pattern || 'daily',
      recurrence_interval: chore?.recurrence_interval || 1,
      recurrence_days_of_week: chore?.recurrence_days_of_week || [],
    },
  });

  const isRecurring = watch('is_recurring');
  const recurrencePattern = watch('recurrence_pattern');

  const onSubmit = async (data: ChoreFormData) => {
    const payload = {
      ...data,
      assigned_to: data.assigned_to || undefined,
    };

    if (chore) {
      updateChore(
        { id: chore.id, input: payload },
        {
          onSuccess: () => {
            onSuccess();
          },
        }
      );
    } else {
      createChore(payload as any, {
        onSuccess: () => {
          onSuccess();
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <Input
        label="Title"
        {...register('title')}
        error={errors.title?.message}
        placeholder="Enter chore title"
      />

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Enter chore description (optional)"
        />
      </div>

      {/* Priority and Color */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            {...register('priority')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <input
            type="color"
            {...register('color')}
            className="block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.color && (
            <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
          )}
        </div>
      </div>

      {/* Assigned To */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assign To
        </label>
        <select
          {...register('assigned_to', {
            setValueAs: (v) => (v === '' ? null : Number(v)),
          })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Unassigned</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      {/* Due Date */}
      <Input
        type="date"
        label="Due Date"
        {...register('due_date')}
        error={errors.due_date?.message}
      />

      {/* Recurring Options */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            {...register('is_recurring')}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">
            Recurring Chore
          </span>
        </label>
      </div>

      {isRecurring && (
        <div className="space-y-4 pl-6 border-l-2 border-indigo-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recurrence Pattern
            </label>
            <select
              {...register('recurrence_pattern')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom Interval</option>
            </select>
          </div>

          {recurrencePattern === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Repeat Every (days)
              </label>
              <input
                type="number"
                {...register('recurrence_interval', { valueAsNumber: true })}
                min="1"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          )}

          {recurrencePattern === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repeat On
              </label>
              <div className="flex gap-2 flex-wrap">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                  (day, index) => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        value={index}
                        {...register('recurrence_days_of_week')}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-1 text-sm text-gray-700">{day}</span>
                    </label>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" loading={isCreating || isUpdating}>
          {chore ? 'Update Chore' : 'Create Chore'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
