import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { PositionBlotter } from './PositionBlotter';
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

const mockPositions = [
  { accountid: 1, security: 'AAPL', quantity: 100, updated: new Date() },
  { accountid: 1, security: 'GOOGL', quantity: 50, updated: new Date() },
];

describe('PositionBlotter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (positionService.getPositions as jest.Mock).mockResolvedValue(mockPositions);
  });

  it('renders Position Blotter heading', () => {
    render(<PositionBlotter />);
    expect(screen.getByText('Position Blotter')).toBeInTheDocument();
  });

  it('renders AG Grid container', () => {
    render(<PositionBlotter />);
    expect(screen.getByRole('treegrid')).toBeInTheDocument();
  });

  it('fetches positions when account is provided', async () => {
    render(<PositionBlotter account={mockAccount} />);
    await waitFor(() => {
      expect(positionService.getPositions).toHaveBeenCalledWith(1);
    });
  });

  it('subscribes to position feed when account is provided', async () => {
    render(<PositionBlotter account={mockAccount} />);
    await waitFor(() => {
      expect(tradeFeedService.subscribe).toHaveBeenCalledWith(
        '/accounts/1/positions',
        expect.any(Function)
      );
    });
  });

  it('does not fetch positions when no account is provided', () => {
    render(<PositionBlotter />);
    expect(positionService.getPositions).not.toHaveBeenCalled();
  });

  it('does not subscribe to feed when no account is provided', () => {
    render(<PositionBlotter />);
    expect(tradeFeedService.subscribe).not.toHaveBeenCalled();
  });
});
