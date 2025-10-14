package kr.co.dbinc.com.web.doc.order;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kr.co.dbinc.com.web.dto.order.OrderRequestDto;
import kr.co.dbinc.com.web.dto.order.OrderResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Tag(name = "주문 관리", description = "주문 생성, 조회, 취소 등의 주문 관련 API")
public interface OrderAPI {

    @Operation(
            summary = "주문 생성",
            description = "회원이 상품을 주문합니다. 주문 시 재고가 자동으로 차감됩니다.",
            operationId = "createOrder"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "주문이 성공적으로 생성됨",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = OrderResponseDto.OrderResponse.class),
                            examples = @ExampleObject(
                                    name = "성공 예시",
                                    value = """
                                            {
                                                "orderId": 1,
                                                "memberId": 1,
                                                "orderStatus": "ORDER",
                                                "orderDate": "2024-01-15T10:30:00",
                                                "delivery": {
                                                    "status": "READY",
                                                    "address": {
                                                        "city": "서울시",
                                                        "street": "강남구 테헤란로 123",
                                                        "zipcode": "12345"
                                                    }
                                                },
                                                "items": [
                                                    {
                                                        "itemId": 1,
                                                        "orderItemId": 1,
                                                        "orderPrice": 10000,
                                                        "count": 2
                                                    }
                                                ]
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
                                                "message": "주문회원은 필수 입력값입니다.",
                                                "path": "/api/orders"
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "회원 또는 상품을 찾을 수 없음",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "회원 없음",
                                    value = """
                                            {
                                                "timestamp": "2024-01-15T10:30:00",
                                                "status": 404,
                                                "error": "Not Found",
                                                "message": "회원을 찾을 수 없습니다.",
                                                "path": "/api/orders"
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "재고 부족",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "재고 부족",
                                    value = """
                                            {
                                                "timestamp": "2024-01-15T10:30:00",
                                                "status": 409,
                                                "error": "Conflict",
                                                "message": "재고가 부족합니다.",
                                                "path": "/api/orders"
                                            }
                                            """
                            )
                    )
            )
    })
    ResponseEntity<OrderResponseDto.OrderResponse> createOrder(
            @Parameter(description = "주문 생성 요청 데이터", required = true)
            @Valid @RequestBody OrderRequestDto.OrderCreateRequest orderCreateRequest
    );

    @Operation(
            summary = "주문 목록 조회",
            description = "모든 주문의 목록을 조회합니다. 주문 상세 정보와 회원, 상품 정보가 포함됩니다.",
            operationId = "getOrderList"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "주문 목록 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = OrderResponseDto.OrderListRow.class),
                            examples = @ExampleObject(
                                    name = "주문 목록 예시",
                                    value = """
                                            [
                                                {
                                                    "orderItemId": 1,
                                                    "orderId": 1,
                                                    "itemId": 1,
                                                    "memberName": "홍길동",
                                                    "itemName": "노트북",
                                                    "orderPrice": 1000000,
                                                    "count": 1,
                                                    "orderStatus": "ORDER",
                                                    "address": "서울시 강남구 테헤란로 123",
                                                    "zipcode": "12345",
                                                    "orderDate": "2024-01-15T10:30:00"
                                                },
                                                {
                                                    "orderItemId": 2,
                                                    "orderId": 1,
                                                    "itemId": 2,
                                                    "memberName": "홍길동",
                                                    "itemName": "마우스",
                                                    "orderPrice": 25000,
                                                    "count": 2,
                                                    "orderStatus": "ORDER",
                                                    "address": "서울시 강남구 테헤란로 123",
                                                    "zipcode": "12345",
                                                    "orderDate": "2024-01-15T10:30:00"
                                                }
                                            ]
                                            """
                            )
                    )
            )
    })
    ResponseEntity getOrderList();

    @Operation(
            summary = "주문 취소",
            description = "특정 주문을 취소합니다. 취소 시 재고가 자동으로 복구됩니다.",
            operationId = "deleteOrder"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "주문이 성공적으로 취소됨"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "주문을 찾을 수 없음",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "주문 없음",
                                    value = """
                                            {
                                                "timestamp": "2024-01-15T10:30:00",
                                                "status": 404,
                                                "error": "Not Found",
                                                "message": "주문을 찾을 수 없습니다.",
                                                "path": "/api/orders/999"
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "이미 취소된 주문",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "이미 취소됨",
                                    value = """
                                            {
                                                "timestamp": "2024-01-15T10:30:00",
                                                "status": 409,
                                                "error": "Conflict",
                                                "message": "이미 취소된 주문입니다.",
                                                "path": "/api/orders/1"
                                            }
                                            """
                            )
                    )
            )
    })
    ResponseEntity deleteOrder(
            @Parameter(description = "취소할 주문 ID", required = true, example = "1")
            @PathVariable Long orderId
    );
}
