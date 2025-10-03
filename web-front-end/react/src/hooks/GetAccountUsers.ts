import { useEffect, useState } from "react";
import { AccountUser } from "../types/models";
import { Environment } from '../env';

export const GetAccountUsers = (accountId?: number) => {
  const [accountUsers, setAccountUsers] = useState<AccountUser[]>([]);
  
  useEffect(() => {
    const loadAccountUsers = async () => {
      try {
        const response = await fetch(`${Environment.account_service_url}/accountuser/`);
        if (response.ok) {
          const users = await response.json();
          if (accountId) {
            setAccountUsers(users.filter((u: AccountUser) => u.accountId === accountId));
          } else {
            setAccountUsers(users);
          }
        }
      } catch (error) {
        console.error("Error fetching account users:", error);
      }
    };
    loadAccountUsers();
  }, [accountId]);
  
  return accountUsers;
};
