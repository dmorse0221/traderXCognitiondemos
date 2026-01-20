export interface Account {
  id: number;
  displayName: string;
}

export interface AccountUser {
  username: string;
  accountId: number;
}

export interface User {
  logonId: string;
  fullName: string;
  email: string;
  employeeId: string;
  department: string;
  photoUrl: string;
}

export type Side = 'Buy' | 'Sell';

export type State = 'New' | 'Processing' | 'Pending' | 'Settled';

export interface Trade {
  accountid: number;
  created: Date;
  id: string;
  quantity: number;
  security: string;
  side: Side;
  state: State;
  updated: Date;
}

export interface Position {
  accountid: number;
  quantity: number;
  security: string;
  updated: Date;
}

export interface TradeTicket {
  side: Side;
  quantity: number;
  security: string;
  accountId: number;
}

export interface Stock {
  ticker: string;
  companyName: string;
}

export interface Symbol {
  name: string;
  sector: string;
  symbol: string;
}
