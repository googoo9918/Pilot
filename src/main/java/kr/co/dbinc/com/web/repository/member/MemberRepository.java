package kr.co.dbinc.com.web.repository.member;

import kr.co.dbinc.com.web.entity.member.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
}
