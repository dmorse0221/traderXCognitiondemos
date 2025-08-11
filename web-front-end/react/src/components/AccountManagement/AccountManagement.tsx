import React, { useState, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Button, Box, Typography, Container } from '@mui/material';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { GetAccounts, GetAccountUsers } from '../../hooks';
import { AccountData, AccountUser } from '../../types';
import { CreateAccount, CreateAccountUser } from '../../ActionButtons';
import { EditAccount } from './EditAccount';
import { AssignUser } from './AssignUser';

export const AccountManagement: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<AccountData | undefined>();
  const [accountToUpdate, setAccountToUpdate] = useState<AccountData | undefined>();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const accountGridRef = useRef<AgGridReact>(null);
  const userGridRef = useRef<AgGridReact>(null);
  
  const accounts = GetAccounts();
  const accountUsers = GetAccountUsers(selectedAccount?.id);

  const accountColumnDefs: ColDef[] = [
    {
      field: 'id',
      flex: 1,
      headerName: 'Account ID'
    },
    {
      field: 'displayName',
      flex: 2,
      headerName: 'Display Name'
    },
    {
      headerName: 'Update',
      cellRenderer: (params: any) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => setAccountToUpdate(params.data)}
        >
          Edit
        </Button>
      ),
      flex: 1
    }
  ];

  const userColumnDefs: ColDef[] = [
    {
      field: 'accountId',
      flex: 1,
      headerName: 'Account ID'
    },
    {
      field: 'username',
      flex: 1,
      headerName: 'Username'
    }
  ];

  const onAccountSelectionChanged = useCallback(() => {
    const selectedRows = accountGridRef.current?.api?.getSelectedRows() as AccountData[];
    if (selectedRows && selectedRows.length > 0) {
      setSelectedAccount(selectedRows[0]);
    } else {
      setSelectedAccount(undefined);
    }
  }, []);

  const onAccountGridReady = useCallback((params: GridReadyEvent) => {
  }, []);

  const onUserGridReady = useCallback((params: GridReadyEvent) => {
  }, []);

  const handleAccountUpdate = useCallback((account: AccountData) => {
    setRefreshTrigger(prev => prev + 1);
    setSelectedAccount(account);
    setAccountToUpdate(undefined);
  }, []);

  const handleUserUpdate = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Account Management
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <EditAccount 
          account={accountToUpdate}
          onUpdate={handleAccountUpdate}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <CreateAccount />
        </Box>
        
        <Typography variant="h6" gutterBottom>
          Account List
        </Typography>
        
        <Box className="ag-theme-alpine" sx={{ height: 300, width: '100%' }}>
          <AgGridReact
            ref={accountGridRef}
            rowData={accounts}
            columnDefs={accountColumnDefs}
            rowSelection="single"
            onSelectionChanged={onAccountSelectionChanged}
            onGridReady={onAccountGridReady}
            suppressRowClickSelection={false}
          />
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <AssignUser 
          account={selectedAccount}
          accounts={accounts}
          onUpdate={handleUserUpdate}
        />
        
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Users List {selectedAccount ? `(${selectedAccount.displayName})` : ''}
        </Typography>
        
        <Box className="ag-theme-alpine" sx={{ height: 300, width: '100%' }}>
          <AgGridReact
            ref={userGridRef}
            rowData={accountUsers}
            columnDefs={userColumnDefs}
            onGridReady={onUserGridReady}
          />
        </Box>
      </Box>
    </Container>
  );
};
