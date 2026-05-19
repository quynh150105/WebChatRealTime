package quynh.chatrealtimebe.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import quynh.chatrealtimebe.domain.dto.request.UpdateUserRequest;
import quynh.chatrealtimebe.domain.dto.response.UserResponse;
import quynh.chatrealtimebe.domain.entity.User;
import quynh.chatrealtimebe.domain.mapper.UserMapper;
import quynh.chatrealtimebe.repository.UserRepository;
import quynh.chatrealtimebe.service.UserService;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public UserResponse getMe(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("User not found"));

        return userMapper.toUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateMe(String email, UpdateUserRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("User not found"));

        user.setUsername(request.getUsername());
        user.setAvatarUrl(request.getAvatarUrl());
        user.setFullName(request.getFullName());

        return userMapper.toUserResponse(user);
    }
}
