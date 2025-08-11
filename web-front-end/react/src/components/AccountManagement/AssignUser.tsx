import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Autocomplete, 
  Alert,
  Typography
} from '@mui/material';
import { AccountData, User } from '../../types';
import { GetUsers } from '../../hooks';
import { Environment } from '../../env';

interface AssignUserProps {
  account?: AccountData;
  accounts: AccountData[];
  onUpdate: () => void;
}

export const AssignUser: React.FC<AssignUserProps> = ({ account, accounts, onUpdate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const users = GetUsers(searchQuery);

  const handleAdd = async () => {
    if (!selectedUser || !account) {
      setMessage({ type: 'error', text: 'Please select a user and account' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const accountUser = { 
        username: selectedUser.logonId, 
        accountId: account.id 
      };

      const response = await fetch(`${Environment.account_service_url}/accountuser/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountUser),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'User added successfully!' });
        onUpdate();
        handleReset(true);
      } else {
        setMessage({ type: 'error', text: 'Failed to add user to account' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error adding user to account' });
      console.error('Error adding user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (fromAdd: boolean = false) => {
    setSelectedUser(null);
    setSearchQuery('');
    if (!fromAdd) {
      setMessage(null);
    }
  };

  const handleCloseAlert = () => {
    setMessage(null);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Assign User to Account
      </Typography>
      
      {message && (
        <Alert 
          severity={message.type} 
          onClose={handleCloseAlert}
          sx={{ mb: 2 }}
        >
          {message.text}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <Autocomplete
          sx={{ minWidth: 300 }}
          options={users}
          getOptionLabel={(option) => `${option.fullName} (${option.logonId})`}
          value={selectedUser}
          onChange={(_, newValue) => setSelectedUser(newValue)}
          inputValue={searchQuery}
          onInputChange={(_, newInputValue) => setSearchQuery(newInputValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Users"
              placeholder="Type at least 3 characters to search..."
              variant="outlined"
              size="small"
            />
          )}
          loading={searchQuery.length >= 3 && users.length === 0}
          disabled={loading}
        />

        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={!selectedUser || !account || loading}
        >
          {loading ? 'Adding...' : 'Add User'}
        </Button>

        <Button
          variant="outlined"
          onClick={() => handleReset()}
          disabled={loading}
        >
          Reset
        </Button>
      </Box>

      {account && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Selected Account: {account.displayName} (ID: {account.id})
        </Typography>
      )}
    </Box>
  );
};
