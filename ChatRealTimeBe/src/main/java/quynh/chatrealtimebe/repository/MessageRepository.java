package quynh.chatrealtimebe.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import quynh.chatrealtimebe.domain.entity.Messages;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Messages, Long> {
    List<Messages> findByConversationIdAndIsDeletedFalseOrderByCreatedAtAsc(Long conversationId);
}
