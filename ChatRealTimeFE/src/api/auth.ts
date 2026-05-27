import { apiClient, unwrap } from './client';
import type { LoginPayload, LoginResponse, RegisterPayload, UserResponse } from '../types';

export function login(payload: LoginPayload) {
  return apiClient.post('/auth/login', payload).then(unwrap<LoginResponse>);
}

export function register(payload: RegisterPayload) {
  return apiClient.post('/auth/register', payload).then(unwrap<unknown>);
}

export function getCurrentUser() {
  return apiClient.get('/users/me').then(unwrap<UserResponse>);
}
