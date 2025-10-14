package kr.co.dbinc.com.web.doc.member;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kr.co.dbinc.com.web.dto.member.MemberRequestDto;
import kr.co.dbinc.com.web.dto.member.MemberResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Tag(name = "회원 관리", description = "회원 등록, 조회 등 회원 관련 API")
public interface MemberAPI {

    @Operation(
            summary = "회원 등록",
            description = "새로운 회원을 시스템에 등록합니다. 회원의 기본 정보와 주소 정보를 입력받습니다.",
            operationId = "createMember"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "회원이 성공적으로 등록됨",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MemberResponseDto.MemberResponse.class),
                            examples = @ExampleObject(
                                    name = "성공 예시",
                                    value = """
                                            {
                                                "memberId": 1,
                                                "name": "홍길동",
                                                "phoneNumber": "010-1234-5678",
                                                "city": "서울시",
                                                "street": "강남구 테헤란로 123",
                                                "zipcode": "12345"
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "잘못된 요청 데이터",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "유효성 검사 실패",
                                    value = """
                                            {
                                                "timestamp": "2024-01-15T10:30:00",
                                                "status": 400,
                                                "error": "Bad Request",
                                                "message": "이름은 필수 입력값입니다.",
                                                "path": "/api/members"
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "중복된 전화번호",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "전화번호 중복",
                                    value = """
                                            {
                                                "timestamp": "2024-01-15T10:30:00",
                                                "status": 409,
                                                "error": "Conflict",
                                                "message": "이미 등록된 전화번호입니다.",
                                                "path": "/api/members"
                                            }
                                            """
                            )
                    )
            )
    })
    ResponseEntity<MemberResponseDto.MemberResponse> createMember(
            @Parameter(description = "회원 등록 요청 데이터", required = true)
            @Valid @RequestBody MemberRequestDto.MemberRequest memberRequest
    );

    @Operation(
            summary = "회원 목록 조회",
            description = "등록된 모든 회원의 목록을 조회합니다. 회원의 기본 정보와 주소 정보가 포함됩니다.",
            operationId = "getMemberList"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "회원 목록 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MemberResponseDto.MemberResponse.class),
                            examples = @ExampleObject(
                                    name = "회원 목록 예시",
                                    value = """
                                            [
                                                {
                                                    "memberId": 1,
                                                    "name": "홍길동",
                                                    "phoneNumber": "010-1234-5678",
                                                    "city": "서울시",
                                                    "street": "강남구 테헤란로 123",
                                                    "zipcode": "12345"
                                                },
                                                {
                                                    "memberId": 2,
                                                    "name": "김철수",
                                                    "phoneNumber": "010-9876-5432",
                                                    "city": "부산시",
                                                    "street": "해운대구 센텀중앙로 456",
                                                    "zipcode": "54321"
                                                }
                                            ]
                                            """
                            )
                    )
            )
    })
    ResponseEntity getMemberList();
}
