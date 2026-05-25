package quynh.chatrealtimebe.domain.dto.response;

import lombok.*;
import org.springframework.cglib.core.Local;
import quynh.chatrealtimebe.constant.TypeMessage;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {
    private Long id;
    private String content;
    private TypeMessage typeMessage;
    private boolean deleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long senderId;
    private String senderName;
    private String senderAvatarUrl;

    private Long conversationId;
    private Long replyToMessageId;

}
