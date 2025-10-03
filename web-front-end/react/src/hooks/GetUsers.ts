import { User } from "../types/models";
import { Environment } from '../env';

export const GetUsers = async (searchText: string): Promise<User[]> => {
  if (!searchText || searchText.length < 3) {
    return [];
  }
  
  try {
    const response = await fetch(
      `${Environment.people_service_url}/People/GetMatchingPeople?SearchText=${searchText}&Take=10`
    );
    if (response.ok) {
      const data = await response.json();
      return data.people || [];
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
  return [];
};
