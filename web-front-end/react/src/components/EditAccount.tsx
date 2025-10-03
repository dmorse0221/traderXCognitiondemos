import React, { useState, useEffect } from 'react';
import { Account } from '../types/models';
import { Environment } from '../env';

interface EditAccountProps {
  account?: Account;
  onUpdate: () => void;
}

export const EditAccount: React.FC<EditAccountProps> = ({ account, onUpdate }) => {
  const [displayName, setDisplayName] = useState('');
  const [response, setResponse] = useState<{ success: boolean; msg: string } | null>(null);

  useEffect(() => {
    if (account?.displayName) {
      setDisplayName(account.displayName);
    }
  }, [account]);

  const handleSubmit = async () => {
    if (!displayName.trim()) return;

    const accountData = { ...account, displayName };
    
    try {
      await fetch(`${Environment.account_service_url}/account/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountData),
      });
      
      setResponse({ 
        success: true, 
        msg: `Account ${account?.id ? 'updated' : 'added'} successfully!` 
      });
      onUpdate();
      handleReset();
      setTimeout(() => setResponse(null), 2000);
    } catch (error) {
      setResponse({ success: false, msg: 'There was an error!' });
      console.error(error);
      setTimeout(() => setResponse(null), 2000);
    }
  };

  const handleReset = () => {
    setDisplayName('');
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '8px' }}>
        <input
          type="text"
          placeholder="Account name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="form-control me-4"
          required
          style={{ maxWidth: '300px' }}
        />
        <button 
          type="button" 
          className="btn btn-sm btn-primary me-3 account-btn" 
          onClick={handleSubmit}
        >
          {account ? 'Update' : 'Add'} Account
        </button>
        <button 
          type="button" 
          className="btn btn-sm btn-secondary me-4" 
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
      {response && (
        <div 
          className={`alert alert-${response.success ? 'success' : 'danger'} alert-dismissible fade show`}
          role="alert"
          style={{ maxWidth: '600px' }}
        >
          {response.msg}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setResponse(null)}
            aria-label="Close"
          ></button>
        </div>
      )}
    </div>
  );
};
