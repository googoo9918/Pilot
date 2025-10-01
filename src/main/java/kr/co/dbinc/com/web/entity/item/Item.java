package kr.co.dbinc.com.web.entity.item;

import jakarta.persistence.*;
import kr.co.dbinc.com.common.error.ErrorCode;
import kr.co.dbinc.com.common.error.exception.BusinessException;
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

    private String name;

    private int price;

    private int stockQuantity;

    public Item(String name, int price, int stockQuantity) {
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
}
