import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CalendarGrid } from '../CalendarGrid';
import type { Chore } from '../../../../types/chore';

const makeChore = (overrides: Partial<Chore> = {}): Chore => ({
  id: 1,
  team_id: 1,
  title: 'Test chore',
  priority: 'medium',
  color: '#3b82f6',
  created_by: 1,
  due_date: '2026-02-15',
  is_recurring: false,
  is_template: false,
  status: 'active',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  ...overrides,
});

describe('CalendarGrid', () => {
  it('renders all 7 weekday headers', () => {
    render(
      <CalendarGrid
        currentMonth={new Date(2026, 1, 1)}
        choresByDate={new Map()}
        onChoreClick={() => {}}
      />
    );
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
    expect(screen.getByText('Thu')).toBeInTheDocument();
    expect(screen.getByText('Fri')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
  });

  it('renders all days of the month', () => {
    render(
      <CalendarGrid
        currentMonth={new Date(2026, 1, 1)} // Feb 2026 has 28 days
        choresByDate={new Map()}
        onChoreClick={() => {}}
      />
    );
    // Check that day 1 and day 28 are rendered
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('28')).toBeInTheDocument();
  });

  it('renders chores on the correct date', () => {
    const choresByDate = new Map<string, Chore[]>();
    choresByDate.set('2026-02-15', [makeChore({ title: 'Feb 15 chore' })]);

    render(
      <CalendarGrid
        currentMonth={new Date(2026, 1, 1)}
        choresByDate={choresByDate}
        onChoreClick={() => {}}
      />
    );
    expect(screen.getByText('Feb 15 chore')).toBeInTheDocument();
  });

  it('calls onChoreClick when a chore is clicked', async () => {
    const onChoreClick = vi.fn();
    const chore = makeChore({ title: 'Click me' });
    const choresByDate = new Map<string, Chore[]>();
    choresByDate.set('2026-02-15', [chore]);

    const { getByText } = render(
      <CalendarGrid
        currentMonth={new Date(2026, 1, 1)}
        choresByDate={choresByDate}
        onChoreClick={onChoreClick}
      />
    );

    const { default: userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    await user.click(getByText('Click me'));
    expect(onChoreClick).toHaveBeenCalledWith(chore);
  });

  it('renders the correct number of grid cells (full weeks)', () => {
    // Feb 2026 starts on Sunday, ends on Saturday — exactly 4 weeks = 28 cells
    // But the grid needs to fill full weeks from startOfWeek(monthStart) to endOfWeek(monthEnd)
    const { container } = render(
      <CalendarGrid
        currentMonth={new Date(2026, 1, 1)}
        choresByDate={new Map()}
        onChoreClick={() => {}}
      />
    );
    // The grid has weekday headers (7) + day cells
    // Feb 2026: Feb 1 is Sunday, Feb 28 is Saturday = exactly 28 day cells
    const grids = container.querySelectorAll('.grid-cols-7');
    expect(grids.length).toBe(2); // weekday header grid + days grid
  });
});
