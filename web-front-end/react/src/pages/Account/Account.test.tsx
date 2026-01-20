import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Account } from './Account';
import { accountService } from '../../services';

jest.mock('../../services/accountService', () => ({
  accountService: {
    getAccounts: jest.fn(),
    addAccount: jest.fn(),
    addAccountUser: jest.fn(),
    getAccountUsers: jest.fn(),
  },
}));

const mockAccounts = [
  { id: 1, displayName: 'Account 1' },
  { id: 2, displayName: 'Account 2' },
];

const mockAccountUsers = [
  { accountId: 1, username: 'user1' },
  { accountId: 1, username: 'user2' },
  { accountId: 2, username: 'user3' },
];

describe('Account', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (accountService.getAccounts as jest.Mock).mockResolvedValue(mockAccounts);
    (accountService.getAccountUsers as jest.Mock).mockResolvedValue(mockAccountUsers);
  });

  it('renders Account List heading', async () => {
    render(<Account />);
    await waitFor(() => {
      expect(screen.getByText('Account List')).toBeInTheDocument();
    });
  });

  it('renders Users List heading', async () => {
    render(<Account />);
    await waitFor(() => {
      expect(screen.getByText(/Users List/)).toBeInTheDocument();
    });
  });

  it('renders Add Account button', async () => {
    render(<Account />);
    await waitFor(() => {
      expect(screen.getByText('Add Account')).toBeInTheDocument();
    });
  });

  it('renders Reset button', async () => {
    render(<Account />);
    await waitFor(() => {
      expect(screen.getAllByText('Reset').length).toBeGreaterThan(0);
    });
  });

  it('renders Add User button', async () => {
    render(<Account />);
    await waitFor(() => {
      expect(screen.getByText('Add User')).toBeInTheDocument();
    });
  });

  it('fetches accounts on mount', async () => {
    render(<Account />);
    await waitFor(() => {
      expect(accountService.getAccounts).toHaveBeenCalled();
    });
  });

  it('renders account name input', async () => {
    render(<Account />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Account name')).toBeInTheDocument();
    });
  });

  it('renders user search input', async () => {
    render(<Account />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Add User to Account')).toBeInTheDocument();
    });
  });

  it('renders account dropdown for user assignment', async () => {
    render(<Account />);
    await waitFor(() => {
      expect(screen.getByText('Select an account')).toBeInTheDocument();
    });
  });

  it('renders AG Grid for accounts', async () => {
    render(<Account />);
    await waitFor(() => {
      const grids = screen.getAllByRole('treegrid');
      expect(grids.length).toBeGreaterThan(0);
    });
  });
});
