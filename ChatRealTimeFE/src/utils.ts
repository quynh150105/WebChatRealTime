import type { ConversationResponse, MessageResponse, UserResponse } from './types';

export function displayConversationName(conversation: ConversationResponse, currentUser?: UserResponse | null) {
  if (conversation.type === 'GROUP') return conversation.name || 'Unnamed group';
  const other = conversation.members.find((member) => member.id !== currentUser?.id);
  return conversation.name || other?.fullName || other?.username || 'Direct chat';
}

export function displayConversationAvatar(conversation: ConversationResponse, currentUser?: UserResponse | null) {
  if (conversation.type === 'GROUP') return conversation.avatarUrl;
  return conversation.members.find((member) => member.id !== currentUser?.id)?.avatarUrl ?? conversation.avatarUrl;
}

export function formatTime(value: string) {
  return new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }).format(
    new Date(value),
  );
}

export function mergeMessages(existing: MessageResponse[], incoming: MessageResponse[]) {
  const map = new Map<number, MessageResponse>();
  [...existing, ...incoming].forEach((message) => map.set(message.id, message));
  return [...map.values()].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}
