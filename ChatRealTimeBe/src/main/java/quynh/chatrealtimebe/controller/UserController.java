package quynh.chatrealtimebe.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import quynh.chatrealtimebe.domain.dto.ApiResponse;
import quynh.chatrealtimebe.domain.dto.request.UpdateUserRequest;
import quynh.chatrealtimebe.domain.dto.response.UserResponse;
import quynh.chatrealtimebe.service.UserService;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<?>> getMe(Authentication authentication){
        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .status(HttpStatus.OK.value())
                        .message("Get current user")
                        .data(userService.getMe(authentication.getName()))
                        .build()
        );
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<?>> updateMe(Authentication authentication, @RequestBody UpdateUserRequest request){
        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .status(HttpStatus.OK.value())
                        .message("Update current user")
                        .data(userService.updateMe(authentication.getName(), request))
                        .build()
        );
    }

    @PutMapping(value = "/me", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<?>> updateMeWithAvatar(
            Authentication authentication,
            @ModelAttribute UpdateUserRequest request,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar
    ){
        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .status(HttpStatus.OK.value())
                        .message("Update current user")
                        .data(userService.updateMe(authentication.getName(), request, avatar))
                        .build()
        );
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<?>> searchUser(@RequestParam String keywords){
        return ResponseEntity.ok(
            ApiResponse.<List<UserResponse>>builder()
                    .status(HttpStatus.OK.value())
                    .message("Search user successful")
                    .data(userService.searchUsers(keywords))
                    .build()
        );
    }

}
