package quynh.chatrealtimebe.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import quynh.chatrealtimebe.domain.dto.request.SendMessageRequest;
import quynh.chatrealtimebe.domain.dto.request.UpdateMessageRequest;
import quynh.chatrealtimebe.domain.dto.response.MessageResponse;
import quynh.chatrealtimebe.domain.dto.response.PageResponse;
import quynh.chatrealtimebe.domain.entity.Messages;

import java.util.List;

public interface MessageService {
    MessageResponse sendMessage(String email, SendMessageRequest request);

    PageResponse<MessageResponse> getMessages(String email, Long conversationId, Pageable pageable);

    MessageResponse updateMessage(String email, Long messageId, UpdateMessageRequest request);

    MessageResponse deleteMessage(String email, Long messageId);


}
