package quynh.chatrealtimebe.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import quynh.chatrealtimebe.domain.entity.ConversationMember;

import java.util.List;

@Repository
public interface ConversationMemberRepository extends JpaRepository<ConversationMember,Long> {
    boolean existsByConversationIdAndUserEmailAndLeftAtIsNull(Long conversationId, String email);
    List<ConversationMember> findByUserEmailAndLeftAtIsNull(String email);
    List<ConversationMember> findByUserEmailAndLeftAtIsNullOrderByConversationUpdatedAtDesc(String email);
}
