package quynh.chatrealtimebe.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import quynh.chatrealtimebe.constant.TypeMessage;
import quynh.chatrealtimebe.domain.dto.request.SendMessageRequest;
import quynh.chatrealtimebe.domain.dto.request.UpdateMessageRequest;
import quynh.chatrealtimebe.domain.dto.response.MessageResponse;
import quynh.chatrealtimebe.domain.dto.response.PageResponse;
import quynh.chatrealtimebe.domain.entity.Conversation;
import quynh.chatrealtimebe.domain.entity.Messages;
import quynh.chatrealtimebe.domain.entity.User;
import quynh.chatrealtimebe.domain.mapper.MessageMapper;
import quynh.chatrealtimebe.repository.ConversationMemberRepository;
import quynh.chatrealtimebe.repository.ConversationRepository;
import quynh.chatrealtimebe.repository.MessageRepository;
import quynh.chatrealtimebe.repository.UserRepository;
import quynh.chatrealtimebe.service.MessageService;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final ConversationMemberRepository conversationMemberRepository;
    private final MessageMapper messageMapper;

    @Override
    @Transactional
    public MessageResponse sendMessage(String email, SendMessageRequest request) {
        User sender = userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("User not found"));

        boolean isMember = conversationMemberRepository
                .existsByConversationIdAndUserEmailAndLeftAtIsNull(request.getConversationId(), email);
        if(!isMember){
            throw new RuntimeException("You are not a member of the conversation");
        }

        Conversation conversation = conversationRepository.findById(request.getConversationId())
                .orElseThrow(()-> new RuntimeException("Conversation not found"));

        Messages replyMessage = null;

        if(request.getReplyToMessageId() != null){
            replyMessage = messageRepository.findById(request.getReplyToMessageId())
                    .orElseThrow(()-> new RuntimeException("reply Message not found"));

            if(!replyMessage.getConversation().getId().equals(request.getConversationId())){
                throw new RuntimeException("reply message is not in this conversation");
            }

            if(replyMessage.isDeleted()){
                throw new RuntimeException("Reply message has been deleted");
            }
        }

        Messages message = Messages.builder()
                .content(request.getContent())
                .typeMessage(request.getTypeMessage() == null ? TypeMessage.TEXT : request.getTypeMessage())
                .sender(sender)
                .conversation(conversation)
                .replyMessage(replyMessage)
                .build();

        messageRepository.save(message);
        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        return messageMapper.toMessageResponse(message);
    }

    @Override
    public PageResponse<MessageResponse> getMessages(String email, Long conversationId, Pageable pageable) {
        boolean isMember = conversationMemberRepository
                .existsByConversationIdAndUserEmailAndLeftAtIsNull(conversationId, email);
        if (!isMember) {
            throw new RuntimeException("You are not a member of this conversation");
        }

        Page<MessageResponse> page = messageRepository
                .findByConversationIdAndIsDeletedFalseOrderByCreatedAtDesc(conversationId, pageable)
                .map(messageMapper::toMessageResponse);

        PageResponse<MessageResponse> response = PageResponse.<MessageResponse>builder()
                .page(pageable.getPageNumber())
                .size(page.getSize())
                .content(page.getContent())
                .totalPages(page.getTotalPages())
                .totalElements(page.getTotalElements())
                .build();

        return response;
    }

    @Override
    @Transactional
    public MessageResponse updateMessage(String email, Long messageId, UpdateMessageRequest request ) {
        Messages message = messageRepository.findById(messageId)
                .orElseThrow(()-> new RuntimeException("message not found"));

        if(message.isDeleted()){
            throw  new RuntimeException("Message has been deleted");
        }

        if(!message.getSender().getEmail().equals(email)){
            throw new RuntimeException("You can only edit your own");
        }

         boolean isMember = conversationMemberRepository
                 .existsByConversationIdAndUserEmailAndLeftAtIsNull(
                         message.getConversation().getId(),email);

        if(!isMember){
            throw new RuntimeException("You are not a member of this conversation");
        }

        message.setContent(request.getContent());
        message.setEdited(LocalDateTime.now());

        return messageMapper.toMessageResponse(message);
    }

    @Override
    @Transactional
    public MessageResponse deleteMessage(String email, Long messageId) {
        Messages messages = messageRepository.findById(messageId)
                .orElseThrow(()-> new RuntimeException("Message not found"));

        if(messages.isDeleted()){
            throw new RuntimeException("Message has been deleted");
        }

        if (!messages.getSender().getEmail().equals(email)) {
            throw new RuntimeException("You can only delete your own message");
        }

        boolean isMember = conversationMemberRepository
                .existsByConversationIdAndUserEmailAndLeftAtIsNull(
                        messages.getConversation().getId(),
                        email
                );

        if (!isMember) {
            throw new RuntimeException("You are not a member of this conversation");
        }

        messages.setDeleted(true);

        messageRepository.save(messages);

        return messageMapper.toMessageResponse(messages);
    }
}
