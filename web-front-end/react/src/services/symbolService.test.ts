import { symbolService } from './symbolService';

global.fetch = jest.fn();

describe('symbolService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getStocks', () => {
    it('fetches stocks successfully', async () => {
      const mockStocks = [
        { ticker: 'AAPL', companyName: 'Apple Inc.' },
        { ticker: 'GOOGL', companyName: 'Alphabet Inc.' },
      ];
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStocks),
      });

      const result = await symbolService.getStocks();
      expect(result).toEqual(mockStocks);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/stocks')
      );
    });

    it('throws error when fetch stocks fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(symbolService.getStocks()).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('createTicket', () => {
    it('creates trade ticket successfully', async () => {
      const mockTicket = { side: 'Buy', quantity: 100, security: 'AAPL', accountId: 1 };
      const mockResponse = { id: 'TRADE-1', ...mockTicket };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await symbolService.createTicket(mockTicket as any);
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/trade/'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(mockTicket),
        })
      );
    });

    it('throws error when create ticket fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      await expect(symbolService.createTicket({ side: 'Buy', quantity: 100, security: 'AAPL', accountId: 1 })).rejects.toThrow('HTTP error! status: 400');
    });
  });
});
