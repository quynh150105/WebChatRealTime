package quynh.chatrealtimebe.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import quynh.chatrealtimebe.domain.entity.Conversation;

import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @EntityGraph(attributePaths = {"members","members.user"})
    Optional<Conversation> findWithMembersById(Long id);

    @Query("""
        select c from Conversation c
            join c.members m1
                join c.members m2
                    where c.types = 'DIRECT'
                        and m1.user.id = :userId1
                            and m2.user.id = :userId2
                                and m1.leftAt is null
                                    and m2.leftAt is null
    """
    )
    @EntityGraph(attributePaths = {"members", "members.user"})
    Optional<Conversation> findDirectConversation(Long userId1, Long userId2);

}
