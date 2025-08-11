import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Alert
} from '@mui/material';
import { AccountData } from '../../types';
import { Environment } from '../../env';

interface EditAccountProps {
  account?: AccountData;
  onUpdate: (account: AccountData) => void;
}

export const EditAccount: React.FC<EditAccountProps> = ({ account, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (account) {
      setDisplayName(account.displayName);
      setOpen(true);
      setError(null);
      setSuccess(false);
    }
  }, [account]);

  const handleClose = () => {
    setOpen(false);
    setDisplayName('');
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async () => {
    if (!account || !displayName.trim()) {
      setError('Display name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${Environment.account_service_url}/account/${account.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: account.id,
          displayName: displayName.trim()
        }),
      });

      if (response.ok) {
        const updatedAccount = { ...account, displayName: displayName.trim() };
        setSuccess(true);
        onUpdate(updatedAccount);
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setError('Failed to update account');
      }
    } catch (error) {
      setError('Error updating account');
      console.error('Error updating account:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Account</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Account updated successfully!
          </Alert>
        )}
        <TextField
          autoFocus
          margin="dense"
          label="Display Name"
          fullWidth
          variant="outlined"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          disabled={loading}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading || !displayName.trim()}
        >
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
