import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CalendarChoreItem } from '../CalendarChoreItem';
import type { Chore } from '../../../../types/chore';

const baseChore: Chore = {
  id: 1,
  team_id: 1,
  title: 'Clean kitchen',
  priority: 'medium',
  color: '#3b82f6',
  created_by: 1,
  due_date: '2026-03-15',
  is_recurring: false,
  is_template: false,
  status: 'active',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

describe('CalendarChoreItem', () => {
  it('renders chore title', () => {
    render(<CalendarChoreItem chore={baseChore} onClick={() => {}} />);
    expect(screen.getByText('Clean kitchen')).toBeInTheDocument();
  });

  it('applies chore color as inline styles', () => {
    render(<CalendarChoreItem chore={baseChore} onClick={() => {}} />);
    const button = screen.getByRole('button');
    // backgroundColor is the hex color with '20' (alpha) suffix, parsed to rgba
    expect(button.style.backgroundColor).toBeTruthy();
    expect(button).toHaveStyle({ color: '#3b82f6' });
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<CalendarChoreItem chore={baseChore} onClick={onClick} />);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('shows strikethrough for completed chores', () => {
    const completedChore = { ...baseChore, status: 'completed' as const };
    render(<CalendarChoreItem chore={completedChore} onClick={() => {}} />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('line-through');
  });

  it('shows red ring for overdue active chores', () => {
    const overdueChore = { ...baseChore, due_date: '2020-01-01' };
    render(<CalendarChoreItem chore={overdueChore} onClick={() => {}} />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('ring-red-500');
  });

  it('does not show red ring for completed overdue chores', () => {
    const completedOverdue = {
      ...baseChore,
      due_date: '2020-01-01',
      status: 'completed' as const,
    };
    render(<CalendarChoreItem chore={completedOverdue} onClick={() => {}} />);
    const button = screen.getByRole('button');
    expect(button.className).not.toContain('ring-red-500');
  });

  it('has a title attribute for tooltip', () => {
    render(<CalendarChoreItem chore={baseChore} onClick={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute('title', 'Clean kitchen');
  });
});
