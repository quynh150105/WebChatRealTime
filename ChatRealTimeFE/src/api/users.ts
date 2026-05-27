import { apiClient, unwrap } from './client';
import type { UpdateMePayload, UserResponse } from '../types';

export function updateMe(payload: UpdateMePayload) {
  return apiClient.put('/users/me', payload).then(unwrap<UserResponse>);
}

export function searchUsers(keywords: string) {
  return apiClient
    .get('/users/search', { params: { keywords } })
    .then(unwrap<UserResponse[]>);
}
