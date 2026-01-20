import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ButtonCellRenderer } from './ButtonCellRenderer';

describe('ButtonCellRenderer', () => {
  const mockClicked = jest.fn();
  const mockData = { id: 1, displayName: 'Test Account' };

  const defaultProps = {
    clicked: mockClicked,
    data: mockData,
    value: undefined,
    valueFormatted: undefined,
    getValue: jest.fn(),
    setValue: jest.fn(),
    formatValue: jest.fn(),
    column: {} as any,
    colDef: {} as any,
    node: {} as any,
    rowIndex: 0,
    api: {} as any,
    columnApi: {} as any,
    context: undefined,
    refreshCell: jest.fn(),
    eGridCell: document.createElement('div'),
    eParentOfValue: document.createElement('div'),
    registerRowDragger: jest.fn(),
    setTooltip: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Update button', () => {
    render(<ButtonCellRenderer {...defaultProps} />);
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('calls clicked callback with data when button is clicked', () => {
    render(<ButtonCellRenderer {...defaultProps} />);
    fireEvent.click(screen.getByText('Update'));
    expect(mockClicked).toHaveBeenCalledWith(mockData);
  });

  it('renders button with correct styling', () => {
    render(<ButtonCellRenderer {...defaultProps} />);
    const button = screen.getByText('Update');
    expect(button).toHaveClass('btn', 'btn-sm', 'btn-outline-primary');
  });
});
