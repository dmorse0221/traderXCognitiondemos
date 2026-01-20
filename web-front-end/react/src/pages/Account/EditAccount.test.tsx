import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditAccount } from './EditAccount';
import { accountService } from '../../services';

jest.mock('../../services/accountService', () => ({
  accountService: {
    getAccounts: jest.fn(),
    addAccount: jest.fn(),
    addAccountUser: jest.fn(),
    getAccountUsers: jest.fn(),
  },
}));

describe('EditAccount', () => {
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (accountService.addAccount as jest.Mock).mockResolvedValue({});
  });

  it('renders account name input', () => {
    render(<EditAccount onUpdate={mockOnUpdate} />);
    expect(screen.getByPlaceholderText('Account name')).toBeInTheDocument();
  });

  it('renders Add Account button when no account is provided', () => {
    render(<EditAccount onUpdate={mockOnUpdate} />);
    expect(screen.getByText('Add Account')).toBeInTheDocument();
  });

  it('renders Update Account button when account is provided', () => {
    const mockAccount = { id: 1, displayName: 'Test Account' };
    render(<EditAccount account={mockAccount} onUpdate={mockOnUpdate} />);
    expect(screen.getByText('Update Account')).toBeInTheDocument();
  });

  it('renders Reset button', () => {
    render(<EditAccount onUpdate={mockOnUpdate} />);
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('populates input with account displayName when account is provided', () => {
    const mockAccount = { id: 1, displayName: 'Test Account' };
    render(<EditAccount account={mockAccount} onUpdate={mockOnUpdate} />);
    expect(screen.getByDisplayValue('Test Account')).toBeInTheDocument();
  });

  it('clears input when Reset is clicked', () => {
    render(<EditAccount onUpdate={mockOnUpdate} />);
    const input = screen.getByPlaceholderText('Account name');
    fireEvent.change(input, { target: { value: 'New Account' } });
    expect(input).toHaveValue('New Account');
    fireEvent.click(screen.getByText('Reset'));
    expect(input).toHaveValue('');
  });

  it('does not call addAccount when input is empty', () => {
    render(<EditAccount onUpdate={mockOnUpdate} />);
    fireEvent.click(screen.getByText('Add Account'));
    expect(accountService.addAccount).not.toHaveBeenCalled();
  });

  it('calls addAccount when Add Account is clicked with valid input', async () => {
    render(<EditAccount onUpdate={mockOnUpdate} />);
    const input = screen.getByPlaceholderText('Account name');
    fireEvent.change(input, { target: { value: 'New Account' } });
    fireEvent.click(screen.getByText('Add Account'));
    await waitFor(() => {
      expect(accountService.addAccount).toHaveBeenCalledWith({ displayName: 'New Account' });
    });
  });

  it('calls onUpdate after successful account creation', async () => {
    render(<EditAccount onUpdate={mockOnUpdate} />);
    const input = screen.getByPlaceholderText('Account name');
    fireEvent.change(input, { target: { value: 'New Account' } });
    fireEvent.click(screen.getByText('Add Account'));
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  it('shows success alert after successful account creation', async () => {
    render(<EditAccount onUpdate={mockOnUpdate} />);
    const input = screen.getByPlaceholderText('Account name');
    fireEvent.change(input, { target: { value: 'New Account' } });
    fireEvent.click(screen.getByText('Add Account'));
    await waitFor(() => {
      expect(screen.getByText('Account added successfully!')).toBeInTheDocument();
    });
  });

  it('shows error alert when account creation fails', async () => {
    (accountService.addAccount as jest.Mock).mockRejectedValue(new Error('Failed'));
    render(<EditAccount onUpdate={mockOnUpdate} />);
    const input = screen.getByPlaceholderText('Account name');
    fireEvent.change(input, { target: { value: 'New Account' } });
    fireEvent.click(screen.getByText('Add Account'));
    await waitFor(() => {
      expect(screen.getByText('There is some error!')).toBeInTheDocument();
    });
  });
});
