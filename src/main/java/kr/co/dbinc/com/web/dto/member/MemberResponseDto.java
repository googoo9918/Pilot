package kr.co.dbinc.com.web.dto.member;

import kr.co.dbinc.com.web.entity.Address;
import lombok.AllArgsConstructor;
import lombok.Getter;

public class MemberResponseDto {

    @Getter
    @AllArgsConstructor
    public static class MemberResponse{
        private Long memberId;

        private String name;

        private Address address;
    }
}
