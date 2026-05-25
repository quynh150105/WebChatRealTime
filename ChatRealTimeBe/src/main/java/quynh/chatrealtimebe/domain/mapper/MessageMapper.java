package quynh.chatrealtimebe.domain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import quynh.chatrealtimebe.domain.dto.response.MessageResponse;
import quynh.chatrealtimebe.domain.entity.Messages;

@Mapper(componentModel = "spring")
public interface MessageMapper {


    @Mappings({
            @Mapping(target = "senderId", source = "sender.id"),
            @Mapping(target = "senderName", source = "sender.fullName"),
            @Mapping(target = "senderAvatarUrl", source = "sender.avatarUrl"),
            @Mapping(
                    target = "replyToMessageId",
                    expression = "java(messages.getReplyMessage() == null ? null : messages.getReplyMessage().getId())"
            ),
            @Mapping(target = "deleted", source = "deleted"),
            @Mapping(target = "conversationId", source = "conversation.id")
    })
    MessageResponse toMessageResponse(Messages messages);


}
