import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TradeTicket } from './TradeTicket';

const mockStocks = [
  { ticker: 'AAPL', companyName: 'Apple Inc.' },
  { ticker: 'GOOGL', companyName: 'Alphabet Inc.' },
  { ticker: 'MSFT', companyName: 'Microsoft Corporation' },
];

const mockAccount = { id: 1, displayName: 'Test Account' };

describe('TradeTicket', () => {
  const mockOnCreate = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders account label with account name', () => {
    render(
      <TradeTicket
        stocks={mockStocks}
        account={mockAccount}
        onCreate={mockOnCreate}
        onCancel={mockOnCancel}
      />
    );
    expect(screen.getByDisplayValue('Test Account')).toBeInTheDocument();
  });

  it('renders security search input', () => {
    render(
      <TradeTicket
        stocks={mockStocks}
        account={mockAccount}
        onCreate={mockOnCreate}
        onCancel={mockOnCancel}
      />
    );
    expect(screen.getByPlaceholderText('Search security')).toBeInTheDocument();
  });

  it('renders Buy and Sell radio buttons', () => {
    render(
      <TradeTicket
        stocks={mockStocks}
        account={mockAccount}
        onCreate={mockOnCreate}
        onCancel={mockOnCancel}
      />
    );
    expect(screen.getByLabelText('Buy')).toBeInTheDocument();
    expect(screen.getByLabelText('Sell')).toBeInTheDocument();
  });

  it('renders quantity input', () => {
    render(
      <TradeTicket
        stocks={mockStocks}
        account={mockAccount}
        onCreate={mockOnCreate}
        onCancel={mockOnCancel}
      />
    );
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('renders Create and Close buttons', () => {
    render(
      <TradeTicket
        stocks={mockStocks}
        account={mockAccount}
        onCreate={mockOnCreate}
        onCancel={mockOnCancel}
      />
    );
    expect(screen.getByText('Create')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('calls onCancel when Close button is clicked', () => {
    render(
      <TradeTicket
        stocks={mockStocks}
        account={mockAccount}
        onCreate={mockOnCreate}
        onCancel={mockOnCancel}
      />
    );
    fireEvent.click(screen.getByText('Close'));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('does not call onCreate when security is not selected', () => {
    render(
      <TradeTicket
        stocks={mockStocks}
        account={mockAccount}
        onCreate={mockOnCreate}
        onCancel={mockOnCancel}
      />
    );
    fireEvent.click(screen.getByText('Create'));
    expect(mockOnCreate).not.toHaveBeenCalled();
  });

  it('changes side when Sell is selected', () => {
    render(
      <TradeTicket
        stocks={mockStocks}
        account={mockAccount}
        onCreate={mockOnCreate}
        onCancel={mockOnCancel}
      />
    );
    const sellRadio = screen.getByLabelText('Sell');
    fireEvent.click(sellRadio);
    expect(sellRadio).toBeChecked();
  });

  it('updates quantity when input changes', () => {
    render(
      <TradeTicket
        stocks={mockStocks}
        account={mockAccount}
        onCreate={mockOnCreate}
        onCancel={mockOnCancel}
      />
    );
    const quantityInput = screen.getByRole('spinbutton');
    fireEvent.change(quantityInput, { target: { value: '100' } });
    expect(quantityInput).toHaveValue(100);
  });

  it('filters stocks when searching', async () => {
    render(
      <TradeTicket
        stocks={mockStocks}
        account={mockAccount}
        onCreate={mockOnCreate}
        onCancel={mockOnCancel}
      />
    );
    const searchInput = screen.getByPlaceholderText('Search security');
    fireEvent.change(searchInput, { target: { value: 'Apple' } });
    fireEvent.focus(searchInput);
    await waitFor(() => {
      expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
    });
  });

  it('selects stock from dropdown', async () => {
    render(
      <TradeTicket
        stocks={mockStocks}
        account={mockAccount}
        onCreate={mockOnCreate}
        onCancel={mockOnCancel}
      />
    );
    const searchInput = screen.getByPlaceholderText('Search security');
    fireEvent.change(searchInput, { target: { value: 'Apple' } });
    fireEvent.focus(searchInput);
    await waitFor(() => {
      expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
    });
    fireEvent.mouseDown(screen.getByText('Apple Inc.'));
    expect(searchInput).toHaveValue('Apple Inc.');
  });

  it('Buy is selected by default', () => {
    render(
      <TradeTicket
        stocks={mockStocks}
        account={mockAccount}
        onCreate={mockOnCreate}
        onCancel={mockOnCancel}
      />
    );
    expect(screen.getByLabelText('Buy')).toBeChecked();
  });
});
