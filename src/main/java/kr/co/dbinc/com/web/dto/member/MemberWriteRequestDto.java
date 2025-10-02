package kr.co.dbinc.com.web.dto.member;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

public class MemberWriteRequestDto {

    @Getter
    @AllArgsConstructor
    @Builder
    public static class MemberCreate{
        private Long memberId;

        private String name;

        private String phoneNumber;

        private String city;

        private String street;

        private String zipcode;
    }
}
