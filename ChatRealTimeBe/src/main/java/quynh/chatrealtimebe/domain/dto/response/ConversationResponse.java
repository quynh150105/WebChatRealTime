package quynh.chatrealtimebe.domain.dto.response;

import lombok.*;
import quynh.chatrealtimebe.constant.TypeConversation;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ConversationResponse {
    private Long id;
    private TypeConversation type;
    private String name;
    private String avatarUrl;
    private LocalDateTime createdAt;
    private List<UserResponse> members;
}
