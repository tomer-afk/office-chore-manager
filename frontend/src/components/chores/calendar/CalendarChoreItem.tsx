import type { Chore } from '../../../types/chore';

interface CalendarChoreItemProps {
  chore: Chore;
  onClick: () => void;
}

export const CalendarChoreItem = ({ chore, onClick }: CalendarChoreItemProps) => {
  const isOverdue = chore.status === 'active' && new Date(chore.due_date) < new Date();
  const isCompleted = chore.status === 'completed';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left text-xs px-1.5 py-0.5 rounded truncate font-medium ${
        isOverdue ? 'ring-1 ring-red-500' : ''
      } ${isCompleted ? 'line-through opacity-60' : ''}`}
      style={{
        backgroundColor: chore.color + '20',
        color: chore.color,
      }}
      title={chore.title}
    >
      {chore.title}
    </button>
  );
};
