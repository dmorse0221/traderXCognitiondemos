import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { TradeBlotter } from './TradeBlotter';
import { positionService, tradeFeedService } from '../../services';

jest.mock('../../services/tradeFeed', () => ({
  tradeFeedService: {
    subscribe: jest.fn(() => jest.fn()),
    unSubscribe: jest.fn(),
  },
}));

jest.mock('../../services/positionService', () => ({
  positionService: {
    getTrades: jest.fn(),
    getPositions: jest.fn(),
  },
}));

const mockAccount = { id: 1, displayName: 'Test Account' };

const mockTrades = [
  { id: 'TRADE-1', accountid: 1, security: 'AAPL', quantity: 100, side: 'Buy', state: 'New', created: new Date(), updated: new Date() },
  { id: 'TRADE-2', accountid: 1, security: 'GOOGL', quantity: 50, side: 'Sell', state: 'Settled', created: new Date(), updated: new Date() },
];

describe('TradeBlotter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (positionService.getTrades as jest.Mock).mockResolvedValue(mockTrades);
  });

  it('renders Trade Blotter heading', () => {
    render(<TradeBlotter />);
    expect(screen.getByText('Trade Blotter')).toBeInTheDocument();
  });

  it('renders AG Grid container', () => {
    render(<TradeBlotter />);
    expect(screen.getByRole('treegrid')).toBeInTheDocument();
  });

  it('fetches trades when account is provided', async () => {
    render(<TradeBlotter account={mockAccount} />);
    await waitFor(() => {
      expect(positionService.getTrades).toHaveBeenCalledWith(1);
    });
  });

  it('subscribes to trade feed when account is provided', async () => {
    render(<TradeBlotter account={mockAccount} />);
    await waitFor(() => {
      expect(tradeFeedService.subscribe).toHaveBeenCalledWith(
        '/accounts/1/trades',
        expect.any(Function)
      );
    });
  });

  it('does not fetch trades when no account is provided', () => {
    render(<TradeBlotter />);
    expect(positionService.getTrades).not.toHaveBeenCalled();
  });

  it('does not subscribe to feed when no account is provided', () => {
    render(<TradeBlotter />);
    expect(tradeFeedService.subscribe).not.toHaveBeenCalled();
  });
});
