import { accountService } from './accountService';

global.fetch = jest.fn();

describe('accountService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAccounts', () => {
    it('fetches accounts successfully', async () => {
      const mockAccounts = [{ id: 1, displayName: 'Account 1' }];
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAccounts),
      });

      const result = await accountService.getAccounts();
      expect(result).toEqual(mockAccounts);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/account/'),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('throws error when fetch fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(accountService.getAccounts()).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('addAccount', () => {
    it('adds account successfully', async () => {
      const mockAccount = { displayName: 'New Account' };
      const mockResponse = { id: 1, displayName: 'New Account' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await accountService.addAccount(mockAccount);
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/account/'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(mockAccount),
        })
      );
    });

    it('throws error when add fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      await expect(accountService.addAccount({ displayName: 'Test' })).rejects.toThrow('HTTP error! status: 400');
    });
  });

  describe('addAccountUser', () => {
    it('adds account user successfully', async () => {
      const mockAccountUser = { username: 'user1', accountId: 1 };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAccountUser),
      });

      const result = await accountService.addAccountUser(mockAccountUser);
      expect(result).toEqual(mockAccountUser);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/accountuser/'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(mockAccountUser),
        })
      );
    });

    it('throws error when add account user fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      await expect(accountService.addAccountUser({ username: 'user1', accountId: 1 })).rejects.toThrow('HTTP error! status: 400');
    });
  });

  describe('getAccountUsers', () => {
    it('fetches account users successfully', async () => {
      const mockAccountUsers = [{ username: 'user1', accountId: 1 }];
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAccountUsers),
      });

      const result = await accountService.getAccountUsers();
      expect(result).toEqual(mockAccountUsers);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/accountuser/'),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('throws error when fetch account users fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(accountService.getAccountUsers()).rejects.toThrow('HTTP error! status: 500');
    });
  });
});
