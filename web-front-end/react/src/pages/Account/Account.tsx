import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Account as AccountType, AccountUser } from '../../models';
import { accountService } from '../../services';
import { EditAccount } from './EditAccount';
import { AssignUser } from './AssignUser';
import { ButtonCellRenderer } from './ButtonCellRenderer';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './Account.css';

export const Account: React.FC = () => {
  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [users, setUsers] = useState<AccountUser[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<AccountType | undefined>(undefined);
  const [accountToBeUpdate, setAccountToBeUpdate] = useState<AccountType | undefined>(undefined);
  const gridApiRef = useRef<GridApi | null>(null);

  const columnDefs: ColDef[] = [
    { field: 'id', flex: 1 },
    { field: 'displayName', flex: 2 },
    {
      headerName: 'Update',
      cellRenderer: ButtonCellRenderer,
      cellRendererParams: {
        clicked: (account: AccountType) => setAccountToBeUpdate(account),
      },
      flex: 1,
    },
  ];

  const columnDefsUser: ColDef[] = [
    { field: 'accountId', flex: 1 },
    { field: 'username', flex: 1 },
  ];

  const fetchAccounts = useCallback(async () => {
    try {
      const fetchedAccounts = await accountService.getAccounts();
      setAccounts(fetchedAccounts);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  }, []);

  const fetchAccountUsers = useCallback(async (accountId?: number) => {
    try {
      const fetchedUsers = await accountService.getAccountUsers();
      if (accountId) {
        setUsers(fetchedUsers.filter((user) => user.accountId === accountId));
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching account users:', error);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    if (selectedAccount) {
      fetchAccountUsers(selectedAccount.id);
    }
  }, [selectedAccount, fetchAccountUsers]);

  const handleUpdate = useCallback((account: AccountType) => {
    fetchAccounts();
    fetchAccountUsers(account?.id);
    setSelectedAccount(account);
  }, [fetchAccounts, fetchAccountUsers]);

  const onSelectionChanged = useCallback(() => {
    if (!gridApiRef.current) return;
    const selectedRows = gridApiRef.current.getSelectedRows() as AccountType[];
    if (selectedRows.length > 0) {
      setSelectedAccount(selectedRows[0]);
    }
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    gridApiRef.current = params.api;
  }, []);

  return (
    <div className="p-5 pt-3">
      <div className="d-flex flex-column">
        <EditAccount account={accountToBeUpdate} onUpdate={handleUpdate} />
        <div className="mt-4">
          <h6>Account List</h6>
          <div className="ag-theme-alpine" style={{ width: '800px', height: '300px' }}>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={accounts}
              rowSelection="single"
              onSelectionChanged={onSelectionChanged}
              onGridReady={onGridReady}
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <AssignUser
          accounts={accounts}
          account={selectedAccount}
          onUpdate={handleUpdate}
        />
        <div className="mt-4">
          <h6>Users List {selectedAccount ? `(${selectedAccount.displayName})` : ''}</h6>
          <div className="ag-theme-alpine" style={{ width: '800px', height: '300px' }}>
            <AgGridReact
              columnDefs={columnDefsUser}
              rowData={users}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
