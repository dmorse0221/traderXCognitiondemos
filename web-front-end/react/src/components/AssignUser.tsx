import React, { useState } from 'react';
import { Account, User } from '../types/models';
import { Environment } from '../env';
import { GetUsers } from '../hooks/GetUsers';

interface AssignUserProps {
  account?: Account;
  accounts: Account[];
  onUpdate: () => void;
}

export const AssignUser: React.FC<AssignUserProps> = ({ account, accounts, onUpdate }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>(account);
  const [searchText, setSearchText] = useState('');
  const [userOptions, setUserOptions] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [response, setResponse] = useState<{ success: boolean; msg: string } | null>(null);

  React.useEffect(() => {
    setSelectedAccount(account);
  }, [account]);

  const handleSearchChange = async (value: string) => {
    setSearchText(value);
    if (value.length >= 3) {
      const users = await GetUsers(value);
      setUserOptions(users);
      setShowDropdown(true);
    } else {
      setUserOptions([]);
      setShowDropdown(false);
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setSearchText(user.fullName);
    setShowDropdown(false);
  };

  const handleSubmit = async () => {
    if (!selectedUser || !selectedAccount) return;

    const accountUser = {
      username: selectedUser.logonId,
      accountId: selectedAccount.id,
    };

    try {
      await fetch(`${Environment.account_service_url}/accountuser/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountUser),
      });
      
      setResponse({ success: true, msg: 'User added successfully!' });
      onUpdate();
      handleReset(true);
      setTimeout(() => setResponse(null), 2000);
    } catch (error) {
      setResponse({ success: false, msg: 'There was an error!' });
      console.error(error);
      setTimeout(() => setResponse(null), 2000);
    }
  };

  const handleReset = (fromAdd: boolean = false) => {
    setSelectedUser(null);
    setSearchText('');
    setUserOptions([]);
    setShowDropdown(false);
    if (!fromAdd) {
      setSelectedAccount(undefined);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <input
            type="text"
            placeholder="Add User to Account"
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="form-control"
          />
          {showDropdown && userOptions.length > 0 && (
            <ul 
              className="dropdown-menu show" 
              style={{ 
                position: 'absolute', 
                top: '100%', 
                left: 0, 
                width: '100%',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 1000
              }}
            >
              {userOptions.map((user) => (
                <li key={user.logonId}>
                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={() => handleUserSelect(user)}
                  >
                    {user.fullName}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <select
          className="form-select"
          value={selectedAccount?.id || ''}
          onChange={(e) => {
            const accountId = parseInt(e.target.value);
            setSelectedAccount(accounts.find(a => a.id === accountId));
          }}
          style={{ maxWidth: '250px' }}
        >
          <option value="">Select an account</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.displayName}
            </option>
          ))}
        </select>
        <button 
          type="button" 
          className="btn btn-sm btn-primary" 
          onClick={handleSubmit}
        >
          Add User
        </button>
        <button 
          type="button" 
          className="btn btn-sm btn-secondary" 
          onClick={() => handleReset()}
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
