export type TypeConversation = 'DIRECT' | 'GROUP';
export type TypeMessage = 'TEXT' | 'IMAGE' | 'FILE';

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role?: string | null;
  status?: string | null;
  lastSeen?: string | null;
}

export interface ConversationResponse {
  id: number;
  type: TypeConversation;
  name: string | null;
  avatarUrl: string | null;
  createdAt: string;
  members: UserResponse[];
}

export interface MessageResponse {
  id: number;
  content: string | null;
  typeMessage: TypeMessage;
  deleted?: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  senderId: number;
  senderName: string;
  senderAvatarUrl: string | null;
  conversationId: number;
  replyToMessageId: number | null;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string | null;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  fullName: string;
  avatarUrl?: string;
}

export interface UpdateMePayload {
  username: string;
  fullName: string;
  avatar?: File;
}

export interface SendMessagePayload {
  conversationId: number;
  content: string;
  typeMessage?: TypeMessage;
  replyToMessageId?: number;
}
