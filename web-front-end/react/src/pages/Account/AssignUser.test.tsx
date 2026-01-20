import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AssignUser } from './AssignUser';
import { accountService, userService } from '../../services';

jest.mock('../../services/accountService', () => ({
  accountService: {
    getAccounts: jest.fn(),
    addAccount: jest.fn(),
    addAccountUser: jest.fn(),
    getAccountUsers: jest.fn(),
  },
}));

jest.mock('../../services/userService', () => ({
  userService: {
    getUsers: jest.fn(),
  },
}));

const mockAccounts = [
  { id: 1, displayName: 'Account 1' },
  { id: 2, displayName: 'Account 2' },
];

const mockUsers = [
  { logonId: 'user1', fullName: 'John Doe', email: 'john@example.com', employeeId: '001', department: 'IT', photoUrl: '' },
  { logonId: 'user2', fullName: 'Jane Smith', email: 'jane@example.com', employeeId: '002', department: 'HR', photoUrl: '' },
];

describe('AssignUser', () => {
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (userService.getUsers as jest.Mock).mockResolvedValue(mockUsers);
    (accountService.addAccountUser as jest.Mock).mockResolvedValue({});
  });

  it('renders user search input', () => {
    render(<AssignUser accounts={mockAccounts} onUpdate={mockOnUpdate} />);
    expect(screen.getByPlaceholderText('Add User to Account')).toBeInTheDocument();
  });

  it('renders account dropdown', () => {
    render(<AssignUser accounts={mockAccounts} onUpdate={mockOnUpdate} />);
    expect(screen.getByText('Select an account')).toBeInTheDocument();
  });

  it('renders Add User button', () => {
    render(<AssignUser accounts={mockAccounts} onUpdate={mockOnUpdate} />);
    expect(screen.getByText('Add User')).toBeInTheDocument();
  });

  it('renders Reset button', () => {
    render(<AssignUser accounts={mockAccounts} onUpdate={mockOnUpdate} />);
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('populates account dropdown with accounts', () => {
    render(<AssignUser accounts={mockAccounts} onUpdate={mockOnUpdate} />);
    expect(screen.getByText('Account 1')).toBeInTheDocument();
    expect(screen.getByText('Account 2')).toBeInTheDocument();
  });

  it('selects account from dropdown', () => {
    render(<AssignUser accounts={mockAccounts} onUpdate={mockOnUpdate} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '1' } });
    expect(select).toHaveValue('1');
  });

  it('searches for users when typing more than 2 characters', async () => {
    render(<AssignUser accounts={mockAccounts} onUpdate={mockOnUpdate} />);
    const input = screen.getByPlaceholderText('Add User to Account');
    fireEvent.change(input, { target: { value: 'John' } });
    await waitFor(() => {
      expect(userService.getUsers).toHaveBeenCalledWith('John');
    });
  });

  it('does not search for users when typing less than 3 characters', async () => {
    render(<AssignUser accounts={mockAccounts} onUpdate={mockOnUpdate} />);
    const input = screen.getByPlaceholderText('Add User to Account');
    fireEvent.change(input, { target: { value: 'Jo' } });
    expect(userService.getUsers).not.toHaveBeenCalled();
  });

  it('shows user dropdown when users are found', async () => {
    render(<AssignUser accounts={mockAccounts} onUpdate={mockOnUpdate} />);
    const input = screen.getByPlaceholderText('Add User to Account');
    fireEvent.change(input, { target: { value: 'John' } });
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('selects user from dropdown', async () => {
    render(<AssignUser accounts={mockAccounts} onUpdate={mockOnUpdate} />);
    const input = screen.getByPlaceholderText('Add User to Account');
    fireEvent.change(input, { target: { value: 'John' } });
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    fireEvent.mouseDown(screen.getByText('John Doe'));
    expect(input).toHaveValue('John Doe');
  });

  it('clears input when Reset is clicked', async () => {
    render(<AssignUser accounts={mockAccounts} onUpdate={mockOnUpdate} />);
    const input = screen.getByPlaceholderText('Add User to Account');
    fireEvent.change(input, { target: { value: 'John' } });
    fireEvent.click(screen.getByText('Reset'));
    expect(input).toHaveValue('');
  });

  it('does not call addAccountUser when user or account is not selected', () => {
    render(<AssignUser accounts={mockAccounts} onUpdate={mockOnUpdate} />);
    fireEvent.click(screen.getByText('Add User'));
    expect(accountService.addAccountUser).not.toHaveBeenCalled();
  });

  it('pre-selects account when account prop is provided', () => {
    const mockAccount = { id: 1, displayName: 'Account 1' };
    render(<AssignUser accounts={mockAccounts} account={mockAccount} onUpdate={mockOnUpdate} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('1');
  });
});
