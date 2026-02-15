import { format } from 'date-fns';
import type { Chore } from '../../../types/chore';
import { Button } from '../../ui/Button';

interface ChoreDetailModalProps {
  chore: Chore;
  onComplete: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const priorityColors: Record<string, string> = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export const ChoreDetailModal = ({
  chore,
  onComplete,
  onDelete,
  onClose,
}: ChoreDetailModalProps) => {
  const isOverdue = chore.status === 'active' && new Date(chore.due_date) < new Date();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 break-words">{chore.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Priority Badge */}
          <div className="mb-4">
            <span className={`px-2 py-1 text-xs font-medium rounded ${priorityColors[chore.priority]}`}>
              {chore.priority.toUpperCase()}
            </span>
            {chore.status === 'completed' && (
              <span className="ml-2 px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                COMPLETED
              </span>
            )}
          </div>

          {/* Description */}
          {chore.description && (
            <p className="text-gray-600 text-sm mb-4">{chore.description}</p>
          )}

          {/* Details */}
          <div className="space-y-3 mb-6">
            {/* Due Date */}
            <div className="flex items-center text-sm">
              <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-700'}>
                {format(new Date(chore.due_date), 'MMM d, yyyy')}
                {isOverdue && ' (Overdue)'}
              </span>
            </div>

            {/* Assigned To */}
            {chore.assigned_to_name && (
              <div className="flex items-center text-sm">
                <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-gray-700">{chore.assigned_to_name}</span>
              </div>
            )}

            {/* Recurring */}
            {chore.is_recurring && (
              <div className="flex items-center text-sm">
                <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-gray-700">
                  Recurring ({chore.recurrence_pattern})
                </span>
              </div>
            )}

            {/* Completed At */}
            {chore.status === 'completed' && chore.completed_at && (
              <div className="flex items-center text-sm text-green-600">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Completed {format(new Date(chore.completed_at), 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>

          {/* Color indicator */}
          <div className="flex items-center text-sm mb-6">
            <span
              className="w-4 h-4 rounded-full mr-2 flex-shrink-0"
              style={{ backgroundColor: chore.color }}
            />
            <span className="text-gray-500">Color label</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            {chore.status === 'active' && (
              <button
                onClick={onComplete}
                className="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
              >
                Complete
              </button>
            )}
            <button
              onClick={onDelete}
              className="px-3 py-2 bg-red-100 text-red-700 text-sm font-medium rounded hover:bg-red-200 transition-colors"
            >
              Delete
            </button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
