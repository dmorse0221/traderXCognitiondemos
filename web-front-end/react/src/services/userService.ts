import { User } from '../models';
import { Environment } from '../env';

const httpOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const userService = {
  async getUsers(searchText: string): Promise<User[]> {
    try {
      const params = new URLSearchParams({
        SearchText: searchText,
        Take: '10',
      });
      const response = await fetch(
        `${Environment.people_service_url}/People/GetMatchingPeople?${params}`,
        httpOptions
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.people || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
};
