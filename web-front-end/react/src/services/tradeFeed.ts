import { io, Socket } from 'socket.io-client';
import { Environment } from '../env';

export class TradeFeedService {
  private socket: Socket;

  constructor() {
    this.socket = io(Environment.trade_feed_url);
    this.socket.on('connect', this.onConnect);
    this.socket.on('disconnect', this.onDisconnect);
  }

  private onConnect = () => {
    console.log('Trade feed is connected, connection id: ' + this.socket.id);
  };

  private onDisconnect = () => {
    console.log('Trade feed is disconnected, connection id was: ' + this.socket.id);
  };

  public subscribe(topic: string, callback: (data: unknown) => void): () => void {
    const callbackFn = (args: { from: string; topic: string; payload: unknown }) => {
      console.log('received message -> ' + JSON.stringify(args));
      if (args.from !== 'System' && args.topic === topic) {
        callback(args.payload);
      }
    };
    this.socket.on('publish', callbackFn as (...args: unknown[]) => void);
    this.socket.emit('subscribe', topic);
    console.log('subscribing', topic);
    return () => {
      this.unSubscribe(topic, callbackFn as (...args: unknown[]) => void);
    };
  }

  public unSubscribe(topic: string, callback: (...args: unknown[]) => void): void {
    console.log('unsubscribing ' + topic);
    this.socket.emit('unsubscribe', topic);
    this.socket.off('publish', callback);
  }

  public getSocket(): Socket {
    return this.socket;
  }
}

export const tradeFeedService = new TradeFeedService();
