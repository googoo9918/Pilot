package kr.co.dbinc.com.web.dto.item;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

public class ItemWriteRequestDto {
    @Getter
    @AllArgsConstructor
    @Builder
    public static class ItemCreate {
        private String itemId;

        private String name;

        private String price;

        private String stockQuantity;
    }
}
