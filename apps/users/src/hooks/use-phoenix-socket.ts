export const usePhoenixSocket = () => {
  return {
    socket: null,
    isConnected: false
  };
};

export const useChannel = (topic: string, params: Record<string, any> = {}) => {
  return {
    channel: null,
    isJoined: false,
    push: () => {}
  };
};

export const useChannelEvent = <T = any>(channel: any, event: string, callback: (payload: T) => void) => {};

export const usePresence = (channel: any) => {
  return {};
};
