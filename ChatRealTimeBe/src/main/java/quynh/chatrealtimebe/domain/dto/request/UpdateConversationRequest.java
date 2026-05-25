package quynh.chatrealtimebe.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateConversationRequest {
    @NotBlank(message = "Conversation's name must be not blank")
    private String name;
    private String avatarUrl;
}
