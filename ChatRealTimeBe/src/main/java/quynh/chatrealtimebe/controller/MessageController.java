package quynh.chatrealtimebe.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import quynh.chatrealtimebe.domain.dto.ApiResponse;
import quynh.chatrealtimebe.domain.dto.request.SendMessageRequest;
import quynh.chatrealtimebe.domain.dto.request.UpdateMessageRequest;
import quynh.chatrealtimebe.domain.dto.response.MessageResponse;
import quynh.chatrealtimebe.domain.dto.response.PageResponse;
import quynh.chatrealtimebe.service.MessageService;

import java.util.List;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;

    @PostMapping("/sendMessage")
    public ResponseEntity<ApiResponse<?>> sendMessage(Authentication authentication,
                                                     @Valid @RequestBody SendMessageRequest request){
        return ResponseEntity.ok(
            ApiResponse.<MessageResponse>builder()
                    .status(HttpStatus.OK.value())
                    .message("send message successful")
                    .data(messageService.sendMessage(authentication.getName(), request))
                    .build()
        );
    }

    @GetMapping("/conversation/{conversationId}")
    public ResponseEntity<ApiResponse<?>> getMessage(
            Authentication authentication,
            @PathVariable("conversationId") Long conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ){
        Pageable  pageable = PageRequest.of(page,size);
        return ResponseEntity.ok(
                ApiResponse.<PageResponse<MessageResponse>>builder()
                        .status(HttpStatus.OK.value())
                        .message("get messages successful")
                        .data(messageService.getMessages(authentication.getName(), conversationId, pageable))
                        .build()
        );
    }

    @PutMapping("/{messageId}")
    public ResponseEntity<ApiResponse<?>> getMessage(Authentication authentication,
                                                     @PathVariable("messageId") Long messageId,
                                   @Valid @RequestBody UpdateMessageRequest updateMessageRequest
    ){
        return ResponseEntity.ok(
                ApiResponse.<MessageResponse>builder()
                        .status(HttpStatus.OK.value())
                        .message("update messages successful")
                        .data(messageService.updateMessage(authentication.getName(), messageId, updateMessageRequest))
                        .build()
        );
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<ApiResponse<?>> deleteMessage(Authentication authentication,
                                                     @PathVariable("messageId") Long messageId){
        return ResponseEntity.ok(
                ApiResponse.<MessageResponse>builder()
                        .status(HttpStatus.OK.value())
                        .message("delete messages successful")
                        .data(messageService.deleteMessage(authentication.getName(), messageId))
                        .build()
        );
    }


}
