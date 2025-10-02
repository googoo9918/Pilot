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

import java.net.URI;
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
        // 1.JPA 사용 시
//        MemberResponseDto.MemberResponse memberResponse = memberService.createMemberByJpa(memberRequest);

        // 2. myBatis 사용 시
        MemberResponseDto.MemberResponse memberResponse = memberService.createMemberByMyBatis(memberRequest);

        URI location = URI.create("/api/members/" + memberResponse.getMemberId());
        return ResponseEntity.created(location).body(memberResponse);
    }

    /**
     * 회원 목록 조회
     */
    @GetMapping()
    public ResponseEntity getMemberList(){
        // 1. JPA 사용 시
//        List<MemberResponseDto.MemberResponse> memberResponseList = memberService.getMemberListByJpa();
//
//        return ResponseEntity.ok(memberResponseList);

        // 2. myBatis 사용 시
        List<MemberResponseDto.MemberResponse> memberResponseList = memberService.getMemberListByMyBatis();

        return ResponseEntity.ok(memberResponseList);
    }
}
