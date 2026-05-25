package quynh.chatrealtimebe.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import quynh.chatrealtimebe.domain.dto.request.SendMessageRequest;
import quynh.chatrealtimebe.domain.dto.response.MessageResponse;
import quynh.chatrealtimebe.service.MessageService;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatSocketController {
    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;


    @MessageMapping("/chat.sendMessage")
    public void sendMessage(Principal principal,
                            @Valid @Payload SendMessageRequest request
                            ){
        MessageResponse response = messageService.sendMessage(principal.getName(), request);

        messagingTemplate.convertAndSend(
                "/topic/conversations/" + response.getConversationId(), response
        );
    }

}
