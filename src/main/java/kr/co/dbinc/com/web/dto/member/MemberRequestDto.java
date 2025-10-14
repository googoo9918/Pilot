package kr.co.dbinc.com.web.dto.member;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Schema(description = "회원 관련 요청 DTO")
public class MemberRequestDto {

    @Schema(description = "회원 등록/수정 요청")
    @Getter
    @AllArgsConstructor
    public static class MemberRequest {
        @Schema(description = "회원 이름", example = "홍길동")
        @NotBlank(message = "이름은 필수 입력값입니다.")
        private String name;

        @Schema(description = "전화번호 앞자리", example = "010", pattern = "^\\d{3}$")
        @NotBlank(message = "전화번호는 필수 입력값입니다.")
        @Pattern(regexp="^\\d{3}$", message="전화번호 앞자리는 3자리 숫자여야 합니다.")
        private String phonePrefix;

        @Schema(description = "전화번호 중간부", example = "1234", pattern = "^\\d{4}$")
        @NotBlank(message = "전화번호는 필수 입력값입니다.")
        @Pattern(regexp="^\\d{4}$", message="전화번호 중간부는 4자리 숫자여야 합니다.")
        private String phoneMiddle;

        @Schema(description = "전화번호 끝자리", example = "5678", pattern = "^\\d{4}$")
        @NotBlank(message = "전화번호는 필수 입력값입니다.")
        @Pattern(regexp="^\\d{4}$", message="전화번호 끝자리는 4자리 숫자여야 합니다.")
        private String phoneLast;

        @Schema(description = "도시", example = "서울시")
        @NotBlank(message = "도시는 필수 입력값입니다.")
        private String city;

        @Schema(description = "거리 주소", example = "강남구 테헤란로 123")
        @NotBlank(message = "거리는 필수 입력값입니다.")
        private String street;

        @Schema(description = "우편번호", example = "12345", pattern = "^\\d{5}$")
        @NotBlank(message = "우편번호는 필수 입력값입니다.")
        @Pattern(regexp="^\\d{5}$", message="우편번호는 5자리 숫자여야 합니다.")
        private String zipcode;
    }
}
