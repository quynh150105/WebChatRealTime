package quynh.chatrealtimebe.service;

import org.springframework.web.multipart.MultipartFile;
import quynh.chatrealtimebe.domain.dto.request.AddMemberRequest;
import quynh.chatrealtimebe.domain.dto.request.UpdateConversationRequest;
import quynh.chatrealtimebe.domain.dto.response.ConversationResponse;

public interface GroupChatService {
    ConversationResponse updateGroup(String email, Long conversationId, UpdateConversationRequest request, MultipartFile file);
    ConversationResponse addMembers(String email, Long conversationId, AddMemberRequest request);
    ConversationResponse removeMembers(String email, Long conversationId, Long userId);
    ConversationResponse leaveGroup(String email, Long conversationId);
}
