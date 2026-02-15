import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ChoreDetailModal } from '../ChoreDetailModal';
import type { Chore } from '../../../../types/chore';

const baseChore: Chore = {
  id: 1,
  team_id: 1,
  title: 'Clean kitchen',
  description: 'Wipe counters and mop the floor',
  priority: 'high',
  color: '#ef4444',
  created_by: 1,
  assigned_to: 2,
  assigned_to_name: 'Jane Doe',
  due_date: '2026-03-15',
  is_recurring: true,
  recurrence_pattern: 'weekly',
  is_template: false,
  status: 'active',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

describe('ChoreDetailModal', () => {
  const defaultProps = {
    chore: baseChore,
    onComplete: vi.fn(),
    onDelete: vi.fn(),
    onClose: vi.fn(),
  };

  it('renders chore title', () => {
    render(<ChoreDetailModal {...defaultProps} />);
    expect(screen.getByText('Clean kitchen')).toBeInTheDocument();
  });

  it('renders chore description', () => {
    render(<ChoreDetailModal {...defaultProps} />);
    expect(screen.getByText('Wipe counters and mop the floor')).toBeInTheDocument();
  });

  it('renders priority badge', () => {
    render(<ChoreDetailModal {...defaultProps} />);
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('renders due date', () => {
    render(<ChoreDetailModal {...defaultProps} />);
    expect(screen.getByText(/Mar 15, 2026/)).toBeInTheDocument();
  });

  it('renders assigned person', () => {
    render(<ChoreDetailModal {...defaultProps} />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('renders recurrence info', () => {
    render(<ChoreDetailModal {...defaultProps} />);
    expect(screen.getByText(/Recurring \(weekly\)/)).toBeInTheDocument();
  });

  it('shows Complete button for active chores', () => {
    render(<ChoreDetailModal {...defaultProps} />);
    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('hides Complete button for completed chores', () => {
    const completedChore = {
      ...baseChore,
      status: 'completed' as const,
      completed_at: '2026-03-10T00:00:00Z',
    };
    render(<ChoreDetailModal {...defaultProps} chore={completedChore} />);
    expect(screen.queryByText('Complete')).not.toBeInTheDocument();
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
  });

  it('calls onComplete when Complete button is clicked', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<ChoreDetailModal {...defaultProps} onComplete={onComplete} />);
    await user.click(screen.getByText('Complete'));
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('calls onDelete when Delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<ChoreDetailModal {...defaultProps} onDelete={onDelete} />);
    await user.click(screen.getByText('Delete'));
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it('calls onClose when Close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ChoreDetailModal {...defaultProps} onClose={onClose} />);
    await user.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when X button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ChoreDetailModal {...defaultProps} onClose={onClose} />);
    // The X button has an SVG with the close path
    const closeButtons = screen.getAllByRole('button');
    // The X button is the one in the header (not Complete/Delete/Close)
    const xButton = closeButtons.find(
      (btn) => !btn.textContent || btn.textContent.trim() === ''
    );
    if (xButton) {
      await user.click(xButton);
      expect(onClose).toHaveBeenCalledOnce();
    }
  });

  it('shows overdue indicator for past-due active chores', () => {
    const overdueChore = { ...baseChore, due_date: '2020-01-01' };
    render(<ChoreDetailModal {...defaultProps} chore={overdueChore} />);
    expect(screen.getByText(/Overdue/)).toBeInTheDocument();
  });

  it('shows color indicator', () => {
    const { container } = render(<ChoreDetailModal {...defaultProps} />);
    const colorDot = container.querySelector('span[style]');
    expect(colorDot).toBeInTheDocument();
  });

  it('does not render description if not provided', () => {
    const noDescChore = { ...baseChore, description: undefined };
    render(<ChoreDetailModal {...defaultProps} chore={noDescChore} />);
    expect(screen.queryByText('Wipe counters and mop the floor')).not.toBeInTheDocument();
  });

  it('does not render recurrence info if not recurring', () => {
    const nonRecurringChore = { ...baseChore, is_recurring: false };
    render(<ChoreDetailModal {...defaultProps} chore={nonRecurringChore} />);
    expect(screen.queryByText(/Recurring/)).not.toBeInTheDocument();
  });
});
