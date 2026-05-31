import { apiClient, unwrap } from './client';
import type { UpdateMePayload, UserResponse } from '../types';

export function updateMe(payload: UpdateMePayload) {
  const formData = new FormData();
  formData.append('username', payload.username);
  formData.append('fullName', payload.fullName);
  if (payload.avatar) {
    formData.append('avatar', payload.avatar);
  }

  return apiClient.put('/users/me', formData).then(unwrap<UserResponse>);
}

export function searchUsers(keywords: string) {
  return apiClient
    .get('/users/search', { params: { keywords } })
    .then(unwrap<UserResponse[]>);
}
