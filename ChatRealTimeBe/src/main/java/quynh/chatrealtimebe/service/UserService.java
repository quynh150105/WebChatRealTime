package quynh.chatrealtimebe.service;

import quynh.chatrealtimebe.domain.dto.request.UpdateUserRequest;
import quynh.chatrealtimebe.domain.dto.response.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse getMe(String email);

    UserResponse updateMe(String email, UpdateUserRequest request);

    List<UserResponse> searchUsers(String keywords);
}
