import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CalendarDay } from '../CalendarDay';
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

describe('CalendarDay', () => {
  const currentMonth = new Date(2026, 1, 1); // February 2026

  it('renders the day number', () => {
    render(
      <CalendarDay
        day={new Date(2026, 1, 15)}
        currentMonth={currentMonth}
        chores={[]}
        onChoreClick={() => {}}
      />
    );
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('dims off-month days', () => {
    render(
      <CalendarDay
        day={new Date(2026, 0, 31)} // January 31 in February grid
        currentMonth={currentMonth}
        chores={[]}
        onChoreClick={() => {}}
      />
    );
    const dayNumber = screen.getByText('31');
    expect(dayNumber.className).toContain('text-gray-400');
  });

  it('does not dim current-month days', () => {
    render(
      <CalendarDay
        day={new Date(2026, 1, 10)}
        currentMonth={currentMonth}
        chores={[]}
        onChoreClick={() => {}}
      />
    );
    const dayNumber = screen.getByText('10');
    expect(dayNumber.className).toContain('text-gray-900');
  });

  it('renders chore pills', () => {
    const chores = [
      makeChore({ id: 1, title: 'Chore A' }),
      makeChore({ id: 2, title: 'Chore B' }),
    ];
    render(
      <CalendarDay
        day={new Date(2026, 1, 15)}
        currentMonth={currentMonth}
        chores={chores}
        onChoreClick={() => {}}
      />
    );
    expect(screen.getByText('Chore A')).toBeInTheDocument();
    expect(screen.getByText('Chore B')).toBeInTheDocument();
  });

  it('shows max 3 chores and overflow count', () => {
    const chores = [
      makeChore({ id: 1, title: 'Chore 1' }),
      makeChore({ id: 2, title: 'Chore 2' }),
      makeChore({ id: 3, title: 'Chore 3' }),
      makeChore({ id: 4, title: 'Chore 4' }),
      makeChore({ id: 5, title: 'Chore 5' }),
    ];
    render(
      <CalendarDay
        day={new Date(2026, 1, 15)}
        currentMonth={currentMonth}
        chores={chores}
        onChoreClick={() => {}}
      />
    );
    expect(screen.getByText('Chore 1')).toBeInTheDocument();
    expect(screen.getByText('Chore 2')).toBeInTheDocument();
    expect(screen.getByText('Chore 3')).toBeInTheDocument();
    expect(screen.queryByText('Chore 4')).not.toBeInTheDocument();
    expect(screen.queryByText('Chore 5')).not.toBeInTheDocument();
    expect(screen.getByText('+2 more')).toBeInTheDocument();
  });

  it('does not show overflow for 3 or fewer chores', () => {
    const chores = [
      makeChore({ id: 1, title: 'Chore 1' }),
      makeChore({ id: 2, title: 'Chore 2' }),
      makeChore({ id: 3, title: 'Chore 3' }),
    ];
    render(
      <CalendarDay
        day={new Date(2026, 1, 15)}
        currentMonth={currentMonth}
        chores={chores}
        onChoreClick={() => {}}
      />
    );
    expect(screen.queryByText(/more/)).not.toBeInTheDocument();
  });

  it('calls onChoreClick when a chore pill is clicked', async () => {
    const user = userEvent.setup();
    const onChoreClick = vi.fn();
    const chore = makeChore({ id: 1, title: 'Clickable chore' });
    render(
      <CalendarDay
        day={new Date(2026, 1, 15)}
        currentMonth={currentMonth}
        chores={[chore]}
        onChoreClick={onChoreClick}
      />
    );
    await user.click(screen.getByText('Clickable chore'));
    expect(onChoreClick).toHaveBeenCalledWith(chore);
  });
});
