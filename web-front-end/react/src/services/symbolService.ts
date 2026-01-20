import { Stock, TradeTicket } from '../models';
import { Environment } from '../env';

export const symbolService = {
  async getStocks(): Promise<Stock[]> {
    try {
      const response = await fetch(`${Environment.reference_data_url}/stocks`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching stocks:', error);
      throw error;
    }
  },

  async createTicket(ticket: TradeTicket): Promise<unknown> {
    try {
      const response = await fetch(`${Environment.trade_service_url}/trade/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticket),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },
};
