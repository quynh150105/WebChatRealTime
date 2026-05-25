package quynh.chatrealtimebe.domain.dto.request;


import jakarta.validation.constraints.NotBlank;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class UpdateMessageRequest {
    @NotBlank
    private String content;
}
