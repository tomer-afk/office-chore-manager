import { useState, useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  format,
} from 'date-fns';
import { useCalendarData } from '../../../hooks/useChores';
import type { Chore } from '../../../types/chore';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { ChoreDetailModal } from './ChoreDetailModal';

interface CalendarViewProps {
  teamId: number;
  filterStatus: string;
  onComplete: (chore: Chore) => void;
  onDelete: (chore: Chore) => void;
}

export const CalendarView = ({
  teamId,
  filterStatus,
  onComplete,
  onDelete,
}: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedChore, setSelectedChore] = useState<Chore | null>(null);

  const gridStart = startOfWeek(startOfMonth(currentMonth));
  const gridEnd = endOfWeek(endOfMonth(currentMonth));

  const startDate = format(gridStart, 'yyyy-MM-dd');
  const endDate = format(gridEnd, 'yyyy-MM-dd');

  const { chores, isLoading } = useCalendarData(teamId, startDate, endDate);

  const choresByDate = useMemo(() => {
    const map = new Map<string, Chore[]>();
    const filtered = filterStatus
      ? chores.filter((c) => c.status === filterStatus)
      : chores;

    for (const chore of filtered) {
      const key = chore.due_date.slice(0, 10);
      const existing = map.get(key);
      if (existing) {
        existing.push(chore);
      } else {
        map.set(key, [chore]);
      }
    }
    return map;
  }, [chores, filterStatus]);

  const handleComplete = (chore: Chore) => {
    onComplete(chore);
    setSelectedChore(null);
  };

  const handleDelete = (chore: Chore) => {
    onDelete(chore);
    setSelectedChore(null);
  };

  return (
    <div>
      <CalendarHeader
        currentMonth={currentMonth}
        onPrevMonth={() => setCurrentMonth((m) => subMonths(m, 1))}
        onNextMonth={() => setCurrentMonth((m) => addMonths(m, 1))}
        onToday={() => setCurrentMonth(new Date())}
      />

      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-gray-600">Loading calendar...</div>
        </div>
      ) : (
        <CalendarGrid
          currentMonth={currentMonth}
          choresByDate={choresByDate}
          onChoreClick={setSelectedChore}
        />
      )}

      {selectedChore && (
        <ChoreDetailModal
          chore={selectedChore}
          onComplete={() => handleComplete(selectedChore)}
          onDelete={() => handleDelete(selectedChore)}
          onClose={() => setSelectedChore(null)}
        />
      )}
    </div>
  );
};
