package kr.co.dbinc.com.web.service.member;

import jakarta.transaction.Transactional;
import kr.co.dbinc.com.web.dto.member.MemberRequestDto;
import kr.co.dbinc.com.web.dto.member.MemberResponseDto;
import kr.co.dbinc.com.web.entity.member.Member;
import kr.co.dbinc.com.web.mapper.member.MemberMapper;
import kr.co.dbinc.com.web.repository.member.MemberJPARepository;
import kr.co.dbinc.com.web.repository.member.MemberMyBatisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

    private final MemberJPARepository memberJPARepository;
    private final MemberMyBatisRepository memberMyBatisRepository;
    private final MemberMapper memberMapper;


    /**
     * JPA로 회원 생성
     */
    public MemberResponseDto.MemberResponse createMemberByJpa(Member member) {
        Member newMember = memberJPARepository.save(member);
        return memberMapper.memberToMemberResponseDto(newMember);
    }

    /**
     * MyBatis로 회원 생성
     */
    public void createMemberByMyBatis(MemberRequestDto.MemberRequest memberRequest){
        memberMyBatisRepository.createMember(memberRequest);
    }

    /**
     * JPA로 회원 목록 조회
     */
    public List<MemberResponseDto.MemberResponse> getMemberListByJpa() {
        List<Member> memberList = memberJPARepository.findAll();
        return memberMapper.memberListToMemberResponseDtoList(memberList);
    }

    /**
     * MyBatis로 회원 목록 조회
     */
//    public List<MemberResponseDto.MemberResponse> getMemberListByMyBatis() {
//
//    }

}
