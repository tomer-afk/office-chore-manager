import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CalendarHeader } from '../CalendarHeader';

describe('CalendarHeader', () => {
  const defaultProps = {
    currentMonth: new Date(2026, 1, 1), // February 2026
    onPrevMonth: vi.fn(),
    onNextMonth: vi.fn(),
    onToday: vi.fn(),
  };

  it('displays the current month and year', () => {
    render(<CalendarHeader {...defaultProps} />);
    expect(screen.getByText('February 2026')).toBeInTheDocument();
  });

  it('displays different months correctly', () => {
    render(
      <CalendarHeader
        {...defaultProps}
        currentMonth={new Date(2026, 11, 1)} // December 2026
      />
    );
    expect(screen.getByText('December 2026')).toBeInTheDocument();
  });

  it('calls onPrevMonth when prev button is clicked', async () => {
    const user = userEvent.setup();
    const onPrevMonth = vi.fn();
    render(<CalendarHeader {...defaultProps} onPrevMonth={onPrevMonth} />);
    const buttons = screen.getAllByRole('button');
    // First button is prev
    await user.click(buttons[0]);
    expect(onPrevMonth).toHaveBeenCalledOnce();
  });

  it('calls onToday when Today button is clicked', async () => {
    const user = userEvent.setup();
    const onToday = vi.fn();
    render(<CalendarHeader {...defaultProps} onToday={onToday} />);
    await user.click(screen.getByText('Today'));
    expect(onToday).toHaveBeenCalledOnce();
  });

  it('calls onNextMonth when next button is clicked', async () => {
    const user = userEvent.setup();
    const onNextMonth = vi.fn();
    render(<CalendarHeader {...defaultProps} onNextMonth={onNextMonth} />);
    const buttons = screen.getAllByRole('button');
    // Last button is next
    await user.click(buttons[buttons.length - 1]);
    expect(onNextMonth).toHaveBeenCalledOnce();
  });
});
