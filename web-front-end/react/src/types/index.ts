export interface AccountData {
  id: number;
  displayName: string;
}

export interface User {
  logonId: string;
  fullName: string;
  email: string;
  employeeId: string;
  department: string;
  photoUrl: string;
}

export interface AccountUser {
  username: string;
  accountId: number;
}

export type TradeSide = 'Buy' | 'Sell';

export interface TradeData {
  id?: string;
  accountId?: number;
  security: string;
  side?: TradeSide;
  state?: string;
  quantity: number;
  updated?: Date;
  created?: Date;
}

export interface PositionData {
  accountId: number;
  security: string;
  quantity: number;
  updated: Date;
}
