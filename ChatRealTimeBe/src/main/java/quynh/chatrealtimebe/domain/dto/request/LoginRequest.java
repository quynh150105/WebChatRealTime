package quynh.chatrealtimebe.domain.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class LoginRequest {
    @Email(message = "email khong dung dinh dang")
    @NotBlank(message="email khong duoc de trong")
    private String email;
    @NotBlank(message="password khong duoc de trong")
    @Size(min=6, message="Mat khau it nhat phai 6 ky tu")
    private String password;
}
