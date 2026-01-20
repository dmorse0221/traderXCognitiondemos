import React from 'react';
import { render, screen } from '@testing-library/react';
import { NotFound } from './NotFound';

describe('NotFound', () => {
  it('renders 404 heading', () => {
    render(<NotFound />);
    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
  });

  it('renders not found message', () => {
    render(<NotFound />);
    expect(screen.getByText('The page you are looking for does not exist.')).toBeInTheDocument();
  });
});
