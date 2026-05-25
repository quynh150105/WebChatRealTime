package quynh.chatrealtimebe.service;

import quynh.chatrealtimebe.domain.dto.request.CreateConversationRequest;
import quynh.chatrealtimebe.domain.dto.response.ConversationResponse;

import java.util.List;

public interface ConversationService {
    ConversationResponse create(String email, CreateConversationRequest request);
    List<ConversationResponse> getMyConversations(String email);
    ConversationResponse getDetail(String email, Long conversationId);
    ConversationResponse createDirectConversation(String email, Long targetUserId);
}
