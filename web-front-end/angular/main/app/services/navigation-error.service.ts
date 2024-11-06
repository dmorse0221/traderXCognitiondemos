import { Injectable } from '@angular/core';
import { NavigationError } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationErrorService {
  handleError(error: NavigationError): void {
    // Centralized error handling for navigation errors
    console.error('Navigation Error:', error);
    // Add error reporting logic here
  }
}
