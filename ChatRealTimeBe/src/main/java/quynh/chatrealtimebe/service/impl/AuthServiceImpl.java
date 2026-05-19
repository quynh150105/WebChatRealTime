package quynh.chatrealtimebe.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import quynh.chatrealtimebe.config.JwtService;
import quynh.chatrealtimebe.domain.dto.request.LoginRequest;
import quynh.chatrealtimebe.domain.dto.request.RegisterRequest;
import quynh.chatrealtimebe.domain.dto.response.LoginResponse;
import quynh.chatrealtimebe.domain.dto.response.RegisterResponse;
import quynh.chatrealtimebe.domain.entity.User;
import quynh.chatrealtimebe.repository.UserRepository;
import quynh.chatrealtimebe.service.AuthService;

@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(()-> new RuntimeException("User not found"));

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new RuntimeException("Password not matches");
        }

        String token = jwtService.generateToken(user);
        return LoginResponse.builder()
                .token(token).refreshToken(null).build();
    }

    @Override
    public RegisterResponse register(RegisterRequest request) {
        Boolean checkEmail = userRepository.existsByEmail(request.getEmail());

        if(checkEmail){
            throw new RuntimeException("User already exist");
        }

        User user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .avatarUrl(request.getAvatarUrl())
                .fullName(request.getFullName())
                .build();

        user = userRepository.save(user);

        RegisterResponse response = RegisterResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .build();

        return response;
    }
}
