package kr.co.dbinc.com.web.service.member;


import kr.co.dbinc.com.common.error.ErrorCode;
import kr.co.dbinc.com.common.error.exception.BusinessException;
import kr.co.dbinc.com.common.error.exception.EntityNotFoundException;
import kr.co.dbinc.com.web.dto.member.MemberQueryResponseDto;
import kr.co.dbinc.com.web.dto.member.MemberRequestDto;
import kr.co.dbinc.com.web.dto.member.MemberResponseDto;
import kr.co.dbinc.com.web.dto.member.MemberWriteRequestDto;
import kr.co.dbinc.com.web.entity.item.Item;
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

    private final MemberJpaRepository memberJpaRepository;
    private final MemberMyBatisRepository memberMyBatisRepository;
    private final MemberMapper memberMapper;


    /**
     * JPA로 회원 생성
     */
    public MemberResponseDto.MemberResponse createMemberByJpa(MemberRequestDto.MemberRequest memberRequest) {
        // requestDto -> Entity
        Member member = memberMapper.memberRequestDtoToMember(memberRequest);
        if (memberJpaRepository.existsByName(member.getName())) {
            throw new BusinessException(ErrorCode.MEMBER_ALREADY_EXIST);
        }
        Member newMember = memberJpaRepository.save(member);
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
        int createCount = memberMyBatisRepository.createMember(memberCreate);
        if (createCount == 0) throw new IllegalStateException("생성에 실패했습니다.");

        MemberQueryResponseDto.MemberQueryResponse memberQueryResponse = memberMyBatisRepository.selectMemberById(memberCreate.getMemberId());
        return memberMapper.memberQueryResponseToMemberResponse(memberQueryResponse);
    }

    /**
     * JPA로 회원 목록 조회
     */
    @Transactional(readOnly = true)
    public List<MemberResponseDto.MemberResponse> getMemberListByJpa() {
        List<Member> memberList = memberJpaRepository.findAll();
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

    /**
     * pk로 member 조회
     */
    @Transactional(readOnly = true)
    public Member getMemberById(Long memberId) {
        return memberJpaRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.NOT_EXIST_ITEM));
    }
}
