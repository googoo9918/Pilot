package kr.co.dbinc.com.web.dto.member;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;

public class MemberRequestDto {

    // 회원 생성 요청 Dto
    @Getter
    @AllArgsConstructor
    public static class MemberRequest {
        @NotBlank(message = "이름은 필수 입력값입니다.")
        private String name;

        @NotBlank(message = "전화번호는 필수 입력값입니다.")
        @Pattern(regexp="^\\d{3}$", message="전화번호 앞자리는 3자리 숫자여야 합니다.")
        private String phonePrefix;

        @NotBlank(message = "전화번호는 필수 입력값입니다.")
        @Pattern(regexp="^\\d{4}$", message="전화번호 중간부는 4자리 숫자여야 합니다.")
        private String phoneMiddle;

        @NotBlank(message = "전화번호는 필수 입력값입니다.")
        @Pattern(regexp="^\\d{4}$", message="전화번호 끝자리는 4자리 숫자여야 합니다.")
        private String phoneLast;

        @NotBlank(message = "도시는 필수 입력값입니다.")
        private String city;

        @NotBlank(message = "거리는 필수 입력값입니다.")
        private String street;

        @NotBlank(message = "우편번호는 필수 입력값입니다.")
        @Pattern(regexp="^\\d{5}$", message="우편번호는 5자리 숫자여야 합니다.")
        private String zipcode;
    }
}
