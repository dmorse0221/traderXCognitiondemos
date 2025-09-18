import React, { useCallback, useEffect, useState, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { SelectChangeEvent } from '@mui/material';
import { socket } from '../socket';
import { GetPositions, GetTrades } from '../hooks';
import { CreateAccount, CreateAccountUser, CreateTradeButton } from '../ActionButtons';
import { ColDef, GetRowIdParams } from 'ag-grid-community';
import { PositionData, TradeData } from './types';
import { AccountsDropdown } from '../AccountsDropdown';
import { SocketService } from '../services/SocketService';
import { usePendingQueue } from '../hooks/usePendingQueue';




export const Datatable = () => {
	const [tradeColumnDefs, setTradeColumnDefs] = useState<ColDef[]>([]);
	const [positionColumnDefs, setPositionColumnDefs] = useState<ColDef[]>([]);
	const [selectedId, setSelectedId] = useState<number>(0);
	const [currentAccount, setCurrentAccount] = useState<string>('');
	
	const tradeGridRef = useRef<AgGridReact>(null);
	const positionGridRef = useRef<AgGridReact>(null);
	const socketServiceRef = useRef<SocketService | null>(null);
	
	const {
		data: tradeRowData,
		isPending: isTradesPending,
		setInitialData: setInitialTradeData,
		addItem: addTrade,
		reset: resetTrades
	} = usePendingQueue<TradeData>();
	
	const {
		data: positionRowData,
		isPending: isPositionsPending,
		setInitialData: setInitialPositionData,
		addItem: addPosition,
		reset: resetPositions
	} = usePendingQueue<PositionData>();

	const positionData = GetPositions(selectedId);
	const tradeData = GetTrades(selectedId);

	const updateTradeInGrid = useCallback((data: TradeData) => {
		const gridApi = tradeGridRef.current?.api;
		if (!gridApi) return;
		
		const existingRow = gridApi.getRowNode(`Trade-${data.id}`);
		if (existingRow) {
			gridApi.applyTransaction({
				update: [{ ...existingRow.data, state: data.state }]
			});
		} else {
			gridApi.applyTransaction({
				add: [data],
				addIndex: 0
			});
		}
	}, []);
	
	const updatePositionInGrid = useCallback((data: PositionData) => {
		const gridApi = positionGridRef.current?.api;
		if (!gridApi) return;
		
		const existingRow = gridApi.getRowNode(`Position-${data.security}`);
		if (existingRow) {
			gridApi.applyTransaction({
				update: [{ ...existingRow.data, quantity: data.quantity }]
			});
		} else {
			gridApi.applyTransaction({
				add: [data],
				addIndex: 0
			});
		}
	}, []);

	const handleChange = useCallback((event: SelectChangeEvent<any>) => {
		const newAccountId = event.target.value;
		
		if (selectedId !== 0 && socketServiceRef.current) {
			socketServiceRef.current.disconnect();
		}
		
		resetTrades();
		resetPositions();
		setSelectedId(newAccountId);
		setCurrentAccount(newAccountId);
		
		if (newAccountId !== 0) {
			if (!socketServiceRef.current) {
				socketServiceRef.current = new SocketService(socket);
			}
			
			socketServiceRef.current.subscribe(`/accounts/${newAccountId}/trades`, (data: TradeData) => {
				console.log("INCOMING TRADE DATA: ", data);
				if (isTradesPending) {
					addTrade(data);
				} else {
					updateTradeInGrid(data);
				}
			});
			
			socketServiceRef.current.subscribe(`/accounts/${newAccountId}/positions`, (data: PositionData) => {
				console.log("INCOMING POSITION DATA: ", data);
				if (isPositionsPending) {
					addPosition(data);
				} else {
					updatePositionInGrid(data);
				}
			});
		}
	}, [selectedId, isTradesPending, isPositionsPending, addTrade, addPosition, resetTrades, resetPositions, updateTradeInGrid, updatePositionInGrid]);

	useEffect(() => {
		const positionKeys = ['security', 'quantity', 'updated'];
		const tradeKeys = ['security', 'quantity', 'side', 'state', 'updated'];
		
		if (positionData && positionData.length > 0) {
			setInitialPositionData(positionData);
		}
		
		if (tradeData && tradeData.length > 0) {
			setInitialTradeData(tradeData);
		}
		
		setPositionColumnDefs([]);
		setTradeColumnDefs([]);
		positionKeys.forEach((key: string) => 
			setPositionColumnDefs((current: ColDef<PositionData>[]) => [...current, { field: key }])
		);
		tradeKeys.forEach((key: string) => 
			setTradeColumnDefs((current: ColDef<TradeData>[]) => [...current, { field: key }])
		);
	}, [positionData, tradeData, selectedId, currentAccount, setInitialPositionData, setInitialTradeData]);


return (
	<>
		<div className="accounts-dropdown">
			<AccountsDropdown currentAccount={currentAccount} handleChange={handleChange} />
		</div>
		<div className="action-buttons" style={{width: "100%", display: "flex"}}>
			<CreateTradeButton accountId={selectedId} />
			<CreateAccount />
			<CreateAccountUser accountId={selectedId} />
		</div>
		<div className="ag-theme-alpine" style={{height: "80vh", width: "50%", float: "left"}}>
			<AgGridReact
				ref={tradeGridRef}
				rowData={tradeRowData}
				columnDefs={tradeColumnDefs}
				getRowId={(params: GetRowIdParams) => `Trade-${params.data.id}`}
				animateRows={true}
				enableCellChangeFlash={true}>
			</AgGridReact>
		</div>
		<div className="ag-theme-alpine" style={{height: "80vh", width: "50%", float: "right"}}>
			<AgGridReact
				ref={positionGridRef}
				rowData={positionRowData}
				columnDefs={positionColumnDefs}
				getRowId={(params: GetRowIdParams) => `Position-${params.data.security}`}
				animateRows={true}
				enableCellChangeFlash={true}>
			</AgGridReact>
		</div>
	</>
);
}
