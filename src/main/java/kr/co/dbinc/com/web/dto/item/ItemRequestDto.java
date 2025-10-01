package kr.co.dbinc.com.web.dto.item;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;

public class ItemRequestDto {

    @Getter
    @AllArgsConstructor
    public static class ItemRequest {
        @NotBlank(message = "상품명은 필수 입력값입니다.")
        private String name;

        @NotBlank(message = "가격은 필수 입력값입니다.")
        @Pattern(regexp = "^[0-9]+$", message = "가격은 숫자만 입력 가능합니다.")
        private String price;

        @NotBlank(message = "수량은 필수 입력값입니다.")
        @Pattern(regexp = "^[0-9]+$", message = "수량은 숫자만 입력 가능합니다.")
        private String stockQuantity;
    }
}
