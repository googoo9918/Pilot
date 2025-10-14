package kr.co.dbinc.com.web.doc.item;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kr.co.dbinc.com.web.dto.item.ItemRequestDto;
import kr.co.dbinc.com.web.dto.item.ItemResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Tag(name = "상품 관리", description = "상품 등록, 조회, 수정 등의 상품 관련 API")
public interface ItemAPI {

    @Operation(
            summary = "상품 등록",
            description = "새로운 상품을 시스템에 등록합니다. 상품명, 가격, 재고 수량을 입력받습니다.",
            operationId = "createItem"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "상품이 성공적으로 등록됨",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ItemResponseDto.ItemResponse.class),
                            examples = @ExampleObject(
                                    name = "성공 예시",
                                    value = """
                                            {
                                                "itemId": 1,
                                                "name": "노트북",
                                                "price": 1000000,
                                                "stockQuantity": 10
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
                                                "message": "상품명은 필수 입력값입니다.",
                                                "path": "/api/items"
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "중복된 상품명",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "상품명 중복",
                                    value = """
                                            {
                                                "timestamp": "2024-01-15T10:30:00",
                                                "status": 409,
                                                "error": "Conflict",
                                                "message": "이미 등록된 상품명입니다.",
                                                "path": "/api/items"
                                            }
                                            """
                            )
                    )
            )
    })
    ResponseEntity<ItemResponseDto.ItemResponse> createItem(
            @Parameter(description = "상품 등록 요청 데이터", required = true)
            @Valid @RequestBody ItemRequestDto.ItemRequest itemRequest
    );

    @Operation(
            summary = "상품 목록 조회",
            description = "등록된 모든 상품의 목록을 조회합니다. 상품의 기본 정보와 재고 수량이 포함됩니다.",
            operationId = "getItemList"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "상품 목록 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ItemResponseDto.ItemResponse.class),
                            examples = @ExampleObject(
                                    name = "상품 목록 예시",
                                    value = """
                                            [
                                                {
                                                    "itemId": 1,
                                                    "name": "노트북",
                                                    "price": 1000000,
                                                    "stockQuantity": 10
                                                },
                                                {
                                                    "itemId": 2,
                                                    "name": "마우스",
                                                    "price": 25000,
                                                    "stockQuantity": 50
                                                },
                                                {
                                                    "itemId": 3,
                                                    "name": "키보드",
                                                    "price": 150000,
                                                    "stockQuantity": 30
                                                }
                                            ]
                                            """
                            )
                    )
            )
    })
    ResponseEntity getItemList();

    @Operation(
            summary = "상품 정보 수정",
            description = "기존 상품의 정보를 수정합니다. 상품명, 가격, 재고 수량을 모두 새로 입력해야 합니다.",
            operationId = "updateItem"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "상품 정보가 성공적으로 수정됨",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ItemResponseDto.ItemResponse.class),
                            examples = @ExampleObject(
                                    name = "수정된 상품 정보",
                                    value = """
                                            {
                                                "itemId": 1,
                                                "name": "고성능 노트북",
                                                "price": 1200000,
                                                "stockQuantity": 15
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
                                                "message": "상품명은 필수 입력값입니다.",
                                                "path": "/api/items/1"
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "상품을 찾을 수 없음",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "상품 없음",
                                    value = """
                                            {
                                                "timestamp": "2024-01-15T10:30:00",
                                                "status": 404,
                                                "error": "Not Found",
                                                "message": "상품을 찾을 수 없습니다.",
                                                "path": "/api/items/999"
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "중복된 상품명",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "상품명 중복",
                                    value = """
                                            {
                                                "timestamp": "2024-01-15T10:30:00",
                                                "status": 409,
                                                "error": "Conflict",
                                                "message": "이미 등록된 상품명입니다.",
                                                "path": "/api/items/1"
                                            }
                                            """
                            )
                    )
            )
    })
    ResponseEntity updateItem(
            @Parameter(description = "수정할 상품 ID", required = true, example = "1")
            @PathVariable Long itemId,
            @Parameter(description = "상품 수정 요청 데이터", required = true)
            @Valid @RequestBody ItemRequestDto.ItemRequest itemRequest
    );
}
