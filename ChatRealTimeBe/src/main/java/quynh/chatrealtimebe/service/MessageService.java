package quynh.chatrealtimebe.service;

import quynh.chatrealtimebe.domain.dto.request.SendMessageRequest;
import quynh.chatrealtimebe.domain.dto.request.UpdateMessageRequest;
import quynh.chatrealtimebe.domain.dto.response.MessageResponse;

import java.util.List;

public interface MessageService {
    MessageResponse sendMessage(String email, SendMessageRequest request);

    List<MessageResponse> getMessages(String email, Long conversationId);

    MessageResponse updateMessage(String email, Long messageId, UpdateMessageRequest request);

    MessageResponse deleteMessage(String email, Long messageId);


}
