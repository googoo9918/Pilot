package kr.co.dbinc.com.web.service.member;


import kr.co.dbinc.com.common.error.ErrorCode;
import kr.co.dbinc.com.common.error.exception.BusinessException;
import kr.co.dbinc.com.web.dto.member.MemberQueryResponseDto;
import kr.co.dbinc.com.web.dto.member.MemberRequestDto;
import kr.co.dbinc.com.web.dto.member.MemberResponseDto;
import kr.co.dbinc.com.web.dto.member.MemberWriteRequestDto;
import kr.co.dbinc.com.web.entity.member.Member;
import kr.co.dbinc.com.web.mapper.member.MemberMapper;
import kr.co.dbinc.com.web.repository.member.MemberJpaRepository;
import kr.co.dbinc.com.web.repository.member.MemberMyBatisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

    private final MemberJpaRepository memberJPARepository;
    private final MemberMyBatisRepository memberMyBatisRepository;
    private final MemberMapper memberMapper;


    /**
     * JPA로 회원 생성
     */
    public MemberResponseDto.MemberResponse createMemberByJpa(MemberRequestDto.MemberRequest memberRequest) {
        // requestDto -> Entity
        Member member = memberMapper.memberRequestDtoToMember(memberRequest);
        if (memberJPARepository.existsByName(member.getName())) {
            throw new BusinessException(ErrorCode.MEMBER_ALREADY_EXIST);
        }
        Member newMember = memberJPARepository.save(member);
        return memberMapper.memberToMemberResponseDto(newMember);
    }

    /**
     * MyBatis로 회원 생성
     */
    public MemberResponseDto.MemberResponse createMemberByMyBatis(MemberRequestDto.MemberRequest memberRequest) {
        // requestDto -> WriteRequestDto로 변환
        MemberWriteRequestDto.MemberCreate memberCreate = memberMapper.memberRequestDtoToMemberCreate(memberRequest);
        boolean isExistMember = memberMyBatisRepository.isExistMember(memberCreate.getName());
        if (isExistMember) {
            throw new BusinessException(ErrorCode.MEMBER_ALREADY_EXIST);
        }
        memberMyBatisRepository.createMember(memberCreate);
        return memberMapper.memberCreateToMemberResponseDto(memberCreate);
    }

    /**
     * JPA로 회원 목록 조회
     */
    @Transactional(readOnly = true)
    public List<MemberResponseDto.MemberResponse> getMemberListByJpa() {
        List<Member> memberList = memberJPARepository.findAll();
        return memberMapper.memberListToMemberResponseDtoList(memberList);
    }

    /**
     * MyBatis로 회원 목록 조회
     */
    @Transactional(readOnly = true)
    public List<MemberResponseDto.MemberResponse> getMemberListByMyBatis() {
        List<MemberQueryResponseDto.MemberQueryResponse> memberQueryResponseList = memberMyBatisRepository.findMemberList();
        //QueryResponse -> Response 변환
        return memberMapper.memberQueryResponseListToMemberResponseList(memberQueryResponseList);
    }
}
