import { useEffect, useState } from "react";
import { AccountUser } from "../types";
import { Environment } from '../env';

export const GetAccountUsers = (accountId?: number) => {
  const [accountUsers, setAccountUsers] = useState<AccountUser[]>([]);
  
  useEffect(() => {
    if (!accountId) {
      setAccountUsers([]);
      return;
    }
    
    const loadAccountUsers = async () => {
      try {
        const response = await fetch(`${Environment.account_service_url}/accountuser/`);
        if (response.ok) {
          const users = await response.json();
          const filteredUsers = users.filter((user: AccountUser) => user.accountId === accountId);
          setAccountUsers(filteredUsers);
        } else {
          console.error('Failed to fetch account users');
          setAccountUsers([]);
        }
      } catch (error) {
        console.error('Error fetching account users:', error);
        setAccountUsers([]);
      }
    };
    
    loadAccountUsers();
  }, [accountId]);
  
  return accountUsers;
};
