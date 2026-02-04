declare module 'phoenix' {
  export interface SocketConnectOption {
    params?: Record<string, any> | (() => Record<string, any>);
    transport?: any;
    timeout?: number;
    heartbeatIntervalMs?: number;
    reconnectAfterMs?: (tries: number) => number;
    rejoinAfterMs?: (tries: number) => number;
    logger?: (kind: string, msg: string, data: any) => void;
    longpollerTimeout?: number;
    encode?: (payload: any, callback: (encoded: any) => void) => void;
    decode?: (payload: string, callback: (decoded: any) => void) => void;
    binaryType?: BinaryType;
  }

  export class Socket {
    constructor(endPoint: string, opts?: SocketConnectOption);

    protocol(): string;
    endPointURL(): string;
    disconnect(callback?: () => void, code?: number, reason?: string): void;
    connect(params?: any): void;
    log(kind: string, msg: string, data?: any): void;
    hasLogger(): boolean;
    onOpen(callback: () => void): void;
    onClose(callback: (event: any) => void): void;
    onError(callback: (error: any) => void): void;
    onMessage(callback: (message: any) => void): void;
    onConnOpen(): void;
    onConnClose(event: any): void;
    onConnError(error: any): void;
    triggerChanError(): void;
    connectionState(): string;
    isConnected(): boolean;
    remove(channel: Channel): void;
    channel(topic: string, chanParams?: Record<string, any>): Channel;
    push(data: any): void;
    makeRef(): string;
    sendHeartbeat(): void;
    flushSendBuffer(): void;
    onConnMessage(rawMessage: any): void;
  }

  export interface Push {
    send(): void;
    resend(timeout: number): void;
    receive(status: string, callback: (response?: any) => void): this;
  }

  export class Channel {
    constructor(topic: string, params: Record<string, any> | (() => Record<string, any>), socket: Socket);

    rejoinUntilConnected(): void;
    join(timeout?: number): Push;
    onClose(callback: () => void): void;
    onError(callback: (reason?: any) => void): void;
    on(event: string, callback: (response?: any) => void): number;
    off(event: string, ref?: number): void;
    canPush(): boolean;
    push(event: string, payload: any, timeout?: number): Push;
    leave(timeout?: number): Push;
    onMessage(event: string, payload: any, ref: any): any;
    isMember(topic: string, event: string, payload: any, joinRef: string): boolean;
    joinRef(): string;
    rejoin(timeout?: number): void;
    trigger(event: string, payload?: any, ref?: any, joinRef?: any): void;
    replyEventName(ref: any): string;
    isClosed(): boolean;
    isErrored(): boolean;
    isJoined(): boolean;
    isJoining(): boolean;
    isLeaving(): boolean;
    state: 'closed' | 'errored' | 'joined' | 'joining' | 'leaving';
  }

  export class Presence {
    constructor(channel: Channel, opts?: any);

    static syncState(
      currentState: any,
      newState: any,
      onJoin?: (key: string, currentPresence: any, newPresence: any) => void,
      onLeave?: (key: string, currentPresence: any, leftPresence: any) => void
    ): any;

    static syncDiff(
      currentState: any,
      diff: { joins: any; leaves: any },
      onJoin?: (key: string, currentPresence: any, newPresence: any) => void,
      onLeave?: (key: string, currentPresence: any, leftPresence: any) => void
    ): any;

    static list(presences: any, chooser?: (key: string, presence: any) => any): any[];

    onJoin(callback: (key: string, currentPresence: any, newPresence: any) => void): void;
    onLeave(callback: (key: string, currentPresence: any, leftPresence: any) => void): void;
    onSync(callback: () => void): void;
    list(chooser?: (key: string, presence: any) => any): any[];
    inPendingSyncState(): boolean;
  }

  export class LongPoll {
    constructor(endPoint: string);

    normalizeEndpoint(endPoint: string): string;
    endpointURL(): string;
    closeAndRetry(code: any, reason: any, wasClean: any): void;
    ontimeout(): void;
    isActive(): boolean;
    poll(): void;
    send(body: any): void;
    close(code?: any, reason?: any): void;
  }

  export class Ajax {
    static request(
      method: string,
      endPoint: string,
      accept: string,
      body: any,
      timeout: number,
      ontimeout: any,
      callback: (response?: any) => void
    ): void;

    static xdomainRequest(
      req: any,
      method: string,
      endPoint: string,
      body: any,
      timeout: number,
      ontimeout: any,
      callback: (response?: any) => void
    ): void;

    static xhrRequest(
      req: any,
      method: string,
      endPoint: string,
      accept: string,
      body: any,
      timeout: number,
      ontimeout: any,
      callback: (response?: any) => void
    ): void;

    static parseJSON(resp: string): any;
    static serialize(obj: any, parentKey?: string): string;
    static appendParams(url: string, params: any): string;
  }
}
