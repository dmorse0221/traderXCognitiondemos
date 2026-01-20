import React, { useState, useEffect, useCallback } from 'react';
import { Account, Stock, TradeTicket as TradeTicketType } from '../../models';
import { accountService, symbolService } from '../../services';
import { TradeBlotter } from './TradeBlotter';
import { PositionBlotter } from './PositionBlotter';
import { TradeTicket } from './TradeTicket';
import './Trade.css';

export const Trade: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountModel, setAccountModel] = useState<Account | undefined>(undefined);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [createTicketResponse, setCreateTicketResponse] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    accountService.getAccounts()
      .then((fetchedAccounts) => {
        setAccounts(fetchedAccounts);
        if (fetchedAccounts.length > 5) {
          setAccountModel(fetchedAccounts[5]);
        } else if (fetchedAccounts.length > 0) {
          setAccountModel(fetchedAccounts[0]);
        }
        console.log(fetchedAccounts);
      })
      .catch((error) => {
        console.error('Error fetching accounts:', error);
      });

    symbolService.getStocks()
      .then((fetchedStocks) => {
        setStocks(fetchedStocks);
      })
      .catch((error) => {
        console.error('Error fetching stocks:', error);
      });
  }, []);

  const handleAccountChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(event.target.value);
    const selectedAccount = accounts.find((acc) => acc.id === selectedId);
    if (selectedAccount) {
      console.log('onAccountChange', selectedAccount);
      setAccountModel(selectedAccount);
    }
  }, [accounts]);

  const openTicket = useCallback(() => {
    setShowModal(true);
  }, []);

  const closeTicket = useCallback(() => {
    setShowModal(false);
  }, []);

  const createTradeTicket = useCallback((ticket: TradeTicketType) => {
    console.log('createTradeTicket', ticket);
    symbolService.createTicket(ticket)
      .then((response) => {
        console.log(response);
        setCreateTicketResponse({ success: true, message: JSON.stringify(response) });
        setTimeout(() => setCreateTicketResponse(null), 2000);
      })
      .catch((error) => {
        console.error('Error creating ticket:', error);
        setCreateTicketResponse({ success: false, message: 'Error creating ticket' });
        setTimeout(() => setCreateTicketResponse(null), 2000);
      });
    closeTicket();
  }, [closeTicket]);

  const onCloseAlert = useCallback(() => {
    setCreateTicketResponse(null);
  }, []);

  return (
    <div className="trade-container p-5">
      <div className="trade-ops mb-4">
        <div className="trade-filter me-3">
          <select
            className="form-select"
            value={accountModel?.id || ''}
            onChange={handleAccountChange}
          >
            <option value="">Select Account</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.displayName}
              </option>
            ))}
          </select>
        </div>
        <div className="trade-ticket mb-4">
          <button
            type="button"
            id="createTicketBtn"
            className="btn btn-sm btn-primary mb-2"
            onClick={openTicket}
          >
            Create Trade Ticket
          </button>
          {createTicketResponse && (
            <div
              className={`alert ${createTicketResponse.success ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}
              role="alert"
            >
              {createTicketResponse.message}
              <button type="button" className="btn-close" onClick={onCloseAlert}></button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <TradeTicket
                stocks={stocks}
                account={accountModel}
                onCreate={createTradeTicket}
                onCancel={closeTicket}
              />
            </div>
          </div>
        </div>
      )}

      <div className="trade-blotter">
        <div className="trade-blotter-items me-2">
          <TradeBlotter account={accountModel} />
        </div>
        <div className="position-blotter-items">
          <PositionBlotter account={accountModel} />
        </div>
      </div>
    </div>
  );
};

export default Trade;
