import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import type { MessageResponse, SendMessagePayload } from '../types';

const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8080/ws';

export class ChatSocket {
  private client: Client | null = null;
  private subscription: StompSubscription | null = null;

  connect(token: string, onConnect?: () => void, onDisconnect?: () => void) {
    this.disconnect();
    this.client = new Client({
      brokerURL: WS_URL,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 3000,
      onConnect: () => onConnect?.(),
      onWebSocketClose: () => onDisconnect?.(),
      onStompError: () => onDisconnect?.(),
    });
    this.client.activate();
  }

  subscribe(conversationId: number, onMessage: (message: MessageResponse) => void) {
    if (!this.client?.connected) return false;
    this.subscription?.unsubscribe();
    this.subscription = this.client.subscribe(
      `/topic/conversations/${conversationId}`,
      (frame: IMessage) => onMessage(JSON.parse(frame.body) as MessageResponse),
    );
    return true;
  }

  send(payload: SendMessagePayload) {
    if (!this.client?.connected) return false;
    this.client.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({ ...payload, typeMessage: payload.typeMessage ?? 'TEXT' }),
    });
    return true;
  }

  isConnected() {
    return Boolean(this.client?.connected);
  }

  disconnect() {
    this.subscription?.unsubscribe();
    this.subscription = null;
    this.client?.deactivate();
    this.client = null;
  }
}
