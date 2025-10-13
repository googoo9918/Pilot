package kr.co.dbinc.com.web.dto.order;

import kr.co.dbinc.com.web.entity.Address;
import kr.co.dbinc.com.web.entity.delivery.Delivery;
import kr.co.dbinc.com.web.entity.member.Member;
import kr.co.dbinc.com.web.entity.orderItem.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponseDto {

    @Getter
    @Builder
    @AllArgsConstructor
    public static class OrderResponse {
        private Long orderId;
        private Long memberId;
        private String orderStatus;     // ORDER, CANCEL
        private LocalDateTime orderDate;
        private Delivery delivery;
        private List<OrderItemSummary> items;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class OrderItemSummary {
        private Long itemId;
        private Long orderItemId;
        private int orderPrice;         // 스냅샷 단가
        private int count;
    }
}
