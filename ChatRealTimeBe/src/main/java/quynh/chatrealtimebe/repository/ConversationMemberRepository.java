package quynh.chatrealtimebe.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import quynh.chatrealtimebe.domain.entity.ConversationMember;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationMemberRepository extends JpaRepository<ConversationMember,Long> {
    boolean existsByConversationIdAndUserEmailAndLeftAtIsNull(Long conversationId, String email);
    List<ConversationMember> findByUserEmailAndLeftAtIsNull(String email);
    List<ConversationMember> findByUserEmailAndLeftAtIsNullOrderByConversationUpdatedAtDesc(String email);
    Optional<ConversationMember> findByConversationIdAndUserEmailAndLeftAtIsNull(Long conversationId, String email);
    Optional<ConversationMember> findByConversationIdAndUserIdAndLeftAtIsNull(Long conversationId, Long userId);
}
