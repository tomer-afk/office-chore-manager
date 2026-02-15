import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
} from 'date-fns';
import type { Chore } from '../../../types/chore';
import { CalendarDay } from './CalendarDay';

interface CalendarGridProps {
  currentMonth: Date;
  choresByDate: Map<string, Chore[]>;
  onChoreClick: (chore: Chore) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarGrid = ({ currentMonth, choresByDate, onChoreClick }: CalendarGridProps) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div>
      <div className="grid grid-cols-7">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-sm font-medium text-gray-600 border border-gray-200 bg-gray-50"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          return (
            <CalendarDay
              key={dateKey}
              day={day}
              currentMonth={currentMonth}
              chores={choresByDate.get(dateKey) || []}
              onChoreClick={onChoreClick}
            />
          );
        })}
      </div>
    </div>
  );
};
