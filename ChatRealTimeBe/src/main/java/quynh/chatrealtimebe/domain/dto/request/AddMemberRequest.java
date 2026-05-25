package quynh.chatrealtimebe.domain.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class AddMemberRequest {
    @NotEmpty(message = "memberIds must not be empty")
    private List<Long> memberIds;
}
