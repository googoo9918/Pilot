package kr.co.dbinc.com.web.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public class OrderQueryResponseDto {
    @Getter
    @Builder
    @AllArgsConstructor
    public static class OrderListRow {
        private Long orderItemId;
        private Long orderId;
        private Long itemId;
        private String memberName;
        private String itemName;
        private int orderPrice;
        private int count;
        private String orderStatus;
        private String address;
        private String zipcode;
        private LocalDateTime orderDate;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class OrderSummary {
        private Long orderId;
        private Long memberId;
        private String orderStatus;
        private LocalDateTime orderDate;
    }
}
