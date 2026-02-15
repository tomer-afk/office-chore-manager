import { isSameMonth, isSameDay } from 'date-fns';
import type { Chore } from '../../../types/chore';
import { CalendarChoreItem } from './CalendarChoreItem';

interface CalendarDayProps {
  day: Date;
  currentMonth: Date;
  chores: Chore[];
  onChoreClick: (chore: Chore) => void;
}

const MAX_VISIBLE = 3;

export const CalendarDay = ({ day, currentMonth, chores, onChoreClick }: CalendarDayProps) => {
  const isCurrentMonth = isSameMonth(day, currentMonth);
  const isToday = isSameDay(day, new Date());
  const overflow = chores.length - MAX_VISIBLE;

  return (
    <div
      className={`min-h-[80px] sm:min-h-[100px] border border-gray-200 p-1 ${
        isCurrentMonth ? 'bg-white' : 'bg-gray-50'
      }`}
    >
      <div className="flex justify-center mb-1">
        <span
          className={`text-sm w-7 h-7 flex items-center justify-center rounded-full ${
            isToday
              ? 'bg-blue-600 text-white font-bold'
              : isCurrentMonth
                ? 'text-gray-900'
                : 'text-gray-400'
          }`}
        >
          {day.getDate()}
        </span>
      </div>
      <div className="space-y-0.5">
        {chores.slice(0, MAX_VISIBLE).map((chore) => (
          <CalendarChoreItem
            key={chore.id}
            chore={chore}
            onClick={() => onChoreClick(chore)}
          />
        ))}
        {overflow > 0 && (
          <div className="text-xs text-gray-500 text-center font-medium">
            +{overflow} more
          </div>
        )}
      </div>
    </div>
  );
};
