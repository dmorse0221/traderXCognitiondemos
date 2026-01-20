import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { Account } from '../../models';

interface ButtonCellRendererProps extends ICellRendererParams {
  clicked: (account: Account) => void;
}

export const ButtonCellRenderer: React.FC<ButtonCellRendererProps> = (props) => {
  const handleClick = () => {
    props.clicked(props.data);
  };

  return (
    <button
      type="button"
      className="btn btn-sm btn-outline-primary"
      onClick={handleClick}
    >
      Update
    </button>
  );
};

export default ButtonCellRenderer;
