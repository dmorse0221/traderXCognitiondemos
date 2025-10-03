import React, { useState, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { GetAccounts } from '../hooks/GetAccounts';
import { GetAccountUsers } from '../hooks/GetAccountUsers';
import { EditAccount } from '../components/EditAccount';
import { AssignUser } from '../components/AssignUser';
import { Account } from '../types/models';

export const AccountPage: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>();
  const [accountToUpdate, setAccountToUpdate] = useState<Account | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);
  
  const accounts = GetAccounts();
  const accountUsers = GetAccountUsers(selectedAccount?.id);

  const handleUpdate = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    window.location.reload();
  }, []);

  const accountColumnDefs: ColDef[] = [
    { field: 'id', flex: 1, headerName: 'ID' },
    { field: 'displayName', flex: 2, headerName: 'Display Name' },
    {
      headerName: 'Update',
      cellRenderer: (params: any) => {
        return (
          <button
            className="btn btn-sm btn-info"
            onClick={() => setAccountToUpdate(params.data)}
          >
            Update
          </button>
        );
      },
      flex: 1,
    },
  ];

  const userColumnDefs: ColDef[] = [
    { field: 'accountId', flex: 1, headerName: 'Account ID' },
    { field: 'username', flex: 1, headerName: 'Username' },
  ];

  const onAccountSelectionChanged = useCallback((event: any) => {
    const selectedRows = event.api.getSelectedRows();
    if (selectedRows.length > 0) {
      setSelectedAccount(selectedRows[0]);
    }
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <EditAccount account={accountToUpdate} onUpdate={handleUpdate} />
        <div style={{ marginTop: '16px' }}>
          <h5 style={{ marginBottom: '8px' }}>Account List</h5>
          <div className="ag-theme-alpine" style={{ height: 300, width: '100%', maxWidth: '800px' }}>
            <AgGridReact
              rowData={accounts}
              columnDefs={accountColumnDefs}
              rowSelection="single"
              onSelectionChanged={onAccountSelectionChanged}
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <AssignUser 
          account={selectedAccount} 
          accounts={accounts}
          onUpdate={handleUpdate} 
        />
        <div style={{ marginTop: '16px' }}>
          <h5 style={{ marginBottom: '8px' }}>
            Users List {selectedAccount ? `(${selectedAccount.displayName})` : ''}
          </h5>
          <div className="ag-theme-alpine" style={{ height: 300, width: '100%', maxWidth: '800px' }}>
            <AgGridReact
              rowData={accountUsers}
              columnDefs={userColumnDefs}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
