interface SocketMessage {
	from: string;
	topic: string;
	payload: any;
}

export class SocketService {
	private socket: any;
	private subscriptions: Map<string, Function[]> = new Map();

	constructor(socketInstance: any) {
		this.socket = socketInstance;
		this.setupEventHandlers();
	}

	private setupEventHandlers() {
		this.socket.on('publish', (message: SocketMessage) => {
			if (message.from !== 'System') {
				const callbacks = this.subscriptions.get(message.topic);
				if (callbacks) {
					callbacks.forEach(callback => callback(message.payload));
				}
			}
		});
	}

	subscribe(topic: string, callback: (data: any) => void): () => void {
		if (!this.subscriptions.has(topic)) {
			this.subscriptions.set(topic, []);
			this.socket.emit('subscribe', topic);
		}
		
		this.subscriptions.get(topic)!.push(callback);

		return () => {
			this.unsubscribe(topic, callback);
		};
	}

	private unsubscribe(topic: string, callback: (data: any) => void) {
		const callbacks = this.subscriptions.get(topic);
		if (callbacks) {
			const index = callbacks.indexOf(callback);
			if (index > -1) {
				callbacks.splice(index, 1);
			}
			
			if (callbacks.length === 0) {
				this.subscriptions.delete(topic);
				this.socket.emit('unsubscribe', topic);
			}
		}
	}

	disconnect() {
		this.subscriptions.clear();
		this.socket.disconnect();
	}
}
