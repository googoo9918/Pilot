package kr.co.dbinc.com.web.dto.item;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

public class ItemQueryResponseDto {
    @Getter
    @Builder
    @AllArgsConstructor
    public static class ItemQueryResponse{
        private Long itemId;

        private String name;

        private int price;

        private int stockQuantity;

    }
}
