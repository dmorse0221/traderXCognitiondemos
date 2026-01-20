import { Trade, Position } from '../models';
import { Environment } from '../env';

export const positionService = {
  async getTrades(accountId: number): Promise<Trade[]> {
    try {
      const response = await fetch(`${Environment.position_service_url}/trades/${accountId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching trades:', error);
      throw error;
    }
  },

  async getPositions(accountId: number): Promise<Position[]> {
    try {
      const response = await fetch(`${Environment.position_service_url}/positions/${accountId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching positions:', error);
      throw error;
    }
  },
};
