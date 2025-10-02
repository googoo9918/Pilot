package kr.co.dbinc.com.web.dto.item;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;

public class ItemRequestDto {

    @Getter
    @AllArgsConstructor
    public static class ItemRequest {
        @NotBlank(message = "상품명은 필수 입력값입니다.")
        private String name;

        @NotNull(message = "가격은 필수 입력값입니다.")
        @Min(value = 1, message = "가격은 1 이상이어야 합니다.")
        private int price;

        @NotNull(message = "수량은 필수 입력값입니다.")
        @Min(value = 1, message = "수량은 1 이상이어야 합니다.")
        private int stockQuantity;
    }
}
