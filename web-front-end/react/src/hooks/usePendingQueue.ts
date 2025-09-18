import { useState, useCallback } from 'react';

interface PendingQueueState<T> {
	data: T[];
	pendingItems: T[];
	isPending: boolean;
}

export function usePendingQueue<T>() {
	const [state, setState] = useState<PendingQueueState<T>>({
		data: [],
		pendingItems: [],
		isPending: true
	});

	const setInitialData = useCallback((initialData: T[]) => {
		setState(prevState => {
			const newData = [...initialData];
			prevState.pendingItems.forEach(item => {
				newData.push(item);
			});
			
			return {
				data: newData,
				pendingItems: [],
				isPending: false
			};
		});
	}, []);

	const addItem = useCallback((item: T) => {
		setState(prevState => {
			if (prevState.isPending) {
				return {
					...prevState,
					pendingItems: [...prevState.pendingItems, item]
				};
			} else {
				return {
					...prevState,
					data: [...prevState.data, item]
				};
			}
		});
	}, []);

	const updateItem = useCallback((item: T, matcher: (existing: T, incoming: T) => boolean) => {
		setState(prevState => {
			if (prevState.isPending) {
				return {
					...prevState,
					pendingItems: [...prevState.pendingItems, item]
				};
			} else {
				const updatedData = prevState.data.map(existingItem => 
					matcher(existingItem, item) ? { ...existingItem, ...item } : existingItem
				);
				
				const itemExists = prevState.data.some(existingItem => matcher(existingItem, item));
				if (!itemExists) {
					updatedData.push(item);
				}
				
				return {
					...prevState,
					data: updatedData
				};
			}
		});
	}, []);

	const reset = useCallback(() => {
		setState({
			data: [],
			pendingItems: [],
			isPending: true
		});
	}, []);

	return {
		data: state.data,
		isPending: state.isPending,
		setInitialData,
		addItem,
		updateItem,
		reset
	};
}
