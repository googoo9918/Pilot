package kr.co.dbinc.com.web.dto.member;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

public class MemberQueryResponseDto {
        @Getter
        @Builder
        @AllArgsConstructor
        public static class MemberQueryResponse{
            private Long memberId;

            private String name;

            private String phoneNumber;

            private String city;

            private String street;

            private String zipcode;
        }
}
