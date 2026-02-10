import type { Chore } from '../../types/chore';
import { format } from 'date-fns';

interface ChoreCardProps {
  chore: Chore;
  onComplete: () => void;
  onDelete: () => void;
  onEdit?: () => void;
}

export const ChoreCard = ({ chore, onComplete, onDelete, onEdit }: ChoreCardProps) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const isOverdue = chore.status === 'active' && new Date(chore.due_date) < new Date();

  return (
    <div
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border-l-4"
      style={{ borderLeftColor: chore.color }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 flex-1">
            {chore.title}
          </h3>
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${
              priorityColors[chore.priority]
            }`}
          >
            {chore.priority.toUpperCase()}
          </span>
        </div>

        {/* Description */}
        {chore.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {chore.description}
          </p>
        )}

        {/* Metadata */}
        <div className="space-y-2 mb-4">
          {/* Due Date */}
          <div className="flex items-center text-sm">
            <svg
              className="h-4 w-4 text-gray-400 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-700'}>
              {format(new Date(chore.due_date), 'MMM d, yyyy')}
              {isOverdue && ' (Overdue)'}
            </span>
          </div>

          {/* Assigned To */}
          {chore.assigned_to_name && (
            <div className="flex items-center text-sm">
              <svg
                className="h-4 w-4 text-gray-400 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-gray-700">{chore.assigned_to_name}</span>
            </div>
          )}

          {/* Recurring Badge */}
          {chore.is_recurring && (
            <div className="flex items-center text-sm">
              <svg
                className="h-4 w-4 text-gray-400 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="text-gray-700">
                Recurring ({chore.recurrence_pattern})
              </span>
            </div>
          )}

          {/* Status */}
          {chore.status === 'completed' && chore.completed_at && (
            <div className="flex items-center text-sm text-green-600">
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Completed {format(new Date(chore.completed_at), 'MMM d')}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-200">
          {chore.status === 'active' && (
            <button
              onClick={onComplete}
              className="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
            >
              Complete
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
            >
              Edit
            </button>
          )}
          <button
            onClick={onDelete}
            className="px-3 py-2 bg-red-100 text-red-700 text-sm font-medium rounded hover:bg-red-200 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
