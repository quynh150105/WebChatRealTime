package quynh.chatrealtimebe.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import quynh.chatrealtimebe.constant.TypeMessage;
import quynh.chatrealtimebe.domain.entity.Conversation;
import quynh.chatrealtimebe.domain.entity.Messages;
import quynh.chatrealtimebe.domain.entity.User;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class SendMessageRequest {

    @NotNull(message = "conversation must be not null")
    private Long conversationId;

    @NotBlank(message = "Content must be not blank")
    private String content;

    private TypeMessage typeMessage;

    private Long replyToMessageId;

}
