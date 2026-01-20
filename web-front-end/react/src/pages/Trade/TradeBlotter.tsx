import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi, GridReadyEvent, GetRowIdParams } from 'ag-grid-community';
import { Account, Trade } from '../../models';
import { positionService, tradeFeedService } from '../../services';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface TradeBlotterProps {
  account?: Account;
}

export const TradeBlotter: React.FC<TradeBlotterProps> = ({ account }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const gridApiRef = useRef<GridApi | null>(null);
  const pendingTradesRef = useRef<Trade[]>([]);
  const isPendingRef = useRef<boolean>(true);
  const unsubscribeFnRef = useRef<(() => void) | null>(null);

  const columnDefs: ColDef[] = [
    { headerName: 'SECURITY', field: 'security' },
    { headerName: 'QUANTITY', field: 'quantity' },
    { headerName: 'SIDE', field: 'side' },
    { headerName: 'STATE', field: 'state', enableCellChangeFlash: true },
  ];

  const getRowId = useCallback((params: GetRowIdParams) => {
    return `Trade-${params.data.id}`;
  }, []);

  const updateTrade = useCallback((data: Trade) => {
    if (!gridApiRef.current) return;
    
    const row = gridApiRef.current.getRowNode(`Trade-${data.id}`);
    let tradeData;
    if (row) {
      tradeData = {
        update: [{ ...row.data, state: data.state }],
      };
    } else {
      tradeData = {
        add: [{
          accountid: data.accountid,
          created: data.created,
          id: data.id,
          quantity: data.quantity,
          security: data.security,
          side: data.side,
          state: data.state,
          updated: data.updated,
        }],
        addIndex: 0,
      };
    }
    gridApiRef.current.applyTransaction(tradeData);
  }, []);

  const processPendingTrades = useCallback(() => {
    pendingTradesRef.current.forEach((tradeUpdate) => updateTrade(tradeUpdate));
    pendingTradesRef.current = [];
    isPendingRef.current = false;
  }, [updateTrade]);

  const handleTradeUpdate = useCallback((data: Trade) => {
    if (isPendingRef.current) {
      pendingTradesRef.current.push(data);
    } else {
      updateTrade(data);
    }
  }, [updateTrade]);

  useEffect(() => {
    if (!account) return;

    isPendingRef.current = true;
    
    positionService.getTrades(account.id)
      .then((fetchedTrades: Trade[]) => {
        setTrades(fetchedTrades);
        processPendingTrades();
      })
      .catch((error) => {
        console.error('Error fetching trades:', error);
        isPendingRef.current = false;
      });

    unsubscribeFnRef.current?.();
    unsubscribeFnRef.current = tradeFeedService.subscribe(
      `/accounts/${account.id}/trades`,
      (data) => {
        console.log('Trade blotter feed...', data);
        handleTradeUpdate(data as Trade);
      }
    );

    return () => {
      unsubscribeFnRef.current?.();
    };
  }, [account, processPendingTrades, handleTradeUpdate]);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    console.log('trade blotter is ready...');
    gridApiRef.current = params.api;
    params.api.sizeColumnsToFit();
  }, []);

  return (
    <div>
      <h6>Trade Blotter</h6>
      <div className="ag-theme-alpine" style={{ width: '100%', height: '300px' }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={trades}
          rowSelection="single"
          getRowId={getRowId}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

export default TradeBlotter;
