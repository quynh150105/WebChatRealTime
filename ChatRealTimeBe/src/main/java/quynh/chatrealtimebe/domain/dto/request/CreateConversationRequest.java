package quynh.chatrealtimebe.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
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
    @NotBlank(message = "conversation name must be not blank")
    private String name;
    private String avatarUrl;
    private List<Long> memberIds;
}
