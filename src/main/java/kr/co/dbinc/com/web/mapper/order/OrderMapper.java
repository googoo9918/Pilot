package kr.co.dbinc.com.web.mapper.order;

import kr.co.dbinc.com.web.dto.order.OrderResponseDto;
import kr.co.dbinc.com.web.entity.order.Order;
import kr.co.dbinc.com.web.entity.orderItem.OrderItem;
import org.mapstruct.Mapper;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    default OrderResponseDto.OrderResponse orderToOrderResponseDto(Order order) {
        if (order == null) {
            return null;
        }

        // items 변환
        List<OrderResponseDto.OrderItemSummary> items = new ArrayList<>();

        if (order.getOrderItems() != null) {
            for (OrderItem oi : order.getOrderItems()) {
                Long itemId = (oi.getItem() != null) ? oi.getItem().getId() : null;
                Long orderItemId = oi.getId();
                int orderPrice = oi.getOrderPrice();
                int count = oi.getCount();

                items.add(OrderResponseDto.OrderItemSummary.builder()
                        .itemId(itemId)
                        .orderItemId(orderItemId)
                        .orderPrice(orderPrice)
                        .count(count)
                        .build());
            }
        }

        return OrderResponseDto.OrderResponse.builder()
                .orderId(order.getId())
                .memberId(order.getMember() != null ? order.getMember().getId() : null)
                .orderStatus(order.getStatus() != null ? order.getStatus().name() : null)
                .orderDate(order.getOrderDate())
                .delivery(order.getDelivery())
                .items(items)
                .build();
    }

    default List<OrderResponseDto.OrderListRow> oderItemListToOrderListRows(List<Order> orders) {
        List<OrderResponseDto.OrderListRow> orderListRows = new ArrayList<>();
        for (Order order : orders) {
            for (OrderItem orderItem : order.getOrderItems()) {
                OrderResponseDto.OrderListRow orderListRow = OrderResponseDto.OrderListRow.builder()
                        .orderItemId(orderItem.getId())
                        .itemId(order.getId())
                        .memberName(order.getMember() != null ? order.getMember().getName() : null)
                        .itemName(orderItem.getItem() != null ? orderItem.getItem().getName() : null)
                        .orderPrice(orderItem.getOrderPrice())
                        .count(orderItem.getCount())
                        .orderStatus(order.getStatus() != null ? order.getStatus().name() : null)
                        .address(order.getDelivery() != null && order.getDelivery().getAddress() != null
                                ? order.getDelivery().getAddress().getStreet() : null)
                        .zipcode(order.getDelivery() != null && order.getDelivery().getAddress() != null
                                ? order.getDelivery().getAddress().getZipcode() : null)
                        .orderDate(order.getOrderDate())
                        .build();

                orderListRows.add(orderListRow);
            }
        }
        return orderListRows;
    }
}
