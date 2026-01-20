import React, { useState, useEffect, useCallback } from 'react';
import { Account, Stock, TradeTicket as TradeTicketType, Side } from '../../models';

interface TradeTicketProps {
  stocks: Stock[];
  account?: Account;
  onCreate: (ticket: TradeTicketType) => void;
  onCancel: () => void;
}

export const TradeTicket: React.FC<TradeTicketProps> = ({ stocks, account, onCreate, onCancel }) => {
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [ticket, setTicket] = useState<TradeTicketType>({
    quantity: 0,
    accountId: account?.id || 0,
    side: 'Buy',
    security: '',
  });
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setFilteredStocks(stocks);
    setTicket((prev) => ({
      ...prev,
      accountId: account?.id || 0,
    }));
  }, [stocks, account]);

  const handleCompanySearch = useCallback((value: string) => {
    setSelectedCompany(value);
    if (value.length > 0) {
      const filtered = stocks.filter((stock) =>
        stock.companyName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStocks(filtered);
      setShowDropdown(true);
    } else {
      setFilteredStocks(stocks);
      setShowDropdown(false);
    }
  }, [stocks]);

  const handleSelectStock = useCallback((stock: Stock) => {
    setSelectedCompany(stock.companyName);
    setTicket((prev) => ({
      ...prev,
      security: stock.ticker,
    }));
    setShowDropdown(false);
  }, []);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setShowDropdown(false);
      if (!selectedCompany) {
        setTicket((prev) => ({
          ...prev,
          security: '',
        }));
      }
    }, 200);
  }, [selectedCompany]);

  const handleSideChange = useCallback((side: Side) => {
    setTicket((prev) => ({
      ...prev,
      side,
    }));
  }, []);

  const handleQuantityChange = useCallback((value: number) => {
    setTicket((prev) => ({
      ...prev,
      quantity: value,
    }));
  }, []);

  const handleCreate = useCallback(() => {
    if (!ticket.security || !ticket.quantity) {
      console.warn('Either security is not selected or quantity is not set!');
      return;
    }
    console.log('create tradeTicket', ticket);
    onCreate(ticket);
  }, [ticket, onCreate]);

  return (
    <div className="p-4">
      <div className="mb-3 row">
        <label className="col-sm-2 col-form-label me-3">Account</label>
        <div className="col-sm-8">
          <input
            readOnly
            disabled
            className="form-control"
            id="accountLabel"
            value={account?.displayName || ''}
          />
        </div>
      </div>
      <div className="mb-3 row">
        <label className="col-sm-2 col-form-label me-3">Security</label>
        <div className="col-sm-8 position-relative">
          <input
            id="stock-input"
            value={selectedCompany}
            onChange={(e) => handleCompanySearch(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            onBlur={handleBlur}
            placeholder="Search security"
            className="form-control"
            autoComplete="off"
          />
          {showDropdown && filteredStocks.length > 0 && (
            <ul className="dropdown-menu show position-absolute w-100" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {filteredStocks.map((stock) => (
                <li key={stock.ticker}>
                  <button
                    type="button"
                    className="dropdown-item"
                    onMouseDown={() => handleSelectStock(stock)}
                  >
                    {stock.companyName}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mb-3 row">
        <label className="col-sm-2 col-form-label me-3">Side</label>
        <div className="col-sm-8">
          <div className="btn-group">
            <input
              type="radio"
              className="btn-check"
              name="sideButton"
              value="Buy"
              id="buyButton"
              checked={ticket.side === 'Buy'}
              onChange={() => handleSideChange('Buy')}
            />
            <label
              className={`btn ${ticket.side === 'Buy' ? 'btn-info btn-sm' : 'btn-secondary btn-sm'}`}
              htmlFor="buyButton"
            >
              Buy
            </label>

            <input
              type="radio"
              className="btn-check"
              name="sideButton"
              value="Sell"
              id="sellButton"
              checked={ticket.side === 'Sell'}
              onChange={() => handleSideChange('Sell')}
            />
            <label
              className={`btn ${ticket.side === 'Sell' ? 'btn-warning btn-sm' : 'btn-secondary btn-sm'}`}
              htmlFor="sellButton"
            >
              Sell
            </label>
          </div>
        </div>
      </div>
      <div className="mb-3 row">
        <label className="col-sm-2 col-form-label me-3">Quantity</label>
        <div className="col-sm-8">
          <input
            className="form-control d-inline-block"
            id="quantityField"
            type="number"
            value={ticket.quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
      <div className="mb-3 row">
        <button
          className="btn btn-sm btn-primary col-sm-3 me-2"
          id="createButton"
          onClick={handleCreate}
        >
          Create
        </button>
        <button
          className="btn btn-sm btn-secondary col-sm-3"
          id="cancelButton"
          onClick={onCancel}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TradeTicket;
