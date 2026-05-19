package quynh.chatrealtimebe.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import quynh.chatrealtimebe.config.JwtService;
import quynh.chatrealtimebe.domain.dto.request.UpdateUserRequest;
import quynh.chatrealtimebe.domain.dto.response.UserResponse;
import quynh.chatrealtimebe.domain.entity.User;
import quynh.chatrealtimebe.domain.mapper.UserMapper;
import quynh.chatrealtimebe.repository.UserRepository;
import quynh.chatrealtimebe.service.AdminService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;


    @Override
    public List<UserResponse> getAll() {
        List<User> list = userRepository.findAll();
        return userMapper.toListUserResponse(list);
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("User not found"));

        return userMapper.toUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse deleteUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("User not found"));
        UserResponse response = userMapper.toUserResponse(user);

        userRepository.delete(user);
        return response;
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("User not found"));

        user.setUsername(request.getUsername());
        user.setAvatarUrl(request.getAvatarUrl());
        user.setFullName(request.getFullName());

        return userMapper.toUserResponse(user);
    }
}
