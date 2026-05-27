package quynh.chatrealtimebe.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import quynh.chatrealtimebe.constant.RoleConversation;
import quynh.chatrealtimebe.constant.TypeConversation;
import quynh.chatrealtimebe.domain.dto.request.AddMemberRequest;
import quynh.chatrealtimebe.domain.dto.request.UpdateConversationRequest;
import quynh.chatrealtimebe.domain.dto.response.ConversationResponse;
import quynh.chatrealtimebe.domain.entity.Conversation;
import quynh.chatrealtimebe.domain.entity.ConversationMember;
import quynh.chatrealtimebe.domain.entity.User;
import quynh.chatrealtimebe.domain.mapper.ConversationMapper;
import quynh.chatrealtimebe.repository.ConversationMemberRepository;
import quynh.chatrealtimebe.repository.ConversationRepository;
import quynh.chatrealtimebe.repository.UserRepository;
import quynh.chatrealtimebe.service.GroupChatService;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class GroupChatServiceImpl implements GroupChatService {
   private final ConversationRepository conversationRepository;
   private final ConversationMapper conversationMapper;
   private final UserRepository userRepository;
    private final ConversationMemberRepository conversationMemberRepository;

    @Override
    @Transactional
    public ConversationResponse updateGroup(String email, Long conversationId, UpdateConversationRequest request) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(()-> new RuntimeException("Conversation not found"));

        ConversationMember currentMember = getCurrentMember(conversationId, email);
        checkCanManageGroup(conversation,currentMember);

        if(request.getName() != null){
            conversation.setName(request.getName());
        }
        if(request.getAvatarUrl() != null){
            conversation.setAvatarUrl(request.getAvatarUrl());
        }

        conversationRepository.save(conversation);
        Conversation savedConversation = getConversationWithMembers(conversationId);
        return  conversationMapper.toConversationResponse(savedConversation);
    }

    @Override
    @Transactional
    public ConversationResponse addMembers(String email, Long conversationId, AddMemberRequest request) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(()-> new RuntimeException("Conversation not found"));

        ConversationMember currentMember = getCurrentMember(conversationId,email);
        checkCanManageGroup(conversation,currentMember);

        for(Long userId : request.getMemberIds()){
              if(userId.equals(currentMember.getUser().getId())){
                  continue;
              }

              ConversationMember existingMember = conversationMemberRepository
                      .findByConversationIdAndUserId(conversationId,userId)
                      .orElse(null);

              if(existingMember != null){
                  if(existingMember.getLeftAt() == null){
                      continue;
                  }
                  existingMember.setLeftAt(null);
                  existingMember.setRole(RoleConversation.MEMBER);
                  existingMember.setLastReadMessage(null);
                  conversationMemberRepository.save(existingMember);
                  continue;
              }

              User user = userRepository.findById(userId)
                      .orElseThrow(()-> new RuntimeException("User not found"));

              conversationMemberRepository.save(
                      ConversationMember.builder()
                              .conversation(conversation)
                              .user(user)
                              .role(RoleConversation.MEMBER)
                              .build()
              );
        }

        Conversation savedConversation = getConversationWithMembers(conversationId);
        return conversationMapper.toConversationResponse(savedConversation);
    }

    @Override
    @Transactional
    public ConversationResponse removeMembers(String email, Long conversationId, Long userId) {

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(()-> new RuntimeException("conversation not found"));

        ConversationMember currentMember = getCurrentMember(conversationId,email);
        checkCanManageGroup(conversation,currentMember);

        ConversationMember targetMember = conversationMemberRepository
                .findByConversationIdAndUserIdAndLeftAtIsNull(conversationId,userId)
                .orElseThrow(()-> new RuntimeException("Target user is not a member of this group"));

        if(targetMember.getRole() == RoleConversation.OWNER){
            throw new RuntimeException("Cannot remove owner before transferring ownership");
        }

        targetMember.setLeftAt(LocalDateTime.now());
        conversationMemberRepository.save(targetMember);

        Conversation savedConversation = getConversationWithMembers(conversationId);

        return conversationMapper.toConversationResponse(savedConversation);
    }

    @Override
    @Transactional
    public ConversationResponse leaveGroup(String email, Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(()-> new RuntimeException("conversation not found"));

        if(conversation.getTypes() != TypeConversation.GROUP){
            throw new RuntimeException("cannot leave direct conversation");
        }

        ConversationMember currentMember = getCurrentMember(conversationId, email);

        if(currentMember.getRole() == RoleConversation.OWNER){
            throw new RuntimeException("Owner cannot leave before transferring ownership");
        }

        currentMember.setLeftAt(LocalDateTime.now());
        conversationMemberRepository.save(currentMember);

        Conversation savedConversation = getConversationWithMembers(conversationId);
        return conversationMapper.toConversationResponse(savedConversation);
    }

    private ConversationMember getCurrentMember(Long conversationId, String email){
        return conversationMemberRepository
                .findByConversationIdAndUserEmailAndLeftAtIsNull(conversationId,email)
                .orElseThrow(()-> new RuntimeException("you are not a member of this conversation"));
    }

    private void checkCanManageGroup(Conversation conversation, ConversationMember currentMember){
        if(conversation.getTypes() != TypeConversation.GROUP){
            throw new RuntimeException("This action is not allowed for this conversation");
        }

        if(currentMember.getRole() != RoleConversation.OWNER && currentMember.getRole() != RoleConversation.ADMIN){
            throw  new RuntimeException("Only owner or admin can manage this group");

        }
    }

    private Conversation getConversationWithMembers(Long conversationId){
        return conversationRepository.findWithMembersById(conversationId)
                .orElseThrow(()-> new RuntimeException("Conversation not found"));
    }
}
