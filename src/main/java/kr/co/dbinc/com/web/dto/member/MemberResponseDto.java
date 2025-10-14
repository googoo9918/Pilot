package kr.co.dbinc.com.web.dto.member;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.co.dbinc.com.web.entity.Address;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Schema(description = "회원 관련 응답 DTO")
public class MemberResponseDto {

    @Schema(description = "회원 정보 응답")
    @Getter
    @Builder
    @AllArgsConstructor
    public static class MemberResponse{
        @Schema(description = "회원 ID", example = "1")
        private Long memberId;

        @Schema(description = "회원 이름", example = "홍길동")
        private String name;

        @Schema(description = "전화번호", example = "010-1234-5678")
        private String phoneNumber;

        @Schema(description = "도시", example = "서울시")
        private String city;

        @Schema(description = "거리 주소", example = "강남구 테헤란로 123")
        private String street;

        @Schema(description = "우편번호", example = "12345")
        private String zipcode;
    }
}
