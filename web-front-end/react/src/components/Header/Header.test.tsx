import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Header', () => {
  it('renders the header with logo and title', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('FINOS | TraderX Sample Application')).toBeInTheDocument();
  });

  it('renders TraderX logo', () => {
    renderWithRouter(<Header />);
    const logo = screen.getByAltText('TraderX Logo');
    expect(logo).toBeInTheDocument();
  });

  it('renders FINOS logo', () => {
    renderWithRouter(<Header />);
    const logo = screen.getByAltText('FINOS Logo');
    expect(logo).toBeInTheDocument();
  });

  it('renders Trade navigation link', () => {
    renderWithRouter(<Header />);
    const tradeLink = screen.getByText('Trade');
    expect(tradeLink).toBeInTheDocument();
    expect(tradeLink).toHaveAttribute('href', '/trade');
  });

  it('renders Account navigation link', () => {
    renderWithRouter(<Header />);
    const accountLink = screen.getByText('Account');
    expect(accountLink).toBeInTheDocument();
    expect(accountLink).toHaveAttribute('href', '/account');
  });

  it('applies active class to current route', () => {
    renderWithRouter(<Header />);
    const tradeLink = screen.getByText('Trade');
    expect(tradeLink).toHaveClass('nav-link');
  });
});
