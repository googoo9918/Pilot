package kr.co.dbinc.com.web.controller.member;

import jakarta.validation.Valid;
import kr.co.dbinc.com.web.dto.member.MemberRequestDto;
import kr.co.dbinc.com.web.dto.member.MemberResponseDto;
import kr.co.dbinc.com.web.entity.member.Member;
import kr.co.dbinc.com.web.mapper.member.MemberMapper;
import kr.co.dbinc.com.web.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/members")
public class MemberRestController {

    private final MemberService memberService;
    private final MemberMapper memberMapper;

    @PostMapping()
    public ResponseEntity createMember(@Valid @RequestBody MemberRequestDto.MemberRequest memberRequest){
        Member member = memberMapper.memberRequestDtoToMember(memberRequest);

        MemberResponseDto.MemberResponse memberResponse = memberService.createMember(member);

        return ResponseEntity.ok(memberResponse);
    }
}
