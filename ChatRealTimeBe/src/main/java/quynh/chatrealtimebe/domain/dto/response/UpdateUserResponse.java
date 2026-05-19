package quynh.chatrealtimebe.domain.dto.response;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class UpdateUserResponse {
    private Long id;

    private String username;

    private String email;

    private String fullName;

    private String  avatarUrl;
}
