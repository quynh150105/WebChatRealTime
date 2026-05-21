package quynh.chatrealtimebe.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import quynh.chatrealtimebe.constant.RoleConversation;
import quynh.chatrealtimebe.domain.dto.request.CreateConversationRequest;
import quynh.chatrealtimebe.domain.dto.response.ConversationResponse;
import quynh.chatrealtimebe.domain.entity.Conversation;
import quynh.chatrealtimebe.domain.entity.ConversationMember;
import quynh.chatrealtimebe.domain.entity.User;
import quynh.chatrealtimebe.domain.mapper.ConversationMapper;
import quynh.chatrealtimebe.repository.ConversationMemberRepository;
import quynh.chatrealtimebe.repository.ConversationRepository;
import quynh.chatrealtimebe.repository.UserRepository;
import quynh.chatrealtimebe.service.ConversationService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConversationServiceImpl implements ConversationService {
    private final UserRepository userRepository;

    private final ConversationRepository conversationRepository;

    private final ConversationMemberRepository conversationMemberRepository;

    private final ConversationMapper conversationMapper;

    @Override
    @Transactional
    public ConversationResponse create(String email, CreateConversationRequest request) {

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("User not found"));

        Conversation conversation = Conversation.builder()
                .types(request.getType())
                .name(request.getName())
                .avatarUrl(request.getAvatarUrl())
                .createdBy(currentUser)
                .build();

        conversation = conversationRepository.save(conversation);

        ConversationMember owner = ConversationMember.builder()
                .conversation(conversation)
                .user(currentUser)
                .role(RoleConversation.OWNER)
                .build();

        conversationMemberRepository.save(owner);

        if(request.getMemberIds() != null){
            for(Long userId: request.getMemberIds()){
                if(userId.equals(currentUser.getId())){
                    continue;
                }
                User member = userRepository.findById(userId)
                        .orElseThrow(()-> new RuntimeException("Member not found"));

                conversationMemberRepository.save(
                        ConversationMember.builder()
                                .conversation(conversation)
                                .user(member)
                                .role(RoleConversation.MEMBER)
                                .build()
                );

            }

        }



        Conversation savedConversation = conversationRepository.findWithMembersById(conversation.getId())
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        return conversationMapper.toConversationResponse(savedConversation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConversationResponse> getMyConversations(String email) {

       userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("User not found"));

        return conversationMemberRepository
                .findByUserEmailAndLeftAtIsNullOrderByConversationUpdatedAtDesc(email)
                .stream()
                .map(ConversationMember::getConversation)
                .map(conversationMapper::toConversationResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ConversationResponse getDetail(String email, Long conversationId) {
        boolean isMember = conversationMemberRepository
                .existsByConversationIdAndUserEmailAndLeftAtIsNull(conversationId,email);

        if(!isMember){
            throw  new RuntimeException("You are not a member of this conversation");
        }

        Conversation conversation = conversationRepository
                .findWithMembersById(conversationId)
                .orElseThrow(()-> new RuntimeException("Conversation not found"));


        return conversationMapper.toConversationResponse(conversation);
    }
}
