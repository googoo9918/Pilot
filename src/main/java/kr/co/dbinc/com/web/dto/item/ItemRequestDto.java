package kr.co.dbinc.com.web.dto.item;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Schema(description = "상품 관련 요청 DTO")
public class ItemRequestDto {

    @Schema(description = "상품 등록/수정 요청")
    @Getter
    @AllArgsConstructor
    public static class ItemRequest {
        @Schema(description = "상품명", example = "노트북", maxLength = 10)
        @NotBlank(message = "상품명은 필수 입력값입니다.")
        private String name;

        @Schema(description = "상품 가격", example = "1000000", minimum = "1")
        @NotNull(message = "가격은 필수 입력값입니다.")
        @Min(value = 1, message = "가격은 1 이상이어야 합니다.")
        private int price;

        @Schema(description = "재고 수량", example = "10", minimum = "1")
        @NotNull(message = "수량은 필수 입력값입니다.")
        @Min(value = 1, message = "수량은 1 이상이어야 합니다.")
        private int stockQuantity;
    }
}
