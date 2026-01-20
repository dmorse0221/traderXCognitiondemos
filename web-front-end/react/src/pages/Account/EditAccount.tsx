import React, { useState, useEffect, useCallback } from 'react';
import { Account } from '../../models';
import { accountService } from '../../services';

interface EditAccountProps {
  account?: Account;
  onUpdate: (account: Account) => void;
}

export const EditAccount: React.FC<EditAccountProps> = ({ account, onUpdate }) => {
  const [displayName, setDisplayName] = useState<string>('');
  const [accountResponse, setAccountResponse] = useState<{ success: boolean; msg: string } | null>(null);

  useEffect(() => {
    if (account?.displayName) {
      setDisplayName(account.displayName);
    }
  }, [account]);

  const handleReset = useCallback(() => {
    setDisplayName('');
  }, []);

  const handleAdd = useCallback(async () => {
    if (!displayName?.trim()) {
      return;
    }
    const accountData = { ...account, displayName } as Account;
    try {
      await accountService.addAccount(accountData);
      setAccountResponse({ success: true, msg: `Account ${account?.id ? 'updated' : 'added'} successfully!` });
      onUpdate(accountData);
      handleReset();
    } catch (err) {
      console.error(err);
      setAccountResponse({ success: false, msg: 'There is some error!' });
    }
  }, [displayName, account, onUpdate, handleReset]);

  const onCloseAlert = useCallback(() => {
    setAccountResponse(null);
  }, []);

  useEffect(() => {
    if (accountResponse) {
      const timer = setTimeout(() => {
        setAccountResponse(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [accountResponse]);

  return (
    <>
      <form className="d-flex flex-row">
        <input
          id="new-account"
          name="accountname"
          placeholder="Account name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="form-control me-4"
          type="text"
          required
        />
        <button
          type="button"
          className="btn btn-sm btn-primary me-3 account-btn"
          onClick={handleAdd}
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
      </form>
      {accountResponse && (
        <div
          className={`alert ${accountResponse.success ? 'alert-success' : 'alert-danger'} alert-dismissible fade show mt-2`}
          role="alert"
        >
          {accountResponse.msg}
          <button type="button" className="btn-close" onClick={onCloseAlert}></button>
        </div>
      )}
    </>
  );
};

export default EditAccount;
