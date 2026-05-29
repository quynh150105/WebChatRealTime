package quynh.chatrealtimebe.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import quynh.chatrealtimebe.domain.dto.request.UpdateUserRequest;
import quynh.chatrealtimebe.domain.dto.response.UserResponse;
import quynh.chatrealtimebe.domain.entity.User;
import quynh.chatrealtimebe.domain.mapper.UserMapper;
import quynh.chatrealtimebe.repository.UserRepository;
import quynh.chatrealtimebe.service.UserService;
import quynh.chatrealtimebe.utils.CloudinaryService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final CloudinaryService cloudinaryService;

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

    @Override
    @Transactional
    public UserResponse updateMe(String email, UpdateUserRequest request, MultipartFile avatar) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("User not found"));

        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());

        if (avatar != null && !avatar.isEmpty()) {
            String avatarUrl = cloudinaryService.uploadImage(avatar);
            user.setAvatarUrl(avatarUrl);
        }

        return userMapper.toUserResponse(user);
    }

    @Override
    public List<UserResponse> searchUsers(String keywords) {
       List<User> list = userRepository.findByEmailContainingIgnoreCaseOrFullNameContainingIgnoreCase(keywords, keywords);
       List<UserResponse> listResponse = userMapper.toListUserResponse(list);
        return listResponse;
    }
}
