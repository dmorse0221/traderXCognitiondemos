import { useEffect, useState } from "react";
import { User } from "../types";
import { Environment } from '../env';

export const GetUsers = (searchQuery?: string) => {
  const [users, setUsers] = useState<User[]>([]);
  
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 3) {
      setUsers([]);
      return;
    }
    
    const loadUsers = async () => {
      try {
        const response = await fetch(`${Environment.people_service_url}/People/GetMatchingPeople?SearchText=${searchQuery}`);
        if (response.ok) {
          const users = await response.json();
          setUsers(users);
        } else {
          console.error('Failed to fetch users');
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    };
    
    loadUsers();
  }, [searchQuery]);
  
  return users;
};
