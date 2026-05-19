package quynh.chatrealtimebe.domain.dto.request;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class UpdateUserRequest {
    @NotBlank(message="username khong duoc de trong")
    @Size(min=3, message="Username it nhat phai 3 ky tu")
    private String username;

    @Size(min=6, message="full name it nhat phai 6 ky tu")
    @NotBlank(message="full name khong duoc de trong")
    private String fullName;

    private String  avatarUrl;
}
