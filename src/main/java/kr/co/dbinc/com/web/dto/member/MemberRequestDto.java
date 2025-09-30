package kr.co.dbinc.com.web.dto.member;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;

public class MemberRequestDto {

    // 회원 생성 요청 Dto
    @Getter
    @AllArgsConstructor
    public static class MemberRequest {
        @NotNull(message = "이름은 필수 입력값입니다.")
        private String name;

        @NotNull(message = "도시는 필수 입력값입니다.")
        private String city;

        @NotNull(message = "거리는 필수 입력값입니다.")
        private String street;

        @NotNull(message = "우편번호는 필수 입력값입니다.")
        private String zipcode;
    }
}
