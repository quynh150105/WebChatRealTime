package quynh.chatrealtimebe.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import quynh.chatrealtimebe.domain.dto.ApiResponse;
import quynh.chatrealtimebe.domain.dto.request.AddMemberRequest;
import quynh.chatrealtimebe.domain.dto.request.UpdateConversationRequest;
import quynh.chatrealtimebe.domain.dto.response.ConversationResponse;
import quynh.chatrealtimebe.service.GroupChatService;

@RestController
@RequestMapping("/group")
@RequiredArgsConstructor
public class GroupChatController {
    private final GroupChatService groupChatService;

    @PostMapping("/{id}/members")
    public ResponseEntity<ApiResponse<?>> addMembers(
            Authentication authentication,
            @PathVariable("id") Long id,
            @Valid @RequestBody AddMemberRequest addMemberRequest
    ){
        String email = authentication.getName();
        return ResponseEntity.ok(
            ApiResponse.<ConversationResponse>builder()
                    .status(HttpStatus.OK.value())
                    .message("Add members successful")
                    .data(groupChatService.addMembers(email,id,addMemberRequest))
                    .build()
        );
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<ApiResponse<?>> leaveGroup(
        @PathVariable("id") Long id,
        Authentication authentication
    ){
        String email = authentication.getName();
        return ResponseEntity.ok(
                ApiResponse.<ConversationResponse>builder()
                        .status(HttpStatus.OK.value())
                        .message("leave group successful")
                        .data(groupChatService.leaveGroup(email,id))
                        .build()
        );
    }



    @PutMapping(value = "/edit/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<?>> updateGroup(Authentication authentication,
                                                      @PathVariable("id") Long id,
                                                      @ModelAttribute UpdateConversationRequest updateConversationRequest,
                                                      @RequestPart(value="avatar", required = false) MultipartFile avatar
                                                      ){
        String email = authentication.getName();
        return ResponseEntity.ok(
          ApiResponse.<ConversationResponse>builder()
                  .status(HttpStatus.OK.value())
                  .message("update group successful")
                  .data(groupChatService.updateGroup(email,id,updateConversationRequest, avatar))
                  .build()
        );
    }

    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<ApiResponse<?>> removeMember(
        Authentication authentication,
        @PathVariable("id") Long id,
        @PathVariable("userId") Long userId
    ){
        String email = authentication.getName();
        return ResponseEntity.ok(
          ApiResponse.<ConversationResponse>builder()
                  .status(HttpStatus.OK.value())
                  .message("Remove member successful")
                  .data(groupChatService.removeMembers(email,id,userId))
                  .build()
        );
    }

}
