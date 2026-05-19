package quynh.chatrealtimebe.domain.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import quynh.chatrealtimebe.constant.RoleConversation;

import java.time.LocalDateTime;

@Entity
@Table(
        name="conversation_members",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"conversation_id", "user_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name="conversation_id", nullable = false)
    private Conversation conversation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name="user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Column(nullable = false, length = 20)
    private RoleConversation role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="last_read_message_id")
    private Messages lastReadMessage;

    @Column(name="joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    @Column(name="left_at")
    private LocalDateTime leftAt;

    @PrePersist
    public void OnCreate(){
        this.joinedAt = LocalDateTime.now();

        if(this.role == null){
            this.role = RoleConversation.MEMBER;
        }
    }
}
