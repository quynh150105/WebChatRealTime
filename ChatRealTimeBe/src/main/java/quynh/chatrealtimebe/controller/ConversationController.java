package quynh.chatrealtimebe.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import quynh.chatrealtimebe.domain.dto.ApiResponse;
import quynh.chatrealtimebe.domain.dto.request.CreateConversationRequest;
import quynh.chatrealtimebe.domain.dto.response.ConversationResponse;
import quynh.chatrealtimebe.service.ConversationService;

import java.util.List;

@RestController
@RequestMapping("/conversations")
@RequiredArgsConstructor
@Slf4j
public class ConversationController {
    private final ConversationService conversationService;

    @PostMapping()
    public ResponseEntity<ApiResponse<?>> createConversation(Authentication authentication,
                                                             @Valid @RequestBody CreateConversationRequest request){
        String email = authentication.getName();
        log.info("email: " + email);
        return ResponseEntity.ok(
            ApiResponse.<ConversationResponse>builder()
                    .status(HttpStatus.CREATED.value())
                    .message("Create conversation successful")
                    .data(conversationService.create(authentication.getName(),request))
                    .build()
        );
    }

    @GetMapping()
    public ResponseEntity<ApiResponse<?>> getMyConversation(Authentication authentication){
        String email = authentication.getName();
        log.info("email: " + email);
        return ResponseEntity.ok(
                ApiResponse.<List<ConversationResponse>>builder()
                        .status(HttpStatus.OK.value())
                        .message("Get my conversation successful")
                        .data(conversationService.getMyConversations(email))
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getDetail(Authentication authentication, @PathVariable("id") Long id){
        String email = authentication.getName();
        log.info("email: " + email);
        return ResponseEntity.ok(
                ApiResponse.<ConversationResponse>builder()
                        .status(HttpStatus.OK.value())
                        .message("Get conversation detail successful")
                        .data(conversationService.getDetail(email,id))
                        .build()
        );
    }


}
