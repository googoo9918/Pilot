package kr.co.dbinc.com.web.dto.order;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import kr.co.dbinc.com.web.entity.orderItem.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Schema(description = "주문 관련 요청 DTO")
public class OrderRequestDto {
    @Schema(description = "주문 생성 요청")
    @Getter
    @AllArgsConstructor
    public static class OrderCreateRequest {
        @Schema(description = "주문 회원 ID", example = "1")
        @NotNull(message = "주문회원은 필수 입력값입니다.")
        private Long memberId;

        @Schema(description = "주문 상품 목록")
        @NotEmpty(message = "주문 상품 목록은 비어 있을 수 없습니다.")
        private List<OrderItemRequest> orderItems;
    }

    @Schema(description = "주문 상품 요청")
    @Getter
    @AllArgsConstructor
    public static class OrderItemRequest {
        @Schema(description = "상품 ID", example = "1")
        @NotNull(message = "상품 ID는 필수 입력값입니다.")
        private Long itemId;

        @Schema(description = "주문 수량", example = "2", minimum = "1")
        @NotNull(message = "수량은 필수 입력값입니다.")
        @Min(value = 1, message = "수량은 1 이상이어야 합니다.")
        private Integer count;
    }
}
