package quynh.chatrealtimebe.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import quynh.chatrealtimebe.domain.dto.ApiResponse;
import quynh.chatrealtimebe.domain.dto.request.UpdateUserRequest;
import quynh.chatrealtimebe.domain.dto.response.UserResponse;
import quynh.chatrealtimebe.service.AdminService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {
    private final AdminService userService;

    @GetMapping()
    public ResponseEntity<ApiResponse<?>> getAllUser(){
        return ResponseEntity.ok(
                ApiResponse.<List<UserResponse>>builder()
                        .status(HttpStatus.OK.value())
                        .message("list users")
                        .data(userService.getAll())
                        .build()
        );
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getUserById(@PathVariable("id") Long id){
        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .status(HttpStatus.OK.value())
                        .message("Get users by id: " + id)
                        .data(userService.getUserById(id))
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> DeleteUserById(@PathVariable("id") Long id){
        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .status(HttpStatus.OK.value())
                        .message("Delete users by id: " + id)
                        .data(userService.deleteUserById(id))
                        .build()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> UpdateUser(@PathVariable("id") Long id, @RequestBody UpdateUserRequest request){
        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .status(HttpStatus.OK.value())
                        .message("Update User by id: " + id)
                        .data(userService.updateUser(id, request))
                        .build()
        );
    }

}
