package kr.co.dbinc.com.web.controller.member;

import jakarta.validation.Valid;
import kr.co.dbinc.com.web.dto.member.MemberRequestDto;
import kr.co.dbinc.com.web.dto.member.MemberResponseDto;
import kr.co.dbinc.com.web.dto.member.MemberWriteRequestDto;
import kr.co.dbinc.com.web.entity.member.Member;
import kr.co.dbinc.com.web.mapper.member.MemberMapper;
import kr.co.dbinc.com.web.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/members")
public class MemberRestController {

    private final MemberService memberService;
    private final MemberMapper memberMapper;

    /**
     * 회원 생성
     */
    @PostMapping()
    public ResponseEntity createMember(@Valid @RequestBody MemberRequestDto.MemberRequest memberRequest){
//        // 1.JPA 사용 시
        Member member = memberMapper.memberRequestDtoToMember(memberRequest);
        MemberResponseDto.MemberResponse memberResponse = memberService.createMemberByJpa(member);

        return ResponseEntity.ok(memberResponse);


        // 2. myBatis 사용 시
        // requestDto -> WriteRequestDto로 변환
//        MemberWriteRequestDto.MemberCreate memberCreate = memberMapper.memberRequestDtoToMemberCreate(memberRequest);
//        memberService.createMemberByMyBatis(memberCreate);
//
//        return ResponseEntity.ok(memberRequest);
    }

    /**
     * 회원 목록 조회
     */
    @GetMapping()
    public ResponseEntity getMemberList(){
        // 1. JPA 사용 시
        List<MemberResponseDto.MemberResponse> memberResponseList = memberService.getMemberListByJpa();

        return ResponseEntity.ok(memberResponseList);

        // 2. myBatis 사용 시
//        List<MemberResponseDto.MemberResponse> memberResponseList = memberService.getMemberListByMyBatis();
//
//        return ResponseEntity.ok(memberResponseList);
    }
}
