import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './components/Header';

describe('App Integration', () => {
  it('renders header with navigation', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByText('FINOS | TraderX Sample Application')).toBeInTheDocument();
  });

  it('renders Trade and Account navigation links', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByText('Trade')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
  });
});
