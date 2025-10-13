package kr.co.dbinc.com.web.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import kr.co.dbinc.com.web.entity.orderItem.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

public class OrderRequestDto {
    @Getter
    @AllArgsConstructor
    public static class OrderCreateRequest {
        @NotNull(message = "주문회원은 필수 입력값입니다.")
        private Long memberId;

        @NotEmpty(message = "주문 상품 목록은 비어 있을 수 없습니다.")
        private List<OrderItemRequest> orderItems;
    }

    @Getter
    @AllArgsConstructor
    public static class OrderItemRequest {
        @NotNull(message = "상품 ID는 필수 입력값입니다.")
        private Long itemId;

        @NotNull(message = "수량은 필수 입력값입니다.")
        @Min(value = 1, message = "수량은 1 이상이어야 합니다.")
        private Integer count;
    }
}
