import { useEffect, useRef, useCallback } from 'react';
import { socket } from '../socket';

interface TradeFeedSubscription {
  topic: string;
  callback: (data: any) => void;
  unsubscribe: () => void;
}

export const useTradeFeed = () => {
  const subscriptionsRef = useRef<Map<string, TradeFeedSubscription>>(new Map());

  const subscribe = useCallback((topic: string, callback: (data: any) => void) => {
    const callbackFn = (args: any) => {
      console.log("received message -> " + JSON.stringify(args));
      if (args.from !== 'System' && args.topic === topic) {
        callback(args.payload);
      }
    };

    socket.on('publish', callbackFn);
    socket.emit('subscribe', topic);
    console.log('subscribing', topic);

    const unsubscribe = () => {
      console.log('unsubscribing ' + topic);
      socket.emit('unsubscribe', topic);
      socket.off('publish', callbackFn);
      subscriptionsRef.current.delete(topic);
    };

    const subscription: TradeFeedSubscription = {
      topic,
      callback,
      unsubscribe
    };

    subscriptionsRef.current.set(topic, subscription);

    return unsubscribe;
  }, []);

  const unsubscribe = useCallback((topic: string) => {
    const subscription = subscriptionsRef.current.get(topic);
    if (subscription) {
      subscription.unsubscribe();
    }
  }, []);

  const unsubscribeAll = useCallback(() => {
    subscriptionsRef.current.forEach((subscription) => {
      subscription.unsubscribe();
    });
    subscriptionsRef.current.clear();
  }, []);

  useEffect(() => {
    const handleConnect = () => {
      console.log('Trade feed is connected, connection id ' + socket.id);
    };

    const handleDisconnect = () => {
      console.log('Trade feed is disconnected, connection id was ' + socket.id);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      unsubscribeAll();
    };
  }, [unsubscribeAll]);

  return {
    subscribe,
    unsubscribe,
    unsubscribeAll,
    isConnected: socket.connected
  };
};
