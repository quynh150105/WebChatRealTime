package quynh.chatrealtimebe.service;

import quynh.chatrealtimebe.domain.dto.request.UpdateUserRequest;
import quynh.chatrealtimebe.domain.dto.response.UserResponse;

public interface UserService {

    UserResponse getMe(String email);

    UserResponse updateMe(String email, UpdateUserRequest request);

}
