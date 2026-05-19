package quynh.chatrealtimebe.service;

import quynh.chatrealtimebe.domain.dto.request.UpdateUserRequest;
import quynh.chatrealtimebe.domain.dto.response.UserResponse;

import java.util.List;

public interface AdminService {
    List<UserResponse> getAll();

    UserResponse getUserById(Long id);

    UserResponse deleteUserById(Long id);

    UserResponse updateUser(Long id, UpdateUserRequest request);

}
