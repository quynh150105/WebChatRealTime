import { apiClient, unwrap } from './client';
import type { MessageResponse, PageResponse, SendMessagePayload } from '../types';

export function getMessages(conversationId: number, page = 0, size = 20) {
  return apiClient
    .get(`/messages/conversation/${conversationId}`, { params: { page, size } })
    .then(unwrap<PageResponse<MessageResponse>>);
}

export function sendMessage(payload: SendMessagePayload) {
  return apiClient.post('/messages/sendMessage', payload).then(unwrap<MessageResponse>);
}

export function updateMessage(messageId: number, content: string) {
  return apiClient.put(`/messages/${messageId}`, { content }).then(unwrap<MessageResponse>);
}

export function deleteMessage(messageId: number) {
  return apiClient.delete(`/messages/${messageId}`).then(unwrap<MessageResponse>);
}
