import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Trade } from './Trade';
import { accountService, symbolService } from '../../services';

jest.mock('../../services/tradeFeed', () => ({
  tradeFeedService: {
    subscribe: jest.fn(() => jest.fn()),
    unSubscribe: jest.fn(),
    getSocket: jest.fn(),
  },
}));

jest.mock('../../services/accountService', () => ({
  accountService: {
    getAccounts: jest.fn(),
    addAccount: jest.fn(),
    addAccountUser: jest.fn(),
    getAccountUsers: jest.fn(),
  },
}));

jest.mock('../../services/positionService', () => ({
  positionService: {
    getTrades: jest.fn(() => Promise.resolve([])),
    getPositions: jest.fn(() => Promise.resolve([])),
  },
}));

jest.mock('../../services/symbolService', () => ({
  symbolService: {
    getStocks: jest.fn(),
    createTicket: jest.fn(),
  },
}));

const mockAccounts = [
  { id: 1, displayName: 'Account 1' },
  { id: 2, displayName: 'Account 2' },
  { id: 3, displayName: 'Account 3' },
  { id: 4, displayName: 'Account 4' },
  { id: 5, displayName: 'Account 5' },
  { id: 6, displayName: 'Account 6' },
];

const mockStocks = [
  { ticker: 'AAPL', companyName: 'Apple Inc.' },
  { ticker: 'GOOGL', companyName: 'Alphabet Inc.' },
];

describe('Trade', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (accountService.getAccounts as jest.Mock).mockResolvedValue(mockAccounts);
    (symbolService.getStocks as jest.Mock).mockResolvedValue(mockStocks);
  });

  it('renders trade page with account dropdown', async () => {
    render(<Trade />);
    await waitFor(() => {
      expect(screen.getByText('Select Account')).toBeInTheDocument();
    });
  });

  it('renders Create Trade Ticket button', async () => {
    render(<Trade />);
    await waitFor(() => {
      expect(screen.getByText('Create Trade Ticket')).toBeInTheDocument();
    });
  });

  it('loads accounts on mount', async () => {
    render(<Trade />);
    await waitFor(() => {
      expect(accountService.getAccounts).toHaveBeenCalled();
    });
  });

  it('loads stocks on mount', async () => {
    render(<Trade />);
    await waitFor(() => {
      expect(symbolService.getStocks).toHaveBeenCalled();
    });
  });

  it('renders Create Trade Ticket button that can be clicked', async () => {
    render(<Trade />);
    await waitFor(() => {
      expect(screen.getByText('Create Trade Ticket')).toBeInTheDocument();
    });
    const button = screen.getByText('Create Trade Ticket');
    expect(button).toBeEnabled();
  });

  it('renders Trade Blotter section', async () => {
    render(<Trade />);
    await waitFor(() => {
      expect(screen.getByText('Trade Blotter')).toBeInTheDocument();
    });
  });

  it('renders Position Blotter section', async () => {
    render(<Trade />);
    await waitFor(() => {
      expect(screen.getByText('Position Blotter')).toBeInTheDocument();
    });
  });

  it('renders account dropdown with options', async () => {
    render(<Trade />);
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });
});
