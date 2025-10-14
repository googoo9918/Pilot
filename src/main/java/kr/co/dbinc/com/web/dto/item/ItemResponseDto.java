package kr.co.dbinc.com.web.dto.item;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Schema(description = "상품 관련 응답 DTO")
public class ItemResponseDto {
    @Schema(description = "상품 정보 응답")
    @Getter
    @Builder
    @AllArgsConstructor
    public static class ItemResponse {
        @Schema(description = "상품 ID", example = "1")
        private Long itemId;

        @Schema(description = "상품명", example = "노트북")
        private String name;

        @Schema(description = "상품 가격", example = "1000000")
        private int price;

        @Schema(description = "재고 수량", example = "10")
        private int stockQuantity;
    }
}
