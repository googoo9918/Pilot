package kr.co.dbinc.com.web.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

public class OrderWriteRequestDto {
    @Getter
    @Builder
    @AllArgsConstructor
    public static class DeliveryCreate {
        private Long deliveryId;
        private String city;
        private String street;
        private String zipcode;
        private String status; // READY, COMP
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class OrderCreate {
        private Long orderId;
        private Long memberId;
        private Long deliveryId;
        private String status; // ORDER, CANCEL
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class OrderItemCreate {
        private Long orderItemId;
        private Long orderId;
        private Long itemId;
        private int orderPrice;
        private int count;
    }
}
