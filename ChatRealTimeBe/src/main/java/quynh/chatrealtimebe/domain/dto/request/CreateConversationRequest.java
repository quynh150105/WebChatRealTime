package quynh.chatrealtimebe.domain.dto.request;

import lombok.*;
import quynh.chatrealtimebe.constant.TypeConversation;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateConversationRequest {
    private TypeConversation type;
    private String name;
    private String avatarUrl;
    private List<Long> memberIds;
}
