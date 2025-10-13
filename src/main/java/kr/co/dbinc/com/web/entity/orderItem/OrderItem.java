package kr.co.dbinc.com.web.entity.orderItem;

import jakarta.persistence.*;
import kr.co.dbinc.com.web.entity.item.Item;
import kr.co.dbinc.com.web.entity.order.Order;
import lombok.Getter;

@Entity
@Table(name = "order_item")
@Getter
public class OrderItem {

    @Id
    @GeneratedValue
    @Column(name = "order_item_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id")
    private Item item;      //주문 상품

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;    //주문

    private int orderPrice; //주문 가격(스냅샷)
    private int count;      //주문 수량

    public static OrderItem createOrderItem(Item item, int orderPrice, int count) {
        OrderItem orderItem = new OrderItem();
        orderItem.assignItem(item);
        orderItem.assignOrderPrice(orderPrice);
        orderItem.assignCount(count);

        item.removeStock(count);
        return orderItem;
    }

    public void assignItem(Item item) {
        this.item = item;
    }

    public void assignOrder(Order order) {
        this.order = order;
    }
    public void assignOrderPrice(int orderPrice) {
        this.orderPrice = orderPrice;
    }

    public void assignCount(int count) {
        this.count = count;
    }
}
