import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CalendarView } from '../CalendarView';
import type { Chore } from '../../../../types/chore';

const mockChores: Chore[] = [
  {
    id: 1,
    team_id: 1,
    title: 'Wash dishes',
    priority: 'medium',
    color: '#3b82f6',
    created_by: 1,
    due_date: '2026-02-15',
    is_recurring: false,
    is_template: false,
    status: 'active',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 2,
    team_id: 1,
    title: 'Take out trash',
    priority: 'high',
    color: '#ef4444',
    created_by: 1,
    due_date: '2026-02-15',
    is_recurring: false,
    is_template: false,
    status: 'completed',
    completed_at: '2026-02-14T00:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 3,
    team_id: 1,
    title: 'Mop floors',
    priority: 'low',
    color: '#22c55e',
    created_by: 1,
    due_date: '2026-02-20',
    is_recurring: false,
    is_template: false,
    status: 'active',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

// Mock the useCalendarData hook
vi.mock('../../../../hooks/useChores', () => ({
  useCalendarData: () => ({
    chores: mockChores,
    isLoading: false,
    error: null,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('CalendarView', () => {
  const defaultProps = {
    teamId: 1,
    filterStatus: '',
    onComplete: vi.fn(),
    onDelete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the calendar header with current month', () => {
    render(<CalendarView {...defaultProps} />, { wrapper: createWrapper() });
    // Should show current month (February 2026 based on system date)
    expect(screen.getByText(/February 2026/)).toBeInTheDocument();
  });

  it('renders weekday headers', () => {
    render(<CalendarView {...defaultProps} />, { wrapper: createWrapper() });
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
  });

  it('renders chores on the calendar', () => {
    render(<CalendarView {...defaultProps} />, { wrapper: createWrapper() });
    expect(screen.getByText('Wash dishes')).toBeInTheDocument();
    expect(screen.getByText('Mop floors')).toBeInTheDocument();
  });

  it('filters by active status', () => {
    render(
      <CalendarView {...defaultProps} filterStatus="active" />,
      { wrapper: createWrapper() }
    );
    expect(screen.getByText('Wash dishes')).toBeInTheDocument();
    expect(screen.getByText('Mop floors')).toBeInTheDocument();
    expect(screen.queryByText('Take out trash')).not.toBeInTheDocument();
  });

  it('filters by completed status', () => {
    render(
      <CalendarView {...defaultProps} filterStatus="completed" />,
      { wrapper: createWrapper() }
    );
    expect(screen.queryByText('Wash dishes')).not.toBeInTheDocument();
    expect(screen.getByText('Take out trash')).toBeInTheDocument();
    expect(screen.queryByText('Mop floors')).not.toBeInTheDocument();
  });

  it('shows all chores when filterStatus is empty', () => {
    render(
      <CalendarView {...defaultProps} filterStatus="" />,
      { wrapper: createWrapper() }
    );
    expect(screen.getByText('Wash dishes')).toBeInTheDocument();
    expect(screen.getByText('Take out trash')).toBeInTheDocument();
    expect(screen.getByText('Mop floors')).toBeInTheDocument();
  });

  it('opens detail modal when a chore is clicked', async () => {
    const user = userEvent.setup();
    render(<CalendarView {...defaultProps} />, { wrapper: createWrapper() });

    await user.click(screen.getByText('Wash dishes'));

    // Modal should appear with chore details
    await waitFor(() => {
      expect(screen.getByText('MEDIUM')).toBeInTheDocument();
      expect(screen.getByText('Complete')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
      expect(screen.getByText('Close')).toBeInTheDocument();
    });
  });

  it('closes detail modal when Close is clicked', async () => {
    const user = userEvent.setup();
    render(<CalendarView {...defaultProps} />, { wrapper: createWrapper() });

    await user.click(screen.getByText('Wash dishes'));
    await waitFor(() => {
      expect(screen.getByText('Close')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Close'));
    await waitFor(() => {
      expect(screen.queryByText('MEDIUM')).not.toBeInTheDocument();
    });
  });

  it('calls onComplete and closes modal when Complete is clicked', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(
      <CalendarView {...defaultProps} onComplete={onComplete} />,
      { wrapper: createWrapper() }
    );

    await user.click(screen.getByText('Wash dishes'));
    await waitFor(() => {
      expect(screen.getByText('Complete')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Complete'));
    expect(onComplete).toHaveBeenCalledWith(mockChores[0]);
  });

  it('calls onDelete and closes modal when Delete is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <CalendarView {...defaultProps} onDelete={onDelete} />,
      { wrapper: createWrapper() }
    );

    await user.click(screen.getByText('Wash dishes'));
    await waitFor(() => {
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Delete'));
    expect(onDelete).toHaveBeenCalledWith(mockChores[0]);
  });

  it('navigates to previous month', async () => {
    const user = userEvent.setup();
    render(<CalendarView {...defaultProps} />, { wrapper: createWrapper() });

    // Click the prev button (first button in header)
    const buttons = screen.getAllByRole('button');
    const prevButton = buttons[0]; // first button is prev arrow
    await user.click(prevButton);

    expect(screen.getByText(/January 2026/)).toBeInTheDocument();
  });

  it('navigates to next month', async () => {
    const user = userEvent.setup();
    render(<CalendarView {...defaultProps} />, { wrapper: createWrapper() });

    // Find and click the next button (after Today)
    const buttons = screen.getAllByRole('button');
    // Buttons order: prev, Today, next, ...chore pills
    const nextButton = buttons[2];
    await user.click(nextButton);

    expect(screen.getByText(/March 2026/)).toBeInTheDocument();
  });

  it('returns to current month when Today is clicked', async () => {
    const user = userEvent.setup();
    render(<CalendarView {...defaultProps} />, { wrapper: createWrapper() });

    // Navigate away first
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]); // prev
    expect(screen.getByText(/January 2026/)).toBeInTheDocument();

    // Click Today
    await user.click(screen.getByText('Today'));
    expect(screen.getByText(/February 2026/)).toBeInTheDocument();
  });
});
