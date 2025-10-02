package kr.co.dbinc.com.web.entity.item;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import kr.co.dbinc.com.common.error.ErrorCode;
import kr.co.dbinc.com.common.error.exception.BusinessException;
import kr.co.dbinc.com.common.error.exception.DomainException;
import kr.co.dbinc.com.web.dto.item.ItemRequestDto;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Item {
    @Id
    @Column(name = "item_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, length = 10, nullable = false)
    private String name;

    @Column(length = 10, nullable = false)
    @Positive
    private int price;

    @Column(length = 10, nullable = false)
    @Positive
    private int stockQuantity;

    public Item(String name, int price, int stockQuantity) {
        if(name == null || name.isBlank()) throw new DomainException(ErrorCode.INVALID_ITEM_NAME);
        if (price <= 0) throw new DomainException(ErrorCode.INVALID_ITEM_PRICE);
        if (stockQuantity < 0) throw new DomainException(ErrorCode.INVALID_ITEM_QUANTITY);
        this.name = name;
        this.price = price;
        this.stockQuantity = stockQuantity;
    }

    public void addStock(int quantity) {
        this.stockQuantity += quantity;
    }

    public void removeStock(int quantity) {
        int restStock = this.stockQuantity - quantity;
        if (restStock < 0) {
            throw new BusinessException(ErrorCode.ITEM_STOCK_NOT_ENOUGH);
        }
        this.stockQuantity = restStock;
    }

    public void updateByRequest(ItemRequestDto.ItemRequest itemRequest) {
        updateName(itemRequest.getName());
        updatePrice(itemRequest.getPrice());
        updateStockQuantity(itemRequest.getStockQuantity());
    }

    public void updateName(String name) {
        this.name = name;
    }

    public void updatePrice(int price) {
        if (price <= 0) throw new DomainException(ErrorCode.INVALID_ITEM_PRICE);
        this.price = price;
    }

    public void updateStockQuantity(int stockQuantity) {
        if (stockQuantity <= 0) throw new DomainException(ErrorCode.INVALID_ITEM_QUANTITY);
        this.stockQuantity = stockQuantity;
    }
}
