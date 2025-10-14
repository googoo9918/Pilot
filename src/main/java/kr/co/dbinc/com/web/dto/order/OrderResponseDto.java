package kr.co.dbinc.com.web.dto.order;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import kr.co.dbinc.com.web.entity.Address;
import kr.co.dbinc.com.web.entity.delivery.Delivery;
import kr.co.dbinc.com.web.entity.member.Member;
import kr.co.dbinc.com.web.entity.orderItem.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "주문 관련 응답 DTO")
public class OrderResponseDto {

    @Schema(description = "주문 정보 응답")
    @Getter
    @Builder
    @AllArgsConstructor
    public static class OrderResponse {
        @Schema(description = "주문 ID", example = "1")
        private Long orderId;
        
        @Schema(description = "주문 회원 ID", example = "1")
        private Long memberId;
        
        @Schema(description = "주문 상태", example = "ORDER", allowableValues = {"ORDER", "CANCEL"})
        private String orderStatus;     // ORDER, CANCEL
        
        @Schema(description = "주문 일시", example = "2024-01-15T10:30:00")
        private LocalDateTime orderDate;
        
        @Schema(description = "배송 정보")
        private Delivery delivery;
        
        @Schema(description = "주문 상품 목록")
        private List<OrderItemSummary> items;
    }

    @Schema(description = "주문 상품 요약 정보")
    @Getter
    @Builder
    @AllArgsConstructor
    public static class OrderItemSummary {
        @Schema(description = "상품 ID", example = "1")
        private Long itemId;
        
        @Schema(description = "주문 상품 ID", example = "1")
        private Long orderItemId;
        
        @Schema(description = "주문 시점 상품 가격", example = "1000000")
        private int orderPrice;         // 스냅샷 단가
        
        @Schema(description = "주문 수량", example = "2")
        private int count;
    }

    @Schema(description = "주문 목록 행 정보")
    @Getter
    @Builder
    @AllArgsConstructor
    public static class OrderListRow {
        @Schema(description = "주문 상품 ID", example = "1")
        private Long orderItemId;
        
        @Schema(description = "주문 ID", example = "1")
        private Long orderId;
        
        @Schema(description = "상품 ID", example = "1")
        private Long itemId;
        
        @Schema(description = "회원 이름", example = "홍길동")
        private String memberName;
        
        @Schema(description = "상품명", example = "노트북")
        private String itemName;
        
        @Schema(description = "주문 시점 상품 가격", example = "1000000")
        private int orderPrice;           // 스냅샷 단가
        
        @Schema(description = "주문 수량", example = "2")
        private int count;
        
        @Schema(description = "주문 상태", example = "ORDER", allowableValues = {"ORDER", "CANCEL"})
        private String orderStatus;       // ORDER, CANCEL
        
        @Schema(description = "배송 주소", example = "서울시 강남구 테헤란로 123")
        private String address;
        
        @Schema(description = "우편번호", example = "12345")
        private String zipcode;
        
        @Schema(description = "주문 일시", example = "2024-01-15T10:30:00")
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
        private LocalDateTime orderDate;
    }
}
