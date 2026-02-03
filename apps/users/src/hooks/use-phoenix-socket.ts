import { useEffect, useState, useCallback, useRef } from 'react';
import { Channel } from 'phoenix';
import phoenixSocket from '@/lib/socket/phoenix-socket';

export const usePhoenixSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const handleConnection = () => setIsConnected(true);
    const handleDisconnection = () => setIsConnected(false);

    phoenixSocket.onConnection(handleConnection);
    phoenixSocket.onDisconnection(handleDisconnection);

    phoenixSocket.connect();

    setIsConnected(phoenixSocket.isConnected());

    return () => {
      phoenixSocket.disconnect();
    };
  }, []);

  return {
    socket: phoenixSocket,
    isConnected
  };
};

export const useChannel = (topic: string, params: Record<string, any> = {}) => {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    const joinedChannel = phoenixSocket.joinChannel(topic, params);

    if (joinedChannel) {
      setChannel(joinedChannel);
      // Check if already joined to set initial state
      if (joinedChannel.state === 'joined') {
        setIsJoined(true);
      }
    }

    return () => {
      if (joinedChannel) {
        phoenixSocket.leaveChannel(topic);
        setIsJoined(false);
      }
    };
  }, [topic, JSON.stringify(params)]);

  const push = useCallback(
    (event: string, payload: any) => {
      if (channel) {
        channel.push(event, payload);
      }
    },
    [channel]
  );

  return {
    channel,
    isJoined,
    push
  };
};

export const useChannelEvent = <T = any>(channel: Channel | null, event: string, callback: (payload: T) => void) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!channel) return;

    const handler = (payload: T) => {
      callbackRef.current(payload);
    };

    channel.on(event, handler);

    return () => {
      channel.off(event);
    };
  }, [channel, event]);
};

export const usePresence = (channel: Channel | null) => {
  const [presences, setPresences] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!channel) return;

    const handlePresenceState = (state: Record<string, any>) => {
      setPresences(state);
    };

    const handlePresenceDiff = (diff: { joins: Record<string, any>; leaves: Record<string, any> }) => {
      setPresences((current) => {
        const updated = { ...current };

        Object.keys(diff.leaves).forEach((key) => {
          delete updated[key];
        });

        Object.keys(diff.joins).forEach((key) => {
          updated[key] = diff.joins[key];
        });

        return updated;
      });
    };

    channel.on('presence_state', handlePresenceState);
    channel.on('presence_diff', handlePresenceDiff);

    return () => {
      channel.off('presence_state');
      channel.off('presence_diff');
    };
  }, [channel]);

  return presences;
};
