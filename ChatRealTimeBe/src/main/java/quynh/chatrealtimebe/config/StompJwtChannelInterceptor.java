package quynh.chatrealtimebe.config;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import quynh.chatrealtimebe.repository.ConversationMemberRepository;

@Component
@RequiredArgsConstructor
public class StompJwtChannelInterceptor implements ChannelInterceptor {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final ConversationMemberRepository conversationMemberRepository;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel){
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(
                message, StompHeaderAccessor.class
        );

        if(accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())){
            String authorization = accessor.getFirstNativeHeader("Authorization");

            if(authorization == null || !authorization.startsWith("Bearer ")){
                throw new RuntimeException("Missing websocket token");
            }

            String token = authorization.substring(7);
            String email = jwtService.extractSubject(token);

            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            if(!jwtService.isTokenValid(token,userDetails)){
                throw new RuntimeException("Invalid Websocket token");
            }

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
            accessor.setUser(authentication);
        }

        if(accessor != null && StompCommand.SUBSCRIBE.equals(accessor.getCommand())){
            String destination = accessor.getDestination();
            if(destination != null && destination.startsWith("/topic/conversations")){
                Long conversationId = Long.valueOf(destination.replace("/topic/conversations/",""));
                String email = accessor.getUser().getName();

                boolean isMember = conversationMemberRepository
                        .existsByConversationIdAndUserEmailAndLeftAtIsNull(conversationId,email);
                if(!isMember){
                    throw new RuntimeException("You are not allowed to subscribe this conversation");
                }
            }
        }
        return message;
    }

}
