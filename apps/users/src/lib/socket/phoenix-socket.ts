import { Socket, Channel } from 'phoenix';
import { getAccessToken } from '@/utils/token-storage';

const WS_URL = 'wss://move-bars-wispy-fog-4442.fly.dev/socket';

class PhoenixSocketClient {
  private socket: Socket | null = null;
  private channels: Map<string, Channel> = new Map();
  private connectionCallbacks: Array<() => void> = [];
  private disconnectionCallbacks: Array<() => void> = [];

  constructor() {
    this.initializeSocket();
  }

  private getAuthToken(): string | null {
    return getAccessToken();
  }

  private initializeSocket() {
    const token = this.getAuthToken();

    this.socket = new Socket(WS_URL, {
      params: token ? { token } : {},
      reconnectAfterMs: (tries) => {
        return [1000, 2000, 5000, 10000][tries - 1] || 10000;
      },
      heartbeatIntervalMs: 30000,
      logger: (kind, msg, data) => {
        if (import.meta.env.DEV) {
          console.log(`[Phoenix ${kind}]`, msg, data);
        }
      }
    });

    this.socket.onOpen(() => {
      console.log('Phoenix Socket connected');
      this.connectionCallbacks.forEach((callback) => callback());
    });

    this.socket.onClose(() => {
      console.log('Phoenix Socket disconnected');
      this.disconnectionCallbacks.forEach((callback) => callback());
    });

    this.socket.onError((error) => {
      console.error('Phoenix Socket error:', error);
    });
  }

  connect(): void {
    if (this.socket && !this.socket.isConnected()) {
      this.socket.connect();
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.channels.forEach((channel) => {
        channel.leave();
      });
      this.channels.clear();
      this.socket.disconnect();
    }
  }

  isConnected(): boolean {
    return this.socket?.isConnected() ?? false;
  }

  joinChannel(topic: string, params: Record<string, any> = {}): Channel | null {
    if (!this.socket) {
      console.error('Socket not initialized');
      return null;
    }

    if (this.channels.has(topic)) {
      return this.channels.get(topic)!;
    }

    const channel = this.socket.channel(topic, params);

    channel
      .join()
      .receive('ok', (response) => {
        console.log(`Joined channel: ${topic}`, response);
      })
      .receive('error', (response) => {
        console.error(`Failed to join channel: ${topic}`, response);
      })
      .receive('timeout', () => {
        console.error(`Timeout joining channel: ${topic}`);
      });

    channel.onError((error) => {
      console.error(`Channel ${topic} error:`, error);
    });

    channel.onClose(() => {
      console.log(`Channel ${topic} closed`);
      this.channels.delete(topic);
    });

    this.channels.set(topic, channel);
    return channel;
  }

  leaveChannel(topic: string): void {
    const channel = this.channels.get(topic);
    if (channel) {
      channel.leave();
      this.channels.delete(topic);
    }
  }

  getChannel(topic: string): Channel | undefined {
    return this.channels.get(topic);
  }

  onConnection(callback: () => void): void {
    this.connectionCallbacks.push(callback);
  }

  onDisconnection(callback: () => void): void {
    this.disconnectionCallbacks.push(callback);
  }

  push(topic: string, event: string, payload: any): void {
    const channel = this.channels.get(topic);
    if (channel) {
      channel.push(event, payload);
    } else {
      console.error(`Channel ${topic} not found`);
    }
  }

  on(topic: string, event: string, callback: (payload: any) => void): void {
    const channel = this.channels.get(topic);
    if (channel) {
      channel.on(event, callback);
    } else {
      console.error(`Channel ${topic} not found`);
    }
  }

  off(topic: string, event: string): void {
    const channel = this.channels.get(topic);
    if (channel) {
      channel.off(event);
    }
  }
}

const phoenixSocket = new PhoenixSocketClient();

export default phoenixSocket;
export { PhoenixSocketClient };
