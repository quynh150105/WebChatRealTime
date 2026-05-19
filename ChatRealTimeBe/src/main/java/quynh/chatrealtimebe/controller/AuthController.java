package quynh.chatrealtimebe.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import quynh.chatrealtimebe.domain.dto.ApiResponse;
import quynh.chatrealtimebe.domain.dto.request.LoginRequest;
import quynh.chatrealtimebe.domain.dto.request.RegisterRequest;
import quynh.chatrealtimebe.domain.dto.response.LoginResponse;
import quynh.chatrealtimebe.domain.dto.response.RegisterResponse;
import quynh.chatrealtimebe.service.AuthService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(@Valid  @RequestBody  RegisterRequest request){
        return ResponseEntity.ok(
                ApiResponse.<RegisterResponse>builder()
                        .data(authService.register(request))
                        .message("register successful")
                        .status(HttpStatus.CREATED.value())
                        .build()
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> register(@Valid  @RequestBody LoginRequest request){
        return ResponseEntity.ok(
                ApiResponse.<LoginResponse>builder()
                        .data(authService.login(request))
                        .message("Login successful")
                        .status(HttpStatus.CREATED.value())
                        .build()
        );
    }
}
