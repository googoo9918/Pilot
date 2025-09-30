package kr.co.dbinc.com.web.service.member;

import jakarta.transaction.Transactional;
import kr.co.dbinc.com.web.dto.member.MemberResponseDto;
import kr.co.dbinc.com.web.entity.Address;
import kr.co.dbinc.com.web.entity.member.Member;
import kr.co.dbinc.com.web.mapper.member.MemberMapper;
import kr.co.dbinc.com.web.repository.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

    private final MemberRepository memberRepository;
    private final MemberMapper memberMapper;

    
    public MemberResponseDto.MemberResponse createMember(Member member) {
        Member newMember = memberRepository.save(member);
        return memberMapper.memberToMemberResponseDto(newMember);
    }
}
