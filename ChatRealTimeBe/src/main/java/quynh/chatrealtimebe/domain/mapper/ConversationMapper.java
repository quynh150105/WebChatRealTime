package quynh.chatrealtimebe.domain.mapper;


import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import quynh.chatrealtimebe.domain.dto.response.ConversationResponse;
import quynh.chatrealtimebe.domain.dto.response.UserResponse;
import quynh.chatrealtimebe.domain.entity.Conversation;
import quynh.chatrealtimebe.domain.entity.ConversationMember;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ConversationMapper {
    @Mapping(target = "type", source = "types")
    @Mapping(target = "members", expression = "java(toMembers(conversation.getMembers()))")
    ConversationResponse toConversationResponse(Conversation conversation);

    default List<UserResponse> toMembers(List<ConversationMember> members){
        if(members == null){
            return List.of();
        }

        return members.stream()
                .filter(member -> member.getLeftAt() == null)
                .map(member -> {
                    var user = member.getUser();
                    return UserResponse.builder()
                            .id(user.getId())
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .fullName(user.getFullName())
                            .avatarUrl(user.getAvatarUrl())
                            .build();
                })
                .toList();


    }

}
