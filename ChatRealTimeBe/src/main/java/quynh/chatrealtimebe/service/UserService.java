package quynh.chatrealtimebe.service;

import org.springframework.web.multipart.MultipartFile;
import quynh.chatrealtimebe.domain.dto.request.UpdateUserRequest;
import quynh.chatrealtimebe.domain.dto.response.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse getMe(String email);

    UserResponse updateMe(String email, UpdateUserRequest request);

    UserResponse updateMe(String email, UpdateUserRequest request, MultipartFile avatar);

    List<UserResponse> searchUsers(String keywords);
}
