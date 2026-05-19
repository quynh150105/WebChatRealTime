package quynh.chatrealtimebe.domain.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {
    private Long id;

    private String username;

    private String email;

    private String fullName;

    private String  avatarUrl;
}
