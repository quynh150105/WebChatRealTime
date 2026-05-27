import { apiClient, unwrap } from './client';
import type { ConversationResponse } from '../types';

export function getConversations() {
  return apiClient.get('/conversations').then(unwrap<ConversationResponse[]>);
}

export function getConversation(id: number) {
  return apiClient.get(`/conversations/${id}`).then(unwrap<ConversationResponse>);
}

export function createDirectConversation(userId: number) {
  return apiClient.post(`/conversations/direct/${userId}`).then(unwrap<ConversationResponse>);
}

export function createGroupConversation(payload: {
  type: 'GROUP';
  name: string;
  avatarUrl?: string;
  memberIds: number[];
}) {
  return apiClient.post('/conversations', payload).then(unwrap<ConversationResponse>);
}

export function addGroupMembers(conversationId: number, memberIds: number[]) {
  return apiClient
    .post(`/group/${conversationId}/members`, { memberIds })
    .then(unwrap<ConversationResponse>);
}

export function leaveGroup(conversationId: number) {
  return apiClient.post(`/group/${conversationId}/leave`).then(unwrap<ConversationResponse>);
}

export function updateGroup(conversationId: number, payload: { name: string; avatarUrl?: string }) {
  return apiClient.put(`/group/edit/${conversationId}`, payload).then(unwrap<ConversationResponse>);
}

export function removeGroupMember(conversationId: number, userId: number) {
  return apiClient
    .delete(`/group/${conversationId}/members/${userId}`)
    .then(unwrap<ConversationResponse>);
}
