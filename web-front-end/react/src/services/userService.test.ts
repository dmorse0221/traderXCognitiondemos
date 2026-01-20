import { userService } from './userService';

global.fetch = jest.fn();

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('fetches users successfully', async () => {
      const mockUsers = [
        { logonId: 'user1', fullName: 'John Doe', email: 'john@example.com', employeeId: '001', department: 'IT', photoUrl: '' },
      ];
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ people: mockUsers }),
      });

      const result = await userService.getUsers('John');
      expect(result).toEqual(mockUsers);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/People/GetMatchingPeople'),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('throws error when fetch users fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(userService.getUsers('John')).rejects.toThrow('HTTP error! status: 500');
    });

    it('returns empty array when no people in response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const result = await userService.getUsers('John');
      expect(result).toEqual([]);
    });
  });
});
