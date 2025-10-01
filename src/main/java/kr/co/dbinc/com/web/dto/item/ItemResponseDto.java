package kr.co.dbinc.com.web.dto.item;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

public class ItemResponseDto {
    @Getter
    @AllArgsConstructor
    @Builder
    public static class ItemResponse {
        private Long id;

        private String name;

        private int price;

        private int stockQuantity;
    }
}
