package kr.co.dbinc.com.web.repository.member;

import kr.co.dbinc.com.web.entity.member.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberJpaRepository extends JpaRepository<Member, Long> {
    boolean existsByName(String name);
}
