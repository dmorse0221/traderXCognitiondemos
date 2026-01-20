import { positionService } from './positionService';

global.fetch = jest.fn();

describe('positionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTrades', () => {
    it('fetches trades for account successfully', async () => {
      const mockTrades = [
        { id: 'TRADE-1', accountid: 1, security: 'AAPL', quantity: 100, side: 'Buy', state: 'New' },
      ];
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTrades),
      });

      const result = await positionService.getTrades(1);
      expect(result).toEqual(mockTrades);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/trades/1')
      );
    });

    it('throws error when fetch trades fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(positionService.getTrades(1)).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('getPositions', () => {
    it('fetches positions for account successfully', async () => {
      const mockPositions = [
        { accountid: 1, security: 'AAPL', quantity: 100 },
      ];
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPositions),
      });

      const result = await positionService.getPositions(1);
      expect(result).toEqual(mockPositions);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/positions/1')
      );
    });

    it('throws error when fetch positions fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(positionService.getPositions(1)).rejects.toThrow('HTTP error! status: 500');
    });
  });
});
