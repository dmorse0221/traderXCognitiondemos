import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi, GridReadyEvent, GetRowIdParams } from 'ag-grid-community';
import { Account, Position } from '../../models';
import { positionService, tradeFeedService } from '../../services';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface PositionBlotterProps {
  account?: Account;
}

export const PositionBlotter: React.FC<PositionBlotterProps> = ({ account }) => {
  const [positions, setPositions] = useState<Position[]>([]);
  const gridApiRef = useRef<GridApi | null>(null);
  const pendingPositionsRef = useRef<Position[]>([]);
  const isPendingRef = useRef<boolean>(true);
  const unsubscribeFnRef = useRef<(() => void) | null>(null);

  const columnDefs: ColDef[] = [
    { field: 'security', headerName: 'SECURITY' },
    { headerName: 'QUANTITY', field: 'quantity', enableCellChangeFlash: true },
  ];

  const getRowId = useCallback((params: GetRowIdParams) => {
    return `Position-${params.data.security}`;
  }, []);

  const updatePosition = useCallback((data: Position) => {
    if (!gridApiRef.current) return;

    const row = gridApiRef.current.getRowNode(`Position-${data.security}`);
    let positionData;
    if (row) {
      positionData = {
        update: [{ ...row.data, quantity: data.quantity }],
      };
    } else {
      positionData = {
        add: [{
          accountid: data.accountid,
          quantity: data.quantity,
          security: data.security,
          updated: data.updated,
        }],
        addIndex: 0,
      };
    }
    gridApiRef.current.applyTransaction(positionData);
  }, []);

  const processPendingPositions = useCallback(() => {
    pendingPositionsRef.current.forEach((position) => updatePosition(position));
    pendingPositionsRef.current = [];
    isPendingRef.current = false;
  }, [updatePosition]);

  const handlePositionUpdate = useCallback((data: Position) => {
    if (isPendingRef.current) {
      pendingPositionsRef.current.push(data);
    } else {
      updatePosition(data);
    }
  }, [updatePosition]);

  useEffect(() => {
    if (!account) return;

    isPendingRef.current = true;

    positionService.getPositions(account.id)
      .then((fetchedPositions: Position[]) => {
        setPositions(fetchedPositions);
        processPendingPositions();
      })
      .catch((error) => {
        console.error('Error fetching positions:', error);
        isPendingRef.current = false;
      });

    unsubscribeFnRef.current?.();
    unsubscribeFnRef.current = tradeFeedService.subscribe(
      `/accounts/${account.id}/positions`,
      (data) => {
        console.log('Position blotter feed...', data);
        handlePositionUpdate(data as Position);
      }
    );

    return () => {
      unsubscribeFnRef.current?.();
    };
  }, [account, processPendingPositions, handlePositionUpdate]);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    console.log('position blotter is ready...');
    gridApiRef.current = params.api;
  }, []);

  return (
    <div>
      <h6>Position Blotter</h6>
      <div className="ag-theme-alpine" style={{ width: '100%', height: '300px' }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={positions}
          getRowId={getRowId}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

export default PositionBlotter;
