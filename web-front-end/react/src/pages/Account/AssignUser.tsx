import React, { useState, useCallback, useEffect } from 'react';
import { Account, User } from '../../models';
import { accountService, userService } from '../../services';

interface AssignUserProps {
  accounts: Account[];
  account?: Account;
  onUpdate: (account: Account) => void;
}

export const AssignUser: React.FC<AssignUserProps> = ({ accounts, account, onUpdate }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [search, setSearch] = useState<string>('');
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>(account);
  const [addUserResponse, setAddUserResponse] = useState<{ success: boolean; msg: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setSelectedAccount(account);
  }, [account]);

  const handleSearchChange = useCallback(async (value: string) => {
    setSearch(value);
    if (value && value.length > 2) {
      try {
        const fetchedUsers = await userService.getUsers(value);
        setUsers(fetchedUsers);
        setShowDropdown(true);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    } else {
      setUsers([]);
      setShowDropdown(false);
    }
  }, []);

  const handleSelectUser = useCallback((user: User) => {
    setSelectedUser(user);
    setSearch(user.fullName);
    setShowDropdown(false);
  }, []);

  const handleAccountChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(event.target.value);
    const acc = accounts.find((a) => a.id === selectedId);
    setSelectedAccount(acc);
  }, [accounts]);

  const handleReset = useCallback((fromAdd: boolean = false) => {
    setSelectedUser(undefined);
    setSearch('');
    if (!fromAdd) {
      setSelectedAccount(undefined);
    }
  }, []);

  const handleAdd = useCallback(async () => {
    if (!selectedUser || !selectedAccount) {
      return;
    }
    const accountUser = { username: selectedUser.logonId, accountId: selectedAccount.id };
    try {
      await accountService.addAccountUser(accountUser);
      setAddUserResponse({ success: true, msg: 'User added successfully!' });
      onUpdate(selectedAccount);
      handleReset(true);
    } catch (err) {
      setAddUserResponse({ success: false, msg: 'There is some error!' });
      console.error(err);
    }
  }, [selectedUser, selectedAccount, onUpdate, handleReset]);

  const onCloseAlert = useCallback(() => {
    setAddUserResponse(null);
  }, []);

  useEffect(() => {
    if (addUserResponse) {
      const timer = setTimeout(() => {
        setAddUserResponse(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [addUserResponse]);

  return (
    <>
      <form className="d-flex flex-row">
        <div className="position-relative me-4" style={{ width: '300px' }}>
          <input
            id="account-user"
            name="account-user"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => search.length > 2 && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            aria-label="Add User to Account"
            placeholder="Add User to Account"
            className="form-control"
            autoComplete="off"
          />
          {showDropdown && users.length > 0 && (
            <ul className="dropdown-menu show position-absolute w-100" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {users.map((user) => (
                <li key={user.logonId}>
                  <button
                    type="button"
                    className="dropdown-item"
                    onMouseDown={() => handleSelectUser(user)}
                  >
                    {user.fullName}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <select
          id="account-name"
          className="form-select me-4"
          style={{ height: '38px', width: '200px' }}
          value={selectedAccount?.id || ''}
          onChange={handleAccountChange}
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
          className="btn btn-sm btn-primary me-4"
          onClick={handleAdd}
        >
          Add User
        </button>
        <button
          type="button"
          className="btn btn-sm btn-secondary"
          onClick={() => handleReset(false)}
        >
          Reset
        </button>
      </form>
      {addUserResponse && (
        <div
          className={`alert ${addUserResponse.success ? 'alert-success' : 'alert-danger'} alert-dismissible fade show mt-2`}
          role="alert"
        >
          {addUserResponse.msg}
          <button type="button" className="btn-close" onClick={onCloseAlert}></button>
        </div>
      )}
    </>
  );
};

export default AssignUser;
