package quynh.chatrealtimebe.service;

import quynh.chatrealtimebe.domain.dto.request.LoginRequest;
import quynh.chatrealtimebe.domain.dto.request.RegisterRequest;
import quynh.chatrealtimebe.domain.dto.response.LoginResponse;
import quynh.chatrealtimebe.domain.dto.response.RegisterResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);

    RegisterResponse register(RegisterRequest request);

}
