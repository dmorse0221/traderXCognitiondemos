export {};

jest.mock('../env', () => ({
  Environment: {
    trade_feed_url: 'http://localhost:18086',
  },
}));

const mockOn = jest.fn();
const mockEmit = jest.fn();
const mockOff = jest.fn();

jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: mockOn,
    emit: mockEmit,
    off: mockOff,
    id: 'test-socket-id',
  })),
}));

describe('TradeFeedService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates socket connection and sets up event handlers', () => {
    jest.isolateModules(() => {
      require('./tradeFeed');
    });
    expect(mockOn).toHaveBeenCalledWith('connect', expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith('disconnect', expect.any(Function));
  });

  it('subscribe method subscribes to a topic', () => {
    let tradeFeedService: any;
    jest.isolateModules(() => {
      tradeFeedService = require('./tradeFeed').tradeFeedService;
    });
    
    const callback = jest.fn();
    tradeFeedService.subscribe('/accounts/1/trades', callback);

    expect(mockOn).toHaveBeenCalledWith('publish', expect.any(Function));
    expect(mockEmit).toHaveBeenCalledWith('subscribe', '/accounts/1/trades');
  });

  it('subscribe returns unsubscribe function', () => {
    let tradeFeedService: any;
    jest.isolateModules(() => {
      tradeFeedService = require('./tradeFeed').tradeFeedService;
    });
    
    const callback = jest.fn();
    const unsubscribe = tradeFeedService.subscribe('/accounts/1/trades', callback);

    expect(typeof unsubscribe).toBe('function');
  });

  it('unSubscribe method unsubscribes from a topic', () => {
    let tradeFeedService: any;
    jest.isolateModules(() => {
      tradeFeedService = require('./tradeFeed').tradeFeedService;
    });
    
    const callback = jest.fn();
    tradeFeedService.unSubscribe('/accounts/1/trades', callback);

    expect(mockOff).toHaveBeenCalledWith('publish', callback);
    expect(mockEmit).toHaveBeenCalledWith('unsubscribe', '/accounts/1/trades');
  });

  it('getSocket returns the socket instance', () => {
    let tradeFeedService: any;
    jest.isolateModules(() => {
      tradeFeedService = require('./tradeFeed').tradeFeedService;
    });
    
    const socket = tradeFeedService.getSocket();
    expect(socket).toBeDefined();
    expect(socket.id).toBe('test-socket-id');
  });
});
