import { Account, AccountUser } from '../models';
import { Environment } from '../env';

const httpOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const accountService = {
  async getAccounts(): Promise<Account[]> {
    try {
      const response = await fetch(`${Environment.account_service_url}/account/`, httpOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  },

  async addAccount(account: Partial<Account>): Promise<Account> {
    try {
      const response = await fetch(`${Environment.account_service_url}/account/`, {
        method: 'POST',
        ...httpOptions,
        body: JSON.stringify(account),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error adding account:', error);
      throw error;
    }
  },

  async addAccountUser(accountUser: AccountUser): Promise<AccountUser> {
    try {
      const response = await fetch(`${Environment.account_service_url}/accountuser/`, {
        method: 'POST',
        ...httpOptions,
        body: JSON.stringify(accountUser),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error adding account user:', error);
      throw error;
    }
  },

  async getAccountUsers(): Promise<AccountUser[]> {
    try {
      const response = await fetch(`${Environment.account_service_url}/accountuser/`, httpOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching account users:', error);
      throw error;
    }
  },
};
